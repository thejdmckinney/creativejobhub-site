#!/bin/bash

# Update sitemap with latest blog posts from Sanity

echo "🗺️  Generating updated sitemap from Sanity..."
echo ""

cd ~/Documents/GitHub/creativejobhub-site

# Generate and save sitemap
node generate-sitemap.js > sitemap-new.xml 2>&1

# Check if generation was successful
if grep -q "urlset" sitemap-new.xml; then
    # Remove the console output lines
    sed -n '/<\?xml/,/<\/urlset>/p' sitemap-new.xml > sitemap.xml
    rm sitemap-new.xml
    
    echo "✅ Sitemap updated successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Review the sitemap.xml file"
    echo "   2. Commit and push: git add sitemap.xml && git commit -m 'Update sitemap' && git push"
    echo ""
else
    echo "❌ Error generating sitemap"
    cat sitemap-new.xml
    rm sitemap-new.xml
    exit 1
fi
