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
      // In a real implementation, this would scan the /blog/posts/ directory
      // For now, we'll manually define available posts
      const postSlugs = [
        'field-service-productivity-tips',
        // Add more post slugs here as they're created
      ];
      
      const posts = [];
      
      for (const slug of postSlugs) {
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
          }
        } catch (error) {
          console.error(`Error loading post ${slug}:`, error);
        }
      }
      
      // Sort by date (newest first)
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Filter published posts only (for public display)
      this.posts = posts.filter(post => post.status === 'published');
      this.postsLoaded = true;
      
      return this.posts;
    } catch (error) {
      console.error('Error loading blog posts:', error);
      return [];
    }
  }

  /**
   * Get a single post by slug
   */
  async getPost(slug) {
    await this.loadPosts();
    return this.posts.find(post => post.slug === slug);
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
    const post = await this.getPost(slug);
    
    if (!post) {
      container.innerHTML = '<h1>Post Not Found</h1><p>The requested blog post could not be found.</p>';
      return;
    }

    // Update page title and meta
    document.title = `${post.title} | Creative Job Hub Blog`;
    
    const existingMeta = document.querySelector('meta[name="description"]');
    if (existingMeta) {
      existingMeta.setAttribute('content', post.excerpt);
    }

    const html = `
      <article class="blog-post">
        <header class="blog-post-header">
          <div class="blog-post-meta">
            <span class="blog-post-date">${this.formatDate(post.date)}</span>
            <span class="blog-post-author">By ${post.author}</span>
            <span class="blog-post-category">${post.category}</span>
          </div>
          <h1 class="blog-post-title">${post.title}</h1>
          ${(post.image || post.featured_image) ? `<img src="/assets/images/blog/${post.image || post.featured_image}" alt="${post.title}" class="blog-featured-image">` : ''}
        </header>
        
        <div class="blog-post-content">
          ${post.html}
        </div>
        
        <footer class="blog-post-footer">
          <div class="blog-post-tags">
            ${(post.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          
          <div class="blog-post-cta">
            <h3>Ready to Transform Your Field Service Business?</h3>
            <p>See how Creative Job Hub can streamline your operations and boost productivity.</p>
            <a href="https://app.creativejobhub.com/auth?mode=signup" class="btn btn-primary">Start Free Trial</a>
          </div>
        </footer>
      </article>
    `;

    container.innerHTML = html;
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
      const container = document.getElementById('blog-posts');
      if (container) {
        await this.renderBlogIndex(container);
      }
    } else if (path.startsWith('/blog/posts/')) {
      // Individual blog post
      const slug = path.split('/')[3]; // Extract slug from /blog/posts/slug/
      const container = document.getElementById('blog-post');
      if (container && slug) {
        await this.renderBlogPost(slug, container);
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