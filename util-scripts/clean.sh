#!/bin/bash

# Project Cleanup Script
# Removes unnecessary files and optimizes the project

set -e

cd "$(dirname "$0")"

echo "🧹 Starting Project Cleanup..."
echo "================================"
echo ""

# 1. Remove old/duplicate documentation from root
echo "1️⃣ Cleaning up duplicate documentation files..."
[ -f "ENV_SETUP_GUIDE.md" ] && rm -f "ENV_SETUP_GUIDE.md" && echo "   ✓ Removed ENV_SETUP_GUIDE.md"
[ -f "ENV_SETUP_SUMMARY.md" ] && rm -f "ENV_SETUP_SUMMARY.md" && echo "   ✓ Removed ENV_SETUP_SUMMARY.md"
echo ""

# 2. Clean Next.js build cache
echo "2️⃣ Cleaning Next.js build cache..."
if [ -d ".next" ]; then
    rm -rf ".next"
    echo "   ✓ Removed .next directory"
else
    echo "   ℹ️  .next already clean"
fi
echo ""

# 3. Clean node_modules and package-lock
echo "3️⃣ Cleaning node_modules and package-lock..."
if [ -d "node_modules" ]; then
    rm -rf "node_modules"
    echo "   ✓ Removed node_modules"
else
    echo "   ℹ️  node_modules already clean"
fi

if [ -f "package-lock.json" ]; then
    rm -f "package-lock.json"
    echo "   ✓ Removed package-lock.json"
else
    echo "   ℹ️  package-lock.json already clean"
fi
echo ""

# 4. Clean temporary files
echo "4️⃣ Cleaning temporary files..."
find . -maxdepth 1 -name "*.log" -delete 2>/dev/null && echo "   ✓ Removed log files"
find . -maxdepth 1 -name ".DS_Store" -delete 2>/dev/null && echo "   ✓ Removed .DS_Store"
find . -maxdepth 1 -name "*.tmp" -delete 2>/dev/null && echo "   ✓ Removed temp files"
echo ""

# 5. Reinstall clean dependencies
echo "5️⃣ Reinstalling clean dependencies..."
echo "   This may take a minute..."
npm install --legacy-peer-deps > /dev/null 2>&1
echo "   ✓ Dependencies installed"
echo ""

echo "================================"
echo "✅ Project cleanup complete!"
echo ""
echo "📊 Cleanup Summary:"
echo "   ✓ Removed duplicate documentation"
echo "   ✓ Cleared Next.js cache"
echo "   ✓ Cleaned node_modules"
echo "   ✓ Removed temporary files"
echo "   ✓ Reinstalled dependencies"
echo ""
echo "🚀 Ready to develop!"
echo ""
echo "Next steps:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm run lint    - Check code quality"

