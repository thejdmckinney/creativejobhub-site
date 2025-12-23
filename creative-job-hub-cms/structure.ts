import {StructureBuilder} from 'sanity/structure'
import {
  CogIcon,
  DocumentsIcon,
  ImagesIcon,
  MenuIcon,
  RocketIcon,
  UsersIcon,
  DocumentTextIcon,
  HelpCircleIcon,
  StarIcon,
} from '@sanity/icons'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Pages
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(S.documentTypeList('page').title('All Pages')),

      S.divider(),

      // Content Library
      S.listItem()
        .title('Blog')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Posts')
                .icon(DocumentTextIcon)
                .child(S.documentTypeList('blogPost').title('Blog Posts')),
              S.listItem()
                .title('Categories')
                .icon(MenuIcon)
                .child(S.documentTypeList('category').title('Categories')),
            ])
        ),

      S.listItem()
        .title('Testimonials')
        .icon(StarIcon)
        .child(S.documentTypeList('testimonial').title('Testimonials')),

      S.listItem()
        .title('FAQs')
        .icon(HelpCircleIcon)
        .child(S.documentTypeList('faq').title('FAQs')),

      S.divider(),

      // Media
      S.listItem()
        .title('Media Library')
        .icon(ImagesIcon)
        .child(S.documentTypeList('mediaAsset').title('Media Library')),

      S.divider(),

      // Site Settings
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.listItem()
                .title('General Settings')
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Site Settings')
                ),
              S.listItem()
                .title('Navigation Menus')
                .icon(MenuIcon)
                .child(S.documentTypeList('navigation').title('Navigation Menus')),
            ])
        ),
    ])
