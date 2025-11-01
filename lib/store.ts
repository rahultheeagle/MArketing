'use client';

export interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'paused';
  budget: number;
  spent: number;
  clicks: number;
  conversions: number;
  channel?: string;
  createdAt: Date;
}

export interface Competitor {
  id: number;
  name: string;
  url: string;
  industry: string;
  channels: string[];
  metrics: { adSpend: number; estimatedTraffic: number };
  status: 'active' | 'paused';
  createdAt: Date;
}

let campaigns: Campaign[] = [
  { id: 1, name: 'Google Ads - Black Friday', status: 'active', budget: 660000, spent: 512600, clicks: 15420, conversions: 234, channel: 'Google Ads', createdAt: new Date() },
  { id: 2, name: 'Facebook - Holiday Sale', status: 'active', budget: 495000, spent: 396000, clicks: 12350, conversions: 189, channel: 'Facebook', createdAt: new Date() },
  { id: 3, name: 'Email Newsletter', status: 'paused', budget: 206250, spent: 99000, clicks: 8900, conversions: 156, channel: 'Email', createdAt: new Date() },
  { id: 4, name: 'Instagram - Product Launch', status: 'active', budget: 330000, spent: 256300, clicks: 9800, conversions: 98, channel: 'Instagram', createdAt: new Date() }
];

let competitors: Competitor[] = [
  {
    id: 1,
    name: 'TechRival Corp',
    url: 'https://techrival.com',
    industry: 'SaaS',
    channels: ['google-ads', 'linkedin', 'email'],
    metrics: { adSpend: 3712500, estimatedTraffic: 125000 },
    status: 'active',
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'MarketLeader Inc',
    url: 'https://marketleader.com',
    industry: 'E-commerce',
    channels: ['google-ads', 'facebook', 'instagram'],
    metrics: { adSpend: 6435000, estimatedTraffic: 280000 },
    status: 'active',
    createdAt: new Date()
  }
];

let subscribers: Array<() => void> = [];

export const store = {
  // Campaign CRUD
  getCampaigns: () => campaigns,
  addCampaign: (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign = { ...campaign, id: Date.now() };
    campaigns = [...campaigns, newCampaign];
    subscribers.forEach(callback => callback());
  },
  updateCampaign: (id: number, updates: Partial<Campaign>) => {
    campaigns = campaigns.map(c => c.id === id ? { ...c, ...updates } : c);
    subscribers.forEach(callback => callback());
  },
  deleteCampaign: (id: number) => {
    campaigns = campaigns.filter(c => c.id !== id);
    subscribers.forEach(callback => callback());
  },
  
  // Competitor CRUD
  getCompetitors: () => competitors,
  addCompetitor: (competitor: Omit<Competitor, 'id'>) => {
    const newCompetitor = { ...competitor, id: Date.now() };
    competitors = [...competitors, newCompetitor];
    subscribers.forEach(callback => callback());
  },
  updateCompetitor: (id: number, updates: Partial<Competitor>) => {
    competitors = competitors.map(c => c.id === id ? { ...c, ...updates } : c);
    subscribers.forEach(callback => callback());
  },
  deleteCompetitor: (id: number) => {
    competitors = competitors.filter(c => c.id !== id);
    subscribers.forEach(callback => callback());
  },
  
  // Legacy methods for backward compatibility
  updateCampaigns: (newCampaigns: Campaign[]) => {
    campaigns = [...newCampaigns];
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