#!/usr/bin/env python3
"""
Replace all incorrect Sanity CDN script tags with the correct one in all HTML files.
"""
import re
from pathlib import Path

OLD_CDN = 'https://cdn.jsdelivr.net/npm/@sanity/client@6.22.7/dist/index.browser.js'
NEW_CDN = 'https://cdn.jsdelivr.net/npm/@sanity/client@6.22.7/dist/sanityClient.browser.min.js'

for html_file in Path('.').rglob('*.html'):
    if 'creative-job-hub-cms' in str(html_file) or 'node_modules' in str(html_file) or 'admin' in str(html_file):
        continue
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content.replace(OLD_CDN, NEW_CDN)
    if new_content != content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'✅ Updated: {html_file}')
