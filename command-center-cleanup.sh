#!/bin/bash

# Command Center Theme - Additional Cleanup Pass
# This script catches any remaining bright colors and inconsistencies

echo "🎨 Running Command Center Theme Cleanup Pass..."
echo ""

HTML_FILES=$(find . -name "*.html" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/admin/*")

for file in $HTML_FILES; do
  # Old brand color references
  sed -i '' 's/#1e3a5f/#3b82f6/g' "$file"
  sed -i '' 's/#27ae60/#0ea5e9/g' "$file"
  
  # Any remaining bright colors
  sed -i '' 's/#ffd4c4/#60a5fa/g' "$file"
  sed -i '' 's/#10b981/#3b82f6/g' "$file"
  sed -i '' 's/#059669/#2563eb/g' "$file"
  
  # Light blue badges → Dark blue
  sed -i '' 's/rgba(255,107,53,0.2)/rgba(59,130,246,0.15)/g' "$file"
  sed -i '' 's/rgba(255,107,53,0.4)/rgba(59,130,246,0.3)/g' "$file"
  
  # Update any remaining hover shadow colors
  sed -i '' 's/rgba(30,58,95,0.15)/rgba(59,130,246,0.2)/g' "$file"
  
  # Checkmark colors in lists
  sed -i '' 's/color:#10b981/color:#3b82f6/g' "$file"
  sed -i '' 's/color: #10b981/color: #3b82f6/g' "$file"
  
  # Replace any rgba background overlays for hero sections
  sed -i '' 's/rgba(30,58,95,0.92)/rgba(15,20,25,0.95)/g' "$file"
  sed -i '' 's/rgba(30,58,95,0.88)/rgba(26,31,38,0.92)/g' "$file"
  
  # Update any light shadow colors
  sed -i '' 's/rgba(0,0,0,0.08)/rgba(0,0,0,0.3)/g' "$file"
  
  # Box shadows with old colors
  sed -i '' 's/0 8px 24px rgba(255,107,53,0.4)/0 4px 16px rgba(59,130,246,0.4)/g' "$file"
  
  # Border colors on e5e7eb
  sed -i '' 's/border-top: 1px solid #e5e7eb/border-top: 1px solid rgba(59,130,246,0.15)/g' "$file"
  sed -i '' 's/border-top:1px solid #e5e7eb/border-top:1px solid rgba(59,130,246,0.15)/g' "$file"
  sed -i '' 's/border-bottom: 1px solid #e5e7eb/border-bottom: 1px solid rgba(59,130,246,0.15)/g' "$file"
  sed -i '' 's/border-bottom:1px solid #e5e7eb/border-bottom:1px solid rgba(59,130,246,0.15)/g' "$file"
  
  # Make sure all nav/header elements are dark
  sed -i '' 's/background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))/background: linear-gradient(180deg, rgba(59,130,246,.08), rgba(59,130,246,.04))/g' "$file"
  
done

echo ""
echo "✅ Cleanup pass complete!"
echo ""
echo "Additional refinements:"
echo "  • Old brand colors updated to new blue scheme"
echo "  • All checkmarks and accents now blue"
echo "  • Hero overlays darkened"
echo "  • Shadows adjusted for dark theme"
echo "  • Borders standardized to blue accent"
echo ""
