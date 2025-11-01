'use client';

import { useState, useEffect } from 'react';
import { store, Competitor } from '@/lib/store';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState(store.getCompetitors());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', url: '', industry: '' });
  
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCompetitors(store.getCompetitors());
    });
    return unsubscribe;
  }, []);

  const handleAddCompetitor = () => {
    if (newCompetitor.name && newCompetitor.url && newCompetitor.industry) {
      store.addCompetitor({
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
      });
      setNewCompetitor({ name: '', url: '', industry: '' });
      setShowAddForm(false);
    }
  };

  const handleUpdateCompetitor = () => {
    if (editingCompetitor && editingCompetitor.name && editingCompetitor.url && editingCompetitor.industry) {
      store.updateCompetitor(editingCompetitor.id, {
        name: editingCompetitor.name,
        url: editingCompetitor.url,
        industry: editingCompetitor.industry
      });
      setEditingCompetitor(null);
    }
  };

  const handleDeleteCompetitor = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      store.deleteCompetitor(id);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Competitor Manager</h1>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingCompetitor(null);
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          {showAddForm ? 'CANCEL' : 'ADD COMPETITOR'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Competitors</h3>
          <div className="text-2xl font-bold text-blue-600">{competitors.length}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Tracking</h3>
          <div className="text-2xl font-bold text-green-600">{competitors.filter(c => c.status === 'active').length}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Market Spend</h3>
          <div className="text-2xl font-bold text-purple-600">
            ₹{(competitors.reduce((sum, c) => sum + c.metrics.adSpend, 0) / 100000).toFixed(1)}L
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
            <button onClick={handleAddCompetitor} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
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

      {editingCompetitor && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Edit Competitor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Competitor Name"
              value={editingCompetitor.name}
              onChange={(e) => setEditingCompetitor({...editingCompetitor, name: e.target.value})}
              className="p-2 border rounded-md"
            />
            <input
              type="url"
              placeholder="Website URL"
              value={editingCompetitor.url}
              onChange={(e) => setEditingCompetitor({...editingCompetitor, url: e.target.value})}
              className="p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Industry"
              value={editingCompetitor.industry}
              onChange={(e) => setEditingCompetitor({...editingCompetitor, industry: e.target.value})}
              className="p-2 border rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleUpdateCompetitor} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Update Competitor
            </button>
            <button
              onClick={() => setEditingCompetitor(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Competitor List</h2>
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 md:p-3">Company</th>
                <th className="text-left p-2 md:p-3">Industry</th>
                <th className="text-left p-2 md:p-3">Website</th>
                <th className="text-left p-2 md:p-3">Ad Spend</th>
                <th className="text-left p-2 md:p-3">Traffic</th>
                <th className="text-left p-2 md:p-3">Status</th>
                <th className="text-left p-2 md:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor) => (
                <tr key={competitor.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-medium">{competitor.name}</td>
                  <td className="p-2 md:p-3">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {competitor.industry}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">
                    <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                      {competitor.url.replace('https://', '').substring(0, 20)}...
                    </a>
                  </td>
                  <td className="p-2 md:p-3">₹{(competitor.metrics.adSpend / 100000).toFixed(1)}L</td>
                  <td className="p-2 md:p-3">{(competitor.metrics.estimatedTraffic / 1000).toFixed(0)}K</td>
                  <td className="p-2 md:p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      competitor.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {competitor.status}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">
                    <div className="flex flex-wrap gap-1">
                      <button 
                        onClick={() => store.updateCompetitor(competitor.id, { 
                          status: competitor.status === 'active' ? 'paused' : 'active' 
                        })}
                        className={`px-2 py-1 rounded text-xs ${
                          competitor.status === 'active' 
                            ? 'bg-orange-600 text-white hover:bg-orange-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {competitor.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingCompetitor(competitor);
                          setShowAddForm(false);
                        }}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCompetitor(competitor.id, competitor.name)}
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