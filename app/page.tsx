import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-10 md:py-20 px-4 bg-white">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
        Welcome to CampaignPulse
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
        Multi-channel marketing campaign analytics dashboard with AI-powered insights, 
        competitor tracking, and real-time performance monitoring.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        <Link href="/dashboard/analytics" className="card hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
          <h3 className="text-lg md:text-xl font-semibold mb-3">📊 Real-time Analytics</h3>
          <p className="text-gray-600 text-sm md:text-base">Track campaign performance across all channels with live updates</p>
        </Link>
        <Link href="/dashboard/competitors" className="card hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
          <h3 className="text-lg md:text-xl font-semibold mb-3">🎯 Competitor Tracking</h3>
          <p className="text-gray-600 text-sm md:text-base">Monitor competitor campaigns and analyze market positioning</p>
        </Link>
        <Link href="/dashboard/autopilot" className="card hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
          <h3 className="text-lg md:text-xl font-semibold mb-3">🤖 AI Insights</h3>
          <p className="text-gray-600 text-sm md:text-base">Get automated recommendations and performance scoring</p>
        </Link>
      </div>
      
      <Link href="/dashboard" className="btn-primary text-base md:text-lg px-6 md:px-8 py-2 md:py-3 inline-block">
        Launch Dashboard
      </Link>
    </div>
  );
}