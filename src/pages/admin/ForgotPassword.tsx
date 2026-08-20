import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '../../components/shared/Toast';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        showToast(error.message, 'error');
      } else {
        setSuccess(true);
        showToast('Password reset link sent to your email!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-warm-900 via-warm-950 to-primary-950 p-4 md:p-6 select-none relative overflow-hidden">
      {/* Background Soft Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-3">
          <div className="inline-block p-1 rounded-3xl bg-white border border-warm-200 shadow-md">
            <img
              src="/assets/logo.jpeg"
              alt="Ayusya Health Care Logo"
              className="h-16 w-auto object-contain rounded-2xl"
            />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white leading-none">
            Reset Password
          </h1>
          <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">
            Ayusya Health Care Services
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-6">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Mail className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Check Your Email</h3>
                <p className="text-xs text-warm-300 leading-relaxed">
                  We've sent a password reset link to <strong className="text-white">{email}</strong>. Please follow the link in the email to set a new password.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4 text-left">
              <p className="text-xs text-warm-300 leading-relaxed text-center">
                Enter your administrative email address, and we will send you a secure link to reset your password.
              </p>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-warm-200 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="ayusyahomecare@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-warm-400 focus:border-primary-500 focus:bg-white/10 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/10 hover:bg-primary-700 hover:shadow-primary-600/20 active:scale-98 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back Link */}
        {!success && (
          <div className="text-center">
            <Link
              to="/admin/login"
              className="text-xs font-semibold text-warm-400 hover:text-warm-300 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
