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

const getPlatformIcon = (platform: string) => {
  const iconClass = "w-8 h-8";
  switch (platform) {
    case 'google':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
    case 'facebook':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
    case 'instagram':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="url(#instagram-gradient)"><defs><linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#833AB4"/><stop offset="50%" stopColor="#FD1D1D"/><stop offset="100%" stopColor="#FCB045"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    case 'linkedin':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    case 'youtube':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case 'twitter':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="#1DA1F2"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>;
    case 'tiktok':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="#000000"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>;
    case 'snapchat':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="#FFFC00"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/></svg>;
    case 'pinterest':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="#BD081C"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/></svg>;
    case 'analytics':
      return <svg className={iconClass} viewBox="0 0 24 24" fill="#FF6D01"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;
    default:
      return <div className={`${iconClass} bg-gray-300 rounded flex items-center justify-center text-gray-600 font-bold text-xs`}>{platform.charAt(0).toUpperCase()}</div>;
  }
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 1,
      name: 'Google Ads',
      platform: 'google-ads',
      status: 'connected',
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      dataPoints: 15420,
      icon: 'google'
    },
    {
      id: 2,
      name: 'Facebook Ads',
      platform: 'facebook',
      status: 'connected',
      lastSync: new Date(Date.now() - 45 * 60 * 1000),
      dataPoints: 12350,
      icon: 'facebook'
    },
    {
      id: 3,
      name: 'Instagram Business',
      platform: 'instagram',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      dataPoints: 9800,
      icon: 'instagram'
    },
    {
      id: 4,
      name: 'LinkedIn Ads',
      platform: 'linkedin',
      status: 'error',
      lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000),
      dataPoints: 5600,
      icon: 'linkedin'
    }
  ]);

  const [availableIntegrations] = useState([
    { name: 'YouTube Ads', platform: 'youtube', icon: 'youtube' },
    { name: 'Twitter Ads', platform: 'twitter', icon: 'twitter' },
    { name: 'TikTok Ads', platform: 'tiktok', icon: 'tiktok' },
    { name: 'Snapchat Ads', platform: 'snapchat', icon: 'snapchat' },
    { name: 'Pinterest Ads', platform: 'pinterest', icon: 'pinterest' },
    { name: 'Google Analytics', platform: 'analytics', icon: 'analytics' }
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
                  <div className="w-10 h-10 flex items-center justify-center">{getPlatformIcon(integration.icon)}</div>
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
                <div>Last sync: {integration.lastSync.toLocaleString('en-US')}</div>
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
                <div className="w-10 h-10 flex items-center justify-center">{getPlatformIcon(integration.icon)}</div>
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