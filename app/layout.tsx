import './globals.css';

export const metadata = {
  title: 'CampaignPulse - Marketing Analytics Dashboard',
  description: 'Multi-channel marketing campaign analytics with AI insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        <nav className="bg-gray-900 text-white p-4 shadow-lg">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a href="/" className="text-xl md:text-2xl font-bold mb-2 md:mb-0 hover:text-blue-400 transition-colors">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2">CP</span>
              CampaignPulse
            </a>
            <div className="flex flex-wrap gap-2 md:gap-4">
              <a href="/dashboard" className="px-3 py-1 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors">Dashboard</a>
              <a href="/dashboard/competitors" className="px-3 py-1 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors">Competitors</a>
              <a href="/dashboard/campaigns" className="px-3 py-1 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors">Campaigns</a>
              <a href="/dashboard/analytics" className="px-3 py-1 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors">Analytics</a>
              <a href="/dashboard/reports" className="px-3 py-1 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors">Reports</a>
              <a href="/dashboard/integrations" className="px-3 py-1 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors">Integrations</a>
              <a href="/dashboard/autopilot" className="px-3 py-1 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors">Autopilot</a>
              <a href="/dashboard/pricing" className="px-3 py-1 rounded-md hover:bg-gray-800 hover:text-blue-400 transition-colors">Pricing</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-6 bg-gray-50 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}