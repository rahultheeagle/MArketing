import { NextRequest, NextResponse } from 'next/server';
import { db, campaigns } from '@/lib/db';
import { redis, connectRedis, cacheKey, pubSubChannels } from '@/lib/redis';

export async function GET() {
  await connectRedis();
  
  const cached = await redis.get(cacheKey('campaigns:all'));
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  const result = await db.select().from(campaigns);
  
  await redis.setEx(cacheKey('campaigns:all'), 300, JSON.stringify(result));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const [newCampaign] = await db.insert(campaigns).values({
    name: body.name,
    channels: body.channels,
    budget: body.budget,
    metadata: body.metadata || {}
  }).returning();

  await connectRedis();
  await redis.del(cacheKey('campaigns:all'));
  await redis.publish(pubSubChannels.CAMPAIGN_EVENT, JSON.stringify({
    type: 'created',
    campaign: newCampaign
  }));

  return NextResponse.json(newCampaign, { status: 201 });
}