import {defineType} from 'sanity'

export default defineType({
  name: 'seoSettings',
  title: 'SEO Settings',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'SEO title (appears in search results and browser tabs)',
      validation: (Rule) => Rule.max(60).warning('Titles over 60 characters may be truncated'),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description (appears in search results)',
      validation: (Rule) =>
        Rule.max(160).warning('Descriptions over 160 characters may be truncated'),
    },
    {
      name: 'metaKeywords',
      title: 'Meta Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description: 'SEO keywords',
    },
    {
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image that appears when sharing on social media (1200x630px recommended)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'The preferred URL for this page (optional)',
    },
    {
      name: 'noIndex',
      title: 'Hide from Search Engines',
      type: 'boolean',
      description: 'Check to prevent search engines from indexing this page',
      initialValue: false,
    },
  ],
})
