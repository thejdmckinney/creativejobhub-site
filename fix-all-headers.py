#!/usr/bin/env python3
"""
Fix all HTML files to use the external header system consistently.
Removes inline header CSS and ensures all pages use site.css.
"""

import re
import os
from pathlib import Path

# Files that have inline header CSS
FILES_TO_FIX = [
    "contact.html",
    "terms.html",
    "thanks.html",
    "compare/housecall-pro-alternative.html",
    "compare/index.html",
    "compare/jobber-alternative.html",
    "compare/workiz-alternative.html"
]

def remove_inline_header_css(content):
    """
    Remove inline <style> blocks that contain .site-header CSS.
    Keep only external CSS link.
    """
    # Pattern to match <style>...</style> blocks containing .site-header
    style_pattern = r'<style[^>]*>.*?\.site-header\{.*?</style>'
    
    # Remove all <style> blocks that contain .site-header
    cleaned = re.sub(style_pattern, '', content, flags=re.DOTALL)
    
    return cleaned

def ensure_external_css(content):
    """
    Ensure the file has the external CSS link with the right version.
    """
    # Check if site.css is already linked
    if '/assets/site.css' not in content and '/assets/site.min.css' not in content:
        # Add it before </head>
        css_link = '  <link rel="stylesheet" href="/assets/site.css?v=23" />\n'
        content = content.replace('</head>', f'{css_link}</head>')
    else:
        # Update version number to v=23
        content = re.sub(
            r'/assets/site\.(min\.)?css\?v=\d+',
            r'/assets/site.\1css?v=23',
            content
        )
    
    return content

def fix_file(filepath):
    """
    Fix a single HTML file.
    """
    print(f"Fixing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_size = len(content)
    
    # Remove inline header CSS
    content = remove_inline_header_css(content)
    
    # Ensure external CSS is present
    content = ensure_external_css(content)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    new_size = len(content)
    bytes_removed = original_size - new_size
    
    if bytes_removed > 0:
        print(f"  ✅ Removed {bytes_removed} bytes of inline CSS")
    else:
        print(f"  ℹ️  No changes needed")
    
    return bytes_removed

def main():
    """
    Fix all HTML files with inline header CSS.
    """
    print("=" * 60)
    print("FIXING ALL HEADERS TO USE EXTERNAL CSS")
    print("=" * 60)
    print()
    
    total_bytes_removed = 0
    files_fixed = 0
    
    for filepath in FILES_TO_FIX:
        if os.path.exists(filepath):
            bytes_removed = fix_file(filepath)
            if bytes_removed > 0:
                files_fixed += 1
            total_bytes_removed += bytes_removed
        else:
            print(f"⚠️  File not found: {filepath}")
    
    print()
    print("=" * 60)
    print(f"✅ COMPLETE: Fixed {files_fixed} files")
    print(f"📦 Removed {total_bytes_removed:,} bytes of inline CSS")
    print("=" * 60)
    print()
    print("Next steps:")
    print("  1. Test the homepage and a few other pages")
    print("  2. Run: git add -A && git commit -m 'Remove inline header CSS from all pages'")
    print("  3. Run: git push origin main")

if __name__ == "__main__":
    main()
