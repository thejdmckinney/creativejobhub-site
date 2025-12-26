#!/usr/bin/env python3
"""
Update all internal links from old industry URLs to new /industries/ structure
"""
import os
import re

# Define the mappings
industry_mappings = {
    '/hvac-field-service-software/': '/industries/hvac/',
    '/plumbing-field-service-software/': '/industries/plumbing/',
    '/electrical-field-service-software/': '/industries/electrical/',
    '/landscaping-field-service-software/': '/industries/landscaping/',
    '/handyman-field-service-software/': '/industries/handyman/',
    '/appliance-repair-field-service-software/': '/industries/appliance-repair/',
    '/carpet-cleaning-field-service-software/': '/industries/carpet-cleaning/',
    '/chimney-service-field-service-software/': '/industries/chimney-service/',
    '/home-cleaning-field-service-software/': '/industries/home-cleaning/',
    '/window-cleaning-field-service-software/': '/industries/window-cleaning/',
    '/garage-door-field-service-software/': '/industries/garage-door/',
    '/pool-service-field-service-software/': '/industries/pool-service/',
    '/pressure-washing-field-service-software/': '/industries/pressure-washing/',
    '/pest-control-field-service-software/': '/industries/pest-control/',
    '/general-contractor-field-service-software/': '/industries/general-contractor/',
}

def update_file(filepath):
    """Update industry URLs in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace all old URLs with new ones
        for old_url, new_url in industry_mappings.items():
            # Also handle HTTPS versions for canonical and og:url tags
            content = content.replace(f'https://www.creativejobhub.com{old_url}', f'https://www.creativejobhub.com{new_url}')
            content = content.replace(f'https://creativejobhub.com{old_url}', f'https://www.creativejobhub.com{new_url}')
            content = content.replace(old_url, new_url)
        
        # Only write if changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'✓ Updated: {filepath}')
            return True
        return False
    except Exception as e:
        print(f'✗ Error updating {filepath}: {e}')
        return False

def main():
    """Main function to update all HTML files"""
    updated_count = 0
    
    # Get all HTML files in the workspace
    for root, dirs, files in os.walk('/Users/jeremymckinney/Documents/GitHub/creativejobhub-site'):
        # Skip certain directories
        if any(skip in root for skip in ['.git', 'node_modules', '.vscode']):
            continue
            
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                if update_file(filepath):
                    updated_count += 1
    
    print(f'\n✓ Complete! Updated {updated_count} files')

if __name__ == '__main__':
    main()
