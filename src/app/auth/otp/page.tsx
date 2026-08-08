"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

function OtpPageContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isResend, setIsResend] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = useCallback((index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }, [otp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  }, []);

  const handleVerify = async () => {
    if (otp.join("").length !== 6) return;
    if (!email) {
      setError("Missing email. Please go back and try again.");
      return;
    }
    setIsVerifying(true);
    setError("");

    const token = otp.join("");
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
      setIsVerifying(false);
      return;
    }

    setIsVerifying(false);
    router.push("/profile/setup");
  };

  const handleResend = async () => {
    if (!email) {
      setError("Missing email. Please go back and try again.");
      return;
    }
    setIsResend(true);
    setError("");
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setIsResend(false);
    if (sendError) {
      setError(sendError.message);
      return;
    }
    setCountdown(30);
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div>
            <span className="text-2xl font-bold text-white">VitalX AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Verify your email</h1>
          <p className="text-sm text-white/40">We sent a 6-digit code to your email</p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          {!email && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              No email provided. Please restart signup.
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                aria-label={`Verification code digit ${i + 1}`}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/5 border text-white focus:outline-none transition-all ${
                  digit ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/10"
                } focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20`}
              />
            ))}
          </div>

          <button onClick={handleVerify} disabled={!isComplete || isVerifying} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6">
            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify <ArrowRight className="w-4 h-4" /></>}
          </button>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-white/40">
                Resend code in <span className="text-emerald-400 font-medium">{countdown}s</span>
              </p>
            ) : (
              <button onClick={handleResend} disabled={isResend} className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors disabled:opacity-50">
                {isResend ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-white/40" /></div>}>
      <OtpPageContent />
    </Suspense>
  );
}
