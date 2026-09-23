import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginUser } from '@/lib/api';

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        localStorage.setItem('access_token', result.access_token);

        if (result.user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      alert('ERROR: Backend login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1628] flex items-center justify-center px-4 py-8">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#c99a4a]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        <div className="rounded-3xl border border-[#c99a4a]/30 bg-[#111f34] shadow-2xl overflow-hidden">

          {/* Top gold line */}
          <div className="h-1.5 bg-gradient-to-r from-[#8b642c] via-[#e4bb70] to-[#8b642c]" />

          <div className="p-8 sm:p-10">

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">

                <div className="absolute inset-0 rounded-full bg-[#d5aa5a]/20 blur-xl" />

                <img
                  src="/vidur-logo.png"
                  alt="Vidur"
                  className="relative h-28 w-28 rounded-full object-cover border-2 border-[#d5aa5a] shadow-xl"
                />

              </div>
            </div>

            {/* Brand */}
            <div className="text-center mb-8">

              <h1 className="text-3xl font-serif font-bold tracking-[0.25em] text-[#e4bb70]">
                VIDUR
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                AI-Powered Citizen Service Platform
              </p>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-[#d5aa5a]" />
                Secure Citizen Access
              </div>

            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px flex-1 bg-slate-700" />
              <span className="text-xs uppercase tracking-widest text-slate-500">
                Sign In
              </span>
              <div className="h-px flex-1 bg-slate-700" />
            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="
                  w-full rounded-xl
                  border border-slate-600
                  bg-[#0b1628]
                  px-4 py-3.5
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  transition
                  focus:border-[#d5aa5a]
                  focus:ring-2
                  focus:ring-[#d5aa5a]/20
                "
              />

            </div>

            {/* Password */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="
                    w-full rounded-xl
                    border border-slate-600
                    bg-[#0b1628]
                    px-4 py-3.5 pr-12
                    text-white
                    placeholder:text-slate-500
                    outline-none
                    transition
                    focus:border-[#d5aa5a]
                    focus:ring-2
                    focus:ring-[#d5aa5a]/20
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    text-slate-400
                    hover:text-[#d5aa5a]
                    transition
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>

            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="
                w-full rounded-xl
                bg-gradient-to-r
                from-[#a87832]
                via-[#d5aa5a]
                to-[#a87832]
                py-3.5
                font-semibold
                text-[#111827]
                shadow-lg
                shadow-[#d5aa5a]/10
                transition
                hover:brightness-110
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Signup */}
            <p className="mt-7 text-center text-sm text-slate-400">

              Don't have an account?{' '}

              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="
                  font-semibold
                  text-[#d5aa5a]
                  hover:text-[#f0cc86]
                  transition
                "
              >
                Create Account
              </button>

            </p>

          </div>

          {/* Bottom branding */}
          <div className="border-t border-slate-700/70 bg-[#0c192b] px-6 py-4 text-center">

            <p className="text-xs text-slate-500">
              VIDUR • Your AI Guide for Government Services
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}