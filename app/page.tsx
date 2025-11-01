import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Campaign<span className="text-blue-600">Pulse</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-light">
            Enterprise marketing analytics platform trusted by 10,000+ businesses worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Analytics Card */}
          <Link href="/dashboard/analytics" className="group block">
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 border border-gray-100">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg transform rotate-12 group-hover:rotate-45 transition-transform duration-500">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                </div>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  REAL-TIME
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
                <p className="text-gray-600 leading-relaxed">Advanced performance tracking with machine learning insights and predictive analytics</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Live Data</span>
                <div className="flex items-center">
                  <span className="mr-2">View Dashboard</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Campaigns Card */}
          <Link href="/dashboard/campaigns" className="group block">
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:-rotate-1 border border-gray-100">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg transform -rotate-12 group-hover:-rotate-45 transition-transform duration-500">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 mb-4">
                  CAMPAIGN MANAGER
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Multi-Channel Campaigns</h3>
                <p className="text-gray-600 leading-relaxed">Create, manage, and optimize campaigns across Google, Facebook, LinkedIn, and more</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Full CRUD</span>
                <div className="flex items-center">
                  <span className="mr-2">Manage Campaigns</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Competitors Card */}
          <Link href="/dashboard/competitors" className="group block">
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 border border-gray-100">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg transform rotate-12 group-hover:rotate-45 transition-transform duration-500">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </div>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-4">
                  COMPETITIVE INTEL
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Market Intelligence</h3>
                <p className="text-gray-600 leading-relaxed">Monitor competitor strategies, ad spend, and market positioning in real-time</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Live Monitoring</span>
                <div className="flex items-center">
                  <span className="mr-2">Track Competitors</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Autopilot Card */}
          <Link href="/dashboard/autopilot" className="group block">
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:-rotate-1 text-white">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg transform -rotate-12 group-hover:-rotate-45 transition-transform duration-500">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 mb-4">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                  AI POWERED
                </div>
                <h3 className="text-2xl font-bold mb-3">Autopilot Engine</h3>
                <p className="text-gray-300 leading-relaxed">Automated campaign optimization with machine learning and smart bidding strategies</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Smart Automation</span>
                <div className="flex items-center">
                  <span className="mr-2">Enable Autopilot</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Reports Card */}
          <Link href="/dashboard/reports" className="group block">
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 border border-gray-100">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg transform rotate-12 group-hover:rotate-45 transition-transform duration-500">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                </div>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-4">
                  AUTOMATED REPORTS
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Executive Reports</h3>
                <p className="text-gray-600 leading-relaxed">Scheduled reports with custom branding, white-label options, and executive summaries</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>PDF, Excel, CSV</span>
                <div className="flex items-center">
                  <span className="mr-2">Generate Reports</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Integrations Card */}
          <Link href="/dashboard/integrations" className="group block">
            <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:-rotate-1 border border-gray-100">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg transform -rotate-12 group-hover:-rotate-45 transition-transform duration-500">
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 mb-4">
                  PLATFORM SYNC
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Platform Integrations</h3>
                <p className="text-gray-600 leading-relaxed">Connect with Google Ads, Facebook, LinkedIn, TikTok, and 50+ marketing platforms</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>50+ Platforms</span>
                <div className="flex items-center">
                  <span className="mr-2">Connect Platforms</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="text-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Launch CampaignPulse Dashboard
            <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-gray-500 mt-4 text-sm">Trusted by 10,000+ marketing teams worldwide</p>
          <p className="text-gray-400 mt-2 text-xs">v2.1.0 - Updated: Jan 15, 2024</p>
        </div>
      </div>
    </div>
  );
}