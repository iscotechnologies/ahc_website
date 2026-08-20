import { supabase } from '../supabaseClient';

export interface TeamMember {
  id: string;
  name: string;
  qualification?: string;
  specialty?: string;
  role_tag: string;
  photo_url?: string;
  bio?: string;
  detail_slug?: string;
  featured_on_home: boolean;
  display_order: number;
  created_at: string;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
  return data || [];
}

export async function getHomeFeaturedTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('featured_on_home', true)
    .order('display_order', { ascending: true })
    .limit(5);

  if (error) {
    console.error('Error fetching featured team members:', error);
    throw error;
  }
  return data || [];
}

export async function addTeamMember(member: Omit<TeamMember, 'id' | 'created_at'>): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .insert([member])
    .select()
    .single();

  if (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
  return data;
}

export async function updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .update(member)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
  return data;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
}

