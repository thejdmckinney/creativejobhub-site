#!/usr/bin/env python3
"""
Add Visual Editor scripts to all HTML files
"""

import os
import re
from pathlib import Path

# The editor scripts to add
EDITOR_SCRIPTS = """  <!-- Visual Editor Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/@sanity/client@6.22.7/dist/index.browser.js"></script>
  <script src="/assets/js/visual-editor.js"></script>
"""

def should_skip_file(filepath):
    """Check if file should be skipped"""
    skip_patterns = [
        'creative-job-hub-cms',
        'node_modules',
        '.git',
        'admin'
    ]
    return any(pattern in str(filepath) for pattern in skip_patterns)

def add_editor_to_file(filepath):
    """Add visual editor scripts to a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has the editor
        if 'visual-editor.js' in content:
            print(f"✓ Skipping {filepath} (already has editor)")
            return False
        
        # Check if has </head> tag
        if '</head>' not in content:
            print(f"⚠ Skipping {filepath} (no </head> tag found)")
            return False
        
        # Add scripts before </head>
        new_content = content.replace('</head>', f'{EDITOR_SCRIPTS}</head>')
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Added editor to {filepath}")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    root_dir = Path('.')
    html_files = root_dir.rglob('*.html')
    
    added_count = 0
    skipped_count = 0
    
    for filepath in html_files:
        if should_skip_file(filepath):
            continue
        
        if add_editor_to_file(filepath):
            added_count += 1
        else:
            skipped_count += 1
    
    print("\n" + "="*60)
    print(f"✅ Visual editor has been added to {added_count} pages!")
    print(f"⏭️  Skipped {skipped_count} pages")
    print("🎨 Access editor on any page by adding ?editor=true to the URL")
    print("="*60)

if __name__ == '__main__':
    main()
