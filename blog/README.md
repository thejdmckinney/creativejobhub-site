# Blog System Documentation

## Overview
Complete blog system for Creative Job Hub with SEO optimization, RSS feeds, and responsive design.

## Structure
```
blog/
├── index.html                              # Blog index page
├── post-template.html                      # Template for new blog posts
├── feed.xml                                # RSS feed
├── assets/                                 # Blog-specific assets (images, etc.)
└── posts/
    └── [post-slug]/
        └── index.html                      # Individual blog post
```

## Creating New Blog Posts

### 1. Create Post Directory
```bash
mkdir blog/posts/your-post-slug
```

### 2. Copy Template
```bash
cp blog/post-template.html blog/posts/your-post-slug/index.html
```

### 3. Customize Post
Replace these placeholders in the new post:
- `[POST_TITLE]` - Title of the blog post
- `[POST_DESCRIPTION]` - Meta description for SEO
- `[POST_SLUG]` - URL-friendly version of title
- `[POST_IMAGE]` - Featured image filename
- `[PUBLISH_DATE]` - ISO date format (2025-11-02T10:00:00Z)
- `[MODIFIED_DATE]` - ISO date format
- `[PUBLISH_DATE_FORMATTED]` - Human readable (November 2, 2025)
- `[READ_TIME]` - Estimated reading time in minutes
- `[CATEGORY]` - Blog post category/tag
- `[TAGS]` - Comma-separated tags

### 4. Add Content
Replace the template content with your blog post content using proper HTML structure.

### 5. Update RSS Feed
Add new post entry to `blog/feed.xml`:
```xml
<item>
  <title>Your Post Title</title>
  <description>Your post description</description>
  <link>https://creativejobhub.com/blog/posts/your-post-slug/</link>
  <guid>https://creativejobhub.com/blog/posts/your-post-slug/</guid>
  <pubDate>Fri, 01 Nov 2024 10:00:00 GMT</pubDate>
  <author>hello@creativejobhub.com (Creative Job Hub Team)</author>
  <category>Your Category</category>
</item>
```

### 6. Update Blog Index (Optional)
For featured posts, you can update `blog/index.html` to replace the "Coming Soon" section with actual blog post cards.

## SEO Features
- Proper meta tags and Open Graph
- Structured data (JSON-LD) for articles
- Canonical URLs
- RSS feed
- Sitemap integration
- Twitter Cards

## Navigation
Blog links have been added to:
- Dynamic header (`assets/header.html`)
- All inline navigation menus
- Sitemap (`sitemap.xml`)

## Styling
- Responsive design
- Dark theme matching site
- Professional typography
- Mobile-optimized
- Fast loading

## RSS Feed
Available at: `https://creativejobhub.com/blog/feed.xml`

## Example Post
See: `blog/posts/getting-started-field-service-management/index.html`

## Next Steps
1. Create blog post content
2. Add featured images to `blog/assets/`
3. Update RSS feed with new posts
4. Consider adding blog post listing to homepage
5. Set up Google Analytics for blog traffic tracking