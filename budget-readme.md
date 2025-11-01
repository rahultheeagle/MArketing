# Budget Tracker

## 💰 Comprehensive Budget Management

### Real-time Budget Monitoring
- **Live Spending Tracking**: Monitor campaign spending in real-time
- **Budget Utilization**: Visual progress indicators and percentage tracking
- **Alert System**: Automated warnings when approaching budget limits
- **Multi-campaign Management**: Track budgets across all marketing channels

### Smart Budget Controls
- **Flexible Budget Setting**: Daily, weekly, monthly budget periods
- **Campaign Allocation**: Individual budget limits per campaign
- **Threshold Alerts**: Customizable warning levels (50-95%)
- **Overspend Protection**: Immediate notifications when budgets exceeded

## 📊 Budget Overview Features

### Visual Budget Dashboard
- **Progress Rings**: Circular progress indicators for budget utilization
- **Budget Cards**: Total, spent, remaining, and allocated amounts
- **Color-coded Status**: Green (safe), yellow (warning), red (critical)
- **Percentage Tracking**: Real-time utilization percentages

### Campaign Budget Breakdown
- **Individual Tracking**: Per-campaign budget monitoring
- **Progress Bars**: Visual spending progress with color indicators
- **Remaining Calculations**: Automatic remaining budget calculations
- **Status Indicators**: Over budget, on track, under budget status

## 🚨 Alert System

### Intelligent Budget Alerts
- **Threshold Warnings**: Alerts at 80% (customizable) budget utilization
- **Critical Notifications**: Immediate alerts when budget exceeded
- **Success Indicators**: Positive alerts for under-budget performance
- **Real-time Updates**: Live alert generation and display

### Alert Types
```javascript
{
  "warning": "Campaign has used 85% of monthly budget",
  "critical": "Campaign exceeded daily budget by $200", 
  "success": "Campaign is 40% under budget with strong ROI"
}
```

### Notification Methods
- **Email Alerts**: Automated email notifications
- **Dashboard Alerts**: In-app alert display
- **Combined Notifications**: Email + dashboard alerts

## 📈 Budget Analytics

### Spending Trends
- **Weekly Tracking**: Budget utilization over time
- **Daily Breakdown**: Day-by-day spending analysis
- **Comparative Analysis**: Budget vs actual spending trends
- **Forecasting**: Projected spending based on current trends

### Budget Performance Metrics
- **Utilization Rate**: Percentage of budget used
- **Spending Velocity**: Rate of budget consumption
- **Efficiency Tracking**: Cost per result metrics
- **ROI Integration**: Budget performance vs campaign ROI

## 🎯 Campaign Budget Management

### Individual Campaign Controls
```javascript
{
  "campaignId": "google-ads",
  "name": "Google Ads - Black Friday",
  "budget": 8000,
  "spent": 6800,
  "remaining": 1200,
  "period": "monthly",
  "dailyLimit": 300,
  "spentPercentage": 85,
  "status": "warning"
}
```

### Budget Allocation
- **Total Budget**: Overall marketing budget limit
- **Campaign Allocation**: Individual campaign budget limits
- **Unallocated Tracking**: Available budget for new campaigns
- **Reallocation Tools**: Move budget between campaigns

## 🚀 Implementation

### 1. Budget Tracker Dashboard
```html
<!-- Complete budget tracking interface -->
<script src="budget-tracker.html"></script>
```

### 2. API Integration
```javascript
// Get budget overview
fetch('/api/budget')
  .then(response => response.json())
  .then(data => {
    console.log('Total Budget:', data.totalBudget);
    console.log('Total Spent:', data.totalSpent);
    console.log('Remaining:', data.remaining);
  });
```

### 3. Set Campaign Budget
```javascript
// Set budget for specific campaign
fetch('/api/budget/campaign', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    campaignId: 'google-ads',
    budget: 8000,
    period: 'monthly',
    dailyLimit: 300
  })
});
```

### 4. Track Spending
```javascript
// Record campaign spending
fetch('/api/budget/spend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    campaignId: 'google-ads',
    amount: 150.50,
    description: 'Google Ads clicks - Dec 15'
  })
});
```

## 📋 Budget Status Types

### Status Classifications
- **Under Budget**: < 50% utilization (Green)
- **On Track**: 50-79% utilization (Blue)
- **Warning**: 80-99% utilization (Yellow)
- **Over Budget**: > 100% utilization (Red)

### Alert Thresholds
- **50%**: Informational milestone
- **80%**: Warning threshold (customizable)
- **95%**: Critical warning
- **100%**: Budget exceeded alert

## 💡 Smart Features

### Automated Budget Management
- **Real-time Updates**: Live spending tracking every 30 seconds
- **Automatic Calculations**: Remaining budget and percentages
- **Alert Generation**: Intelligent threshold-based alerts
- **Historical Tracking**: Spending history and trends

### Budget Optimization
- **Performance Integration**: Budget efficiency vs campaign ROI
- **Reallocation Suggestions**: Move budget to high-performing campaigns
- **Spending Forecasts**: Predict budget depletion dates
- **Cost Optimization**: Identify overspending opportunities

## 🔧 API Endpoints

### Budget Management
- `GET /api/budget` - Get complete budget overview
- `POST /api/budget/campaign` - Set campaign budget
- `POST /api/budget/spend` - Track campaign spending
- `PUT /api/budget/settings` - Update budget settings

### Analytics & Alerts
- `GET /api/budget/alerts` - Get current budget alerts
- `GET /api/budget/history` - Get spending history
- `GET /api/budget/forecast` - Get spending forecasts

## 📊 Budget Data Structure

### Complete Budget Overview
```javascript
{
  "totalBudget": 25000,
  "totalSpent": 15000,
  "totalAllocated": 22500,
  "remaining": 10000,
  "spentPercentage": 60.0,
  "allocatedPercentage": 90.0,
  "campaigns": [
    {
      "id": "google-ads",
      "name": "Google Ads - Black Friday",
      "budget": 8000,
      "spent": 6800,
      "remaining": 1200,
      "spentPercentage": 85.0,
      "status": "warning",
      "period": "monthly",
      "dailyLimit": 300
    }
  ],
  "alerts": [
    {
      "type": "warning",
      "message": "Google Ads has used 85% of budget",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Spending History
```javascript
{
  "period": "7d",
  "history": [
    {
      "date": "2024-01-15",
      "amount": 850,
      "campaigns": 5
    }
  ],
  "totalSpent": 5950,
  "averageDaily": 850
}
```

## 🎨 Visual Elements

### Progress Indicators
- **Circular Progress**: Budget utilization rings
- **Linear Bars**: Campaign-specific progress bars
- **Color Coding**: Status-based color indicators
- **Percentage Labels**: Exact utilization percentages

### Budget Cards
- **Total Budget**: Overall budget limit
- **Total Spent**: Current spending amount
- **Remaining**: Available budget
- **Allocated**: Assigned campaign budgets

### Alert Display
- **Warning Cards**: Yellow background for threshold alerts
- **Critical Cards**: Red background for exceeded budgets
- **Success Cards**: Green background for under-budget campaigns
- **Timestamp**: When alert was generated