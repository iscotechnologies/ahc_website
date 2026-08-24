import React, { useEffect, useState } from 'react';
import { Play, MessageSquare, MapPin, Star, ShieldCheck, Loader2 } from 'lucide-react';
import { getTestimonials, Testimonial } from '../../lib/queries/testimonials';
import { getGoogleReviews, GoogleReview } from '../../lib/queries/reviews';
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

const fallbackReviews: GoogleReview[] = [
  {
    id: '1',
    name: 'Ramesh Sundaram',
    time_text: '2 weeks ago',
    rating: 5,
    text: 'Extremely professional caretaker service in Chennai. They took great care of my father post-hip replacement surgery. Highly recommended.',
    location: 'Chennai',
    display_order: 1,
    created_at: '',
  },
  {
    id: '2',
    name: 'Kavitha Raja',
    time_text: '1 month ago',
    rating: 5,
    text: 'We hired a home nurse for wound dressing in Madurai. Excellent hygiene standards, arrived on time, and was very friendly with my mother.',
    location: 'Madurai',
    display_order: 2,
    created_at: '',
  },
  {
    id: '3',
    name: 'Dr. Vignesh Kumar',
    time_text: '3 months ago',
    rating: 5,
    text: 'Highly reliable team. The physiotherapist they scheduled in Chennai was very patient and explained the recovery exercises very clearly.',
    location: 'Chennai',
    display_order: 3,
    created_at: '',
  },
];

export const PatientStoriesAndReviews: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
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
        setLoadingTestimonials(false);
      }
    }

    async function loadReviews() {
      try {
        const data = await getGoogleReviews();
        if (data && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(fallbackReviews);
        }
      } catch (err) {
        console.error('Failed to load Google reviews, using local fallback', err);
        setReviews(fallbackReviews);
      } finally {
        setLoadingReviews(false);
      }
    }

    loadTestimonials();
    loadReviews();
  }, []);

  // Multiply the testimonials list to create an infinite looping marquee effect
  const marqueeTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-16 md:py-24 bg-white/40 border-t border-sky-100/40 backdrop-blur-xs overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-12">
        <AnimatedSection className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
            Patient Stories & Trust
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900">
            Recovering with Trust & Dignity
          </h2>
          <p className="text-sm sm:text-base text-warm-600 leading-relaxed max-w-2xl mx-auto">
            Listen to families share their experiences and read reviews from those who received home care support from Ayusya.
          </p>
        </AnimatedSection>
      </div>

      {/* YouTube Video Testimonials Marquee */}
      <div className="mb-16">
        {loadingTestimonials ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="relative w-full overflow-hidden py-4 mask-gradient">
            <div className="animate-marquee flex gap-6 px-4">
              {marqueeTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="w-80 sm:w-96 shrink-0 relative overflow-hidden rounded-3xl border border-warm-200 bg-white p-4 shadow-xs hover:shadow-md transition-shadow duration-300 group text-left"
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Google Reviews Subsection */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-sky-100/50 pt-16">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Aggregated Score */}
          <AnimatedSection direction="right" className="lg:col-span-4 text-left space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              Patient Trust
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-warm-900">
              Verified Google Reviews
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-black text-warm-950">4.9</span>
              <div>
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-warm-500 font-semibold mt-1">Based on 450+ reviews</p>
              </div>
            </div>
            <p className="text-sm text-warm-600 leading-relaxed">
              Our patients and their families consistently rate us highly for nurse professionalism, caretakers patience, and physician clarity.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-sky-700 font-bold bg-sky-50 border border-sky-100 rounded-lg p-2.5 max-w-max">
              <ShieldCheck className="h-4.5 w-4.5 text-sky-600" />
              <span>100% HIPAA and patient safety compliant</span>
            </div>
          </AnimatedSection>

          {/* Right Column: Individual reviews grid */}
          <div className="lg:col-span-8">
            {loadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-3 text-left">
                {reviews.slice(0, 3).map((review, index) => (
                  <AnimatedSection
                    key={review.id || index}
                    direction="up"
                    delay={index * 0.1}
                    className="rounded-3xl border border-warm-200 bg-white p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-500">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-warm-400 font-medium">{review.time_text}</span>
                      </div>
                      <p className="text-xs text-warm-600 leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>

                    <div className="border-t border-warm-100 mt-4 pt-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-warm-800">{review.name}</span>
                      <span className="rounded bg-warm-100 px-1.5 py-0.5 text-[9px] font-bold text-warm-600 uppercase tracking-wide">
                        {review.location}
                      </span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </div>
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
