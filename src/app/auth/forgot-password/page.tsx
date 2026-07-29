"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Zap, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setEmail(data.email);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitted(true);
    setIsLoading(false);
  };

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
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
                  <p className="text-sm text-white/40">No worries, we&apos;ll send you reset instructions</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input {...register("email")} type="email" placeholder="you@example.com" autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
                <p className="text-sm text-white/40 mb-6">
                  We sent a password reset link to<br />
                  <span className="text-white/70 font-medium">{email}</span>
                </p>
                <p className="text-xs text-white/30 mb-6">Didn&apos;t receive the email? Check your spam folder or try again.</p>
                <div className="space-y-3">
                  <button onClick={() => { setIsSubmitted(false); setEmail(""); }} className="w-full glass text-white py-3 rounded-xl font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> Resend Email
                  </button>
                  <Link href="/auth/login" className="w-full glass text-white/60 py-3 rounded-xl font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isSubmitted && (
          <p className="text-center text-sm text-white/40 mt-6">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Sign in</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
