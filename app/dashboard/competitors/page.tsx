'use client';

import { useState } from 'react';
import CompetitorGrid from '@/app/components/CompetitorGrid';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState([
    {
      id: 1,
      name: 'TechRival Corp',
      url: 'https://techrival.com',
      industry: 'SaaS',
      channels: ['google-ads', 'linkedin', 'email'],
      metrics: { adSpend: 3712500, estimatedTraffic: 125000 },
      status: 'active',
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'MarketLeader Inc',
      url: 'https://marketleader.com',
      industry: 'E-commerce',
      channels: ['google-ads', 'facebook', 'instagram'],
      metrics: { adSpend: 6435000, estimatedTraffic: 280000 },
      status: 'active',
      createdAt: new Date()
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', url: '', industry: '' });
  
  const data = {
    competitors,
    summary: {
      total: competitors.length,
      active: competitors.filter(c => c.status === 'active').length,
      totalSpend: competitors.reduce((sum, c) => {
        const metrics = c.metrics as any;
        return sum + (metrics?.adSpend || 0);
      }, 0)
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Competitor Tracking</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
        >
          {showAddForm ? 'CANCEL' : 'ADD COMPETITOR'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Competitors</h3>
          <div className="text-2xl font-bold text-blue-600">{data.summary.total}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Tracking</h3>
          <div className="text-2xl font-bold text-green-600">{data.summary.active}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Market Spend</h3>
          <div className="text-2xl font-bold text-purple-600">
            ₹{(data.summary.totalSpend / 100000).toFixed(1)}L
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Add New Competitor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Competitor Name"
              value={newCompetitor.name}
              onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
              className="p-2 border rounded-md"
            />
            <input
              type="url"
              placeholder="Website URL"
              value={newCompetitor.url}
              onChange={(e) => setNewCompetitor({...newCompetitor, url: e.target.value})}
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Industry"
              value={newCompetitor.industry}
              onChange={(e) => setNewCompetitor({...newCompetitor, industry: e.target.value})}
              className="p-2 border rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (newCompetitor.name && newCompetitor.url && newCompetitor.industry) {
                  const competitor = {
                    id: Date.now(),
                    name: newCompetitor.name,
                    url: newCompetitor.url,
                    industry: newCompetitor.industry,
                    channels: ['google-ads'],
                    metrics: { 
                      adSpend: Math.floor(Math.random() * 5000000) + 1000000, 
                      estimatedTraffic: Math.floor(Math.random() * 200000) + 50000 
                    },
                    status: 'active',
                    createdAt: new Date()
                  };
                  setCompetitors([...competitors, competitor]);
                  setNewCompetitor({ name: '', url: '', industry: '' });
                  setShowAddForm(false);
                } else {
                  alert('Please fill all fields!');
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Competitor
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCompetitor({ name: '', url: '', industry: '' });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <CompetitorGrid competitors={data.competitors} />
    </div>
  );
}