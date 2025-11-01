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
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Real-time Analytics</h3>
          </div>
          <p className="text-gray-600 text-sm md:text-base">Track campaign performance across all channels with live updates</p>
        </Link>
        <Link href="/dashboard/competitors" className="card hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold">Competitor Tracking</h3>
          </div>
          <p className="text-gray-600 text-sm md:text-base">Monitor competitor campaigns and analyze market positioning</p>
        </Link>
        <Link href="/dashboard/autopilot" className="card hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold">AI Insights</h3>
          </div>
          <p className="text-gray-600 text-sm md:text-base">Get automated recommendations and performance scoring</p>
        </Link>
      </div>
      
      <Link href="/dashboard" className="btn-primary text-base md:text-lg px-6 md:px-8 py-2 md:py-3 inline-block">
        Launch Dashboard
      </Link>
    </div>
  );
}