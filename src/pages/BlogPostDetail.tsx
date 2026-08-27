import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, Clock, Share2, Link2, AlertCircle } from 'lucide-react';

import { getBlogPostBySlug, BlogPost } from '../lib/queries/blogs';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { useToast } from '../components/shared/Toast';

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBlogPost() {
      if (!slug) return;
      try {
        const data = await getBlogPostBySlug(slug);
        setBlog(data);
      } catch (err) {
        console.error('Failed to load blog article:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogPost();
  }, [slug]);

  // Handle Share link copy
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Article link copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-100 flex items-center justify-center bg-warm-50/50">
        <LoadingSpinner />
      </div>
    );
  }

  // Not found state
  if (!blog) {
    return (
      <div className="flex-1 bg-transparent py-20 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        <div className="h-16 w-16 text-red-500 bg-red-50 flex items-center justify-center rounded-full mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warm-900 mb-2">Article Not Found</h2>
        <p className="text-sm sm:text-base text-warm-600 max-w-md mb-8 leading-relaxed">
          The blog post you are looking for might have been removed, had its name changed, or is temporarily offline.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Blogs</span>
        </Link>
      </div>
    );
  }

  // Formatting date
  const publishDate = new Date(blog.publish_date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Calculate reading time roughly (words / 200 words per min)
  const wordCount = blog.content ? blog.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 220));

  // Social Share links
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(blog.title);
  const shareFb = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  const shareTwitter = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
  const shareWa = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;

  // Content processing (ensure simple spacing and linebreaks show correctly)
  // If it doesn't contain HTML tags, convert newlines to paragraphs/breaks
  const renderContent = () => {
    const hasHtml = /<[a-z][\s\S]*>/i.test(blog.content);
    if (!hasHtml) {
      // Process plaintext newlines
      return blog.content.split('\n').map((para, idx) => {
        if (!para.trim()) return <br key={idx} />;
        return <p key={idx} className="mb-4 text-warm-700 leading-relaxed font-sans">{para}</p>;
      });
    }
    // Renders HTML formatted content safely
    return <div dangerouslySetInnerHTML={{ __html: blog.content }} className="prose prose-warm max-w-none prose-sm sm:prose-base font-sans text-warm-700 leading-relaxed" />;
  };

  return (
    <>
      <Helmet>
        {/* Dynamic SEO Tags */}
        <title>{blog.seo_title || blog.title} | Ayusya Health Care</title>
        <meta name="description" content={blog.seo_description || blog.content.replace(/<[^>]*>/g, '').substring(0, 155)} />
        {blog.keywords && <meta name="keywords" content={blog.keywords} />}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.seo_title || blog.title} />
        <meta property="og:description" content={blog.seo_description || blog.content.replace(/<[^>]*>/g, '').substring(0, 155)} />
        {blog.featured_image && <meta property="og:image" content={blog.featured_image} />}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="Ayusya Health Care" />
        <meta property="article:published_time" content={blog.publish_date} />
        <meta property="article:author" content={blog.author} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.seo_title || blog.title} />
        <meta name="twitter:description" content={blog.seo_description || blog.content.replace(/<[^>]*>/g, '').substring(0, 155)} />
        {blog.featured_image && <meta name="twitter:image" content={blog.featured_image} />}
      </Helmet>

      <div className="flex-1 bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-left">
        <div className="mx-auto max-w-3xl space-y-8">
          
          {/* Breadcrumbs & Back Link */}
          <div className="flex items-center justify-between border-b border-warm-150 pb-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-warm-600 hover:text-primary-600 uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blogs</span>
            </Link>
            <div className="hidden sm:flex gap-1 text-[10px] font-bold text-warm-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-primary-600">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-primary-600">Blog</Link>
              <span>/</span>
              <span className="text-warm-500 max-w-37.5 truncate">{blog.category || 'Article'}</span>
            </div>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            {blog.category && (
              <span className="inline-block bg-primary-50 border border-primary-200 text-primary-700 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                {blog.category}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-warm-900 tracking-tight leading-tight">
              {blog.title}
            </h1>
            
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-warm-500 text-xs font-semibold pt-2 border-t border-warm-100/70">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary-500" />
                {publishDate}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-primary-500" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary-500" />
                {readingTime} min read
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featured_image && (
            <div className="rounded-3xl border border-warm-200 overflow-hidden shadow-xs aspect-video bg-warm-50">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content Box */}
          <article className="bg-white border border-warm-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs relative">
            <div className="font-sans text-sm sm:text-base text-warm-750 space-y-4 prose-container">
              {renderContent()}
            </div>

            {/* Share and Tags footer */}
            <div className="mt-10 pt-6 border-t border-warm-100 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              
              {/* Share links */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-warm-500 uppercase tracking-wider flex items-center gap-1">
                  <Share2 className="h-4 w-4 text-warm-400" />
                  <span>Share:</span>
                </span>
                <div className="flex gap-2">
                  <a
                    href={shareFb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-warm-50 text-warm-600 hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-xs"
                    title="Share on Facebook"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href={shareTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-warm-50 text-warm-600 hover:bg-sky-50 hover:text-sky-500 transition-colors shadow-xs"
                    title="Share on Twitter"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  <a
                    href={shareWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-warm-50 text-warm-600 hover:bg-green-50 hover:text-green-650 transition-colors shadow-xs"
                    title="Share on WhatsApp"
                  >
                    {/* Render a custom SVG for WhatsApp since Lucide doesn't have it natively */}
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.879-6.979C16.596 1.9 14.116.879 11.479.878c-5.414 0-9.842 4.43-9.845 9.869-.001 1.736.469 3.43 1.36 4.93L2.009 21.99l6.181-1.622c1.47.8 2.87 1.2 4.457 1.2z" />
                    </svg>
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-warm-50 text-warm-600 hover:bg-warm-150 transition-colors shadow-xs cursor-pointer"
                    title="Copy Article Link"
                  >
                    <Link2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                  {blog.author.charAt(0)}
                </div>
                <div className="text-xs">
                  <p className="text-warm-400 font-bold uppercase tracking-wider text-[9px] leading-none">Written By</p>
                  <p className="text-warm-900 font-bold font-serif text-sm mt-0.5">{blog.author}</p>
                </div>
              </div>

            </div>
          </article>

          {/* Clinical advisory signoff banner */}
          <div className="bg-primary-50/50 border border-primary-100 rounded-3xl p-6 flex items-start gap-4 text-left">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-white border border-primary-200 flex items-center justify-center text-primary-600 font-bold">
              ✦
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-primary-800 uppercase tracking-widest">Medical Disclaimer</h4>
              <p className="text-xs text-warm-600 leading-relaxed font-sans font-medium">
                The content shared in Ayusya Health Blog is intended for informational and educational purposes only. It is not a substitute for professional medical advice, clinical diagnosis, or home treatment plans. Always consult your family physician or registered home nurse in case of emergency check-ups.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
