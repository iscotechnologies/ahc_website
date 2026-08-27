import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const FacebookLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-warm-200 bg-white text-warm-600">
      {/* Top Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/logo.jpeg"
                alt="Ayusya Health Care"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-warm-500 leading-relaxed">
              Providing professional, warm, and dignified home healthcare services across Tamil Nadu. Bringing clinical excellence straight to your doorstep.
            </p>
            <div className="space-y-2 text-xs">
              <a href="tel:+919943161027" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                <Phone className="h-4 w-4 text-primary-500 shrink-0" />
                <span>+91 99431 61027</span>
              </a>
              <a href="mailto:info@ayusyahealthcare.com" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                <Mail className="h-4 w-4 text-primary-500 shrink-0" />
                <span>info@ayusyahealthcare.com</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                <span>Chennai & Madurai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-warm-900 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-600 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/team/clinical-associates" className="hover:text-primary-600 transition-colors">Our Clinical Associates</Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-primary-600 transition-colors">Career (Work with Us)</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary-600 transition-colors">Blog & Insights</Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-primary-600 transition-colors">Contact Form</Link>
              </li>
              <li>
                <Link to="/contact/membership" className="hover:text-primary-600 transition-colors">Annual Membership Setup</Link>
              </li>
              <li>
                <Link to="/contact/referral-partner" className="hover:text-primary-600 transition-colors">Referral Partner Form</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Care Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-warm-900 mb-4">
              Care Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/trained-caretaker" className="hover:text-primary-600 transition-colors">Trained Care Taker</Link>
              </li>
              <li>
                <Link to="/services/nursing" className="hover:text-primary-600 transition-colors">Home Nursing Care</Link>
              </li>
              <li>
                <Link to="/services/doctor-visit" className="hover:text-primary-600 transition-colors">Home Doctor Visits</Link>
              </li>
              <li>
                <Link to="/services/physiotherapist" className="hover:text-primary-600 transition-colors">Physiotherapy sessions</Link>
              </li>
              <li>
                <Link to="/services/nurse-home-visit" className="hover:text-primary-600 transition-colors">Short Nurse Visits</Link>
              </li>
              <li>
                <Link to="/services/medical-equipment" className="hover:text-primary-600 transition-colors">Medical Equipment Rent/Sale</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Service Areas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-warm-900 mb-4">
              Service Areas
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="rounded-lg bg-warm-100 px-2.5 py-1 text-[10px] font-semibold text-warm-700">Chennai</span>
              <span className="rounded-lg bg-warm-100 px-2.5 py-1 text-[10px] font-semibold text-warm-700">Madurai</span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-warm-900 mb-2">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61575753405886"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-warm-100 p-2 text-warm-600 hover:bg-[#1877F2] hover:text-white transition-colors"
                aria-label="Facebook Page"
              >
                <FacebookLogo className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@AnugraServices"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-warm-100 p-2 text-warm-600 hover:bg-[#FF0000] hover:text-white transition-colors"
                aria-label="YouTube Channel"
              >
                <YoutubeLogo className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="border-t border-warm-200 bg-warm-50 py-6 text-center text-xs text-warm-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {currentYear} Ayusya Health Care. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-primary-600 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
