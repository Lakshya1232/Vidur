import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { verifyOTP,resendOTP } from '@/lib/api';

export function VerifyOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleVerify = async () => {
    if (!email) {
      alert('Email information is missing. Please signup again.');
      navigate('/signup');
      return;
    }

    if (otp.length !== 6) {
      alert('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyOTP(email, otp);

      if (result.success) {
        alert('Email verified successfully!');
        navigate('/login');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
  if (!email) {
    alert('Email information is missing. Please signup again.');
    navigate('/signup');
    return;
  }

  if (resendCooldown > 0 || resendLoading) {
    return;
  }

  setResendLoading(true);

  try {
    const result = await resendOTP(email);

    if (result.success) {
      setOtp('');
      alert('A new OTP has been sent to your email.');

      setResendCooldown(30);

      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error(error);
    alert('Failed to resend OTP');
  } finally {
    setResendLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0b1628] flex items-center justify-center px-4 py-8">

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
                Email Verification
              </p>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-[#d5aa5a]" />
                Secure Account Verification
              </div>

            </div>

            {/* Message */}
            <div className="mb-6 text-center">

              <p className="text-sm text-slate-300">
                We have sent a 6-digit OTP to
              </p>

              <p className="mt-1 font-medium text-[#e4bb70] break-all">
                {email}
              </p>

            </div>

            {/* OTP */}
            <div className="mb-6">

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Enter OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ''))
                }
                placeholder="Enter 6-digit OTP"
                className="
                  w-full rounded-xl
                  border border-slate-600
                  bg-[#0b1628]
                  px-4 py-4
                  text-center
                  text-2xl
                  tracking-[0.5em]
                  text-white
                  placeholder:text-slate-500
                  placeholder:tracking-normal
                  outline-none
                  transition
                  focus:border-[#d5aa5a]
                  focus:ring-2
                  focus:ring-[#d5aa5a]/20
                "
              />

            </div>

            {/* Verify */}
            <button
              type="button"
              onClick={handleVerify}
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
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="mt-5 text-center">
                <p className="text-sm text-slate-400">
                  Didn't receive the OTP?
                </p>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading || resendCooldown > 0}
                  className="
                    mt-2
                    text-sm
                    font-semibold
                    text-[#d5aa5a]
                    hover:text-[#f0cc86]
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {resendLoading
                    ? 'Sending...'
                    : resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : 'Resend OTP'}
                </button>
              </div>

            {/* Back */}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="
                mt-5
                w-full
                text-sm
                text-slate-400
                hover:text-[#d5aa5a]
                transition
              "
            >
              Back to Sign Up
            </button>

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