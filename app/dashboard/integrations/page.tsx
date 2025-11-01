'use client';

import { useState } from 'react';

export default function IntegrationsPage() {
  const [connections, setConnections] = useState({
    googleAnalytics: false,
    metaAds: false,
    mailchimp: false,
    sendgrid: false
  });

  const handleConnect = (service: string) => {
    setConnections(prev => ({ ...prev, [service]: !prev[service as keyof typeof prev] }));
  };

  const integrations = [
    {
      id: 'googleAnalytics',
      name: 'Google Analytics',
      icon: '📊',
      description: 'Track website traffic and user behavior',
      tier: 'Free API',
      features: ['Real-time data', 'Audience insights', 'Goal tracking']
    },
    {
      id: 'metaAds',
      name: 'Meta Ads',
      icon: '📱',
      description: 'Facebook & Instagram advertising data',
      tier: 'Free Tier',
      features: ['Campaign metrics', 'Audience data', 'Ad performance']
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      icon: '📧',
      description: 'Email marketing campaign analytics',
      tier: 'Free Tier',
      features: ['Open rates', 'Click tracking', 'Subscriber data']
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      icon: '✉️',
      description: 'Email delivery and engagement metrics',
      tier: 'Free Tier',
      features: ['Delivery stats', 'Bounce tracking', 'Event data']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Free Integrations</h1>
        <div className="text-sm text-gray-600">
          {Object.values(connections).filter(Boolean).length} of {integrations.length} connected
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold">{integration.name}</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {integration.tier}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleConnect(integration.id)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  connections[integration.id as keyof typeof connections]
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {connections[integration.id as keyof typeof connections] ? 'Connected' : 'Connect'}
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">{integration.description}</p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-800">Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {integration.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">🔗 Quick Setup</h3>
        <p className="text-gray-700 mb-4">
          All integrations use free API tiers with generous limits for small businesses.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Google Analytics:</strong> 10M hits/month
          </div>
          <div>
            <strong>Meta Ads:</strong> 200 calls/hour
          </div>
          <div>
            <strong>Mailchimp:</strong> 2,000 contacts
          </div>
          <div>
            <strong>SendGrid:</strong> 100 emails/day
          </div>
        </div>
      </div>
    </div>
  );
}