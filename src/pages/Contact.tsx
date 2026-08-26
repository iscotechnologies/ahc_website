import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ContactForm } from '../components/contact/ContactForm';
import { MapPin, Phone, MessageSquare, Mail, Award, Clock } from 'lucide-react';
import { AnimatedSection } from '../components/shared/AnimatedSection';

export const Contact: React.FC = () => {
  const [activeOfficeIndex, setActiveOfficeIndex] = React.useState(0);

  const offices = [
    {
      name: 'Chennai Office (Head Office)',
      address: 'Raja Street, T Nagar, Chennai 600017',
      mapUrl: 'https://maps.google.com/?q=Raja+Street,+T+Nagar,+Chennai+600017',
      embedUrl: 'https://maps.google.com/maps?q=Raja%20Street,%20T%20Nagar,%20Chennai%20600017&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
    {
      name: 'Madurai Office',
      address: 'Maligai Thani Veedugal, Avaniyapuram Bypass Rd, Madurai, Tamil Nadu 625012',
      mapUrl: 'https://maps.google.com/?q=Maligai+Thani+Veedugal,+Avaniyapuram+Bypass+Rd,+Madurai,+Tamil+Nadu+625012',
      embedUrl: 'https://maps.google.com/maps?q=Maligai%20Thani%20Veedugal,%20Avaniyapuram%20Bypass%20Rd,%20Madurai,%20Tamil%20Nadu%20625012&t=&z=15&ie=UTF8&iwloc=&output=embed',
    },
  ];

  const coordinates = [
    {
      icon: <Phone className="h-5 w-5 text-primary-600" />,
      label: 'Phone Support',
      value: '+91 99431 61027',
      link: 'tel:+919943161027',
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-primary-600" />,
      label: 'WhatsApp Chat',
      value: '+91 99431 61027',
      link: 'https://api.whatsapp.com/send?phone=919943161027&text=Need%20Services',
    },
    {
      icon: <Mail className="h-5 w-5 text-primary-600" />,
      label: 'Email Address',
      value: 'info@ayusyahealthcare.com',
      link: 'mailto:info@ayusyahealthcare.com',
    },
    {
      icon: <Clock className="h-5 w-5 text-primary-600" />,
      label: 'Business Hours',
      value: '24/7 Care Coordination',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | Home Care Coordination Chennai & Madurai</title>
        <meta
          name="description"
          content="Contact Ayusya Health Care to book caretakers, nurses, and doctor visits. We have coordinates in Chennai and Madurai, Tamil Nadu."
        />
      </Helmet>

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              Get In Touch
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900 leading-none">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-warm-600 leading-relaxed">
              Have questions about home nursing or elderly care takers? Leave your details below and a case coordinator will contact you shortly.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start text-left">
            {/* Contact details list (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-serif text-xl font-bold text-warm-950 border-b border-warm-150 pb-2">
                Support Details
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {coordinates.map((item, idx) => (
                  <AnimatedSection
                    key={idx}
                    direction="up"
                    delay={idx * 0.05}
                    className="rounded-2xl border border-warm-200 bg-white p-4 shadow-xs flex items-center gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                      {item.icon}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">{item.label}</p>
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.link.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-warm-900 hover:text-primary-600 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-warm-900">{item.value}</span>
                      )}
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              {/* Office listing info */}
              <div className="space-y-4">
                {offices.map((office, idx) => (
                  <AnimatedSection
                    key={idx}
                    direction="up"
                    delay={idx * 0.05}
                  >
                    <div
                      className={`rounded-2xl border p-5 shadow-xs space-y-3 cursor-pointer transition-all ${
                        activeOfficeIndex === idx
                          ? 'border-primary-500 bg-primary-50/10'
                          : 'border-warm-200 bg-white hover:border-warm-300'
                      }`}
                      onClick={() => setActiveOfficeIndex(idx)}
                    >
                      <h3 className="font-serif text-sm font-bold text-warm-950 flex items-center gap-1.5">
                        <MapPin className="h-4.5 w-4.5 text-primary-500" />
                        <span>{office.name}</span>
                      </h3>
                      <a
                        href={office.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-warm-600 hover:text-primary-600 hover:underline leading-relaxed block transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOfficeIndex(idx);
                        }}
                      >
                        {office.address}
                      </a>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* General Contact Form Box (7 cols) */}
            <div className="lg:col-span-7">
              <AnimatedSection direction="left" className="rounded-3xl border border-warm-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-serif text-lg font-bold text-warm-950 border-b border-warm-100 pb-2">
                  Request Consultation Visit
                </h3>
                <ContactForm />
              </AnimatedSection>
            </div>
          </div>

          {/* Google Maps embed */}
          <AnimatedSection direction="up" className="rounded-3xl border border-warm-200 bg-white p-2 shadow-sm overflow-hidden h-87.5">
            <iframe
              title="Ayusya Google Map Navigation"
              src={offices[activeOfficeIndex].embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            ></iframe>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
};
