#!/usr/bin/env python3
"""
Fix canonical URLs in feature pages to include trailing slashes
"""

import os
import re
from pathlib import Path

def fix_canonical_in_file(file_path):
    """Fix canonical URL in a single file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to find canonical URLs without trailing slash
    pattern = r'(<link rel="canonical" href="https://www\.creativejobhub\.com/features/[^/"]+)"'
    replacement = r'\1/"'
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    features_dir = Path('features')
    fixed_count = 0
    
    # Find all index.html files in feature subdirectories
    for index_file in features_dir.glob('*/index.html'):
        if fix_canonical_in_file(index_file):
            print(f"✅ Fixed: {index_file}")
            fixed_count += 1
        else:
            print(f"⏭️  Skipped (already correct or no match): {index_file}")
    
    print(f"\n✅ Fixed {fixed_count} canonical URLs")

if __name__ == '__main__':
    main()
