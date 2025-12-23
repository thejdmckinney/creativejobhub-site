import {defineType} from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3,
    },
    {
      name: 'ctaButtons',
      title: 'CTA Buttons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'text', type: 'string', title: 'Button Text'},
            {name: 'url', type: 'string', title: 'Button URL'},
            {
              name: 'style',
              type: 'string',
              title: 'Button Style',
              options: {
                list: [
                  {title: 'Primary', value: 'primary'},
                  {title: 'Secondary', value: 'secondary'},
                  {title: 'Outline', value: 'outline'},
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
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
    },
    {
      name: 'backgroundVideo',
      title: 'Background Video URL',
      type: 'url',
      description: 'Optional video background (YouTube, Vimeo, or direct video URL)',
    },
    {
      name: 'height',
      title: 'Section Height',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: 'standard'},
          {title: 'Tall', value: 'tall'},
          {title: 'Full Screen', value: 'fullscreen'},
        ],
      },
      initialValue: 'standard',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'subheading',
      media: 'backgroundImage',
    },
    prepare({title, subtitle}) {
      return {
        title: `Hero: ${title || 'Untitled'}`,
        subtitle: subtitle,
      }
    },
  },
})
