import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, ArrowRight } from 'lucide-react';
import { AnimatedSection } from '../shared/AnimatedSection';

export const CareTakerSpotlight: React.FC = () => {
  return (
    <section className="pt-12 pb-6 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection className="max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold text-primary-300 uppercase tracking-widest block">
            Specialized Care Focus
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Trained Care Taker Programs
          </h2>
          <p className="text-sm sm:text-base text-primary-100 leading-relaxed max-w-2xl mx-auto">
            Our caretakers are trained specifically in assisting individuals with daily routines, mobility, hygiene, and clinical guidelines.
          </p>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Card 1: Elderly Care Services */}
          <AnimatedSection direction="up" className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 text-left shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col sm:flex-row gap-6 backdrop-blur-xs">
            <div className="w-full sm:w-2/5 overflow-hidden rounded-2xl h-44 bg-white/10">
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=80"
                alt="Elderly Care services"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white leading-snug">
                  Elderly Care Services
                </h3>
                <p className="text-xs text-primary-100 leading-relaxed">
                  Support for aged parents. Helping with feeding, clean dressing, walking assistance, and standard medication scheduling under doctor instructions.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/services/trained-caretaker"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-300 hover:text-white outline-none transition-colors"
                >
                  Read More
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </AnimatedSection>

          {/* Card 2: Post Surgical Care Services */}
          <AnimatedSection direction="up" delay={0.1} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 text-left shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col sm:flex-row gap-6 backdrop-blur-xs">
            <div className="w-full sm:w-2/5 overflow-hidden rounded-2xl h-44 bg-white/10">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80"
                alt="Post Surgical care services"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white leading-snug">
                  Post Surgical Care Services
                </h3>
                <p className="text-xs text-primary-100 leading-relaxed">
                  Short or long-term nursing and caregiver support after major surgery. We assist with posture adjustments, vitals recording, and mobility support.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/services/trained-caretaker"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-300 hover:text-white outline-none transition-colors"
                >
                  Read More
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
