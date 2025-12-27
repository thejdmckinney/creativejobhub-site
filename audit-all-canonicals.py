#!/usr/bin/env python3
"""
Comprehensive audit and fix of ALL canonical URLs across the entire site
Ensures they match the sitemap.xml exactly
"""

import os
import re
from pathlib import Path
import xml.etree.ElementTree as ET

def extract_urls_from_sitemap(sitemap_path):
    """Extract all URLs from sitemap.xml"""
    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    
    # Handle XML namespace
    namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = []
    
    for url in root.findall('ns:url', namespace):
        loc = url.find('ns:loc', namespace)
        if loc is not None:
            urls.append(loc.text)
    
    return urls

def get_canonical_from_file(file_path):
    """Extract canonical URL from HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find canonical tag
        match = re.search(r'<link rel="canonical" href="([^"]+)"', content, re.IGNORECASE)
        if match:
            return match.group(1)
    except Exception as e:
        print(f"   ⚠️  Error reading {file_path}: {e}")
    return None

def fix_canonical_in_file(file_path, expected_url):
    """Fix canonical URL in HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find and replace canonical tag
        pattern = r'<link rel="canonical" href="[^"]+"'
        replacement = f'<link rel="canonical" href="{expected_url}"'
        
        new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
    except Exception as e:
        print(f"   ⚠️  Error fixing {file_path}: {e}")
    return False

def url_to_file_path(url):
    """Convert sitemap URL to local file path"""
    # Remove base URL
    path = url.replace('https://www.creativejobhub.com', '')
    
    if not path or path == '/':
        return 'index.html'
    
    # Handle .html files
    if path.endswith('.html'):
        return path.lstrip('/')
    
    # Handle directory URLs with trailing slash
    if path.endswith('/'):
        return path.lstrip('/') + 'index.html'
    
    # Shouldn't happen but handle just in case
    return path.lstrip('/') + '/index.html'

def main():
    print("=" * 80)
    print("COMPREHENSIVE CANONICAL URL AUDIT")
    print("=" * 80)
    
    # Read sitemap
    sitemap_path = 'sitemap.xml'
    if not os.path.exists(sitemap_path):
        print(f"❌ Sitemap not found: {sitemap_path}")
        return
    
    urls = extract_urls_from_sitemap(sitemap_path)
    print(f"\n📋 Found {len(urls)} URLs in sitemap.xml\n")
    
    issues = []
    fixed = []
    correct = []
    missing = []
    
    for url in urls:
        file_path = url_to_file_path(url)
        
        # Skip if file doesn't exist
        if not os.path.exists(file_path):
            missing.append((url, file_path))
            continue
        
        canonical = get_canonical_from_file(file_path)
        
        if canonical is None:
            issues.append((url, file_path, "NO CANONICAL TAG FOUND"))
            print(f"❌ {file_path}")
            print(f"   Sitemap: {url}")
            print(f"   Issue: NO CANONICAL TAG\n")
        elif canonical != url:
            issues.append((url, file_path, f"Mismatch: {canonical}"))
            print(f"⚠️  {file_path}")
            print(f"   Sitemap:   {url}")
            print(f"   Canonical: {canonical}")
            
            # Fix it
            if fix_canonical_in_file(file_path, url):
                fixed.append(file_path)
                print(f"   ✅ FIXED\n")
            else:
                print(f"   ❌ FAILED TO FIX\n")
        else:
            correct.append(file_path)
            print(f"✅ {file_path} - CORRECT")
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ Correct:     {len(correct)}")
    print(f"🔧 Fixed:       {len(fixed)}")
    print(f"❌ Issues:      {len(issues) - len(fixed)}")
    print(f"📝 Missing:     {len(missing)}")
    print(f"📊 Total URLs:  {len(urls)}")
    
    if missing:
        print("\n" + "=" * 80)
        print("MISSING FILES (in sitemap but not on disk)")
        print("=" * 80)
        for url, file_path in missing:
            print(f"❌ {file_path} (URL: {url})")
    
    if len(issues) > len(fixed):
        print("\n⚠️  Some issues could not be automatically fixed!")
        print("Please review the output above.")
    elif len(fixed) > 0:
        print(f"\n🎉 Successfully fixed {len(fixed)} canonical URLs!")
    else:
        print("\n🎉 All canonical URLs are correct!")

if __name__ == '__main__':
    main()
