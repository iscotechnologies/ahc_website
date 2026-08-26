import React from 'react';
import { MapPin, Phone, MessageSquare, Clock } from 'lucide-react';
import { AnimatedSection } from '../shared/AnimatedSection';

export const FindUs: React.FC = () => {
  const [activeOfficeIndex, setActiveOfficeIndex] = React.useState(0);

  const offices = [
    {
      city: 'Chennai (Head Office)',
      address: 'Raja Street, T Nagar, Chennai 600017',
      phone: '+91 99431 61027',
      hours: '24/7 Care Coordination',
      mapUrl: 'https://maps.google.com/?q=Raja+Street,+T+Nagar,+Chennai+600017',
      embedUrl: 'https://maps.google.com/maps?q=Raja%20Street,%20T%20Nagar,%20Chennai%20600017&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    {
      city: 'Madurai Office',
      address: 'Maligai Thani Veedugal, Avaniyapuram Bypass Rd, Madurai, Tamil Nadu 625012',
      phone: '+91 99431 61027',
      hours: '8:00 AM - 9:00 PM',
      mapUrl: 'https://maps.google.com/?q=Maligai+Thani+Veedugal,+Avaniyapuram+Bypass+Rd,+Madurai,+Tamil+Nadu+625012',
      embedUrl: 'https://maps.google.com/maps?q=Maligai%20Thani%20Veedugal,%20Avaniyapuram%20Bypass%20Rd,%20Madurai,%20Tamil%20Nadu%20625012&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-transparent border-t border-sky-100/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-start text-left">
          {/* Left Column: Office Details */}
          <div className="space-y-8">
            <AnimatedSection direction="up" className="space-y-4">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
                Local Presence
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900">
                Our Service Areas & Centers
              </h2>
              <p className="text-sm sm:text-base text-warm-600 leading-relaxed">
                Ayusya Health Care coordinates home clinical programs, caretaking support, and medical gear deliveries across major cities in Tamil Nadu. Feel free to contact our local support coordinates.
              </p>
            </AnimatedSection>

            <div className="space-y-6">
              {offices.map((office, index) => (
                <AnimatedSection
                  key={index}
                  direction="up"
                  delay={index * 0.1}
                >
                  <div
                    className={`rounded-2xl border p-5 shadow-xs flex flex-col sm:flex-row gap-4 cursor-pointer transition-all ${
                      activeOfficeIndex === index
                        ? 'border-primary-500 bg-primary-50/10'
                        : 'border-warm-200 bg-white hover:border-warm-300'
                    }`}
                    onClick={() => setActiveOfficeIndex(index)}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="font-serif text-base font-bold text-warm-950 leading-tight">
                        {office.city}
                      </h3>
                      <a
                        href={office.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-warm-600 hover:text-primary-600 hover:underline leading-relaxed block cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid triggering card click handler twice if it's already active, but let it switch to active if not
                          setActiveOfficeIndex(index);
                        }}
                      >
                        {office.address}
                      </a>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-warm-500 pt-1">
                        <a
                          href={`tel:${office.phone.replace(/\s+/g, '')}`}
                          className="flex items-center gap-1 hover:text-primary-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="h-3.5 w-3.5 text-primary-500" />
                          <span>{office.phone}</span>
                        </a>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary-500" />
                          <span>{office.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Right Column: Google Map Embed */}
          <AnimatedSection direction="left" className="h-full">
            <div className="overflow-hidden rounded-3xl border border-warm-200 bg-white p-2 shadow-sm h-full min-h-87.5 sm:min-h-112.5">
              <iframe
                title="Ayusya Health Care Location Map"
                src={offices[activeOfficeIndex].embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl w-full h-full"
              ></iframe>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
