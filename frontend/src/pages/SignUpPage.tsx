import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { signupUser } from '@/lib/api';

export function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    if (password.length > 128) {
      alert('Password must not exceed 128 characters');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      alert('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(password)) {
      alert('Password must contain at least one lowercase letter');
      return;
    }

    if (!/\d/.test(password)) {
      alert('Password must contain at least one number');
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      alert('Password must contain at least one special character');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const result = await signupUser(name, normalizedEmail, password); 

        if (result.success) {
          alert('Account created successfully. OTP has been sent to your email.');
          navigate('/verify-otp', {
            state: { email: normalizedEmail }
          });
        } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert('Signup failed');
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

      {/* Signup Card */}
      <div className="relative w-full max-w-md">

        <div className="rounded-3xl border border-[#c99a4a]/30 bg-[#111f34] shadow-2xl overflow-hidden">

          {/* Gold top line */}
          <div className="h-1.5 bg-gradient-to-r from-[#8b642c] via-[#e4bb70] to-[#8b642c]" />

          <div className="p-8 sm:p-10">

            {/* Logo */}
            <div className="flex justify-center mb-5">
              <div className="relative">

                <div className="absolute inset-0 rounded-full bg-[#d5aa5a]/20 blur-xl" />

                <img
                  src="/vidur-logo.png"
                  alt="Vidur"
                  className="relative h-24 w-24 rounded-full object-cover border-2 border-[#d5aa5a] shadow-xl"
                />

              </div>
            </div>

            {/* Brand */}
            <div className="text-center mb-7">

              <h1 className="text-3xl font-serif font-bold tracking-[0.25em] text-[#e4bb70]">
                VIDUR
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                AI-Powered Citizen Service Platform
              </p>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-[#d5aa5a]" />
                Secure Citizen Registration
              </div>

            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-slate-700" />

              <span className="text-xs uppercase tracking-widest text-slate-500">
                Create Account
              </span>

              <div className="h-px flex-1 bg-slate-700" />
            </div>

            {/* Full Name */}
            <div className="mb-4">

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
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

            {/* Email */}
            <div className="mb-4">

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
            <div className="mb-4">

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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

                <div className="mt-3 space-y-1 text-sm">
                  <p
                    className={
                      password.length >= 8
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                  >
                    {password.length >= 8 ? "✓" : "○"} At least 8 characters
                  </p>

                  <p
                    className={
                      /[A-Z]/.test(password)
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                  >
                    {/[A-Z]/.test(password) ? "✓" : "○"} One uppercase letter
                  </p>

                  <p
                    className={
                      /[a-z]/.test(password)
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                  >
                    {/[a-z]/.test(password) ? "✓" : "○"} One lowercase letter
                  </p>

                  <p
                    className={
                      /\d/.test(password)
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                  >
                    {/\d/.test(password) ? "✓" : "○"} One number
                  </p>

                  <p
                    className={
                      /[^A-Za-z0-9]/.test(password)
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                  >
                    {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"} One special character
                  </p>

                  <p
                    className={
                      password.length <= 128
                        ? "text-slate-400"
                        : "text-red-400"
                    }
                  >
                    {password.length <= 128 ? "○" : "✗"} Maximum 128 characters
                  </p>
                </div>

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

            {/* Confirm Password */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="
                    absolute right-3 top-1/2
                    -translate-y-1/2
                    text-slate-400
                    hover:text-[#d5aa5a]
                    transition
                  "
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>

            </div>

            {/* Create Account */}
            <button
              type="button"
              onClick={handleSignup}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Login */}
            <p className="mt-6 text-center text-sm text-slate-400">

              Already have an account?{' '}

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="
                  font-semibold
                  text-[#d5aa5a]
                  hover:text-[#f0cc86]
                  transition
                "
              >
                Sign In
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