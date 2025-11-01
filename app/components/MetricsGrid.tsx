'use client';

import { useState, useEffect } from 'react';

interface MetricsGridProps {
  campaigns: { total: number; active: number };
  clicks: { total: number; today: number };
}

export default function MetricsGrid({ campaigns, clicks }: MetricsGridProps) {
  const [renderKey, setRenderKey] = useState(0);
  
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [campaigns.total, campaigns.active, clicks.total, clicks.today]);
  const metrics = [
    {
      title: 'Total Campaigns',
      value: campaigns.total,
      change: '+12%',
      color: 'text-gray-900'
    },
    {
      title: 'Active Campaigns',
      value: campaigns.active,
      change: '+5%',
      color: 'text-green-700'
    },
    {
      title: 'Total Clicks',
      value: clicks.total.toLocaleString(),
      change: '+23%',
      color: 'text-blue-700'
    },
    {
      title: 'Today\'s Clicks',
      value: clicks.today.toLocaleString(),
      change: '+8%',
      color: 'text-orange-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" key={renderKey}>
      {metrics.map((metric, index) => (
        <div key={`${metric.title}-${metric.value}`} className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{metric.title}</h3>
          <div className={`text-2xl font-bold ${metric.color} mb-1`}>
            {metric.value}
          </div>
          <div className="text-sm text-green-700 font-medium">{metric.change}</div>
        </div>
      ))}
    </div>
  );
}