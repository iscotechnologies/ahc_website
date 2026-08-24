import React from 'react';
import { MapPin, Phone, MessageSquare, Clock } from 'lucide-react';
import { AnimatedSection } from '../shared/AnimatedSection';

export const FindUs: React.FC = () => {
  const offices = [
    {
      city: 'Chennai (Head Office)',
      address: 'No 15, North Usman Road, T. Nagar, Chennai - 600017',
      phone: '+91 99431 61027',
      hours: '24/7 Care Coordination',
    },
    {
      city: 'Madurai Office',
      address: '45, K.K. Nagar East, Madurai - 625020',
      phone: '+91 99431 61027',
      hours: '8:00 AM - 9:00 PM',
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
                  className="rounded-2xl border border-warm-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-base font-bold text-warm-950 leading-tight">
                      {office.city}
                    </h3>
                    <p className="text-xs text-warm-600 leading-relaxed">{office.address}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-warm-500 pt-1">
                      <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="flex items-center gap-1 hover:text-primary-600">
                        <Phone className="h-3.5 w-3.5 text-primary-500" />
                        <span>{office.phone}</span>
                      </a>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary-500" />
                        <span>{office.hours}</span>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.837894951478!2d80.23114981482279!3d13.04598179080753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52665e771480f7%3A0x6e24672e811c7501!2sT.%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
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
