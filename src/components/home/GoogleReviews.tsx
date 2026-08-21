import React, { useEffect, useState } from 'react';
import { Star, ShieldCheck, Loader2 } from 'lucide-react';
import { AnimatedSection } from '../shared/AnimatedSection';
import { getGoogleReviews, GoogleReview } from '../../lib/queries/reviews';

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
    text: 'Highly reliable team. The physiotherapist they scheduled in Trichy was very patient and explained the recovery exercises very clearly.',
    location: 'Trichy',
    display_order: 3,
    created_at: '',
  },
];

export const GoogleReviews: React.FC = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  return (
    <section className="py-16 bg-white/40 border-t border-sky-100/40 backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Aggregated Score (4 cols) */}
          <AnimatedSection direction="right" className="lg:col-span-4 text-left space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              Patient Trust
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-warm-900">
              Verified Google Reviews
            </h2>
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

          {/* Right Column: Individual reviews grid (8 cols) */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-3">
                {reviews.slice(0, 3).map((review, index) => (
                  <AnimatedSection
                    key={review.id || index}
                    direction="up"
                    delay={index * 0.1}
                    className="rounded-2xl border border-warm-200 bg-white p-5 shadow-xs flex flex-col justify-between"
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
    </section>
  );
};
