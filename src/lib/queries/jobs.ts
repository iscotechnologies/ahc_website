import { supabase } from '../supabaseClient';

export interface JobOpening {
  id: string;
  title: string;
  location?: string;
  employment_type?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface JobApplicationInput {
  job_id?: string;
  name: string;
  email: string;
  phone: string;
  resume_url?: string;
  cover_note?: string;
}

export async function getJobOpenings(): Promise<JobOpening[]> {
  const { data, error } = await supabase
    .from('job_openings')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching job openings:', error);
    throw error;
  }
  return data || [];
}

export async function uploadResume(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file to resumes bucket:', uploadError);
    throw uploadError;
  }

  return filePath;
}

export async function submitJobApplication(application: JobApplicationInput): Promise<void> {
  const { error } = await supabase
    .from('job_applications')
    .insert([application]);

  if (error) {
    console.error('Error submitting job application:', error);
    throw error;
  }
}

export interface JobApplication {
  id: string;
  job_id: string | null;
  name: string;
  email: string;
  phone: string;
  resume_url: string | null;
  cover_note: string | null;
  status: string;
  remarks: string | null;
  created_at: string;
  job_openings?: {
    id: string;
    title: string;
  } | null;
}

// Admin fetches all jobs (including inactive ones)
export async function getAllJobOpenings(): Promise<JobOpening[]> {
  const { data, error } = await supabase
    .from('job_openings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all job openings:', error);
    throw error;
  }
  return data || [];
}

export async function addJobOpening(job: Omit<JobOpening, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('job_openings')
    .insert([job]);

  if (error) {
    console.error('Error adding job opening:', error);
    throw error;
  }
}

export async function updateJobOpening(id: string, job: Partial<JobOpening>): Promise<void> {
  const { error } = await supabase
    .from('job_openings')
    .update(job)
    .eq('id', id);

  if (error) {
    console.error('Error updating job opening:', error);
    throw error;
  }
}

export async function deleteJobOpening(id: string): Promise<void> {
  const { error } = await supabase
    .from('job_openings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting job opening:', error);
    throw error;
  }
}

export async function getJobApplications(): Promise<JobApplication[]> {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      job_openings (
        id,
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
  return (data as any) || [];
}

export async function updateJobApplication(id: string, updates: Partial<JobApplication>): Promise<void> {
  const { error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating job application:', error);
    throw error;
  }
}

export async function deleteJobApplication(id: string): Promise<void> {
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting job application:', error);
    throw error;
  }
}
