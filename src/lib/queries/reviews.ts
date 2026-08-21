import { supabase } from '../supabaseClient';

export interface GoogleReview {
  id: string;
  name: string;
  time_text: string;
  rating: number;
  text: string;
  location: string;
  display_order: number;
  created_at: string;
}

export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const { data, error } = await supabase
    .from('google_reviews')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching google reviews:', error);
    throw error;
  }
  return data || [];
}

export async function addGoogleReview(review: Omit<GoogleReview, 'id' | 'created_at'>): Promise<GoogleReview> {
  const { data, error } = await supabase
    .from('google_reviews')
    .insert([review])
    .select()
    .single();

  if (error) {
    console.error('Error adding google review:', error);
    throw error;
  }
  return data;
}

export async function updateGoogleReview(id: string, review: Partial<GoogleReview>): Promise<GoogleReview> {
  const { data, error } = await supabase
    .from('google_reviews')
    .update(review)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating google review:', error);
    throw error;
  }
  return data;
}

export async function deleteGoogleReview(id: string): Promise<void> {
  const { error } = await supabase
    .from('google_reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting google review:', error);
    throw error;
  }
}
