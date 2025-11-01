import MetricsGrid from '@/app/components/MetricsGrid';
import CampaignChart from '@/app/components/CampaignChart';

const dashboardData = {
  campaigns: { total: 12, active: 8 },
  clicks: { total: 45230, today: 1250 },
  timeSeries: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clicks: Math.floor(Math.random() * 2000) + 500
  })),
  timestamp: new Date().toISOString()
};

export default function DashboardPage() {
  const data = dashboardData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <MetricsGrid 
        campaigns={data.campaigns}
        clicks={data.clicks}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Campaign Performance</h2>
          <CampaignChart data={data.timeSeries} />
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