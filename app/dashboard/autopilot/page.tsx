'use client';

import { useState, useEffect } from 'react';
import { store } from '@/lib/store';

interface AutomationRule {
  id: number;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused';
  lastTriggered?: Date;
  timesTriggered: number;
}

export default function AutopilotPage() {
  const [campaigns, setCampaigns] = useState(store.getCampaigns());
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 1,
      name: 'Pause Low Performing Campaigns',
      trigger: 'Conversion rate < 1% for 3 days',
      action: 'Pause campaign and send alert',
      status: 'active',
      lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      timesTriggered: 3
    },
    {
      id: 2,
      name: 'Budget Alert',
      trigger: 'Campaign spend > 90% of budget',
      action: 'Send email notification',
      status: 'active',
      lastTriggered: new Date(Date.now() - 6 * 60 * 60 * 1000),
      timesTriggered: 12
    },
    {
      id: 3,
      name: 'Increase Budget for High Performers',
      trigger: 'ROI > 300% for 2 days',
      action: 'Increase budget by 20%',
      status: 'paused',
      timesTriggered: 0
    }
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: '',
    action: ''
  });

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCampaigns(store.getCampaigns());
    });
    return unsubscribe;
  }, []);

  const handleCreateRule = () => {
    if (newRule.name && newRule.trigger && newRule.action) {
      const rule: AutomationRule = {
        id: Date.now(),
        name: newRule.name,
        trigger: newRule.trigger,
        action: newRule.action,
        status: 'active',
        timesTriggered: 0
      };
      setRules([...rules, rule]);
      setNewRule({ name: '', trigger: '', action: '' });
      setShowCreateForm(false);
    }
  };

  const handleToggleRule = (id: number) => {
    setRules(rules.map(r => 
      r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r
    ));
  };

  const handleDeleteRule = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  const activeRules = rules.filter(r => r.status === 'active').length;
  const totalTriggers = rules.reduce((sum, r) => sum + r.timesTriggered, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Autopilot Manager</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          {showCreateForm ? 'CANCEL' : 'CREATE RULE'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Rules</h3>
          <div className="text-2xl font-bold text-green-600">{activeRules}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Rules</h3>
          <div className="text-2xl font-bold text-blue-600">{rules.length}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Times Triggered</h3>
          <div className="text-2xl font-bold text-purple-600">{totalTriggers}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Automation Status</h3>
          <div className="text-2xl font-bold text-orange-600">
            {activeRules > 0 ? 'ON' : 'OFF'}
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Create Automation Rule</h2>
          <div className="space-y-4 mb-4">
            <input
              type="text"
              placeholder="Rule Name"
              value={newRule.name}
              onChange={(e) => setNewRule({...newRule, name: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Trigger Condition</label>
                <select
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select trigger...</option>
                  <option value="Conversion rate < 1% for 3 days">Low conversion rate</option>
                  <option value="Campaign spend > 90% of budget">High budget usage</option>
                  <option value="ROI > 300% for 2 days">High ROI</option>
                  <option value="CPC > ₹50 for 1 day">High cost per click</option>
                  <option value="No clicks for 24 hours">No activity</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Action</label>
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select action...</option>
                  <option value="Pause campaign and send alert">Pause campaign</option>
                  <option value="Send email notification">Send notification</option>
                  <option value="Increase budget by 20%">Increase budget</option>
                  <option value="Decrease budget by 10%">Decrease budget</option>
                  <option value="Change bid strategy">Change bidding</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreateRule} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Create Rule
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewRule({ name: '', trigger: '', action: '' });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Automation Rules</h2>
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 md:p-3">Rule Name</th>
                <th className="text-left p-2 md:p-3">Trigger</th>
                <th className="text-left p-2 md:p-3">Action</th>
                <th className="text-left p-2 md:p-3">Status</th>
                <th className="text-left p-2 md:p-3">Last Triggered</th>
                <th className="text-left p-2 md:p-3">Times Triggered</th>
                <th className="text-left p-2 md:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-medium">{rule.name}</td>
                  <td className="p-2 md:p-3 text-xs">{rule.trigger}</td>
                  <td className="p-2 md:p-3 text-xs">{rule.action}</td>
                  <td className="p-2 md:p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rule.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="p-2 md:p-3 text-xs">
                    {rule.lastTriggered ? rule.lastTriggered.toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-2 md:p-3">{rule.timesTriggered}</td>
                  <td className="p-2 md:p-3">
                    <div className="flex flex-wrap gap-1">
                      <button 
                        onClick={() => handleToggleRule(rule.id)}
                        className={`px-2 py-1 rounded text-xs ${
                          rule.status === 'active' 
                            ? 'bg-orange-600 text-white hover:bg-orange-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {rule.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDeleteRule(rule.id, rule.name)}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Budget Alert Triggered</div>
                <div className="text-xs text-gray-500">Facebook - Holiday Sale campaign reached 90% budget</div>
                <div className="text-xs text-gray-400">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Campaign Paused</div>
                <div className="text-xs text-gray-500">Email Newsletter campaign paused due to low performance</div>
                <div className="text-xs text-gray-400">1 day ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Budget Increased</div>
                <div className="text-xs text-gray-500">Google Ads campaign budget increased by 20%</div>
                <div className="text-xs text-gray-400">3 days ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Automation Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Autopilot</div>
                <div className="text-sm text-gray-500">Allow automated actions on campaigns</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-500">Get notified when rules trigger</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Require Approval</div>
                <div className="text-sm text-gray-500">Manual approval for budget changes</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Check Frequency</label>
              <select className="w-full p-2 border rounded-md">
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30" selected>Every 30 minutes</option>
                <option value="60">Every hour</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}