'use client';

export interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'paused';
  budget: number;
  spent: number;
  clicks: number;
  conversions: number;
}

let campaigns: Campaign[] = [
  { id: 1, name: 'Google Ads - Black Friday', status: 'active', budget: 660000, spent: 512600, clicks: 15420, conversions: 234 },
  { id: 2, name: 'Facebook - Holiday Sale', status: 'active', budget: 495000, spent: 396000, clicks: 12350, conversions: 189 },
  { id: 3, name: 'Email Newsletter', status: 'paused', budget: 206250, spent: 99000, clicks: 8900, conversions: 156 },
  { id: 4, name: 'Instagram - Product Launch', status: 'active', budget: 330000, spent: 256300, clicks: 9800, conversions: 98 }
];

let subscribers: Array<() => void> = [];

export const store = {
  getCampaigns: () => campaigns,
  
  updateCampaigns: (newCampaigns: Campaign[]) => {
    campaigns = newCampaigns;
    subscribers.forEach(callback => callback());
  },
  
  subscribe: (callback: () => void) => {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(sub => sub !== callback);
    };
  },
  
  getMetrics: () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const todayClicks = Math.floor(totalClicks * 0.15);
    
    return {
      totalCampaigns,
      activeCampaigns,
      totalClicks,
      todayClicks
    };
  },
  
  updateCampaignClicks: () => {
    campaigns = campaigns.map(campaign => ({
      ...campaign,
      clicks: campaign.clicks + Math.floor(Math.random() * 20) + 5,
      spent: Math.min(campaign.budget, campaign.spent + Math.floor(Math.random() * 1000) + 200)
    }));
    subscribers.forEach(callback => callback());
  }
};