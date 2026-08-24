import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { getServices, Service } from '../../lib/queries/services';
import { submitContact } from '../../lib/queries/submissions';
import { useToast } from '../shared/Toast';

const contactSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  phone: zod.string().regex(/^[0-9+\s-]{10,15}$/, 'Enter a valid phone number (10-15 digits)'),
  email: zod.string().email('Enter a valid email address').optional().or(zod.literal('')),
  location: zod.string().min(1, 'Please select a location'),
  service_interested: zod.string().min(1, 'Please select a service').nullable(),
  message: zod.string().optional(),
});

type ContactFormData = zod.infer<typeof contactSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, compact = false }) => {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      location: '',
      service_interested: '',
      message: '',
    },
  });

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContact({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        location: data.location,
        service_interested: data.service_interested || null,
        message: data.message || undefined,
      });
      showToast('Contact form submitted successfully! We will get back to you shortly.', 'success');
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      showToast('Failed to submit form. Please check your network connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <div>
        <label htmlFor="name" className="block text-xs font-semibold text-warm-700 uppercase tracking-wider mb-1">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          disabled={isSubmitting}
          className={`w-full rounded-xl border ${
            errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
          } bg-white px-4 py-2.5 text-sm transition-all focus:ring-2`}
          placeholder="Enter your full name"
          {...register('name')}
        />
        {errors.name && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name.message}</p>}
      </div>

      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2 text-left'}>
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-warm-700 uppercase tracking-wider mb-1">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            disabled={isSubmitting}
            className={`w-full rounded-xl border ${
              errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
            } bg-white px-4 py-2.5 text-sm transition-all focus:ring-2`}
            placeholder="e.g. 9876543210"
            {...register('phone')}
          />
          {errors.phone && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-warm-700 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            disabled={isSubmitting}
            className={`w-full rounded-xl border ${
              errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
            } bg-white px-4 py-2.5 text-sm transition-all focus:ring-2`}
            placeholder="e.g. name@example.com"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>}
        </div>
      </div>

      <div className={compact ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2 text-left'}>
        <div>
          <label htmlFor="location" className="block text-xs font-semibold text-warm-700 uppercase tracking-wider mb-1">
            Location <span className="text-rose-500">*</span>
          </label>
          <select
            id="location"
            disabled={isSubmitting}
            className={`w-full rounded-xl border ${
              errors.location ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
            } bg-white px-4 py-2.5 text-sm transition-all focus:ring-2`}
            {...register('location')}
          >
            <option value="">Select a city</option>
            <option value="Chennai">Chennai</option>
            <option value="Madurai">Madurai</option>
          </select>
          {errors.location && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.location.message}</p>}
        </div>

        <div>
          <label htmlFor="service_interested" className="block text-xs font-semibold text-warm-700 uppercase tracking-wider mb-1">
            Service Interested <span className="text-rose-500">*</span>
          </label>
          <select
            id="service_interested"
            disabled={isSubmitting || loadingServices}
            className={`w-full rounded-xl border ${
              errors.service_interested ? 'border-rose-500 focus:ring-rose-500' : 'border-warm-200 focus:ring-primary-500'
            } bg-white px-4 py-2.5 text-sm transition-all focus:ring-2`}
            {...register('service_interested')}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.service_interested && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.service_interested.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-warm-700 uppercase tracking-wider mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={compact ? 3 : 4}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Tell us about the care required..."
          {...register('message')}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-center block focus:ring-2 focus:ring-primary-500"
      >
        {isSubmitting ? 'Submitting request...' : 'Book Visit'}
      </button>
    </form>
  );
};
