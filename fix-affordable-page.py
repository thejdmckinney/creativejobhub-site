import re

file_path = '/Users/jeremymckinney/Documents/GitHub/creativejobhub-site/affordable-field-service-software/index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the GTM script block
gtm_pattern = r'(<!doctype html>\s*<html lang="en">\s*<head>\s*)(<!-- Google Tag Manager -->.*?<!-- End Google Tag Manager -->\s*)(.*?<meta charset="utf-8" />.*?<meta name="viewport"[^>]+/>\s*)(.*?<title>.*?</title>.*?<meta name="description"[^>]+/>.*?<link rel="canonical"[^>]+/>)'

match = re.search(gtm_pattern, content, re.DOTALL)

if match:
    doctype_and_head = match.group(1)
    gtm_block = match.group(2)
    charset_viewport = match.group(3)
    title_desc_canonical = match.group(4)
    
    # Reorder: doctype -> charset/viewport -> title/desc/canonical -> GTM
    new_head_start = doctype_and_head + charset_viewport + title_desc_canonical + '\n  ' + gtm_block
    
    # Replace in content
    content = content[:match.start()] + new_head_start + content[match.end():]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Fixed: affordable-field-service-software/index.html")
else:
    print("Could not find pattern to reorder")
