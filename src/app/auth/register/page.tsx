"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";
import { useAuthStore } from "@/lib/store";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const socialModalSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

const socialPasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type SocialModalData = z.infer<typeof socialModalSchema>;
type SocialPasswordData = z.infer<typeof socialPasswordSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialModal, setSocialModal] = useState<{ open: boolean; provider: string; name: string }>({ open: false, provider: "", name: "" });
  const [socialStep, setSocialStep] = useState<1 | 2>(1);
  const [socialEmail, setSocialEmail] = useState("");
  const { register: registerUser, socialLogin } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  });

  const socialEmailForm = useForm<SocialModalData>({
    resolver: zodResolver(socialModalSchema),
  });

  const socialPassForm = useForm<SocialPasswordData>({
    resolver: zodResolver(socialPasswordSchema),
  });

  const password = watch("password", "");

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    const success = await registerUser(data.name, data.email, data.password);
    if (success) {
      window.location.href = "/dashboard";
    }
    setIsLoading(false);
  };

  const openSocialModal = (provider: string, name: string) => {
    setSocialModal({ open: true, provider, name });
    setSocialStep(1);
    setSocialEmail("");
    socialEmailForm.reset();
    socialPassForm.reset();
  };

  const handleSocialEmailSubmit = (data: SocialModalData) => {
    setSocialEmail(data.email);
    setSocialStep(2);
  };

  const handleSocialPasswordSubmit = (_data: SocialPasswordData) => {
    const displayName = socialEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    socialLogin(socialModal.provider, displayName, socialEmail);
    setSocialModal({ open: false, provider: "", name: "" });
    window.location.href = "/dashboard";
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
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-sm text-white/40">Start your journey to optimal health</p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="space-y-3 mb-6">
            <button onClick={() => openSocialModal("google", "Google")} className="w-full flex items-center justify-center gap-3 glass hover:bg-white/[0.08] transition-all py-3 rounded-xl text-sm font-medium text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button onClick={() => openSocialModal("apple", "Apple")} className="w-full flex items-center justify-center gap-3 glass hover:bg-white/[0.08] transition-all py-3 rounded-xl text-sm font-medium text-white">
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Continue with Apple
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#09090b] px-3 text-white/30">or continue with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...register("name")} type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors" />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...register("email")} type="email" placeholder="you@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors" />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              {password && (
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className={`flex items-center gap-1.5 text-xs ${check.met ? "text-emerald-400" : "text-white/30"}`}>
                      <Check className="w-3 h-3" /> {check.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input {...register("confirmPassword")} type={showConfirm ? "text" : "password"} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <div>
              <label className="flex items-start gap-2 text-sm text-white/40 cursor-pointer">
                <input {...register("terms")} type="checkbox" className="mt-0.5 w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/20" />
                <span>I agree to the <a href="#" className="text-emerald-400 hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a></span>
              </label>
              {errors.terms && <p className="text-xs text-red-400 mt-1">{errors.terms.message}</p>}
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>

      <AnimatePresence>
        {socialModal.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-sm glass-strong rounded-2xl p-6">
              {socialStep === 1 ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto mb-3">
                      {socialModal.provider === "google" ? (
                        <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white">Continue with {socialModal.name}</h3>
                    <p className="text-sm text-white/40 mt-1">Enter your email to sign up</p>
                  </div>
                  <form onSubmit={socialEmailForm.handleSubmit(handleSocialEmailSubmit)} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input {...socialEmailForm.register("email")} type="email" placeholder="you@example.com" autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    {socialEmailForm.formState.errors.email && <p className="text-xs text-red-400">{socialEmailForm.formState.errors.email.message}</p>}
                    <button type="submit" className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <button onClick={() => setSocialStep(1)} className="absolute top-4 left-4 text-white/30 hover:text-white/60"><ArrowLeft className="w-5 h-5" /></button>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold text-emerald-400">{socialEmail.charAt(0).toUpperCase()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Enter your password</h3>
                    <p className="text-sm text-white/40 mt-1">{socialEmail}</p>
                  </div>
                  <form onSubmit={socialPassForm.handleSubmit(handleSocialPasswordSubmit)} className="space-y-4">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input {...socialPassForm.register("password")} type="password" placeholder="••••••••" autoFocus className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    {socialPassForm.formState.errors.password && <p className="text-xs text-red-400">{socialPassForm.formState.errors.password.message}</p>}
                    <button type="submit" className="w-full bg-emerald-500 text-white py-3 rounded-xl font-medium hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                      Create Account <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
              <button onClick={() => setSocialModal({ open: false, provider: "", name: "" })} className="absolute top-4 right-4 text-white/30 hover:text-white/60 text-sm">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
