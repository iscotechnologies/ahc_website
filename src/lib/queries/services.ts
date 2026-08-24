import { supabase } from '../supabaseClient';

export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  hero_image_url: string;
  icon: string;
  display_order: number;
  created_at: string;
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
  return data || [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found
      return null;
    }
    console.error(`Error fetching service by slug ${slug}:`, error);
    throw error;
  }
  return data;
}

export async function addService(service: Omit<Service, 'id' | 'created_at'>): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();

  if (error) {
    console.error('Error adding service:', error);
    throw error;
  }
  return data;
}

export async function updateService(id: string, service: Partial<Service>): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .update(service)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}
