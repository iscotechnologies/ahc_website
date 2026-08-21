import { supabase } from '../supabaseClient';

export interface ContactSubmissionInput {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  service_interested?: string | null;
  message?: string;
}

export interface MembershipSubmissionInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  plan_tier?: string;
  preferred_start_date?: string;
}

export interface ReferralSubmissionInput {
  name: string;
  organization?: string;
  phone: string;
  email?: string;
  relationship_type?: string;
  message?: string;
}

export async function submitContact(input: ContactSubmissionInput): Promise<void> {
  const { error } = await supabase
    .from('contact_submissions')
    .insert([input]);

  if (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

export async function submitMembership(input: MembershipSubmissionInput): Promise<void> {
  const { error } = await supabase
    .from('membership_submissions')
    .insert([input]);

  if (error) {
    console.error('Error submitting membership form:', error);
    throw error;
  }
}

export async function submitReferral(input: ReferralSubmissionInput): Promise<void> {
  const { error } = await supabase
    .from('referral_submissions')
    .insert([input]);

  if (error) {
    console.error('Error submitting referral form:', error);
    throw error;
  }
}

export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  location: string | null;
  service_interested: string | null;
  message: string | null;
  status: string;
  remarks: string | null;
  created_at: string;
  services?: {
    id: string;
    title: string;
  } | null;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select(`
      *,
      services:service_interested (
        id,
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact submissions:', error);
    throw error;
  }
  return (data as any) || [];
}

export async function updateContactSubmission(id: string, updates: Partial<ContactSubmission>): Promise<void> {
  const { error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating contact submission:', error);
    throw error;
  }
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact submission:', error);
    throw error;
  }
}

export interface MembershipSubmission {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  plan_tier: string | null;
  preferred_start_date: string | null;
  status: string;
  remarks: string | null;
  created_at: string;
}

export async function getMembershipSubmissions(): Promise<MembershipSubmission[]> {
  const { data, error } = await supabase
    .from('membership_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching membership submissions:', error);
    throw error;
  }
  return data || [];
}

export async function updateMembershipSubmission(id: string, updates: Partial<MembershipSubmission>): Promise<void> {
  const { error } = await supabase
    .from('membership_submissions')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating membership submission:', error);
    throw error;
  }
}

export async function deleteMembershipSubmission(id: string): Promise<void> {
  const { error } = await supabase
    .from('membership_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting membership submission:', error);
    throw error;
  }
}
