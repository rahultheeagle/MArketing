# CampaignPulse Setup Guide

## Quick Start Commands

### Option 1: Docker (Recommended)
```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Development Mode
```bash
# Install dependencies
npm install

# Start development server (no database required)
npm run dev
```

## What Each Command Does

### `docker-compose up -d`
- Starts PostgreSQL database
- Starts Redis cache
- Builds and runs Next.js app
- All services run in background (-d flag)
- App available at http://localhost:3000

### `npm install`
- Downloads all Node.js dependencies
- Sets up TypeScript and Next.js
- Installs database and Redis clients

### `npm run dev`
- Starts Next.js development server
- Hot reload for code changes
- Uses mock data if database unavailable
- App available at http://localhost:3000

## Troubleshooting

### If Docker fails:
```bash
# Check Docker is running
docker --version

# Try without background mode
docker-compose up
```

### If npm fails:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### If port 3000 is busy:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

## Development Features

- ✅ Works without database (uses mock data)
- ✅ Hot reload for instant updates
- ✅ TypeScript for better development
- ✅ Tailwind CSS for styling
- ✅ Chart.js for visualizations

## Production Features

- 🐳 Docker containerization
- 🗄️ PostgreSQL database
- ⚡ Redis caching
- 📊 Real-time analytics
- 🔒 Rate limiting
- 📈 Performance monitoring