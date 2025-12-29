#!/usr/bin/env python3
"""
Update all HTML files to use the latest header.js version (v=4)
"""
import os
import re
from pathlib import Path

def update_header_version(file_path):
    """Update header.js version from v=2 or v=3 to v=4"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Replace header.js?v=2 or v=3 with v=4
        content = re.sub(r'header\.js\?v=[23]', 'header.js?v=4', content)
        
        # Only write if changed
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    root_dir = Path('.')
    updated_count = 0
    
    # Find all HTML files (excluding node_modules, .git, etc.)
    html_files = []
    for ext in ['*.html']:
        html_files.extend(root_dir.rglob(ext))
    
    # Filter out unwanted directories
    html_files = [
        f for f in html_files 
        if not any(part.startswith('.') or part == 'node_modules' 
                   for part in f.parts)
    ]
    
    print(f"Found {len(html_files)} HTML files")
    
    for html_file in html_files:
        if update_header_version(html_file):
            print(f"✓ Updated: {html_file}")
            updated_count += 1
    
    print(f"\n✅ Updated {updated_count} files from header.js?v=2 or v=3 to v=4")

if __name__ == '__main__':
    main()
