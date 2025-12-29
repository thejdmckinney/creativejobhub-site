/**
 * Sanity Blog System (Browser Version)
 * Fetches and renders blog posts from Sanity CMS
 */

(function() {
  'use strict';

  const SANITY_PROJECT_ID = '53m7wbm0';
  const SANITY_DATASET = 'production';
  const SANITY_API_VERSION = '2024-01-01';

  /**
   * Fetch data from Sanity using their HTTP API
   */
  async function sanityFetch(query) {
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.status}`);
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching from Sanity:', error);
      throw error;
    }
  }

  /**
   * Generate Sanity image URL
   */
  function urlFor(imageRef, width = 800, height = 450) {
    if (!imageRef) return null;
    
    // Extract asset ID from reference
    const assetId = imageRef.replace('image-', '').replace(/-(\w+)$/, '.$1');
    return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${assetId}?w=${width}&auto=format`;
  }

  /**
   * Convert Sanity block content to HTML
   */
  function blockContentToHtml(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      if (block._type !== 'block') return '';
      
      const children = block.children || [];
      const style = block.style || 'normal';
      
      // Build text content with marks (bold, italic, etc.)
      const text = children.map(child => {
        let content = child.text || '';
        
        if (child.marks && child.marks.length > 0) {
          child.marks.forEach(mark => {
            if (mark === 'strong') content = `<strong>${content}</strong>`;
            if (mark === 'em') content = `<em>${content}</em>`;
            if (mark === 'code') content = `<code>${content}</code>`;
          });
        }
        
        return content;
      }).join('');
      
      // Wrap in appropriate HTML tag based on style
      switch (style) {
        case 'h1': return `<h1>${text}</h1>`;
        case 'h2': return `<h2>${text}</h2>`;
        case 'h3': return `<h3>${text}</h3>`;
        case 'h4': return `<h4>${text}</h4>`;
        case 'blockquote': return `<blockquote>${text}</blockquote>`;
        default: return `<p>${text}</p>`;
      }
    }).join('\n');
  }

  /**
   * Fetch all published blog posts
   */
  async function getBlogPosts() {
    try {
      const query = `*[_type == "blogPost"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        author,
        publishedAt,
        excerpt,
        "mainImageRef": mainImage.asset._ref,
        "mainImageAlt": mainImage.alt,
        "categories": categories[]->title,
        body,
        metaTitle,
        metaDescription
      }`;
      
      console.log('Fetching posts from Sanity...');
      const posts = await sanityFetch(query);
      console.log(`Sanity Blog: Loaded ${posts.length} posts`, posts);
      
      // Debug: Check if posts exist but are filtered out
      if (posts.length === 0) {
        console.log('No posts found. Checking all documents...');
        const allDocs = await sanityFetch('*[_type == "blogPost"]');
        console.log('All blog post documents:', allDocs);
      }
      
      return posts;
    } catch (error) {
      console.error('Error fetching blog posts from Sanity:', error);
      return [];
    }
  }

  /**
   * Render blog post list for blog index page
   */
  async function renderBlogList(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('Blog container not found:', containerSelector);
      return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="loading" style="text-align: center; padding: 40px; color: #8b92a0;">Loading blog posts from Sanity...</div>';
    
    try {
      const posts = await getBlogPosts();
      
      if (posts.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px;"><p>No blog posts found.</p><p>Create your first post in Sanity Studio at <a href="http://localhost:3333" target="_blank">http://localhost:3333</a></p></div>';
        return;
      }
      
      // Render posts
      container.innerHTML = posts.map(post => {
        const imageUrl = post.mainImageRef 
          ? urlFor(post.mainImageRef, 800, 450)
          : '/assets/images/blog/default-blog-image.jpg';
        
        const imageAlt = post.mainImageAlt || post.title;
        const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        return `
          <article class="blog-card">
            <a href="/blog/post.html?slug=${post.slug}" class="blog-card-link">
              <img src="${imageUrl}" 
                   alt="${imageAlt}"
                   onerror="this.style.display='none'">
              <div class="blog-card-content">
                <h3>${post.title}</h3>
                <p>${post.excerpt || ''}</p>
                <div class="blog-meta">
                  ${post.categories && post.categories.length > 0 
                    ? `<span class="blog-tag">${post.categories[0]}</span>`
                    : ''
                  }
                  <time datetime="${post.publishedAt}">${publishDate}</time>
                </div>
              </div>
            </a>
          </article>
        `;
      }).join('');
      
      console.log(`Sanity Blog: Rendered ${posts.length} posts`);
    } catch (error) {
      console.error('Error rendering blog list:', error);
      container.innerHTML = '<div style="text-align: center; padding: 40px; color: #ef4444;"><p>Error loading blog posts. Please check the console for details.</p></div>';
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      renderBlogList('#blog-posts');
    });
  } else {
    renderBlogList('#blog-posts');
  }

  // Export for manual use if needed
  window.SanityBlog = {
    getBlogPosts,
    renderBlogList,
    blockContentToHtml
  };

})();
