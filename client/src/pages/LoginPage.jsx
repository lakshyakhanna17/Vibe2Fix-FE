import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    setError(null);
    if (type === 'customer') {
      setEmail('customer@vibe2fix.com');
      setPassword('demo12345');
    } else {
      setEmail('admin@vibe2fix.com');
      setPassword('demo12345');
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#161619] rounded-[2.5rem] p-8 sm:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.75)] relative">
        
        {/* Header & Logo */}
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-white to-neutral-300 text-black font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            V
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Welcome Back</h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Sign in to access your hardware orders, cart & lab tools
          </p>
        </div>

        {/* Quick Demo Fill Buttons (Mock Mode Ready) */}
        <div className="mb-6 p-1.5 rounded-2xl bg-[#1F1F24] shadow-inner flex items-center gap-1.5 text-xs">
          <div className="pl-2 pr-1 text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider hidden sm:flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-neutral-300" />
            <span>Demo:</span>
          </div>
          <button
            type="button"
            onClick={() => handleFillDemo('customer')}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition ${
              email === 'customer@vibe2fix.com'
                ? 'tab-3d-active'
                : 'tab-3d text-text-secondary'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('admin')}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition ${
              email === 'admin@vibe2fix.com'
                ? 'tab-3d-active'
                : 'tab-3d text-text-secondary'
            }`}
          >
            Admin Portal
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-500/15 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative flex items-center group">
              <Mail className="w-4 h-4 absolute left-4 text-neutral-400 group-focus-within:text-white transition-colors pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@vibe2fix.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-[#1F1F24] hover:bg-[#25252B] focus:bg-[#282830] rounded-2xl text-xs text-white placeholder:text-neutral-500 font-medium focus:outline-none transition-all duration-200 shadow-inner"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-neutral-400 hover:text-white transition"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center group">
              <Lock className="w-4 h-4 absolute left-4 text-neutral-400 group-focus-within:text-white transition-colors pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-11 py-3 bg-[#1F1F24] hover:bg-[#25252B] focus:bg-[#282830] rounded-2xl text-xs text-white placeholder:text-neutral-500 font-medium focus:outline-none transition-all duration-200 shadow-inner font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-neutral-400 hover:text-white transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In CTA */}
          <button
            type="submit"
            disabled={loading}
            className="btn-3d w-full py-3.5 px-4 text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 font-black mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-neutral-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-white font-bold hover:underline ml-1">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};
