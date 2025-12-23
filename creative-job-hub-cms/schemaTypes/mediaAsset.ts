import {defineType} from 'sanity'

export default defineType({
  name: 'mediaAsset',
  title: 'Media Library',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Descriptive name for this media file',
    },
    {
      name: 'file',
      title: 'File',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Add tags to organize and search your media',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Hero Images', value: 'hero'},
          {title: 'Feature Images', value: 'feature'},
          {title: 'Screenshots', value: 'screenshot'},
          {title: 'Logos', value: 'logo'},
          {title: 'Team Photos', value: 'team'},
          {title: 'Blog Images', value: 'blog'},
          {title: 'Icons', value: 'icon'},
          {title: 'Other', value: 'other'},
        ],
      },
    },
    {
      name: 'uploadedAt',
      title: 'Upload Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  orderings: [
    {
      title: 'Upload Date, New',
      name: 'uploadedDesc',
      by: [{field: 'uploadedAt', direction: 'desc'}],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'file',
      category: 'category',
    },
    prepare({title, media, category}) {
      return {
        title: title,
        subtitle: category || 'Uncategorized',
        media,
      }
    },
  },
})
