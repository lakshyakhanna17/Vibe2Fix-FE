import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // According to doc Section 6.9: Always returns 200 with standard text to prevent enumeration
      await authApi.forgotPassword(email);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-bg-card  rounded-3xl p-8 shadow-2xl relative">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
          <p className="text-xs text-text-muted mt-1">
            Enter your account email to receive a password reset token
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-2xl bg-status-success/10 border border-status-success/30 text-status-success text-xs">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-status-success" />
              <p className="font-semibold text-sm mb-1 text-white">Reset Link Dispatched</p>
              <p className="text-text-secondary leading-relaxed">
                If that email is registered, a reset link has been generated. Check your server console mailbox for the token link.
              </p>
            </div>
            <p className="text-[11px] text-text-muted">
              (In dev mode, open the backend server console to retrieve the generated URL)
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Your Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full px-4 py-3 bg-bg-elevated  rounded-xl text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-accent hover:bg-accent-hover text-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-[0_4px_0_0_#000000] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Generate Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
