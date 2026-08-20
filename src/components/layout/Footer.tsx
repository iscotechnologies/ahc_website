import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
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
                <span>Chennai, Trichy & Madurai, Tamil Nadu, India</span>
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
                <Link to="/team/clinical-associates" className="hover:text-primary-600 transition-colors">Our Clinical Associates</Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-primary-600 transition-colors">Career (Work with Us)</Link>
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
              <span className="rounded-lg bg-warm-100 px-2.5 py-1 text-[10px] font-semibold text-warm-700">Trichy</span>
              <span className="rounded-lg bg-warm-100 px-2.5 py-1 text-[10px] font-semibold text-warm-700">Madurai</span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-warm-900 mb-2">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-warm-100 p-2 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                aria-label="Facebook Page"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-warm-100 p-2 text-warm-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                aria-label="YouTube Channel"
              >
                <YoutubeIcon className="h-4 w-4" />
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
