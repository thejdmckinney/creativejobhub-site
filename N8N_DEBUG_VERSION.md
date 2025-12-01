# N8N Debug Version - Find the "[object Object]" Issue

## 🔍 **DIAGNOSTIC JavaScript Code**

Use this version first to see exactly what data structure n8n is receiving:

```javascript
// DIAGNOSTIC VERSION - Use this to debug your data structure
console.log('=== DEBUGGING N8N INPUT DATA ===');

// Get all input data
const inputData = $input.all();
console.log('Input data length:', inputData.length);
console.log('Full input structure:', JSON.stringify(inputData, null, 2));

// Try different ways to access the data
const firstItem = inputData[0];
console.log('First item:', JSON.stringify(firstItem, null, 2));
console.log('First item type:', typeof firstItem);

if (firstItem) {
  console.log('First item keys:', Object.keys(firstItem));
  
  if (firstItem.json) {
    console.log('First item.json:', JSON.stringify(firstItem.json, null, 2));
    console.log('First item.json keys:', Object.keys(firstItem.json));
  }
  
  if (firstItem.body) {
    console.log('First item.body:', JSON.stringify(firstItem.body, null, 2));
  }
  
  if (firstItem.data) {
    console.log('First item.data:', JSON.stringify(firstItem.data, null, 2));
  }
}

// Try to identify where the actual content is
const possibleData = firstItem?.json || firstItem?.body || firstItem?.data || firstItem || {};
console.log('Possible data object:', JSON.stringify(possibleData, null, 2));

// Check each field specifically
const fields = ['title', 'content', 'body', 'text', 'message', 'excerpt', 'tags', 'author'];
fields.forEach(field => {
  const value = possibleData[field];
  console.log(`Field "${field}":`, typeof value, JSON.stringify(value));
});

// Create a simple test output
return {
  debug: true,
  inputStructure: JSON.stringify(inputData, null, 2),
  possibleDataKeys: Object.keys(possibleData),
  diagnosticComplete: new Date().toISOString()
};
```

## 🛠️ **How to Use This:**

1. **Replace your n8n JavaScript** with the diagnostic version above
2. **Trigger your workflow** with test data
3. **Check the n8n execution logs** for all the console.log output
4. **Copy the log output** and I can help you identify the exact data structure
5. **Then we'll create the proper extraction code** based on your actual data format

## 🧩 **Common Data Structure Issues:**

### **Issue 1: Data in different property**
```javascript
// Instead of data.title, it might be:
data.fields.title
data.properties.title  
data.attributes.title
data.payload.title
```

### **Issue 2: Nested JSON strings**
```javascript
// Data might be double-encoded JSON
const actualData = JSON.parse(data.content);
```

### **Issue 3: Form data format**
```javascript
// Data might be in form format
const title = data.title?.value || data.title;
```

### **Issue 4: Array structure**
```javascript
// Data might be in an array
const actualData = data[0] || data.items[0] || data.results[0];
```

## 🎯 **Quick Fix Attempt**

If you want to try a quick fix without full debugging, try this enhanced version that handles multiple data structures:

```javascript
// QUICK FIX VERSION - Handles multiple data structures
const inputData = $input.all();
console.log('Input received:', JSON.stringify(inputData, null, 2));

// Try multiple extraction methods
let data = {};
if (inputData[0]?.json) {
  data = inputData[0].json;
} else if (inputData[0]?.body) {
  data = inputData[0].body;
} else if (inputData[0]?.data) {
  data = inputData[0].data;
} else {
  data = inputData[0] || {};
}

// If data is a JSON string, parse it
if (typeof data === 'string') {
  try {
    data = JSON.parse(data);
  } catch (e) {
    console.log('Failed to parse JSON string:', e);
  }
}

console.log('Extracted data:', JSON.stringify(data, null, 2));

// Super safe string extraction
function safeString(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  
  // Handle objects with common properties
  if (typeof value === 'object') {
    if (value.value) return String(value.value);
    if (value.text) return String(value.text);
    if (value.content) return String(value.content);
    if (value.data) return String(value.data);
    
    // Last resort: stringify the object
    return JSON.stringify(value);
  }
  
  return String(value || fallback);
}

// Extract all possible field variations
const title = safeString(
  data.title || data.subject || data.headline || data.name || data.Title,
  'Untitled Post'
);

const content = safeString(
  data.content || data.body || data.text || data.message || data.description || data.Content,
  'No content provided'
);

const excerpt = safeString(
  data.excerpt || data.summary || data.description,
  content.substring(0, 160) + '...'
);

// Handle tags more robustly
let tags = ['field service', 'business'];
if (data.tags) {
  if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map(t => t.trim());
  } else if (Array.isArray(data.tags)) {
    tags = data.tags.map(t => safeString(t)).filter(Boolean);
  }
}

// Generate slug
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const markdownContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${new Date().toISOString().split('T')[0]}"
author: "Creative Job Hub Team"
category: "Field Service Management"
tags: [${tags.map(t => `"${t.replace(/"/g, '\\"')}"`).join(', ')}]
excerpt: "${excerpt.replace(/"/g, '\\"')}"
image: "default-hero-1200.svg"
---

${content}

## Ready to Transform Your Field Service Business?

[Start Your Free Trial](https://app.creativejobhub.com/auth?mode=signup)
`;

console.log('Generated content preview:', markdownContent.substring(0, 500));

return {
  slug: slug,
  title: title,
  content: markdownContent,
  filename: `blog/posts/${slug}/index.md`,
  commit_message: `Add blog post: ${title}`
};
```

## 🚀 **Next Steps:**

1. **Use the diagnostic version** to identify your exact data structure
2. **Share the console logs** with me so I can create the perfect extraction code
3. **Or try the quick fix version** which handles most common data structures

The HTML wrapper pages are already working perfectly - we just need to fix the data extraction in your n8n workflow!