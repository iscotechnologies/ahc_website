import React from 'react';
import { createBrowserRouter, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloatButton } from './components/layout/WhatsAppFloatButton';
import { Home } from './pages/Home';
import { ServicesOverview } from './pages/ServicesOverview';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ClinicalAssociates } from './pages/ClinicalAssociates';
import { Career } from './pages/Career';
import { Contact } from './pages/Contact';
import { Membership } from './pages/Membership';
import { ReferralPartner } from './pages/ReferralPartner';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';

// Admin Page Imports
import { Login } from './pages/admin/Login';
import { ForgotPassword } from './pages/admin/ForgotPassword';
import { ResetPassword } from './pages/admin/ResetPassword';
import { Dashboard } from './pages/admin/Dashboard';
import { MaintenancePage } from './pages/MaintenancePage';
import { useSettings } from './context/SettingsContext';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

const Layout: React.FC = () => {
  const { siteSettings, loadingSettings } = useSettings();
  const location = useLocation();

  if (!loadingSettings && siteSettings?.under_maintenance && !location.pathname.startsWith('/admin')) {
    return <MaintenancePage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Dynamic Top Announcement Marquee */}
      {siteSettings?.show_marquee && siteSettings?.marquee_notification && (
        <div className="bg-primary-900 text-white py-2 px-4 text-xs overflow-hidden select-none border-b border-primary-800">
          <div className="animate-marquee whitespace-nowrap flex gap-12 font-semibold">
            {Array.from({ length: 3 }).map((_, idx) => (
              <span key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                <span>✦</span>
                <span>{siteSettings.marquee_notification}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      <Header />
      <main className="grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
};

// Route protector for admin routes
const ProtectedRoute: React.FC = () => {
  const { user, loadingUser } = useSettings();

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export const router = createBrowserRouter([
  // Main Public Routes with Maintenance Interceptor
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'services', element: <ServicesOverview /> },
      { path: 'services/:slug', element: <ServiceDetailPage /> },
      { path: 'team/clinical-associates', element: <ClinicalAssociates /> },
      { path: 'career', element: <Career /> },
      { path: 'contact', element: <Contact /> },
      { path: 'contact/membership', element: <Membership /> },
      { path: 'contact/referral-partner', element: <ReferralPartner /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-conditions', element: <TermsConditions /> },
    ],
  },
  // Admin Authentication Routes (Excluded from maintenance interception)
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/admin/reset-password',
    element: <ResetPassword />,
  },
  // Protected Admin Routes
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: '', element: <Navigate to="dashboard" replace /> },
      { path: '*', element: <Navigate to="dashboard" replace /> },
    ],
  },
  // Wildcard redirection
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
