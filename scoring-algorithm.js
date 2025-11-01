// Performance Scoring Algorithm - Advanced campaign performance evaluation
class PerformanceScorer {
    constructor() {
        this.weights = {
            roi: 0.30,        // Return on Investment
            ctr: 0.20,        // Click-through Rate
            conversion: 0.25, // Conversion Rate
            efficiency: 0.15, // Cost Efficiency
            engagement: 0.10  // Audience Engagement
        };
        
        this.benchmarks = {
            roi: { excellent: 50, good: 30, average: 15, poor: 0 },
            ctr: { excellent: 4.0, good: 2.5, average: 1.5, poor: 0.5 },
            conversion: { excellent: 3.0, good: 2.0, average: 1.0, poor: 0.3 },
            efficiency: { excellent: 0.5, good: 1.0, average: 2.0, poor: 5.0 },
            engagement: { excellent: 5.0, good: 3.0, average: 2.0, poor: 1.0 }
        };
    }
    
    // Calculate individual metric scores (0-100)
    calculateMetricScore(value, metric) {
        const bench = this.benchmarks[metric];
        
        if (metric === 'efficiency') {
            // Lower is better for efficiency (cost per conversion)
            if (value <= bench.excellent) return 100;
            if (value <= bench.good) return 80;
            if (value <= bench.average) return 60;
            if (value <= bench.poor) return 40;
            return 20;
        } else {
            // Higher is better for other metrics
            if (value >= bench.excellent) return 100;
            if (value >= bench.good) return 80;
            if (value >= bench.average) return 60;
            if (value >= bench.poor) return 40;
            return 20;
        }
    }
    
    // Calculate overall performance score
    calculateOverallScore(metrics) {
        const scores = {
            roi: this.calculateMetricScore(metrics.roi || 0, 'roi'),
            ctr: this.calculateMetricScore(metrics.ctr || 0, 'ctr'),
            conversion: this.calculateMetricScore(metrics.conversionRate || 0, 'conversion'),
            efficiency: this.calculateMetricScore(metrics.costPerConversion || 10, 'efficiency'),
            engagement: this.calculateMetricScore(metrics.engagementRate || 0, 'engagement')
        };
        
        const weightedScore = 
            scores.roi * this.weights.roi +
            scores.ctr * this.weights.ctr +
            scores.conversion * this.weights.conversion +
            scores.efficiency * this.weights.efficiency +
            scores.engagement * this.weights.engagement;
        
        return {
            overall: Math.round(weightedScore),
            breakdown: scores,
            grade: this.getGrade(weightedScore),
            factors: this.getFactorAnalysis(scores)
        };
    }
    
    // Get performance grade
    getGrade(score) {
        if (score >= 85) return { grade: 'A+', label: 'Excellent', color: '#059669' };
        if (score >= 75) return { grade: 'A', label: 'Very Good', color: '#0ea5e9' };
        if (score >= 65) return { grade: 'B', label: 'Good', color: '#f59e0b' };
        if (score >= 50) return { grade: 'C', label: 'Average', color: '#f97316' };
        if (score >= 35) return { grade: 'D', label: 'Below Average', color: '#dc2626' };
        return { grade: 'F', label: 'Poor', color: '#991b1b' };
    }
    
    // Analyze performance factors
    getFactorAnalysis(scores) {
        const factors = [];
        
        Object.entries(scores).forEach(([metric, score]) => {
            const factor = {
                name: this.getMetricName(metric),
                score,
                weight: this.weights[metric] * 100,
                status: score >= 80 ? 'strong' : score >= 60 ? 'moderate' : 'weak',
                impact: this.weights[metric] * 100
            };
            factors.push(factor);
        });
        
        return factors.sort((a, b) => b.impact - a.impact);
    }
    
    // Get metric display name
    getMetricName(metric) {
        const names = {
            roi: 'Return on Investment',
            ctr: 'Click-through Rate',
            conversion: 'Conversion Rate',
            efficiency: 'Cost Efficiency',
            engagement: 'Audience Engagement'
        };
        return names[metric] || metric;
    }
    
    // Generate performance recommendations
    generateRecommendations(scoreData, campaignName) {
        const recommendations = [];
        const { breakdown, overall } = scoreData;
        
        // ROI recommendations
        if (breakdown.roi < 60) {
            recommendations.push({
                title: 'Improve ROI Performance',
                description: 'Focus on higher-value conversions and reduce acquisition costs',
                impact: 'High',
                effort: 'Medium',
                expectedGain: '+8-12 points'
            });
        }
        
        // CTR recommendations
        if (breakdown.ctr < 60) {
            recommendations.push({
                title: 'Optimize Click-through Rate',
                description: 'A/B test ad creatives, headlines, and targeting',
                impact: 'Medium',
                effort: 'Low',
                expectedGain: '+5-8 points'
            });
        }
        
        // Conversion recommendations
        if (breakdown.conversion < 60) {
            recommendations.push({
                title: 'Enhance Conversion Rate',
                description: 'Optimize landing pages and improve user experience',
                impact: 'High',
                effort: 'High',
                expectedGain: '+10-15 points'
            });
        }
        
        // Efficiency recommendations
        if (breakdown.efficiency < 60) {
            recommendations.push({
                title: 'Improve Cost Efficiency',
                description: 'Refine targeting and bid strategies to reduce costs',
                impact: 'Medium',
                effort: 'Medium',
                expectedGain: '+6-10 points'
            });
        }
        
        // Engagement recommendations
        if (breakdown.engagement < 60) {
            recommendations.push({
                title: 'Boost Audience Engagement',
                description: 'Create more compelling content and interactive elements',
                impact: 'Low',
                effort: 'Medium',
                expectedGain: '+3-5 points'
            });
        }
        
        // High-performance scaling recommendations
        if (overall >= 80) {
            recommendations.push({
                title: 'Scale High-Performing Campaign',
                description: `${campaignName} is performing excellently. Consider increasing budget by 25-50%`,
                impact: 'High',
                effort: 'Low',
                expectedGain: 'Revenue increase'
            });
        }
        
        return recommendations.slice(0, 4); // Return top 4 recommendations
    }
    
    // Compare campaign performance
    compareCampaigns(campaigns) {
        const scoredCampaigns = campaigns.map(campaign => {
            const score = this.calculateOverallScore(campaign.metrics);
            return {
                ...campaign,
                performanceScore: score,
                rank: 0 // Will be set after sorting
            };
        });
        
        // Sort by overall score and assign ranks
        scoredCampaigns.sort((a, b) => b.performanceScore.overall - a.performanceScore.overall);
        scoredCampaigns.forEach((campaign, index) => {
            campaign.rank = index + 1;
        });
        
        return {
            campaigns: scoredCampaigns,
            summary: {
                totalCampaigns: scoredCampaigns.length,
                averageScore: scoredCampaigns.reduce((sum, c) => sum + c.performanceScore.overall, 0) / scoredCampaigns.length,
                topPerformer: scoredCampaigns[0],
                needsAttention: scoredCampaigns.filter(c => c.performanceScore.overall < 50)
            }
        };
    }
    
    // Calculate trend analysis
    calculateTrend(currentScore, historicalScores) {
        if (historicalScores.length < 2) return { trend: 'stable', change: 0 };
        
        const previousScore = historicalScores[historicalScores.length - 1];
        const change = currentScore - previousScore;
        const percentChange = (change / previousScore) * 100;
        
        return {
            trend: change > 2 ? 'improving' : change < -2 ? 'declining' : 'stable',
            change: Math.round(change),
            percentChange: Math.round(percentChange * 10) / 10,
            momentum: this.calculateMomentum(historicalScores)
        };
    }
    
    // Calculate performance momentum
    calculateMomentum(scores) {
        if (scores.length < 3) return 'insufficient_data';
        
        const recent = scores.slice(-3);
        const trend1 = recent[1] - recent[0];
        const trend2 = recent[2] - recent[1];
        
        if (trend1 > 0 && trend2 > 0) return 'accelerating';
        if (trend1 < 0 && trend2 < 0) return 'decelerating';
        if (Math.abs(trend1) < 1 && Math.abs(trend2) < 1) return 'stable';
        return 'volatile';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceScorer;
} else {
    window.PerformanceScorer = PerformanceScorer;
}