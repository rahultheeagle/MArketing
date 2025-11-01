import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Welcome to CampaignPulse
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Multi-channel marketing campaign analytics dashboard with AI-powered insights, 
        competitor tracking, and real-time performance monitoring.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        <div className="card">
          <h3 className="text-xl font-semibold mb-3">📊 Real-time Analytics</h3>
          <p className="text-gray-600">Track campaign performance across all channels with live updates</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-3">🎯 Competitor Tracking</h3>
          <p className="text-gray-600">Monitor competitor campaigns and analyze market positioning</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-3">🤖 AI Insights</h3>
          <p className="text-gray-600">Get automated recommendations and performance scoring</p>
        </div>
      </div>
      
      <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
        Launch Dashboard
      </Link>
    </div>
  );
}