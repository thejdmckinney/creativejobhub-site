# Quick Start: Create Your First CMS Page

## ✅ Integration Complete!

Your website is now connected to Sanity CMS. Here's how to test it:

## Step 1: Create a Test Page in Studio

1. **Open your Studio**: http://localhost:3333/
2. **Click "Pages"** in the sidebar
3. **Click the "+" button** to create a new page
4. **Fill in the basics**:
   - **Title**: "Test Page" (internal name)
   - **URL Slug**: Click "Generate" → it will create "test-page"
   - **Page Template**: Choose "Landing Page"

## Step 2: Add Some Sections

Click "+ Add item" under "Page Sections" and try adding:

### 1. Hero Section
- **Heading**: "Welcome to Our CMS-Powered Site!"
- **Subheading**: "This page is built entirely with Sanity Studio"
- **CTA Buttons**: Add a button
  - Text: "Get Started"
  - URL: "/pricing.html"
  - Style: Primary
- **Height**: Standard

### 2. Features Section
- **Section Title**: "Why Use Our CMS?"
- **Features**: Add 3 features:
  1. Icon: `fa-bolt`, Title: "Lightning Fast", Description: "Pages load instantly"
  2. Icon: `fa-paint-brush`, Title: "Easy to Edit", Description: "No coding required"
  3. Icon: `fa-mobile`, Title: "Mobile Ready", Description: "Works on all devices"
- **Layout**: Grid - 3 Columns

### 3. CTA Section
- **Heading**: "Ready to Get Started?"
- **Description**: "Join thousands of businesses using Creative Job Hub"
- **Buttons**: Add a button
  - Text: "Start Free Trial"
  - URL: "/demos/trial-signup.html"
  - Style: Primary

## Step 3: Configure SEO

Scroll down to "SEO Settings":
- **Meta Title**: "Test Page - Creative Job Hub"
- **Meta Description**: "Testing our new CMS integration"

## Step 4: Publish

- Scroll to top
- Toggle **"Published"** to ON
- Click **"Publish"** button in the bottom right

## Step 5: View Your Page

Open your browser to:
```
http://localhost:8000/cms-test.html?page=test-page
```

🎉 **You should see your page rendered with all the sections you created!**

---

## Files Created for Integration

### 1. `/assets/js/sanity-client.js`
API client with helper functions:
- `getPage(slug)` - Fetch a page by slug
- `getAllPages()` - Get all published pages
- `getSiteSettings()` - Get global settings
- `getNavigation(title)` - Get menu by title
- `getTestimonials()` - Get testimonials
- `getBlogPosts()` - Get blog posts
- `getFAQs()` - Get FAQs

### 2. `/assets/js/page-renderer.js`
Dynamic page renderer:
- Converts Sanity sections to HTML
- Applies SEO metadata
- Handles all 8 section types
- Image optimization

### 3. `/cms-test.html`
Demo page that uses the renderer
- Query parameter: `?page=YOUR-SLUG`
- Fully styled with your theme

---

## Next Steps

### Making Existing Pages CMS-Powered

You can convert any existing page to use Sanity:

1. **Create the page in Studio** with matching content
2. **Add this to your HTML**:
```html
<main id="page-content"></main>

<script type="module">
  import {renderPage} from '/assets/js/page-renderer.js'
  renderPage('your-page-slug', document.getElementById('page-content'))
</script>
```

### Deploy Studio for Your Team

When ready to let your team access the Studio from anywhere:

```bash
cd creative-job-hub-cms
npx sanity deploy
```

This creates a hosted Studio at `https://creativejobhub.sanity.studio`

### Add Auto-Deploy Webhooks

Make your site rebuild automatically when content changes:

1. Go to https://www.sanity.io/manage/project/53m7wbm0
2. Navigate to **API** → **Webhooks**
3. Add your hosting provider's webhook URL
4. Every time you publish in Studio, your site rebuilds!

---

## Troubleshooting

### "Page not found"
- Check the slug in Studio matches URL parameter
- Make sure page is Published (toggle is ON)
- Check browser console for errors

### Images not loading
- Make sure images have been uploaded in Studio
- Check CORS is configured (should be ✅)
- Verify image URLs in browser dev tools

### Sections not rendering
- Check browser console for JavaScript errors
- Verify section has required fields filled in
- Try refreshing the Studio page

### CORS errors
Run these commands:
```bash
cd creative-job-hub-cms
npx sanity cors add http://localhost:8000 --credentials
npx sanity cors add https://creativejobhub.com --credentials
```

---

## What You Can Do Now

✅ Create unlimited pages without touching code
✅ Drag-and-drop sections to build pages
✅ Upload and manage images centrally
✅ Control SEO for every page
✅ Manage navigation menus dynamically
✅ Add testimonials and FAQs
✅ Publish/unpublish with one click
✅ Let your team edit content safely

**Just like Wix, but you own everything!** 🎉

---

## Need Help?

- **Studio Guide**: See `CMS_USER_GUIDE.md`
- **Technical Docs**: See `INTEGRATION_GUIDE.md`
- **Sanity Docs**: https://www.sanity.io/docs
