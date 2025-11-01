'use client';

import { useState } from 'react';

export default function AutopilotPage() {
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [viralScore, setViralScore] = useState(0);
  const [content, setContent] = useState('');

  const analyzeContent = () => {
    const score = Math.floor(Math.random() * 100) + 1;
    setViralScore(score);
  };

  const suggestions = [
    { time: '2:00 PM', platform: 'Instagram', reason: '34% higher engagement' },
    { time: '9:00 AM', platform: 'LinkedIn', reason: 'Peak B2B activity' },
    { time: '7:00 PM', platform: 'Facebook', reason: 'Evening scroll time' }
  ];

  const budgetAllocation = [
    { channel: 'Facebook Ads', current: '₹16,500', suggested: '₹23,100', change: '+40%' },
    { channel: 'Google Ads', current: '₹24,750', suggested: '₹20,625', change: '-17%' },
    { channel: 'Instagram', current: '₹12,375', suggested: '₹18,150', change: '+47%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🤖 Campaign Autopilot</h1>
        <button
          onClick={() => setAutopilotEnabled(!autopilotEnabled)}
          className={`px-4 py-2 rounded font-medium ${
            autopilotEnabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {autopilotEnabled ? 'Autopilot ON' : 'Enable Autopilot'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">📅 Optimal Posting Times</h2>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <div>
                  <div className="font-medium">{suggestion.platform}</div>
                  <div className="text-sm text-gray-600">{suggestion.reason}</div>
                </div>
                <div className="text-lg font-bold text-blue-600">{suggestion.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">💰 Budget Optimization</h2>
          <div className="space-y-3">
            {budgetAllocation.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-medium">{item.channel}</div>
                  <div className="text-sm text-gray-600">{item.current} → {item.suggested}</div>
                </div>
                <div className={`font-bold ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">🔮 Viral Predictor</h2>
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here to analyze viral potential..."
            className="w-full p-3 border rounded-lg h-32 resize-none"
          />
          <div className="flex justify-between items-center">
            <button
              onClick={analyzeContent}
              disabled={!content.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Analyze Content
            </button>
            {viralScore > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Viral Score:</span>
                <div className={`text-2xl font-bold ${
                  viralScore >= 80 ? 'text-green-600' : 
                  viralScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {viralScore}/100
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">⚡ Auto-Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Pause campaigns below 2% CTR</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Increase budget for 5+ ROAS</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>Schedule posts at peak times</span>
          </div>
        </div>
      </div>
    </div>
  );
}