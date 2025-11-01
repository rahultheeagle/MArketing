import { NextRequest, NextResponse } from 'next/server';
import { db, clickEvents, campaigns } from '@/lib/db';
import { redis, connectRedis, cacheKey, rateLimitKey } from '@/lib/redis';
import { sql, desc, count, sum, avg } from 'drizzle-orm';

async function checkRateLimit(ip: string, endpoint: string) {
  const key = rateLimitKey(ip, endpoint);
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, 60);
  }
  return current <= 100; // 100 requests per minute
}

export async function GET(request: NextRequest) {
  const ip = request.ip || 'unknown';
  
  if (!await checkRateLimit(ip, 'analytics')) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  await connectRedis();
  const cached = await redis.get(cacheKey('analytics:summary'));
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }

  const [summary] = await db.select({
    totalClicks: count(clickEvents.id),
    totalCampaigns: sql<number>`(select count(*) from campaigns)`,
    avgClicksPerCampaign: avg(sql<number>`
      (select count(*) from click_events ce where ce.campaign_id = campaigns.id)
    `),
    topSource: sql<string>`
      (select utm_source from click_events 
       group by utm_source 
       order by count(*) desc 
       limit 1)
    `
  }).from(clickEvents);

  const timeSeriesData = await db.select({
    date: sql<string>`date(timestamp)`,
    clicks: count(),
    campaigns: sql<number>`count(distinct campaign_id)`
  })
  .from(clickEvents)
  .groupBy(sql`date(timestamp)`)
  .orderBy(desc(sql`date(timestamp)`))
  .limit(30);

  const result = { summary, timeSeries: timeSeriesData };
  await redis.setEx(cacheKey('analytics:summary'), 300, JSON.stringify(result));
  
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown';
  
  if (!await checkRateLimit(ip, 'track')) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json();
  
  const [event] = await db.insert(clickEvents).values({
    campaignId: body.campaignId,
    utmSource: body.utmSource,
    utmMedium: body.utmMedium,
    utmCampaign: body.utmCampaign,
    userAgent: request.headers.get('user-agent'),
    ipAddress: ip,
    metadata: body.metadata || {}
  }).returning();

  await connectRedis();
  await redis.del(cacheKey('analytics:summary'));
  await redis.publish('metrics:update', JSON.stringify(event));

  return NextResponse.json({ success: true, eventId: event.id });
}