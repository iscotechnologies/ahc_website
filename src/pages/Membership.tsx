import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Shield, Sparkles, Check, Calendar, ArrowRight } from 'lucide-react';
import { submitMembership } from '../lib/queries/submissions';
import { useToast } from '../components/shared/Toast';
import { AnimatedSection } from '../components/shared/AnimatedSection';

const membershipSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  phone: zod.string().regex(/^[0-9+\s-]{10,15}$/, 'Enter a valid phone number (10-15 digits)'),
  email: zod.string().email('Enter a valid email address').optional().or(zod.literal('')),
  address: zod.string().min(10, 'Please enter a complete address (min 10 characters)'),
  plan_tier: zod.string().min(1, 'Please select a plan tier'),
  preferred_start_date: zod.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a starting date'),
});

type MembershipFormData = zod.infer<typeof membershipSchema>;

export const Membership: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      plan_tier: '',
      preferred_start_date: '',
    },
  });

  const tiers = [
    {
      name: 'Silver Tier',
      price: '₹2,500/mo',
      desc: 'Ideal for monthly vitals checks and basic doctor consultation priority.',
      features: ['1 Home Nurse vital check/mo', '1 Doctor home visit/yr', 'Priority scheduling support', 'Emergency coordinator assigned'],
    },
    {
      name: 'Gold Tier',
      price: '₹5,000/mo',
      desc: 'Our most popular plan for regular geriatric support and diabetes care.',
      features: ['2 Home Nurse checks/mo', '2 Doctor home visits/yr', 'Priority clinic support', '10% discount on nurse bookings', 'Emergency coordinator assigned'],
      popular: true,
    },
    {
      name: 'Platinum Tier',
      price: '₹10,000/mo',
      desc: 'Complete ICU recovery support and weekly health tracking.',
      features: ['Weekly Home Nurse audits', '4 Doctor home visits/yr', 'Unlimited teleconsultations', '15% discount on all service coordinates', 'Priority emergency setup assistance'],
    },
  ];

  const onSubmit = async (data: MembershipFormData) => {
    setIsSubmitting(true);
    try {
      await submitMembership({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        address: data.address,
        plan_tier: data.plan_tier,
        preferred_start_date: data.preferred_start_date,
      });
      showToast('Annual Membership enrollment submitted successfully! Our manager will call you to finalize setup.', 'success');
      reset();
    } catch (err) {
      console.error(err);
      showToast('Failed to submit enrollment request. Please check your credentials or network and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Annual Health Membership Plans | Ayusya Health Care</title>
        <meta
          name="description"
          content="Enroll in Ayusya Health Care Annual Membership plans. Regular home nursing, general physician visits, and priority support in Chennai and Madurai."
        />
      </Helmet>

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">
              Continuous Care
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-warm-900 leading-none">
              Annual Health Membership
            </h1>
            <p className="text-sm sm:text-base text-warm-600 leading-relaxed">
              Ensure long-term medical support for your loved parents with monthly clinical follow-ups, emergency coordinates, and discounted service bookings.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid gap-6 md:grid-cols-3 text-left">
            {tiers.map((tier, idx) => (
              <AnimatedSection
                key={idx}
                direction="up"
                delay={idx * 0.05}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 bg-white shadow-xs ${
                  tier.popular ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-warm-200'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 right-6 rounded-full bg-primary-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 fill-current" />
                    <span>Popular</span>
                  </span>
                )}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-warm-950">{tier.name}</h3>
                    <p className="text-2xl font-black text-primary-700 mt-1">{tier.price}</p>
                    <p className="text-[11px] text-warm-500 leading-relaxed mt-1.5">{tier.desc}</p>
                  </div>
                  <ul className="space-y-2 border-t border-warm-100 pt-4 text-xs text-warm-600">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex gap-2 items-start">
                        <Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Enrollment Form */}
          <AnimatedSection direction="up" className="rounded-3xl border border-warm-200 bg-white p-6 sm:p-8 shadow-sm text-left max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-2 border-b border-warm-100 pb-2">
              <Shield className="h-6 w-6 text-primary-600" />
              <h2 className="font-serif text-xl font-bold text-warm-950">Enroll In Membership</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl border ${
                      errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                    } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                    placeholder="e.g. Meenakshi"
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
                    placeholder="10-digit number"
                    {...register('phone')}
                  />
                  {errors.phone && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                    placeholder="name@example.com"
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.email.message}</p>}
                </div>

                {/* Plan Tier Dropdown */}
                <div>
                  <label htmlFor="plan_tier" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                    Membership Plan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="plan_tier"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl border ${
                      errors.plan_tier ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                    } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                    {...register('plan_tier')}
                  >
                    <option value="">Choose a tier</option>
                    <option value="Silver Tier">Silver Tier (₹2,500/mo)</option>
                    <option value="Gold Tier">Gold Tier (₹5,000/mo)</option>
                    <option value="Platinum Tier">Platinum Tier (₹10,000/mo)</option>
                  </select>
                  {errors.plan_tier && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.plan_tier.message}</p>}
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="preferred_start_date" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                  Preferred Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  id="preferred_start_date"
                  type="date"
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border ${
                    errors.preferred_start_date ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                  } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                  {...register('preferred_start_date')}
                />
                {errors.preferred_start_date && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.preferred_start_date.message}</p>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-[10px] font-bold text-warm-700 uppercase tracking-wide mb-1">
                  Full Residential Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="address"
                  rows={3}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl border ${
                    errors.address ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
                  } bg-white px-3.5 py-2 text-xs focus:ring-2`}
                  placeholder="Complete address with landmark for home nurse visits..."
                  {...register('address')}
                />
                {errors.address && <p className="mt-1 text-[10px] text-rose-500 font-medium">{errors.address.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting request...' : 'Submit Enrollment Application'}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
};
