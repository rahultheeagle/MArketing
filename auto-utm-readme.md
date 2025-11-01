# Auto UTM Generator & Performance Tracker

## 🚀 Automatic Features

### Auto-Generate UTM Links
- **Bulk Creation**: Generate UTM links for multiple channels at once
- **Content Variations**: Create multiple versions for A/B testing
- **Smart Naming**: Automatic campaign name formatting
- **Channel Presets**: Pre-configured source/medium combinations

### Real-Time Performance Tracking
- **Live Updates**: Performance metrics update every 5 seconds
- **Channel Breakdown**: Compare performance across channels
- **Overall Analytics**: Total clicks, conversions, revenue, CTR
- **Top Performers**: Identify best-performing links

## 📊 Supported Channels
- Google Ads (google/cpc)
- Facebook (facebook/social)
- Instagram (instagram/social)
- LinkedIn (linkedin/social)
- Email Newsletter (newsletter/email)
- Twitter (twitter/social)

## 🎯 How It Works

### 1. Auto-Generation Process
1. Enter base URL and campaign name
2. Select target channels
3. Add content variations (optional)
4. System generates all UTM combinations automatically

### 2. Performance Tracking
- Automatic tracking starts when you click "Start Performance Tracking"
- Real-time updates every 5 seconds
- Metrics include: clicks, conversions, revenue, CTR
- Channel-wise performance breakdown

### 3. Example Auto-Generated URLs
**Campaign**: "Black Friday 2024"
**Channels**: Google Ads, Facebook
**Content**: banner_top, sidebar_ad

**Generated URLs**:
```
https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=black_friday_2024&utm_content=banner_top
https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=black_friday_2024&utm_content=sidebar_ad
https://example.com?utm_source=facebook&utm_medium=social&utm_campaign=black_friday_2024&utm_content=banner_top
https://example.com?utm_source=facebook&utm_medium=social&utm_campaign=black_friday_2024&utm_content=sidebar_ad
```

## 🔧 API Endpoints
- `POST /api/utm-links/auto-generate` - Auto-generate UTM links
- `GET /api/utm-analytics` - Get performance analytics
- `POST /api/utm-links/:id/track` - Track performance events

## ⚡ Key Benefits
- **Time Saving**: Generate dozens of UTM links in seconds
- **Consistency**: Standardized naming conventions
- **Real-Time Insights**: Live performance monitoring
- **A/B Testing**: Easy content variation testing
- **Channel Comparison**: Compare performance across platforms