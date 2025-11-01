import CompetitorGrid from '@/app/components/CompetitorGrid';

const competitorList = [
  {
    id: 1,
    name: 'TechRival Corp',
    url: 'https://techrival.com',
    industry: 'SaaS',
    channels: ['google-ads', 'linkedin', 'email'],
    metrics: { adSpend: 3712500, estimatedTraffic: 125000 },
    status: 'active',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'MarketLeader Inc',
    url: 'https://marketleader.com',
    industry: 'E-commerce',
    channels: ['google-ads', 'facebook', 'instagram'],
    metrics: { adSpend: 6435000, estimatedTraffic: 280000 },
    status: 'active',
    createdAt: new Date()
  }
];

const competitorData = {
  competitors: competitorList,
  summary: {
    total: competitorList.length,
    active: competitorList.filter(c => c.status === 'active').length,
    totalSpend: competitorList.reduce((sum, c) => {
      const metrics = c.metrics as any;
      return sum + (metrics?.adSpend || 0);
    }, 0)
  }
};

export default function CompetitorsPage() {
  const data = competitorData;

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
            ₹{(data.summary.totalSpend / 100000).toFixed(1)}L
          </div>
        </div>
      </div>

      <CompetitorGrid competitors={data.competitors} />
    </div>
  );
}