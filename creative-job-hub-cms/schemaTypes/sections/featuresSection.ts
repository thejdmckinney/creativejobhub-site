import {defineType} from 'sanity'

export default defineType({
  name: 'featuresSection',
  title: 'Features Section',
  type: 'object',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    },
    {
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Font Awesome icon class (e.g., fa-calendar, fa-truck)',
            },
            {
              name: 'title',
              title: 'Feature Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Feature Description',
              type: 'text',
              rows: 3,
            },
            {
              name: 'image',
              title: 'Feature Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                },
              ],
            },
            {
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                {name: 'text', type: 'string', title: 'Link Text'},
                {name: 'url', type: 'string', title: 'URL'},
              ],
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'image',
            },
          },
        },
      ],
    },
    {
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          {title: 'Grid - 2 Columns', value: 'grid-2'},
          {title: 'Grid - 3 Columns', value: 'grid-3'},
          {title: 'Grid - 4 Columns', value: 'grid-4'},
          {title: 'List - Alternating', value: 'list-alternating'},
        ],
      },
      initialValue: 'grid-3',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
          {title: 'Brand', value: 'brand'},
        ],
      },
      initialValue: 'light',
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      featureCount: 'features.length',
    },
    prepare({title, featureCount}) {
      return {
        title: `Features: ${title || 'Untitled'}`,
        subtitle: `${featureCount || 0} features`,
      }
    },
  },
})
