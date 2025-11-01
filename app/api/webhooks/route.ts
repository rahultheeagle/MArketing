import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns, clickEvents } from '@/lib/db';
import { redis, connectRedis, pubSubChannels } from '@/lib/redis';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-webhook-signature');
  const body = await request.json();
  
  // Verify webhook signature (simplified)
  if (!signature || !verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  await connectRedis();

  switch (body.type) {
    case 'campaign.updated':
      await handleCampaignUpdate(body.data);
      break;
    case 'click.tracked':
      await handleClickEvent(body.data);
      break;
    case 'competitor.detected':
      await handleCompetitorUpdate(body.data);
      break;
    default:
      return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

async function handleCampaignUpdate(data: any) {
  await db.update(campaigns)
    .set({
      status: data.status,
      metadata: data.metadata,
      updatedAt: new Date()
    })
    .where(eq(campaigns.id, data.campaignId));

  await redis.publish(pubSubChannels.CAMPAIGN_EVENT, JSON.stringify({
    type: 'updated',
    campaignId: data.campaignId,
    changes: data
  }));
}

async function handleClickEvent(data: any) {
  await db.insert(clickEvents).values({
    campaignId: data.campaignId,
    utmSource: data.source,
    utmMedium: data.medium,
    utmCampaign: data.campaign,
    userAgent: data.userAgent,
    ipAddress: data.ip,
    metadata: data.metadata || {}
  });

  await redis.publish(pubSubChannels.METRICS_UPDATE, JSON.stringify({
    type: 'click',
    campaignId: data.campaignId,
    timestamp: new Date().toISOString()
  }));
}

async function handleCompetitorUpdate(data: any) {
  await redis.publish(pubSubChannels.COMPETITOR_UPDATE, JSON.stringify({
    type: 'metrics_updated',
    competitorId: data.competitorId,
    metrics: data.metrics
  }));
}

function verifySignature(body: any, signature: string): boolean {
  // Simplified signature verification
  const expectedSignature = `sha256=${Buffer.from(JSON.stringify(body)).toString('base64')}`;
  return signature === expectedSignature;
}