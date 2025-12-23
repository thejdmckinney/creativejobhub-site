import {defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Internal name for this page',
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'The URL path for this page (e.g., "about-us")',
    },
    {
      name: 'pageTemplate',
      title: 'Page Template',
      type: 'string',
      options: {
        list: [
          {title: 'Standard Page', value: 'standard'},
          {title: 'Landing Page', value: 'landing'},
          {title: 'Industry Page', value: 'industry'},
          {title: 'Feature Page', value: 'feature'},
          {title: 'Comparison Page', value: 'comparison'},
        ],
      },
      initialValue: 'standard',
      description: 'Choose a template style for this page',
    },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Build your page by adding and arranging sections',
      of: [
        {type: 'heroSection'},
        {type: 'featuresSection'},
        {type: 'testimonialsSection'},
        {type: 'ctaSection'},
        {type: 'textSection'},
        {type: 'pricingSection'},
        {type: 'faqSection'},
        {type: 'imageSection'},
      ],
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'seoSettings',
      description: 'Configure SEO settings for this page',
    },
    {
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Display this page in the main navigation menu',
      initialValue: false,
    },
    {
      name: 'navigationOrder',
      title: 'Navigation Order',
      type: 'number',
      description: 'Order in navigation menu (lower numbers appear first)',
      hidden: ({document}) => !document?.showInNavigation,
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Publish this page to make it live',
      initialValue: false,
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When this page was published',
    },
  ],
  orderings: [
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
    {
      title: 'Published Date, New',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      published: 'published',
    },
    prepare({title, slug, published}) {
      return {
        title: title,
        subtitle: `/${slug || 'no-slug'} ${published ? '✓ Published' : '○ Draft'}`,
      }
    },
  },
})
