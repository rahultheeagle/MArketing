// UTM Tracking Script - Include this on your website to track UTM parameters
(function() {
    'use strict';
    
    const API_BASE = 'http://localhost:3001/api';
    
    // Extract UTM parameters from current URL
    function getUtmParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            source: urlParams.get('utm_source'),
            medium: urlParams.get('utm_medium'),
            campaign: urlParams.get('utm_campaign'),
            term: urlParams.get('utm_term'),
            content: urlParams.get('utm_content')
        };
    }
    
    // Track UTM visit
    function trackUtmVisit(utmParams) {
        if (!utmParams.source || !utmParams.medium || !utmParams.campaign) {
            return; // No valid UTM parameters
        }
        
        // Store UTM data in session storage
        sessionStorage.setItem('utm_data', JSON.stringify(utmParams));
        
        // Send tracking data to server
        fetch(`${API_BASE}/utm-links/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...utmParams,
                type: 'visit',
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            })
        }).catch(err => console.log('UTM tracking failed:', err));
    }
    
    // Track conversion (call this function when user converts)
    window.trackUtmConversion = function(value = 0) {
        const utmData = JSON.parse(sessionStorage.getItem('utm_data') || '{}');
        if (!utmData.source) return;
        
        fetch(`${API_BASE}/utm-links/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...utmData,
                type: 'conversion',
                value: value,
                timestamp: new Date().toISOString()
            })
        }).catch(err => console.log('UTM conversion tracking failed:', err));
    };
    
    // Initialize tracking on page load
    document.addEventListener('DOMContentLoaded', function() {
        const utmParams = getUtmParams();
        if (utmParams.source) {
            trackUtmVisit(utmParams);
        }
    });
    
})();