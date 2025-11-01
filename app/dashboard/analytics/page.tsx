

const mockAnalytics = {
  totalClicks: 45230,
  totalConversions: 1250,
  conversionRate: 2.76,
  avgCPC: 1.25,
  topSources: [
    { source: 'Google Ads', clicks: 18500, conversions: 520 },
    { source: 'Facebook', clicks: 12300, conversions: 380 },
    { source: 'Email', clicks: 8900, conversions: 250 },
    { source: 'Instagram', clicks: 5530, conversions: 100 }
  ]
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <button className="btn-secondary">Export Data</button>
          <button className="btn-primary">Generate Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Clicks</h3>
          <div className="text-xl md:text-2xl font-bold text-blue-600">
            {mockAnalytics.totalClicks.toLocaleString()}
          </div>
          <div className="text-sm text-green-600">+12% vs last month</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Conversions</h3>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {mockAnalytics.totalConversions.toLocaleString()}
          </div>
          <div className="text-sm text-green-600">+8% vs last month</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Conversion Rate</h3>
          <div className="text-xl md:text-2xl font-bold text-purple-600">
            {mockAnalytics.conversionRate}%
          </div>
          <div className="text-sm text-green-600">+0.3% vs last month</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg CPC</h3>
          <div className="text-xl md:text-2xl font-bold text-orange-600">
            ${mockAnalytics.avgCPC}
          </div>
          <div className="text-sm text-red-600">+$0.05 vs last month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {mockAnalytics.topSources.map((source, index) => {
              const conversionRate = ((source.conversions / source.clicks) * 100).toFixed(2);
              const percentage = (source.clicks / mockAnalytics.totalClicks * 100).toFixed(1);
              
              return (
                <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded">
                  <div className="mb-2 md:mb-0">
                    <div className="font-medium">{source.source}</div>
                    <div className="text-sm text-gray-500">
                      {source.clicks.toLocaleString()} clicks • {source.conversions} conversions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-purple-600">{percentage}%</div>
                    <div className="text-sm text-gray-500">{conversionRate}% CR</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded">
              <div className="mb-1 md:mb-0">
                <span className="font-medium">High conversion spike detected</span>
                <div className="text-sm text-gray-500">Google Ads campaign</div>
              </div>
              <span className="text-sm text-gray-500">2 min ago</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded">
              <div className="mb-1 md:mb-0">
                <span className="font-medium">New UTM parameter detected</span>
                <div className="text-sm text-gray-500">Email campaign</div>
              </div>
              <span className="text-sm text-gray-500">15 min ago</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded">
              <div className="mb-1 md:mb-0">
                <span className="font-medium">Budget threshold reached</span>
                <div className="text-sm text-gray-500">Facebook campaign</div>
              </div>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}