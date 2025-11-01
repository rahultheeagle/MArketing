'use client';

import { useState, useEffect } from 'react';
import { store } from '@/lib/store';

interface Report {
  id: number;
  name: string;
  type: 'weekly' | 'monthly' | 'custom';
  format: 'pdf' | 'excel' | 'csv';
  status: 'scheduled' | 'generating' | 'completed' | 'failed';
  lastGenerated: Date;
  nextScheduled?: Date;
}

export default function ReportsPage() {
  const [campaigns, setCampaigns] = useState(store.getCampaigns());
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      name: 'Weekly Performance Report',
      type: 'weekly',
      format: 'pdf',
      status: 'completed',
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextScheduled: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'Monthly Campaign Analysis',
      type: 'monthly',
      format: 'excel',
      status: 'scheduled',
      lastGenerated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      nextScheduled: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    }
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    type: 'weekly' as 'weekly' | 'monthly' | 'custom',
    format: 'pdf' as 'pdf' | 'excel' | 'csv'
  });

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCampaigns(store.getCampaigns());
    });
    return unsubscribe;
  }, []);

  const handleCreateReport = () => {
    if (newReport.name) {
      const report: Report = {
        id: Date.now(),
        name: newReport.name,
        type: newReport.type,
        format: newReport.format,
        status: 'scheduled',
        lastGenerated: new Date(),
        nextScheduled: new Date(Date.now() + (newReport.type === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000)
      };
      setReports([...reports, report]);
      setNewReport({ name: '', type: 'weekly', format: 'pdf' });
      setShowCreateForm(false);
    }
  };

  const handleGenerateReport = (id: number) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, status: 'generating' } : r
    ));
    
    setTimeout(() => {
      setReports(reports.map(r => 
        r.id === id ? { ...r, status: 'completed', lastGenerated: new Date() } : r
      ));
    }, 2000);
  };

  const handleDeleteReport = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reports Manager</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          {showCreateForm ? 'CANCEL' : 'CREATE REPORT'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Reports</h3>
          <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Scheduled</h3>
          <div className="text-2xl font-bold text-yellow-600">
            {reports.filter(r => r.status === 'scheduled').length}
          </div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Completed</h3>
          <div className="text-2xl font-bold text-green-600">
            {reports.filter(r => r.status === 'completed').length}
          </div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">This Month</h3>
          <div className="text-2xl font-bold text-purple-600">
            {reports.filter(r => r.lastGenerated.getMonth() === new Date().getMonth()).length}
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Create New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Report Name"
              value={newReport.name}
              onChange={(e) => setNewReport({...newReport, name: e.target.value})}
              className="p-2 border rounded-md"
            />
            <select
              value={newReport.type}
              onChange={(e) => setNewReport({...newReport, type: e.target.value as any})}
              className="p-2 border rounded-md"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
            <select
              value={newReport.format}
              onChange={(e) => setNewReport({...newReport, format: e.target.value as any})}
              className="p-2 border rounded-md"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreateReport} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Create Report
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewReport({ name: '', type: 'weekly', format: 'pdf' });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Report List</h2>
        <div className="min-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 md:p-3">Report Name</th>
                <th className="text-left p-2 md:p-3">Type</th>
                <th className="text-left p-2 md:p-3">Format</th>
                <th className="text-left p-2 md:p-3">Status</th>
                <th className="text-left p-2 md:p-3">Last Generated</th>
                <th className="text-left p-2 md:p-3">Next Scheduled</th>
                <th className="text-left p-2 md:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-medium">{report.name}</td>
                  <td className="p-2 md:p-3">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                      {report.type}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full uppercase">
                      {report.format}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">{report.lastGenerated.toLocaleDateString()}</td>
                  <td className="p-2 md:p-3">
                    {report.nextScheduled ? report.nextScheduled.toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-2 md:p-3">
                    <div className="flex flex-wrap gap-1">
                      <button 
                        onClick={() => handleGenerateReport(report.id)}
                        disabled={report.status === 'generating'}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                      >
                        {report.status === 'generating' ? 'Generating...' : 'Generate'}
                      </button>
                      <button 
                        onClick={() => alert(`Downloading ${report.name}.${report.format}`)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Download
                      </button>
                      <button 
                        onClick={() => handleDeleteReport(report.id, report.name)}
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
          <h2 className="text-lg font-semibold mb-4">Quick Export</h2>
          <div className="space-y-3">
            <button 
              onClick={() => alert('Exporting current campaign data...')}
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
            >
              <div className="font-medium">Export All Campaigns</div>
              <div className="text-sm text-gray-500">Current campaign performance data</div>
            </button>
            <button 
              onClick={() => alert('Exporting analytics data...')}
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
            >
              <div className="font-medium">Export Analytics</div>
              <div className="text-sm text-gray-500">Detailed performance metrics</div>
            </button>
            <button 
              onClick={() => alert('Exporting competitor data...')}
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
            >
              <div className="font-medium">Export Competitor Data</div>
              <div className="text-sm text-gray-500">Competitor tracking information</div>
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Report Templates</h2>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="font-medium">Executive Summary</div>
              <div className="text-sm text-gray-500">High-level overview for stakeholders</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium">Detailed Performance</div>
              <div className="text-sm text-gray-500">Comprehensive campaign analysis</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium">ROI Analysis</div>
              <div className="text-sm text-gray-500">Return on investment breakdown</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}