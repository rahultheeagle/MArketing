'use client';

import { useState, useEffect } from 'react';
import MetricsGrid from '@/app/components/MetricsGrid';
import CampaignChart from '@/app/components/CampaignChart';
import { store } from '@/lib/store';

export default function DashboardPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activities, setActivities] = useState([
    { text: 'New campaign created', time: 2, id: 1 },
    { text: 'A/B test completed', time: 15, id: 2 },
    { text: 'Report generated', time: 60, id: 3 }
  ]);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [metrics, setMetrics] = useState(store.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      
      // Update activity times
      setActivities(prev => prev.map(activity => ({
        ...activity,
        time: activity.time + 0.033 // Increment by 2 seconds
      })));
      
      setUpdateCounter(prev => prev + 1);
      setForceUpdate(prev => prev + 1);
      
      // Update campaign data in store
      store.updateCampaignClicks();
      
      // Get updated metrics from store
      const newMetrics = store.getMetrics();
      setMetrics(newMetrics);
      console.log('Updated metrics from store:', newMetrics);
      
      // Occasionally add new activities
      if (Math.random() < 0.3) {
        const newActivities = [
          'Campaign optimized',
          'New lead captured', 
          'Email sent',
          'Click recorded',
          'Conversion tracked'
        ];
        const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
        
        setActivities(prev => [
          { text: randomActivity, time: 0.033 },
          ...prev.slice(0, 2)
        ]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (minutes) => {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${Math.floor(minutes)} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  const dashboardData = {
    campaigns: { total: metrics.totalCampaigns, active: metrics.activeCampaigns },
    clicks: { total: metrics.totalClicks, today: metrics.todayClicks },
    timeSeries: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      clicks: Math.floor(Math.random() * 2000) + 500
    }))
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <MetricsGrid 
        key={forceUpdate}
        campaigns={dashboardData.campaigns}
        clicks={dashboardData.clicks}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Campaign Performance</h2>
          <CampaignChart data={dashboardData.timeSeries} />
        </div>
        
        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 bg-gray-50 rounded gap-1 transition-all">
                <span>{activity.text}</span>
                <span className="text-sm text-gray-500">{formatTime(activity.time)} ({updateCounter})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}