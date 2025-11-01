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
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">🎯 CampaignPulse</h1>
            <div className="flex flex-wrap gap-2 md:gap-4">
              <a href="/dashboard" className="px-3 py-1 rounded hover:bg-white/20 transition-colors">Dashboard</a>
              <a href="/dashboard/competitors" className="px-3 py-1 rounded hover:bg-white/20 transition-colors">Competitors</a>
              <a href="/dashboard/campaigns" className="px-3 py-1 rounded hover:bg-white/20 transition-colors">Campaigns</a>
              <a href="/dashboard/analytics" className="px-3 py-1 rounded hover:bg-white/20 transition-colors">Analytics</a>
              <a href="/dashboard/reports" className="px-3 py-1 rounded hover:bg-white/20 transition-colors">Reports</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}