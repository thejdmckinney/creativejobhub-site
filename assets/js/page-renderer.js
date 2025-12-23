/**
 * Sanity Page Renderer
 * Dynamically renders pages built in Sanity Studio
 */

import {getPage, urlFor} from './sanity-client.js'

/**
 * Render a complete page from Sanity
 * @param {string} slug - Page slug to render
 * @param {HTMLElement} container - Container element to render into
 */
export async function renderPage(slug, container) {
  try {
    const page = await getPage(slug)

    if (!page) {
      container.innerHTML = '<div class="error">Page not found</div>'
      return
    }

    // Apply SEO
    if (page.seo) {
      applySEO(page.seo, page.title)
    }

    // Render sections
    const sectionsHTML = page.sections.map(section => renderSection(section)).join('')
    container.innerHTML = sectionsHTML

    // Initialize any interactive components
    initializeComponents(container)
  } catch (error) {
    console.error('Error rendering page:', error)
    container.innerHTML = '<div class="error">Error loading page</div>'
  }
}

/**
 * Render a section based on its type
 * @param {Object} section - Section data from Sanity
 * @returns {string} HTML string
 */
function renderSection(section) {
  switch (section._type) {
    case 'heroSection':
      return renderHeroSection(section)
    case 'featuresSection':
      return renderFeaturesSection(section)
    case 'testimonialsSection':
      return renderTestimonialsSection(section)
    case 'ctaSection':
      return renderCTASection(section)
    case 'textSection':
      return renderTextSection(section)
    case 'pricingSection':
      return renderPricingSection(section)
    case 'faqSection':
      return renderFAQSection(section)
    case 'imageSection':
      return renderImageSection(section)
    default:
      console.warn('Unknown section type:', section._type)
      return ''
  }
}

/**
 * Render Hero Section
 */
function renderHeroSection(section) {
  const bgStyle = section.backgroundImage
    ? `background-image: url('${urlFor(section.backgroundImage).width(1920).url()}');`
    : 'background: linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 100%);'

  const heightClass = section.height === 'tall' ? 'hero-tall' : section.height === 'fullscreen' ? 'hero-fullscreen' : ''

  const buttonsHTML = section.ctaButtons
    ?.map(
      btn => `
      <a href="${btn.url}" class="btn btn-${btn.style || 'primary'}">
        ${btn.text}
      </a>
    `
    )
    .join('')

  return `
    <section class="hero ${heightClass}" style="${bgStyle}">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-heading">${section.heading}</h1>
          ${section.subheading ? `<p class="hero-subheading">${section.subheading}</p>` : ''}
          ${buttonsHTML ? `<div class="hero-buttons">${buttonsHTML}</div>` : ''}
        </div>
      </div>
      ${section.backgroundVideo ? `<video class="hero-video" autoplay muted loop playsinline><source src="${section.backgroundVideo}" type="video/mp4"></video>` : ''}
    </section>
  `
}

/**
 * Render Features Section
 */
function renderFeaturesSection(section) {
  const bgClass = section.backgroundColor === 'dark' ? 'bg-dark' : section.backgroundColor === 'brand' ? 'bg-brand' : 'bg-light'
  const layoutClass = `features-${section.layout || 'grid-3'}`

  const featuresHTML = section.features
    ?.map(
      feature => `
      <div class="feature-card">
        ${feature.icon ? `<i class="feature-icon fas ${feature.icon}"></i>` : ''}
        ${feature.image ? `<img src="${urlFor(feature.image).width(400).url()}" alt="${feature.image.alt || feature.title}" class="feature-image">` : ''}
        <h3 class="feature-title">${feature.title}</h3>
        <p class="feature-description">${feature.description}</p>
        ${feature.link ? `<a href="${feature.link.url}" class="feature-link">${feature.link.text} →</a>` : ''}
      </div>
    `
    )
    .join('')

  return `
    <section class="features-section ${bgClass}">
      <div class="container">
        ${section.sectionTitle ? `<h2 class="section-title">${section.sectionTitle}</h2>` : ''}
        ${section.sectionDescription ? `<p class="section-description">${section.sectionDescription}</p>` : ''}
        <div class="features-grid ${layoutClass}">
          ${featuresHTML}
        </div>
      </div>
    </section>
  `
}

/**
 * Render Testimonials Section
 */
function renderTestimonialsSection(section) {
  const bgClass = section.backgroundColor === 'dark' ? 'bg-dark' : section.backgroundColor === 'brand' ? 'bg-brand' : 'bg-light'

  const testimonialsHTML = section.testimonials
    ?.map(
      testimonial => `
      <div class="testimonial-card">
        <blockquote class="testimonial-quote">"${testimonial.quote}"</blockquote>
        <div class="testimonial-author">
          ${testimonial.companyLogo ? `<img src="${urlFor(testimonial.companyLogo).width(120).url()}" alt="${testimonial.company}" class="testimonial-logo">` : ''}
          <div class="testimonial-info">
            <div class="testimonial-name">${testimonial.customerName}</div>
            <div class="testimonial-company">${testimonial.company}${testimonial.location ? `, ${testimonial.location}` : ''}</div>
          </div>
        </div>
      </div>
    `
    )
    .join('')

  return `
    <section class="testimonials-section ${bgClass}">
      <div class="container">
        ${section.sectionTitle ? `<h2 class="section-title">${section.sectionTitle}</h2>` : ''}
        ${section.sectionDescription ? `<p class="section-description">${section.sectionDescription}</p>` : ''}
        <div class="testimonials-${section.displayStyle || 'grid'}">
          ${testimonialsHTML}
        </div>
      </div>
    </section>
  `
}

/**
 * Render CTA Section
 */
function renderCTASection(section) {
  const bgStyle = section.backgroundImage
    ? `background-image: url('${urlFor(section.backgroundImage).width(1920).url()}');`
    : section.backgroundColor === 'gradient'
    ? 'background: linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 100%);'
    : section.backgroundColor === 'dark'
    ? 'background: var(--bg-secondary);'
    : 'background: var(--brand);'

  const alignClass = `text-${section.alignment || 'center'}`

  const buttonsHTML = section.buttons
    ?.map(
      btn => `
      <a href="${btn.url}" class="btn btn-${btn.style || 'primary'}">
        ${btn.text}
      </a>
    `
    )
    .join('')

  return `
    <section class="cta-section ${alignClass}" style="${bgStyle}">
      <div class="container">
        <h2 class="cta-heading">${section.heading}</h2>
        ${section.description ? `<p class="cta-description">${section.description}</p>` : ''}
        ${buttonsHTML ? `<div class="cta-buttons">${buttonsHTML}</div>` : ''}
      </div>
    </section>
  `
}

/**
 * Render Text Section
 */
function renderTextSection(section) {
  const bgClass = section.backgroundColor === 'dark' ? 'bg-dark' : section.backgroundColor === 'light' ? 'bg-light' : ''
  const widthClass = `max-width-${section.maxWidth || 'standard'}`

  // Convert portable text to HTML (basic implementation)
  const contentHTML = renderPortableText(section.content)

  return `
    <section class="text-section ${bgClass}">
      <div class="container ${widthClass}">
        <div class="text-content">
          ${contentHTML}
        </div>
      </div>
    </section>
  `
}

/**
 * Render Pricing Section
 */
function renderPricingSection(section) {
  const bgClass = section.backgroundColor === 'dark' ? 'bg-dark' : 'bg-light'

  const plansHTML = section.pricingPlans
    ?.map(
      plan => `
      <div class="pricing-card ${plan.highlighted ? 'highlighted' : ''}">
        ${plan.highlighted ? '<div class="pricing-badge">Most Popular</div>' : ''}
        <h3 class="pricing-name">${plan.name}</h3>
        ${plan.description ? `<p class="pricing-description">${plan.description}</p>` : ''}
        <div class="pricing-price">${plan.price}</div>
        <ul class="pricing-features">
          ${plan.features?.map(feature => `<li>${feature}</li>`).join('') || ''}
        </ul>
        ${plan.ctaButton ? `<a href="${plan.ctaButton.url}" class="btn btn-primary">${plan.ctaButton.text}</a>` : ''}
      </div>
    `
    )
    .join('')

  return `
    <section class="pricing-section ${bgClass}">
      <div class="container">
        ${section.sectionTitle ? `<h2 class="section-title">${section.sectionTitle}</h2>` : ''}
        ${section.sectionDescription ? `<p class="section-description">${section.sectionDescription}</p>` : ''}
        <div class="pricing-grid">
          ${plansHTML}
        </div>
      </div>
    </section>
  `
}

/**
 * Render FAQ Section
 */
function renderFAQSection(section) {
  const bgClass = section.backgroundColor === 'dark' ? 'bg-dark' : 'bg-light'
  const layoutClass = section.layout === 'two-column' ? 'faq-two-column' : 'faq-accordion'

  const faqsHTML = section.faqs
    ?.map(
      (faq, index) => `
      <div class="faq-item" data-faq-index="${index}">
        <button class="faq-question" onclick="toggleFAQ(${index})">
          ${faq.question}
          <i class="fas fa-chevron-down faq-icon"></i>
        </button>
        <div class="faq-answer">
          ${faq.answer}
        </div>
      </div>
    `
    )
    .join('')

  return `
    <section class="faq-section ${bgClass}">
      <div class="container">
        ${section.sectionTitle ? `<h2 class="section-title">${section.sectionTitle}</h2>` : ''}
        <div class="faq-container ${layoutClass}">
          ${faqsHTML}
        </div>
      </div>
    </section>
  `
}

/**
 * Render Image Section
 */
function renderImageSection(section) {
  const sizeClass = `image-${section.size || 'large'}`
  const alignClass = `align-${section.alignment || 'center'}`

  const imgHTML = section.link
    ? `<a href="${section.link}"><img src="${urlFor(section.image).width(1200).url()}" alt="${section.image.alt || ''}" class="section-image"></a>`
    : `<img src="${urlFor(section.image).width(1200).url()}" alt="${section.image.alt || ''}" class="section-image">`

  return `
    <section class="image-section ${sizeClass} ${alignClass}">
      <div class="container">
        ${imgHTML}
        ${section.image.caption ? `<p class="image-caption">${section.image.caption}</p>` : ''}
      </div>
    </section>
  `
}

/**
 * Basic portable text renderer
 */
function renderPortableText(blocks) {
  if (!blocks) return ''

  return blocks
    .map(block => {
      if (block._type === 'block') {
        const style = block.style || 'normal'
        const children = block.children?.map(child => child.text).join('') || ''

        switch (style) {
          case 'h1':
            return `<h1>${children}</h1>`
          case 'h2':
            return `<h2>${children}</h2>`
          case 'h3':
            return `<h3>${children}</h3>`
          case 'h4':
            return `<h4>${children}</h4>`
          case 'blockquote':
            return `<blockquote>${children}</blockquote>`
          default:
            return `<p>${children}</p>`
        }
      } else if (block._type === 'image') {
        return `<img src="${urlFor(block).width(800).url()}" alt="${block.alt || ''}">`
      }
      return ''
    })
    .join('')
}

/**
 * Apply SEO metadata to page
 */
function applySEO(seo, fallbackTitle) {
  if (seo.metaTitle) {
    document.title = seo.metaTitle
  } else if (fallbackTitle) {
    document.title = fallbackTitle
  }

  // Meta description
  updateMeta('description', seo.metaDescription)

  // Open Graph tags
  updateMeta('og:title', seo.metaTitle || fallbackTitle, 'property')
  updateMeta('og:description', seo.metaDescription, 'property')
  if (seo.ogImage) {
    updateMeta('og:image', urlFor(seo.ogImage).width(1200).height(630).url(), 'property')
  }

  // Robots
  if (seo.noIndex) {
    updateMeta('robots', 'noindex, nofollow')
  }

  // Canonical URL
  if (seo.canonicalUrl) {
    updateLink('canonical', seo.canonicalUrl)
  }
}

/**
 * Update or create meta tag
 */
function updateMeta(name, content, attribute = 'name') {
  if (!content) return

  let meta = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

/**
 * Update or create link tag
 */
function updateLink(rel, href) {
  if (!href) return

  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

/**
 * Initialize interactive components after rendering
 */
function initializeComponents(container) {
  // FAQ toggles
  window.toggleFAQ = function (index) {
    const faqItem = container.querySelector(`[data-faq-index="${index}"]`)
    if (faqItem) {
      faqItem.classList.toggle('active')
    }
  }

  // Add any other initializations here
}

// Export for use in other scripts
export {renderSection, applySEO}
