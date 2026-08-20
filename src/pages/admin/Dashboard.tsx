import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { updateSettings, SiteSettings } from '../../lib/queries/settings';
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, TeamMember } from '../../lib/queries/team';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, Testimonial } from '../../lib/queries/testimonials';
import { getHospitals, addHospital, updateHospital, deleteHospital, Hospital } from '../../lib/queries/hospitals';
import { uploadPhoto } from '../../lib/queries/storage';
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
  Globe
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
  const [activeTab, setActiveTab] = useState<'settings' | 'home' | 'doctors' | 'youtube' | 'hospitals'>('settings');
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Settings states
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [showMarquee, setShowMarquee] = useState(false);
  const [marqueeNotification, setMarqueeNotification] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Home states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [savingHome, setSavingHome] = useState(false);

  // Database lists
  const [doctors, setDoctors] = useState<TeamMember[]>([]);
  const [youtubeLinks, setYoutubeLinks] = useState<Testimonial[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modals / Edit states
  const [doctorForm, setDoctorForm] = useState<Partial<TeamMember> | null>(null);
  const [youtubeForm, setYoutubeForm] = useState<Partial<Testimonial> | null>(null);
  const [hospitalForm, setHospitalForm] = useState<Partial<Hospital> | null>(null);

  // Load configuration initially
  useEffect(() => {
    if (siteSettings) {
      setUnderMaintenance(siteSettings.under_maintenance);
      setShowMarquee(siteSettings.show_marquee);
      setMarqueeNotification(siteSettings.marquee_notification || '');
      setHeroTitle(siteSettings.hero_title || '');
      setHeroDescription(siteSettings.hero_description || '');
      setHeroImageUrl(siteSettings.hero_image_url || '');
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

  // 2. Save Home Page Config
  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHome(true);
    try {
      await updateSettings({
        hero_title: heroTitle,
        hero_description: heroDescription,
        hero_image_url: heroImageUrl,
      });
      await refreshSettings();
      showToast('Home page hero settings updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update home page settings.', 'error');
    } finally {
      setSavingHome(false);
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
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'home' 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10' 
                  : 'text-warm-300 hover:bg-warm-850 hover:text-white'
              }`}
            >
              <Home className="h-4.5 w-4.5" />
              <span>Home Page Hero</span>
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
              {activeTab === 'home' && 'Home Page Hero Section'}
              {activeTab === 'doctors' && 'Doctor Advisory Panel'}
              {activeTab === 'youtube' && 'Patient YouTube Stories'}
              {activeTab === 'hospitals' && 'Partner Tie-up Hospitals'}
            </h2>
            <p className="text-xs text-warm-500 mt-0.5">
              {activeTab === 'settings' && 'Manage maintenance panel settings and header marquee notifications.'}
              {activeTab === 'home' && 'Update the primary text banner and main background visuals for visitors.'}
              {activeTab === 'doctors' && 'Create, modify, or delete profiles of medical advisors and clinicians.'}
              {activeTab === 'youtube' && 'Manage patients video stories and YouTube video IDs on the homepage.'}
              {activeTab === 'hospitals' && 'Manage tie-up hospitals list displayed under our Clinical Associates page.'}
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

          {/* TAB 2: HOME PAGE HERO */}
          {activeTab === 'home' && (
            <form onSubmit={handleSaveHome} className="max-w-2xl bg-white border border-warm-200 rounded-3xl p-6 md:p-8 shadow-xs text-left space-y-6">
              <h3 className="font-serif text-lg font-bold text-warm-950 border-b border-warm-100 pb-3">Hero Section Banner</h3>

              <div className="space-y-2">
                <label htmlFor="hero-title" className="text-xs font-bold text-warm-700 uppercase tracking-wider">
                  Hero Title / Headline Text
                </label>
                <input
                  id="hero-title"
                  type="text"
                  required
                  placeholder="Best Home Health Care in Chennai..."
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-3 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="hero-desc" className="text-xs font-bold text-warm-700 uppercase tracking-wider">
                  Hero Description / Sub-headline
                </label>
                <textarea
                  id="hero-desc"
                  rows={4}
                  required
                  placeholder="Professional, compassionate medical and caretaker services in the comfort of your home..."
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  className="block w-full rounded-2xl border border-warm-250 bg-warm-50/50 px-4 py-3 text-sm focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <FileUploadInput
                id="hero-img"
                label="Hero Background Image URL / Upload"
                value={heroImageUrl}
                onChange={setHeroImageUrl}
                folder="hero"
              />


              {/* Preview Box */}
              <div className="rounded-2xl border border-warm-200 bg-warm-100 overflow-hidden relative h-40">
                <img src={heroImageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514'} alt="Preview" className="h-full w-full object-cover opacity-45" />
                <div className="absolute inset-0 bg-linear-to-r from-warm-900 to-transparent p-4 flex flex-col justify-end text-white text-left">
                  <h4 className="text-sm font-bold font-serif line-clamp-1">{heroTitle || 'Your Headline Here'}</h4>
                  <p className="text-[10px] text-warm-200 line-clamp-2 mt-1">{heroDescription || 'Your description here...'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-warm-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingHome}
                  className="inline-flex items-center gap-2 rounded-xl bg-warm-900 hover:bg-warm-850 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {savingHome ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Home Details</span>
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
        </div>
      </main>
    </div>
  );
};
