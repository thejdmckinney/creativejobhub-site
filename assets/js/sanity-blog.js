/**
 * Sanity Blog System
 * Fetches and renders blog posts from Sanity CMS
 */

import {createClient} from 'https://cdn.jsdelivr.net/npm/@sanity/client@6.22.7/+esm'
import imageUrlBuilder from 'https://cdn.jsdelivr.net/npm/@sanity/image-url@1.0.2/+esm'

// Initialize Sanity client
const client = createClient({
  projectId: '53m7wbm0',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Image URL builder
const builder = imageUrlBuilder(client)

function urlFor(source) {
  return builder.image(source)
}

/**
 * Convert Sanity block content to HTML
 */
function blockContentToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks.map(block => {
    if (block._type !== 'block') return ''
    
    const children = block.children || []
    const style = block.style || 'normal'
    
    // Build text content with marks (bold, italic, etc.)
    const text = children.map(child => {
      let content = child.text || ''
      
      if (child.marks && child.marks.length > 0) {
        child.marks.forEach(mark => {
          if (mark === 'strong') content = `<strong>${content}</strong>`
          if (mark === 'em') content = `<em>${content}</em>`
          if (mark === 'code') content = `<code>${content}</code>`
        })
      }
      
      return content
    }).join('')
    
    // Wrap in appropriate HTML tag based on style
    switch (style) {
      case 'h1': return `<h1>${text}</h1>`
      case 'h2': return `<h2>${text}</h2>`
      case 'h3': return `<h3>${text}</h3>`
      case 'h4': return `<h4>${text}</h4>`
      case 'blockquote': return `<blockquote>${text}</blockquote>`
      default: return `<p>${text}</p>`
    }
  }).join('\n')
}

/**
 * Fetch all published blog posts
 */
export async function getBlogPosts() {
  try {
    const posts = await client.fetch(
      `*[_type == "blogPost"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        author,
        publishedAt,
        excerpt,
        "mainImage": mainImage{
          "url": asset->url,
          alt
        },
        "categories": categories[]->title,
        body,
        metaTitle,
        metaDescription
      }`
    )
    
    console.log(`Sanity Blog: Loaded ${posts.length} posts`)
    return posts
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error)
    return []
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPost(slug) {
  try {
    const post = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        author,
        publishedAt,
        excerpt,
        "mainImage": mainImage{
          "url": asset->url,
          alt
        },
        "categories": categories[]->title,
        body,
        metaTitle,
        metaDescription
      }`,
      { slug }
    )
    
    if (post) {
      console.log(`Sanity Blog: Found post: ${post.title}`)
    }
    
    return post
  } catch (error) {
    console.error(`Error fetching blog post ${slug} from Sanity:`, error)
    return null
  }
}

/**
 * Render blog post list for blog index page
 */
export async function renderBlogList(containerSelector = '#blog-posts') {
  const container = document.querySelector(containerSelector)
  if (!container) {
    console.error('Blog container not found:', containerSelector)
    return
  }
  
  // Show loading state
  container.innerHTML = '<div class="loading">Loading blog posts...</div>'
  
  try {
    const posts = await getBlogPosts()
    
    if (posts.length === 0) {
      container.innerHTML = '<p>No blog posts found. Create your first post in Sanity Studio!</p>'
      return
    }
    
    // Render posts
    container.innerHTML = posts.map(post => {
      const imageUrl = post.mainImage?.url 
        ? urlFor(post.mainImage.url).width(800).height(450).url()
        : '/assets/images/blog/default-blog-image.jpg'
      
      const imageAlt = post.mainImage?.alt || post.title
      const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      return `
        <article class="blog-card">
          <a href="/blog/posts/${post.slug}/" class="blog-card__link">
            <img 
              src="${imageUrl}" 
              alt="${imageAlt}"
              class="blog-card__image"
              loading="lazy"
            />
            <div class="blog-card__content">
              ${post.categories && post.categories.length > 0 
                ? `<span class="blog-card__category">${post.categories[0]}</span>`
                : ''
              }
              <h2 class="blog-card__title">${post.title}</h2>
              <p class="blog-card__excerpt">${post.excerpt || ''}</p>
              <div class="blog-card__meta">
                <span class="blog-card__author">${post.author || 'Creative Job Hub'}</span>
                <span class="blog-card__date">${publishDate}</span>
              </div>
            </div>
          </a>
        </article>
      `
    }).join('')
    
    console.log(`Sanity Blog: Rendered ${posts.length} posts`)
  } catch (error) {
    console.error('Error rendering blog list:', error)
    container.innerHTML = '<p>Error loading blog posts. Please try again later.</p>'
  }
}

/**
 * Render a single blog post
 */
export async function renderBlogPost(slug, containerSelector = '#blog-post-content') {
  const container = document.querySelector(containerSelector)
  if (!container) {
    console.error('Blog post container not found:', containerSelector)
    return null
  }
  
  // Show loading state
  container.innerHTML = '<div class="loading">Loading post...</div>'
  
  try {
    const post = await getBlogPost(slug)
    
    if (!post) {
      container.innerHTML = '<p>Blog post not found.</p>'
      return null
    }
    
    const imageUrl = post.mainImage?.url 
      ? urlFor(post.mainImage.url).width(1200).height(630).url()
      : null
    
    const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const content = blockContentToHtml(post.body)
    
    // Render the post
    container.innerHTML = `
      <article class="blog-post">
        <header class="blog-post__header">
          <p class="blog-post__category">Blog</p>
          <h1 class="blog-post__title">${post.title}</h1>
          <div class="blog-post__meta">
            <span class="blog-post__author">${post.author || 'Creative Job Hub'}</span>
            <span class="blog-post__date">${publishDate}</span>
          </div>
          ${post.excerpt ? `<p class="blog-post__excerpt">${post.excerpt}</p>` : ''}
        </header>
        
        ${imageUrl ? `
          <figure class="blog-post__image">
            <img 
              src="${imageUrl}" 
              alt="${post.mainImage?.alt || post.title}"
              loading="lazy"
            />
          </figure>
        ` : ''}
        
        <div class="blog-post__content">
          ${content}
        </div>
        
        ${post.categories && post.categories.length > 0 ? `
          <footer class="blog-post__footer">
            <div class="blog-post__categories">
              <strong>Categories:</strong>
              ${post.categories.map(cat => `<span class="tag">${cat}</span>`).join(' ')}
            </div>
          </footer>
        ` : ''}
      </article>
    `
    
    // Update meta tags for SEO
    if (post.metaTitle || post.title) {
      document.title = post.metaTitle || post.title
    }
    
    if (post.metaDescription || post.excerpt) {
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.content = post.metaDescription || post.excerpt
      }
    }
    
    console.log(`Sanity Blog: Rendered post: ${post.title}`)
    return post
  } catch (error) {
    console.error('Error rendering blog post:', error)
    container.innerHTML = '<p>Error loading blog post. Please try again later.</p>'
    return null
  }
}

// Export for use in other scripts
window.SanityBlog = {
  getBlogPosts,
  getBlogPost,
  renderBlogList,
  renderBlogPost,
  blockContentToHtml
}
