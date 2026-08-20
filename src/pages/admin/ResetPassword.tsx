import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '../../components/shared/Toast';

export const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      showToast('Please enter a new password.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Password reset successfully! You can now log in with your new password.', 'success');
        navigate('/admin/login');
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
            Set New Password
          </h1>
          <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">
            Ayusya Health Care Services
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            <p className="text-xs text-warm-300 leading-relaxed text-center">
              Please enter and confirm your new administrative password.
            </p>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-xs font-bold text-warm-200 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-sm text-white placeholder-warm-400 focus:border-primary-500 focus:bg-white/10 focus:outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-warm-400 hover:text-white transition-colors outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-xs font-bold text-warm-200 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-sm text-white placeholder-warm-400 focus:border-primary-500 focus:bg-white/10 focus:outline-none transition-all duration-200"
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
                  <span>Saving Password...</span>
                </>
              ) : (
                <span>Save Password & Log In</span>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/admin/login"
            className="text-xs font-semibold text-warm-400 hover:text-warm-300 transition-colors"
          >
            ← Cancel & Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
