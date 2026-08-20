import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';

export const Hero: React.FC = () => {
  const { siteSettings } = useSettings();

  const title = siteSettings?.hero_title || 'Best Home Health Care in Chennai, Trichy & Madurai';
  const description = siteSettings?.hero_description || 'Professional, compassionate medical and caretaker services in the comfort of your home. Recover with dignity, supported by our experienced clinical team.';
  const imageUrl = siteSettings?.hero_image_url || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80';

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-warm-900 text-white">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt="Ayusya Health Care Warm Service"
          className="h-full w-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-linear-to-r from-warm-950 via-warm-900/90 to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-left w-full">
        <div className="max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 px-4 py-1.5 text-xs font-semibold text-primary-300 tracking-wider uppercase"
          >
            <span>Certified Home Care Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-warm-200 leading-relaxed max-w-xl"
          >
            {description}
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Link
              to="/contact"
              className="group flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 focus:ring-2 focus:ring-primary-400 outline-none"
            >
              Book a Visit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="https://api.whatsapp.com/send?phone=919943161027&text=Need%20Services"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-xl outline-none"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </a>

            <a
              href="tel:+919943161027"
              className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all outline-none"
            >
              <Phone className="h-4 w-4" />
              Call us
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
