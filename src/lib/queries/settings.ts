import { supabase } from '../supabaseClient';

export interface SiteSettings {
  id?: number;
  under_maintenance: boolean;
  marquee_notification: string;
  show_marquee: boolean;
  hero_title: string;
  hero_description: string;
  hero_image_url: string;
  updated_at?: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  under_maintenance: false,
  marquee_notification: 'Welcome to Ayusya Health Care. We provide professional home services across Chennai, Trichy, and Madurai.',
  show_marquee: false,
  hero_title: 'Best Home Health Care in Chennai, Trichy & Madurai',
  hero_description: 'Professional, compassionate medical and caretaker services in the comfort of your home. Recover with dignity, supported by our experienced clinical team.',
  hero_image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80'
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching site settings:', error);
      return DEFAULT_SETTINGS;
    }

    return data || DEFAULT_SETTINGS;
  } catch (err) {
    console.error('Error in getSettings:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }

  return data;
}
