import {defineType} from 'sanity'

export default defineType({
  name: 'ctaSection',
  title: 'Call-to-Action Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'buttons',
      title: 'Buttons',
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
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Brand Blue', value: 'brand'},
          {title: 'Dark', value: 'dark'},
          {title: 'Gradient', value: 'gradient'},
        ],
      },
      initialValue: 'brand',
    },
    {
      name: 'alignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'center',
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'description',
    },
    prepare({title, subtitle}) {
      return {
        title: `CTA: ${title || 'Untitled'}`,
        subtitle: subtitle,
      }
    },
  },
})
