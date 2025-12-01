/**
 * Creative Job Hub Blog System
 * Markdown parser and renderer for automated blog publishing
 */

class BlogSystem {
  constructor() {
    this.posts = [];
    this.postsLoaded = false;
  }

  /**
   * Parse markdown frontmatter
   */
  parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return { frontmatter: {}, content: content };
    }

    const [, frontmatterStr, markdownContent] = match;
    const frontmatter = {};
    
    frontmatterStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
        
        // Handle arrays (tags)
        if (value.startsWith('[') && value.endsWith(']')) {
          frontmatter[key.trim()] = value.slice(1, -1).split(',').map(item => 
            item.trim().replace(/^["']|["']$/g, '')
          );
        } else {
          frontmatter[key.trim()] = value;
        }
      }
    });

    return { frontmatter, content: markdownContent.trim() };
  }

  /**
   * Simple markdown to HTML converter
   */
  markdownToHtml(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');
    
    // Code blocks
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Lists
    html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^\+ (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^✅ (.+)$/gm, '<li class="checkmark">✅ $1</li>');
    html = html.replace(/^❌ (.+)$/gm, '<li class="x-mark">❌ $1</li>');
    
    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
      return '<ul>' + match + '</ul>';
    });
    
    // Tables (basic support)
    html = html.replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map(cell => cell.trim());
      return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    });
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    
    return html;
  }

  /**
   * Load all blog posts from the posts directory
   */
  async loadPosts() {
    if (this.postsLoaded) return this.posts;
    
    try {
      const posts = [];
      
      // Method 1: Try to discover posts via GitHub API (if available)
      const discoveredSlugs = await this.discoverPostSlugs();
      
      // Method 2: Always check known posts + common patterns
      const knownSlugs = [
        'field-service-productivity-tips',
        'best-scheduling-software-for-contractors-i-tested-7-so-you-don-t-have-to',
        'why-i-ditched-jobber-and-found-a-better-alternative-for-89-month',
      ];
      
      // Combine discovered and known slugs, removing duplicates
      const allSlugs = [...new Set([...discoveredSlugs, ...knownSlugs])];
      
      console.log('Blog System: Checking for posts:', allSlugs);
      
      for (const slug of allSlugs) {
        try {
          const response = await fetch(`/blog/posts/${slug}/index.md`);
          if (response.ok) {
            const content = await response.text();
            const { frontmatter, content: markdownContent } = this.parseFrontmatter(content);
            
            posts.push({
              slug,
              ...frontmatter,
              content: markdownContent,
              html: this.markdownToHtml(markdownContent),
              url: `/blog/posts/${slug}/`,
              excerpt: frontmatter.excerpt || this.generateExcerpt(markdownContent)
            });
            
            console.log(`Blog System: Successfully loaded post: ${slug}`);
          }
        } catch (error) {
          console.log(`Blog System: Post not found or error loading ${slug}:`, error.message);
        }
      }
      
      // Sort by date (newest first)
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Filter published posts only (for public display) - default to published if no status
      this.posts = posts.filter(post => (post.status || 'published') === 'published');
      this.postsLoaded = true;
      
      console.log(`Blog System: Loaded ${this.posts.length} published posts`);
      return this.posts;
    } catch (error) {
      console.error('Error loading blog posts:', error);
      return [];
    }
  }

  /**
   * Discover post slugs automatically
   */
  async discoverPostSlugs() {
    const discoveredSlugs = [];
    
    try {
      // Try GitHub Contents API for automatic discovery
      const response = await fetch('https://api.github.com/repos/thejdmckinney/creativejobhub-site/contents/blog/posts');
      
      if (response.ok) {
        const contents = await response.json();
        const directories = contents.filter(item => item.type === 'dir');
        
        for (const dir of directories) {
          // Check if directory contains index.md (markdown post)
          try {
            const postCheck = await fetch(`/blog/posts/${dir.name}/index.md`, { method: 'HEAD' });
            if (postCheck.ok) {
              discoveredSlugs.push(dir.name);
            }
          } catch (e) {
            // Silent fail for post check
          }
        }
        
        console.log('Blog System: Auto-discovered posts via GitHub API:', discoveredSlugs);
      }
    } catch (error) {
      console.log('Blog System: GitHub API discovery failed, using fallback methods');
    }
    
    // Fallback: Try common post patterns based on current date and known patterns
    const fallbackSlugs = await this.tryCommonPatterns();
    
    return [...new Set([...discoveredSlugs, ...fallbackSlugs])];
  }

  /**
   * Try to find posts using common naming patterns
   */
  async tryCommonPatterns() {
    const patterns = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    
    // Common contractor/field service topics that might be auto-generated
    const commonTopics = [
      'contractor-scheduling-software',
      'field-service-management-tips',
      'best-contractor-software',
      'scheduling-software-comparison',
      'field-service-productivity',
      'contractor-management-app',
      'small-business-field-service',
      'hvac-scheduling-software',
      'plumbing-software-review',
      'electrical-contractor-app'
    ];
    
    // Try common patterns with current date
    for (const topic of commonTopics) {
      patterns.push(`${topic}-${currentYear}`);
      patterns.push(`${topic}-${currentYear}-${currentMonth}`);
      patterns.push(topic);
    }
    
    // Try patterns with dates
    patterns.push(`blog-post-${currentYear}-${currentMonth}-01`);
    patterns.push(`new-post-${currentYear}-${currentMonth}`);
    
    const foundSlugs = [];
    
    // Test each pattern quickly
    for (const pattern of patterns.slice(0, 10)) { // Limit to avoid too many requests
      try {
        const response = await fetch(`/blog/posts/${pattern}/index.md`, { method: 'HEAD' });
        if (response.ok) {
          foundSlugs.push(pattern);
        }
      } catch (e) {
        // Silent fail
      }
    }
    
    return foundSlugs;
  }

  /**
   * Get a single post by slug
   */
  async getPost(slug) {
    // First check for embedded post data (bypass GitHub Pages .md serving issue)
    if (window.embeddedPostData && window.embeddedPostData.slug === slug) {
      console.log(`Blog System: Found embedded post data for ${slug}`);
      return {
        ...window.embeddedPostData,
        html: this.markdownToHtml(window.embeddedPostData.content || ''),
        modified: window.embeddedPostData.date
      };
    }
    
    // First try to find in cached posts
    console.log(`Blog System: getPost called for slug: ${slug}`);
    await this.loadPosts();
    console.log(`Blog System: After loadPosts, have ${this.posts.length} cached posts:`, this.posts.map(p => p.slug));
    
    let post = this.posts.find(post => post.slug === slug);
    
    if (post) {
      console.log(`Blog System: Found post in cache: ${post.title}`);
      return post;
    }
    
    console.log(`Blog System: Post ${slug} not found in cache, cached posts are:`, this.posts.map(p => p.slug));

    // If not found in cache, try to load directly from markdown file
    console.log(`Blog System: Post not in cache, trying to load directly: ${slug}`);
    
    try {
      const markdownUrl = `/blog/posts/${slug}/index.md`;
      console.log(`Blog System: Attempting to fetch markdown from: ${markdownUrl}`);
      
      const response = await fetch(markdownUrl);
      console.log(`Blog System: Fetch response:`, {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      if (!response.ok) {
        console.error(`Blog System: Failed to load markdown file for ${slug}: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const content = await response.text();
      console.log(`Blog System: Loaded ${content.length} characters of content for ${slug}`);
      
      const { frontmatter, content: markdownContent } = this.parseFrontmatter(content);
      console.log(`Blog System: Parsed frontmatter:`, frontmatter);
      
      post = {
        slug: slug,
        title: frontmatter.title || 'Untitled Post',
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        author: frontmatter.author || 'Creative Job Hub Team',
        category: frontmatter.category || 'Field Service Management',
        tags: frontmatter.tags || [],
        excerpt: frontmatter.excerpt || frontmatter.description || this.generateExcerpt(markdownContent),
        description: frontmatter.description || frontmatter.excerpt || this.generateExcerpt(markdownContent),
        image: frontmatter.image || frontmatter.featured_image || 'default-hero-1200.svg',
        featured_image: frontmatter.featured_image || frontmatter.image || 'default-hero-1200.svg',
        content: markdownContent,
        html: this.markdownToHtml(markdownContent),
        modified: frontmatter.modified || frontmatter.date || new Date().toISOString().split('T')[0]
      };
      
      console.log(`Blog System: Successfully loaded markdown post: ${post.title}`);
      return post;
      
    } catch (error) {
      console.error(`Blog System: Error loading post ${slug}:`, error);
      return null;
    }
  }

  /**
   * Generate excerpt from markdown content
   */
  generateExcerpt(content, length = 160) {
    const text = content.replace(/[#*`\[\]()]/g, '').replace(/\n/g, ' ');
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  /**
   * Render blog index page - append markdown posts to existing HTML posts
   */
  async renderBlogIndex(container) {
    const posts = await this.loadPosts();
    
    // Don't modify existing content if no markdown posts
    if (!posts.length) {
      return;
    }

    // Create markdown posts HTML
    const markdownPostsHtml = posts.map(post => `
      <article class="blog-card">
        ${(post.image || post.featured_image) ? `<img src="/assets/images/blog/${post.image || post.featured_image}" alt="${post.title}" onerror="this.style.display='none'">` : ''}
        <div class="blog-card-content">
          <h3><a href="/blog/posts/${post.slug}/">${post.title}</a></h3>
          <p>${post.excerpt}</p>
          <div class="blog-meta">
            <span class="blog-tag">${post.category}</span>
            <time datetime="${post.date}">${this.formatDate(post.date)}</time>
          </div>
        </div>
      </article>
    `).join('');

    // Append markdown posts to existing content instead of replacing
    container.insertAdjacentHTML('beforeend', markdownPostsHtml);
  }

  /**
   * Render single blog post
   */
  async renderBlogPost(slug, container) {
    console.log(`Blog System: Loading post data for slug: ${slug}`);
    const post = await this.getPost(slug);
    
    if (!post) {
      console.error(`Blog System: Post not found: ${slug}`);
      // Hide loading message and show error
      const loadingMessage = document.getElementById('loading-message');
      if (loadingMessage) loadingMessage.style.display = 'none';
      container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--muted);"><h2>Post Not Found</h2><p>The requested blog post could not be found.</p></div>';
      return;
    }

    console.log(`Blog System: Rendering post: ${post.title}`);

    // Hide loading message
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) loadingMessage.style.display = 'none';

    // Update page elements with post data
    const titleElement = document.getElementById('post-title');
    const excerptElement = document.getElementById('post-excerpt');
    const dateElement = document.getElementById('post-date');
    const readTimeElement = document.getElementById('read-time');
    const categoryElement = document.getElementById('post-category');
    const imageElement = document.getElementById('post-image');
    
    if (titleElement) {
      titleElement.textContent = post.title;
      document.title = `${post.title} — Creative Job Hub Blog`;
    }
    
    if (excerptElement) {
      excerptElement.textContent = post.excerpt || post.description || '';
    }
    
    if (dateElement) {
      dateElement.textContent = this.formatDate(post.date);
    }
    
    if (readTimeElement) {
      // Estimate read time (200 words per minute)
      const wordCount = post.content ? post.content.split(/\s+/).length : 0;
      const readTime = Math.ceil(wordCount / 200);
      readTimeElement.textContent = `${readTime} min read`;
    }
    
    if (categoryElement) {
      categoryElement.textContent = post.category || 'Field Service Management';
    }
    
    // Show featured image if available
    if (imageElement) {
      const imagePath = post.image || post.featured_image || 'default-hero-1200.svg';
      const fullImagePath = imagePath.startsWith('/') ? imagePath : `/assets/images/blog/${imagePath}`;
      
      // Add error handling for broken images
      imageElement.onerror = function() {
        console.log(`Blog System: Image failed to load: ${fullImagePath}, falling back to default`);
        this.src = '/assets/images/blog/default-hero-1200.svg';
        this.onerror = function() {
          console.error('Blog System: Default image also failed to load');
          this.style.display = 'none';
        };
      };
      
      imageElement.onload = function() {
        console.log(`Blog System: Image loaded successfully: ${fullImagePath}`);
      };
      
      imageElement.src = fullImagePath;
      imageElement.alt = post.title || 'Blog post image';
      imageElement.style.display = 'block';
      
      console.log(`Blog System: Setting image source to: ${fullImagePath}`);
    }

    // Update meta tags
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', post.excerpt || post.description || '');
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', post.title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', post.excerpt || post.description || '');
    
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', post.title);
    
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', post.excerpt || post.description || '');

    // Update structured data
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
      const data = JSON.parse(structuredData.textContent);
      data.headline = post.title;
      data.description = post.excerpt || post.description || '';
      data.datePublished = post.date;
      data.dateModified = post.modified || post.date;
      structuredData.textContent = JSON.stringify(data, null, 2);
    }

    // Render the markdown content as HTML
    container.innerHTML = post.html || this.markdownToHtml(post.content || '');
    
    console.log(`Blog System: Successfully rendered post: ${post.title}`);
  }

  /**
   * Format date for display
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Initialize blog system based on current page
   */
  async init() {
    const path = window.location.pathname;
    
    if (path === '/blog/' || path === '/blog/index.html') {
      // Blog index page
      console.log('Blog System: Initializing blog index page');
      const container = document.getElementById('blog-posts');
      if (container) {
        await this.renderBlogIndex(container);
      } else {
        console.log('Blog System: blog-posts container not found');
      }
    } else if (path.startsWith('/blog/posts/')) {
      // Individual blog post
      const slug = path.split('/')[3]; // Extract slug from /blog/posts/slug/
      console.log(`Blog System: Detected individual post page. Path: ${path}, Extracted slug: ${slug}`);
      const container = document.getElementById('post-content');
      if (container && slug) {
        console.log(`Blog System: Found post-content container, loading post: ${slug}`);
        await this.renderBlogPost(slug, container);
      } else {
        console.error('Blog System: Missing requirements:', {
          container: !!container,
          slug: slug,
          path: path
        });
      }
    }
  }
}

// Initialize blog system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.blogSystem = new BlogSystem();
  window.blogSystem.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogSystem;
}