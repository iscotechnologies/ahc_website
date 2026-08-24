import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { ShieldCheck, Handshake, Users, ArrowRight } from 'lucide-react';
import { submitReferral } from '../lib/queries/submissions';
import { useToast } from '../components/shared/Toast';
import { AnimatedSection } from '../components/shared/AnimatedSection';

const referralSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  organization: zod.string().optional(),
  phone: zod.string().regex(/^[0-9+\s-]{10,15}$/, 'Enter a valid phone number (10-15 digits)'),
  email: zod.string().email('Enter a valid email address').optional().or(zod.literal('')),
  relationship_type: zod.string().min(1, 'Please select your relationship type'),
  message: zod.string().optional(),
});

type ReferralFormData = zod.infer<typeof referralSchema>;

export const ReferralPartner: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      name: '',
      organization: '',
      phone: '',
      email: '',
      relationship_type: '',
      message: '',
    },
  });

  const onSubmit = async (data: ReferralFormData) => {
    setIsSubmitting(true);
    try {
      await submitReferral({
        name: data.name,
        organization: data.organization || undefined,
        phone: data.phone,
        email: data.email || undefined,
        relationship_type: data.relationship_type,
        message: data.message || undefined,
      });
      showToast('Referral Partner application submitted successfully! Our hospital liaison manager will call you shortly.', 'success');
      reset();
    } catch (err) {
      console.error(err);
      showToast('Failed to submit partner application. Please check your credentials or network and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Referral Partners & Hospital Network Program | Ayusya</title>
        <meta
          name="description"
          content="Partner with Ayusya Health Care. We collaborate with doctors, diagnostic labs, NGOs, and hospitals in Chennai and Madurai for home clinical transfers."
        />
      </Helmet>

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              Collaborative Care
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900 leading-none">
              Referral Partner Program
            </h1>
            <p className="text-sm sm:text-base text-warm-600 leading-relaxed">
              We coordinate post-discharge patient transfers for hospitals, diagnostic labs, and general physicians to ensure care continuity.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start text-left">
            {/* Info Points (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-serif text-xl font-bold text-warm-950 border-b border-warm-150 pb-2">
                Program Benefits
              </h2>

              <div className="space-y-4 text-xs text-warm-600 leading-relaxed">
                <AnimatedSection direction="up" className="rounded-2xl border border-warm-200 bg-white p-4 shadow-xs space-y-2">
                  <h4 className="font-serif text-sm font-bold text-warm-950 flex items-center gap-1.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-sky-600" />
                    <span>Safe Patient Discharge</span>
                  </h4>
                  <p>
                    Transition patients seamlessly from hospital ICU wards to home recovery. We coordinate hospital bed rental, oxygen setups, and GNM nurse rotas.
                  </p>
                </AnimatedSection>

                <AnimatedSection direction="up" delay={0.05} className="rounded-2xl border border-warm-200 bg-white p-4 shadow-xs space-y-2">
                  <h4 className="font-serif text-sm font-bold text-warm-950 flex items-center gap-1.5">
                    <Users className="h-4.5 w-4.5 text-primary-600" />
                    <span>Dedicated Liaison Support</span>
                  </h4>
                  <p>
                    Partners receive a dedicated liaison manager to coordinate priority bookings, customized patient recovery reports, and clinical billing.
                  </p>
                </AnimatedSection>
              </div>
            </div>

            {/* Application form (7 cols) */}
            <div className="lg:col-span-7">
              <AnimatedSection direction="left" className="rounded-3xl border border-warm-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-warm-100 pb-2">
                  <Handshake className="h-6 w-6 text-primary-600" />
                  <h2 className="font-serif text-xl font-bold text-warm-950">Referral Setup Form</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                        Contact Person Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        disabled={isSubmitting}
                        className={`w-full rounded-xl border ${
                          errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                        } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                        placeholder="e.g. Dr. Ramesh"
                        {...register('name')}
                      />
                      {errors.name && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.name.message}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        disabled={isSubmitting}
                        className={`w-full rounded-xl border ${
                          errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                        } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                        placeholder="e.g. 9876543210"
                        {...register('phone')}
                      />
                      {errors.phone && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Organization */}
                    <div>
                      <label htmlFor="organization" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                        Organization / Hospital Name
                      </label>
                      <input
                        id="organization"
                        type="text"
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-warm-200 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g. City General Clinic"
                        {...register('organization')}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        disabled={isSubmitting}
                        className={`w-full rounded-xl border ${
                          errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                        } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                        placeholder="e.g. info@clinic.com"
                        {...register('email')}
                      />
                      {errors.email && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.email.message}</p>}
                    </div>
                  </div>

                  {/* Relationship Type */}
                  <div>
                    <label htmlFor="relationship_type" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                      Relationship/Partner Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="relationship_type"
                      disabled={isSubmitting}
                      className={`w-full rounded-xl border ${
                        errors.relationship_type ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                      } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                      {...register('relationship_type')}
                    >
                      <option value="">Choose one</option>
                      <option value="General Physician / Specialist">General Physician / Specialist</option>
                      <option value="Hospital Discharge Desk">Hospital Discharge Desk</option>
                      <option value="Diagnostic Lab / Clinic">Diagnostic Lab / Clinic</option>
                      <option value="NGO / Trust Coordinator">NGO / Trust Coordinator</option>
                      <option value="Insurance / Care Agent">Insurance / Care Agent</option>
                    </select>
                    {errors.relationship_type && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.relationship_type.message}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                      Referral details / Collaboration ideas
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-warm-200 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Share details of discharge coordinate plans or diagnostic support needed..."
                      {...register('message')}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting details...' : 'Submit Partnership Request'}
                  </button>
                </form>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
