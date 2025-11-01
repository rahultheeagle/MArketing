import { Suspense } from 'react';

const mockReports = [
  { id: 1, name: 'Weekly Performance Summary', type: 'performance', frequency: 'weekly', status: 'active', lastRun: '2024-01-15', nextRun: '2024-01-22' },
  { id: 2, name: 'Monthly ROI Analysis', type: 'roi', frequency: 'monthly', status: 'active', lastRun: '2024-01-01', nextRun: '2024-02-01' },
  { id: 3, name: 'Competitor Intelligence', type: 'competitor', frequency: 'weekly', status: 'paused', lastRun: '2024-01-08', nextRun: '2024-01-15' },
  { id: 4, name: 'Campaign Optimization', type: 'optimization', frequency: 'daily', status: 'active', lastRun: '2024-01-16', nextRun: '2024-01-17' }
];

const reportTemplates = [
  { name: 'Performance Report', description: 'Campaign metrics and KPIs', icon: '📊' },
  { name: 'ROI Analysis', description: 'Revenue and cost analysis', icon: '💰' },
  { name: 'Competitor Report', description: 'Market intelligence', icon: '🎯' },
  { name: 'A/B Test Results', description: 'Testing outcomes', icon: '🧪' }
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reports</h1>
        <button className="btn-primary w-full md:w-auto">Create Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Reports</h3>
          <div className="text-xl md:text-2xl font-bold text-blue-600">{mockReports.length}</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active</h3>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {mockReports.filter(r => r.status === 'active').length}
          </div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">This Month</h3>
          <div className="text-xl md:text-2xl font-bold text-purple-600">24</div>
        </div>
        <div className="metric-card">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Scheduled</h3>
          <div className="text-xl md:text-2xl font-bold text-orange-600">8</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Scheduled Reports</h2>
          <div className="space-y-3">
            {mockReports.map((report) => (
              <div key={report.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border rounded">
                <div className="mb-2 md:mb-0">
                  <div className="font-medium">{report.name}</div>
                  <div className="text-sm text-gray-500">
                    {report.frequency} • {report.type}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                  <div className="flex gap-1">
                    <button className="btn-secondary text-xs px-2 py-1">Edit</button>
                    <button className="btn-primary text-xs px-2 py-1">Run</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Report Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportTemplates.map((template, index) => (
              <div key={index} className="p-4 border rounded hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="text-2xl mb-2">{template.icon}</div>
                <div className="font-medium mb-1">{template.name}</div>
                <div className="text-sm text-gray-500 mb-3">{template.description}</div>
                <button className="btn-primary text-xs w-full">Use Template</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Reports</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 md:p-3">Report Name</th>
                <th className="text-left p-2 md:p-3">Type</th>
                <th className="text-left p-2 md:p-3">Generated</th>
                <th className="text-left p-2 md:p-3">Status</th>
                <th className="text-left p-2 md:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 md:p-3 font-medium">{report.name}</td>
                  <td className="p-2 md:p-3">{report.type}</td>
                  <td className="p-2 md:p-3">{report.lastRun}</td>
                  <td className="p-2 md:p-3">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Completed
                    </span>
                  </td>
                  <td className="p-2 md:p-3">
                    <div className="flex flex-col md:flex-row gap-1">
                      <button className="btn-secondary text-xs px-2 py-1">Download</button>
                      <button className="btn-primary text-xs px-2 py-1">View</button>
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