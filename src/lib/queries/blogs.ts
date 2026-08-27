import { supabase } from '../supabaseClient';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  category: string;
  author: string;
  publish_date: string;
  seo_title: string;
  seo_description: string;
  keywords: string;
  status: 'Draft' | 'Published';
  created_at: string;
  updated_at: string;
}

// 1. Get all blogs (Drafts + Published) for Admin dashboard
export async function getBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all blogs:', error);
    throw error;
  }
  return data || [];
}

// 2. Get only Published blogs for the public reader list
export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'Published')
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching published blogs:', error);
    throw error;
  }
  return data || [];
}

// 3. Fetch a single blog post by its URL slug (for detail page)
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found
      return null;
    }
    console.error(`Error fetching blog by slug ${slug}:`, error);
    throw error;
  }
  return data;
}

// 4. Add a new blog post
export async function addBlogPost(blog: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blogs')
    .insert([blog])
    .select()
    .single();

  if (error) {
    console.error('Error adding blog post:', error);
    throw error;
  }
  return data;
}

// 5. Update an existing blog post
export async function updateBlogPost(id: string, blog: Partial<BlogPost>): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blogs')
    .update({ ...blog, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
  return data;
}

// 6. Delete a blog post
export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
}
