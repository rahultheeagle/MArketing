'use client';

import { useState } from 'react';

interface Integration {
  id: number;
  name: string;
  platform: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  dataPoints: number;
  icon: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 1,
      name: 'Google Ads',
      platform: 'google-ads',
      status: 'connected',
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      dataPoints: 15420,
      icon: '🔍'
    },
    {
      id: 2,
      name: 'Facebook Ads',
      platform: 'facebook',
      status: 'connected',
      lastSync: new Date(Date.now() - 45 * 60 * 1000),
      dataPoints: 12350,
      icon: '📘'
    },
    {
      id: 3,
      name: 'Instagram Business',
      platform: 'instagram',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      dataPoints: 9800,
      icon: '📷'
    },
    {
      id: 4,
      name: 'LinkedIn Ads',
      platform: 'linkedin',
      status: 'error',
      lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000),
      dataPoints: 5600,
      icon: '💼'
    }
  ]);

  const [availableIntegrations] = useState([
    { name: 'YouTube Ads', platform: 'youtube', icon: '📺' },
    { name: 'Twitter Ads', platform: 'twitter', icon: '🐦' },
    { name: 'TikTok Ads', platform: 'tiktok', icon: '🎵' },
    { name: 'Snapchat Ads', platform: 'snapchat', icon: '👻' },
    { name: 'Pinterest Ads', platform: 'pinterest', icon: '📌' },
    { name: 'Google Analytics', platform: 'analytics', icon: '📊' }
  ]);

  const handleConnect = (platform: string, name: string, icon: string) => {
    const newIntegration: Integration = {
      id: Date.now(),
      name,
      platform,
      status: 'connected',
      lastSync: new Date(),
      dataPoints: Math.floor(Math.random() * 10000) + 1000,
      icon
    };
    setIntegrations([...integrations, newIntegration]);
  };

  const handleDisconnect = (id: number, name: string) => {
    if (confirm(`Are you sure you want to disconnect ${name}?`)) {
      setIntegrations(integrations.map(i => 
        i.id === id ? { ...i, status: 'disconnected' as const } : i
      ));
    }
  };

  const handleReconnect = (id: number) => {
    setIntegrations(integrations.map(i => 
      i.id === id ? { ...i, status: 'connected' as const, lastSync: new Date() } : i
    ));
  };

  const handleSync = (id: number) => {
    setIntegrations(integrations.map(i => 
      i.id === id ? { 
        ...i, 
        lastSync: new Date(), 
        dataPoints: i.dataPoints + Math.floor(Math.random() * 100) + 10 
      } : i
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalDataPoints = integrations.reduce((sum, i) => sum + i.dataPoints, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Integrations Manager</h1>
        <button 
          onClick={() => alert('Syncing all connected integrations...')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          SYNC ALL
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Connected</h3>
          <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Available</h3>
          <div className="text-2xl font-bold text-blue-600">{availableIntegrations.length}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Data Points</h3>
          <div className="text-2xl font-bold text-purple-600">{totalDataPoints.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Last Sync</h3>
          <div className="text-2xl font-bold text-orange-600">
            {Math.min(...integrations.map(i => Date.now() - i.lastSync.getTime())) < 60000 ? 'Now' : '1m ago'}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Connected Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-sm text-gray-500">{integration.platform}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>Last sync: {integration.lastSync.toLocaleString()}</div>
                <div>Data points: {integration.dataPoints.toLocaleString()}</div>
              </div>

              <div className="flex gap-2">
                {integration.status === 'connected' && (
                  <>
                    <button 
                      onClick={() => handleSync(integration.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Sync
                    </button>
                    <button 
                      onClick={() => handleDisconnect(integration.id, integration.name)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Disconnect
                    </button>
                  </>
                )}
                {integration.status === 'disconnected' && (
                  <button 
                    onClick={() => handleReconnect(integration.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                  >
                    Reconnect
                  </button>
                )}
                {integration.status === 'error' && (
                  <button 
                    onClick={() => handleReconnect(integration.id)}
                    className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700"
                  >
                    Fix Connection
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableIntegrations
            .filter(available => !integrations.some(connected => connected.platform === available.platform))
            .map((integration) => (
            <div key={integration.platform} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <div className="font-medium">{integration.name}</div>
                  <div className="text-sm text-gray-500">{integration.platform}</div>
                </div>
              </div>
              
              <button 
                onClick={() => handleConnect(integration.platform, integration.name, integration.icon)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Sync Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto Sync</div>
                <div className="text-sm text-gray-500">Automatically sync data every hour</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Real-time Updates</div>
                <div className="text-sm text-gray-500">Push updates immediately</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sync Frequency</label>
              <select className="w-full p-2 border rounded-md">
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60" selected>Every hour</option>
                <option value="360">Every 6 hours</option>
                <option value="1440">Daily</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Data Usage</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">API Calls This Month</span>
              <span className="font-bold">24,567 / 50,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '49%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Data Storage</span>
              <span className="font-bold">2.3 GB / 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>

            <div className="pt-4 border-t">
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}