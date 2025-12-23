# Creative Job Hub CMS Guide

## 🎉 Welcome to Your Content Management System!

Your Sanity Studio is now a full-featured CMS that lets you manage your entire website without touching code - just like Wix, but custom-built for Creative Job Hub!

## 🚀 Getting Started

### Accessing the Studio

1. Open your terminal
2. Navigate to the cms folder: `cd creative-job-hub-cms`
3. Start the studio: `npm run dev`
4. Open your browser to: http://localhost:3333/

### Studio Overview

Your Studio is organized into these sections:

#### 📄 **Pages**
Build and manage all your website pages:
- Create new pages with custom URLs
- Choose from templates (Landing Page, Industry Page, Feature Page, etc.)
- Drag-and-drop sections to build your page
- Configure SEO settings per page
- Publish/unpublish pages

#### 📝 **Blog**
Manage your blog content:
- **Posts**: Create and edit blog articles
- **Categories**: Organize posts by category

#### ⭐ **Testimonials**
Store customer success stories:
- Customer quotes and details
- Company information
- Industry filtering
- Featured testimonials for homepage

#### ❓ **FAQs**
Manage frequently asked questions:
- Question and answer pairs
- Category organization
- Control which FAQs appear on homepage

#### 🖼️ **Media Library**
Your central image repository:
- Upload and organize images
- Add alt text for SEO
- Tag images for easy searching
- Categorize by type (hero, feature, screenshot, etc.)
- Reuse images across the entire site

#### ⚙️ **Site Settings**
Global website configuration:
- **General Settings**: Site name, logo, contact info, social links
- **Navigation Menus**: Manage header and footer navigation

---

## 🏗️ Building Pages

### The Page Builder

When creating a new page, you can add these section types:

#### 1. **Hero Section**
The big banner at the top of your page
- Heading and subheading
- Call-to-action buttons (up to 3)
- Background image or video
- Height options (standard, tall, full-screen)

#### 2. **Features Section**
Showcase product features or benefits
- Section title and description
- Individual feature cards with:
  - Icon (Font Awesome)
  - Title and description
  - Optional image
  - Optional link
- Layout options: 2, 3, or 4 column grid, or alternating list
- Background color options

#### 3. **Testimonials Section**
Display customer reviews
- Select testimonials from your library
- Display styles: carousel, grid, or single featured
- Background color options

#### 4. **Call-to-Action Section**
Encourage visitors to take action
- Bold heading and description
- Multiple CTA buttons
- Background image option
- Text alignment options

#### 5. **Rich Text Section**
Add formatted content with text, images, and links
- Full WYSIWYG editor
- Width options (narrow to full-width)
- Background color options

#### 6. **Pricing Section**
Display pricing plans
- Multiple pricing tiers
- Feature lists
- Highlight "most popular" plans
- Custom CTA buttons per plan

#### 7. **FAQ Section**
Display frequently asked questions
- Select FAQs from your library
- Layout: accordion or two-column
- Background color options

#### 8. **Image Section**
Display standalone images
- Upload or select from media library
- Size options (small to full-width)
- Alignment options
- Optional link (make image clickable)
- Caption support

### Page Workflow

1. **Create**: Click "Pages" → "+" to create a new page
2. **Configure**: 
   - Add a page title (internal name)
   - Generate a URL slug
   - Choose a template style
3. **Build**: Add sections and arrange them in your desired order
4. **SEO**: Configure meta title, description, and social share image
5. **Publish**: Toggle the "Published" switch to make it live

---

## 🎨 Media Management

### Uploading Images

1. Go to **Media Library**
2. Click "+" to create a new media asset
3. Upload your image
4. Fill in:
   - Title (descriptive name)
   - Alt text (important for SEO!)
   - Description
   - Category
   - Tags for organization

### Using Images

When adding images to sections, you can:
- Upload directly in the section editor
- OR reference images from your Media Library for reusability

---

## 🔍 SEO Best Practices

### Page-Level SEO

Every page has SEO settings:
- **Meta Title**: 50-60 characters, include main keywords
- **Meta Description**: 150-160 characters, compelling summary
- **Social Share Image**: 1200x630px recommended
- **Keywords**: Add relevant keywords (3-5)
- **Hide from Search Engines**: Check if you don't want the page indexed

### Default SEO

Set default SEO settings in **Site Settings** → **General Settings** → **Default SEO Settings**. These will be used for pages without specific SEO settings.

---

## 🧭 Navigation Management

### Creating Menus

1. Go to **Site Settings** → **Navigation Menus**
2. Click "+" to create a new navigation
3. Give it a title (e.g., "Main Menu", "Footer Menu")
4. Add navigation items:
   - Link text
   - URL (or select a page reference)
   - Optional sub-menu items (for dropdowns)
   - Description (for mega menus)

### Menu Structure

You can create:
- Simple links
- Dropdown menus (add sub-items)
- Mega menus (add descriptions to sub-items)

---

## 👥 Team Collaboration

### Roles & Permissions

You can invite team members with different access levels:
- **Administrator**: Full access to everything
- **Editor**: Can create and publish content
- **Contributor**: Can create drafts but cannot publish

To invite team members:
1. Go to sanity.io and log in
2. Select your project
3. Go to "Members" in the project settings
4. Invite team members by email

---

## 🚀 Publishing Workflow

### Draft vs Published

- All changes start as **drafts**
- Drafts are NOT visible on your live website
- Click **Publish** to make changes live
- You can unpublish pages at any time

### Making Changes Live

1. Edit your content in the Studio
2. Review your changes
3. Click "Publish" button
4. Changes will appear on your live site within seconds

---

## 💡 Tips & Tricks

### Reusable Content

Use references to reuse content:
- Testimonials can be added to multiple pages
- FAQs can be displayed on different pages
- Media library images can be used anywhere

### Organizing Content

- Use **tags** in media library for easy searching
- Use **categories** for blog posts and FAQs
- Use **display order** fields to control sort order

### Preview Before Publishing

Always review your pages before publishing:
- Check all sections display correctly
- Verify images have alt text
- Test all links work
- Review SEO settings

### Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save (auto-saves anyway!)
- `Ctrl/Cmd + P`: Publish document
- `Esc`: Close dialogs

---

## 🆘 Need Help?

### Common Issues

**Q: My changes aren't showing on the website**
A: Make sure you clicked "Publish" - drafts don't appear on the live site.

**Q: I can't find an image I uploaded**
A: Check the Media Library - all images are stored there.

**Q: How do I change the homepage?**
A: Create a page with the slug "home" or "index" and publish it.

**Q: How do I add a new menu item?**
A: Go to Site Settings → Navigation Menus, select your menu, and add items.

---

## 🎓 Next Steps

Now that you have your CMS set up:

1. **Create your first page** - Try building a simple "About Us" page
2. **Upload some images** - Stock your media library
3. **Add testimonials** - Import customer success stories
4. **Configure site settings** - Add your logo, contact info, and social links
5. **Build navigation** - Set up your main menu

Happy content managing! 🎉
