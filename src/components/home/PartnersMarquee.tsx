import React, { useEffect, useState } from 'react';
import { getPartners, Partner } from '../../lib/queries/partners';

const fallbackPartners: Partner[] = [
  { id: '1', name: 'Appasamy Hospital', logo_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=150&q=80', display_order: 1 },
  { id: '2', name: 'Chennai General Clinic', logo_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=150&q=80', display_order: 2 },
  { id: '3', name: 'Metro Specialty Hospital', logo_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=150&q=80', display_order: 3 },
  { id: '4', name: 'Madurai Care Center', logo_url: 'https://images.unsplash.com/photo-1504813184591-015578998475?auto=format&fit=crop&w=150&q=80', display_order: 4 },
];

export const PartnersMarquee: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    async function loadPartners() {
      try {
        const data = await getPartners();
        if (data && data.length > 0) {
          setPartners(data);
        } else {
          setPartners(fallbackPartners);
        }
      } catch (err) {
        console.error('Failed to load partners, using fallback', err);
        setPartners(fallbackPartners);
      }
    }
    loadPartners();
  }, []);

  // Double the partners list to create an infinite looping marquee effect
  const marqueeItems = [...partners, ...partners, ...partners];

  return (
    <section className="py-12 bg-transparent border-t border-sky-100/40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-warm-400 mb-6">
          Clinical Partners & Hospital Networks
        </p>

        {/* Outer scrolling container */}
        <div className="relative w-full overflow-hidden py-4 mask-gradient">
          <div className="animate-marquee flex items-center gap-12 sm:gap-20">
            {marqueeItems.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex items-center justify-center shrink-0"
              >
                <div className="flex items-center gap-2 group">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="h-10 w-10 rounded-lg object-cover grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                  <span className="text-sm font-serif font-bold text-warm-500 group-hover:text-warm-850 transition-colors whitespace-nowrap">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
