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

app.listen(PORT, () => {
  console.log(`Campaign Hub API running on port ${PORT}`);
});