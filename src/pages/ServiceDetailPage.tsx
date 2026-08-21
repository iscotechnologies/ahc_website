import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getServiceBySlug, Service } from '../lib/queries/services';
import * as Icons from 'lucide-react';
import { Heart, Calendar, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AnimatedSection } from '../components/shared/AnimatedSection';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

interface FallbackDetail {
  title: string;
  short: string;
  long: string;
  icon: string;
  image: string;
  inclusions: string[];
}

const fallbackDetails: Record<string, FallbackDetail> = {
  'trained-caretaker': {
    title: 'Trained Care Taker',
    short: 'Elderly care and post-surgical support with dignity at home by professional, compassionate caretakers.',
    long: 'Our trained caretakers specialize in supporting elderly patients and individuals recovering from surgery or suffering from chronic illnesses. They assist with activities of daily living (ADLs), monitoring vital signs under clinical guidance, medication reminders, mobility support, and personal hygiene, all while preserving the dignity and comfort of our clients in their own homes.',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Assistance with personal hygiene, bathing, and dressing',
      'Help with transfer, walking, and fall prevention',
      'Timely medication alerts and reminders',
      'Feeding support and preparation of light meals',
      'Vital signs tracking (temperature, blood pressure, pulse)',
      'Companionship, monitoring, and emotional support',
    ],
  },
  'nursing': {
    title: 'Nursing',
    short: 'Professional home nursing care for wound dressing, injections, IV infusions, and post-op recovery.',
    long: 'Ayusya provides skilled nursing care at your doorstep. Our registered, experienced GNM/B.Sc nurses carry out doctor-prescribed treatments, including complex wound care, catheterization, injections, IV fluid administration, post-surgical recovery monitoring, and pain management. We ensure hospital-grade care protocols are strictly maintained in a warm home environment.',
    icon: 'Activity',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Wound care and sterile dressing change',
      'Intravenous (IV) fluid and medication administration',
      'Urinary catheterization insertion and care',
      'Injections (Intramuscular & Subcutaneous)',
      'Post-operative clinical recovery monitoring',
      'ICU-level home nursing setups and support',
    ],
  },
  'doctor-visit': {
    title: 'Doctor Visit',
    short: 'Experienced doctors visiting your home for consultation, diagnosis, and chronic disease management.',
    long: 'Avoid long queues and waiting rooms. Our qualified general physicians and specialists visit your home for physical consultations, clinical examinations, diagnoses, prescription writing, and management of chronic diseases like diabetes, hypertension, COPD, and respiratory conditions. Supported by lab services, we bring complete clinic-style care to you.',
    icon: 'UserCheck',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Comprehensive physical medical examination',
      'Chronic disease management (diabetes, pressure, heart)',
      'Geriatric health checkups and advice',
      'Review of prescriptions and medical history',
      'Coordination for blood test sample collection at home',
      'Treatment and home care plan suggestions',
    ],
  },
  'physiotherapist': {
    title: 'Physiotherapist',
    short: 'Personalized physical therapy sessions for orthopedic, neurological, and post-op rehabilitation.',
    long: 'Our physiotherapists help restore movement and function after injury, surgery, or illness. We offer specialized physical therapy at home for musculoskeletal conditions, joint pains, stroke rehabilitation, cardiac recovery, spinal injuries, and geriatric fitness. Each plan is tailored to the patient\'s physical threshold, pain levels, and recovery goals.',
    icon: 'Accessibility',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Orthopedic physical rehabilitation (post-fracture & replacement)',
      'Neurological therapy (paralysis, stroke, Parkinson\'s support)',
      'Post-surgical range of motion exercise guidance',
      'Geriatric balance and mobility training',
      'Pain management (neck, back, knee, shoulder)',
      'Tailored fitness and strength rebuilding plans',
    ],
  },
  'nurse-home-visit': {
    title: 'Nurse Home Visit',
    short: 'Short-duration nurse visits for specific medical procedures and health check-ups.',
    long: 'For specific and quick clinical requirements, you can schedule short-duration home nursing visits. Our nurses will visit for procedures such as administering injections, dressing minor wounds, checking vitals, testing blood sugar, changing catheter bags, or assisting with nebulization. Highly convenient and professional, without the need for hospital travel.',
    icon: 'Users',
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Administering prescribed injections (IM/IV/SC)',
      'Minor wound cleaning and dressing changes',
      'Nebulization assistance for breathing relief',
      'Blood sugar and blood pressure checks',
      'Assistance with feeding tube adjustments',
      'Suture removals and quick clinical checks',
    ],
  },
  'annual-membership': {
    title: 'Annual Membership',
    short: 'Comprehensive annual healthcare plans providing regular checkups and emergency support.',
    long: 'Our Annual Health Membership is designed to offer peace of mind for families, especially those with elderly parents living in Chennai, Trichy, or Madurai. Members receive regular monthly checkups, priority access to doctor visits, discounts on services and medical equipment, and a dedicated healthcare manager to coordinate medical emergencies and routine treatments.',
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Monthly home nurse visits (BP, sugar, general check)',
      'Two general physician consultations per year',
      'Priority scheduling for home nursing & doctor visits',
      'Dedicated health manager for query resolution',
      'Discounts on medical caretaker & nursing service bookings',
      'Preferred rates for home diagnostic packages',
    ],
  },
  'medical-equipment': {
    title: 'Medical Equipment',
    short: 'Premium medical equipment rentals and sales for home ICU and recovery needs.',
    long: 'We supply high-quality medical equipment for rent or purchase to support home care. Our inventory includes oxygen concentrators, hospital beds (manual & motorized), wheelchairs, bi-pap/cpap machines, patient monitors, deep vein thrombosis (DVT) pumps, and suction machines. We offer quick delivery, installation, and usage training for families.',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    inclusions: [
      'Oxygen concentrator rental and sales (5L / 10L)',
      'Motorized & manual hospital bed rentals',
      'Bi-PAP, CPAP, and respiratory monitors',
      'Wheelchairs, walkers, and patient mobility aids',
      'Multi-para patient vitals monitors',
      '24-hour setup, installation, and tutorial support',
    ],
  },
};

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadService() {
      if (!slug) return;
      try {
        const data = await getServiceBySlug(slug);
        setService(data);
      } catch (err) {
        console.error('Failed to load service, using fallback detail', err);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [slug]);

  // Determine fallback details to merge or show
  const currentSlug = slug || '';
  const fallback = fallbackDetails[currentSlug];
  
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // If service is not found in database and we don't have fallback details, show 404
  if (!service && !fallback) {
    return (
      <div className="flex-1 py-16 px-4 text-center bg-transparent">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="font-serif text-2xl font-bold text-warm-900">Service Not Found</h2>
          <p className="text-sm text-warm-600">The service you are looking for does not exist or has been moved.</p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // Bind values from Supabase data if exists, else fallback
  const displayTitle = service?.title || fallback.title;
  const displayShort = service?.short_description || fallback.short;
  const displayLong = service?.full_description || fallback.long;
  let displayImage = service?.hero_image_url || fallback.image;
  if (displayImage && displayImage.includes('photo-153002640518')) {
    displayImage = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80';
  }
  const displayIcon = service?.icon || fallback.icon;
  const inclusions = fallback?.inclusions || [
    'Professional coordinates under clinical manager instructions',
    'Certified caretakers and nurses background-vetted',
    'Personalized home care assessments',
  ];

  const IconComponent = (Icons as any)[displayIcon] || Heart;

  return (
    <>
      <Helmet>
        <title>{`${displayTitle} | Best Home Care in Chennai Trichy Madurai | Ayusya`}</title>
        <meta name="description" content={displayShort} />
      </Helmet>

      <div className="flex-1 bg-transparent py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8 text-left">
          {/* Back link */}
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-warm-500 hover:text-primary-600 transition-colors outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Services
          </Link>

          {/* Grid Layout */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Detail Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Service Header Info */}
              <AnimatedSection direction="up" className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 border border-primary-100">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900 leading-none">
                    {displayTitle}
                  </h1>
                </div>
                <p className="text-sm text-warm-600 leading-relaxed font-semibold italic">
                  {displayShort}
                </p>
              </AnimatedSection>

              {/* Banner Image */}
              <AnimatedSection direction="up" className="overflow-hidden rounded-3xl border border-warm-200 shadow-sm bg-warm-100 h-64 sm:h-96">
                <img
                  src={displayImage}
                  alt={displayTitle}
                  className="h-full w-full object-cover object-center"
                />
              </AnimatedSection>

              {/* Full Description */}
              <AnimatedSection direction="up" className="prose prose-warm max-w-none text-warm-700 text-sm sm:text-base leading-relaxed space-y-4">
                <h3 className="font-serif text-xl font-bold text-warm-900">About the Service</h3>
                <p>{displayLong}</p>
              </AnimatedSection>
            </div>

            {/* Right Sticky Column (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Inclusions Card */}
                <AnimatedSection direction="left" className="rounded-3xl border border-warm-200 bg-white p-6 shadow-xs space-y-4">
                  <h3 className="font-serif text-base font-bold text-warm-950 border-b border-warm-100 pb-2">
                    What's Included
                  </h3>
                  <ul className="space-y-3">
                    {inclusions.map((inclusion, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-warm-700 leading-relaxed">
                        <CheckCircle2 className="h-5 w-5 text-primary-500 shrink-0" />
                        <span>{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedSection>

                {/* Booking CTA Card */}
                <AnimatedSection direction="left" delay={0.05} className="rounded-3xl bg-primary-900 p-6 text-white text-center shadow-md space-y-4">
                  <Calendar className="mx-auto h-8 w-8 text-primary-300" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg font-bold">Schedule Service</h4>
                    <p className="text-xs text-primary-200 leading-relaxed">
                      Need immediate home clinical support or caretakers? Request a session now.
                    </p>
                  </div>
                  <Link
                    to="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-600 transition-colors outline-none"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
