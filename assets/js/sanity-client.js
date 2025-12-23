/**
 * Sanity API Client
 * Connects your website to the Sanity CMS
 */

import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Initialize Sanity client
export const client = createClient({
  projectId: '53m7wbm0',
  dataset: 'production',
  useCdn: true, // Use CDN for faster response (set to false for freshest data)
  apiVersion: '2024-01-01',
})

// Image URL builder for optimized images
const builder = imageUrlBuilder(client)

/**
 * Generate optimized image URL from Sanity image object
 * @param {Object} source - Sanity image object
 * @returns Image URL builder
 */
export function urlFor(source) {
  return builder.image(source)
}

/**
 * Fetch a page by its slug
 * @param {string} slug - Page URL slug
 * @returns {Promise<Object>} Page data with sections
 */
export async function getPage(slug) {
  return await client.fetch(
    `*[_type == "page" && slug.current == $slug && published == true][0]{
      _id,
      title,
      "slug": slug.current,
      pageTemplate,
      sections[]{
        _type,
        _key,
        // Hero section
        _type == "heroSection" => {
          heading,
          subheading,
          ctaButtons[]{
            text,
            url,
            style
          },
          backgroundImage{
            asset->{
              _id,
              url
            },
            alt
          },
          backgroundVideo,
          height
        },
        // Features section
        _type == "featuresSection" => {
          sectionTitle,
          sectionDescription,
          features[]{
            icon,
            title,
            description,
            image{
              asset->{
                _id,
                url
              },
              alt
            },
            link{
              text,
              url
            }
          },
          layout,
          backgroundColor
        },
        // Testimonials section
        _type == "testimonialsSection" => {
          sectionTitle,
          sectionDescription,
          testimonials[]->{
            customerName,
            company,
            location,
            industry,
            quote,
            companyLogo{
              asset->{
                _id,
                url
              },
              alt
            }
          },
          displayStyle,
          backgroundColor
        },
        // CTA section
        _type == "ctaSection" => {
          heading,
          description,
          buttons[]{
            text,
            url,
            style
          },
          backgroundImage{
            asset->{
              _id,
              url
            },
            alt
          },
          backgroundColor,
          alignment
        },
        // Text section
        _type == "textSection" => {
          content,
          maxWidth,
          backgroundColor
        },
        // Pricing section
        _type == "pricingSection" => {
          sectionTitle,
          sectionDescription,
          pricingPlans[]{
            name,
            description,
            price,
            features,
            highlighted,
            ctaButton{
              text,
              url
            }
          },
          backgroundColor
        },
        // FAQ section
        _type == "faqSection" => {
          sectionTitle,
          faqs[]->{
            question,
            answer
          },
          layout,
          backgroundColor
        },
        // Image section
        _type == "imageSection" => {
          image{
            asset->{
              _id,
              url
            },
            alt,
            caption
          },
          size,
          alignment,
          link
        }
      },
      seo{
        metaTitle,
        metaDescription,
        metaKeywords,
        ogImage{
          asset->{
            _id,
            url
          },
          alt
        },
        canonicalUrl,
        noIndex
      },
      showInNavigation,
      navigationOrder,
      publishedAt
    }`,
    {slug}
  )
}

/**
 * Fetch all published pages
 * @returns {Promise<Array>} Array of page objects
 */
export async function getAllPages() {
  return await client.fetch(
    `*[_type == "page" && published == true] | order(title asc){
      _id,
      title,
      "slug": slug.current,
      pageTemplate,
      showInNavigation,
      navigationOrder
    }`
  )
}

/**
 * Fetch site settings
 * @returns {Promise<Object>} Site settings
 */
export async function getSiteSettings() {
  return await client.fetch(
    `*[_type == "siteSettings"][0]{
      siteName,
      siteUrl,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      contactInfo,
      socialLinks,
      defaultSeo{
        metaTitle,
        metaDescription,
        ogImage{
          asset->{
            _id,
            url
          }
        }
      },
      analytics
    }`
  )
}

/**
 * Fetch navigation menu by title
 * @param {string} title - Navigation menu title (e.g., "Main Menu")
 * @returns {Promise<Object>} Navigation menu with items
 */
export async function getNavigation(title) {
  return await client.fetch(
    `*[_type == "navigation" && title == $title][0]{
      title,
      items[]{
        title,
        url,
        page->{
          "slug": slug.current
        },
        newTab,
        children[]{
          title,
          url,
          page->{
            "slug": slug.current
          },
          description
        }
      }
    }`,
    {title}
  )
}

/**
 * Fetch all testimonials
 * @param {boolean} featuredOnly - Return only featured testimonials
 * @returns {Promise<Array>} Array of testimonials
 */
export async function getTestimonials(featuredOnly = false) {
  const filter = featuredOnly ? '&& featured == true' : ''
  return await client.fetch(
    `*[_type == "testimonial" ${filter}] | order(displayOrder asc){
      customerName,
      company,
      location,
      industry,
      quote,
      companyLogo{
        asset->{
          _id,
          url
        },
        alt
      },
      featured
    }`
  )
}

/**
 * Fetch blog posts
 * @param {number} limit - Maximum number of posts to return
 * @returns {Promise<Array>} Array of blog posts
 */
export async function getBlogPosts(limit = 10) {
  return await client.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc)[0...${limit}]{
      _id,
      title,
      "slug": slug.current,
      author,
      publishedAt,
      excerpt,
      mainImage{
        asset->{
          _id,
          url
        },
        alt
      },
      categories[]->{
        title,
        "slug": slug.current
      }
    }`
  )
}

/**
 * Fetch a single blog post by slug
 * @param {string} slug - Blog post slug
 * @returns {Promise<Object>} Blog post data
 */
export async function getBlogPost(slug) {
  return await client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      author,
      publishedAt,
      excerpt,
      mainImage{
        asset->{
          _id,
          url
        },
        alt
      },
      categories[]->{
        title,
        "slug": slug.current
      },
      body,
      metaTitle,
      metaDescription
    }`,
    {slug}
  )
}

/**
 * Fetch FAQs
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} Array of FAQs
 */
export async function getFAQs(category = null) {
  const filter = category ? `&& category == "${category}"` : ''
  return await client.fetch(
    `*[_type == "faq" ${filter}] | order(displayOrder asc){
      question,
      answer,
      category
    }`
  )
}
