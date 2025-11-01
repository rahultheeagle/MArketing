# UTM Parameter Generator & Tracker

## Features
- ✅ Generate UTM URLs with proper parameters
- ✅ Save and manage UTM links
- ✅ Track clicks, conversions, and revenue
- ✅ Copy URLs to clipboard
- ✅ Local storage for persistence

## UTM Parameters Supported
- **utm_source**: Traffic source (google, facebook, newsletter)
- **utm_medium**: Marketing medium (cpc, email, social, display)
- **utm_campaign**: Campaign name (spring_sale, product_launch)
- **utm_term**: Paid keywords (optional)
- **utm_content**: Ad content identifier (optional)

## Usage

### 1. Generate UTM URLs
1. Open `utm-generator.html`
2. Fill in the required fields:
   - Website URL
   - Campaign Source
   - Campaign Medium  
   - Campaign Name
3. Add optional Term and Content
4. Click "Generate UTM URL"
5. Copy or save the generated URL

### 2. Track Performance
- Saved UTM links show simulated metrics:
  - Clicks
  - Conversions
  - Revenue
- Real tracking requires the tracking script

### 3. Website Integration
Include `utm-tracker.js` on your website:
```html
<script src="utm-tracker.js"></script>
```

Track conversions in your code:
```javascript
// Track a conversion with optional value
trackUtmConversion(99.99);
```

## API Endpoints
- `GET /api/utm-links` - Get all UTM links
- `POST /api/utm-links` - Create new UTM link
- `POST /api/utm-links/:id/track` - Track UTM events

## Example Generated URL
```
https://example.com?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=running+shoes&utm_content=banner_ad
```