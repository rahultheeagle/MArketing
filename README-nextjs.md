# CampaignPulse - Next.js Analytics Platform

Modern marketing analytics dashboard built with Next.js, Drizzle ORM, PostgreSQL, and Redis.

## Tech Stack

- **Next.js 14**: Server-side rendering, API routes, dynamic dashboard
- **Drizzle ORM**: Type-safe database queries and migrations
- **PostgreSQL**: Campaign data, click events, analytics with JSONB
- **Redis**: Real-time metrics caching, rate limiting, pub/sub
- **Docker**: Complete containerized deployment

## Features

### 🚀 Performance
- Server-side rendered dashboard with caching
- Redis-powered real-time metrics
- Rate-limited tracking endpoints
- Optimized database queries with aggregations

### 📊 Analytics
- Time-series click event tracking
- Campaign performance aggregations
- Competitor monitoring with JSONB metadata
- A/B testing results storage

### 🔄 Real-time Updates
- Redis pub/sub for live dashboard updates
- Webhook endpoints for external integrations
- Rate limiting for API protection
- Cached analytics with TTL

### 🐳 Deployment
- Docker containerization
- Docker Compose for full stack
- PostgreSQL with persistent volumes
- Redis for caching and sessions

## Quick Start

```bash
# Clone and setup
git clone <repo>
cd campaignpulse

# Environment setup
cp .env.example .env.local
# Edit .env.local with your database credentials

# Docker deployment
docker-compose up -d

# Or local development
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

## API Endpoints

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign

### Analytics
- `GET /api/analytics` - Get analytics summary
- `POST /api/analytics` - Track click event

### Webhooks
- `POST /api/webhooks` - Handle external webhooks

## Database Schema

### Campaigns Table
- Campaign metadata with JSONB for flexible data
- Budget tracking and status management
- Channel configuration storage

### Click Events Table
- Time-series event tracking
- UTM parameter capture
- User agent and IP logging
- Flexible metadata with JSONB

### Competitors Table
- Competitor tracking data
- Metrics storage with JSONB
- Campaign monitoring data

## Redis Usage

### Caching
- Dashboard metrics (5min TTL)
- Campaign data (5min TTL)
- Analytics summaries (5min TTL)

### Rate Limiting
- 100 requests/minute per IP for analytics
- Configurable limits per endpoint

### Pub/Sub Channels
- `metrics:update` - Real-time metric updates
- `campaign:event` - Campaign lifecycle events
- `competitor:update` - Competitor data changes

## Docker Services

### Application
- Next.js app on port 3000
- Auto-restart on failure
- Environment variable injection

### PostgreSQL
- Persistent data volumes
- Automated backups
- Connection pooling ready

### Redis
- Memory optimization
- Persistence configuration
- Pub/sub ready

## Development

```bash
# Database operations
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations

# Docker operations
npm run docker:build # Build image
npm run docker:run   # Start services

# Development
npm run dev         # Start dev server
```

## Production Deployment

1. Set production environment variables
2. Build and deploy with Docker Compose
3. Configure reverse proxy (nginx)
4. Set up SSL certificates
5. Configure database backups
6. Monitor with logging service

## Monitoring

- Redis metrics for cache hit rates
- PostgreSQL query performance
- API endpoint response times
- Real-time dashboard updates
- Error tracking and alerting