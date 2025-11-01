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
        <Link href="/dashboard/analytics" className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-l-4 border-blue-500 hover:shadow-xl hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">LIVE</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Analytics</h3>
          <p className="text-gray-700 text-sm leading-relaxed">Track campaign performance across all channels with live updates</p>
        </Link>
        <Link href="/dashboard/competitors" className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Competitor Tracking</h3>
            <p className="text-gray-700 text-sm leading-relaxed">Monitor competitor campaigns and analyze market positioning</p>
            <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Active Monitoring
            </div>
          </div>
        </Link>
        <Link href="/dashboard/autopilot" className="bg-gray-900 p-6 rounded-3xl text-white hover:bg-gray-800 transition-all cursor-pointer group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-xs text-purple-300 font-medium">POWERED BY</div>
                <div className="text-sm text-white font-bold">AI ENGINE</div>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">AI Insights</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Get automated recommendations and performance scoring</p>
          </div>
        </Link>
      </div>
      
      <Link 
        href="/dashboard" 
        className="btn-primary text-base md:text-lg px-6 md:px-8 py-2 md:py-3 inline-block transform hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
      >
        🚀 Launch Dashboard
      </Link>
    </div>
  );
}