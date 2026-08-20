-- Supabase Database Schema for Ayusya Health Care Website

-- 1. Services Offered
create table services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text,
  full_description text,
  hero_image_url text,
  icon text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 2. Team / Clinical Associates
create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  qualification text,
  specialty text,
  role_tag text default 'Clinical Associate',
  photo_url text,
  bio text,
  detail_slug text,
  featured_on_home boolean default false,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 3. Video Testimonials
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  patient_name text,
  location text,
  youtube_id text not null,
  thumbnail_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 4. Partner / Clinical Associate Logos
create table partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  website_url text,
  display_order int default 0
);

-- 5. Career Postings
create table job_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  employment_type text,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 6. Form Submissions - Contact Us
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  location text,
  service_interested uuid references services(id) on delete set null,
  message text,
  created_at timestamptz default now()
);

-- 7. Form Submissions - Annual Membership
create table membership_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  address text,
  plan_tier text,
  preferred_start_date date,
  created_at timestamptz default now()
);

-- 8. Form Submissions - Referral Partner
create table referral_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  phone text not null,
  email text,
  relationship_type text,
  message text,
  created_at timestamptz default now()
);

-- 9. Form Submissions - Job Applications
create table job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references job_openings(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  resume_url text,
  cover_note text,
  created_at timestamptz default now()
);

-- 10. Site Settings (Single-Row Pattern)
create table site_settings (
  id int primary key default 1,
  under_maintenance boolean default false,
  marquee_notification text default '',
  show_marquee boolean default false,
  hero_title text default 'Best Home Health Care in Chennai, Trichy & Madurai',
  hero_description text default 'Professional, compassionate medical and caretaker services in the comfort of your home. Recover with dignity, supported by our experienced clinical team.',
  hero_image_url text default 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80',
  updated_at timestamptz default now(),
  constraint check_single_row check (id = 1)
);

-- 11. Tie-up Hospitals / Partner Hospitals
create table tieup_hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,
  description text,
  more_info text,
  image_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- =========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================

-- Enable RLS on all tables
alter table services enable row level security;
alter table team_members enable row level security;
alter table testimonials enable row level security;
alter table partners enable row level security;
alter table job_openings enable row level security;
alter table contact_submissions enable row level security;
alter table membership_submissions enable row level security;
alter table referral_submissions enable row level security;
alter table job_applications enable row level security;
alter table site_settings enable row level security;
alter table tieup_hospitals enable row level security;

-- 1. Services: Public Read, Authenticated Write
create policy "Enable select for anonymous users" on services
  for select to anon using (true);
create policy "Enable select for authenticated users" on services
  for select to authenticated using (true);
create policy "Enable all for authenticated users" on services
  for all to authenticated using (true) with check (true);

-- 2. Team Members: Public Read, Authenticated Write
create policy "Enable select for anonymous users" on team_members
  for select to anon using (true);
create policy "Enable select for authenticated users" on team_members
  for select to authenticated using (true);
create policy "Enable all for authenticated users" on team_members
  for all to authenticated using (true) with check (true);

-- 3. Testimonials: Public Read, Authenticated Write
create policy "Enable select for anonymous users" on testimonials
  for select to anon using (true);
create policy "Enable select for authenticated users" on testimonials
  for select to authenticated using (true);
create policy "Enable all for authenticated users" on testimonials
  for all to authenticated using (true) with check (true);

-- 4. Partners: Public Read, Authenticated Write
create policy "Enable select for anonymous users" on partners
  for select to anon using (true);
create policy "Enable select for authenticated users" on partners
  for select to authenticated using (true);
create policy "Enable all for authenticated users" on partners
  for all to authenticated using (true) with check (true);

-- 5. Job Openings: Public Read, Authenticated Write
create policy "Enable select for anonymous users" on job_openings
  for select to anon using (true);
create policy "Enable select for authenticated users" on job_openings
  for select to authenticated using (true);
create policy "Enable all for authenticated users" on job_openings
  for all to authenticated using (true) with check (true);

-- 6. Contact Submissions: Public Insert-Only
create policy "Enable insert for anonymous users" on contact_submissions
  for insert to anon with check (true);
create policy "Enable select for authenticated users" on contact_submissions
  for select to authenticated using (true);

-- 7. Membership Submissions: Public Insert-Only
create policy "Enable insert for anonymous users" on membership_submissions
  for insert to anon with check (true);
create policy "Enable select for authenticated users" on membership_submissions
  for select to authenticated using (true);

-- 8. Referral Submissions: Public Insert-Only
create policy "Enable insert for anonymous users" on referral_submissions
  for insert to anon with check (true);
create policy "Enable select for authenticated users" on referral_submissions
  for select to authenticated using (true);

-- 9. Job Applications: Public Insert-Only
create policy "Enable insert for anonymous users" on job_applications
  for insert to anon with check (true);
create policy "Enable select for authenticated users" on job_applications
  for select to authenticated using (true);

-- 10. Site Settings: Public Read, Authenticated Write
create policy "Enable select for all users" on site_settings
  for select using (true);
create policy "Enable all for authenticated users" on site_settings
  for all to authenticated using (true) with check (true);

-- 11. Tie-up Hospitals: Public Read, Authenticated Write
create policy "Enable select for all users" on tieup_hospitals
  for select using (true);
create policy "Enable all for authenticated users" on tieup_hospitals
  for all to authenticated using (true) with check (true);

-- =========================================
-- STORAGE BUCKETS & POLICIES
-- =========================================

-- Create a public storage bucket named "photos" if not exists
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Allow public access to read files in the "photos" bucket
create policy "Allow public read access to photos"
on storage.objects for select to public
using ( bucket_id = 'photos' );

-- Allow authenticated users to upload files to "photos" bucket
create policy "Allow authenticated upload to photos"
on storage.objects for insert to authenticated
with check ( bucket_id = 'photos' );

-- Allow authenticated users to update files in "photos" bucket
create policy "Allow authenticated update to photos"
on storage.objects for update to authenticated
using ( bucket_id = 'photos' );

-- Allow authenticated users to delete files from "photos" bucket
create policy "Allow authenticated delete from photos"
on storage.objects for delete to authenticated
using ( bucket_id = 'photos' );


