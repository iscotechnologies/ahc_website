import React, { useEffect, useState } from 'react';
import { Play, MessageSquare, MapPin } from 'lucide-react';
import { getTestimonials, Testimonial } from '../../lib/queries/testimonials';
import { VideoLightbox } from '../shared/VideoLightbox';
import { AnimatedSection } from '../shared/AnimatedSection';

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    patient_name: 'Subramanian K.',
    location: 'Chennai',
    youtube_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
    display_order: 1,
    created_at: '',
  },
  {
    id: '2',
    patient_name: 'Meenakshi Ammal',
    location: 'Madurai',
    youtube_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?auto=format&fit=crop&w=600&q=80',
    display_order: 2,
    created_at: '',
  },
  {
    id: '3',
    patient_name: 'Ramanathan S.',
    location: 'Chennai',
    youtube_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    display_order: 3,
    created_at: '',
  },
];

export const TestimonialsGallery: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await getTestimonials();
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        console.error('Failed to load testimonials, using fallback', err);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection className="max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
            Patient Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900">
            Recovering with Trust & Dignity
          </h2>
          <p className="text-sm sm:text-base text-warm-600 leading-relaxed max-w-2xl mx-auto">
            Listen to families share their experiences of recovery, physical rehabilitation, and caring support with Ayusya.
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-warm-200 bg-white p-4 shadow-xs">
                <div className="shimmer h-48 w-full rounded-xl bg-warm-100 mb-4"></div>
                <div className="shimmer h-4 w-2/3 rounded bg-warm-100"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 text-left">
            {testimonials.map((testimonial) => (
              <AnimatedSection
                key={testimonial.id}
                direction="up"
                className="group relative overflow-hidden rounded-3xl border border-warm-200 bg-white p-4 shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                {/* Video Thumbnail Wrapper */}
                <div
                  onClick={() => setSelectedVideo(testimonial.youtube_id)}
                  className="relative h-48 w-full overflow-hidden rounded-2xl bg-warm-900 cursor-pointer"
                >
                  <img
                    src={testimonial.thumbnail_url}
                    alt={`${testimonial.patient_name || 'Patient'} Testimonial`}
                    className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-103"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-lg backdrop-blur-xs transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-6 w-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>

                {/* Patient details */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-warm-900 font-serif">
                      {testimonial.patient_name || 'Anonymous Patient'}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-warm-500 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-primary-500" />
                      <span>{testimonial.location || 'Tamil Nadu'}</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-primary-50 px-2 py-1 text-[10px] font-bold text-primary-700 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>Story</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>

      {/* Video Lightbox */}
      <VideoLightbox
        isOpen={selectedVideo !== null}
        onClose={() => setSelectedVideo(null)}
        youtubeId={selectedVideo || ''}
      />
    </section>
  );
};
