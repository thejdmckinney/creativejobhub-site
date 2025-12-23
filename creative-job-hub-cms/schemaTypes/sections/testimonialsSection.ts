import {defineType} from 'sanity'

export default defineType({
  name: 'testimonialsSection',
  title: 'Testimonials Section',
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
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'testimonial'}],
        },
      ],
      description: 'Select testimonials from your library',
    },
    {
      name: 'displayStyle',
      title: 'Display Style',
      type: 'string',
      options: {
        list: [
          {title: 'Carousel/Slider', value: 'carousel'},
          {title: 'Grid', value: 'grid'},
          {title: 'Single Featured', value: 'featured'},
        ],
      },
      initialValue: 'grid',
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
      count: 'testimonials.length',
    },
    prepare({title, count}) {
      return {
        title: `Testimonials: ${title || 'Untitled'}`,
        subtitle: `${count || 0} testimonials`,
      }
    },
  },
})
