# ROI Monitor - Real-time Clicks, Conversions & ROI Tracking

## 🎯 Core Features

### Real-time ROI Monitoring
- **Live ROI Calculation**: Updates every 2 seconds
- **Profit/Loss Tracking**: Net profit with color-coded indicators
- **Spend vs Revenue**: Real-time comparison
- **ROI Percentage**: Instant ROI calculation with trend indicators

### Click & Conversion Tracking
- **Live Click Counter**: Real-time click monitoring
- **Conversion Tracking**: Instant conversion updates
- **Conversion Rate**: Live calculation and display
- **Campaign Attribution**: Track performance by campaign

### Advanced Analytics
- **Dual-axis Charts**: ROI % and Revenue on same chart
- **Campaign Breakdown**: Individual campaign ROI analysis
- **Change Indicators**: Percentage change with color coding
- **Historical Trends**: Time-series ROI visualization

## 📊 Metrics Tracked

### Primary ROI Metrics
- **Total ROI**: `((Revenue - Spend) / Spend) × 100`
- **Total Spend**: Real-time ad spend tracking
- **Total Revenue**: Live revenue monitoring
- **Net Profit**: Revenue minus spend

### Performance Metrics
- **Live Clicks**: Real-time click counting
- **Live Conversions**: Instant conversion tracking
- **Conversion Rate**: `(Conversions / Clicks) × 100`
- **Revenue per Click**: `Revenue / Clicks`

### Campaign-Level Tracking
- Individual campaign ROI
- Campaign-specific clicks/conversions
- Spend allocation per campaign
- Revenue attribution by source

## 🚀 Implementation

### 1. ROI Dashboard
Open `roi-monitor.html` for full ROI monitoring:
```html
<!-- Displays live ROI metrics, charts, and campaign breakdown -->
```

### 2. Website Integration
Include `roi-tracker.js` on your website:
```html
<script src="roi-tracker.js"></script>
<meta name="campaign-id" content="1">
```

### 3. Manual Tracking
Track conversions manually:
```javascript
// Track a conversion with revenue
trackROIConversion(99.99);

// Get current session stats
const stats = getROIStats();
console.log(stats); // { clicks: 5, conversions: 1, revenue: 99.99, roi: 9899% }
```

### 4. Automatic Tracking
Auto-track conversions with CSS classes:
```html
<!-- Auto-tracked purchase button -->
<button class="purchase-btn" data-revenue="49.99">Buy Now</button>

<!-- Auto-tracked form submission -->
<form class="conversion-form" data-revenue="199.99">
    <!-- form fields -->
</form>
```

## 🔧 API Endpoints

### ROI Monitoring
- `GET /api/roi-monitor` - Get current ROI metrics
- `POST /api/roi-track` - Track ROI events
- `POST /api/roi-session` - Send session data

### Event Tracking
```javascript
// Track different event types
{
  "campaignId": 1,
  "type": "click|conversion|spend",
  "amount": 99.99,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 📈 ROI Calculation Examples

### Positive ROI
- **Spend**: $1,000
- **Revenue**: $1,500
- **ROI**: `((1500 - 1000) / 1000) × 100 = 50%`
- **Status**: 🟢 Profitable

### Negative ROI
- **Spend**: $1,000
- **Revenue**: $800
- **ROI**: `((800 - 1000) / 1000) × 100 = -20%`
- **Status**: 🔴 Loss

### Break-even
- **Spend**: $1,000
- **Revenue**: $1,000
- **ROI**: `((1000 - 1000) / 1000) × 100 = 0%`
- **Status**: ⚪ Break-even

## 🎨 Visual Indicators

### ROI Color Coding
- **Green**: Positive ROI (profitable)
- **Red**: Negative ROI (loss)
- **Gray**: Zero ROI (break-even)

### Change Indicators
- **Green Arrow Up**: Positive change
- **Red Arrow Down**: Negative change
- **Percentage**: Exact change amount

### Campaign Status
- **ROI Badge**: Color-coded ROI percentage
- **Performance Bars**: Visual campaign comparison
- **Trend Arrows**: Performance direction

## ⚡ Key Benefits

### Business Intelligence
- **Instant ROI Visibility**: See profitability immediately
- **Campaign Optimization**: Identify best/worst performers
- **Budget Allocation**: Data-driven spending decisions
- **Profit Maximization**: Focus on profitable campaigns

### Technical Features
- **2-Second Updates**: Ultra-fast refresh rate
- **Automatic Tracking**: No manual intervention needed
- **Cross-Campaign**: Track multiple campaigns simultaneously
- **Historical Data**: Trend analysis and forecasting