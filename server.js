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

// ROI monitoring data
let roiMetrics = {
  totalSpend: 0,
  totalRevenue: 0,
  totalClicks: 0,
  totalConversions: 0,
  campaigns: [
    { id: 1, name: 'Google Ads - Black Friday', spend: 0, revenue: 0, clicks: 0, conversions: 0 },
    { id: 2, name: 'Facebook - Holiday Sale', spend: 0, revenue: 0, clicks: 0, conversions: 0 },
    { id: 3, name: 'Instagram - Product Launch', spend: 0, revenue: 0, clicks: 0, conversions: 0 },
    { id: 4, name: 'Email - Newsletter Campaign', spend: 0, revenue: 0, clicks: 0, conversions: 0 },
    { id: 5, name: 'LinkedIn - B2B Outreach', spend: 0, revenue: 0, clicks: 0, conversions: 0 }
  ]
};

// Get ROI monitoring data
app.get('/api/roi-monitor', (req, res) => {
  // Update metrics with simulated data
  const spendIncrease = Math.floor(Math.random() * 50) + 10;
  const revenueIncrease = Math.floor(Math.random() * 150) + 20;
  const clicksIncrease = Math.floor(Math.random() * 20) + 5;
  const conversionsIncrease = Math.floor(Math.random() * 5) + 1;
  
  roiMetrics.totalSpend += spendIncrease;
  roiMetrics.totalRevenue += revenueIncrease;
  roiMetrics.totalClicks += clicksIncrease;
  roiMetrics.totalConversions += conversionsIncrease;
  
  // Update campaign metrics
  roiMetrics.campaigns.forEach(campaign => {
    campaign.spend += Math.floor(Math.random() * 20) + 5;
    campaign.revenue += Math.floor(Math.random() * 60) + 10;
    campaign.clicks += Math.floor(Math.random() * 10) + 2;
    campaign.conversions += Math.floor(Math.random() * 3);
  });
  
  const netProfit = roiMetrics.totalRevenue - roiMetrics.totalSpend;
  const totalROI = roiMetrics.totalSpend > 0 ? 
    ((netProfit / roiMetrics.totalSpend) * 100).toFixed(2) : 0;
  const conversionRate = roiMetrics.totalClicks > 0 ? 
    ((roiMetrics.totalConversions / roiMetrics.totalClicks) * 100).toFixed(2) : 0;
  
  // Calculate campaign ROIs
  const campaignsWithROI = roiMetrics.campaigns.map(campaign => {
    const campaignProfit = campaign.revenue - campaign.spend;
    const campaignROI = campaign.spend > 0 ? 
      ((campaignProfit / campaign.spend) * 100).toFixed(2) : 0;
    const campaignCR = campaign.clicks > 0 ? 
      ((campaign.conversions / campaign.clicks) * 100).toFixed(2) : 0;
    
    return {
      ...campaign,
      roi: parseFloat(campaignROI),
      profit: campaignProfit,
      conversionRate: parseFloat(campaignCR)
    };
  });
  
  res.json({
    totalSpend: roiMetrics.totalSpend,
    totalRevenue: roiMetrics.totalRevenue,
    totalClicks: roiMetrics.totalClicks,
    totalConversions: roiMetrics.totalConversions,
    netProfit,
    totalROI: parseFloat(totalROI),
    conversionRate: parseFloat(conversionRate),
    campaigns: campaignsWithROI,
    timestamp: new Date().toISOString()
  });
});

// Track specific ROI event
app.post('/api/roi-track', (req, res) => {
  const { campaignId, type, amount } = req.body;
  
  const campaign = roiMetrics.campaigns.find(c => c.id === campaignId);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  switch(type) {
    case 'click':
      campaign.clicks += 1;
      roiMetrics.totalClicks += 1;
      break;
    case 'conversion':
      campaign.conversions += 1;
      roiMetrics.totalConversions += 1;
      if (amount) {
        campaign.revenue += amount;
        roiMetrics.totalRevenue += amount;
      }
      break;
    case 'spend':
      campaign.spend += amount || 0;
      roiMetrics.totalSpend += amount || 0;
      break;
  }
  
  res.json({ success: true, campaign });
});

// Initialize real-time metrics with some sample data
setInterval(() => {
  // Simulate background activity
  realTimeMetrics.totalClicks += Math.floor(Math.random() * 3);
  realTimeMetrics.totalConversions += Math.floor(Math.random() * 1);
  realTimeMetrics.totalRevenue += Math.floor(Math.random() * 25);
}, 10000); // Update every 10 seconds

// Performance Scoring System
let performanceScores = {
  overall: { score: 85, grade: 'Excellent', trend: '+3' },
  categories: {
    roi: { score: 78, weight: 30 },
    engagement: { score: 92, weight: 25 },
    efficiency: { score: 65, weight: 20 },
    quality: { score: 88, weight: 15 },
    reach: { score: 74, weight: 10 }
  },
  campaigns: [],
  factors: [
    { name: 'Return on Investment', weight: 30, score: 78, benchmark: 75 },
    { name: 'Click-through Rate', weight: 20, score: 85, benchmark: 80 },
    { name: 'Conversion Rate', weight: 25, score: 82, benchmark: 75 },
    { name: 'Cost Efficiency', weight: 15, score: 65, benchmark: 70 },
    { name: 'Audience Engagement', weight: 10, score: 92, benchmark: 85 }
  ],
  recommendations: []
};

// Calculate performance score
function calculatePerformanceScore(metrics) {
  const weights = {
    roi: 0.3,
    ctr: 0.2,
    conversionRate: 0.25,
    efficiency: 0.15,
    engagement: 0.1
  };
  
  const roiScore = Math.min(100, Math.max(0, (metrics.roi || 0) * 2));
  const ctrScore = Math.min(100, (metrics.ctr || 0) * 25);
  const convScore = Math.min(100, (metrics.conversionRate || 0) * 30);
  const efficiencyScore = Math.min(100, (1000 / (metrics.spend || 1000)) * 50);
  const engagementScore = Math.min(100, ((metrics.ctr || 0) + (metrics.conversionRate || 0)) * 15);
  
  return Math.round(
    roiScore * weights.roi +
    ctrScore * weights.ctr +
    convScore * weights.conversionRate +
    efficiencyScore * weights.efficiency +
    engagementScore * weights.engagement
  );
}

// Industry benchmarks for AI grading
const industryBenchmarks = {
  'E-commerce': { ctr: 2.1, convRate: 2.8, roi: 35, gradeThresholds: { A: 85, B: 75, C: 65 } },
  'SaaS/Tech': { ctr: 1.8, convRate: 3.2, roi: 42, gradeThresholds: { A: 88, B: 78, C: 68 } },
  'Healthcare': { ctr: 2.4, convRate: 2.1, roi: 28, gradeThresholds: { A: 82, B: 72, C: 62 } },
  'Finance': { ctr: 1.6, convRate: 2.9, roi: 38, gradeThresholds: { A: 86, B: 76, C: 66 } },
  'Education': { ctr: 2.8, convRate: 1.9, roi: 31, gradeThresholds: { A: 84, B: 74, C: 64 } },
  'Retail': { ctr: 2.3, convRate: 2.5, roi: 32, gradeThresholds: { A: 83, B: 73, C: 63 } },
  'Travel': { ctr: 1.9, convRate: 2.2, roi: 29, gradeThresholds: { A: 81, B: 71, C: 61 } }
};

// AI-powered grade calculation
function calculateAIGrade(campaign, industry = 'E-commerce') {
  const benchmark = industryBenchmarks[industry];
  if (!benchmark) return { grade: 'C', score: 60, confidence: 50 };
  
  let score = 0;
  let confidence = 0;
  
  // CTR analysis (25% weight)
  const ctrRatio = campaign.ctr / benchmark.ctr;
  const ctrScore = Math.min(25, ctrRatio * 20);
  score += ctrScore;
  confidence += ctrRatio > 0.8 ? 25 : 15;
  
  // Conversion rate analysis (30% weight)
  const convRatio = campaign.convRate / benchmark.convRate;
  const convScore = Math.min(30, convRatio * 25);
  score += convScore;
  confidence += convRatio > 0.9 ? 30 : 20;
  
  // ROI analysis (35% weight)
  const roiRatio = campaign.roi / benchmark.roi;
  const roiScore = Math.min(35, roiRatio * 30);
  score += roiScore;
  confidence += roiRatio > 1.0 ? 35 : 25;
  
  // Efficiency bonus (10% weight)
  const avgRatio = (ctrRatio + convRatio + roiRatio) / 3;
  const efficiencyScore = Math.min(10, avgRatio * 8);
  score += efficiencyScore;
  confidence += avgRatio > 1.2 ? 10 : 5;
  
  // Determine grade based on industry thresholds
  let grade;
  if (score >= 90) grade = 'A+';
  else if (score >= benchmark.gradeThresholds.A) grade = 'A';
  else if (score >= benchmark.gradeThresholds.B) grade = 'B';
  else if (score >= benchmark.gradeThresholds.C) grade = 'C';
  else if (score >= 50) grade = 'D';
  else grade = 'F';
  
  return {
    grade,
    score: Math.round(score),
    confidence: Math.min(100, confidence),
    benchmarkComparison: {
      ctrVsBenchmark: ((ctrRatio - 1) * 100).toFixed(1),
      convVsBenchmark: ((convRatio - 1) * 100).toFixed(1),
      roiVsBenchmark: ((roiRatio - 1) * 100).toFixed(1)
    }
  };
}

// AI insights generation
function generateAIInsights(campaigns) {
  const insights = {
    patterns: [],
    benchmarkAnalysis: [],
    optimizationOpportunities: [],
    industryPosition: ''
  };
  
  // Pattern recognition
  const emailCampaigns = campaigns.filter(c => c.name.toLowerCase().includes('email'));
  const socialCampaigns = campaigns.filter(c => c.name.toLowerCase().includes('facebook') || c.name.toLowerCase().includes('instagram'));
  
  if (emailCampaigns.length > 0 && socialCampaigns.length > 0) {
    const emailAvgROI = emailCampaigns.reduce((sum, c) => sum + (c.roi || 0), 0) / emailCampaigns.length;
    const socialAvgROI = socialCampaigns.reduce((sum, c) => sum + (c.roi || 0), 0) / socialCampaigns.length;
    
    if (emailAvgROI > socialAvgROI * 1.5) {
      insights.patterns.push(`Email campaigns show ${((emailAvgROI / socialAvgROI - 1) * 100).toFixed(0)}% higher ROI than social media`);
    }
  }
  
  // Benchmark analysis
  const avgScore = campaigns.reduce((sum, c) => sum + (c.score || 60), 0) / campaigns.length;
  if (avgScore > 75) {
    insights.benchmarkAnalysis.push('Your campaigns perform in the top 25% of industry benchmarks');
  } else if (avgScore > 65) {
    insights.benchmarkAnalysis.push('Your campaigns perform above industry average');
  }
  
  // Optimization opportunities
  const lowPerformers = campaigns.filter(c => (c.score || 60) < 70);
  if (lowPerformers.length > 0) {
    insights.optimizationOpportunities.push(`${lowPerformers.length} campaign(s) have significant improvement potential`);
  }
  
  return insights;
}

// Generate recommendations based on scores
function generateRecommendations(campaigns) {
  const recommendations = [];
  
  campaigns.forEach(campaign => {
    if (campaign.score < 70) {
      recommendations.push({
        title: `Optimize ${campaign.name}`,
        description: `Score is ${campaign.score}. Focus on improving conversion rate and ROI.`,
        impact: `+${Math.floor((70 - campaign.score) * 0.8)} points`,
        priority: campaign.score < 50 ? 'High' : 'Medium',
        campaign: campaign.name
      });
    }
    
    if (campaign.ctr < 2.0) {
      recommendations.push({
        title: `Improve CTR for ${campaign.name}`,
        description: `Current CTR is ${campaign.ctr}%. Consider A/B testing ad creatives.`,
        impact: '+5-8 points',
        priority: 'Medium',
        campaign: campaign.name
      });
    }
    
    if (campaign.roi > 50 && campaign.score > 80) {
      recommendations.push({
        title: `Scale ${campaign.name}`,
        description: `High performance detected. Consider increasing budget by 20-30%.`,
        impact: '+10-15 points',
        priority: 'High',
        campaign: campaign.name
      });
    }
  });
  
  return recommendations.slice(0, 6); // Return top 6 recommendations
}

// Get performance scores
app.get('/api/performance-scores', (req, res) => {
  // Update campaign scores based on current data
  const campaignScores = campaigns.map(campaign => {
    const metrics = {
      roi: ((campaign.metrics.conversions * 50 - campaign.budget) / campaign.budget) * 100,
      ctr: (campaign.metrics.clicks / campaign.metrics.impressions) * 100,
      conversionRate: (campaign.metrics.conversions / campaign.metrics.clicks) * 100,
      spend: campaign.budget,
      engagement: (campaign.metrics.clicks + campaign.metrics.conversions) / 2
    };
    
    const score = calculatePerformanceScore(metrics);
    
    return {
      id: campaign.id,
      name: campaign.name,
      score,
      grade: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Average' : 'Poor',
      metrics,
      trend: Math.random() > 0.5 ? '+' : '-' + Math.floor(Math.random() * 5)
    };
  });
  
  // Calculate overall score
  const overallScore = campaignScores.length > 0 ? 
    Math.round(campaignScores.reduce((sum, c) => sum + c.score, 0) / campaignScores.length) : 0;
  
  // Generate recommendations
  const recommendations = generateRecommendations(campaignScores);
  
  // Update performance scores
  performanceScores.overall.score = overallScore;
  performanceScores.overall.grade = overallScore >= 85 ? 'Excellent' : overallScore >= 70 ? 'Good' : overallScore >= 50 ? 'Average' : 'Poor';
  performanceScores.campaigns = campaignScores;
  performanceScores.recommendations = recommendations;
  
  // Simulate factor score updates
  performanceScores.factors.forEach(factor => {
    factor.score += (Math.random() - 0.5) * 4;
    factor.score = Math.max(0, Math.min(100, factor.score));
  });
  
  res.json({
    ...performanceScores,
    timestamp: new Date().toISOString(),
    totalCampaigns: campaignScores.length,
    averageScore: overallScore
  });
});

// AI-powered grading system
app.get('/api/ai-grading', (req, res) => {
  const { industry = 'E-commerce' } = req.query;
  
  // Generate AI grades for all campaigns
  const gradedCampaigns = campaigns.map(campaign => {
    const metrics = {
      roi: ((campaign.metrics.conversions * 50 - campaign.budget) / campaign.budget) * 100,
      ctr: (campaign.metrics.clicks / (campaign.metrics.impressions || 1000)) * 100,
      convRate: (campaign.metrics.conversions / (campaign.metrics.clicks || 1)) * 100
    };
    
    const aiGrade = calculateAIGrade(metrics, industry);
    
    return {
      id: campaign.id,
      name: campaign.name,
      industry,
      ...aiGrade,
      metrics,
      recommendations: generateAIRecommendations(metrics, aiGrade.grade)
    };
  });
  
  // Generate AI insights
  const aiInsights = generateAIInsights(gradedCampaigns);
  
  // Calculate overall performance
  const overallScore = gradedCampaigns.reduce((sum, c) => sum + c.score, 0) / gradedCampaigns.length;
  const overallGrade = calculateAIGrade({ roi: 35, ctr: 2.1, convRate: 2.8 }, industry);
  
  res.json({
    overall: {
      score: Math.round(overallScore),
      grade: overallGrade.grade,
      confidence: Math.round(gradedCampaigns.reduce((sum, c) => sum + c.confidence, 0) / gradedCampaigns.length)
    },
    campaigns: gradedCampaigns,
    industryBenchmarks: industryBenchmarks[industry],
    aiInsights,
    gradeDistribution: {
      'A+': gradedCampaigns.filter(c => c.grade === 'A+').length,
      'A': gradedCampaigns.filter(c => c.grade === 'A').length,
      'B': gradedCampaigns.filter(c => c.grade === 'B').length,
      'C': gradedCampaigns.filter(c => c.grade === 'C').length,
      'D': gradedCampaigns.filter(c => c.grade === 'D').length,
      'F': gradedCampaigns.filter(c => c.grade === 'F').length
    },
    timestamp: new Date().toISOString()
  });
});

// Generate AI recommendations for specific grade
function generateAIRecommendations(metrics, grade) {
  const recommendations = [];
  
  if (grade === 'F' || grade === 'D') {
    recommendations.push({
      action: 'Complete campaign overhaul required',
      priority: 'Critical',
      expectedImprovement: '+2-3 grade levels',
      confidence: 95
    });
  }
  
  if (grade === 'C') {
    recommendations.push({
      action: 'Focus on conversion rate optimization',
      priority: 'High',
      expectedImprovement: '+1 grade level',
      confidence: 85
    });
  }
  
  if (grade === 'A' || grade === 'A+') {
    recommendations.push({
      action: 'Scale budget and expand to similar audiences',
      priority: 'Medium',
      expectedImprovement: 'Revenue growth',
      confidence: 90
    });
  }
  
  return recommendations;
}

// Get detailed campaign analysis
app.get('/api/campaign-analysis/:id', (req, res) => {
  const { id } = req.params;
  const { industry = 'E-commerce' } = req.query;
  const campaign = campaigns.find(c => c.id === id);
  
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  const metrics = {
    roi: ((campaign.metrics.conversions * 50 - campaign.budget) / campaign.budget) * 100,
    ctr: (campaign.metrics.clicks / (campaign.metrics.impressions || 1000)) * 100,
    convRate: (campaign.metrics.conversions / (campaign.metrics.clicks || 1)) * 100
  };
  
  const aiGrade = calculateAIGrade(metrics, industry);
  const benchmark = industryBenchmarks[industry];
  
  const analysis = {
    campaign: campaign.name,
    industry,
    aiGrade,
    metrics,
    benchmarkComparison: {
      ctr: { value: metrics.ctr, benchmark: benchmark.ctr, performance: metrics.ctr > benchmark.ctr ? 'above' : 'below' },
      convRate: { value: metrics.convRate, benchmark: benchmark.convRate, performance: metrics.convRate > benchmark.convRate ? 'above' : 'below' },
      roi: { value: metrics.roi, benchmark: benchmark.roi, performance: metrics.roi > benchmark.roi ? 'above' : 'below' }
    },
    recommendations: generateAIRecommendations(metrics, aiGrade.grade),
    industryPosition: aiGrade.score > 80 ? 'Top Quartile' : aiGrade.score > 60 ? 'Above Average' : 'Below Average'
  };
  
  res.json(analysis);
});

app.listen(PORT, () => {
  console.log(`Campaign Hub API running on port ${PORT}`);
  console.log(`Real-time Analytics available at http://localhost:${PORT}`);
  console.log(`Performance Scoring available at http://localhost:${PORT}`);
});