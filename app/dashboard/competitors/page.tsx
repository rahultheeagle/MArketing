import { Suspense } from 'react';
import { db, competitors } from '@/lib/db';
import { redis, connectRedis, cacheKey } from '@/lib/redis';
import { desc } from 'drizzle-orm';
import CompetitorGrid from '@/app/components/CompetitorGrid';

async function getCompetitorData() {
  await connectRedis();
  
  const cached = await redis.get(cacheKey('competitors:dashboard'));
  if (cached) return JSON.parse(cached);

  // Mock competitor data for development
  const competitorList = [
    {
      id: 1,
      name: 'TechRival Corp',
      url: 'https://techrival.com',
      industry: 'SaaS',
      channels: ['google-ads', 'linkedin', 'email'],
      metrics: { adSpend: 45000, estimatedTraffic: 125000 },
      status: 'active',
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'MarketLeader Inc',
      url: 'https://marketleader.com',
      industry: 'E-commerce',
      channels: ['google-ads', 'facebook', 'instagram'],
      metrics: { adSpend: 78000, estimatedTraffic: 280000 },
      status: 'active',
      createdAt: new Date()
    }
  ];

  const data = {
    competitors: competitorList,
    summary: {
      total: competitorList.length,
      active: competitorList.filter(c => c.status === 'active').length,
      totalSpend: competitorList.reduce((sum, c) => {
        const metrics = c.metrics as any;
        return sum + (metrics?.adSpend || 0);
      }, 0)
    },
    timestamp: new Date().toISOString()
  };

  await redis.setEx(cacheKey('competitors:dashboard'), 180, JSON.stringify(data));
  return data;
}

export default async function CompetitorsPage() {
  const data = await getCompetitorData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Competitor Tracking</h1>
        <button className="btn-primary w-full md:w-auto">Add Competitor</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Competitors</h3>
          <div className="text-2xl font-bold text-blue-600">{data.summary.total}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Tracking</h3>
          <div className="text-2xl font-bold text-green-600">{data.summary.active}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Market Spend</h3>
          <div className="text-2xl font-bold text-purple-600">
            ${(data.summary.totalSpend / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded"></div>}>
        <CompetitorGrid competitors={data.competitors} />
      </Suspense>
    </div>
  );
}