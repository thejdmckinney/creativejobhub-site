// Base content types
import blockContent from './blockContent'
import category from './category'
import blogPost from './blogPost'
import testimonial from './testimonial'
import faq from './faq'

// Page building
import seoSettings from './seoSettings'
import page from './page'
import pageContent from './pageContent'

// Page sections
import heroSection from './sections/heroSection'
import featuresSection from './sections/featuresSection'
import testimonialsSection from './sections/testimonialsSection'
import ctaSection from './sections/ctaSection'
import textSection from './sections/textSection'
import pricingSection from './sections/pricingSection'
import faqSection from './sections/faqSection'
import imageSection from './sections/imageSection'

// Site management
import siteSettings from './siteSettings'
import navigation from './navigation'
import mediaAsset from './mediaAsset'

export const schemaTypes = [
  // Base content
  blockContent,
  category,
  blogPost,
  testimonial,
  faq,
  
  // SEO
  seoSettings,
  
  // Page sections
  heroSection,
  featuresSection,
  testimonialsSection,
  ctaSection,
  textSection,
  pricingSection,
  faqSection,
  imageSection,
  
  // Pages
  page,
  pageContent,
  
  // Site management
  siteSettings,
  navigation,
  mediaAsset,
]
