#!/bin/bash

# Quick test script for Sanity Blog integration

echo "🚀 Creative Job Hub - Sanity Blog Test"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -d "creative-job-hub-cms" ]; then
    echo "❌ Error: creative-job-hub-cms directory not found"
    echo "Please run this script from the creativejobhub-site root directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "creative-job-hub-cms/node_modules" ]; then
    echo "📦 Installing Sanity Studio dependencies..."
    cd creative-job-hub-cms
    npm install
    cd ..
    echo "✅ Dependencies installed"
    echo ""
fi

echo "Choose an option:"
echo "1. Start Sanity Studio (create/edit blog posts)"
echo "2. Deploy Studio to Sanity Cloud"
echo "3. Test local website with Python server"
echo "4. View setup guide"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🎨 Starting Sanity Studio..."
        echo "Studio will open at: http://localhost:3333"
        echo "Press Ctrl+C to stop"
        echo ""
        cd creative-job-hub-cms
        npm run dev
        ;;
    2)
        echo ""
        echo "☁️  Deploying Sanity Studio to cloud..."
        cd creative-job-hub-cms
        npx sanity deploy
        echo ""
        echo "✅ Studio deployed!"
        echo "Access it at: https://creativejobhub.sanity.studio"
        ;;
    3)
        echo ""
        echo "🌐 Starting local web server..."
        echo "Website will be available at: http://localhost:8000"
        echo "Press Ctrl+C to stop"
        echo ""
        python3 -m http.server 8000
        ;;
    4)
        echo ""
        cat SANITY_BLOG_SETUP.md
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
