import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Briefcase, MapPin, Clock, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getJobOpenings, submitJobApplication, uploadResume, JobOpening } from '../lib/queries/jobs';
import { useToast } from '../components/shared/Toast';
import { AnimatedSection } from '../components/shared/AnimatedSection';

const applicationSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Enter a valid email address'),
  phone: zod.string().regex(/^[0-9+\s-]{10,15}$/, 'Enter a valid phone number (10-15 digits)'),
  cover_note: zod.string().optional(),
});

type ApplicationFormData = zod.infer<typeof applicationSchema>;

const fallbackJobs: JobOpening[] = [
  {
    id: '1',
    title: 'Home Care Nurse',
    location: 'Chennai',
    employment_type: 'Full-Time',
    description: 'We are looking for registered, compassionate GNM/B.Sc nurses with at least 1-2 years of clinical experience. Responsibilities include vital monitoring, IV infusion, dressing, and patient care.',
    is_active: true,
    created_at: '',
  },
  {
    id: '2',
    title: 'Physical Therapist',
    location: 'Madurai',
    employment_type: 'Part-Time',
    description: 'Seeking qualified BPT/MPT physiotherapists to provide home rehabilitation sessions for orthopedic and neurological patients. Excellent communication and travel flexibility are required.',
    is_active: true,
    created_at: '',
  },
  {
    id: '3',
    title: 'Elderly Caretaker',
    location: 'Chennai',
    employment_type: 'Full-Time',
    description: 'Seeking patient and warm caretakers with training in geriatric support. Tasks include personal hygiene assistance, mobility assistance, feed assistance, and medication reminders.',
    is_active: true,
    created_at: '',
  },
];

export const Career: React.FC = () => {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState<JobOpening | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobOpenings();
        if (data && data.length > 0) {
          setJobs(data);
        } else {
          setJobs(fallbackJobs);
        }
      } catch (err) {
        console.error('Failed to load jobs, using fallbacks', err);
        setJobs(fallbackJobs);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      // Validation: only pdf, doc, docx
      if (fileExt && ['pdf', 'doc', 'docx'].includes(fileExt)) {
        if (file.size <= 5 * 1024 * 1024) { // Max 5MB
          setResumeFile(file);
          setUploadProgress('idle');
        } else {
          showToast('File size must be under 5MB.', 'error');
        }
      } else {
        showToast('Please select a valid document format (.pdf, .doc, .docx).', 'error');
      }
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      showToast('Please upload your resume to apply.', 'error');
      return;
    }

    setUploadProgress('uploading');
    try {
      // 1. Upload resume to Supabase Storage
      const resumeUrl = await uploadResume(resumeFile);
      setUploadProgress('success');

      // 2. Submit application record to database
      await submitJobApplication({
        job_id: activeJob?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        resume_url: resumeUrl,
        cover_note: data.cover_note || undefined,
      });

      showToast('Application submitted successfully! Our recruitment team will review and contact you.', 'success');
      reset();
      setResumeFile(null);
      setUploadProgress('idle');
      setActiveJob(null);
    } catch (err) {
      console.error(err);
      setUploadProgress('error');
      showToast('Failed to submit application. Please check your credentials or storage setup.', 'error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Careers | Join Ayusya Health Care as Nurse or Caretaker</title>
        <meta
          name="description"
          content="Explore career opportunities at Ayusya Health Care. We are hiring home caretakers, home nurses, and physiotherapists in Chennai and Madurai."
        />
      </Helmet>

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              Join Our Team
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900 leading-none">
              Career Postings
            </h1>
            <p className="text-sm sm:text-base text-warm-600 leading-relaxed">
              Become part of a compassionate clinician network. We offer standard-of-practice training, career progression, and flexible work timings.
            </p>
          </div>

          {/* Culture Block */}
          <AnimatedSection direction="up" className="rounded-3xl border border-warm-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-8 items-center text-left">
            <div className="w-full md:w-1/3 rounded-2xl overflow-hidden h-48 bg-warm-100">
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80"
                alt="Ayusya clinical community culture"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grow space-y-3">
              <h3 className="font-serif text-xl font-bold text-warm-900">Why Work With Ayusya?</h3>
              <p className="text-xs sm:text-sm text-warm-600 leading-relaxed">
                At Ayusya, we care deeply for our care staff as much as our patients. We provide fair compensation, health guidelines training, emergency medical insurance coverage templates, and respect for care services. If you are passionate about helping senior citizens or post-surgical patients, find our open roles.
              </p>
            </div>
          </AnimatedSection>

          {/* Job listings & Apply dialog */}
          <div className="grid gap-8 lg:grid-cols-12 items-start text-left">
            {/* Openings (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-serif text-xl font-bold text-warm-950 border-b border-warm-150 pb-2">
                Open Positions
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-warm-200 bg-white p-5">
                      <div className="shimmer h-5 w-1/3 rounded bg-warm-100 mb-2"></div>
                      <div className="shimmer h-4 w-full rounded bg-warm-100 mb-1"></div>
                      <div className="shimmer h-4 w-5/6 rounded bg-warm-100"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <AnimatedSection
                      key={job.id}
                      direction="up"
                      className="rounded-2xl border border-warm-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-base font-bold text-warm-950 leading-tight">
                            {job.title}
                          </h3>
                          <span className="rounded-lg bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-700 uppercase tracking-wider">
                            {job.employment_type || 'Full-Time'}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs font-semibold text-warm-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary-500" />
                            {job.location || 'Tamil Nadu'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-primary-500" />
                            {job.employment_type || 'Flexible'}
                          </span>
                        </div>
                        <p className="text-xs text-warm-600 leading-relaxed pt-1">
                          {job.description}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-warm-100 mt-4 flex justify-end">
                        <button
                          onClick={() => {
                            setActiveJob(job);
                            // Scroll to form on mobile
                            const el = document.getElementById('apply-form-container');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="rounded-xl bg-warm-900 px-4 py-2 text-xs font-bold text-white hover:bg-warm-800 transition-colors focus:ring-2 focus:ring-warm-500"
                        >
                          Apply Now
                        </button>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>

            {/* Application Form Box (5 cols) */}
            <div id="apply-form-container" className="lg:col-span-5">
              <div className="rounded-3xl border border-warm-200 bg-white p-6 shadow-sm sticky top-24 space-y-4">
                <div className="flex items-center gap-2 border-b border-warm-100 pb-2">
                  <Briefcase className="h-5 w-5 text-primary-600" />
                  <h3 className="font-serif text-base font-bold text-warm-950">
                    {activeJob ? `Apply: ${activeJob.title}` : 'Submit General Application'}
                  </h3>
                </div>

                {activeJob && (
                  <div className="flex items-center justify-between bg-primary-50 rounded-xl p-3 text-xs text-primary-800 font-semibold">
                    <span>Applying for {activeJob.title} ({activeJob.location})</span>
                    <button
                      onClick={() => setActiveJob(null)}
                      className="text-primary-600 hover:text-primary-800 rounded focus:ring-1 focus:ring-primary-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      disabled={isSubmitting}
                      className={`w-full rounded-xl border ${
                        errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                      } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                      placeholder="e.g. Rajesh Kumar"
                      {...register('name')}
                    />
                    {errors.name && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.name.message}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        disabled={isSubmitting}
                        className={`w-full rounded-xl border ${
                          errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                        } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                        placeholder="e.g. rajesh@mail.com"
                        {...register('email')}
                      />
                      {errors.email && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                        Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        disabled={isSubmitting}
                        className={`w-full rounded-xl border ${
                          errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                        } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                        placeholder="10-digit number"
                        {...register('phone')}
                      />
                      {errors.phone && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Cover Note */}
                  <div>
                    <label htmlFor="cover_note" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                      Brief Note
                    </label>
                    <textarea
                      id="cover_note"
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-warm-200 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Why do you want to join Ayusya?"
                      {...register('cover_note')}
                    />
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                      Resume Upload (.pdf, .doc, .docx) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center justify-center rounded-xl border-2 border-dashed border-warm-200 px-4 py-6 bg-warm-50/50 hover:bg-warm-100/30 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        disabled={isSubmitting}
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        aria-label="Upload resume document"
                      />
                      <div className="text-center space-y-2 pointer-events-none">
                        <Upload className="mx-auto h-6 w-6 text-warm-400" />
                        {resumeFile ? (
                          <div className="text-xs text-primary-700 font-bold flex items-center gap-1 justify-center">
                            <CheckCircle className="h-4 w-4 text-primary-600" />
                            <span>{resumeFile.name}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-warm-500">
                            Drag & drop or <span className="text-primary-600 font-semibold underline">browse file</span>
                          </span>
                        )}
                        <p className="text-[9px] text-warm-400">Max size: 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-primary-500"
                  >
                    {isSubmitting
                      ? 'Uploading Resume & Submitting...'
                      : uploadProgress === 'uploading'
                      ? 'Uploading resume...'
                      : 'Submit Application'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
