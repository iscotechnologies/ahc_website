import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  const slug = req.query.slug;

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
      console.error('Supabase fetch failed:', e.message);
    }
  } else {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars');
  }

  if (!blogData) {
    console.error('No blog found for slug:', slug);
  }

  const siteUrl = 'https://www.ayusyahealthcare.com';
  const defaultImage = `${siteUrl}/favicon.jpeg`;

  const ogTitle = blogData
    ? `${blogData.seo_title || blogData.title} | Ayusya Health Care`
    : 'Ayusya Health Care | Best Home Health Care in Chennai & Madurai';

  const rawDesc = blogData
    ? (blogData.seo_description || (blogData.content || '').replace(/<[^>]*>/g, '').substring(0, 155))
    : 'Ayusya Health Care provides the best home health care services in Chennai & Madurai.';

  const ogDescription = rawDesc.replace(/"/g, '&quot;');

  let ogImage = blogData?.featured_image || defaultImage;
  if (ogImage && !ogImage.startsWith('http')) {
    ogImage = `${siteUrl}${ogImage}`;
  }

  const ogUrl = `${siteUrl}/blog/${slug}`;

  let html;
  try {
    html = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf-8');
  } catch {
    try {
      html = readFileSync(join(process.cwd(), 'index.html'), 'utf-8');
    } catch {
      return res.status(500).send('index.html not found');
    }
  }

  const ogTags = `
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${ogTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${ogUrl}" />
    <meta property="og:site_name" content="Ayusya Health Care" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />`;

  if (html.includes('</head>')) {
    html = html.replace('</head>', `${ogTags}\n  </head>`);
  } else {
    html = `<head>${ogTags}</head>` + html;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.status(200).send(html);
}

export const config = {
  runtime: 'nodejs',
};
