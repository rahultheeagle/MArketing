'use client';

import { useState, useEffect } from 'react';
import { store } from '@/lib/store';

export default function AnalyticsPage() {
  const [campaigns, setCampaigns] = useState(store.getCampaigns());
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('clicks');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCampaigns(store.getCampaigns());
    });
    return unsubscribe;
  }, []);

  const totalMetrics = {
    clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
    conversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
    spent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    budget: campaigns.reduce((sum, c) => sum + c.budget, 0)
  };

  const conversionRate = totalMetrics.clicks > 0 ? (totalMetrics.conversions / totalMetrics.clicks * 100).toFixed(2) : '0.00';
  const avgCPC = totalMetrics.clicks > 0 ? (totalMetrics.spent / totalMetrics.clicks).toFixed(2) : '0.00';
  const budgetUtilization = totalMetrics.budget > 0 ? (totalMetrics.spent / totalMetrics.budget * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="clicks">Clicks</option>
            <option value="conversions">Conversions</option>
            <option value="spent">Spend</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Clicks</h3>
          <div className="text-2xl font-bold text-blue-600">{totalMetrics.clicks.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">↗ +12.5% vs last period</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Conversions</h3>
          <div className="text-2xl font-bold text-green-600">{totalMetrics.conversions}</div>
          <div className="text-xs text-green-600 mt-1">↗ +8.3% vs last period</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Conversion Rate</h3>
          <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
          <div className="text-xs text-red-600 mt-1">↘ -2.1% vs last period</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Avg CPC</h3>
          <div className="text-2xl font-bold text-orange-600">₹{avgCPC}</div>
          <div className="text-xs text-green-600 mt-1">↗ +5.7% vs last period</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
          <div className="space-y-3">
            {campaigns.map((campaign) => {
              const performance = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks * 100).toFixed(1) : '0.0';
              return (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{campaign.name}</div>
                    <div className="text-xs text-gray-500">{campaign.channel}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{performance}%</div>
                    <div className="text-xs text-gray-500">Conv. Rate</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Budget Utilization</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Utilization</span>
              <span className="text-lg font-bold text-blue-600">{budgetUtilization}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(parseFloat(budgetUtilization), 100)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Total Budget</div>
                <div className="font-bold">₹{totalMetrics.budget.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-500">Total Spent</div>
                <div className="font-bold">₹{totalMetrics.spent.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Channel Performance Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Channel</th>
                <th className="text-left p-3">Campaigns</th>
                <th className="text-left p-3">Clicks</th>
                <th className="text-left p-3">Conversions</th>
                <th className="text-left p-3">Spend</th>
                <th className="text-left p-3">CPC</th>
                <th className="text-left p-3">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                campaigns.reduce((acc, campaign) => {
                  const channel = campaign.channel || 'Unknown';
                  if (!acc[channel]) {
                    acc[channel] = { campaigns: 0, clicks: 0, conversions: 0, spent: 0 };
                  }
                  acc[channel].campaigns += 1;
                  acc[channel].clicks += campaign.clicks;
                  acc[channel].conversions += campaign.conversions;
                  acc[channel].spent += campaign.spent;
                  return acc;
                }, {} as Record<string, any>)
              ).map(([channel, data]) => {
                const cpc = data.clicks > 0 ? (data.spent / data.clicks).toFixed(2) : '0.00';
                const convRate = data.clicks > 0 ? (data.conversions / data.clicks * 100).toFixed(1) : '0.0';
                return (
                  <tr key={channel} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{channel}</td>
                    <td className="p-3">{data.campaigns}</td>
                    <td className="p-3">{data.clicks.toLocaleString()}</td>
                    <td className="p-3">{data.conversions}</td>
                    <td className="p-3">₹{data.spent.toLocaleString()}</td>
                    <td className="p-3">₹{cpc}</td>
                    <td className="p-3">{convRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}