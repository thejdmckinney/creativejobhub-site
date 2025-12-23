# CMS Integration Plan

## Overview

Your Sanity Studio CMS is now fully configured with:

✅ **Page Builder** - 8 flexible section types (hero, features, testimonials, CTA, text, pricing, FAQ, images)
✅ **Media Library** - Organized image management with tags and categories  
✅ **Blog System** - Posts and categories
✅ **Testimonials** - Customer success stories
✅ **FAQs** - Organized question/answer pairs
✅ **Site Settings** - Global configuration (logo, contact, social, SEO defaults)
✅ **Navigation** - Dynamic menu management with sub-menus
✅ **SEO Tools** - Per-page meta tags, Open Graph, social sharing

## Current Status

### ✅ Completed
- Sanity Studio installed and running (http://localhost:3333/)
- All content schemas created and registered
- Custom Studio structure for easy navigation
- User guide created for team members

### 🔄 Next Steps (To Connect Studio to Website)

To make your website pull content from Sanity, you'll need:

#### 1. **Install Sanity Client** (in main project)
```bash
npm install @sanity/client @sanity/image-url
```

#### 2. **Configure CORS** (allow website to fetch from Sanity)
```bash
cd creative-job-hub-cms
npx sanity cors add http://localhost:3000 --credentials
npx sanity cors add https://creativejobhub.com --credentials
```

#### 3. **Create API Utilities**
Create a `lib/sanity.js` file to fetch content:
```javascript
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '53m7wbm0',
  dataset: 'production',
  useCdn: true, // Use CDN for faster response
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}
```

#### 4. **Fetch Content Example**
```javascript
// Get a page by slug
async function getPage(slug) {
  return await client.fetch(
    `*[_type == "page" && slug.current == $slug && published == true][0]{
      title,
      sections,
      seo
    }`,
    { slug }
  )
}

// Get all testimonials
async function getTestimonials() {
  return await client.fetch(
    `*[_type == "testimonial"] | order(displayOrder asc){
      customerName,
      company,
      quote,
      companyLogo
    }`
  )
}
```

#### 5. **Render Sections Dynamically**
Create a component to render page sections based on type:
```javascript
function renderSection(section) {
  switch(section._type) {
    case 'heroSection':
      return renderHero(section)
    case 'featuresSection':
      return renderFeatures(section)
    case 'testimonialsSection':
      return renderTestimonials(section)
    // ... etc
  }
}
```

## Schema Reference

### Content Types

#### **page**
Main page builder document with:
- `title` - Internal page name
- `slug` - URL path
- `pageTemplate` - Template style
- `sections[]` - Array of section objects
- `seo` - SEO settings object
- `published` - Boolean to control visibility

#### **blogPost**
Blog articles with:
- `title`, `slug`, `excerpt`
- `body` (blockContent) - Rich text
- `mainImage` - Featured image
- `categories[]` - References to category documents
- SEO fields

#### **testimonial**
Customer success stories:
- `customerName`, `company`, `location`, `industry`
- `quote` - The testimonial text
- `companyLogo` - Customer logo
- `featured` - Show on homepage
- `displayOrder` - Sort order

#### **faq**
FAQ entries:
- `question`, `answer`
- `category` - Group FAQs
- `displayOrder`
- `showOnHomepage`

#### **mediaAsset**
Media library items:
- `title`, `description`
- `file` (image) - The actual image
- `tags[]` - Searchable tags
- `category` - Organize by type

#### **siteSettings**
Global site configuration (singleton):
- `siteName`, `siteUrl`, `logo`
- `contactInfo` - Email, phone, address
- `socialLinks` - Social media URLs
- `defaultSeo` - Fallback SEO settings
- `analytics` - GA/GTM IDs

#### **navigation**
Menu structures:
- `title` - Menu name
- `items[]` - Navigation items with:
  - `title` - Link text
  - `url` or `page` reference
  - `children[]` - Sub-menu items

### Section Types

All sections can be added to pages:

1. **heroSection** - Hero banners with CTAs
2. **featuresSection** - Feature grids/lists  
3. **testimonialsSection** - Customer testimonials
4. **ctaSection** - Call-to-action blocks
5. **textSection** - Rich text content
6. **pricingSection** - Pricing tables
7. **faqSection** - FAQ accordions
8. **imageSection** - Standalone images

## Deployment

### Deploy Studio to Production

When ready to deploy the Studio for your team:

```bash
cd creative-job-hub-cms
npx sanity deploy
```

This will:
- Create a hosted Studio at `https://your-project.sanity.studio`
- Make it accessible to your team from anywhere
- Auto-deploy updates when you push changes

### Environment Variables

For production website, add these to your hosting (Vercel, Netlify, etc.):
```
SANITY_PROJECT_ID=53m7wbm0
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
```

## GROQ Query Examples

GROQ is Sanity's query language. Here are useful queries:

### Get Published Pages
```groq
*[_type == "page" && published == true]{
  title,
  "slug": slug.current,
  pageTemplate,
  sections,
  seo
}
```

### Get Featured Testimonials
```groq
*[_type == "testimonial" && featured == true] | order(displayOrder asc){
  customerName,
  company,
  quote,
  industry
}
```

### Get Blog Posts with Categories
```groq
*[_type == "blogPost"] | order(publishedAt desc){
  title,
  "slug": slug.current,
  excerpt,
  mainImage,
  categories[]->{
    title,
    "slug": slug.current
  }
}
```

### Get Site Settings
```groq
*[_type == "siteSettings"][0]{
  siteName,
  logo,
  contactInfo,
  socialLinks,
  defaultSeo
}
```

### Get Navigation Menu
```groq
*[_type == "navigation" && title == "Main Menu"][0]{
  items[]{
    title,
    url,
    page->{
      "slug": slug.current
    },
    children
  }
}
```

## Image Optimization

Use Sanity's CDN for automatic image optimization:

```javascript
// Original: slow, large file
<img src={post.mainImage.asset.url} />

// Optimized: fast, responsive
<img 
  src={urlFor(post.mainImage)
    .width(800)
    .height(600)
    .fit('crop')
    .auto('format')
    .url()
  } 
/>
```

Parameters:
- `width()` / `height()` - Resize dimensions
- `fit('crop' | 'fill' | 'scale')` - How to fit
- `auto('format')` - WebP for modern browsers
- `quality(80)` - Compression level

## Architecture Options

### Option 1: Static Site Generation (Recommended)
Build HTML at deploy time, rebuild when content changes:
- Fastest performance
- Best SEO
- Use with: Next.js, Astro, 11ty

### Option 2: Server-Side Rendering
Fetch content on each request:
- Always fresh content
- Good for frequently changing data
- Use with: Next.js, Remix, SvelteKit

### Option 3: Client-Side Rendering
Fetch content in browser:
- Simplest to implement
- Can work with current HTML site
- Slightly slower initial load

### Option 4: Hybrid (Best of Both)
- Static pages for main content
- Client-side for dynamic sections
- Update specific sections without full rebuild

## Webhooks (Auto-Deploy on Content Changes)

Set up webhooks to automatically rebuild your site when content changes:

1. Go to https://www.sanity.io/manage/project/53m7wbm0
2. Navigate to API → Webhooks
3. Add webhook pointing to your hosting provider
4. Your site rebuilds automatically when you publish content!

Example webhook URLs:
- Vercel: `https://api.vercel.com/v1/integrations/deploy/[token]`
- Netlify: `https://api.netlify.com/build_hooks/[id]`

## Performance Tips

1. **Use the CDN** - Set `useCdn: true` in client config
2. **Image Optimization** - Always use `urlFor()` helper
3. **Projections** - Only fetch fields you need in GROQ
4. **Caching** - Cache API responses for 60 seconds
5. **Lazy Loading** - Load images below fold lazily

## Security

- Studio is password-protected (Sanity login)
- API is read-only by default (public content safe)
- For write operations, use API tokens with specific permissions
- Keep tokens in environment variables, never in code

## Team Workflow

1. **Content Creators** - Use Studio to create/edit content
2. **Reviewers** - Review drafts before publishing
3. **Publishers** - Click publish to make live
4. **Developers** - Handle integration and styling

## Support

- Sanity Documentation: https://www.sanity.io/docs
- GROQ Cheat Sheet: https://www.sanity.io/docs/query-cheat-sheet
- Community: https://slack.sanity.io

---

## Quick Start Checklist

- [ ] Studio running locally ✅
- [ ] Content schemas created ✅
- [ ] Install Sanity client in main project
- [ ] Configure CORS for your domain
- [ ] Create API utilities file
- [ ] Build section rendering components
- [ ] Test with sample content
- [ ] Deploy Studio for team access
- [ ] Set up webhooks for auto-deploy
- [ ] Train team on CMS usage
