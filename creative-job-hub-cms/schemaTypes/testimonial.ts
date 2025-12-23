import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g., Dallas, TX',
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      options: {
        list: [
          {title: 'HVAC', value: 'hvac'},
          {title: 'Plumbing', value: 'plumbing'},
          {title: 'Electrical', value: 'electrical'},
          {title: 'Landscaping', value: 'landscaping'},
          {title: 'Handyman', value: 'handyman'},
          {title: 'Pool Service', value: 'pool-service'},
          {title: 'Pest Control', value: 'pest-control'},
          {title: 'Cleaning', value: 'cleaning'},
          {title: 'General Contractor', value: 'general-contractor'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'metrics',
      title: 'Business Metrics',
      type: 'string',
      description: 'e.g., "12 crew members • 600+ properties"',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Testimonial',
      type: 'boolean',
      description: 'Show on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'company',
      media: 'companyLogo',
    },
  },
})
