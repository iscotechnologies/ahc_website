import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  Heart,
  UserCheck,
  MessageSquare,
  Activity,
  Sparkles,
  Home,
  Eye,
  Target,
  ArrowRight,
  Calendar,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { AnimatedSection } from '../components/shared/AnimatedSection';

export const About: React.FC = () => {
  const careEmphases = [
    {
      title: 'Patient-Centered Care',
      description: 'Our care plans and daily tasks revolve entirely around understanding and serving the individual needs of each patient.',
      icon: HeartHandshake,
      colorClass: 'text-primary-600 bg-primary-50 border-primary-100',
    },
    {
      title: 'Safety and Hygiene',
      description: 'We follow strict health protocols, maintaining clean environments and using certified safety measures at all times.',
      icon: ShieldCheck,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Compassionate Service',
      description: 'Healthcare goes beyond clinical tasks. We emphasize patience, genuine kindness, and emotional warmth in every interaction.',
      icon: Heart,
      colorClass: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      title: 'Professional Caregivers',
      description: 'Every nurse, caretaker, and therapist is thoroughly vetted, background-checked, and regularly trained in clinical standards.',
      icon: UserCheck,
      colorClass: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      title: 'Timely Communication',
      description: 'We keep communication channels open, providing regular daily updates and responsive updates to the patient’s family.',
      icon: MessageSquare,
      colorClass: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'Personalized Care',
      description: 'Every client is unique. We customize nursing shifts, visits, and support plans according to specific clinical requirements.',
      icon: Activity,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Dignity & Respect',
      description: 'We honor the independence and dignity of elderly and dependent individuals, fostering comfort and mutual respect.',
      icon: Sparkles,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Family Reassurance',
      description: 'We partner closely with families, giving them the support, confidence, and peace of mind that their loved ones are safe.',
      icon: Home,
      colorClass: 'text-teal-600 bg-teal-50 border-teal-100',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us | Ayusya Health Care | Trusted Home Care Service</title>
        <meta
          name="description"
          content="Ayusya Health Care, administratively managed by Anugra Services, provides compassionate, professional, and reliable home nursing, geriatric support, and recovery care at home."
        />
      </Helmet>

      <div className="flex-1 flex flex-col bg-warm-50/30">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-b from-primary-50/60 to-transparent py-20 lg:py-24 text-left">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-primary-100),transparent)] opacity-40" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100/80 px-3 py-1 text-xs font-bold text-primary-700 uppercase tracking-wider">
                  ✦ Established May 2015
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-warm-950 leading-tight">
                  About Ayusya <br />
                  <span className="text-primary-600">Health Care</span>
                </h1>
                <p className="text-base sm:text-lg text-warm-700 max-w-2xl leading-relaxed">
                  Brought closer to people by <strong className="text-warm-900 font-semibold font-serif">Anugra Services</strong>, we bring dependable clinical standards and affectionate personal attention straight to the comfort of your own home.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-warm-600">
                  <span className="flex items-center gap-1.5 bg-white/80 px-4 py-2.5 rounded-2xl shadow-xs border border-warm-100">
                    <CheckCircle2 className="h-4 w-4 text-primary-600" />
                    Chennai
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/80 px-4 py-2.5 rounded-2xl shadow-xs border border-warm-100">
                    <CheckCircle2 className="h-4 w-4 text-primary-600" />
                    Madurai
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/80 px-4 py-2.5 rounded-2xl shadow-xs border border-warm-100">
                    <CheckCircle2 className="h-4 w-4 text-primary-600" />
                    Trichy
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-lg border border-warm-200 bg-warm-100">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                    alt="Home healthcare provider showing compassionate care to an elderly patient"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative floating card */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl border border-warm-100 max-w-50 hidden sm:block">
                  <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1">Our Slogan</p>
                  <p className="font-serif text-sm font-bold text-warm-900 leading-snug">
                    Compassionate Care. <br />
                    Professional Service. <br />
                    At Your Home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Spotlight */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" className="rounded-3xl border border-warm-200 bg-warm-50/30 p-8 sm:p-12 shadow-xs text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/30 rounded-bl-full -z-10" />
              <div className="max-w-3xl mx-auto space-y-4">
                <span className="text-2xl text-primary-500 font-serif">“</span>
                <p className="font-serif text-lg sm:text-xl font-medium text-warm-900 italic leading-relaxed">
                  We believe that home is one of the best environments for healing, recovery, and elderly care. A familiar home environment provides patients with comfort and emotional support while allowing family members to remain closely involved in their loved one’s care.
                </p>
                <div className="pt-4 space-y-1">
                  <p className="text-xs font-bold text-warm-700 uppercase tracking-widest">
                    The Founding Philosophy of Ayusya
                  </p>
                  <p className="text-[11px] text-warm-500">
                    Helping families stay closely connected during recovery
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* The Journey Timeline (2015 vs 2024) */}
        <section className="py-16 bg-transparent text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
                Our Evolution
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900">
                A Journey of Dedication & Growth
              </h2>
              <p className="text-sm text-warm-600 leading-relaxed">
                Tracing our origins from a visionary clinical start to structural advancements under professional administrative management.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 relative">
              {/* Vertical Connector Line (Desktop) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-warm-200 hidden md:block" />

              {/* Milestone 1: 2015 */}
              <AnimatedSection direction="left" className="rounded-3xl border border-warm-200 bg-white p-8 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 border border-primary-100">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-serif text-2xl font-bold text-warm-900">May 2015</h3>
                    <span className="text-xs font-bold text-warm-500 uppercase tracking-wider">Inception</span>
                  </div>
                  <h4 className="font-bold text-sm text-warm-800">Establishment in Chennai & Madurai</h4>
                  <p className="text-xs sm:text-sm text-warm-600 leading-relaxed">
                    Ayusya Health Care was established with a clear vision: to provide compassionate, reliable, and quality healthcare services in the comfort of patients' own homes. Since day one, we committed to supporting families with professional home healthcare services while ensuring dignity, safety, and personal attention.
                  </p>
                </div>
              </AnimatedSection>

              {/* Milestone 2: 2024 */}
              <AnimatedSection direction="right" className="rounded-3xl border border-primary-100 bg-white p-8 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow border-l-4 border-l-primary-500">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Building className="h-6 w-6" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-serif text-2xl font-bold text-warm-900">May 2024</h3>
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Administrative Transition</span>
                  </div>
                  <h4 className="font-bold text-sm text-warm-800">Management by Anugra Services</h4>
                  <p className="text-xs sm:text-sm text-warm-600 leading-relaxed">
                    To support sustainable growth, our management underwent a significant change. Currently, Ayusya is administratively managed by Anugra Services. This transition focuses on strengthening management systems, improving operational efficiency, enhancing service quality, and maintaining reliable, communication-focused support.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Vision & Mission Row */}
        <section className="py-16 bg-sky-50/20 border-y border-sky-100/30 backdrop-blur-xs text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Vision Card */}
              <AnimatedSection direction="up" className="rounded-3xl bg-white p-8 shadow-xs border border-warm-200 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 transition-colors group-hover:bg-sky-100">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-warm-900">
                    Our Vision
                  </h3>
                  <p className="text-xs sm:text-sm text-warm-600 leading-relaxed">
                    To become a trusted and respected home healthcare organization, recognized for quality, compassion, reliability, and professionalism. We aim to continuously improve our services and adopt better systems and practices to meet the evolving needs of patients and families.
                  </p>
                </div>
              </AnimatedSection>

              {/* Mission Card */}
              <AnimatedSection direction="up" delay={0.1} className="rounded-3xl bg-white p-8 shadow-xs border border-warm-200 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 transition-colors group-hover:bg-amber-100">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-warm-900">
                    Our Mission
                  </h3>
                  <p className="text-xs sm:text-sm text-warm-600 leading-relaxed">
                    To provide accessible, compassionate, reliable, and patient-centered healthcare services at home while maintaining high standards of professionalism, safety, and service quality. We develop our people, processes, and service coordinates to ensure that every patient receives the best attention.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Our Approach / 8 Core Emphases */}
        <section className="py-16 bg-white text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
                Clinical Excellence & Kindness
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900">
                Our Approach to Patient Care
              </h2>
              <p className="text-sm text-warm-600 leading-relaxed">
                At Ayusya Health Care, we understand that healthcare is not only about medicines and medical procedures. It is also about care, dignity, patience, compassion, trust, and human connection.
              </p>
            </div>

            {/* Grid of 8 Care Emphases */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {careEmphases.map((item, index) => (
                <AnimatedSection
                  key={index}
                  direction="up"
                  delay={index * 0.05}
                  className="rounded-2xl border border-warm-200 bg-warm-50/10 p-6 shadow-xs hover:shadow-md hover:bg-white hover:border-warm-250 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.colorClass}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-warm-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-warm-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Supporting Families Info Section */}
        <section className="py-16 bg-warm-50/40 border-t border-warm-200/50 text-left">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              <div className="lg:col-span-5">
                <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-md border border-warm-200 bg-warm-100">
                  <img
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                    alt="Elderly support and patient caretaker at home"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
                  Peace of Mind
                </span>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-warm-900">
                  Supporting Patients & Families
                </h2>
                <p className="text-sm text-warm-600 leading-relaxed">
                  We recognize that caring for an elderly, sick, recovering, or dependent family member can be physically and emotionally challenging. Family members often need dependable assistance to manage their loved ones' daily healthcare requirements.
                </p>
                <p className="text-sm text-warm-600 leading-relaxed">
                  Ayusya Health Care aims to provide families with professional support so they can spend more quality, stress-free time with their loved ones while receiving assistance from trained and responsible healthcare personnel.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 pt-2 text-xs font-semibold text-warm-800">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600 shrink-0" />
                    Home Nursing Care
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600 shrink-0" />
                    Elderly & Geriatric Support
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600 shrink-0" />
                    Patient Attendants
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600 shrink-0" />
                    Post-Hospitalization Assistance
                  </span>
                  <span className="flex items-center gap-2 sm:col-span-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-600 shrink-0" />
                    Recovery Support & Personalized Care
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action CTA Banner */}
        <section className="py-12 bg-white text-center">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection direction="up" className="rounded-3xl bg-primary-900 p-8 sm:p-12 shadow-xl border border-primary-950 text-white relative overflow-hidden">
              {/* Decorative backgrounds */}
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_40rem_at_bottom_right,var(--color-primary-800),transparent)] opacity-60" />
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(35rem_35rem_at_top_left,theme(colors.primary.850),transparent)] opacity-40" />

              <div className="max-w-2xl mx-auto space-y-6">
                <span className="text-xs font-bold text-primary-400 uppercase tracking-widest block">
                  Looking Ahead
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  Bringing Dependable Healthcare <br className="hidden sm:inline" />
                  Closer to You & Your Loved Ones
                </h2>
                <p className="text-xs sm:text-sm text-primary-100 leading-relaxed max-w-lg mx-auto">
                  Our purpose remains simple: to bring dependable healthcare closer to people and provide compassionate, professional care where it matters most — at home.
                </p>
                <div className="pt-4 flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-xs font-bold text-primary-950 shadow hover:bg-primary-50 hover:shadow-md transition-all duration-200"
                  >
                    Contact Our Office
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="tel:+919943161027"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary-800/80 px-5 py-3 text-xs font-bold text-white border border-primary-800 hover:bg-primary-850 transition-all duration-200"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </>
  );
};
