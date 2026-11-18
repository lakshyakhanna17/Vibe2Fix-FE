import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Frontend validation according to doc Section 6.8 & 8
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(formData.name, formData.email, formData.password, formData.phone);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#161619] rounded-[2.5rem] p-8 sm:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.75)] relative">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-white to-neutral-300 text-black font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            V
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Create Account</h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Join Vibe2Fix for fast hardware delivery and order tracking
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-500/15 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Account created successfully! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Rahul Sharma"
              required
              className="w-full px-4 py-3 bg-[#1F1F24] hover:bg-[#25252B] focus:bg-[#282830] rounded-2xl text-xs text-white placeholder:text-neutral-500 font-medium focus:outline-none transition-all duration-200 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              className="w-full px-4 py-3 bg-[#1F1F24] hover:bg-[#25252B] focus:bg-[#282830] rounded-2xl text-xs text-white placeholder:text-neutral-500 font-medium focus:outline-none transition-all duration-200 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full px-4 py-3 bg-[#1F1F24] hover:bg-[#25252B] focus:bg-[#282830] rounded-2xl text-xs text-white placeholder:text-neutral-500 font-medium focus:outline-none transition-all duration-200 shadow-inner font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Password (Min 8 chars)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full px-4 py-3 bg-[#1F1F24] hover:bg-[#25252B] focus:bg-[#282830] rounded-2xl text-xs text-white placeholder:text-neutral-500 font-medium focus:outline-none transition-all duration-200 shadow-inner font-mono tracking-wider"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-[#1F1F24] hover:bg-[#25252B] focus:bg-[#282830] rounded-2xl text-xs text-white placeholder:text-neutral-500 font-medium focus:outline-none transition-all duration-200 shadow-inner font-mono tracking-wider"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-3d w-full py-3.5 px-4 text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 font-black mt-3"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div className="mt-7 text-center text-xs text-neutral-400">
          Already registered?{' '}
          <Link to="/login" className="text-white font-bold hover:underline ml-1">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
