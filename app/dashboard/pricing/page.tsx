'use client';

import { useState } from 'react';

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [campaignsUsed] = useState(2);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: 'forever',
      campaigns: '3 campaigns',
      features: [
        'Basic analytics',
        'Email integration',
        'Standard reports',
        'Community support'
      ],
      limitations: ['Limited to 3 campaigns', 'Basic insights only']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹2,400',
      period: 'month',
      campaigns: 'Unlimited campaigns',
      features: [
        'Advanced analytics',
        'All integrations',
        'AI insights',
        'Autopilot features',
        'Custom reports',
        'Priority support'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹8,200',
      period: 'month',
      campaigns: 'Unlimited campaigns',
      features: [
        'Everything in Pro',
        'White-label dashboard',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Team collaboration'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">💰 Pricing Plans</h1>
        <p className="text-gray-600">Start free, upgrade when you grow</p>
      </div>

      {currentPlan === 'free' && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Free Plan Usage:</span>
              <span className="ml-2">{campaignsUsed}/3 campaigns used</span>
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${(campaignsUsed / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`bg-white p-6 rounded-lg shadow border-2 ${
              plan.popular ? 'border-blue-500 relative' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-1">
                {plan.price}
                <span className="text-lg text-gray-600">/{plan.period}</span>
              </div>
              <p className="text-sm text-gray-600">{plan.campaigns}</p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
              {plan.limitations?.map((limitation, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-500">
                  <span>⚠️</span>
                  <span className="text-sm">{limitation}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setCurrentPlan(plan.id)}
              className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                currentPlan === plan.id
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? 'Current Plan' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">🎯 Why Small Businesses Choose CampaignPulse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-red-500 mt-1">❌</span>
            <div>
              <strong>Before:</strong> Juggling 5+ different dashboards (Google Analytics, Facebook Ads, Mailchimp, etc.)
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-1">✅</span>
            <div>
              <strong>After:</strong> One unified dashboard with AI-powered insights and automation
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg text-center">
        <h3 className="text-lg font-semibold mb-2">💡 ROI Calculator</h3>
        <p className="text-gray-700 mb-4">
          Save 10+ hours/week managing campaigns = ₹41,500+ monthly value for small businesses
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Time Saved:</strong> 10 hours/week
          </div>
          <div>
            <strong>Cost Savings:</strong> ₹41,500+/month
          </div>
          <div>
            <strong>ROI:</strong> 1,700% on Pro plan
          </div>
        </div>
      </div>
    </div>
  );
}