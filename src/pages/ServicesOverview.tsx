import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as Icons from 'lucide-react';
import { getServices, Service } from '../lib/queries/services';
import { AnimatedSection } from '../components/shared/AnimatedSection';

const fallbackServices: Service[] = [
  {
    id: '1',
    slug: 'trained-caretaker',
    title: 'Trained Care Taker',
    short_description: 'Elderly care and post-surgical support with dignity at home by professional, compassionate caretakers.',
    full_description: '',
    hero_image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    icon: 'Heart',
    display_order: 1,
    created_at: '',
  },
  {
    id: '2',
    slug: 'nursing',
    title: 'Nursing',
    short_description: 'Professional home nursing care for wound dressing, injections, IV infusions, and post-op recovery.',
    full_description: '',
    hero_image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    icon: 'Activity',
    display_order: 2,
    created_at: '',
  },
  {
    id: '3',
    slug: 'doctor-visit',
    title: 'Doctor Visit',
    short_description: 'Experienced doctors visiting your home for consultation, diagnosis, and chronic disease management.',
    full_description: '',
    hero_image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    icon: 'UserCheck',
    display_order: 3,
    created_at: '',
  },
  {
    id: '4',
    slug: 'physiotherapist',
    title: 'Physiotherapist',
    short_description: 'Personalized physical therapy sessions for orthopedic, neurological, and post-op rehabilitation.',
    full_description: '',
    hero_image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    icon: 'Accessibility',
    display_order: 4,
    created_at: '',
  },
  {
    id: '5',
    slug: 'nurse-home-visit',
    title: 'Nurse Home Visit',
    short_description: 'Short-duration nurse visits for specific medical procedures and health check-ups.',
    full_description: '',
    hero_image_url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80',
    icon: 'Users',
    display_order: 5,
    created_at: '',
  },
  {
    id: '6',
    slug: 'annual-membership',
    title: 'Annual Membership',
    short_description: 'Comprehensive annual healthcare plans providing regular checkups and emergency support.',
    full_description: '',
    hero_image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
    icon: 'Shield',
    display_order: 6,
    created_at: '',
  },
  {
    id: '7',
    slug: 'medical-equipment',
    title: "Medical Equipment's",
    short_description: 'Premium medical equipment rentals and sales for home ICU and recovery needs.',
    full_description: '',
    hero_image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    icon: 'Wrench',
    display_order: 7,
    created_at: '',
  },
];

export const ServicesOverview: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        if (data && data.length > 0) {
          setServices(data);
        } else {
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error('Failed to load services, using fallbacks', err);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Home Health Care Services | Chennai, Trichy & Madurai | Ayusya</title>
        <meta
          name="description"
          content="Explore the full range of home healthcare services offered by Ayusya, including Trained Caretaker, Home Nursing, Doctor Visit, Physiotherapy, and medical machinery."
        />
      </Helmet>

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="mx-auto max-w-7xl">
          {/* Header section */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              What We Do
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900 leading-none">
              Services Offered
            </h1>
            <p className="text-sm sm:text-base text-warm-600 leading-relaxed">
              We offer specialized, home-coordinated recovery plans. Choose a service category below to view details or speak to our case coordinator.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-warm-200 bg-white p-6 shadow-xs">
                  <div className="shimmer h-48 w-full rounded-xl bg-warm-100 mb-4"></div>
                  <div className="shimmer h-5 w-2/3 rounded bg-warm-100 mb-2"></div>
                  <div className="shimmer h-3.5 w-full rounded bg-warm-100 mb-1"></div>
                  <div className="shimmer h-3.5 w-5/6 rounded bg-warm-100"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
              {services.map((service, index) => {
                const IconComponent = (Icons as any)[service.icon] || Icons.Heart;
                return (
                  <AnimatedSection
                    key={service.id}
                    direction="up"
                    delay={index * 0.05}
                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-warm-200 bg-white p-6 shadow-xs hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="space-y-4">
                      {/* Image container */}
                      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-warm-50">
                        <img
                          src={service.hero_image_url}
                          alt={service.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-primary-600 shadow-md backdrop-blur-xs">
                          <IconComponent className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        <h3 className="font-serif text-xl font-bold text-warm-900 leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-xs text-warm-600 leading-relaxed">
                          {service.short_description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-warm-100 mt-6 flex items-center justify-between">
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline outline-none"
                      >
                        Read Details
                        <Icons.ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
