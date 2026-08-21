import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { updateSettings, SiteSettings } from '../../lib/queries/settings';
import { supabase } from '../../lib/supabaseClient';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, TeamMember } from '../../lib/queries/team';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, Testimonial } from '../../lib/queries/testimonials';
import { getGoogleReviews, addGoogleReview, updateGoogleReview, deleteGoogleReview, GoogleReview } from '../../lib/queries/reviews';
import { getHospitals, addHospital, updateHospital, deleteHospital, Hospital } from '../../lib/queries/hospitals';
import { uploadPhoto } from '../../lib/queries/storage';
import { 
  getContactSubmissions, 
  updateContactSubmission, 
  deleteContactSubmission, 
  ContactSubmission,
  getMembershipSubmissions,
  updateMembershipSubmission,
  deleteMembershipSubmission,
  MembershipSubmission
} from '../../lib/queries/submissions';
import { 
  getAllJobOpenings, 
  addJobOpening, 
  updateJobOpening, 
  deleteJobOpening, 
  getJobApplications, 
  updateJobApplication, 
  deleteJobApplication, 
  JobOpening, 
  JobApplication 
} from '../../lib/queries/jobs';
import { useToast } from '../../components/shared/Toast';
import { 
  Settings, 
  Home, 
  UserCheck, 
  Building2, 
  LogOut, 
  Save, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  Check, 
  X,
  AlertTriangle,
  Play,
  Globe,
  Inbox,
  Briefcase,
  FileText,
  Shield,
  Star
} from 'lucide-react';

interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  id: string;
  placeholder?: string;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ label, value, onChange, folder, id, placeholder }) => {
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB.', 'error');
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadPhoto(file, folder);
      onChange(publicUrl);
      showToast('Photo uploaded and URL updated successfully!', 'success');
    } catch (err: any) {
      showToast(`Upload failed: ${err.message || err}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id={id}
          type="text"
          placeholder={placeholder || 'https://images.unsplash.com/photo-...'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block grow rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
        />
        <div className="relative shrink-0 select-none">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled={uploading}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-warm-250 bg-white hover:bg-warm-100 px-4 py-2.5 text-sm font-semibold text-warm-700 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload Image</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {

  const { siteSettings, refreshSettings, signOut, user } = useSettings();
  const [activeTab, setActiveTab] = useState<'settings' | 'enquiries' | 'memberships' | 'jobs' | 'applications' | 'doctors' | 'youtube' | 'hospitals' | 'reviews'>('settings');
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Settings states
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [showMarquee, setShowMarquee] = useState(false);
  const [marqueeNotification, setMarqueeNotification] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Database lists
  const [doctors, setDoctors] = useState<TeamMember[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<Testimonial[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [enquiries, setEnquiries] = useState<ContactSubmission[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'>('All');
  const [membershipSubs, setMembershipSubs] = useState<MembershipSubmission[]>([]);
  const [membershipFilter, setMembershipFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled'>('All');
  const [allJobs, setAllJobs] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appFilter, setAppFilter] = useState<'All' | 'New' | 'Reviewed' | 'Interviewed' | 'Hired' | 'Rejected'>('All');
  const [loadingData, setLoadingData] = useState(false);
  const [reviewsList, setReviewsList] = useState<GoogleReview[]>([]);
  const [reviewForm, setReviewForm] = useState<Partial<GoogleReview> | null>(null);

  // Modals / Edit states
  const [doctorForm, setDoctorForm] = useState<Partial<TeamMember> | null>(null);
  const [youtubeForm, setYoutubeForm] = useState<Partial<Testimonial> | null>(null);
  const [hospitalForm, setHospitalForm] = useState<Partial<Hospital> | null>(null);
  const [enquiryForm, setEnquiryForm] = useState<ContactSubmission | null>(null);
  const [membershipForm, setMembershipForm] = useState<MembershipSubmission | null>(null);
  const [jobForm, setJobForm] = useState<Partial<JobOpening> | null>(null);
  const [applicationForm, setApplicationForm] = useState<JobApplication | null>(null);

  // Load configuration initially
  useEffect(() => {
    if (siteSettings) {
      setUnderMaintenance(siteSettings.under_maintenance);
      setShowMarquee(siteSettings.show_marquee);
      setMarqueeNotification(siteSettings.marquee_notification || '');
    }
  }, [siteSettings]);

  // Load list data based on tab selection
  useEffect(() => {
    loadTabDynamicData();
  }, [activeTab]);

  const loadTabDynamicData = async () => {
    setLoadingData(true);
    try {
      if (activeTab === 'doctors') {
        const data = await getTeamMembers();
        setDoctors(data);
      } else if (activeTab === 'youtube') {
        const data = await getTestimonials();
        setYoutubeLinks(data);
      } else if (activeTab === 'hospitals') {
        const data = await getHospitals();
        setHospitals(data);
      } else if (activeTab === 'enquiries') {
        const data = await getContactSubmissions();
        setEnquiries(data);
      } else if (activeTab === 'memberships') {
        const data = await getMembershipSubmissions();
        setMembershipSubs(data);
      } else if (activeTab === 'jobs') {
        const data = await getAllJobOpenings();
        setAllJobs(data);
      } else if (activeTab === 'applications') {
        const data = await getJobApplications();
        setApplications(data);
      } else if (activeTab === 'reviews') {
        const data = await getGoogleReviews();
        setReviewsList(data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load database records.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('Signed out successfully.', 'success');
      navigate('/admin/login');
    } catch (err) {
      showToast('Failed to sign out.', 'error');
    }
  };

  // 1. Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSettings({
        under_maintenance: underMaintenance,
        show_marquee: showMarquee,
        marquee_notification: marqueeNotification,
      });
      await refreshSettings();
      showToast('Site settings updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update site settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };



  // 3. Doctors CRUD
  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorForm || !doctorForm.name) return;

    try {
      const payload = {
        name: doctorForm.name,
        qualification: doctorForm.qualification || '',
        specialty: doctorForm.specialty || '',
        role_tag: doctorForm.role_tag || 'Clinical Associate',
        photo_url: doctorForm.photo_url || '',
        bio: doctorForm.bio || '',
        featured_on_home: doctorForm.featured_on_home ?? false,
        display_order: Number(doctorForm.display_order ?? 0),
        detail_slug: doctorForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      };

      if (doctorForm.id) {
        // Update
        await updateTeamMember(doctorForm.id, payload);
        showToast('Doctor details updated successfully!', 'success');
      } else {
        // Insert
        await addTeamMember(payload);
        showToast('New Doctor added successfully!', 'success');
      }
      setDoctorForm(null);
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to save doctor details.', 'error');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await deleteTeamMember(id);
      showToast('Doctor removed successfully.', 'success');
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to remove doctor.', 'error');
    }
  };

  // 4. Testimonials CRUD
  const handleSaveYoutube = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeForm || !youtubeForm.youtube_id) return;

    try {
      const payload = {
        patient_name: youtubeForm.patient_name || '',
        location: youtubeForm.location || '',
        youtube_id: youtubeForm.youtube_id,
        thumbnail_url: youtubeForm.thumbnail_url || `https://img.youtube.com/vi/${youtubeForm.youtube_id}/hqdefault.jpg`,
        display_order: Number(youtubeForm.display_order ?? 0),
      };

      if (youtubeForm.id) {
        await updateTestimonial(youtubeForm.id, payload);
        showToast('Video testimonial updated successfully!', 'success');
      } else {
        await addTestimonial(payload);
        showToast('New video testimonial added successfully!', 'success');
      }
      setYoutubeForm(null);
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to save testimonial.', 'error');
    }
  };

  const handleDeleteYoutube = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await deleteTestimonial(id);
      showToast('Testimonial deleted successfully.', 'success');
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to delete testimonial.', 'error');
    }
  };

  // Google Reviews CRUD
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm || !reviewForm.name || !reviewForm.text) return;

    try {
      const payload = {
        name: reviewForm.name,
        time_text: reviewForm.time_text || '1 week ago',
        rating: Number(reviewForm.rating ?? 5),
        text: reviewForm.text,
        location: reviewForm.location || 'Chennai',
        display_order: Number(reviewForm.display_order ?? 0),
      };

      if (reviewForm.id) {
        await updateGoogleReview(reviewForm.id, payload);
        showToast('Google review updated successfully!', 'success');
      } else {
        await addGoogleReview(payload);
        showToast('New Google review added successfully!', 'success');
      }
      setReviewForm(null);
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to save Google review.', 'error');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Google review?')) return;
    try {
      await deleteGoogleReview(id);
      showToast('Google review deleted successfully.', 'success');
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to delete Google review.', 'error');
    }
  };

  // 5. Hospitals CRUD
  const handleSaveHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalForm || !hospitalForm.name) return;

    try {
      const payload = {
        name: hospitalForm.name,
        subtitle: hospitalForm.subtitle || '',
        description: hospitalForm.description || '',
        more_info: hospitalForm.more_info || '',
        image_url: hospitalForm.image_url || '',
        display_order: Number(hospitalForm.display_order ?? 0),
      };

      if (hospitalForm.id) {
        await updateHospital(hospitalForm.id, payload);
        showToast('Hospital partner details updated!', 'success');
      } else {
        await addHospital(payload);
        showToast('New hospital partner added!', 'success');
      }
      setHospitalForm(null);
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to save hospital details.', 'error');
    }
  };

  const handleDeleteHospital = async (id: string) => {
    if (!confirm('Are you sure you want to remove this hospital partner?')) return;
    try {
      await deleteHospital(id);
      showToast('Hospital partner deleted.', 'success');
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to delete hospital.', 'error');
    }
  };

  const handleSaveEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm) return;

    try {
      await updateContactSubmission(enquiryForm.id, {
        status: enquiryForm.status,
        remarks: enquiryForm.remarks || '',
      });
      showToast('Enquiry details updated successfully!', 'success');
      setEnquiryForm(null);
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to update enquiry details.', 'error');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to remove this enquiry record?')) return;
    try {
      await deleteContactSubmission(id);
      showToast('Enquiry record deleted successfully.', 'success');
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to delete enquiry.', 'error');
    }
  };

  const handleSaveMembershipSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membershipForm) return;

    try {
      await updateMembershipSubmission(membershipForm.id, {
        status: membershipForm.status,
        remarks: membershipForm.remarks || '',
      });
      showToast('Membership enrollment details updated successfully!', 'success');
      setMembershipForm(null);
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to update membership details.', 'error');
    }
  };

  const handleDeleteMembershipSub = async (id: string) => {
    if (!confirm('Are you sure you want to remove this membership enrollment record?')) return;
    try {
      await deleteMembershipSubmission(id);
      showToast('Membership enrollment record deleted successfully.', 'success');
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to delete membership record.', 'error');
    }
  };

  const handleSaveJobOpening = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm || !jobForm.title) return;

    try {
      const payload = {
        title: jobForm.title,
        location: jobForm.location || '',
        employment_type: jobForm.employment_type || 'Full-Time',
        description: jobForm.description || '',
        is_active: jobForm.is_active ?? true,
      };

      if (jobForm.id) {
        await updateJobOpening(jobForm.id, payload);
        showToast('Job opening updated successfully!', 'success');
      } else {
        await addJobOpening(payload);
        showToast('New job opening posted successfully!', 'success');
      }
      setJobForm(null);
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to save job opening.', 'error');
    }
  };

  const handleDeleteJobOpening = async (id: string) => {
    if (!confirm('Are you sure you want to remove this job opening? Candidates will no longer be able to apply to it.')) return;
    try {
      await deleteJobOpening(id);
      showToast('Job opening deleted successfully.', 'success');
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to delete job opening.', 'error');
    }
  };

  const handleSaveJobApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationForm) return;

    try {
      await updateJobApplication(applicationForm.id, {
        status: applicationForm.status,
        remarks: applicationForm.remarks || '',
      });
      showToast('Candidate application details updated successfully!', 'success');
      setApplicationForm(null);
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to update candidate application.', 'error');
    }
  };

  const handleDeleteJobApplication = async (id: string) => {
    if (!confirm('Are you sure you want to remove this candidate application?')) return;
    try {
      await deleteJobApplication(id);
      showToast('Candidate application deleted successfully.', 'success');
      loadTabDynamicData();
    } catch (err) {
      showToast('Failed to delete candidate application.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-warm-50 text-warm-850">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-warm-900 text-white flex flex-col justify-between shrink-0 select-none shadow-xl border-r border-warm-850">
        <div className="p-6 space-y-8">
          {/* Dashboard Logo Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 p-0.5 bg-white rounded-xl overflow-hidden shrink-0">
              <img src="/assets/logo.jpeg" alt="Ayusya Logo" className="h-full w-full object-contain rounded-lg" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm tracking-wide">Ayusya Home Care</p>
              <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest leading-none mt-0.5">Admin Workspace</p>
            </div>
          </div>

          {/* Nav list */}
          <nav className="space-y-1.5 flex flex-col text-left">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              <span>General Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'enquiries' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <Inbox className="h-4.5 w-4.5" />
              <span>Enquiries</span>
            </button>

            <button
              onClick={() => setActiveTab('memberships')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'memberships' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <Shield className="h-4.5 w-4.5" />
              <span>Membership Enrollments</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'jobs' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <Briefcase className="h-4.5 w-4.5" />
              <span>Manage Jobs</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'applications' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Job Applications</span>
            </button>



            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'doctors' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <UserCheck className="h-4.5 w-4.5" />
              <span>Doctor Details</span>
            </button>

            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'youtube' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <Play className="h-4.5 w-4.5" />
              <span>YouTube Video Links</span>
            </button>

            <button
              onClick={() => setActiveTab('hospitals')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'hospitals' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <Building2 className="h-4.5 w-4.5" />
              <span>Tie-up Hospitals</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'reviews' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <Star className="h-4.5 w-4.5" />
              <span>Google Reviews</span>
            </button>
          </nav>
        </div>

        {/* User Info / Sign Out */}
        <div className="p-4 border-t border-warm-850 bg-warm-950 flex flex-col gap-3">
          <div className="text-left px-2">
            <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wide">Active Account</p>
            <p className="text-xs font-semibold text-white truncate max-w-50 mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-warm-800 hover:bg-red-650 hover:text-white px-4 py-2.5 text-xs font-bold text-warm-200 transition-colors cursor-pointer outline-none"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="grow flex flex-col min-w-0">
        {/* Top Info Banner if Maintenance Mode is active */}
        {siteSettings.under_maintenance && (
          <div className="bg-amber-500 text-white px-4 py-2.5 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 animate-bounce" />
            <span>CRITICAL WARNING: The website is currently in UNDER MAINTENANCE mode and locked for public access.</span>
          </div>
        )}

        {/* Page title header */}
        <header className="bg-white border-b border-warm-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-left">
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-warm-900 capitalize">
              {activeTab === 'settings' && 'General Settings'}
              {activeTab === 'enquiries' && 'Customer Enquiries'}
              {activeTab === 'memberships' && 'Membership Enrollments'}
              {activeTab === 'jobs' && 'Manage Job Postings'}
              {activeTab === 'applications' && 'Candidate Job Applications'}
              {activeTab === 'doctors' && 'Doctor Advisory Panel'}
              {activeTab === 'youtube' && 'Patient YouTube Stories'}
              {activeTab === 'hospitals' && 'Partner Tie-up Hospitals'}
              {activeTab === 'reviews' && 'Google Reviews Manager'}
            </h2>
            <p className="text-xs text-warm-500 mt-0.5">
              {activeTab === 'settings' && 'Manage maintenance panel settings and header marquee notifications.'}
              {activeTab === 'enquiries' && 'View consultation requests, update status, and manage client follow-up remarks.'}
              {activeTab === 'memberships' && 'View and manage annual membership application requests, status, and remarks.'}
              {activeTab === 'jobs' && 'Create, modify, toggle active status, or delete job vacancy postings.'}
              {activeTab === 'applications' && 'View candidate details, read cover notes, download resume documents, and add recruitment notes.'}
              {activeTab === 'doctors' && 'Create, modify, or delete profiles of medical advisors and clinicians.'}
              {activeTab === 'youtube' && 'Manage patients video stories and YouTube video IDs on the homepage.'}
              {activeTab === 'hospitals' && 'Manage tie-up hospitals list displayed under our Clinical Associates page.'}
              {activeTab === 'reviews' && 'Create, modify, toggle order, or delete text-based verified Google reviews.'}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-warm-200 bg-white hover:bg-warm-100 px-4 py-2 text-xs font-bold text-warm-700 shadow-xs transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Visit Website</span>
            </a>
          </div>
        </header>

        {/* Tab contents window */}
        <div className="grow p-6 md:p-8 overflow-y-auto">
          {/* TAB: MEMBERSHIPS */}
          {activeTab === 'memberships' && (
            <div className="space-y-6">
              {/* Filter and stats header */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white border border-warm-200 rounded-2xl p-4 shadow-xs font-sans">
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'] as const).map((status) => {
                    const count = status === 'All' 
                      ? membershipSubs.length 
                      : membershipSubs.filter((m) => m.status === status).length;
                    
                    return (
                      <button
                        key={status}
                        onClick={() => setMembershipFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          membershipFilter === status
                            ? 'bg-primary-600 text-white shadow-xs'
                            : 'bg-warm-50 text-warm-600 hover:bg-warm-100 hover:text-warm-900'
                        }`}
                      >
                        {status} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Edit remarks/status form modal if selected */}
              {membershipForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-950/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
                  <div className="bg-white border border-warm-200 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-warm-100 pb-3 font-serif">
                      <h3 className="text-base font-bold text-warm-950">
                        Take Action & Remarks
                      </h3>
                      <button
                        type="button"
                        onClick={() => setMembershipForm(null)}
                        className="p-1.5 hover:bg-warm-100 rounded-xl text-warm-400 hover:text-warm-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-warm-800 font-sans">
                      <div>
                        <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Client Name</p>
                        <p className="font-semibold text-warm-950 mt-0.5 font-serif">{membershipForm.name}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Phone</p>
                          <a href={`tel:${membershipForm.phone}`} className="font-semibold text-primary-600 hover:underline mt-0.5 block">
                            {membershipForm.phone}
                          </a>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Email</p>
                          {membershipForm.email ? (
                            <a href={`mailto:${membershipForm.email}`} className="font-semibold text-primary-600 hover:underline mt-0.5 block">
                              {membershipForm.email}
                            </a>
                          ) : (
                            <p className="text-warm-400 italic mt-0.5">Not provided</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Selected Plan Tier</p>
                          <p className="font-bold text-primary-700 mt-0.5">{membershipForm.plan_tier || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Preferred Start Date</p>
                          <p className="font-medium text-warm-900 mt-0.5">
                            {membershipForm.preferred_start_date 
                              ? new Date(membershipForm.preferred_start_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'Immediate'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Residential Address</p>
                        <div className="bg-warm-50 border border-warm-150 p-3 rounded-xl text-warm-700 leading-relaxed max-h-36 overflow-y-auto mt-0.5 font-medium whitespace-pre-wrap">
                          {membershipForm.address || <span className="italic text-warm-400">No address provided.</span>}
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSaveMembershipSub} className="space-y-4 pt-2 border-t border-warm-100 text-left font-sans">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider block font-sans">
                          Processing Status
                        </label>
                        <select
                          value={membershipForm.status}
                          onChange={(e) => setMembershipForm({ ...membershipForm, status: e.target.value })}
                          className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider block font-sans">
                          Remarks / Follow-up Notes
                        </label>
                        <textarea
                          rows={3}
                          value={membershipForm.remarks || ''}
                          placeholder="Add comments on customer conversation, setup process, clinical coordinates, etc..."
                          onChange={(e) => setMembershipForm({ ...membershipForm, remarks: e.target.value })}
                          className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setMembershipForm(null)}
                          className="rounded-xl border border-warm-200 bg-white hover:bg-warm-100 px-4 py-2.5 text-warm-700 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 shadow-xs hover:shadow-md cursor-pointer transition-all"
                        >
                          <Check className="h-4 w-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Data Table */}
              {loadingData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-warm-100 border-b border-warm-200 text-warm-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Received Date</th>
                          <th className="px-6 py-4">Client Details</th>
                          <th className="px-6 py-4">Plan Tier</th>
                          <th className="px-6 py-4">Start Date</th>
                          <th className="px-6 py-4">Residential Address</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Remarks</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-150">
                        {(() => {
                          const filtered = membershipFilter === 'All' 
                            ? membershipSubs 
                            : membershipSubs.filter((m) => m.status === membershipFilter);

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-warm-400 font-medium">
                                  No membership enrollments found for this filter.
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((item) => {
                            const dateStr = new Date(item.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            });

                            const startStr = item.preferred_start_date 
                              ? new Date(item.preferred_start_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-';

                            return (
                              <tr key={item.id} className="hover:bg-warm-50/50 align-top">
                                <td className="px-6 py-4 font-medium text-warm-500 whitespace-nowrap">{dateStr}</td>
                                <td className="px-6 py-4">
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-warm-900 font-serif text-sm">{item.name}</p>
                                    <p className="font-semibold text-warm-650">
                                      <a href={`tel:${item.phone}`} className="hover:text-primary-600 transition-colors">
                                        {item.phone}
                                      </a>
                                    </p>
                                    {item.email && (
                                      <p className="text-warm-500">
                                        <a href={`mailto:${item.email}`} className="hover:text-primary-600 transition-colors">
                                          {item.email}
                                        </a>
                                      </p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-primary-700 whitespace-nowrap">{item.plan_tier}</td>
                                <td className="px-6 py-4 font-semibold text-warm-700 whitespace-nowrap">{startStr}</td>
                                <td className="px-6 py-4 text-warm-600 font-medium max-w-xs">
                                  <p className="line-clamp-3 whitespace-pre-wrap">{item.address || '-'}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    item.status === 'Pending' 
                                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                      : item.status === 'In Progress' 
                                      ? 'bg-blue-50 text-blue-800 border-blue-200' 
                                      : item.status === 'Completed' 
                                      ? 'bg-green-50 text-green-800 border-green-200' 
                                      : 'bg-warm-100 text-warm-600 border-warm-250'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-warm-600 font-medium max-w-xs">
                                  <p className="line-clamp-3 whitespace-pre-wrap">{item.remarks || <span className="text-warm-450 italic font-normal">None</span>}</p>
                                </td>
                                <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => setMembershipForm(item)}
                                    title="Take Action"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer outline-none"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMembershipSub(item.id)}
                                    title="Delete record"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer outline-none"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 0: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 font-serif">
              {/* Filter and stats header */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white border border-warm-200 rounded-2xl p-4 shadow-xs">
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'] as const).map((status) => {
                    const count = status === 'All' 
                      ? enquiries.length 
                      : enquiries.filter((e) => e.status === status).length;
                    
                    return (
                      <button
                        key={status}
                        onClick={() => setEnquiryFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans ${
                          enquiryFilter === status
                            ? 'bg-primary-600 text-white shadow-xs'
                            : 'bg-warm-50 text-warm-600 hover:bg-warm-100 hover:text-warm-900'
                        }`}
                      >
                        {status} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Edit remarks/status form modal if selected */}
              {enquiryForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white border border-warm-200 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-warm-100 pb-3">
                      <h3 className="font-serif text-base font-bold text-warm-950">
                        Take Action & Remarks
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEnquiryForm(null)}
                        className="p-1.5 hover:bg-warm-100 rounded-xl text-warm-400 hover:text-warm-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-warm-800 font-sans">
                      <div>
                        <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider font-sans">Client Name</p>
                        <p className="font-semibold text-warm-950 mt-0.5 font-serif">{enquiryForm.name}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider font-sans">Phone</p>
                          <a href={`tel:${enquiryForm.phone}`} className="font-semibold text-primary-600 hover:underline mt-0.5 block">
                            {enquiryForm.phone}
                          </a>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider font-sans">Email</p>
                          {enquiryForm.email ? (
                            <a href={`mailto:${enquiryForm.email}`} className="font-semibold text-primary-600 hover:underline mt-0.5 block">
                              {enquiryForm.email}
                            </a>
                          ) : (
                            <p className="text-warm-400 italic mt-0.5">Not provided</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider font-sans">Location</p>
                          <p className="font-medium text-warm-900 mt-0.5">{enquiryForm.location || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider font-sans">Service Interested</p>
                          <p className="font-medium text-warm-900 mt-0.5 font-serif">
                            {enquiryForm.services?.title || 'General Enquiry'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider font-sans">Message</p>
                        <div className="bg-warm-50 border border-warm-150 p-3 rounded-xl text-warm-700 leading-relaxed max-h-36 overflow-y-auto mt-0.5 font-medium whitespace-pre-wrap">
                          {enquiryForm.message || <span className="italic text-warm-400">No message provided.</span>}
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSaveEnquiry} className="space-y-4 pt-2 border-t border-warm-100 text-left font-sans">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider block font-sans">
                          Processing Status
                        </label>
                        <select
                          value={enquiryForm.status}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, status: e.target.value })}
                          className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider block font-sans">
                          Remarks / Follow-up Notes
                        </label>
                        <textarea
                          rows={3}
                          value={enquiryForm.remarks || ''}
                          placeholder="Add comments on customer conversation, appointment timings, caretakers assigned, etc..."
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, remarks: e.target.value })}
                          className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium font-sans"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2 text-xs font-bold font-sans">
                        <button
                          type="button"
                          onClick={() => setEnquiryForm(null)}
                          className="rounded-xl border border-warm-200 bg-white hover:bg-warm-100 px-4 py-2.5 text-warm-700 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 shadow-xs hover:shadow-md cursor-pointer transition-all"
                        >
                          <Check className="h-4 w-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Data Table */}
              {loadingData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-warm-100 border-b border-warm-200 text-warm-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Received Date</th>
                          <th className="px-6 py-4">Client Details</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Service</th>
                          <th className="px-6 py-4">Message</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Remarks</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-150">
                        {(() => {
                          const filtered = enquiryFilter === 'All' 
                            ? enquiries 
                            : enquiries.filter((e) => e.status === enquiryFilter);

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-warm-400 font-medium">
                                  No enquiries found for this filter.
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((item) => {
                            const dateStr = new Date(item.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            });

                            return (
                              <tr key={item.id} className="hover:bg-warm-50/50 align-top">
                                <td className="px-6 py-4 font-medium text-warm-500 whitespace-nowrap">{dateStr}</td>
                                <td className="px-6 py-4">
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-warm-900 font-serif text-sm">{item.name}</p>
                                    <p className="font-semibold text-warm-650">
                                      <a href={`tel:${item.phone}`} className="hover:text-primary-600 transition-colors">
                                        {item.phone}
                                      </a>
                                    </p>
                                    {item.email && (
                                      <p className="text-warm-500">
                                        <a href={`mailto:${item.email}`} className="hover:text-primary-600 transition-colors">
                                          {item.email}
                                        </a>
                                      </p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-warm-750 font-bold">{item.location || 'N/A'}</td>
                                <td className="px-6 py-4 font-semibold text-primary-700 font-serif">
                                  {item.services?.title || <span className="text-warm-400 font-medium italic font-sans">General</span>}
                                </td>
                                <td className="px-6 py-4 text-warm-600 font-medium max-w-xs">
                                  <p className="line-clamp-3 whitespace-pre-wrap">{item.message || '-'}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    item.status === 'Pending' 
                                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                      : item.status === 'In Progress' 
                                      ? 'bg-blue-50 text-blue-800 border-blue-200' 
                                      : item.status === 'Completed' 
                                      ? 'bg-green-50 text-green-800 border-green-200' 
                                      : 'bg-warm-100 text-warm-600 border-warm-250'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-warm-600 font-medium max-w-xs">
                                  <p className="line-clamp-3 whitespace-pre-wrap font-sans">{item.remarks || <span className="text-warm-450 italic font-normal">None</span>}</p>
                                </td>
                                <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => setEnquiryForm(item)}
                                    title="Take Action"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer outline-none"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEnquiry(item.id)}
                                    title="Delete enquiry"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer outline-none"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CAREERS / JOBS */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              {/* Top add panel bar */}
              <div className="flex justify-between items-center bg-white border border-warm-200 rounded-2xl p-4 shadow-xs font-sans">
                <p className="text-xs font-bold text-warm-600 uppercase tracking-wide">
                  Active Career Vacancies ({allJobs.length} listings)
                </p>
                <button
                  onClick={() => setJobForm({ title: '', location: 'Chennai', employment_type: 'Full-Time', description: '', is_active: true })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all select-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Post New Job</span>
                </button>
              </div>

              {/* Form container if active */}
              {jobForm && (
                <form onSubmit={handleSaveJobOpening} className="bg-white border border-warm-200 rounded-3xl p-6 md:p-8 shadow-md text-left space-y-6 animate-fadeIn font-sans">
                  <div className="flex justify-between items-center border-b border-warm-100 pb-3 font-serif">
                    <h3 className="text-base font-bold text-warm-950">
                      {jobForm.id ? `Edit Job Posting: ${jobForm.title}` : 'Post New Job Vacancy'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setJobForm(null)}
                      className="p-1.5 hover:bg-warm-100 rounded-xl text-warm-400 hover:text-warm-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Job Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Home Care Nurse"
                        value={jobForm.title || ''}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Location</label>
                      <select
                        value={jobForm.location || 'Chennai'}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-semibold"
                      >
                        <option value="Chennai">Chennai</option>
                        <option value="Trichy">Trichy</option>
                        <option value="Madurai">Madurai</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Employment Type</label>
                      <select
                        value={jobForm.employment_type || 'Full-Time'}
                        onChange={(e) => setJobForm({ ...jobForm, employment_type: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-semibold"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Job Description</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Detail the key responsibilities, qualification requirements, shifts, and compensation details..."
                        value={jobForm.description || ''}
                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium"
                      />
                    </div>

                    {/* Active Status Toggle */}
                    <div className="flex items-center gap-3 sm:col-span-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setJobForm({ ...jobForm, is_active: !jobForm.is_active })}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          jobForm.is_active ? 'bg-primary-600' : 'bg-warm-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            jobForm.is_active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-bold text-warm-700 uppercase tracking-wider">
                        Show on careers page (Active Listing)
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-warm-100 flex justify-end gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setJobForm(null)}
                      className="rounded-xl border border-warm-200 bg-white hover:bg-warm-100 px-4 py-2.5 text-warm-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 shadow-xs hover:shadow-md cursor-pointer transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>{jobForm.id ? 'Update Job' : 'Post Job'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Data Table */}
              {loadingData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-warm-100 border-b border-warm-200 text-warm-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4 font-serif">Job Title</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Description</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-150">
                        {allJobs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-warm-400 font-medium">
                              No job openings found. Click "Post New Job" to create one.
                            </td>
                          </tr>
                        ) : (
                          allJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-warm-50/50 align-top">
                              <td className="px-6 py-4 font-bold text-warm-900 font-serif text-sm max-w-xs">{job.title}</td>
                              <td className="px-6 py-4 text-warm-750 font-bold">{job.location || 'Chennai'}</td>
                              <td className="px-6 py-4 font-semibold text-primary-700">{job.employment_type || 'Full-Time'}</td>
                              <td className="px-6 py-4 text-warm-600 font-medium max-w-md">
                                <p className="line-clamp-2">{job.description}</p>
                              </td>
                              <td className="px-6 py-4 text-center whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  job.is_active 
                                    ? 'bg-green-50 text-green-800 border-green-200' 
                                    : 'bg-warm-100 text-warm-600 border-warm-250'
                                }`}>
                                  {job.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setJobForm(job)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer outline-none"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteJobOpening(job.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer outline-none"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: JOB APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {/* Filter and stats header */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white border border-warm-200 rounded-2xl p-4 shadow-xs font-sans">
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'New', 'Reviewed', 'Interviewed', 'Hired', 'Rejected'] as const).map((status) => {
                    const count = status === 'All' 
                      ? applications.length 
                      : applications.filter((a) => a.status === status).length;
                    
                    return (
                      <button
                        key={status}
                        onClick={() => setAppFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          appFilter === status
                            ? 'bg-primary-600 text-white shadow-xs'
                            : 'bg-warm-50 text-warm-600 hover:bg-warm-100 hover:text-warm-900'
                        }`}
                      >
                        {status} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Edit/Action modal if selected */}
              {applicationForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white border border-warm-200 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-warm-100 pb-3 font-serif">
                      <h3 className="text-base font-bold text-warm-950">
                        Review Job Application
                      </h3>
                      <button
                        type="button"
                        onClick={() => setApplicationForm(null)}
                        className="p-1.5 hover:bg-warm-100 rounded-xl text-warm-400 hover:text-warm-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-warm-800 font-sans">
                      <div>
                        <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Candidate Name</p>
                        <p className="font-bold text-warm-950 mt-0.5 font-serif text-base">{applicationForm.name}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Phone</p>
                          <a href={`tel:${applicationForm.phone}`} className="font-semibold text-primary-600 hover:underline mt-0.5 block">
                            {applicationForm.phone}
                          </a>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Email</p>
                          <a href={`mailto:${applicationForm.email}`} className="font-semibold text-primary-600 hover:underline mt-0.5 block">
                            {applicationForm.email}
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Applied Position</p>
                          <p className="font-semibold text-primary-700 mt-0.5 font-serif">
                            {applicationForm.job_openings?.title || 'General Application'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Applied Date</p>
                          <p className="font-medium text-warm-800 mt-0.5">
                            {new Date(applicationForm.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Cover Note */}
                      <div>
                        <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Cover Note / Remarks from Candidate</p>
                        <div className="bg-warm-50 border border-warm-150 p-3 rounded-xl text-warm-700 leading-relaxed max-h-32 overflow-y-auto mt-0.5 font-medium whitespace-pre-wrap">
                          {applicationForm.cover_note || <span className="italic text-warm-400">No cover note provided.</span>}
                        </div>
                      </div>

                      {/* Resume Download / View */}
                      <div>
                        <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">Candidate Resume</p>
                        {applicationForm.resume_url ? (
                          <div className="mt-1 flex items-center gap-2">
                            <a
                              href={supabase.storage.from('resumes').getPublicUrl(applicationForm.resume_url).data.publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-warm-100 border border-warm-250 text-warm-850 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 px-4 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer font-sans"
                            >
                              <FileText className="h-4.5 w-4.5" />
                              <span>View & Download Resume</span>
                            </a>
                            <span className="text-[10px] text-warm-455 italic">Stored in resumes bucket</span>
                          </div>
                        ) : (
                          <p className="text-red-500 font-semibold mt-0.5">No resume file attached.</p>
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleSaveJobApplication} className="space-y-4 pt-2 border-t border-warm-100 text-left font-sans">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider block font-sans">
                          Recruitment Status
                        </label>
                        <select
                          value={applicationForm.status}
                          onChange={(e) => setApplicationForm({ ...applicationForm, status: e.target.value })}
                          className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-semibold"
                        >
                          <option value="New">New</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Interviewed">Interviewed</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-warm-700 uppercase tracking-wider block font-sans">
                          Recruiter Notes / Remarks
                        </label>
                        <textarea
                          rows={3}
                          value={applicationForm.remarks || ''}
                          placeholder="Add comments on candidate screening, experience matches, interview dates, etc..."
                          onChange={(e) => setApplicationForm({ ...applicationForm, remarks: e.target.value })}
                          className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium font-sans"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setApplicationForm(null)}
                          className="rounded-xl border border-warm-200 bg-white hover:bg-warm-100 px-4 py-2.5 text-warm-700 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 shadow-xs hover:shadow-md cursor-pointer transition-all"
                        >
                          <Check className="h-4 w-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Data Table */}
              {loadingData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs font-sans">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-warm-100 border-b border-warm-200 text-warm-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Applied Date</th>
                          <th className="px-6 py-4">Candidate</th>
                          <th className="px-6 py-4">Position</th>
                          <th className="px-6 py-4">Cover Note</th>
                          <th className="px-6 py-4">Resume</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Admin Remarks</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-150">
                        {(() => {
                          const filtered = appFilter === 'All' 
                            ? applications 
                            : applications.filter((a) => a.status === appFilter);

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-warm-400 font-medium font-sans">
                                  No candidate applications found for this filter.
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map((item) => {
                            const dateStr = new Date(item.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            });

                            const resumeLink = item.resume_url 
                              ? supabase.storage.from('resumes').getPublicUrl(item.resume_url).data.publicUrl
                              : null;

                            return (
                              <tr key={item.id} className="hover:bg-warm-50/50 align-top">
                                <td className="px-6 py-4 font-medium text-warm-500 whitespace-nowrap">{dateStr}</td>
                                <td className="px-6 py-4">
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-warm-900 font-serif text-sm">{item.name}</p>
                                    <p className="font-semibold text-warm-650">
                                      <a href={`tel:${item.phone}`} className="hover:text-primary-600 transition-colors">
                                        {item.phone}
                                      </a>
                                    </p>
                                    <p className="text-warm-500">
                                      <a href={`mailto:${item.email}`} className="hover:text-primary-600 transition-colors">
                                        {item.email}
                                      </a>
                                    </p>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-primary-700 font-serif max-w-xs">
                                  {item.job_openings?.title || <span className="text-warm-400 font-medium italic font-sans">General Application</span>}
                                </td>
                                <td className="px-6 py-4 text-warm-600 font-medium max-w-xs">
                                  <p className="line-clamp-3 whitespace-pre-wrap">{item.cover_note || '-'}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {resumeLink ? (
                                    <a
                                      href={resumeLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 font-bold hover:underline"
                                    >
                                      <FileText className="h-3.5 w-3.5" />
                                      <span>Download</span>
                                    </a>
                                  ) : (
                                    <span className="text-red-500 font-bold">No file</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-sans">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    item.status === 'New' 
                                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                      : item.status === 'Reviewed' 
                                      ? 'bg-blue-50 text-blue-800 border-blue-200' 
                                      : item.status === 'Interviewed'
                                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                                      : item.status === 'Hired' 
                                      ? 'bg-green-50 text-green-800 border-green-200' 
                                      : 'bg-rose-50 text-rose-800 border-rose-200'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-warm-600 font-medium max-w-xs font-sans">
                                  <p className="line-clamp-3 whitespace-pre-wrap">{item.remarks || <span className="text-warm-450 italic font-normal">None</span>}</p>
                                </td>
                                <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => setApplicationForm(item)}
                                    title="Review Application"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer outline-none"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJobApplication(item.id)}
                                    title="Delete candidate application log"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer outline-none"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-2xl bg-white border border-warm-200 rounded-3xl p-6 md:p-8 shadow-xs text-left space-y-6">
              <h3 className="font-serif text-lg font-bold text-warm-950 border-b border-warm-100 pb-3">Site Configuration</h3>

              {/* Under Maintenance Switch */}
              <div className="flex items-start justify-between gap-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-warm-900 font-serif flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Under Maintenance Mode</span>
                  </h4>
                  <p className="text-xs text-warm-600 leading-relaxed max-w-lg">
                    When active, public visitors will be redirected to a system maintenance landing page. Admins can still access the dashboard to turn it off.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUnderMaintenance(!underMaintenance)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    underMaintenance ? 'bg-amber-500' : 'bg-warm-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      underMaintenance ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show Marquee Switch */}
              <div className="flex items-start justify-between gap-6 p-4 rounded-2xl bg-primary-50/50 border border-primary-100">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-warm-900 font-serif">
                    Show Header Announcement Marquee
                  </h4>
                  <p className="text-xs text-warm-600 leading-relaxed max-w-lg">
                    Enable or disable the scrolling announcement marquee notification at the very top of the website header.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMarquee(!showMarquee)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showMarquee ? 'bg-primary-600' : 'bg-warm-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      showMarquee ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Marquee Text */}
              {showMarquee && (
                <div className="space-y-2">
                  <label htmlFor="marquee-msg" className="text-xs font-bold text-warm-700 uppercase tracking-wider">
                    Announcement Marquee Message
                  </label>
                  <textarea
                    id="marquee-msg"
                    rows={3}
                    placeholder="Enter announcement text to scroll in the marquee banner..."
                    value={marqueeNotification}
                    onChange={(e) => setMarqueeNotification(e.target.value)}
                    className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-3 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-warm-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 rounded-xl bg-warm-900 hover:bg-warm-850 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Settings Changes</span>
                </button>
              </div>
            </form>
          )}



          {/* TAB 3: DOCTOR DETAILS */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              {/* Top add panel bar */}
              <div className="flex justify-between items-center bg-white border border-warm-200 rounded-2xl p-4 shadow-xs">
                <p className="text-xs font-bold text-warm-600 uppercase tracking-wide">
                  Clinical advisory team panel ({doctors.length} profiles)
                </p>
                <button
                  onClick={() => setDoctorForm({ name: '', role_tag: 'Clinical Associate', specialty: '', qualification: '', photo_url: '', bio: '', featured_on_home: true, display_order: doctors.length + 1 })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all select-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Doctor</span>
                </button>
              </div>

              {/* Form container if active */}
              {doctorForm && (
                <form onSubmit={handleSaveDoctor} className="bg-white border border-warm-200 rounded-3xl p-6 md:p-8 shadow-md text-left space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-warm-100 pb-3">
                    <h3 className="font-serif text-base font-bold text-warm-950">
                      {doctorForm.id ? `Edit Profile: ${doctorForm.name}` : 'Add New Clinical Associate'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setDoctorForm(null)}
                      className="p-1.5 hover:bg-warm-100 rounded-xl text-warm-400 hover:text-warm-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. John Doe"
                        value={doctorForm.name || ''}
                        onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Role Tag</label>
                      <input
                        type="text"
                        required
                        placeholder="Clinical Associate"
                        value={doctorForm.role_tag || ''}
                        onChange={(e) => setDoctorForm({ ...doctorForm, role_tag: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Qualification</label>
                      <input
                        type="text"
                        placeholder="M.B.B.S, M.D"
                        value={doctorForm.qualification || ''}
                        onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Specialty</label>
                      <input
                        type="text"
                        placeholder="General Physician"
                        value={doctorForm.specialty || ''}
                        onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FileUploadInput
                        id="doc-photo"
                        label="Photo URL / Upload"
                        value={doctorForm.photo_url || ''}
                        onChange={(url) => setDoctorForm({ ...doctorForm, photo_url: url })}
                        folder="doctors"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Bio / Description Quote</label>
                      <textarea
                        rows={3}
                        placeholder="Short quote or biography description..."
                        value={doctorForm.bio || ''}
                        onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Display Order</label>
                      <input
                        type="number"
                        value={doctorForm.display_order ?? 0}
                        onChange={(e) => setDoctorForm({ ...doctorForm, display_order: Number(e.target.value) })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        id="feat"
                        checked={doctorForm.featured_on_home || false}
                        onChange={(e) => setDoctorForm({ ...doctorForm, featured_on_home: e.target.checked })}
                        className="rounded border-warm-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <label htmlFor="feat" className="text-xs font-bold text-warm-755 uppercase tracking-wide select-none cursor-pointer">
                        Featured on Home page
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-warm-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDoctorForm(null)}
                      className="rounded-xl border border-warm-200 bg-white hover:bg-warm-100 px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>{doctorForm.id ? 'Update Doctor' : 'Save New Doctor'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Data Table */}
              {loadingData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-warm-100 border-b border-warm-200 text-warm-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Display</th>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Credentials</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4 text-center">Home?</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-150">
                        {doctors.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-warm-400 font-medium">
                              No doctors found. Click "Add Doctor" above to get started.
                            </td>
                          </tr>
                        ) : (
                          doctors.map((doc) => (
                            <tr key={doc.id} className="hover:bg-warm-50/50">
                              <td className="px-6 py-4">
                                <img src={doc.photo_url || '/assets/avatar.png'} alt={doc.name} className="h-10 w-10 rounded-xl object-cover border border-warm-200" />
                              </td>
                              <td className="px-6 py-4 font-bold text-warm-900 font-serif text-sm">{doc.name}</td>
                              <td className="px-6 py-4 text-warm-600">
                                <p className="font-bold text-warm-700">{doc.qualification}</p>
                                <p className="text-[10px] text-sky-600 font-medium mt-0.5">{doc.specialty}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-block rounded-lg bg-warm-100 text-warm-700 px-2 py-1 text-[9px] font-bold uppercase tracking-wide">
                                  {doc.role_tag}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {doc.featured_on_home ? (
                                  <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[9px] font-bold">Yes</span>
                                ) : (
                                  <span className="inline-block rounded-full bg-warm-100 text-warm-400 px-2 py-0.5 text-[9px] font-medium">No</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setDoctorForm(doc)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer outline-none"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDoctor(doc.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer outline-none"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: YOUTUBE TESTIMONIALS */}
          {activeTab === 'youtube' && (
            <div className="space-y-6">
              {/* Top add panel bar */}
              <div className="flex justify-between items-center bg-white border border-warm-200 rounded-2xl p-4 shadow-xs">
                <p className="text-xs font-bold text-warm-600 uppercase tracking-wide">
                  YouTube video testimonials ({youtubeLinks.length} items)
                </p>
                <button
                  onClick={() => setYoutubeForm({ patient_name: '', location: '', youtube_id: '', display_order: youtubeLinks.length + 1 })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all select-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Video Testimonial</span>
                </button>
              </div>

              {/* Form container if active */}
              {youtubeForm && (
                <form onSubmit={handleSaveYoutube} className="bg-white border border-warm-200 rounded-3xl p-6 md:p-8 shadow-md text-left space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-warm-100 pb-3">
                    <h3 className="font-serif text-base font-bold text-warm-950">
                      {youtubeForm.id ? 'Edit Testimonial Link' : 'Add New Video Testimonial'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setYoutubeForm(null)}
                      className="p-1.5 hover:bg-warm-100 rounded-xl text-warm-400 hover:text-warm-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Patient / Caregiver Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Subramanian K."
                        value={youtubeForm.patient_name || ''}
                        onChange={(e) => setYoutubeForm({ ...youtubeForm, patient_name: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Location / City</label>
                      <input
                        type="text"
                        required
                        placeholder="Chennai"
                        value={youtubeForm.location || ''}
                        onChange={(e) => setYoutubeForm({ ...youtubeForm, location: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">YouTube Video ID (or URL)</label>
                      <input
                        type="text"
                        required
                        placeholder="dQw4w9WgXcQ"
                        value={youtubeForm.youtube_id || ''}
                        onChange={(e) => {
                          let val = e.target.value.trim();
                          // Support full URLs parsing out video ID
                          if (val.includes('youtube.com/watch?v=')) {
                            val = val.split('v=')[1]?.split('&')[0] || val;
                          } else if (val.includes('youtu.be/')) {
                            val = val.split('youtu.be/')[1]?.split('?')[0] || val;
                          } else if (val.includes('youtube.com/embed/')) {
                            val = val.split('embed/')[1]?.split('?')[0] || val;
                          }
                          setYoutubeForm({ ...youtubeForm, youtube_id: val });
                        }}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                      <p className="text-[10px] text-warm-400">
                        Paste the YouTube Video ID (e.g. dQw4w9WgXcQ) or the full YouTube watch/share link. We will automatically parse out the ID.
                      </p>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Custom Thumbnail Image URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="Leave blank to use default YouTube HQ Thumbnail"
                        value={youtubeForm.thumbnail_url || ''}
                        onChange={(e) => setYoutubeForm({ ...youtubeForm, thumbnail_url: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Display Order</label>
                      <input
                        type="number"
                        value={youtubeForm.display_order ?? 0}
                        onChange={(e) => setYoutubeForm({ ...youtubeForm, display_order: Number(e.target.value) })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Preview Box */}
                  {youtubeForm.youtube_id && (
                    <div className="rounded-2xl border border-warm-200 bg-warm-100 overflow-hidden relative h-44 max-w-sm">
                      <img 
                        src={youtubeForm.thumbnail_url || `https://img.youtube.com/vi/${youtubeForm.youtube_id}/hqdefault.jpg`} 
                        alt="Thumbnail" 
                        className="h-full w-full object-cover" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
                        <Play className="h-10 w-10 fill-current" />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-warm-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setYoutubeForm(null)}
                      className="rounded-xl border border-warm-200 bg-white hover:bg-warm-100 px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>{youtubeForm.id ? 'Update Testimonial' : 'Save Testimonial'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Data Table */}
              {loadingData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-warm-100 border-b border-warm-200 text-warm-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Thumbnail</th>
                          <th className="px-6 py-4">Patient Name</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">YouTube Video ID</th>
                          <th className="px-6 py-4 text-center">Order</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-150">
                        {youtubeLinks.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-warm-400 font-medium">
                              No testimonials found. Click "Add Video Testimonial" to create one.
                            </td>
                          </tr>
                        ) : (
                          youtubeLinks.map((item) => (
                            <tr key={item.id} className="hover:bg-warm-50/50">
                              <td className="px-6 py-4">
                                <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-warm-200">
                                  <img 
                                    src={item.thumbnail_url || `https://img.youtube.com/vi/${item.youtube_id}/hqdefault.jpg`} 
                                    alt={item.patient_name} 
                                    className="h-full w-full object-cover" 
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white">
                                    <Play className="h-4 w-4 fill-current" />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-bold text-warm-900 font-serif text-sm">{item.patient_name || 'Anonymous'}</td>
                              <td className="px-6 py-4 text-warm-600 font-medium">{item.location}</td>
                              <td className="px-6 py-4">
                                <code className="bg-warm-100 text-warm-750 px-2 py-0.5 rounded font-mono select-all">
                                  {item.youtube_id}
                                </code>
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-warm-700">{item.display_order}</td>
                              <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setYoutubeForm(item)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer outline-none"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteYoutube(item.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer outline-none"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TIE-UP HOSPITALS */}
          {activeTab === 'hospitals' && (
            <div className="space-y-6">
              {/* Top add panel bar */}
              <div className="flex justify-between items-center bg-white border border-warm-200 rounded-2xl p-4 shadow-xs">
                <p className="text-xs font-bold text-warm-600 uppercase tracking-wide">
                  Clinical partner tie-up hospitals ({hospitals.length} networks)
                </p>
                <button
                  onClick={() => setHospitalForm({ name: '', subtitle: '', description: '', more_info: '', image_url: '', display_order: hospitals.length + 1 })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all select-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Tie-up Hospital</span>
                </button>
              </div>

              {/* Form container if active */}
              {hospitalForm && (
                <form onSubmit={handleSaveHospital} className="bg-white border border-warm-200 rounded-3xl p-6 md:p-8 shadow-md text-left space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-warm-100 pb-3">
                    <h3 className="font-serif text-base font-bold text-warm-950">
                      {hospitalForm.id ? `Edit Hospital Partner: ${hospitalForm.name}` : 'Add New Tie-up Hospital'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setHospitalForm(null)}
                      className="p-1.5 hover:bg-warm-100 rounded-xl text-warm-400 hover:text-warm-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Hospital Network Name</label>
                      <input
                        type="text"
                        required
                        placeholder="MedIndia Hospitals – Chennai"
                        value={hospitalForm.name || ''}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Subtitle / Tagline Description</label>
                      <input
                        type="text"
                        placeholder="Chain of Super Specialty Digestive Disease Institutions"
                        value={hospitalForm.subtitle || ''}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, subtitle: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Primary Description</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Details about services offered, bed count, specialties, etc..."
                        value={hospitalForm.description || ''}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, description: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Additional/More Information</label>
                      <textarea
                        rows={2}
                        placeholder="Other teaching or clinical details..."
                        value={hospitalForm.more_info || ''}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, more_info: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FileUploadInput
                        id="hosp-photo"
                        label="Hospital Photo/Logo Image URL / Upload"
                        value={hospitalForm.image_url || ''}
                        onChange={(url) => setHospitalForm({ ...hospitalForm, image_url: url })}
                        folder="hospitals"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider">Display Order</label>
                      <input
                        type="number"
                        value={hospitalForm.display_order ?? 0}
                        onChange={(e) => setHospitalForm({ ...hospitalForm, display_order: Number(e.target.value) })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-warm-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setHospitalForm(null)}
                      className="rounded-xl border border-warm-200 bg-white hover:bg-warm-100 px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>{hospitalForm.id ? 'Update Hospital' : 'Save Hospital'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Data Table */}
              {loadingData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-warm-100 border-b border-warm-200 text-warm-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Image</th>
                          <th className="px-6 py-4">Hospital Partner</th>
                          <th className="px-6 py-4">Subtitle</th>
                          <th className="px-6 py-4 text-center">Order</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-150">
                        {hospitals.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-warm-400 font-medium">
                              No hospital partners found. Click "Add Tie-up Hospital" to create one.
                            </td>
                          </tr>
                        ) : (
                          hospitals.map((hosp) => (
                            <tr key={hosp.id} className="hover:bg-warm-50/50">
                              <td className="px-6 py-4">
                                <img src={hosp.image_url || '/assets/hospital.png'} alt={hosp.name} className="h-10 w-16 rounded-lg object-cover border border-warm-200" />
                              </td>
                              <td className="px-6 py-4 font-bold text-warm-900 font-serif text-sm max-w-xs truncate">{hosp.name}</td>
                              <td className="px-6 py-4 text-warm-600 max-w-xs truncate">{hosp.subtitle}</td>
                              <td className="px-6 py-4 text-center font-bold text-warm-700">{hosp.display_order}</td>
                              <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setHospitalForm(hosp)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer outline-none"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteHospital(hosp.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer outline-none"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: GOOGLE REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fadeIn font-sans">
              {/* Top add panel bar */}
              <div className="flex justify-between items-center bg-white border border-warm-200 rounded-2xl p-4 shadow-xs">
                <p className="text-xs font-bold text-warm-600 uppercase tracking-wide">
                  Verified Google reviews ({reviewsList.length} items)
                </p>
                <button
                  onClick={() => setReviewForm({ name: '', time_text: '1 week ago', rating: 5, text: '', location: 'Chennai', display_order: reviewsList.length + 1 })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-xs font-bold shadow-xs hover:shadow-md cursor-pointer transition-all select-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Review</span>
                </button>
              </div>

              {/* Form container if active */}
              {reviewForm && (
                <form onSubmit={handleSaveReview} className="bg-white border border-warm-200 rounded-3xl p-6 md:p-8 shadow-md text-left space-y-6">
                  <div className="flex justify-between items-center border-b border-warm-100 pb-3">
                    <h3 className="font-serif text-base font-bold text-warm-950">
                      {reviewForm.id ? 'Edit Google Review' : 'Add New Google Review'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setReviewForm(null)}
                      className="p-1.5 hover:bg-warm-100 rounded-xl text-warm-400 hover:text-warm-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 font-sans">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Author Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Ramesh Sundaram"
                        value={reviewForm.name || ''}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Time Posted (Text)</label>
                      <input
                        type="text"
                        required
                        placeholder="2 weeks ago"
                        value={reviewForm.time_text || ''}
                        onChange={(e) => setReviewForm({ ...reviewForm, time_text: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Location / City</label>
                      <input
                        type="text"
                        required
                        placeholder="Chennai"
                        value={reviewForm.location || ''}
                        onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Star Rating (1 - 5)</label>
                      <select
                        value={reviewForm.rating || 5}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-semibold font-sans"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Review Text / Content</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Paste the client's detailed Google Business review content here..."
                        value={reviewForm.text || ''}
                        onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-700 uppercase tracking-wider block">Display Order</label>
                      <input
                        type="number"
                        value={reviewForm.display_order ?? 0}
                        onChange={(e) => setReviewForm({ ...reviewForm, display_order: Number(e.target.value) })}
                        className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all font-medium font-sans"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-warm-100 flex justify-end gap-2 text-xs font-bold font-sans">
                    <button
                      type="button"
                      onClick={() => setReviewForm(null)}
                      className="rounded-xl border border-warm-200 bg-white hover:bg-warm-100 px-4 py-2.5 text-warm-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 shadow-xs hover:shadow-md cursor-pointer transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>{reviewForm.id ? 'Update Review' : 'Save Review'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Data Table */}
              {loadingData ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : (
                <div className="bg-white border border-warm-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto font-sans">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-warm-100 border-b border-warm-200 text-warm-400 font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Author</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Rating</th>
                          <th className="px-6 py-4">Time text</th>
                          <th className="px-6 py-4">Review Content</th>
                          <th className="px-6 py-4 text-center">Order</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-150">
                        {reviewsList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-10 text-center text-warm-400 font-medium">
                              No verified Google reviews found in the database. Click "Add New Review" to get started.
                            </td>
                          </tr>
                        ) : (
                          reviewsList.map((item) => (
                            <tr key={item.id} className="hover:bg-warm-50/50 align-top">
                              <td className="px-6 py-4 font-bold text-warm-900 font-serif text-sm whitespace-nowrap">{item.name}</td>
                              <td className="px-6 py-4 text-warm-750 font-bold whitespace-nowrap">{item.location}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex text-amber-500">
                                  {Array.from({ length: item.rating }).map((_, idx) => (
                                    <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-warm-500 whitespace-nowrap">{item.time_text}</td>
                              <td className="px-6 py-4 text-warm-650 max-w-md font-medium">
                                <p className="line-clamp-3 italic">"{item.text}"</p>
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-warm-700">{item.display_order}</td>
                              <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setReviewForm(item)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer outline-none"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(item.id)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warm-100 text-warm-600 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer outline-none"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
