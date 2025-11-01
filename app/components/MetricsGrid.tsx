'use client';

interface MetricsGridProps {
  campaigns: { total: number; active: number };
  clicks: { total: number; today: number };
}

export default function MetricsGrid({ campaigns, clicks }: MetricsGridProps) {
  const metrics = [
    {
      title: 'Total Campaigns',
      value: campaigns.total,
      change: '+12%',
      color: 'text-blue-600'
    },
    {
      title: 'Active Campaigns',
      value: campaigns.active,
      change: '+5%',
      color: 'text-green-600'
    },
    {
      title: 'Total Clicks',
      value: clicks.total.toLocaleString(),
      change: '+23%',
      color: 'text-purple-600'
    },
    {
      title: 'Today\'s Clicks',
      value: clicks.today.toLocaleString(),
      change: '+8%',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{metric.title}</h3>
          <div className={`text-2xl font-bold ${metric.color} mb-1`}>
            {metric.value}
          </div>
          <div className="text-sm text-green-600">{metric.change}</div>
        </div>
      ))}
    </div>
  );
}