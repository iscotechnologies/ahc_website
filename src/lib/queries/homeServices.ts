import { supabase } from '../supabaseClient';

export interface HomeService {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_alt?: string;
  display_order: number;
  created_at?: string;
}

export async function getHomeServices(): Promise<HomeService[]> {
  const { data, error } = await supabase
    .from('homepage_services')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching homepage services:', error);
    throw error;
  }
  return data || [];
}

export async function addHomeService(service: Omit<HomeService, 'id' | 'created_at'>): Promise<HomeService> {
  const { data, error } = await supabase
    .from('homepage_services')
    .insert([service])
    .select()
    .single();

  if (error) {
    console.error('Error adding homepage service:', error);
    throw error;
  }
  return data;
}

export async function updateHomeService(id: string, service: Partial<HomeService>): Promise<HomeService> {
  const { data, error } = await supabase
    .from('homepage_services')
    .update(service)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating homepage service:', error);
    throw error;
  }
  return data;
}

export async function deleteHomeService(id: string): Promise<void> {
  const { error } = await supabase
    .from('homepage_services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting homepage service:', error);
    throw error;
  }
}
