#!/usr/bin/env python3
"""
Update OG/Twitter images across the site to use the new og-image-main.png
"""
import os
import re
from pathlib import Path

# Base URL for the new images
NEW_IMAGE_URL = "https://www.creativejobhub.com/assets/illustrations/og-image-main.png"

# Old patterns to match and replace (various formats)
OLD_PATTERNS = [
    r'https?://(?:www\.)?creativejobhub\.com/assets/og-dark\.jpg',
    r'https?://(?:www\.)?creativejobhub\.com/assets/og-[a-z-]+\.jpg',
    r'https?://(?:www\.)?creativejobhub\.com/assets/og-images/[a-z-]+\.jpg',
    r'/assets/images/blog/default-hero-1200\.svg',
]

# Files/directories to skip
SKIP_FILES = {
    'update-og-images.py',
    'blog/post-template.html',  # Template file
    'blog/posts/_template.html',  # Template file
    'assets/og-images/generator.html',  # Generator tool
}

# Directories that are already done
SKIP_DIRS = {
    'industries',  # Already updated
    '.git',
    'node_modules',
    '__pycache__',
}

def should_process_file(filepath):
    """Check if file should be processed"""
    # Skip if in skip list
    for skip in SKIP_FILES:
        if str(filepath).endswith(skip):
            return False
    
    # Skip if in industries directory (already done)
    parts = filepath.parts
    for skip_dir in SKIP_DIRS:
        if skip_dir in parts:
            return False
    
    return True

def update_file(filepath):
    """Update OG/Twitter images in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = False
        
        # Replace all old patterns with new URL
        for pattern in OLD_PATTERNS:
            if re.search(pattern, content):
                content = re.sub(pattern, NEW_IMAGE_URL, content)
                changes_made = True
        
        # Only write if changes were made
        if changes_made and content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Updated: {filepath}")
            return True
        
        return False
        
    except Exception as e:
        print(f"❌ Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    base_path = Path(__file__).parent
    updated_count = 0
    
    print("🔍 Scanning for HTML files with old OG images...\n")
    
    # Find all HTML files
    html_files = []
    for root, dirs, files in os.walk(base_path):
        # Remove skip directories from dirs to prevent os.walk from descending into them
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        
        for file in files:
            if file.endswith('.html'):
                filepath = Path(root) / file
                if should_process_file(filepath):
                    html_files.append(filepath)
    
    print(f"Found {len(html_files)} HTML files to check\n")
    
    # Process each file
    for filepath in html_files:
        if update_file(filepath):
            updated_count += 1
    
    print(f"\n✨ Complete! Updated {updated_count} files")

if __name__ == "__main__":
    main()
