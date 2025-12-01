# n8n Blog Automation Setup Guide

This guide will help you set up an n8n workflow that automatically publishes blog posts to your Creative Job Hub website via the GitHub API.

## Overview

The automated blog publishing system works as follows:
1. **Content Creation**: You create blog content (title, content, metadata) in n8n
2. **Markdown Generation**: n8n converts your content into a markdown file with proper frontmatter
3. **GitHub Commit**: n8n commits the markdown file to your GitHub repository
4. **Auto-Deployment**: GitHub automatically deploys the updated site
5. **Live Blog**: Your new blog post appears on the live website

## Prerequisites

- [ ] n8n instance running (cloud or self-hosted)
- [ ] GitHub repository access with admin permissions
- [ ] GitHub Personal Access Token with repository permissions

## Step 1: GitHub Setup

### 1.1 Generate GitHub Personal Access Token

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: `n8n-blog-automation`
4. Expiration: Choose appropriate timeframe
5. Select scopes:
   - [x] `repo` (Full control of private repositories)
   - [x] `workflow` (Update GitHub Action workflows)
6. Click "Generate token" and **save it securely**

### 1.2 Repository Structure

Your blog posts will be created in this structure:
```
/blog/posts/[post-slug]/index.md
```

Example:
```
/blog/posts/field-service-productivity-tips/index.md
/blog/posts/customer-retention-strategies/index.md
```

## Step 2: n8n Workflow Setup

### 2.1 Create New Workflow

1. Open n8n
2. Create new workflow
3. Name it "Blog Auto-Publisher"

### 2.2 Workflow Nodes

#### Node 1: Trigger (Manual/Webhook/Schedule)
- **Type**: Manual Trigger or Webhook
- **Purpose**: Starts the blog publishing process
- **Configuration**: 
  - If using webhook: Configure endpoint URL for external triggers
  - If using manual: Use for testing and manual posts

#### Node 2: Set Blog Post Data
- **Type**: Set Node
- **Purpose**: Define blog post content and metadata
- **Configuration**:
```json
{
  "title": "Your Blog Post Title",
  "slug": "your-blog-post-slug",
  "excerpt": "Brief description of your blog post",
  "content": "# Your Blog Post Content\n\nYour markdown content goes here...",
  "author": "Creative Job Hub Team",
  "category": "Field Service Management",
  "tags": ["productivity", "field-service", "business"],
  "publishDate": "{{ new Date().toISOString() }}",
  "status": "published"
}
```

#### Node 3: Generate Markdown File
- **Type**: Code Node (JavaScript)
- **Purpose**: Create properly formatted markdown with frontmatter
- **Code**:
```javascript
// Generate markdown file with frontmatter
const post = $input.first().json;

// Ensure all fields are strings and handle missing values
const title = post.title || "Untitled Blog Post";
const excerpt = post.excerpt || "Blog post excerpt";
const content = typeof post.content === 'string' ? post.content : String(post.content || '');
const publishDate = post.publishDate || new Date().toISOString().split('T')[0];
const author = post.author || "Creative Job Hub Team";
const category = post.category || "Field Service Management";
const status = post.status || "published";
const slug = post.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Handle tags array
const tags = Array.isArray(post.tags) ? post.tags : (post.tags ? [post.tags] : []);

// Create frontmatter
const frontmatter = `---
title: "${title}"
date: "${publishDate}"
author: "${author}"
excerpt: "${excerpt}"
category: "${category}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
status: "${status}"
image: "${slug}-hero.jpg"
---

${content}`;

// Calculate reading time (rough estimate: 200 words per minute)
const wordCount = content.split(' ').length;
const readTime = Math.ceil(wordCount / 200);

return [{
  json: {
    slug: slug,
    filename: `blog/posts/${slug}/index.md`,
    content: frontmatter,
    readTime: readTime,
    commitMessage: `Add new blog post: ${title}`
  }
}];
```

#### Node 4: GitHub API - Create/Update File
- **Type**: HTTP Request Node
- **Purpose**: Commit markdown file to GitHub repository
- **Configuration**:
  - **Method**: PUT
  - **URL**: `https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/{{ $json.filename }}`
  - **Authentication**: Bearer Token (your GitHub token)
  - **Headers**:
    ```json
    {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "n8n-blog-automation"
    }
    ```
  - **Body**:
    ```json
    {
      "message": "{{ $json.commitMessage }}",
      "content": "{{ Buffer.from($json.content).toString('base64') }}",
      "branch": "main"
    }
    ```

#### Node 5: Success Notification (Optional)
- **Type**: HTTP Request Node or Email Node
- **Purpose**: Notify when blog post is published
- **Configuration**: Send notification to your preferred channel

### 2.3 Workflow Example (JSON)

Save this workflow configuration:

```json
{
  "name": "Blog Auto-Publisher",
  "nodes": [
    {
      "parameters": {},
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [320, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "title",
              "value": "5 Ways Field Service Software Boosts Productivity"
            },
            {
              "name": "slug",
              "value": "field-service-productivity-boost"
            },
            {
              "name": "excerpt",
              "value": "Discover how modern field service management software can transform your small business operations and boost team productivity."
            },
            {
              "name": "author",
              "value": "Creative Job Hub Team"
            },
            {
              "name": "category",
              "value": "Field Service Management"
            }
          ]
        }
      },
      "name": "Set Blog Data",
      "type": "n8n-nodes-base.set",
      "position": [540, 300]
    },
    {
      "parameters": {
        "jsCode": "// GitHub API code from above"
      },
      "name": "Generate Markdown",
      "type": "n8n-nodes-base.code",
      "position": [760, 300]
    },
    {
      "parameters": {
        "url": "https://api.github.com/repos/YOUR_USERNAME/creativejobhub-site/contents/={{ $json.filename }}",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "options": {}
      },
      "name": "GitHub Commit",
      "type": "n8n-nodes-base.httpRequest",
      "position": [980, 300]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Set Blog Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Set Blog Data": {
      "main": [
        [
          {
            "node": "Generate Markdown",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Markdown": {
      "main": [
        [
          {
            "node": "GitHub Commit",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Step 3: Configuration

### 3.1 Update Repository Details

Replace these placeholders in your workflow:
- `YOUR_USERNAME`: Your GitHub username
- `YOUR_REPO`: Your repository name (creativejobhub-site)
- `main`: Your default branch name

### 3.2 Set Up Authentication

1. In n8n, go to Credentials
2. Create new credential: "GitHub API"
3. Type: "Header Auth"
4. Name: `Authorization`
5. Value: `Bearer YOUR_GITHUB_TOKEN`

### 3.3 Test the Workflow

1. Run the workflow manually
2. Check your GitHub repository for the new markdown file
3. Verify the site deploys correctly
4. Visit your blog to see the new post

## Step 4: Advanced Features

### 4.1 Webhook Integration

For external content management systems:

```javascript
// Webhook endpoint: https://your-n8n-instance/webhook/blog-publish
// POST request with JSON body:
{
  "title": "Blog Post Title",
  "content": "Markdown content...",
  "category": "Field Service Management",
  "tags": ["tag1", "tag2"]
}
```

### 4.2 Image Handling

To include images:

1. Upload images to `/blog/assets/images/` directory
2. Reference in markdown: `![Alt text](/blog/assets/images/your-image.jpg)`
3. Set frontmatter image: `image: "your-image.jpg"`

### 4.3 Scheduling

Add a Schedule Trigger node:
- **Type**: Cron
- **Expression**: `0 9 * * 1` (every Monday at 9 AM)
- Connect to content source (CMS, database, etc.)

## Step 5: Testing & Validation

### 5.1 Test Checklist

- [ ] Workflow runs without errors
- [ ] Markdown file created in correct location
- [ ] Frontmatter formatted properly
- [ ] GitHub commit successful
- [ ] Site deployment triggered
- [ ] Blog post visible on live site
- [ ] SEO meta tags populated correctly
- [ ] Images loading properly
- [ ] Mobile responsiveness working

### 5.2 Troubleshooting

#### Common Issues:

1. **GitHub API 404 Error**
   - Check repository name and path
   - Verify GitHub token permissions
   - Ensure branch exists

2. **Base64 Encoding Issues**
   - Use: `Buffer.from(content).toString('base64')`
   - Don't double-encode content

3. **Frontmatter Parsing Errors**
   - Check YAML syntax
   - Escape special characters in strings
   - Use consistent indentation

4. **Site Not Updating**
   - Check GitHub Actions/Pages deployment
   - Verify file location matches system expectations
   - Clear browser cache

## Step 6: Production Deployment

### 6.1 Security Considerations

- [ ] Use environment variables for sensitive data
- [ ] Rotate GitHub tokens regularly
- [ ] Implement input validation
- [ ] Add error handling and logging

### 6.2 Monitoring

Set up monitoring for:
- Workflow execution status
- GitHub API rate limits
- Deployment success/failure
- Site health checks

## Support

If you encounter issues:

1. Check the n8n logs for detailed error messages
2. Verify GitHub API responses
3. Test the workflow step by step
4. Review the blog system admin dashboard at `/admin/blog.html`

## API Reference

### GitHub Contents API

- **Endpoint**: `https://api.github.com/repos/{owner}/{repo}/contents/{path}`
- **Method**: PUT (create/update) or GET (read)
- **Rate Limit**: 5000 requests per hour

### Required Headers

```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Accept": "application/vnd.github.v3+json",
  "User-Agent": "YourApp/1.0"
}
```

### Create File Request Body

```json
{
  "message": "Commit message",
  "content": "BASE64_ENCODED_CONTENT",
  "branch": "main"
}
```

This system provides a fully automated blog publishing pipeline that integrates seamlessly with your existing Creative Job Hub website structure.