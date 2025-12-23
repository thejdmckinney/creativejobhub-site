import {defineType} from 'sanity'

export default defineType({
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'faq'}],
        },
      ],
      description: 'Select FAQs from your library',
    },
    {
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          {title: 'Accordion', value: 'accordion'},
          {title: 'Two Columns', value: 'two-column'},
        ],
      },
      initialValue: 'accordion',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Light', value: 'light'},
          {title: 'Dark', value: 'dark'},
        ],
      },
      initialValue: 'light',
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      count: 'faqs.length',
    },
    prepare({title, count}) {
      return {
        title: `FAQ: ${title || 'Untitled'}`,
        subtitle: `${count || 0} questions`,
      }
    },
  },
})
