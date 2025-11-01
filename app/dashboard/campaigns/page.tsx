'use client';

import { useState, useEffect } from 'react';
import { store } from '@/lib/store';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(store.getCampaigns());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCampaigns(store.getCampaigns());
      setLastUpdated(new Date());
    });
    
    const interval = setInterval(() => {
      store.updateCampaignClicks();
    }, 2000);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Campaigns</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="text-sm text-gray-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <button className="btn-primary">Create Campaign</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Campaigns</h3>
          <div className="text-xl md:text-2xl font-bold text-gray-900">{campaigns.length}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active</h3>
          <div className="text-xl md:text-2xl font-bold text-green-700">
            {campaigns.filter(c => c.status === 'active').length}
          </div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Budget</h3>
          <div className="text-xl md:text-2xl font-bold text-blue-700">
            ₹{campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
          </div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Spent</h3>
          <div className="text-xl md:text-2xl font-bold text-orange-700">
            ₹{campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Campaign List</h2>
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 md:p-3">Campaign</th>
                <th className="text-left p-2 md:p-3">Status</th>
                <th className="text-left p-2 md:p-3">Budget</th>
                <th className="text-left p-2 md:p-3">Spent</th>
                <th className="text-left p-2 md:p-3">Clicks</th>
                <th className="text-left p-2 md:p-3">Conversions</th>
                <th className="text-left p-2 md:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-medium">{campaign.name}</td>
                  <td className="p-2 md:p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">₹{campaign.budget.toLocaleString()}</td>
                  <td className="p-2 md:p-3">₹{campaign.spent.toLocaleString()}</td>
                  <td className="p-2 md:p-3">{campaign.clicks.toLocaleString()}</td>
                  <td className="p-2 md:p-3">{campaign.conversions}</td>
                  <td className="p-2 md:p-3">
                    <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                      <button className="btn-secondary text-xs px-2 py-1">Edit</button>
                      <button className="btn-primary text-xs px-2 py-1">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}