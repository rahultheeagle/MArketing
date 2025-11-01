'use client';

import { useState, useEffect } from 'react';
import { store, Campaign } from '@/lib/store';

// Updated: 2024-01-15 - Full CRUD System
export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(store.getCampaigns());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({ name: '', budget: 0, channel: 'Google Ads' });
  
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newCampaigns = store.getCampaigns();
      setCampaigns(newCampaigns);
      setLastUpdated(new Date());
    });
    
    const interval = setInterval(() => {
      store.updateCampaignClicks();
    }, 3000);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleCreateCampaign = () => {
    if (newCampaign.name && newCampaign.budget > 0) {
      store.addCampaign({
        name: newCampaign.name,
        status: 'active',
        budget: newCampaign.budget,
        spent: 0,
        clicks: Math.floor(Math.random() * 1000),
        conversions: Math.floor(Math.random() * 50),
        channel: newCampaign.channel,
        createdAt: new Date()
      });
      setNewCampaign({ name: '', budget: 0, channel: 'Google Ads' });
      setShowCreateForm(false);
    }
  };

  const handleUpdateCampaign = () => {
    if (editingCampaign && editingCampaign.name && editingCampaign.budget > 0) {
      store.updateCampaign(editingCampaign.id, {
        name: editingCampaign.name,
        budget: editingCampaign.budget,
        channel: editingCampaign.channel
      });
      setEditingCampaign(null);
    }
  };

  const handleDeleteCampaign = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      store.deleteCampaign(id);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Campaign Manager</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="text-sm text-gray-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <button 
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingCampaign(null);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            {showCreateForm ? 'CANCEL' : 'CREATE CAMPAIGN'}
          </button>
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

      {showCreateForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Create New Campaign</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Campaign Name"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
              className="p-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Budget (₹)"
              value={newCampaign.budget}
              onChange={(e) => setNewCampaign({...newCampaign, budget: Number(e.target.value)})}
              className="p-2 border rounded-md"
            />
            <select
              value={newCampaign.channel}
              onChange={(e) => setNewCampaign({...newCampaign, channel: e.target.value})}
              className="p-2 border rounded-md"
            >
              <option value="Google Ads">Google Ads</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Email">Email</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreateCampaign} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Create Campaign
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewCampaign({ name: '', budget: 0, channel: 'Google Ads' });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingCampaign && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Edit Campaign</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Campaign Name"
              value={editingCampaign.name}
              onChange={(e) => setEditingCampaign({...editingCampaign, name: e.target.value})}
              className="p-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Budget (₹)"
              value={editingCampaign.budget}
              onChange={(e) => setEditingCampaign({...editingCampaign, budget: Number(e.target.value)})}
              className="p-2 border rounded-md"
            />
            <select
              value={editingCampaign.channel || 'Google Ads'}
              onChange={(e) => setEditingCampaign({...editingCampaign, channel: e.target.value})}
              className="p-2 border rounded-md"
            >
              <option value="Google Ads">Google Ads</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Email">Email</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleUpdateCampaign} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Update Campaign
            </button>
            <button
              onClick={() => setEditingCampaign(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Campaign List</h2>
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 md:p-3">Campaign</th>
                <th className="text-left p-2 md:p-3">Channel</th>
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
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {campaign.channel || 'N/A'}
                    </span>
                  </td>
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
                    <div className="flex flex-wrap gap-1">
                      <button 
                        onClick={() => store.updateCampaign(campaign.id, { 
                          status: campaign.status === 'active' ? 'paused' : 'active' 
                        })}
                        className={`px-2 py-1 rounded text-xs ${
                          campaign.status === 'active' 
                            ? 'bg-orange-600 text-white hover:bg-orange-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingCampaign(campaign);
                          setShowCreateForm(false);
                        }}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                      >
                        Delete
                      </button>
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