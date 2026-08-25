import { supabase } from '../supabaseClient';

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  display_order: number;
}

export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching partners:', error);
    throw error;
  }
  return data || [];
}

export async function addPartner(partner: Omit<Partner, 'id'>): Promise<Partner> {
  const { data, error } = await supabase
    .from('partners')
    .insert([partner])
    .select()
    .single();

  if (error) {
    console.error('Error adding partner:', error);
    throw error;
  }
  return data;
}

export async function updatePartner(id: string, partner: Partial<Omit<Partner, 'id'>>): Promise<Partner> {
  const { data, error } = await supabase
    .from('partners')
    .update(partner)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating partner:', error);
    throw error;
  }
  return data;
}

export async function deletePartner(id: string): Promise<void> {
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting partner:', error);
    throw error;
  }
}
