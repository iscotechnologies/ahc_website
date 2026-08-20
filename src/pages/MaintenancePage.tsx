import React from 'react';
import { Hammer, Calendar, Phone, Mail } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-warm-50 text-warm-850 p-6 md:p-12 font-sans selection:bg-primary-100 selection:text-primary-800">
      {/* Top Brand Header */}
      <div className="flex justify-center md:justify-start">
        <img
          src="/assets/logo.jpeg"
          alt="Ayusya Health Care"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto text-center my-auto flex flex-col items-center space-y-8 py-10">
        <div className="relative">
          {/* Animated Glow Backdrops */}
          <div className="absolute -inset-1 rounded-full bg-linear-to-r from-primary-400 to-amber-400 opacity-20 blur-xl animate-pulse"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white border border-warm-200 text-primary-600 shadow-xl">
            <Hammer className="h-10 w-10 animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
            System Maintenance
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-warm-900 leading-tight">
            We'll Be Back Shortly
          </h1>
          <p className="text-sm sm:text-base text-warm-600 leading-relaxed">
            Ayusya Health Care is currently undergoing scheduled platform upgrades to serve your healthcare needs better. Our website will resume service shortly.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid gap-4 sm:grid-cols-2 w-full max-w-lg pt-4 text-left">
          <div className="rounded-2xl border border-warm-200 bg-white p-5 shadow-xs flex items-start gap-4">
            <Calendar className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-warm-900 text-sm">Scheduled Upgrades</h4>
              <p className="text-xs text-warm-550 mt-1 leading-relaxed">
                Database optimization and clinical associate portal updates are currently in progress.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-warm-200 bg-white p-5 shadow-xs flex items-start gap-4">
            <Phone className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-warm-900 text-sm">Ongoing Support</h4>
              <p className="text-xs text-warm-550 mt-1 leading-relaxed">
                Need immediate care assistance? Our patient support coordinators are active at +91 99431 61027.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-warm-200 pt-6 text-center max-w-md mx-auto w-full space-y-3">
        <p className="text-xs font-semibold text-warm-400 uppercase tracking-wider">
          Reach Our Emergency Desk
        </p>
        <div className="flex justify-center items-center gap-6 text-xs text-warm-600">
          <a href="tel:+919943161027" className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
            <Phone className="h-3.5 w-3.5" />
            <span>+91 99431 61027</span>
          </a>
          <a href="mailto:ayusyahomecare@gmail.com" className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
            <Mail className="h-3.5 w-3.5" />
            <span>ayusyahomecare@gmail.com</span>
          </a>
        </div>
        <p className="text-[10px] text-warm-400 pt-2">
          © {new Date().getFullYear()} Ayusya Health Care Services. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
