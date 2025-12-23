import {defineType} from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Navigation Title',
      type: 'string',
      description: 'Internal name for this navigation (e.g., "Main Menu", "Footer Menu")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            {
              name: 'title',
              title: 'Link Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
              description: 'Can be internal (/about) or external (https://...)',
            },
            {
              name: 'page',
              title: 'Or Link to Page',
              type: 'reference',
              to: [{type: 'page'}],
              description: 'Alternatively, select a page to link to',
            },
            {
              name: 'newTab',
              title: 'Open in New Tab',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'children',
              title: 'Sub-menu Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'title',
                      title: 'Link Text',
                      type: 'string',
                    },
                    {
                      name: 'url',
                      title: 'URL',
                      type: 'string',
                    },
                    {
                      name: 'page',
                      title: 'Or Link to Page',
                      type: 'reference',
                      to: [{type: 'page'}],
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 2,
                      description: 'Optional description for mega menu',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      url: 'url',
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title',
              url: 'url',
              hasChildren: 'children',
            },
            prepare({title, url, hasChildren}) {
              return {
                title: title,
                subtitle: url || (hasChildren && hasChildren.length > 0 ? `${hasChildren.length} sub-items` : ''),
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      itemCount: 'items.length',
    },
    prepare({title, itemCount}) {
      return {
        title: title,
        subtitle: `${itemCount || 0} items`,
      }
    },
  },
})
