#!/usr/bin/env python3
"""
Script to move <title> and meta tags before scripts in feature pages
for better crawlability by Google Sheets and other tools.
"""

import os
import re
from pathlib import Path

def fix_head_section(html_content):
    """Reorder head section to put title/meta before scripts."""
    
    # Check if already fixed (title comes before GTM script)
    if html_content.find('<title>') < html_content.find('<!-- Google Tag Manager -->'):
        print("  ✓ Already fixed, skipping")
        return None
    
    # Extract the head section
    head_match = re.search(r'<head>(.*?)</head>', html_content, re.DOTALL)
    if not head_match:
        print("  ✗ Could not find <head> section")
        return None
    
    head_content = head_match.group(1)
    
    # Extract GTM script
    gtm_pattern = r'(  <!-- Google Tag Manager -->.*?<!-- End Google Tag Manager -->)'
    gtm_match = re.search(gtm_pattern, head_content, re.DOTALL)
    if not gtm_match:
        print("  ✗ Could not find GTM script")
        return None
    gtm_script = gtm_match.group(1)
    
    # Extract Google Analytics script
    ga_pattern = r'(  <!-- Google tag \(gtag\.js\) -->.*?gtag\(\'config\', \'G-XKCW07R8CM\'\);\n  </script>)'
    ga_match = re.search(ga_pattern, head_content, re.DOTALL)
    if not ga_match:
        print("  ✗ Could not find GA script")
        return None
    ga_script = ga_match.group(1)
    
    # Extract charset/viewport
    charset_match = re.search(r'  <meta charset="utf-8" />', head_content)
    viewport_match = re.search(r'  <meta name="viewport"[^>]+/>', head_content)
    
    if not charset_match or not viewport_match:
        print("  ✗ Could not find meta tags")
        return None
    
    charset = charset_match.group(0)
    viewport = viewport_match.group(0)
    
    # Extract title and description
    title_match = re.search(r'  <title>.*?</title>', head_content)
    desc_match = re.search(r'  <meta name="description"[^>]+/>', head_content)
    canonical_match = re.search(r'  <link rel="canonical"[^>]+/>', head_content)
    
    if not title_match or not desc_match:
        print("  ✗ Could not find title or description")
        return None
    
    title = title_match.group(0)
    description = desc_match.group(0)
    canonical = canonical_match.group(0) if canonical_match else ""
    
    # Remove old positions of these elements
    head_content = re.sub(gtm_pattern, '', head_content, flags=re.DOTALL)
    head_content = re.sub(ga_pattern, '', head_content, flags=re.DOTALL)
    head_content = head_content.replace(charset, '')
    head_content = head_content.replace(viewport, '')
    head_content = head_content.replace(title, '')
    head_content = head_content.replace(description, '')
    if canonical:
        head_content = head_content.replace(canonical, '')
    
    # Remove extra whitespace
    head_content = re.sub(r'\n\n+', '\n\n', head_content)
    head_content = head_content.strip()
    
    # Build new head section with proper order
    new_head = f"""<head>
  {charset}
  {viewport}
  {title}
  {description}
  {canonical}

{gtm_script}
  
{ga_script}

{head_content}
</head>"""
    
    # Replace in full HTML
    new_html = re.sub(r'<head>.*?</head>', new_head, html_content, flags=re.DOTALL)
    
    return new_html

def main():
    features_dir = Path('features')
    
    if not features_dir.exists():
        print("Error: features directory not found")
        return
    
    fixed_count = 0
    skipped_count = 0
    error_count = 0
    
    # Process each feature subdirectory
    for feature_dir in sorted(features_dir.iterdir()):
        if not feature_dir.is_dir():
            continue
        
        index_file = feature_dir / 'index.html'
        if not index_file.exists():
            continue
        
        print(f"\n📄 Processing: {index_file}")
        
        try:
            # Read file
            with open(index_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Fix head section
            new_content = fix_head_section(content)
            
            if new_content is None:
                skipped_count += 1
                continue
            
            # Write back
            with open(index_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"  ✓ Fixed successfully")
            fixed_count += 1
            
        except Exception as e:
            print(f"  ✗ Error: {e}")
            error_count += 1
    
    print(f"\n{'='*50}")
    print(f"Summary:")
    print(f"  Fixed: {fixed_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Errors: {error_count}")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()
