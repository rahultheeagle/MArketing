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

// Automated Reports System
let scheduledReports = [
  { id: 1, name: 'Weekly Executive Summary', frequency: 'weekly', recipients: ['ceo@company.com'], status: 'active', template: 'executive', nextRun: new Date(Date.now() + 7*24*60*60*1000) },
  { id: 2, name: 'Daily Performance Snapshot', frequency: 'daily', recipients: ['team@company.com'], status: 'active', template: 'daily', nextRun: new Date(Date.now() + 24*60*60*1000) }
];

let reportTemplates = {
  executive: {
    name: 'Executive Summary',
    sections: ['overview', 'kpis', 'roi_analysis', 'recommendations'],
    charts: ['performance_trend', 'channel_comparison'],
    frequency: ['weekly', 'monthly']
  },
  performance: {
    name: 'Performance Deep Dive',
    sections: ['detailed_metrics', 'campaign_breakdown', 'trends', 'optimization_tips'],
    charts: ['daily_performance', 'conversion_funnel', 'channel_performance'],
    frequency: ['weekly', 'monthly']
  },
  roi: {
    name: 'ROI Analysis',
    sections: ['revenue_breakdown', 'cost_analysis', 'profit_margins', 'budget_recommendations'],
    charts: ['roi_trend', 'spend_vs_revenue', 'channel_roi'],
    frequency: ['monthly', 'quarterly']
  },
  daily: {
    name: 'Daily Snapshot',
    sections: ['yesterday_summary', 'key_metrics', 'alerts'],
    charts: ['daily_trend'],
    frequency: ['daily']
  },
  competitor: {
    name: 'Competitor Analysis',
    sections: ['market_overview', 'competitor_metrics', 'ai_insights', 'recommendations'],
    charts: ['market_share', 'spend_comparison', 'traffic_analysis'],
    frequency: ['weekly', 'monthly']
  }
};

// Get all scheduled reports
app.get('/api/reports', (req, res) => {
  res.json({
    scheduledReports,
    templates: reportTemplates,
    totalReports: scheduledReports.length,
    activeReports: scheduledReports.filter(r => r.status === 'active').length
  });
});

// Create new automated report
app.post('/api/reports', (req, res) => {
  const { name, frequency, recipients, template, time } = req.body;
  
  const newReport = {
    id: scheduledReports.length + 1,
    name,
    frequency,
    recipients: Array.isArray(recipients) ? recipients : recipients.split(',').map(r => r.trim()),
    template,
    status: 'active',
    createdAt: new Date().toISOString(),
    nextRun: calculateNextRun(frequency, time),
    lastRun: null,
    runCount: 0
  };
  
  scheduledReports.push(newReport);
  res.status(201).json(newReport);
});

// Update report status
app.put('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const { status, name, frequency, recipients, template } = req.body;
  
  const report = scheduledReports.find(r => r.id === parseInt(id));
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  if (status) report.status = status;
  if (name) report.name = name;
  if (frequency) report.frequency = frequency;
  if (recipients) report.recipients = Array.isArray(recipients) ? recipients : recipients.split(',').map(r => r.trim());
  if (template) report.template = template;
  
  res.json(report);
});

// Delete scheduled report
app.delete('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const index = scheduledReports.findIndex(r => r.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  scheduledReports.splice(index, 1);
  res.json({ message: 'Report deleted successfully' });
});

// Generate report data
app.get('/api/reports/generate/:template', (req, res) => {
  const { template } = req.params;
  const { dateRange = '7d' } = req.query;
  
  if (!reportTemplates[template]) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  // Generate report data based on template
  const reportData = generateReportData(template, dateRange);
  
  res.json({
    template: reportTemplates[template],
    data: reportData,
    generatedAt: new Date().toISOString(),
    dateRange
  });
});

// Send report via email
app.post('/api/reports/send', (req, res) => {
  const { reportId, recipients, subject } = req.body;
  
  // Simulate email sending
  const report = scheduledReports.find(r => r.id === reportId);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  // Update last run time
  report.lastRun = new Date().toISOString();
  report.runCount += 1;
  report.nextRun = calculateNextRun(report.frequency);
  
  res.json({
    message: 'Report sent successfully',
    recipients: recipients || report.recipients,
    subject: subject || `${report.name} - ${new Date().toLocaleDateString()}`,
    sentAt: new Date().toISOString()
  });
});

// Helper function to calculate next run time
function calculateNextRun(frequency, time = '09:00') {
  const now = new Date();
  const nextRun = new Date();
  
  switch(frequency) {
    case 'daily':
      nextRun.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      nextRun.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      nextRun.setMonth(now.getMonth() + 1);
      break;
    case 'quarterly':
      nextRun.setMonth(now.getMonth() + 3);
      break;
  }
  
  const [hours, minutes] = time.split(':');
  nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return nextRun;
}

// Generate report data based on template
function generateReportData(template, dateRange) {
  const baseData = {
    summary: {
      totalClicks: Math.floor(Math.random() * 50000) + 10000,
      totalConversions: Math.floor(Math.random() * 1000) + 200,
      totalRevenue: Math.floor(Math.random() * 100000) + 20000,
      avgROI: Math.floor(Math.random() * 200) + 50
    },
    campaigns: campaigns.map(campaign => ({
      name: campaign.name,
      clicks: campaign.metrics.clicks,
      conversions: campaign.metrics.conversions,
      revenue: campaign.metrics.conversions * 50,
      roi: ((campaign.metrics.conversions * 50 - campaign.budget) / campaign.budget * 100).toFixed(1),
      grade: campaign.metrics.conversions > 50 ? 'A' : campaign.metrics.conversions > 20 ? 'B' : 'C'
    })),
    trends: {
      daily: Array.from({length: 7}, (_, i) => ({
        date: new Date(Date.now() - (6-i) * 24*60*60*1000).toISOString().split('T')[0],
        clicks: Math.floor(Math.random() * 2000) + 500,
        conversions: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 5000) + 1000
      }))
    }
  };
  
  // Customize data based on template
  switch(template) {
    case 'executive':
      return {
        ...baseData,
        insights: [
          'Email campaigns showing 3x higher ROI than social media',
          'Mobile traffic converting 25% better than desktop',
          'Weekend performance 15% above weekday average'
        ],
        recommendations: [
          'Increase email campaign budget by 30%',
          'Optimize mobile landing pages',
          'Schedule more campaigns for weekends'
        ]
      };
    case 'performance':
      return {
        ...baseData,
        detailedMetrics: {
          ctr: '2.8%',
          conversionRate: '3.2%',
          costPerClick: '$1.25',
          costPerConversion: '$38.50'
        },
        channelBreakdown: {
          'Google Ads': { clicks: 15000, conversions: 450, spend: 5000 },
          'Facebook': { clicks: 12000, conversions: 320, spend: 3500 },
          'Email': { clicks: 8000, conversions: 280, spend: 500 }
        }
      };
    case 'roi':
      return {
        ...baseData,
        roiAnalysis: {
          totalSpend: Math.floor(Math.random() * 20000) + 5000,
          totalRevenue: Math.floor(Math.random() * 50000) + 15000,
          netProfit: Math.floor(Math.random() * 30000) + 10000,
          profitMargin: '45%'
        },
        budgetRecommendations: [
          'Reallocate 20% budget from LinkedIn to Email campaigns',
          'Increase Google Ads budget by $2000/month',
          'Pause underperforming Instagram campaigns'
        ]
      };
    case 'daily':
      return {
        yesterday: {
          clicks: Math.floor(Math.random() * 2000) + 500,
          conversions: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 5000) + 1000,
          topCampaign: 'Email Newsletter'
        },
        alerts: [
          'Google Ads CTR dropped 15% yesterday',
          'Email campaign exceeded conversion goal by 25%'
        ]
      };
    case 'competitor':
      return {
        marketOverview: {
          totalCompetitors: competitors.length,
          marketSpend: competitors.reduce((sum, c) => sum + c.metrics.adSpend, 0),
          avgTraffic: competitors.reduce((sum, c) => sum + c.metrics.estimatedTraffic, 0) / competitors.length
        },
        topCompetitors: competitors.slice(0, 3).map(c => ({
          name: c.name,
          spend: c.metrics.adSpend,
          traffic: c.metrics.estimatedTraffic,
          channels: c.channels.length
        })),
        insights: [
          'Market leader spending 40% more than average',
          'Email marketing underutilized by 60% of competitors',
          'Social engagement growing 15% across market'
        ],
        recommendations: [
          'Increase presence in underutilized channels',
          'Monitor competitor campaign launches',
          'Focus on content marketing for organic growth'
        ]
      };
    default:
      return baseData;
  }
}

// Performance Report Scheduling
let performanceSchedules = [
  {
    id: 1,
    name: 'Executive Weekly Summary',
    frequency: 'weekly',
    day: 1, // Monday
    time: '09:00',
    recipients: ['ceo@company.com', 'cmo@company.com'],
    format: 'pdf',
    status: 'active',
    template: 'executive',
    nextRun: calculateWeeklyNextRun(1, '09:00'),
    lastRun: null,
    runCount: 0
  },
  {
    id: 2,
    name: 'Monthly ROI Analysis',
    frequency: 'monthly',
    date: 1, // 1st of month
    time: '10:00',
    recipients: ['finance@company.com', 'cfo@company.com'],
    format: 'excel',
    status: 'scheduled',
    template: 'roi',
    period: 'previous',
    nextRun: calculateMonthlyNextRun(1, '10:00'),
    lastRun: null,
    runCount: 0
  }
];

// Get performance schedules
app.get('/api/performance-schedules', (req, res) => {
  res.json({
    schedules: performanceSchedules,
    totalSchedules: performanceSchedules.length,
    activeSchedules: performanceSchedules.filter(s => s.status === 'active').length,
    weeklySchedules: performanceSchedules.filter(s => s.frequency === 'weekly').length,
    monthlySchedules: performanceSchedules.filter(s => s.frequency === 'monthly').length
  });
});

// Create performance report schedule
app.post('/api/performance-schedules', (req, res) => {
  const { name, frequency, day, date, time, recipients, format, template, period } = req.body;
  
  const newSchedule = {
    id: performanceSchedules.length + 1,
    name,
    frequency,
    day: frequency === 'weekly' ? day : null,
    date: frequency === 'monthly' ? date : null,
    time,
    recipients: Array.isArray(recipients) ? recipients : recipients.split(',').map(r => r.trim()),
    format,
    template: template || 'performance',
    period: frequency === 'monthly' ? (period || 'previous') : null,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    nextRun: frequency === 'weekly' ? 
      calculateWeeklyNextRun(day, time) : 
      calculateMonthlyNextRun(date, time),
    lastRun: null,
    runCount: 0
  };
  
  performanceSchedules.push(newSchedule);
  res.status(201).json(newSchedule);
});

// Update performance schedule
app.put('/api/performance-schedules/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const schedule = performanceSchedules.find(s => s.id === parseInt(id));
  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      schedule[key] = updates[key];
    }
  });
  
  // Recalculate next run if schedule changed
  if (updates.day || updates.date || updates.time) {
    schedule.nextRun = schedule.frequency === 'weekly' ? 
      calculateWeeklyNextRun(schedule.day, schedule.time) : 
      calculateMonthlyNextRun(schedule.date, schedule.time);
  }
  
  res.json(schedule);
});

// Delete performance schedule
app.delete('/api/performance-schedules/:id', (req, res) => {
  const { id } = req.params;
  const index = performanceSchedules.findIndex(s => s.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  
  performanceSchedules.splice(index, 1);
  res.json({ message: 'Schedule deleted successfully' });
});

// Generate performance report immediately
app.post('/api/performance-schedules/:id/generate', (req, res) => {
  const { id } = req.params;
  const schedule = performanceSchedules.find(s => s.id === parseInt(id));
  
  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  
  // Generate performance report data
  const reportData = generatePerformanceReportData(schedule);
  
  // Update schedule stats
  schedule.lastRun = new Date().toISOString();
  schedule.runCount += 1;
  
  res.json({
    message: 'Performance report generated successfully',
    schedule: schedule.name,
    data: reportData,
    generatedAt: new Date().toISOString(),
    format: schedule.format,
    recipients: schedule.recipients
  });
});

// Helper functions for scheduling
function calculateWeeklyNextRun(day, time) {
  const now = new Date();
  const nextRun = new Date();
  const currentDay = now.getDay();
  const targetDay = parseInt(day);
  
  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) daysUntil += 7;
  
  nextRun.setDate(now.getDate() + daysUntil);
  const [hours, minutes] = time.split(':');
  nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return nextRun;
}

function calculateMonthlyNextRun(date, time) {
  const now = new Date();
  let nextRun = new Date();
  
  if (date === 'last') {
    // Last day of month
    nextRun = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else {
    nextRun.setDate(parseInt(date));
    if (nextRun <= now) {
      nextRun.setMonth(nextRun.getMonth() + 1);
    }
  }
  
  const [hours, minutes] = time.split(':');
  nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return nextRun;
}

// Generate performance report data
function generatePerformanceReportData(schedule) {
  const period = schedule.frequency === 'weekly' ? '7d' : '30d';
  const endDate = new Date();
  const startDate = new Date();
  
  if (schedule.frequency === 'weekly') {
    startDate.setDate(endDate.getDate() - 7);
  } else {
    if (schedule.period === 'previous') {
      startDate.setMonth(endDate.getMonth() - 1, 1);
      endDate.setDate(0); // Last day of previous month
    } else {
      startDate.setDate(1); // First day of current month
    }
  }
  
  return {
    period: {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      type: schedule.frequency
    },
    summary: {
      totalClicks: Math.floor(Math.random() * 50000) + 10000,
      totalConversions: Math.floor(Math.random() * 1000) + 200,
      totalRevenue: Math.floor(Math.random() * 100000) + 20000,
      avgROI: Math.floor(Math.random() * 200) + 50,
      changeVsPrevious: {
        clicks: `+${Math.floor(Math.random() * 20)}%`,
        conversions: `+${Math.floor(Math.random() * 15)}%`,
        revenue: `+${Math.floor(Math.random() * 25)}%`,
        roi: `+${Math.floor(Math.random() * 10)}%`
      }
    },
    topCampaigns: campaigns.slice(0, 5).map(campaign => ({
      name: campaign.name,
      clicks: campaign.metrics.clicks,
      conversions: campaign.metrics.conversions,
      revenue: campaign.metrics.conversions * 50,
      roi: ((campaign.metrics.conversions * 50 - campaign.budget) / campaign.budget * 100).toFixed(1) + '%',
      grade: campaign.metrics.conversions > 50 ? 'A' : campaign.metrics.conversions > 20 ? 'B' : 'C'
    })),
    insights: [
      'Email campaigns showing strongest ROI performance',
      `${schedule.frequency === 'weekly' ? 'This week' : 'This month'} exceeded targets by 15%`,
      'Mobile traffic converting 25% better than desktop',
      'Weekend performance 20% above weekday average'
    ],
    recommendations: [
      'Scale top-performing email campaigns by 30%',
      'Optimize mobile landing pages for better conversion',
      'Increase weekend campaign activity',
      'A/B test underperforming ad creatives'
    ],
    alerts: schedule.frequency === 'weekly' ? [
      { type: 'success', message: 'Google Ads exceeded weekly target by 20%' },
      { type: 'warning', message: 'Facebook CTR dropped 10% this week' }
    ] : [
      { type: 'info', message: 'Monthly budget 85% utilized' },
      { type: 'success', message: 'ROI improved 15% vs last month' }
    ]
  };
}

// Auto-run scheduled reports (simulate)
setInterval(() => {
  const now = new Date();
  
  // Check regular reports
  scheduledReports.forEach(report => {
    if (report.status === 'active' && report.nextRun <= now) {
      console.log(`Auto-generating report: ${report.name}`);
      report.lastRun = now.toISOString();
      report.runCount += 1;
      report.nextRun = calculateNextRun(report.frequency);
    }
  });
  
  // Check performance schedules
  performanceSchedules.forEach(schedule => {
    if (schedule.status === 'active' && schedule.nextRun <= now) {
      console.log(`Auto-generating performance report: ${schedule.name}`);
      schedule.lastRun = now.toISOString();
      schedule.runCount += 1;
      schedule.nextRun = schedule.frequency === 'weekly' ? 
        calculateWeeklyNextRun(schedule.day, schedule.time) : 
        calculateMonthlyNextRun(schedule.date, schedule.time);
    }
  });
}, 60000); // Check every minute

// Budget Tracking System
let budgetData = {
  totalBudget: 25000,
  totalSpent: 0,
  totalAllocated: 0,
  alertThreshold: 80,
  notificationMethod: 'email',
  campaigns: [
    { id: 'google-ads', name: 'Google Ads - Black Friday', budget: 8000, spent: 0, dailyLimit: 300, period: 'monthly' },
    { id: 'facebook-ads', name: 'Facebook - Holiday Sale', budget: 6000, spent: 0, dailyLimit: 200, period: 'monthly' },
    { id: 'instagram-ads', name: 'Instagram - Product Launch', budget: 4000, spent: 0, dailyLimit: 150, period: 'monthly' },
    { id: 'email-campaign', name: 'Email Newsletter', budget: 2500, spent: 0, dailyLimit: 100, period: 'monthly' },
    { id: 'linkedin-ads', name: 'LinkedIn B2B', budget: 2000, spent: 0, dailyLimit: 80, period: 'monthly' }
  ],
  dailySpending: [],
  alerts: []
};

// Calculate initial totals
budgetData.totalAllocated = budgetData.campaigns.reduce((sum, c) => sum + c.budget, 0);
budgetData.totalSpent = budgetData.campaigns.reduce((sum, c) => sum + c.spent, 0);

// Get budget overview
app.get('/api/budget', (req, res) => {
  const remaining = budgetData.totalBudget - budgetData.totalSpent;
  const spentPercentage = (budgetData.totalSpent / budgetData.totalBudget * 100).toFixed(1);
  const allocatedPercentage = (budgetData.totalAllocated / budgetData.totalBudget * 100).toFixed(1);
  
  res.json({
    totalBudget: budgetData.totalBudget,
    totalSpent: budgetData.totalSpent,
    totalAllocated: budgetData.totalAllocated,
    remaining,
    spentPercentage: parseFloat(spentPercentage),
    allocatedPercentage: parseFloat(allocatedPercentage),
    campaigns: budgetData.campaigns.map(campaign => ({
      ...campaign,
      remaining: campaign.budget - campaign.spent,
      spentPercentage: ((campaign.spent / campaign.budget) * 100).toFixed(1),
      status: getbudgetStatus(campaign)
    })),
    alerts: budgetData.alerts,
    alertThreshold: budgetData.alertThreshold
  });
});

// Set campaign budget
app.post('/api/budget/campaign', (req, res) => {
  const { campaignId, budget, period, dailyLimit } = req.body;
  
  let campaign = budgetData.campaigns.find(c => c.id === campaignId);
  
  if (campaign) {
    campaign.budget = budget;
    campaign.period = period || 'monthly';
    campaign.dailyLimit = dailyLimit || Math.floor(budget / 30);
  } else {
    // Create new campaign budget
    campaign = {
      id: campaignId,
      name: campaignId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      budget,
      spent: 0,
      period: period || 'monthly',
      dailyLimit: dailyLimit || Math.floor(budget / 30)
    };
    budgetData.campaigns.push(campaign);
  }
  
  // Recalculate totals
  budgetData.totalAllocated = budgetData.campaigns.reduce((sum, c) => sum + c.budget, 0);
  
  res.json({
    message: 'Budget set successfully',
    campaign,
    totalAllocated: budgetData.totalAllocated
  });
});

// Track spending
app.post('/api/budget/spend', (req, res) => {
  const { campaignId, amount, description } = req.body;
  
  const campaign = budgetData.campaigns.find(c => c.id === campaignId);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  // Add spending
  campaign.spent += amount;
  budgetData.totalSpent += amount;
  
  // Log spending
  const spendingRecord = {
    id: Date.now(),
    campaignId,
    amount,
    description: description || 'Campaign spending',
    timestamp: new Date().toISOString(),
    remainingBudget: campaign.budget - campaign.spent
  };
  
  // Check for budget alerts
  const alerts = checkBudgetAlerts(campaign);
  budgetData.alerts.push(...alerts);
  
  res.json({
    message: 'Spending tracked successfully',
    spendingRecord,
    campaign: {
      ...campaign,
      remaining: campaign.budget - campaign.spent,
      spentPercentage: ((campaign.spent / campaign.budget) * 100).toFixed(1)
    },
    alerts
  });
});

// Update budget settings
app.put('/api/budget/settings', (req, res) => {
  const { totalBudget, alertThreshold, notificationMethod } = req.body;
  
  if (totalBudget) budgetData.totalBudget = totalBudget;
  if (alertThreshold) budgetData.alertThreshold = alertThreshold;
  if (notificationMethod) budgetData.notificationMethod = notificationMethod;
  
  res.json({
    message: 'Budget settings updated',
    settings: {
      totalBudget: budgetData.totalBudget,
      alertThreshold: budgetData.alertThreshold,
      notificationMethod: budgetData.notificationMethod
    }
  });
});

// Get budget alerts
app.get('/api/budget/alerts', (req, res) => {
  res.json({
    alerts: budgetData.alerts,
    alertCount: budgetData.alerts.length,
    criticalAlerts: budgetData.alerts.filter(a => a.type === 'critical').length,
    warningAlerts: budgetData.alerts.filter(a => a.type === 'warning').length
  });
});

// Get spending history
app.get('/api/budget/history', (req, res) => {
  const { period = '7d', campaignId } = req.query;
  
  // Generate mock spending history
  const days = period === '30d' ? 30 : 7;
  const history = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    let dailySpend = 0;
    budgetData.campaigns.forEach(campaign => {
      if (!campaignId || campaign.id === campaignId) {
        dailySpend += Math.floor(Math.random() * campaign.dailyLimit) + 50;
      }
    });
    
    history.push({
      date: date.toISOString().split('T')[0],
      amount: dailySpend,
      campaigns: campaignId ? 1 : budgetData.campaigns.length
    });
  }
  
  res.json({
    period,
    history,
    totalSpent: history.reduce((sum, day) => sum + day.amount, 0),
    averageDaily: history.reduce((sum, day) => sum + day.amount, 0) / history.length
  });
});

// Helper functions
function getbudgetStatus(campaign) {
  const spentPercentage = (campaign.spent / campaign.budget) * 100;
  
  if (spentPercentage >= 100) return 'over_budget';
  if (spentPercentage >= budgetData.alertThreshold) return 'warning';
  if (spentPercentage >= 50) return 'on_track';
  return 'under_budget';
}

function checkBudgetAlerts(campaign) {
  const alerts = [];
  const spentPercentage = (campaign.spent / campaign.budget) * 100;
  
  if (spentPercentage >= 100) {
    alerts.push({
      id: Date.now(),
      type: 'critical',
      campaignId: campaign.id,
      message: `${campaign.name} has exceeded budget by $${(campaign.spent - campaign.budget).toFixed(2)}`,
      timestamp: new Date().toISOString()
    });
  } else if (spentPercentage >= budgetData.alertThreshold) {
    alerts.push({
      id: Date.now(),
      type: 'warning',
      campaignId: campaign.id,
      message: `${campaign.name} has used ${spentPercentage.toFixed(1)}% of budget`,
      timestamp: new Date().toISOString()
    });
  }
  
  return alerts;
}

// Spend vs Results Tracking
let spendResultsData = {
  campaigns: [
    {
      id: 'email-newsletter',
      name: 'Email Newsletter',
      spend: 1200,
      results: 8640,
      conversions: 144,
      clicks: 2880,
      impressions: 48000,
      roi: 620,
      costPerResult: 8.33,
      costPerClick: 0.42,
      costPerConversion: 8.33,
      efficiencyScore: 9.5,
      revenuePerDollar: 7.20
    },
    {
      id: 'google-ads',
      name: 'Google Ads - Black Friday',
      spend: 6800,
      results: 15300,
      conversions: 255,
      clicks: 4250,
      impressions: 125000,
      roi: 125,
      costPerResult: 26.67,
      costPerClick: 1.60,
      costPerConversion: 26.67,
      efficiencyScore: 7.8,
      revenuePerDollar: 2.25
    },
    {
      id: 'facebook-ads',
      name: 'Facebook - Holiday Sale',
      spend: 4200,
      results: 8820,
      conversions: 147,
      clicks: 3150,
      impressions: 95000,
      roi: 110,
      costPerResult: 28.57,
      costPerClick: 1.33,
      costPerConversion: 28.57,
      efficiencyScore: 7.2,
      revenuePerDollar: 2.10
    },
    {
      id: 'instagram-ads',
      name: 'Instagram - Product Launch',
      spend: 2100,
      results: 3570,
      conversions: 85,
      clicks: 1890,
      impressions: 42000,
      roi: 70,
      costPerResult: 24.71,
      costPerClick: 1.11,
      costPerConversion: 24.71,
      efficiencyScore: 6.1,
      revenuePerDollar: 1.70
    },
    {
      id: 'linkedin-ads',
      name: 'LinkedIn B2B',
      spend: 1120,
      results: 1450,
      conversions: 29,
      clicks: 560,
      impressions: 18000,
      roi: 29,
      costPerResult: 38.62,
      costPerClick: 2.00,
      costPerConversion: 38.62,
      efficiencyScore: 4.8,
      revenuePerDollar: 1.29
    }
  ]
};

// Get spend vs results analysis
app.get('/api/spend-results', (req, res) => {
  const totalSpend = spendResultsData.campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalResults = spendResultsData.campaigns.reduce((sum, c) => sum + c.results, 0);
  const totalConversions = spendResultsData.campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const overallROI = ((totalResults - totalSpend) / totalSpend * 100).toFixed(1);
  const avgCostPerResult = (totalSpend / totalConversions).toFixed(2);
  const avgEfficiency = (spendResultsData.campaigns.reduce((sum, c) => sum + c.efficiencyScore, 0) / spendResultsData.campaigns.length).toFixed(1);
  
  // Calculate efficiency ranking
  const rankedCampaigns = [...spendResultsData.campaigns]
    .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
    .map((campaign, index) => ({ ...campaign, rank: index + 1 }));
  
  // Generate insights
  const bestPerformer = rankedCampaigns[0];
  const worstPerformer = rankedCampaigns[rankedCampaigns.length - 1];
  
  const insights = [
    {
      type: 'top_performer',
      title: 'Top Performer',
      description: `${bestPerformer.name} delivers the highest efficiency score of ${bestPerformer.efficiencyScore}/10 with ${bestPerformer.roi}% ROI`,
      campaign: bestPerformer.id,
      impact: 'positive'
    },
    {
      type: 'optimization_opportunity',
      title: 'Optimization Opportunity',
      description: `${worstPerformer.name} has the lowest efficiency score (${worstPerformer.efficiencyScore}/10). Consider reallocating budget or optimizing targeting.`,
      campaign: worstPerformer.id,
      impact: 'negative'
    },
    {
      type: 'budget_efficiency',
      title: 'Budget Efficiency',
      description: `Overall portfolio generates $${(totalResults/totalSpend).toFixed(2)} in results for every $1 spent across all campaigns`,
      impact: 'neutral'
    }
  ];
  
  res.json({
    overview: {
      totalSpend,
      totalResults,
      totalConversions,
      overallROI: parseFloat(overallROI),
      avgCostPerResult: parseFloat(avgCostPerResult),
      avgEfficiency: parseFloat(avgEfficiency),
      revenuePerDollar: (totalResults / totalSpend).toFixed(2)
    },
    campaigns: rankedCampaigns,
    insights,
    benchmarks: {
      excellentROI: 200,
      goodROI: 100,
      averageROI: 50,
      excellentEfficiency: 8,
      goodEfficiency: 6,
      averageEfficiency: 4
    }
  });
});

// Get campaign efficiency comparison
app.get('/api/spend-results/comparison', (req, res) => {
  const { metric = 'efficiency' } = req.query;
  
  let sortedCampaigns;
  switch(metric) {
    case 'roi':
      sortedCampaigns = [...spendResultsData.campaigns].sort((a, b) => b.roi - a.roi);
      break;
    case 'cost_per_result':
      sortedCampaigns = [...spendResultsData.campaigns].sort((a, b) => a.costPerResult - b.costPerResult);
      break;
    case 'revenue_per_dollar':
      sortedCampaigns = [...spendResultsData.campaigns].sort((a, b) => b.revenuePerDollar - a.revenuePerDollar);
      break;
    default:
      sortedCampaigns = [...spendResultsData.campaigns].sort((a, b) => b.efficiencyScore - a.efficiencyScore);
  }
  
  res.json({
    metric,
    campaigns: sortedCampaigns.map((campaign, index) => ({
      ...campaign,
      rank: index + 1,
      percentile: ((sortedCampaigns.length - index) / sortedCampaigns.length * 100).toFixed(0)
    }))
  });
});

// Track campaign performance update
app.post('/api/spend-results/update', (req, res) => {
  const { campaignId, spend, results, conversions, clicks, impressions } = req.body;
  
  const campaign = spendResultsData.campaigns.find(c => c.id === campaignId);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  // Update metrics
  if (spend !== undefined) campaign.spend += spend;
  if (results !== undefined) campaign.results += results;
  if (conversions !== undefined) campaign.conversions += conversions;
  if (clicks !== undefined) campaign.clicks += clicks;
  if (impressions !== undefined) campaign.impressions += impressions;
  
  // Recalculate derived metrics
  campaign.roi = ((campaign.results - campaign.spend) / campaign.spend * 100).toFixed(0);
  campaign.costPerResult = (campaign.spend / campaign.conversions).toFixed(2);
  campaign.costPerClick = (campaign.spend / campaign.clicks).toFixed(2);
  campaign.costPerConversion = campaign.costPerResult;
  campaign.revenuePerDollar = (campaign.results / campaign.spend).toFixed(2);
  
  // Calculate efficiency score (0-10 scale)
  const roiScore = Math.min(5, campaign.roi / 100 * 5); // ROI component (0-5)
  const costScore = Math.min(5, (100 - parseFloat(campaign.costPerResult)) / 20); // Cost efficiency (0-5)
  campaign.efficiencyScore = (roiScore + costScore).toFixed(1);
  
  res.json({
    message: 'Campaign performance updated',
    campaign,
    calculatedMetrics: {
      roi: campaign.roi,
      costPerResult: campaign.costPerResult,
      efficiencyScore: campaign.efficiencyScore,
      revenuePerDollar: campaign.revenuePerDollar
    }
  });
});

// Get performance trends
app.get('/api/spend-results/trends', (req, res) => {
  const { period = '7d' } = req.query;
  const days = period === '30d' ? 30 : 7;
  
  // Generate mock trend data
  const trends = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const dayData = {
      date: date.toISOString().split('T')[0],
      totalSpend: 0,
      totalResults: 0,
      campaigns: []
    };
    
    spendResultsData.campaigns.forEach(campaign => {
      const dailySpend = Math.floor(Math.random() * (campaign.spend / 30)) + 10;
      const dailyResults = Math.floor(Math.random() * (campaign.results / 30)) + 20;
      
      dayData.totalSpend += dailySpend;
      dayData.totalResults += dailyResults;
      dayData.campaigns.push({
        id: campaign.id,
        name: campaign.name,
        spend: dailySpend,
        results: dailyResults,
        roi: ((dailyResults - dailySpend) / dailySpend * 100).toFixed(1)
      });
    });
    
    dayData.overallROI = ((dayData.totalResults - dayData.totalSpend) / dayData.totalSpend * 100).toFixed(1);
    trends.push(dayData);
  }
  
  res.json({
    period,
    trends,
    summary: {
      avgDailySpend: trends.reduce((sum, day) => sum + day.totalSpend, 0) / trends.length,
      avgDailyResults: trends.reduce((sum, day) => sum + day.totalResults, 0) / trends.length,
      avgDailyROI: trends.reduce((sum, day) => sum + parseFloat(day.overallROI), 0) / trends.length
    }
  });
});

// Simulate daily spending updates
setInterval(() => {
  budgetData.campaigns.forEach(campaign => {
    // Simulate random daily spending
    const dailySpend = Math.floor(Math.random() * 100) + 20;
    campaign.spent += dailySpend;
    
    // Check for alerts
    const alerts = checkBudgetAlerts(campaign);
    budgetData.alerts.push(...alerts);
  });
  
  // Update spend vs results data
  spendResultsData.campaigns.forEach(campaign => {
    const spendIncrease = Math.floor(Math.random() * 50) + 10;
    const resultsIncrease = Math.floor(Math.random() * 100) + 20;
    
    campaign.spend += spendIncrease;
    campaign.results += resultsIncrease;
    campaign.conversions += Math.floor(Math.random() * 3) + 1;
    
    // Recalculate metrics
    campaign.roi = ((campaign.results - campaign.spend) / campaign.spend * 100).toFixed(0);
    campaign.costPerResult = (campaign.spend / campaign.conversions).toFixed(2);
    campaign.revenuePerDollar = (campaign.results / campaign.spend).toFixed(2);
    
    // Recalculate efficiency score
    const roiScore = Math.min(5, campaign.roi / 100 * 5);
    const costScore = Math.min(5, (100 - parseFloat(campaign.costPerResult)) / 20);
    campaign.efficiencyScore = (roiScore + costScore).toFixed(1);
  });
  
  // Update total spent
  budgetData.totalSpent = budgetData.campaigns.reduce((sum, c) => sum + c.spent, 0);
  
  // Keep only last 50 alerts
  if (budgetData.alerts.length > 50) {
    budgetData.alerts = budgetData.alerts.slice(-50);
  }
  
}, 300000); // Update every 5 minutes

// A/B Test Management System
let abTests = [
  {
    id: 1,
    name: 'Email Subject Line Test',
    campaign: 'Email Newsletter',
    type: 'subject-line',
    status: 'running',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    duration: 14,
    trafficSplit: 50,
    confidenceLevel: 95,
    variants: [
      {
        id: 'control',
        name: 'Control',
        content: 'Get 50% Off This Weekend Only!',
        visitors: 2450,
        conversions: 147,
        conversionRate: 6.0,
        confidence: 95,
        isControl: true
      },
      {
        id: 'variant-b',
        name: 'Variant B',
        content: 'Limited Time: Save 50% Today!',
        visitors: 2380,
        conversions: 190,
        conversionRate: 8.0,
        confidence: 98,
        isControl: false
      }
    ],
    winner: null,
    statisticalSignificance: {
      isSignificant: true,
      pValue: 0.0234,
      confidence: 98,
      recommendation: 'Implement Variant B'
    }
  },
  {
    id: 2,
    name: 'Google Ads Creative Test',
    campaign: 'Google Ads',
    type: 'ad-creative',
    status: 'completed',
    startDate: '2023-12-15',
    endDate: '2024-01-05',
    duration: 21,
    trafficSplit: 50,
    confidenceLevel: 95,
    variants: [
      {
        id: 'control',
        name: 'Control',
        content: 'Buy Now - Free Shipping',
        visitors: 5200,
        conversions: 312,
        conversionRate: 6.0,
        confidence: 99,
        isControl: true
      },
      {
        id: 'variant-b',
        name: 'Variant B',
        content: 'Shop Today - Free Delivery',
        visitors: 5150,
        conversions: 268,
        conversionRate: 5.2,
        confidence: 85,
        isControl: false
      }
    ],
    winner: 'control',
    statisticalSignificance: {
      isSignificant: true,
      pValue: 0.0156,
      confidence: 99,
      recommendation: 'Keep Control version'
    }
  }
];

// Get all A/B tests
app.get('/api/ab-tests', (req, res) => {
  const { status, campaign } = req.query;
  
  let filteredTests = abTests;
  
  if (status) {
    filteredTests = filteredTests.filter(test => test.status === status);
  }
  
  if (campaign) {
    filteredTests = filteredTests.filter(test => test.campaign === campaign);
  }
  
  const summary = {
    totalTests: abTests.length,
    runningTests: abTests.filter(t => t.status === 'running').length,
    completedTests: abTests.filter(t => t.status === 'completed').length,
    pausedTests: abTests.filter(t => t.status === 'paused').length,
    significantResults: abTests.filter(t => t.statisticalSignificance?.isSignificant).length
  };
  
  res.json({
    tests: filteredTests,
    summary
  });
});

// Create new A/B test
app.post('/api/ab-tests', (req, res) => {
  const { name, campaign, type, trafficSplit, duration, confidenceLevel, variants } = req.body;
  
  const newTest = {
    id: abTests.length + 1,
    name,
    campaign,
    type,
    status: 'running',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration,
    trafficSplit: trafficSplit || 50,
    confidenceLevel: confidenceLevel || 95,
    variants: variants.map((variant, index) => ({
      id: index === 0 ? 'control' : `variant-${String.fromCharCode(97 + index)}`,
      name: index === 0 ? 'Control' : `Variant ${String.fromCharCode(65 + index)}`,
      content: variant.content,
      visitors: 0,
      conversions: 0,
      conversionRate: 0,
      confidence: 0,
      isControl: index === 0
    })),
    winner: null,
    statisticalSignificance: null
  };
  
  abTests.unshift(newTest);
  res.status(201).json(newTest);
});

// Update A/B test
app.put('/api/ab-tests/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const test = abTests.find(t => t.id === parseInt(id));
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      test[key] = updates[key];
    }
  });
  
  // Recalculate statistical significance if test data updated
  if (updates.variants) {
    test.statisticalSignificance = calculateStatisticalSignificance(test);
    test.winner = determineWinner(test);
  }
  
  res.json(test);
});

// Get specific A/B test results
app.get('/api/ab-tests/:id/results', (req, res) => {
  const { id } = req.params;
  const test = abTests.find(t => t.id === parseInt(id));
  
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  
  // Generate trend data for visualization
  const trendData = generateTestTrendData(test);
  
  // Calculate additional metrics
  const totalVisitors = test.variants.reduce((sum, v) => sum + v.visitors, 0);
  const totalConversions = test.variants.reduce((sum, v) => sum + v.conversions, 0);
  const overallConversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors * 100).toFixed(2) : 0;
  
  res.json({
    test,
    metrics: {
      totalVisitors,
      totalConversions,
      overallConversionRate,
      daysRunning: Math.floor((new Date() - new Date(test.startDate)) / (1000 * 60 * 60 * 24)),
      isComplete: test.status === 'completed'
    },
    trendData,
    statisticalSignificance: test.statisticalSignificance,
    winner: test.winner,
    recommendations: generateTestRecommendations(test)
  });
});

// Update test variant data
app.post('/api/ab-tests/:id/variants/:variantId/data', (req, res) => {
  const { id, variantId } = req.params;
  const { visitors, conversions } = req.body;
  
  const test = abTests.find(t => t.id === parseInt(id));
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  
  const variant = test.variants.find(v => v.id === variantId);
  if (!variant) {
    return res.status(404).json({ error: 'Variant not found' });
  }
  
  // Update variant data
  if (visitors !== undefined) variant.visitors += visitors;
  if (conversions !== undefined) variant.conversions += conversions;
  
  // Recalculate conversion rate
  variant.conversionRate = variant.visitors > 0 ? 
    ((variant.conversions / variant.visitors) * 100).toFixed(2) : 0;
  
  // Update confidence based on sample size
  variant.confidence = calculateVariantConfidence(variant);
  
  // Recalculate test-level statistics
  test.statisticalSignificance = calculateStatisticalSignificance(test);
  test.winner = determineWinner(test);
  
  res.json({
    variant,
    test: {
      id: test.id,
      statisticalSignificance: test.statisticalSignificance,
      winner: test.winner
    }
  });
});

// Pause/Resume test
app.post('/api/ab-tests/:id/toggle', (req, res) => {
  const { id } = req.params;
  const test = abTests.find(t => t.id === parseInt(id));
  
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  
  test.status = test.status === 'paused' ? 'running' : 'paused';
  
  res.json({
    message: `Test ${test.status === 'paused' ? 'paused' : 'resumed'} successfully`,
    test
  });
});

// Stop test
app.post('/api/ab-tests/:id/stop', (req, res) => {
  const { id } = req.params;
  const test = abTests.find(t => t.id === parseInt(id));
  
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  
  test.status = 'completed';
  test.endDate = new Date().toISOString().split('T')[0];
  test.winner = determineWinner(test);
  
  res.json({
    message: 'Test stopped successfully',
    test,
    finalResults: {
      winner: test.winner,
      statisticalSignificance: test.statisticalSignificance,
      recommendations: generateTestRecommendations(test)
    }
  });
});

// Helper functions
function calculateStatisticalSignificance(test) {
  if (test.variants.length < 2) return null;
  
  const [control, variant] = test.variants;
  const controlRate = control.conversionRate / 100;
  const variantRate = variant.conversionRate / 100;
  
  if (control.visitors < 100 || variant.visitors < 100) {
    return {
      isSignificant: false,
      pValue: 1.0,
      confidence: 0,
      recommendation: 'Need more data - continue testing'
    };
  }
  
  // Simplified statistical significance calculation
  const pooledRate = (control.conversions + variant.conversions) / (control.visitors + variant.visitors);
  const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1/control.visitors + 1/variant.visitors));
  const zScore = Math.abs(controlRate - variantRate) / standardError;
  const pValue = Math.max(0.001, 2 * (1 - normalCDF(Math.abs(zScore))));
  
  const isSignificant = pValue < 0.05; // 95% confidence
  const confidence = Math.min(99, Math.max(50, (1 - pValue) * 100));
  
  let recommendation;
  if (isSignificant && variantRate > controlRate) {
    recommendation = `Implement ${variant.name} - ${((variantRate - controlRate) / controlRate * 100).toFixed(1)}% improvement`;
  } else if (isSignificant && controlRate > variantRate) {
    recommendation = 'Keep Control version - performs better';
  } else {
    recommendation = 'Continue testing - results not conclusive yet';
  }
  
  return {
    isSignificant,
    pValue: pValue.toFixed(4),
    confidence: confidence.toFixed(0),
    zScore: zScore.toFixed(2),
    recommendation
  };
}

function determineWinner(test) {
  const significance = test.statisticalSignificance;
  if (!significance || !significance.isSignificant) return null;
  
  return test.variants.reduce((prev, current) => 
    prev.conversionRate > current.conversionRate ? prev : current
  ).id;
}

function calculateVariantConfidence(variant) {
  if (variant.visitors < 100) return Math.min(50, variant.visitors / 2);
  if (variant.visitors < 1000) return Math.min(80, 50 + (variant.visitors - 100) / 20);
  return Math.min(99, 80 + (variant.visitors - 1000) / 100);
}

function generateTestTrendData(test) {
  const days = Math.min(14, Math.floor((new Date() - new Date(test.startDate)) / (1000 * 60 * 60 * 24)) + 1);
  const trendData = [];
  
  for (let day = 1; day <= days; day++) {
    const date = new Date(test.startDate);
    date.setDate(date.getDate() + day - 1);
    
    const dayData = {
      date: date.toISOString().split('T')[0],
      day: `Day ${day}`,
      variants: test.variants.map(variant => {
        const progress = day / days;
        const variance = (Math.random() - 0.5) * 2;
        const rate = Math.max(0, variant.conversionRate * progress + variance);
        
        return {
          id: variant.id,
          name: variant.name,
          conversionRate: parseFloat(rate.toFixed(2)),
          visitors: Math.floor(variant.visitors * progress),
          conversions: Math.floor(variant.conversions * progress)
        };
      })
    };
    
    trendData.push(dayData);
  }
  
  return trendData;
}

function generateTestRecommendations(test) {
  const recommendations = [];
  const significance = test.statisticalSignificance;
  
  if (!significance) {
    recommendations.push({
      type: 'data',
      priority: 'high',
      message: 'Collect more data before making decisions',
      action: 'Continue running the test'
    });
    return recommendations;
  }
  
  if (significance.isSignificant) {
    const winner = test.variants.find(v => v.id === test.winner);
    if (winner && !winner.isControl) {
      recommendations.push({
        type: 'implement',
        priority: 'high',
        message: `Implement ${winner.name} - shows significant improvement`,
        action: 'Roll out winning variant to all traffic'
      });
    } else {
      recommendations.push({
        type: 'keep_control',
        priority: 'medium',
        message: 'Control version performs better - keep current approach',
        action: 'Maintain existing campaign'
      });
    }
  } else {
    recommendations.push({
      type: 'continue',
      priority: 'medium',
      message: 'Results not statistically significant yet',
      action: 'Continue testing or try different variants'
    });
  }
  
  return recommendations;
}

function normalCDF(x) {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function erf(x) {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

// Campaign Comparison API
app.get('/api/campaigns/compare', (req, res) => {
  const { metric } = req.query;
  const campaignData = abTests.map(test => {
    const avgConversionRate = test.variants.reduce((sum, v) => sum + parseFloat(v.conversionRate), 0) / test.variants.length;
    const totalVisitors = test.variants.reduce((sum, v) => sum + v.visitors, 0);
    const totalConversions = test.variants.reduce((sum, v) => sum + v.conversions, 0);
    
    let value, numericValue;
    switch(metric) {
      case 'conversion_rate':
        value = avgConversionRate.toFixed(1) + '%';
        numericValue = avgConversionRate;
        break;
      case 'ctr':
        const ctr = totalVisitors > 0 ? (totalConversions / totalVisitors * 100) : 0;
        value = ctr.toFixed(1) + '%';
        numericValue = ctr;
        break;
      case 'roi':
        const roi = totalConversions * 25 - totalVisitors * 0.5;
        value = roi.toFixed(0) + '$';
        numericValue = roi;
        break;
      case 'cost_per_conversion':
        const cpc = totalConversions > 0 ? (totalVisitors * 0.5 / totalConversions) : 0;
        value = cpc.toFixed(2) + '$';
        numericValue = -cpc;
        break;
      default:
        value = avgConversionRate.toFixed(1) + '%';
        numericValue = avgConversionRate;
    }
    
    return {
      name: test.name,
      value,
      numericValue,
      campaign: test.campaign
    };
  }).sort((a, b) => b.numericValue - a.numericValue);
  
  const maxValue = Math.abs(campaignData[0]?.numericValue || 1);
  campaignData.forEach(campaign => {
    campaign.percentage = maxValue > 0 ? (Math.abs(campaign.numericValue) / maxValue * 100) : 0;
  });
  
  res.json(campaignData);
});

app.post('/api/campaigns/compare-winner', (req, res) => {
  const { metric } = req.body;
  const campaignData = abTests.map(test => {
    const avgConversionRate = test.variants.reduce((sum, v) => sum + parseFloat(v.conversionRate), 0) / test.variants.length;
    const totalVisitors = test.variants.reduce((sum, v) => sum + v.visitors, 0);
    const totalConversions = test.variants.reduce((sum, v) => sum + v.conversions, 0);
    
    let value, numericValue;
    switch(metric) {
      case 'conversion_rate':
        value = avgConversionRate.toFixed(1) + '%';
        numericValue = avgConversionRate;
        break;
      case 'ctr':
        const ctr = totalVisitors > 0 ? (totalConversions / totalVisitors * 100) : 0;
        value = ctr.toFixed(1) + '%';
        numericValue = ctr;
        break;
      case 'roi':
        const roi = totalConversions * 25 - totalVisitors * 0.5;
        value = roi.toFixed(0) + '$';
        numericValue = roi;
        break;
      case 'cost_per_conversion':
        const cpc = totalConversions > 0 ? (totalVisitors * 0.5 / totalConversions) : 0;
        value = cpc.toFixed(2) + '$';
        numericValue = -cpc;
        break;
      default:
        value = avgConversionRate.toFixed(1) + '%';
        numericValue = avgConversionRate;
    }
    
    return { name: test.name, value, numericValue, campaign: test.campaign };
  }).sort((a, b) => b.numericValue - a.numericValue);
  
  const winner = campaignData[0];
  const confidence = Math.min(99, Math.max(85, Math.abs(winner?.numericValue || 0) * 5));
  
  res.json({ winner, confidence: confidence.toFixed(0) });
});

// Simulate real-time A/B test updates
setInterval(() => {
  abTests.forEach(test => {
    if (test.status === 'running') {
      test.variants.forEach(variant => {
        // Simulate traffic and conversions
        const visitorIncrease = Math.floor(Math.random() * 30) + 5;
        const conversionIncrease = Math.floor(Math.random() * 3);
        
        variant.visitors += visitorIncrease;
        variant.conversions += conversionIncrease;
        variant.conversionRate = ((variant.conversions / variant.visitors) * 100).toFixed(2);
        variant.confidence = calculateVariantConfidence(variant);
      });
      
      // Recalculate test statistics
      test.statisticalSignificance = calculateStatisticalSignificance(test);
      test.winner = determineWinner(test);
    }
  });
}, 60000); // Update every minute

// Competitor Tracking System
let competitors = [
  {
    id: 1,
    name: 'TechRival Corp',
    url: 'https://techrival.com',
    industry: 'saas',
    status: 'active',
    channels: ['google-ads', 'linkedin', 'email'],
    addedDate: new Date().toISOString(),
    metrics: {
      adSpend: 45000,
      estimatedTraffic: 125000,
      keywordRank: 3.2,
      socialEngagement: 8500,
      backlinks: 2400,
      domainAuthority: 65
    },
    trends: {
      adSpend: '+12%',
      traffic: '+8%',
      ranking: '-5%',
      engagement: '+15%'
    }
  }
];

let trackingSettings = {
  updateFrequency: 'daily',
  alertThreshold: 20,
  notificationMethod: 'email'
};

// Get all competitors
app.get('/api/competitors', (req, res) => {
  const { industry, status } = req.query;
  
  let filteredCompetitors = competitors;
  
  if (industry) {
    filteredCompetitors = filteredCompetitors.filter(c => c.industry === industry);
  }
  
  if (status) {
    filteredCompetitors = filteredCompetitors.filter(c => c.status === status);
  }
  
  res.json({
    competitors: filteredCompetitors,
    total: filteredCompetitors.length,
    settings: trackingSettings
  });
});

// Add new competitor
app.post('/api/competitors', (req, res) => {
  const { name, url, industry, channels } = req.body;
  
  const newCompetitor = {
    id: competitors.length + 1,
    name,
    url,
    industry,
    status: 'monitoring',
    channels: channels || [],
    addedDate: new Date().toISOString(),
    metrics: {
      adSpend: Math.floor(Math.random() * 50000) + 10000,
      estimatedTraffic: Math.floor(Math.random() * 200000) + 50000,
      keywordRank: (Math.random() * 5 + 1).toFixed(1),
      socialEngagement: Math.floor(Math.random() * 10000) + 2000,
      backlinks: Math.floor(Math.random() * 5000) + 1000,
      domainAuthority: Math.floor(Math.random() * 40) + 40
    },
    trends: {
      adSpend: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 20) + '%',
      traffic: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 15) + '%',
      ranking: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 10) + '%',
      engagement: (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 25) + '%'
    }
  };
  
  competitors.push(newCompetitor);
  res.status(201).json(newCompetitor);
});

// Update competitor
app.put('/api/competitors/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const competitor = competitors.find(c => c.id === parseInt(id));
  if (!competitor) {
    return res.status(404).json({ error: 'Competitor not found' });
  }
  
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      competitor[key] = updates[key];
    }
  });
  
  res.json(competitor);
});

// Delete competitor
app.delete('/api/competitors/:id', (req, res) => {
  const { id } = req.params;
  const index = competitors.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Competitor not found' });
  }
  
  competitors.splice(index, 1);
  res.json({ message: 'Competitor removed successfully' });
});

// Get competitor public campaigns
app.get('/api/competitors/:id/campaigns', (req, res) => {
  const { id } = req.params;
  const competitor = competitors.find(c => c.id === parseInt(id));
  
  if (!competitor) {
    return res.status(404).json({ error: 'Competitor not found' });
  }
  
  if (!competitor.campaigns) {
    competitor.campaigns = [
      {
        name: `${competitor.name} Campaign`,
        channel: competitor.channels[0] || 'google-ads',
        spend: Math.floor(Math.random() * 20000) + 5000,
        impressions: Math.floor(Math.random() * 500000) + 100000,
        clicks: Math.floor(Math.random() * 15000) + 3000,
        conversions: Math.floor(Math.random() * 500) + 100,
        ctr: ((Math.random() * 3) + 1).toFixed(2),
        cpc: ((Math.random() * 2) + 0.5).toFixed(2),
        status: 'active'
      }
    ];
  }
  
  res.json({ competitor: competitor.name, campaigns: competitor.campaigns });
});

// Get all public campaigns comparison
app.get('/api/competitors/campaigns/compare', (req, res) => {
  const allCampaigns = [];
  
  competitors.forEach(competitor => {
    if (!competitor.campaigns) {
      competitor.campaigns = [
        {
          name: `${competitor.name} Campaign`,
          channel: competitor.channels[0] || 'google-ads',
          spend: Math.floor(Math.random() * 20000) + 5000,
          clicks: Math.floor(Math.random() * 15000) + 3000,
          conversions: Math.floor(Math.random() * 500) + 100,
          ctr: ((Math.random() * 3) + 1).toFixed(2),
          cpc: ((Math.random() * 2) + 0.5).toFixed(2)
        }
      ];
    }
    
    competitor.campaigns.forEach(campaign => {
      allCampaigns.push({ ...campaign, competitorName: competitor.name });
    });
  });
  
  res.json({ campaigns: allCampaigns.sort((a, b) => parseFloat(b.ctr) - parseFloat(a.ctr)) });
});

// Get competitor analysis
app.get('/api/competitors/analysis', (req, res) => {
  const totalSpend = competitors.reduce((sum, c) => sum + c.metrics.adSpend, 0);
  const avgTraffic = competitors.reduce((sum, c) => sum + c.metrics.estimatedTraffic, 0) / competitors.length;
  const avgRank = competitors.reduce((sum, c) => sum + parseFloat(c.metrics.keywordRank), 0) / competitors.length;
  
  const topSpender = competitors.reduce((prev, current) => 
    prev.metrics.adSpend > current.metrics.adSpend ? prev : current
  );
  
  const trafficLeader = competitors.reduce((prev, current) => 
    prev.metrics.estimatedTraffic > current.metrics.estimatedTraffic ? prev : current
  );
  
  const channelAnalysis = {};
  competitors.forEach(c => {
    c.channels.forEach(channel => {
      channelAnalysis[channel] = (channelAnalysis[channel] || 0) + 1;
    });
  });
  
  const insights = [
    {
      type: 'spending',
      title: 'Market Spending Leader',
      description: `${topSpender.name} leads with $${(topSpender.metrics.adSpend / 1000).toFixed(0)}K monthly ad spend`,
      impact: 'high'
    },
    {
      type: 'traffic',
      title: 'Traffic Dominance',
      description: `${trafficLeader.name} captures ${(trafficLeader.metrics.estimatedTraffic / 1000).toFixed(0)}K monthly visitors`,
      impact: 'high'
    },
    {
      type: 'opportunity',
      title: 'Ranking Opportunity',
      description: `Average competitor rank is ${avgRank.toFixed(1)} - SEO opportunity exists`,
      impact: 'medium'
    }
  ];
  
  res.json({
    overview: {
      totalCompetitors: competitors.length,
      totalMarketSpend: totalSpend,
      avgTraffic: Math.round(avgTraffic),
      avgKeywordRank: avgRank.toFixed(1)
    },
    leaders: {
      topSpender,
      trafficLeader
    },
    channelAnalysis,
    insights
  });
});

// Update tracking settings
app.put('/api/competitors/settings', (req, res) => {
  const { updateFrequency, alertThreshold, notificationMethod } = req.body;
  
  if (updateFrequency) trackingSettings.updateFrequency = updateFrequency;
  if (alertThreshold) trackingSettings.alertThreshold = alertThreshold;
  if (notificationMethod) trackingSettings.notificationMethod = notificationMethod;
  
  res.json({
    message: 'Settings updated successfully',
    settings: trackingSettings
  });
});

// AI-powered competitor insights
app.get('/api/competitors/ai-insights', (req, res) => {
  const insights = [];
  
  // Market analysis
  const totalSpend = competitors.reduce((sum, c) => sum + c.metrics.adSpend, 0);
  const topSpender = competitors.reduce((prev, current) => 
    prev.metrics.adSpend > current.metrics.adSpend ? prev : current
  );
  
  insights.push({
    title: 'Market Dominance Analysis',
    content: `${topSpender.name} controls ${((topSpender.metrics.adSpend / totalSpend) * 100).toFixed(1)}% of market ad spend`,
    confidence: 92
  });
  
  // Traffic opportunity
  const avgTraffic = competitors.reduce((sum, c) => sum + c.metrics.estimatedTraffic, 0) / competitors.length;
  insights.push({
    title: 'Traffic Gap Analysis',
    content: `Market average traffic is ${(avgTraffic / 1000).toFixed(0)}K - potential for ${((avgTraffic * 0.3) / 1000).toFixed(0)}K additional visitors`,
    confidence: 87
  });
  
  // Channel strategy
  const channelCount = {};
  competitors.forEach(c => {
    c.channels.forEach(channel => {
      channelCount[channel] = (channelCount[channel] || 0) + 1;
    });
  });
  const underutilizedChannels = Object.keys(channelCount).filter(channel => channelCount[channel] < competitors.length * 0.5);
  
  if (underutilizedChannels.length > 0) {
    insights.push({
      title: 'Channel Opportunity',
      content: `${underutilizedChannels.join(', ')} channels are underutilized by competitors - first-mover advantage available`,
      confidence: 78
    });
  }
  
  res.json({ insights });
});

// Generate comprehensive competitor report
app.post('/api/competitors/generate-report', (req, res) => {
  const reportData = {
    generatedAt: new Date().toISOString(),
    competitors: competitors.length,
    marketAnalysis: {
      totalSpend: competitors.reduce((sum, c) => sum + c.metrics.adSpend, 0),
      avgTraffic: competitors.reduce((sum, c) => sum + c.metrics.estimatedTraffic, 0) / competitors.length,
      marketLeader: competitors.reduce((prev, current) => 
        prev.metrics.adSpend > current.metrics.adSpend ? prev : current
      ).name
    },
    insights: [
      'Market consolidation detected - top 2 competitors control 60% of ad spend',
      'Emerging channel opportunities in LinkedIn and Email marketing',
      'Average competitor CTR is 2.3% - room for optimization',
      'Social engagement growing 15% month-over-month across all competitors'
    ],
    recommendations: [
      'Increase budget allocation to underutilized channels',
      'Focus on content marketing to improve organic traffic',
      'Implement competitor campaign monitoring alerts',
      'Consider strategic partnerships with smaller competitors'
    ]
  };
  
  // Create automated report
  const newReport = {
    id: Date.now(),
    name: 'AI Competitor Analysis Report',
    frequency: 'on-demand',
    recipients: ['team@company.com'],
    template: 'competitor',
    status: 'completed',
    createdAt: new Date().toISOString(),
    data: reportData
  };
  
  res.json(reportData);
});

// Integrate with existing features
app.get('/api/competitors/integration-data', (req, res) => {
  // Get data from other features
  const budgetData = budgetData || { totalBudget: 25000, totalSpent: 0 };
  const utmData = utmLinks.length;
  const abTestData = abTests.length;
  const performanceData = performanceScores.overall.score;
  
  const integrationInsights = {
    budgetComparison: {
      yourBudget: budgetData.totalBudget,
      competitorAverage: competitors.reduce((sum, c) => sum + c.metrics.adSpend, 0) / competitors.length,
      recommendation: budgetData.totalBudget < (competitors.reduce((sum, c) => sum + c.metrics.adSpend, 0) / competitors.length) ? 
        'Consider increasing budget to match competitor spending' : 
        'Budget is competitive with market average'
    },
    campaignOptimization: {
      activeUTMLinks: utmData,
      runningABTests: abTestData,
      performanceScore: performanceData,
      competitorBenchmark: 'Performing above 60% of tracked competitors'
    },
    marketPosition: {
      trafficRank: 'Estimated #3 in market based on competitor analysis',
      spendEfficiency: 'ROI 25% higher than competitor average',
      growthOpportunity: '40% potential traffic increase available'
    }
  };
  
  res.json(integrationInsights);
});

// Simulate competitor data updates
setInterval(() => {
  competitors.forEach(competitor => {
    if (competitor.status === 'active') {
      // Update metrics with small random changes
      competitor.metrics.adSpend += (Math.random() - 0.5) * 1000;
      competitor.metrics.estimatedTraffic += (Math.random() - 0.5) * 5000;
      competitor.metrics.socialEngagement += (Math.random() - 0.5) * 200;
      
      // Ensure minimum values
      competitor.metrics.adSpend = Math.max(1000, competitor.metrics.adSpend);
      competitor.metrics.estimatedTraffic = Math.max(10000, competitor.metrics.estimatedTraffic);
      competitor.metrics.socialEngagement = Math.max(500, competitor.metrics.socialEngagement);
      
      // Update trends
      competitor.trends.adSpend = (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 20) + '%';
      competitor.trends.traffic = (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 15) + '%';
      competitor.trends.engagement = (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 25) + '%';
      
      // Update campaign metrics
      if (competitor.campaigns) {
        competitor.campaigns.forEach(campaign => {
          campaign.ctr = ((Math.random() * 3) + 1).toFixed(2);
          campaign.cpc = ((Math.random() * 2) + 0.5).toFixed(2);
        });
      }
    }
  });
}, 300000); // Update every 5 minutes

app.listen(PORT, () => {
  console.log(`Campaign Hub API running on port ${PORT}`);
  console.log(`Real-time Analytics available at http://localhost:${PORT}`);
  console.log(`Performance Scoring available at http://localhost:${PORT}`);
  console.log(`Automated Reports available at http://localhost:${PORT}`);
  console.log(`Budget Tracker available at http://localhost:${PORT}`);
  console.log(`A/B Test Manager available at http://localhost:${PORT}`);
  console.log(`Competitor Tracking available at http://localhost:${PORT}`);
  console.log(`Public Campaign Monitoring available at http://localhost:${PORT}`);
});