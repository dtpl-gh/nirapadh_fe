#!/bin/bash

# Environment Setup Helper Script
# This script helps set up environment variables for different scenarios

set -e

echo "🚀 Nirapadh Frontend - Environment Setup Helper"
echo "================================================"
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "✓ .env.local already exists"
else
    echo "Creating .env.local for local development..."
    cp .env.example .env.local
    echo "✓ Created .env.local - please edit it with your local settings"
fi

# Check if .env.docker already exists
if [ -f ".env.docker" ]; then
    echo "✓ .env.docker already exists"
else
    echo "Creating .env.docker for Docker deployments..."
    cp .env.example .env.docker
    echo "✓ Created .env.docker - please edit it with your Docker settings"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Edit .env.local with your local development settings:"
echo "   - BACKEND_URL=http://localhost:8080 (your Spring Boot server)"
echo "   - API_KEY=your_api_key (if needed)"
echo ""
echo "2. For local development, run:"
echo "   npm install && npm run dev"
echo ""
echo "3. For Docker deployment, run:"
echo "   docker-compose up --build"
echo ""
echo "4. For custom environments, copy and modify:"
echo "   cp .env.example .env.custom"
echo "   docker-compose --env-file .env.custom up --build"
echo ""
echo "📖 For detailed documentation, see ENV_SETUP_GUIDE.md"
echo ""

