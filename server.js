const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for campaigns and UTM links
let campaigns = [];
let utmLinks = [];

// Get all campaigns
app.get('/api/campaigns', (req, res) => {
  res.json(campaigns);
});

// Create new campaign
app.post('/api/campaigns', (req, res) => {
  const { name, channels, budget, startDate, endDate } = req.body;
  
  const campaign = {
    id: uuidv4(),
    name,
    channels,
    budget,
    startDate,
    endDate,
    status: 'active',
    createdAt: new Date().toISOString(),
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0
    }
  };
  
  campaigns.push(campaign);
  res.status(201).json(campaign);
});

// Update campaign metrics
app.put('/api/campaigns/:id/metrics', (req, res) => {
  const { id } = req.params;
  const { impressions, clicks, conversions, spend } = req.body;
  
  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  campaign.metrics = { impressions, clicks, conversions, spend };
  res.json(campaign);
});

// UTM Links endpoints
app.get('/api/utm-links', (req, res) => {
  res.json(utmLinks);
});

app.post('/api/utm-links', (req, res) => {
  const { url, source, medium, campaign, term, content } = req.body;
  
  const utmLink = {
    id: uuidv4(),
    url,
    source,
    medium,
    campaign,
    term: term || '',
    content: content || '',
    createdAt: new Date().toISOString(),
    clicks: 0,
    conversions: 0,
    revenue: 0
  };
  
  utmLinks.push(utmLink);
  res.status(201).json(utmLink);
});

// Track UTM click
app.post('/api/utm-links/:id/track', (req, res) => {
  const { id } = req.params;
  const { type, value } = req.body; // type: 'click', 'conversion', 'revenue'
  
  const utmLink = utmLinks.find(u => u.id === id);
  if (!utmLink) {
    return res.status(404).json({ error: 'UTM link not found' });
  }
  
  if (type === 'click') utmLink.clicks += 1;
  if (type === 'conversion') utmLink.conversions += 1;
  if (type === 'revenue') utmLink.revenue += value || 0;
  
  res.json(utmLink);
});

// Auto-generate UTM links for campaign
app.post('/api/utm-links/auto-generate', (req, res) => {
  const { baseUrl, campaignName, channels, contentVariations } = req.body;
  
  const channelConfig = {
    'google-ads': { source: 'google', medium: 'cpc' },
    'facebook': { source: 'facebook', medium: 'social' },
    'instagram': { source: 'instagram', medium: 'social' },
    'linkedin': { source: 'linkedin', medium: 'social' },
    'email': { source: 'newsletter', medium: 'email' },
    'twitter': { source: 'twitter', medium: 'social' }
  };
  
  const generatedLinks = [];
  
  channels.forEach(channel => {
    const config = channelConfig[channel];
    if (!config) return;
    
    if (contentVariations && contentVariations.length > 0) {
      contentVariations.forEach(content => {
        const utmLink = createUtmLink(baseUrl, config.source, config.medium, campaignName, '', content);
        generatedLinks.push(utmLink);
      });
    } else {
      const utmLink = createUtmLink(baseUrl, config.source, config.medium, campaignName, '', '');
      generatedLinks.push(utmLink);
    }
  });
  
  utmLinks.push(...generatedLinks);
  res.json(generatedLinks);
});

function createUtmLink(baseUrl, source, medium, campaign, term, content) {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', campaign.toLowerCase().replace(/\s+/g, '_'));
  if (term) url.searchParams.set('utm_term', term);
  if (content) url.searchParams.set('utm_content', content);
  
  return {
    id: uuidv4(),
    url: url.toString(),
    source,
    medium,
    campaign,
    term: term || '',
    content: content || '',
    createdAt: new Date().toISOString(),
    clicks: 0,
    conversions: 0,
    revenue: 0
  };
}

// Get performance analytics
app.get('/api/utm-analytics', (req, res) => {
  const analytics = {
    totalLinks: utmLinks.length,
    totalClicks: utmLinks.reduce((sum, link) => sum + link.clicks, 0),
    totalConversions: utmLinks.reduce((sum, link) => sum + link.conversions, 0),
    totalRevenue: utmLinks.reduce((sum, link) => sum + link.revenue, 0),
    topPerformers: utmLinks
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(link => ({
        url: link.url,
        source: link.source,
        medium: link.medium,
        clicks: link.clicks,
        conversions: link.conversions,
        revenue: link.revenue
      }))
  };
  
  res.json(analytics);
});

// Real-time analytics data
let realTimeMetrics = {
  totalClicks: 0,
  totalConversions: 0,
  totalRevenue: 0,
  hourlyData: [],
  channelData: {
    'Google Ads': { clicks: 0, conversions: 0, revenue: 0 },
    'Facebook': { clicks: 0, conversions: 0, revenue: 0 },
    'Instagram': { clicks: 0, conversions: 0, revenue: 0 },
    'Email': { clicks: 0, conversions: 0, revenue: 0 },
    'LinkedIn': { clicks: 0, conversions: 0, revenue: 0 }
  },
  recentActivity: []
};

// Get real-time analytics
app.get('/api/real-time-analytics', (req, res) => {
  // Simulate real-time data updates
  const clicksIncrease = Math.floor(Math.random() * 10) + 1;
  const conversionsIncrease = Math.floor(Math.random() * 3);
  const revenueIncrease = Math.floor(Math.random() * 150) + 10;
  
  realTimeMetrics.totalClicks += clicksIncrease;
  realTimeMetrics.totalConversions += conversionsIncrease;
  realTimeMetrics.totalRevenue += revenueIncrease;
  
  // Update channel data
  Object.keys(realTimeMetrics.channelData).forEach(channel => {
    realTimeMetrics.channelData[channel].clicks += Math.floor(Math.random() * 3);
    realTimeMetrics.channelData[channel].conversions += Math.floor(Math.random() * 1);
    realTimeMetrics.channelData[channel].revenue += Math.floor(Math.random() * 30);
  });
  
  // Add hourly data point
  const now = new Date();
  realTimeMetrics.hourlyData.push({
    time: now.toISOString(),
    clicks: realTimeMetrics.totalClicks,
    conversions: realTimeMetrics.totalConversions,
    revenue: realTimeMetrics.totalRevenue
  });
  
  // Keep only last 24 hours of data
  if (realTimeMetrics.hourlyData.length > 24) {
    realTimeMetrics.hourlyData.shift();
  }
  
  // Add recent activity
  const activities = [
    'New click from Google Ads campaign',
    'Conversion from Facebook ad',
    'Email newsletter click',
    'Instagram story engagement',
    'LinkedIn sponsored content click'
  ];
  
  if (Math.random() > 0.4) {
    realTimeMetrics.recentActivity.unshift({
      text: activities[Math.floor(Math.random() * activities.length)],
      timestamp: now.toISOString(),
      value: Math.floor(Math.random() * 100) + 10
    });
    
    // Keep only last 50 activities
    if (realTimeMetrics.recentActivity.length > 50) {
      realTimeMetrics.recentActivity = realTimeMetrics.recentActivity.slice(0, 50);
    }
  }
  
  const conversionRate = realTimeMetrics.totalClicks > 0 ? 
    ((realTimeMetrics.totalConversions / realTimeMetrics.totalClicks) * 100).toFixed(2) : 0;
  
  res.json({
    ...realTimeMetrics,
    conversionRate,
    timestamp: now.toISOString()
  });
});

// WebSocket-like endpoint for live updates
app.get('/api/live-metrics', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const sendUpdate = () => {
    const data = {
      clicks: realTimeMetrics.totalClicks + Math.floor(Math.random() * 5),
      conversions: realTimeMetrics.totalConversions + Math.floor(Math.random() * 2),
      revenue: realTimeMetrics.totalRevenue + Math.floor(Math.random() * 50),
      timestamp: new Date().toISOString()
    };
    
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  
  // Send initial data
  sendUpdate();
  
  // Send updates every 3 seconds
  const interval = setInterval(sendUpdate, 3000);
  
  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Initialize real-time metrics with some sample data
setInterval(() => {
  // Simulate background activity
  realTimeMetrics.totalClicks += Math.floor(Math.random() * 3);
  realTimeMetrics.totalConversions += Math.floor(Math.random() * 1);
  realTimeMetrics.totalRevenue += Math.floor(Math.random() * 25);
}, 10000); // Update every 10 seconds

app.listen(PORT, () => {
  console.log(`Campaign Hub API running on port ${PORT}`);
  console.log(`Real-time Analytics available at http://localhost:${PORT}`);
});