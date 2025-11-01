'use client';

import { useState } from 'react';

interface Plan {
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  const plans: Plan[] = [
    {
      name: 'Starter',
      price: billingPeriod === 'monthly' ? 2475 : 24750,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      features: [
        'Up to 3 campaigns',
        'Basic analytics',
        'Email support',
        '1 user account',
        'Standard integrations'
      ],
      current: true
    },
    {
      name: 'Professional',
      price: billingPeriod === 'monthly' ? 8250 : 82500,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      features: [
        'Up to 25 campaigns',
        'Advanced analytics',
        'Priority support',
        '5 user accounts',
        'All integrations',
        'Automation rules',
        'Custom reports'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: billingPeriod === 'monthly' ? 20625 : 206250,
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      features: [
        'Unlimited campaigns',
        'Real-time analytics',
        '24/7 phone support',
        'Unlimited users',
        'Custom integrations',
        'Advanced automation',
        'White-label reports',
        'Dedicated account manager'
      ]
    }
  ];

  const [usage] = useState({
    campaigns: 2,
    campaignLimit: 3,
    users: 1,
    userLimit: 1,
    apiCalls: 15420,
    apiLimit: 25000,
    storage: 1.2,
    storageLimit: 5
  });

  const handleUpgrade = (planName: string) => {
    alert(`Upgrading to ${planName} plan...`);
  };

  const handleDowngrade = (planName: string) => {
    if (confirm(`Are you sure you want to downgrade to ${planName}?`)) {
      alert(`Downgrading to ${planName} plan...`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 mb-6">Scale your marketing campaigns with the right plan for your business</p>
        
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm ${billingPeriod === 'monthly' ? 'font-semibold' : 'text-gray-500'}`}>
            Monthly
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={billingPeriod === 'yearly'}
              onChange={(e) => setBillingPeriod(e.target.checked ? 'yearly' : 'monthly')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span className={`text-sm ${billingPeriod === 'yearly' ? 'font-semibold' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingPeriod === 'yearly' && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Save 17%
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative rounded-lg border-2 p-6 ${
              plan.popular 
                ? 'border-blue-500 shadow-lg' 
                : plan.current 
                  ? 'border-green-500' 
                  : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₹{plan.price.toLocaleString()}
              </div>
              <div className="text-gray-500">per {plan.period}</div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              {plan.current ? (
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium">
                  Current Plan
                </button>
              ) : (
                <button 
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full py-2 px-4 rounded-md font-medium ${
                    plan.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.name === 'Starter' ? 'Downgrade' : 'Upgrade'} to {plan.name}
                </button>
              )}
              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Current Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Campaigns</span>
              <span className="text-sm text-gray-500">{usage.campaigns} / {usage.campaignLimit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(usage.campaigns / usage.campaignLimit) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Users</span>
              <span className="text-sm text-gray-500">{usage.users} / {usage.userLimit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(usage.users / usage.userLimit) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">API Calls</span>
              <span className="text-sm text-gray-500">{usage.apiCalls.toLocaleString()} / {usage.apiLimit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${(usage.apiCalls / usage.apiLimit) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Storage</span>
              <span className="text-sm text-gray-500">{usage.storage} GB / {usage.storageLimit} GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full" 
                style={{ width: `${(usage.storage / usage.storageLimit) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Billing History</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Starter Plan</div>
                <div className="text-xs text-gray-500">January 2024</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">₹2,475</div>
                <div className="text-xs text-green-600">Paid</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Starter Plan</div>
                <div className="text-xs text-gray-500">December 2023</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">₹2,475</div>
                <div className="text-xs text-green-600">Paid</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm">Starter Plan</div>
                <div className="text-xs text-gray-500">November 2023</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">₹2,475</div>
                <div className="text-xs text-green-600">Paid</div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Invoices
          </button>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">•••• •••• •••• 4242</div>
                <div className="text-xs text-gray-500">Expires 12/25</div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700">
                Update Payment Method
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-50">
                Add New Card
              </button>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Next billing date</span>
                <span className="text-sm font-medium">Feb 15, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Amount</span>
                <span className="text-sm font-medium">₹2,475</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Can I change my plan anytime?</h3>
            <p className="text-sm text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">What happens if I exceed my limits?</h3>
            <p className="text-sm text-gray-600">We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional resources as needed.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Is there a free trial?</h3>
            <p className="text-sm text-gray-600">Yes, all new accounts get a 14-day free trial with full access to Professional plan features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}