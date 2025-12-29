/**
 * Dynamic Sitemap Generator for Sanity Blog Posts
 * Run this to generate an updated sitemap with all blog posts
 */

const SANITY_PROJECT_ID = '53m7wbm0';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';
const SITE_URL = 'https://www.creativejobhub.com';

async function fetchBlogPosts() {
  const query = encodeURIComponent(`*[_type == "blogPost"] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    _updatedAt
  }`);
  
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;
  
  const response = await fetch(url);
  const data = await response.json();
  return data.result;
}

async function generateSitemap() {
  console.log('Fetching blog posts from Sanity...');
  const posts = await fetchBlogPosts();
  console.log(`Found ${posts.length} blog posts`);

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: 'blog/', priority: '0.9', changefreq: 'daily' },
    { url: 'pricing/', priority: '0.9', changefreq: 'monthly' },
    { url: 'features/', priority: '0.8', changefreq: 'monthly' },
    { url: 'industries/', priority: '0.8', changefreq: 'monthly' },
    { url: 'contact/', priority: '0.7', changefreq: 'monthly' },
  ];

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${SITE_URL}/${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add blog posts
  posts.forEach(post => {
    const lastmod = post._updatedAt || post.publishedAt;
    const date = new Date(lastmod).toISOString().split('T')[0];
    
    xml += `  <url>
    <loc>${SITE_URL}/blog/post.html?slug=${post.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  xml += `</urlset>`;

  return xml;
}

// Main execution
generateSitemap()
  .then(xml => {
    console.log('\n✅ Sitemap generated successfully!\n');
    console.log('Copy the content below and save it to sitemap.xml:\n');
    console.log('---START---');
    console.log(xml);
    console.log('---END---');
    console.log('\nOr run: node generate-sitemap.js > sitemap.xml');
  })
  .catch(error => {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  });
