import {defineType} from 'sanity'

export default defineType({
  name: 'pricingSection',
  title: 'Pricing Section',
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
      name: 'pricingPlans',
      title: 'Pricing Plans',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Plan Name',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Plan Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'e.g., "$49/month" or "Custom"',
            },
            {
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{type: 'string'}],
            },
            {
              name: 'highlighted',
              title: 'Highlight This Plan',
              type: 'boolean',
              description: 'Mark as "Most Popular"',
              initialValue: false,
            },
            {
              name: 'ctaButton',
              title: 'CTA Button',
              type: 'object',
              fields: [
                {name: 'text', type: 'string', title: 'Button Text'},
                {name: 'url', type: 'string', title: 'Button URL'},
              ],
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'price',
            },
          },
        },
      ],
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
      planCount: 'pricingPlans.length',
    },
    prepare({title, planCount}) {
      return {
        title: `Pricing: ${title || 'Untitled'}`,
        subtitle: `${planCount || 0} plans`,
      }
    },
  },
})
