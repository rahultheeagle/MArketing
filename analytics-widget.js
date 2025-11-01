// Real-time Analytics Widget - Embeddable component
class RealTimeAnalyticsWidget {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.apiBase = options.apiBase || 'http://localhost:3001/api';
        this.updateInterval = options.updateInterval || 5000; // 5 seconds
        this.metrics = {
            clicks: 0,
            conversions: 0,
            revenue: 0,
            conversionRate: 0
        };
        this.init();
    }

    init() {
        this.render();
        this.startUpdates();
    }

    render() {
        this.container.innerHTML = `
            <div class="analytics-widget" style="
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: Arial, sans-serif;
            ">
                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #333;">Live Analytics</h3>
                    <div class="live-dot" style="
                        width: 8px;
                        height: 8px;
                        background: #22c55e;
                        border-radius: 50%;
                        animation: pulse 1s infinite;
                    "></div>
                </div>
                
                <div class="metrics-grid" style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                ">
                    <div class="metric-item" style="text-align: center; padding: 10px;">
                        <div class="metric-value" id="widget-clicks" style="
                            font-size: 24px;
                            font-weight: bold;
                            color: #dc2626;
                        ">0</div>
                        <div style="font-size: 12px; color: #666;">Clicks</div>
                    </div>
                    
                    <div class="metric-item" style="text-align: center; padding: 10px;">
                        <div class="metric-value" id="widget-conversions" style="
                            font-size: 24px;
                            font-weight: bold;
                            color: #059669;
                        ">0</div>
                        <div style="font-size: 12px; color: #666;">Conversions</div>
                    </div>
                    
                    <div class="metric-item" style="text-align: center; padding: 10px;">
                        <div class="metric-value" id="widget-revenue" style="
                            font-size: 24px;
                            font-weight: bold;
                            color: #7c3aed;
                        ">$0</div>
                        <div style="font-size: 12px; color: #666;">Revenue</div>
                    </div>
                    
                    <div class="metric-item" style="text-align: center; padding: 10px;">
                        <div class="metric-value" id="widget-rate" style="
                            font-size: 24px;
                            font-weight: bold;
                            color: #ea580c;
                        ">0%</div>
                        <div style="font-size: 12px; color: #666;">Conv. Rate</div>
                    </div>
                </div>
                
                <div style="margin-top: 15px; text-align: center;">
                    <small style="color: #666;">Last updated: <span id="widget-timestamp">--</span></small>
                </div>
            </div>
            
            <style>
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
        `;
    }

    async fetchMetrics() {
        try {
            const response = await fetch(`${this.apiBase}/real-time-analytics`);
            const data = await response.json();
            
            this.metrics = {
                clicks: data.totalClicks,
                conversions: data.totalConversions,
                revenue: data.totalRevenue,
                conversionRate: data.conversionRate
            };
            
            this.updateDisplay();
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        }
    }

    updateDisplay() {
        document.getElementById('widget-clicks').textContent = this.metrics.clicks.toLocaleString();
        document.getElementById('widget-conversions').textContent = this.metrics.conversions.toLocaleString();
        document.getElementById('widget-revenue').textContent = `$${this.metrics.revenue.toLocaleString()}`;
        document.getElementById('widget-rate').textContent = `${this.metrics.conversionRate}%`;
        document.getElementById('widget-timestamp').textContent = new Date().toLocaleTimeString();
    }

    startUpdates() {
        // Initial fetch
        this.fetchMetrics();
        
        // Set up interval updates
        setInterval(() => {
            this.fetchMetrics();
        }, this.updateInterval);
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Make it globally available
window.RealTimeAnalyticsWidget = RealTimeAnalyticsWidget;