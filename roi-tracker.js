// ROI Tracking Script - Include on your website to track ROI events
(function() {
    'use strict';
    
    const API_BASE = 'http://localhost:3001/api';
    
    // ROI Tracker Class
    class ROITracker {
        constructor(campaignId) {
            this.campaignId = campaignId;
            this.sessionData = {
                clicks: 0,
                conversions: 0,
                revenue: 0,
                startTime: new Date().toISOString()
            };
            this.init();
        }
        
        init() {
            // Track page view as potential click
            this.trackClick();
            
            // Set up conversion tracking
            this.setupConversionTracking();
            
            // Track session data
            this.trackSession();
        }
        
        trackClick() {
            this.sessionData.clicks++;
            this.sendTrackingData('click');
        }
        
        trackConversion(revenue = 0) {
            this.sessionData.conversions++;
            this.sessionData.revenue += revenue;
            this.sendTrackingData('conversion', revenue);
        }
        
        trackSpend(amount) {
            this.sendTrackingData('spend', amount);
        }
        
        sendTrackingData(type, amount = 0) {
            fetch(`${API_BASE}/roi-track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId: this.campaignId,
                    type: type,
                    amount: amount,
                    timestamp: new Date().toISOString(),
                    page: window.location.pathname,
                    referrer: document.referrer
                })
            }).catch(err => console.log('ROI tracking failed:', err));
        }
        
        setupConversionTracking() {
            // Auto-track form submissions as conversions
            document.addEventListener('submit', (e) => {
                if (e.target.classList.contains('conversion-form')) {
                    const revenue = parseFloat(e.target.dataset.revenue) || 0;
                    this.trackConversion(revenue);
                }
            });
            
            // Auto-track purchase buttons
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('purchase-btn') || 
                    e.target.classList.contains('buy-now') ||
                    e.target.classList.contains('add-to-cart')) {
                    const revenue = parseFloat(e.target.dataset.revenue) || 0;
                    this.trackConversion(revenue);
                }
            });
        }
        
        trackSession() {
            // Send session data periodically
            setInterval(() => {
                this.sendSessionData();
            }, 30000); // Every 30 seconds
            
            // Send data on page unload
            window.addEventListener('beforeunload', () => {
                this.sendSessionData();
            });
        }
        
        sendSessionData() {
            navigator.sendBeacon(`${API_BASE}/roi-session`, JSON.stringify({
                campaignId: this.campaignId,
                sessionData: this.sessionData,
                timestamp: new Date().toISOString()
            }));
        }
        
        // Public methods for manual tracking
        manualConversion(revenue = 0) {
            this.trackConversion(revenue);
        }
        
        getSessionStats() {
            return {
                ...this.sessionData,
                roi: this.sessionData.revenue > 0 ? 
                    ((this.sessionData.revenue / 1) * 100).toFixed(2) : 0, // Assuming $1 cost per click
                conversionRate: this.sessionData.clicks > 0 ? 
                    ((this.sessionData.conversions / this.sessionData.clicks) * 100).toFixed(2) : 0
            };
        }
    }
    
    // Auto-initialize if campaign ID is in URL or meta tag
    function autoInitialize() {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        let campaignId = urlParams.get('campaign_id') || urlParams.get('cid');
        
        // Check meta tag
        if (!campaignId) {
            const metaTag = document.querySelector('meta[name="campaign-id"]');
            if (metaTag) {
                campaignId = metaTag.getAttribute('content');
            }
        }
        
        // Check data attribute on body
        if (!campaignId) {
            campaignId = document.body.getAttribute('data-campaign-id');
        }
        
        if (campaignId) {
            window.roiTracker = new ROITracker(parseInt(campaignId));
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInitialize);
    } else {
        autoInitialize();
    }
    
    // Make ROITracker globally available
    window.ROITracker = ROITracker;
    
    // Global tracking functions
    window.trackROIConversion = function(revenue = 0) {
        if (window.roiTracker) {
            window.roiTracker.manualConversion(revenue);
        }
    };
    
    window.getROIStats = function() {
        if (window.roiTracker) {
            return window.roiTracker.getSessionStats();
        }
        return null;
    };
    
})();