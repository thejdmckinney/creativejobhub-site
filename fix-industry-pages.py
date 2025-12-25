#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Find all industry page directories
base_dir = Path('/Users/jeremymckinney/Documents/GitHub/creativejobhub-site')
industry_dirs = list(base_dir.glob('*-field-service-software'))

fixed_count = 0
skipped_count = 0

for industry_dir in industry_dirs:
    index_file = industry_dir / 'index.html'
    
    if not index_file.exists():
        continue
    
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if GTM comes before title (the problem we're fixing)
    if content.find('<!-- Google Tag Manager -->') < content.find('<title>'):
        # Pattern: capture GTM block, then charset/viewport, then title/desc/canonical
        pattern = r'(<head>\s*)(<!-- Google Tag Manager -->.*?<!-- End Google Tag Manager -->\s*)(.*?)(<meta charset="utf-8" />.*?<meta name="viewport"[^>]+/>\s*)(.*?)(<title>.*?</title>.*?<meta name="description"[^>]+/>.*?<link rel="canonical"[^>]+/>)'
        
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            head_tag = match.group(1)
            gtm_block = match.group(2)
            between_gtm_charset = match.group(3)
            charset_viewport = match.group(4)
            between_viewport_title = match.group(5)
            title_desc_canonical = match.group(6)
            
            # Reorder: head -> charset/viewport -> title/desc/canonical -> GTM
            new_order = head_tag + charset_viewport + '\n  ' + title_desc_canonical + '\n\n  ' + gtm_block.strip()
            
            # Replace in content
            content = content[:match.start()] + new_order + content[match.end():]
            
            with open(index_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✓ Fixed: {industry_dir.name}")
            fixed_count += 1
        else:
            print(f"⚠ Pattern not found: {industry_dir.name}")
    else:
        print(f"○ Already correct: {industry_dir.name}")
        skipped_count += 1

print(f"\nSummary: Fixed {fixed_count}, Skipped {skipped_count}")
