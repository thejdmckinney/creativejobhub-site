#!/bin/bash

# Restructure features to use clean URLs (directories with index.html)

echo "🔄 Restructuring features for clean URLs..."
echo ""

cd features

# List of all feature HTML files (without .html extension)
features=(
  "ai-receptionist"
  "analytics"
  "automations"
  "boost-reviews"
  "client-management"
  "convert-quotes-to-jobs"
  "earn-referrals"
  "get-paid"
  "job-detail-tracking"
  "keep-techs-organized"
  "marketing-campaigns"
  "one-click-invoicing"
  "optimized-scheduling"
  "property-management"
  "requests-and-bookings"
  "simplified-communications"
  "smart-estimates"
)

for feature in "${features[@]}"; do
  if [ -f "${feature}.html" ]; then
    echo "  📁 Creating directory: ${feature}/"
    mkdir -p "${feature}"
    
    echo "  📄 Moving ${feature}.html → ${feature}/index.html"
    mv "${feature}.html" "${feature}/index.html"
    
    echo "  ✅ ${feature} restructured"
    echo ""
  fi
done

cd ..

echo "✅ All features restructured for clean URLs!"
echo ""
echo "New URL structure:"
echo "  /features/boost-reviews.html  →  /features/boost-reviews/"
echo "  /features/analytics.html      →  /features/analytics/"
echo "  ... and so on"
echo ""
