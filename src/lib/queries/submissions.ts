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

/**
 * Helper to send email notification on new submission via EmailJS REST API
 */
async function sendEmailNotification(params: {
  form_type: string;
  name: string;
  phone: string;
  email?: string;
  details_html: string;
}): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // If credentials are not set or are default placeholders, skip sending
  if (
    !serviceId || 
    !templateId || 
    !publicKey || 
    serviceId === 'your_service_id' || 
    templateId === 'your_template_id' || 
    publicKey === 'your_public_key'
  ) {
    console.warn('EmailJS environment variables not set. Skipping email notification.');
    return;
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          form_type: params.form_type,
          name: params.name,
          phone: params.phone,
          email: params.email || 'Not provided',
          submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          details_html: params.details_html,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailJS request failed:', response.status, errorText);
    } else {
      console.log(`Email notification sent successfully for ${params.form_type}`);
    }
  } catch (err) {
    console.error('Error calling EmailJS REST API:', err);
  }
}

export async function submitContact(input: ContactSubmissionInput): Promise<void> {
  const { error } = await supabase
    .from('contact_submissions')
    .insert([input]);

  if (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }

  // Send Email Notification (Async, non-blocking)
  const detailsHtml = `
    <p><strong>Location:</strong> ${input.location || 'N/A'}</p>
    <p><strong>Message:</strong> ${input.message || 'N/A'}</p>
  `;
  sendEmailNotification({
    form_type: 'Contact Enquiry',
    name: input.name,
    phone: input.phone,
    email: input.email,
    details_html: detailsHtml,
  }).catch((err) => console.error('Email sending error:', err));
}

export async function submitMembership(input: MembershipSubmissionInput): Promise<void> {
  const { error } = await supabase
    .from('membership_submissions')
    .insert([input]);

  if (error) {
    console.error('Error submitting membership form:', error);
    throw error;
  }

  // Send Email Notification (Async, non-blocking)
  const detailsHtml = `
    <p><strong>Plan Tier:</strong> ${input.plan_tier || 'N/A'}</p>
    <p><strong>Preferred Start Date:</strong> ${input.preferred_start_date || 'Immediate'}</p>
    <p><strong>Residential Address:</strong><br />${input.address || 'N/A'}</p>
  `;
  sendEmailNotification({
    form_type: 'Annual Membership Enrollment',
    name: input.name,
    phone: input.phone,
    email: input.email,
    details_html: detailsHtml,
  }).catch((err) => console.error('Email sending error:', err));
}

export async function submitReferral(input: ReferralSubmissionInput): Promise<void> {
  const { error } = await supabase
    .from('referral_submissions')
    .insert([input]);

  if (error) {
    console.error('Error submitting referral form:', error);
    throw error;
  }

  // Send Email Notification (Async, non-blocking)
  const detailsHtml = `
    <p><strong>Organization / Hospital Name:</strong> ${input.organization || 'N/A'}</p>
    <p><strong>Relationship / Partner Type:</strong> ${input.relationship_type || 'N/A'}</p>
    <p><strong>Referral Details / Collaboration Ideas:</strong><br />${input.message || 'N/A'}</p>
  `;
  sendEmailNotification({
    form_type: 'Referral Setup Request',
    name: input.name,
    phone: input.phone,
    email: input.email,
    details_html: detailsHtml,
  }).catch((err) => console.error('Email sending error:', err));
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

export interface ReferralSubmission {
  id: string;
  name: string;
  organization: string | null;
  phone: string;
  email: string | null;
  relationship_type: string | null;
  message: string | null;
  created_at: string;
}

export async function getReferralSubmissions(): Promise<ReferralSubmission[]> {
  const { data, error } = await supabase
    .from('referral_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching referral submissions:', error);
    throw error;
  }
  return data || [];
}

export async function deleteReferralSubmission(id: string): Promise<void> {
  const { error } = await supabase
    .from('referral_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting referral submission:', error);
    throw error;
  }
}
