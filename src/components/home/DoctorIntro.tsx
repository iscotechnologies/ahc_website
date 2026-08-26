import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ShieldAlert, Award, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { AnimatedSection } from '../shared/AnimatedSection';
import { useSettings } from '../../context/SettingsContext';

export const DoctorIntro: React.FC = () => {
  const { siteSettings } = useSettings();
  const highlights = [
    {
      icon: <Award className="h-6 w-6 text-primary-600" />,
      title: 'Experienced & Qualified Doctors',
      desc: 'Get visits from certified practitioners with extensive clinical experience.',
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-primary-600" />,
      title: 'Zero Waiting Lines',
      desc: 'Consult in the peace and safety of your home, avoiding hospital waiting rooms.',
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6 text-primary-600" />,
      title: 'Lab-Backed Diagnosis',
      desc: 'Seamlessly coordinate blood tests and diagnostics with home sample collections.',
    },
    {
      icon: <UserCheck className="h-6 w-6 text-primary-600" />,
      title: 'Chronic Illness Care',
      desc: 'Continuous tracking for diabetes, hypertension, and post-stroke rehabilitation.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white/40 backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Column: Image with soft frames */}
          <AnimatedSection direction="right" className="relative">
            <div className="relative overflow-hidden rounded-3xl bg-warm-100 p-2 shadow-sm border border-warm-200">
              <img
                src={siteSettings?.home_doctor_image_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"}
                alt="Doctor consulting senior patient at home"
                className="rounded-2xl w-full h-87.5 sm:h-112.5 object-cover"
              />
            </div>
            {/* Small accent floating box */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 rounded-2xl bg-primary-900 p-4 text-white shadow-xl max-w-50">
              <Award className="h-10 w-10 text-primary-300 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-primary-300 uppercase tracking-wider">Trusted</p>
                <p className="text-sm font-semibold">100% Certified Clinicians</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Column: Content and Grid */}
          <AnimatedSection direction="left" className="space-y-6 text-left">
            <div className="space-y-3">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
                Clinical Excellence At Home
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900">
                Personalized Doctor Consultations Without the Travel
              </h2>
              <p className="text-sm sm:text-base text-warm-600 leading-relaxed">
                We bridge the gap between hospital visits and home recovery. Our doctors provide clinical assessment, review prescriptions, write recovery plans, and coordinate specialized home treatments.
              </p>
            </div>

            {/* Grid details */}
            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              {highlights.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-warm-950">{item.title}</h3>
                    <p className="mt-1 text-xs text-warm-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/services/doctor-visit"
                className="inline-flex items-center gap-2 rounded-xl bg-warm-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-warm-850 hover:shadow-lg focus:ring-2 focus:ring-warm-500 outline-none"
              >
                Read More About Doctor Visits
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
