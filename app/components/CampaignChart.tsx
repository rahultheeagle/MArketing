'use client';

interface CampaignChartProps {
  data: Array<{ date: string; clicks: number }>;
}

export default function CampaignChart({ data }: CampaignChartProps) {
  const maxClicks = Math.max(...data.map(d => d.clicks));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = (item.clicks / maxClicks) * 100;
        return (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600">
              {new Date(item.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-medium">{item.clicks}</div>
          </div>
        );
      })}
    </div>
  );
}