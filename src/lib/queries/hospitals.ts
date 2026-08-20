import { supabase } from '../supabaseClient';

export interface Hospital {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  more_info?: string;
  image_url?: string;
  display_order: number;
  created_at?: string;
}

export async function getHospitals(): Promise<Hospital[]> {
  const { data, error } = await supabase
    .from('tieup_hospitals')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
  return data || [];
}

export async function addHospital(hospital: Omit<Hospital, 'id' | 'created_at'>): Promise<Hospital> {
  const { data, error } = await supabase
    .from('tieup_hospitals')
    .insert([hospital])
    .select()
    .single();

  if (error) {
    console.error('Error adding hospital:', error);
    throw error;
  }
  return data;
}

export async function updateHospital(id: string, hospital: Partial<Hospital>): Promise<Hospital> {
  const { data, error } = await supabase
    .from('tieup_hospitals')
    .update(hospital)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating hospital:', error);
    throw error;
  }
  return data;
}

export async function deleteHospital(id: string): Promise<void> {
  const { error } = await supabase
    .from('tieup_hospitals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting hospital:', error);
    throw error;
  }
}
