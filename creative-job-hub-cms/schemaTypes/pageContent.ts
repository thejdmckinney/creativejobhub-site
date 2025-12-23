import {defineType} from 'sanity'

export default defineType({
  name: 'pageContent',
  title: 'Page Content (Visual Editor)',
  type: 'document',
  description: 'Stores editable content for visual editor',
  fields: [
    {
      name: 'pageUrl',
      title: 'Page URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The URL path of the page (e.g., "/index.html" or "/pricing.html")',
    },
    {
      name: 'pageName',
      title: 'Page Name',
      type: 'string',
      description: 'Friendly name for this page',
    },
    {
      name: 'elements',
      title: 'Editable Elements',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'editableElement',
          fields: [
            {
              name: 'elementId',
              title: 'Element ID',
              type: 'string',
              description: 'Unique identifier for this element',
            },
            {
              name: 'elementType',
              title: 'Element Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Text', value: 'text'},
                  {title: 'Heading', value: 'heading'},
                  {title: 'Button', value: 'button'},
                  {title: 'Link', value: 'link'},
                  {title: 'Image', value: 'image'},
                  {title: 'Background Color', value: 'bgcolor'},
                  {title: 'Text Color', value: 'color'},
                ],
              },
            },
            {
              name: 'content',
              title: 'Content',
              type: 'text',
              description: 'Text content for this element',
              hidden: ({parent}) => parent?.elementType === 'image',
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
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
              hidden: ({parent}) => parent?.elementType !== 'image',
            },
            {
              name: 'styles',
              title: 'Styles',
              type: 'object',
              fields: [
                {
                  name: 'color',
                  title: 'Text Color',
                  type: 'string',
                  description: 'Hex color code (e.g., #ffffff)',
                },
                {
                  name: 'backgroundColor',
                  title: 'Background Color',
                  type: 'string',
                  description: 'Hex color code',
                },
                {
                  name: 'fontSize',
                  title: 'Font Size',
                  type: 'string',
                  description: 'CSS font size (e.g., 18px, 1.5rem)',
                },
                {
                  name: 'fontWeight',
                  title: 'Font Weight',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Normal', value: '400'},
                      {title: 'Medium', value: '500'},
                      {title: 'Semi-Bold', value: '600'},
                      {title: 'Bold', value: '700'},
                      {title: 'Extra Bold', value: '800'},
                    ],
                  },
                },
                {
                  name: 'padding',
                  title: 'Padding',
                  type: 'string',
                  description: 'CSS padding (e.g., 10px, 1rem)',
                },
                {
                  name: 'margin',
                  title: 'Margin',
                  type: 'string',
                  description: 'CSS margin',
                },
                {
                  name: 'borderRadius',
                  title: 'Border Radius',
                  type: 'string',
                  description: 'Rounded corners (e.g., 8px)',
                },
              ],
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'url',
              description: 'For buttons and links',
              hidden: ({parent}) => !['button', 'link'].includes(parent?.elementType),
            },
          ],
          preview: {
            select: {
              title: 'elementId',
              type: 'elementType',
              content: 'content',
            },
            prepare({title, type, content}) {
              return {
                title: title || 'Unnamed element',
                subtitle: `${type}: ${content ? content.substring(0, 50) + '...' : 'No content'}`,
              }
            },
          },
        },
      ],
    },
    {
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'pageName',
      url: 'pageUrl',
      updated: 'updatedAt',
    },
    prepare({title, url, updated}) {
      return {
        title: title || url,
        subtitle: `${url} - Updated ${new Date(updated).toLocaleDateString()}`,
      }
    },
  },
})
