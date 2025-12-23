import {defineType} from 'sanity'

export default defineType({
  name: 'textSection',
  title: 'Rich Text Section',
  type: 'object',
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'maxWidth',
      title: 'Maximum Width',
      type: 'string',
      options: {
        list: [
          {title: 'Narrow', value: 'narrow'},
          {title: 'Standard', value: 'standard'},
          {title: 'Wide', value: 'wide'},
          {title: 'Full Width', value: 'full'},
        ],
      },
      initialValue: 'standard',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'White', value: 'white'},
          {title: 'Light Gray', value: 'light'},
          {title: 'Dark', value: 'dark'},
        ],
      },
      initialValue: 'white',
    },
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare() {
      return {
        title: 'Rich Text Section',
        subtitle: 'Content block with formatting',
      }
    },
  },
})
