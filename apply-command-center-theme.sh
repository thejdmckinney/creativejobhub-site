#!/bin/bash

# Command Center Theme Transformation Script
# Transforms Creative Job Hub site to a professional command center aesthetic

echo "🎨 Applying Command Center Theme to Creative Job Hub..."
echo ""

# Color mappings (old → new)
# Bright backgrounds → Dark command center
# White backgrounds → Dark panels
# Bright gradients → Subtle tech gradients
# Orange accents → Blue tech accents

# Find all HTML files
HTML_FILES=$(find . -name "*.html" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/admin/*")

echo "📝 Found $(echo "$HTML_FILES" | wc -l) HTML files to process"
echo ""

for file in $HTML_FILES; do
  echo "Processing: $file"
  
  # Background colors: White → Dark command center
  sed -i '' 's/background: #ffffff/background: #0f1419/g' "$file"
  sed -i '' 's/background:#ffffff/background:#0f1419/g' "$file"
  sed -i '' 's/background: white/background: #0f1419/g' "$file"
  sed -i '' 's/background:white/background:#0f1419/g' "$file"
  
  # Secondary backgrounds
  sed -i '' 's/background: #f9fafb/background: #1a1f26/g' "$file"
  sed -i '' 's/background:#f9fafb/background:#1a1f26/g' "$file"
  sed -i '' 's/background: #f5f5f5/background: #1a1f26/g' "$file"
  sed -i '' 's/background:#f5f5f5/background:#1a1f26/g' "$file"
  
  # Panel backgrounds
  sed -i '' 's/background: #f3f4f6/background: #1e2530/g' "$file"
  sed -i '' 's/background:#f3f4f6/background:#1e2530/g' "$file"
  
  # Text colors: Dark → Light for dark background
  sed -i '' 's/color: #2d2d2d/color: #e4e7eb/g' "$file"
  sed -i '' 's/color:#2d2d2d/color:#e4e7eb/g' "$file"
  sed -i '' 's/color: #1f2937/color: #e4e7eb/g' "$file"
  sed -i '' 's/color:#1f2937/color:#e4e7eb/g' "$file"
  sed -i '' 's/color: #374151/color: #d1d5db/g' "$file"
  sed -i '' 's/color:#374151/color:#d1d5db/g' "$file"
  
  # Muted text
  sed -i '' 's/color: #4b5563/color: #8b92a0/g' "$file"
  sed -i '' 's/color:#4b5563/color:#8b92a0/g' "$file"
  sed -i '' 's/color: #6b7280/color: #8b92a0/g' "$file"
  sed -i '' 's/color:#6b7280/color:#8b92a0/g' "$file"
  
  # Bright orange accent → Professional blue
  sed -i '' 's/#ff6b35/#3b82f6/g' "$file"
  sed -i '' 's/#f59e0b/#3b82f6/g' "$file"
  sed -i '' 's/#d97706/#2563eb/g' "$file"
  
  # Bright gradients → Subtle tech gradients
  sed -i '' 's/linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)/linear-gradient(135deg, #1e293b 0%, #334155 100%)/g' "$file"
  sed -i '' 's/linear-gradient(135deg, #10b981 0%, #059669 100%)/linear-gradient(135deg, #1e293b 0%, #334155 100%)/g' "$file"
  sed -i '' 's/linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)/linear-gradient(135deg, #1e293b 0%, #334155 100%)/g' "$file"
  sed -i '' 's/linear-gradient(135deg, #f59e0b 0%, #d97706 100%)/linear-gradient(135deg, #1e293b 0%, #334155 100%)/g' "$file"
  
  # Light gradient backgrounds → Dark subtle
  sed -i '' 's/linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)/linear-gradient(135deg, #1e2530 0%, #2a3441 100%)/g' "$file"
  sed -i '' 's/linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)/linear-gradient(135deg, #1e2530 0%, #2a3441 100%)/g' "$file"
  sed -i '' 's/linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)/linear-gradient(135deg, #1e2530 0%, #2a3441 100%)/g' "$file"
  sed -i '' 's/linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)/linear-gradient(135deg, #1e2530 0%, #2a3441 100%)/g' "$file"
  
  # White to dark gradient backgrounds
  sed -i '' 's/linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)/linear-gradient(180deg, #0f1419 0%, #1a1f26 100%)/g' "$file"
  sed -i '' 's/linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)/linear-gradient(135deg, #1a1f26 0%, #0f1419 100%)/g' "$file"
  
  # Light borders → Dark borders with blue accent
  sed -i '' 's/border: 1px solid #d1d5db/border: 1px solid rgba(59,130,246,0.2)/g' "$file"
  sed -i '' 's/border:1px solid #d1d5db/border:1px solid rgba(59,130,246,0.2)/g' "$file"
  sed -i '' 's/border: 2px solid #d1d5db/border: 2px solid rgba(59,130,246,0.2)/g' "$file"
  sed -i '' 's/border:2px solid #d1d5db/border:2px solid rgba(59,130,246,0.2)/g' "$file"
  sed -i '' 's/border: 1px solid #e5e7eb/border: 1px solid rgba(59,130,246,0.15)/g' "$file"
  sed -i '' 's/border:1px solid #e5e7eb/border:1px solid rgba(59,130,246,0.15)/g' "$file"
  
  # Badge backgrounds
  sed -i '' 's/background: #dbeafe/background: rgba(59,130,246,0.15)/g' "$file"
  sed -i '' 's/background:#dbeafe/background:rgba(59,130,246,0.15)/g' "$file"
  sed -i '' 's/color: #1e40af/color: #60a5fa/g' "$file"
  sed -i '' 's/color:#1e40af/color:#60a5fa/g' "$file"
  
  # Input fields
  sed -i '' 's/background:#ffffff; border:1px solid #d1d5db; color:#2d2d2d/background:#1e2530; border:1px solid rgba(59,130,246,0.2); color:#e4e7eb/g' "$file"
  
done

echo ""
echo "✅ Theme transformation complete!"
echo "🎨 Command Center aesthetic applied to all pages"
echo ""
echo "Key changes:"
echo "  • Backgrounds: White → Dark (#0f1419, #1a1f26)"
echo "  • Text: Dark → Light (#e4e7eb)"
echo "  • Accents: Orange → Blue (#3b82f6)"
echo "  • Borders: Gray → Blue accent (rgba(59,130,246,0.2))"
echo "  • Gradients: Bright → Subtle tech gradients"
echo ""
