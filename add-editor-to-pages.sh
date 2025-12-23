#!/bin/bash

# Script to add visual editor scripts to all HTML pages
# Skips files that already have the visual-editor.js script

EDITOR_SCRIPTS='  <!-- Visual Editor Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/@sanity/client@6.22.7/dist/index.browser.js"></script>
  <script src="/assets/js/visual-editor.js"></script>'

# Find all HTML files, excluding CMS and node_modules
find . -name "*.html" -type f \
  ! -path "./creative-job-hub-cms/*" \
  ! -path "./node_modules/*" \
  ! -path "./.git/*" \
  ! -path "./admin/*" | while read -r file; do
  
  # Check if file already has the visual editor
  if grep -q "visual-editor.js" "$file"; then
    echo "✓ Skipping $file (already has editor)"
  else
    # Check if file has a </head> tag
    if grep -q "</head>" "$file"; then
      # Add the scripts before </head>
      sed -i.bak "s|</head>|$EDITOR_SCRIPTS\n</head>|" "$file"
      rm "${file}.bak"
      echo "✓ Added editor to $file"
    else
      echo "⚠ Skipping $file (no </head> tag found)"
    fi
  fi
done

echo ""
echo "✅ Visual editor has been added to all pages!"
echo "🎨 Access editor on any page by adding ?editor=true to the URL"
