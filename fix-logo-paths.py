#!/usr/bin/env python3
"""Fix incorrect CJH_circle_logo.png references to use the correct path."""

import os
import re
from pathlib import Path

def fix_logo_references(file_path):
    """Fix logo references in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Fix the incorrect lowercase path to the correct one
        content = content.replace(
            '/assets/CJH_circle_logo.png',
            '/assets/illustrations/CJH_Circle_Logo.png'
        )
        
        # Also fix any other case variations
        content = re.sub(
            r'/assets/CJH_circle_logo\.png',
            '/assets/illustrations/CJH_Circle_Logo.png',
            content,
            flags=re.IGNORECASE
        )
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to fix all HTML files."""
    root_dir = Path('.')
    html_files = list(root_dir.rglob('*.html'))
    
    fixed_count = 0
    
    print("Fixing logo references...")
    for html_file in html_files:
        if fix_logo_references(html_file):
            print(f"✓ Fixed: {html_file}")
            fixed_count += 1
    
    print(f"\nDone! Fixed {fixed_count} file(s).")

if __name__ == '__main__':
    main()
