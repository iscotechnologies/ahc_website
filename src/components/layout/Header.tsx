import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { BookNowModal } from './BookNowModal';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Close menus on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const servicesLinks = [
    { name: 'Trained Care Taker', path: '/services/trained-caretaker' },
    { name: 'Nursing', path: '/services/nursing' },
    { name: 'Doctor Visit', path: '/services/doctor-visit' },
    { name: 'Physiotherapist', path: '/services/physiotherapist' },
    { name: 'Nurse Home Visit', path: '/services/nurse-home-visit' },
    { name: 'Annual Membership', path: '/services/annual-membership' },
    { name: "Medical Equipment's", path: '/services/medical-equipment' },
  ];

  const contactLinks = [
    { name: 'Contact Form', path: '/contact' },
    { name: 'Membership', path: '/contact/membership' },
    { name: 'Referral Partner', path: '/contact/referral-partner' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-warm-200 bg-white/95 backdrop-blur-md transition-shadow duration-300 hover:shadow-md">
        {/* Top Info Bar */}
        <div className="bg-primary-900 px-4 py-2 text-xs font-medium text-primary-50 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-primary-400">♥</span>
            <span>Serving Chennai, Trichy & Madurai</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+919943161027" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="h-3 w-3" />
              <span>Call: +91 99431 61027</span>
            </a>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img
                src="/assets/logo.jpeg"
                alt="Ayusya Health Care"
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
              <Link
                to="/"
                className={`text-sm font-semibold transition-colors hover:text-primary-600 ${
                  location.pathname === '/' ? 'text-primary-600' : 'text-warm-700'
                }`}
              >
                Home
              </Link>

              {/* Service Offered Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('services')}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary-600 outline-none ${
                    location.pathname.startsWith('/services') ? 'text-primary-600' : 'text-warm-700'
                  }`}
                  aria-expanded={activeDropdown === 'services'}
                  aria-haspopup="true"
                >
                  Service Offered
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div
                  className={`absolute left-0 top-full pt-2 w-64 origin-top-left transition-all duration-200 z-100 ${
                    activeDropdown === 'services'
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                  }`}
                >
                  <div className="rounded-2xl border border-warm-100 bg-white p-2 shadow-xl">
                    {servicesLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block rounded-xl px-4 py-2 text-sm transition-colors hover:bg-primary-50 hover:text-primary-700 ${
                          location.pathname === link.path ? 'bg-primary-50 font-medium text-primary-700' : 'text-warm-700'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Our Team Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('team')}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary-600 outline-none ${
                    location.pathname.startsWith('/team') ? 'text-primary-600' : 'text-warm-700'
                  }`}
                  aria-expanded={activeDropdown === 'team'}
                  aria-haspopup="true"
                >
                  Our Team
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div
                  className={`absolute left-0 top-full pt-2 w-56 origin-top-left transition-all duration-200 z-100 ${
                    activeDropdown === 'team'
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                  }`}
                >
                  <div className="rounded-2xl border border-warm-100 bg-white p-2 shadow-xl">
                    <Link
                      to="/team/clinical-associates"
                      className={`block rounded-xl px-4 py-2 text-sm transition-colors hover:bg-primary-50 hover:text-primary-700 ${
                        location.pathname === '/team/clinical-associates' ? 'bg-primary-50 font-medium text-primary-700' : 'text-warm-700'
                      }`}
                    >
                      Our Clinical Associates
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                to="/career"
                className={`text-sm font-semibold transition-colors hover:text-primary-600 ${
                  location.pathname === '/career' ? 'text-primary-600' : 'text-warm-700'
                }`}
              >
                Career
              </Link>

              {/* Contact Us Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => toggleDropdown('contact')}
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary-600 outline-none ${
                    location.pathname.startsWith('/contact') ? 'text-primary-600' : 'text-warm-700'
                  }`}
                  aria-expanded={activeDropdown === 'contact'}
                  aria-haspopup="true"
                >
                  Contact Us
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div
                  className={`absolute right-0 top-full pt-2 w-56 origin-top-right transition-all duration-200 z-100 ${
                    activeDropdown === 'contact'
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                  }`}
                >
                  <div className="rounded-2xl border border-warm-100 bg-white p-2 shadow-xl">
                    {contactLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block rounded-xl px-4 py-2 text-sm transition-colors hover:bg-primary-50 hover:text-primary-700 ${
                          location.pathname === link.path ? 'bg-primary-50 font-medium text-primary-700' : 'text-warm-700'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                Book Now
              </button>
            </div>

            {/* Hamburger Button for Mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700 hover:bg-primary-100 transition-colors"
              >
                Book
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-xl p-2 text-warm-700 hover:bg-warm-100 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-warm-100 bg-white px-4 py-4 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto shadow-inner">
            <Link
              to="/"
              className={`block rounded-xl px-4 py-2 text-sm font-semibold hover:bg-warm-50 ${
                location.pathname === '/' ? 'bg-primary-50 text-primary-700' : 'text-warm-700'
              }`}
            >
              Home
            </Link>

            {/* Mobile Service Offered List */}
            <div className="space-y-1">
              <span className="block px-4 text-[10px] font-bold tracking-widest text-warm-400 uppercase">
                Services Offered
              </span>
              {servicesLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block rounded-xl px-6 py-2 text-sm font-medium hover:bg-warm-50 ${
                    location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-warm-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Our Team List */}
            <div className="space-y-1">
              <span className="block px-4 text-[10px] font-bold tracking-widest text-warm-400 uppercase">
                Our Team
              </span>
              <Link
                to="/team/clinical-associates"
                className={`block rounded-xl px-6 py-2 text-sm font-medium hover:bg-warm-50 ${
                  location.pathname === '/team/clinical-associates' ? 'bg-primary-50 text-primary-700' : 'text-warm-600'
                }`}
              >
                Our Clinical Associates
              </Link>
            </div>

            <Link
              to="/career"
              className={`block rounded-xl px-4 py-2 text-sm font-semibold hover:bg-warm-50 ${
                location.pathname === '/career' ? 'bg-primary-50 text-primary-700' : 'text-warm-700'
              }`}
            >
              Career
            </Link>

            {/* Mobile Contact Us List */}
            <div className="space-y-1">
              <span className="block px-4 text-[10px] font-bold tracking-widest text-warm-400 uppercase">
                Contact Us
              </span>
              {contactLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block rounded-xl px-6 py-2 text-sm font-medium hover:bg-warm-50 ${
                    location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-warm-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Slide-out Book Now Modal */}
      <BookNowModal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
    </>
  );
};
