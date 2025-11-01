'use client';

interface Competitor {
  id: number;
  name: string;
  url: string | null;
  industry: string | null;
  channels: string[] | null;
  metrics: any;
  status: string | null;
}

interface CompetitorGridProps {
  competitors: Competitor[];
}

export default function CompetitorGrid({ competitors }: CompetitorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {competitors.map((competitor) => {
        const metrics = competitor.metrics as any || {};
        
        return (
          <div key={competitor.id} className="card border-l-4 border-purple-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {competitor.name}
                </h3>
                <p className="text-sm text-gray-500">{competitor.industry}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                competitor.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {competitor.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Ad Spend</p>
                <p className="text-lg font-semibold text-purple-600">
                  ₹{(metrics.adSpend || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Traffic</p>
                <p className="text-lg font-semibold text-blue-600">
                  {((metrics.estimatedTraffic || 0) / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {(competitor.channels || []).map((channel, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {channel.replace('-', ' ')}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row gap-2">
              <button className="btn-secondary text-sm flex-1">View Details</button>
              <button className="btn-primary text-sm flex-1">Analyze</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}