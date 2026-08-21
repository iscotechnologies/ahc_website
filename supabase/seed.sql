-- Seed Data for Ayusya Health Care Website

-- 1. Services
insert into services (id, slug, title, short_description, full_description, hero_image_url, icon, display_order)
values
  (
    'e961ff7e-ef0c-430c-ab2f-1d899557ea71',
    'trained-caretaker',
    'Trained Care Taker',
    'Elderly care and post-surgical support with dignity at home by professional, compassionate caretakers.',
    'Our trained caretakers specialize in supporting elderly patients and individuals recovering from surgery or suffering from chronic illnesses. They assist with activities of daily living (ADLs), monitoring vital signs, medication reminders, mobility support, and personal hygiene, all while preserving the dignity and comfort of our clients in their own homes.',
    'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
    'Heart',
    1
  ),
  (
    'd2b70f08-7261-4de2-bf56-11f81cfef1ea',
    'nursing',
    'Nursing',
    'Professional home nursing care for wound dressing, injections, IV infusions, and post-op recovery.',
    'Ayusya provides skilled nursing care at your doorstep. Our registered, experienced nurses carry out doctor-prescribed treatments, including complex wound care, catheterization, injections, IV fluid administration, and post-surgical recovery monitoring. We ensure hospital-grade care protocols are strictly maintained in a warm home environment.',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    'Activity',
    2
  ),
  (
    'c3ab5ad1-3bfd-466d-88b9-50c9f131a473',
    'doctor-visit',
    'Doctor Visit',
    'Experienced doctors visiting your home for consultation, diagnosis, and chronic disease management.',
    'Avoid long queues and waiting rooms. Our qualified general physicians and specialists visit your home for physical consultations, diagnoses, prescription writing, and management of chronic diseases like diabetes, hypertension, and respiratory conditions. Supported by lab services, we bring complete clinic-style care to you.',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
    'UserCheck',
    3
  ),
  (
    'b1db1eb4-44cd-4e8b-871d-f952f4eb27a2',
    'physiotherapist',
    'Physiotherapist',
    'Personalized physical therapy sessions for orthopedic, neurological, and post-op rehabilitation.',
    'Our physiotherapists help restore movement and function after injury, surgery, or illness. We offer specialized physical therapy at home for musculoskeletal conditions, joint pains, stroke rehabilitation, cardiac recovery, and geriatric fitness. Each plan is tailored to the patient''s physical threshold and recovery goals.',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    'Accessibility',
    4
  ),
  (
    'a78f69a3-93d3-469b-8e14-6fe5311e9fdf',
    'nurse-home-visit',
    'Nurse Home Visit',
    'Short-duration nurse visits for specific medical procedures and health check-ups.',
    'For specific and quick clinical requirements, you can schedule short-duration home nursing visits. Our nurses will visit for procedures such as administering injections, dressing minor wounds, checking vitals, testing blood sugar, or assisting with nebulization. Highly convenient and professional, without the need for hospital travel.',
    'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80',
    'Users',
    5
  ),
  (
    'f19f1821-2a62-4f3b-b6d4-8d4e0e29b1aa',
    'annual-membership',
    'Annual Membership',
    'Comprehensive annual healthcare plans providing regular checkups and emergency support.',
    'Our Annual Health Membership is designed to offer peace of mind for families, especially those with elderly parents living in Chennai, Trichy, or Madurai. Members receive regular monthly checkups, priority access to doctor visits, discounts on services and medical equipment, and a dedicated healthcare manager to coordinate medical emergencies and routine treatments.',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    'Shield',
    6
  ),
  (
    '9876e987-1234-5678-abcd-1234567890ab',
    'medical-equipment',
    'Medical Equipment''s',
    'Premium medical equipment rentals and sales for home ICU and recovery needs.',
    'We supply high-quality medical equipment for rent or purchase to support home care. Our inventory includes oxygen concentrators, hospital beds (manual & motorized), wheelchairs, bi-pap/cpap machines, patient monitors, and deep vein thrombosis (DVT) pumps. We offer quick delivery, installation, and usage training for families.',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    'Wrench',
    7
  );

-- 2. Team Members / Clinical Associates
insert into team_members (name, qualification, specialty, role_tag, photo_url, bio, detail_slug, featured_on_home, display_order)
values
  (
    'Dr. M.C Deepak',
    'M.D',
    'Sr. Diabetologist',
    'Senior Clinical Associate',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    'Dr. M.C Deepak is an experienced diabetologist who focuses on holistic management of type-1 and type-2 diabetes, gestational diabetes, and associated metabolic complications.',
    'dr-mc-deepak',
    true,
    1
  ),
  (
    'Dr. Ravindra Nath',
    'M.B.B.S, M.D',
    'Sr. General Physician',
    'Senior Clinical Associate',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    'Dr. Ravindra Nath provides primary medical care with a specialization in geriatric health, chronic disease management, and preventative clinical diagnoses.',
    'dr-ravindra-nath',
    true,
    2
  ),
  (
    'Dr. Vamsi Krishna',
    'M.B.B.S, M.S',
    'General & Laparoscopic Surgeon',
    'Clinical Associate',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    'Dr. Vamsi Krishna is an accomplished surgeon specializing in minimally invasive laparoscopic procedures and surgical consultations for home recovery.',
    'dr-vamsi-krishna',
    true,
    3
  ),
  (
    'Dr. SSK. Sandeep',
    'M.S (Ortho)',
    'Orthopaedic Specialist',
    'Clinical Associate',
    'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=600&q=80',
    'Dr. SSK. Sandeep expertises in joint replacement therapies, trauma care, and managing orthopedic patients requiring post-op home care and physical rehabilitation.',
    'dr-ssk-sandeep',
    true,
    4
  ),
  (
    'Dr. Roshan Kumar',
    'M.D (Pulmonary Medicine)',
    'Pulmonary Specialist',
    'Clinical Associate',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    'Dr. Roshan Kumar coordinates respiratory therapy programs, chronic obstructive pulmonary disease (COPD) care, and respiratory support equipment setups.',
    'dr-roshan-kumar',
    true,
    5
  );

-- 3. Testimonials
insert into testimonials (patient_name, location, youtube_id, thumbnail_url, display_order)
values
  (
    'Subramanian K.',
    'Chennai',
    'dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
    1
  ),
  (
    'Meenakshi Ammal',
    'Madurai',
    'dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?auto=format&fit=crop&w=400&q=80',
    2
  ),
  (
    'Ramanathan S.',
    'Trichy',
    'dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    3
  );

-- 4. Partners
insert into partners (name, logo_url, website_url, display_order)
values
  ('Appasamy Hospital', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=150&q=80', 'https://example.com', 1),
  ('Chennai General Clinic', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=150&q=80', 'https://example.com', 2),
  ('Trichy Specialty Hospital', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=150&q=80', 'https://example.com', 3),
  ('Madurai Care Center', 'https://images.unsplash.com/photo-1504813184591-015578998475?auto=format&fit=crop&w=150&q=80', 'https://example.com', 4);

-- 5. Job Openings
insert into job_openings (title, location, employment_type, description, is_active)
values
  (
    'Home Care Nurse',
    'Chennai',
    'Full-Time',
    'We are looking for registered, compassionate GNM/B.Sc nurses with at least 1-2 years of clinical experience. Responsibilities include vital monitoring, IV infusion, dressing, and patient care.',
    true
  ),
  (
    'Physical Therapist',
    'Madurai',
    'Part-Time',
    'Seeking qualified BPT/MPT physiotherapists to provide home rehabilitation sessions for orthopedic and neurological patients. Excellent communication and travel flexibility are required.',
    true
  ),
  (
    'Elderly Caretaker',
    'Trichy',
    'Full-Time',
    'Seeking patient and warm caretakers with training in geriatric support. Tasks include personal hygiene assistance, mobility assistance, feed assistance, and medication reminders.',
    true
  );

-- 6. Site Settings
insert into site_settings (id, under_maintenance, marquee_notification, show_marquee, hero_title, hero_description, hero_image_url)
values (
  1, 
  false, 
  'Welcome to Ayusya Health Care. We provide professional home services across Chennai, Trichy, and Madurai.', 
  false,
  'Best Home Health Care in Chennai, Trichy & Madurai',
  'Professional, compassionate medical and caretaker services in the comfort of your home. Recover with dignity, supported by our experienced clinical team.',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80'
) on conflict (id) do nothing;

-- 7. Tie-up Hospitals
insert into tieup_hospitals (name, subtitle, description, more_info, image_url, display_order)
values 
  (
    'MedIndia Hospitals – Chennai', 
    'Chain of Super Specialty Digestive Disease Institutions', 
    'MedIndia Hospitals (a unit of MedIndia Institute of Medical Specialities) is a chain of digestive disease institutions of international repute equipped with state of the art diagnostics, surgical facilities and medical professionals. Offering comprehensive G.I. care on par with international standard under one roof, it was the first to conceive and execute the Esophageal Lab and Intensive Digestive Care Unit (IDCU).', 
    'A pioneering teaching and training center, MedIndia has organized over 140 Weekly Scientific meetings for City based Gastroenterologists and multiple international endoscopy crash courses, training over 300 doctors in basic and advanced endoscopy techniques.', 
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    1
  ),
  (
    'Vasanthi Orthopaedic Hospital (VOH)', 
    '30+ Years of Orthopaedic Excellence (50+ Beds)', 
    'Vasanthi Orthopaedic Hospital is one of the most respected healthcare providers in Chennai. Founded by Dr. R.H. Govardhan (who has conducted 2,000+ surgeries), VOH specialises in arthroscopy, trauma recovery, spinal injuries, and complicated joint replacement.', 
    'VOH offers dedicated treatments in all minor and major osteoarthritic issues. A leading treatment module includes platelet-rich plasma transfusion for patients with osteoarthritis. Their multidisciplinary team of anaesthesiologists, rheumatologists, and rehab experts ensure a smooth recovery.', 
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    2
  ),
  (
    'Star Bone and Joint Specialty Hospitals', 
    'Leading Bone and Joint Healthcare Provider (50+ Beds)', 
    'Star Bone and Joint Hospital is a highly experienced healthcare provider in Chennai with over 30 years of clinical practice. Founded by Dr. Amarnath Sowlee (who has conducted 1,500+ orthopaedic surgeries), the hospital is located in the heart of Chennai City.', 
    'The Orthopaedic and Joint Replacement department deals with trauma recovery, spinal injuries, minimally invasive bone restructuring, and joint replacement. Their specialized team coordinates home physical therapy and postoperative mobility programs in partnership with Ayusya.', 
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    3
  );

-- 8. Admin User Account
insert into auth.users (id, email, encrypted_password, email_confirmed_at, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values (
  gen_random_uuid(),
  'ayusyahomecare@gmail.com',
  crypt('Chennai2018@', gen_salt('bf')),
  now(),
  'authenticated',
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  now(),
  now()
) on conflict do nothing;

-- 9. Mock Contact Submissions (Enquiries)
insert into contact_submissions (id, name, phone, email, location, service_interested, message, status, remarks, created_at)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Ramesh Kumar',
    '9876543210',
    'ramesh@gmail.com',
    'Chennai',
    'e961ff7e-ef0c-430c-ab2f-1d899557ea71',
    'Need a reliable caretaker for my 82-year-old grandfather who is post-surgical.',
    'Pending',
    '',
    now() - interval '2 hours'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Suresh Raina',
    '9988776655',
    'suresh.raina@yahoo.com',
    'Trichy',
    'd2b70f08-7261-4de2-bf56-11f81cfef1ea',
    'Looking for a nurse to visit home daily for injection and wound dressing.',
    'In Progress',
    'Called Suresh, scheduled initial visit for tomorrow morning.',
    now() - interval '1 day'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Anitha Raj',
    '8877665544',
    'anitha@outlook.com',
    'Madurai',
    'c3ab5ad1-3bfd-466d-88b9-50c9f131a473',
    'Need a general physician doctor visit for routine elderly health checkup.',
    'Completed',
    'Doctor visit completed by Dr. Ravindra Nath on 20th Aug. Patient stable.',
    now() - interval '3 days'
  )
on conflict (id) do nothing;

-- 10. Mock Membership Submissions (Enrollments)
insert into membership_submissions (id, name, phone, email, address, plan_tier, preferred_start_date, status, remarks, created_at)
values
  (
    '44444444-4444-4444-4444-444444444444',
    'Vinodhan',
    '9944594144',
    'vinodhan@example.com',
    'No 12, Gandhi Street, Chennai 600028',
    'Silver Tier (₹2,500/mo)',
    '2026-08-21',
    'Pending',
    '',
    now() - interval '1 hour'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Karthik Raja',
    '9123456789',
    'karthik@gmail.com',
    'Plot 45, Anna Nagar, Madurai 625020',
    'Gold Tier (₹5,000/mo)',
    '2026-09-01',
    'In Progress',
    'Spoke to Karthik. He wants Gold plan starting Sept 1st. Payment links sent.',
    now() - interval '2 days'
  )
on conflict (id) do nothing;

-- 11. Mock Google Reviews
insert into google_reviews (name, time_text, rating, text, location, display_order)
values
  ('Ramesh Sundaram', '2 weeks ago', 5, 'Extremely professional caretaker service in Chennai. They took great care of my father post-hip replacement surgery. Highly recommended.', 'Chennai', 1),
  ('Kavitha Raja', '1 month ago', 5, 'We hired a home nurse for wound dressing in Madurai. Excellent hygiene standards, arrived on time, and was very friendly with my mother.', 'Madurai', 2),
  ('Dr. Vignesh Kumar', '3 months ago', 5, 'Highly reliable team. The physiotherapist they scheduled in Trichy was very patient and explained the recovery exercises very clearly.', 'Trichy', 3);



