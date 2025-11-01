import { Suspense } from 'react';
import { db, campaigns, clickEvents } from '@/lib/db';
import { redis, connectRedis, cacheKey } from '@/lib/redis';
import { sql, desc, count } from 'drizzle-orm';
import MetricsGrid from '@/app/components/MetricsGrid';
import CampaignChart from '@/app/components/CampaignChart';

async function getDashboardData() {
  await connectRedis();
  
  const cached = await redis.get(cacheKey('dashboard:metrics'));
  if (cached) return JSON.parse(cached);

  // Mock data for development
  const data = {
    campaigns: { total: 12, active: 8 },
    clicks: { total: 45230, today: 1250 },
    timeSeries: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      clicks: Math.floor(Math.random() * 2000) + 500
    })),
    timestamp: new Date().toISOString()
  };

  await redis.setEx(cacheKey('dashboard:metrics'), 300, JSON.stringify(data));
  return data;
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded"></div>}>
        <MetricsGrid 
          campaigns={data.campaigns}
          clicks={data.clicks}
        />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Campaign Performance</h2>
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded"></div>}>
            <CampaignChart data={data.timeSeries} />
          </Suspense>
        </div>
        
        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded gap-1">
              <span>New campaign created</span>
              <span className="text-sm text-gray-500">2 min ago</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded gap-1">
              <span>A/B test completed</span>
              <span className="text-sm text-gray-500">15 min ago</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded gap-1">
              <span>Report generated</span>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}