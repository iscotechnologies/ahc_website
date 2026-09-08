import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(404).send('Not found');
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  let blogData = null;

  if (supabaseUrl && supabaseKey) {
    try {
      const apiRes = await fetch(
        `${supabaseUrl}/rest/v1/blogs?slug=eq.${encodeURIComponent(slug)}&status=eq.Published&select=title,seo_title,seo_description,featured_image,category,author`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Accept: 'application/json',
          },
        }
      );
      const blogs = await apiRes.json();
      blogData = blogs?.[0] || null;
    } catch (e) {
      console.error('Failed to fetch blog:', e);
    }
  }

  const ogTitle = blogData
    ? `${blogData.seo_title || blogData.title} | Ayusya Health Care`
    : 'Ayusya Health Care | Best Home Health Care in Chennai & Madurai';

  const ogDescription = blogData
    ? (blogData.seo_description || (blogData.content || '').replace(/<[^>]*>/g, '').substring(0, 155))
    : 'Ayusya Health Care provides the best home health care services in Chennai & Madurai.';

  let ogImage = blogData?.featured_image || 'https://www.ayusyahealthcare.com/favicon.jpeg';
  if (ogImage && !ogImage.startsWith('http')) {
    ogImage = `https://www.ayusyahealthcare.com${ogImage}`;
  }

  const ogUrl = `https://www.ayusyahealthcare.com/blog/${slug}`;

  let html;
  try {
    html = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf-8');
  } catch {
    return res.status(500).send('Build not found. Run npm run build first.');
  }

  const ogTags = `
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${ogUrl}" />
    <meta property="og:site_name" content="Ayusya Health Care" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />`;

  html = html.replace('</head>', `${ogTags}\n  </head>`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.status(200).send(html);
}

export const config = {
  runtime: 'nodejs',
};
