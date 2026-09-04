import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, User, ArrowRight, BookOpen, Share2 } from 'lucide-react';
import { getPublishedBlogs, BlogPost } from '../lib/queries/blogs';
import { AnimatedSection } from '../components/shared/AnimatedSection';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { useToast } from '../components/shared/Toast';

export const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await getPublishedBlogs();
        setBlogs(data);
        setFilteredBlogs(data);
        
        // Extract unique categories dynamically
        const uniqueCats = Array.from(
          new Set(data.map((b) => b.category).filter(Boolean))
        );
        setCategories(uniqueCats);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = blogs;

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.content.toLowerCase().includes(query) ||
          (b.keywords && b.keywords.toLowerCase().includes(query)) ||
          (b.category && b.category.toLowerCase().includes(query))
      );
    }

    setFilteredBlogs(result);
  }, [searchQuery, selectedCategory, blogs]);

  const handleShare = async (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    const title = post.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      showToast('Article link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-100 flex items-center justify-center bg-warm-50/50">
        <LoadingSpinner />
      </div>
    );
  }

  // Identify the latest article as Featured (if available)
  const featuredPost = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const standardPosts = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  return (
    <>
      <Helmet>
        <title>Blog & Health Insights | Ayusya Health Care</title>
        <meta
          name="description"
          content="Explore Ayusya Health Care's blog for expert tips on home nursing, caretaker instructions, geriatric support, clinical guidance, and health guidelines."
        />
        <meta name="keywords" content="health blog, home nursing chennai, elder caretaker tips, patient care guides, medical equipment guidelines" />
        <meta property="og:title" content="Blog & Health Insights | Ayusya Health Care" />
        <meta property="og:description" content="Explore expert tips on home nursing, caretaker instructions, and geriatric support." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex-1 bg-transparent py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              Health insights & guides
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900 leading-none">
              Ayusya Health Blog
            </h1>
            <p className="text-sm sm:text-base text-warm-600 leading-relaxed">
              Stay informed with wellness articles, clinical updates, and home nursing guides curated by our expert medical advisors and care staff.
            </p>
          </div>

          {/* Search and Category Filter Section */}
          <div className="bg-white border border-warm-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-warm-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search articles, tags or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 text-sm bg-warm-50/50 border border-warm-250 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-sans"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-start md:justify-end">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-warm-50 text-warm-600 hover:bg-warm-100 hover:text-warm-900'
                }`}
              >
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'bg-warm-50 text-warm-600 hover:bg-warm-100 hover:text-warm-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-white border border-warm-200 rounded-3xl p-8 space-y-4">
              <div className="mx-auto h-12 w-12 text-warm-400 flex items-center justify-center bg-warm-100 rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-warm-900">No Articles Found</h3>
              <p className="text-sm text-warm-600 max-w-sm mx-auto">
                We couldn't find any published blog posts matching your search query or selected category filter. Please try adjusting your query.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* Featured Blog Post (Single Large Card on Top) */}
              {featuredPost && selectedCategory === 'All' && searchQuery === '' && (
                <AnimatedSection direction="up">
                  <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row text-left">
                    <div className="lg:w-1/2 aspect-video lg:aspect-auto min-h-75 bg-warm-100 relative">
                      <img
                        src={featuredPost.featured_image || "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"}
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {featuredPost.category && (
                        <span className="absolute top-4 left-4 bg-primary-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                          {featuredPost.category}
                        </span>
                      )}
                    </div>
                    <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-warm-500 text-xs font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(featuredPost.publish_date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {featuredPost.author}
                          </span>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warm-900 leading-tight hover:text-primary-600 transition-colors">
                          <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                        </h2>
                        <p className="text-sm text-warm-600 leading-relaxed line-clamp-3 font-sans">
                          {featuredPost.seo_description || featuredPost.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                      </div>
                      <div className="pt-4 border-t border-warm-100 flex items-center justify-between">
                        <Link
                          to={`/blog/${featuredPost.slug}`}
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-bold text-xs uppercase tracking-wider transition-colors group"
                        >
                          <span>Read Full Article</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <button
                          onClick={() => handleShare(featuredPost)}
                          className="inline-flex items-center gap-1.5 text-warm-500 hover:text-primary-600 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Standard Grid Layout */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
                {/* Loop articles */}
                {(selectedCategory !== 'All' || searchQuery !== '' ? filteredBlogs : standardPosts).map((post, idx) => {
                  const publishDate = new Date(post.publish_date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <AnimatedSection key={post.id} direction="up" delay={idx * 0.05}>
                      <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full justify-between">
                        <div>
                          {/* Image Box */}
                          <div className="relative aspect-video bg-warm-100">
                            <img
                              src={post.featured_image || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                            {post.category && (
                              <span className="absolute top-3 left-3 bg-primary-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                                {post.category}
                              </span>
                            )}
                          </div>

                          {/* Content Box */}
                          <div className="p-5 space-y-3.5">
                            <div className="flex items-center gap-3.5 text-warm-500 text-[10px] font-bold uppercase tracking-wider">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {publishDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </span>
                            </div>
                            <h3 className="font-serif text-lg font-bold text-warm-900 leading-snug hover:text-primary-600 transition-colors line-clamp-2">
                              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                            </h3>
                            <p className="text-xs text-warm-600 leading-relaxed font-sans line-clamp-3">
                              {post.seo_description || post.content.replace(/<[^>]*>/g, '').substring(0, 140)}...
                            </p>
                          </div>
                        </div>

                        {/* Read More button */}
                        <div className="p-5 pt-0 flex items-center justify-between">
                          <Link
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 font-bold text-[10px] uppercase tracking-wider transition-colors group"
                          >
                            <span>Read More</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </Link>
                          <button
                            onClick={() => handleShare(post)}
                            className="inline-flex items-center gap-1 text-warm-400 hover:text-primary-600 transition-colors cursor-pointer"
                            title="Share this article"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </AnimatedSection>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
