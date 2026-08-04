"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Brain, Apple, Dumbbell, Trophy, Heart, BarChart3,
  ChevronDown, ChevronRight, Check, Star, Zap, Shield,
  ArrowRight, Play, Menu, X, MessageCircle, Flame,
  Target, Activity, TrendingUp, Users, Clock
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const features = [
  { icon: Brain, title: "AI Health Coach", desc: "Personalized guidance powered by advanced AI that adapts to your unique health profile and goals.", color: "from-emerald-500 to-teal-500" },
  { icon: Apple, title: "Smart Nutrition", desc: "AI-powered meal planning and macro tracking that learns your preferences and dietary needs.", color: "from-green-500 to-emerald-500" },
  { icon: Dumbbell, title: "Workout Tracking", desc: "Smart workout logging with AI form analysis and progressive overload recommendations.", color: "from-blue-500 to-cyan-500" },
  { icon: Trophy, title: "Sports Analytics", desc: "Performance metrics and insights for athletes to optimize training and competition.", color: "from-purple-500 to-violet-500" },
  { icon: Heart, title: "Health Monitoring", desc: "Track vital signs, sleep quality, stress levels, and overall wellness metrics.", color: "from-rose-500 to-pink-500" },
  { icon: BarChart3, title: "Body Analytics", desc: "Comprehensive body composition tracking with trend analysis and predictions.", color: "from-amber-500 to-orange-500" },
];

const testimonials = [
  { name: "Sarah Chen", role: "Marathon Runner", text: "VitalX AI completely transformed my training. The AI coach identified patterns I never noticed and helped me cut 12 minutes off my marathon time.", rating: 5, avatar: "SC" },
  { name: "Marcus Johnson", role: "Fitness Enthusiast", text: "The nutrition tracking is incredible. It learns what I like and suggests meals that actually fit my macro goals. Lost 20lbs in 3 months.", rating: 5, avatar: "MJ" },
  { name: "Dr. Emily Park", role: "Sports Medicine", text: "As a physician, I'm impressed by the accuracy of the health metrics. I recommend VitalX AI to all my patients for wellness tracking.", rating: 5, avatar: "EP" },
  { name: "Rajesh Kumar", role: "Software Engineer", text: "Working long hours was ruining my health. VitalX AI's smart reminders and personalized workout plans helped me get back on track. Down 15kg and feeling amazing!", rating: 5, avatar: "RK" },
  { name: "Priya Sharma", role: "Yoga Instructor", text: "The sleep tracking and recovery insights are game-changers. I finally understand my body's patterns. My students love the custom routines the AI creates.", rating: 5, avatar: "PS" },
  { name: "James Wilson", role: "CrossFit Athlete", text: "I've tried dozens of fitness apps. VitalX AI is the only one that actually adapts to my performance in real-time. The sports analytics are next-level.", rating: 5, avatar: "JW" },
  { name: "Anika Patel", role: "Busy Mom", text: "As a mother of three, I have zero time for complicated fitness apps. VitalX AI keeps it simple with quick, effective workouts and meal plans my whole family loves.", rating: 5, avatar: "AP" },
  { name: "David Kim", role: "Competitive Swimmer", text: "The detailed sports analytics helped me identify a technique flaw that was slowing me down. Improved my 100m freestyle by 3 seconds in just 6 weeks.", rating: 4, avatar: "DK" },
  { name: "Sofia Rodriguez", role: "Weight Loss Journey", text: "Started at 95kg, now at 72kg after 8 months. The AI coach kept me motivated during plateaus and adjusted my plan perfectly. Best investment in myself.", rating: 5, avatar: "SR" },
];

const pricing = [
  { name: "Free", price: "₹0", period: "forever", desc: "Perfect for getting started", features: ["Basic health tracking", "AI chat (5 msgs/day)", "1 workout plan", "Community access"], cta: "Get Started", popular: false },
  { name: "Pro", price: "₹399", period: "month", desc: "For serious health goals", features: ["Everything in Free", "Unlimited AI coaching", "Advanced nutrition AI", "Unlimited workouts", "Sleep & recovery tracking", "Priority support"], cta: "Start Pro Trial", popular: true },
  { name: "Elite", price: "₹799", period: "month", desc: "Complete health optimization", features: ["Everything in Pro", "Sports analytics", "Body composition AI", "Medical report analysis", "Custom AI models", "1-on-1 coaching sessions", "API access"], cta: "Go Elite", popular: false },
];

const faqs = [
  { q: "How does the AI Health Coach work?", a: "Our AI Coach uses advanced machine learning to analyze your health data, goals, and lifestyle. It creates personalized recommendations for nutrition, exercise, and recovery that adapt based on your progress and feedback." },
  { q: "Is my health data secure?", a: "Absolutely. We use end-to-end encryption, HIPAA-compliant infrastructure, and never sell your data. Your health information is yours alone, protected by enterprise-grade security." },
  { q: "Can I connect my fitness devices?", a: "Yes! VitalX AI integrates with Apple Health, Google Fit, Fitbit, Garmin, and many more. Your data syncs automatically for seamless tracking across all your devices." },
  { q: "What makes the nutrition AI special?", a: "Our nutrition AI learns your preferences, allergies, and goals. It generates meal plans with recipes, adjusts macros based on your activity, and even suggests grocery lists. It gets smarter the more you use it." },
  { q: "Is there a free trial for Pro?", a: "Yes! All new users get a 14-day free trial of Pro features. No credit card required. You can downgrade to Free anytime." },
  { q: "Can I cancel anytime?", a: "Of course. There are no long-term contracts. Cancel your subscription anytime from your account settings. You'll keep access until the end of your billing period." },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">VitalX AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className="text-sm text-white/80 hover:text-white px-4 py-2 transition-colors">Log In</Link>
              <Link href="/auth/register" className="text-sm bg-white text-black px-5 py-2 rounded-xl hover:bg-white/90 transition-all font-medium">Get Started</Link>
            </div>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" onClick={() => setMobileMenu(false)} className="block text-white/60 hover:text-white py-2">Features</a>
                <a href="#pricing" onClick={() => setMobileMenu(false)} className="block text-white/60 hover:text-white py-2">Pricing</a>
                <a href="#faq" onClick={() => setMobileMenu(false)} className="block text-white/60 hover:text-white py-2">FAQ</a>
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <Link href="/auth/login" onClick={() => setMobileMenu(false)} className="block text-center py-2 text-white/80">Log In</Link>
                  <Link href="/auth/register" onClick={() => setMobileMenu(false)} className="block text-center py-2 bg-white text-black rounded-xl font-medium">Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative pt-32 pb-20 px-4 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-emerald-400 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI-Powered Health Platform
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                Become the{" "}
                <span className="gradient-text">healthiest version</span>{" "}
                of yourself.
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-white/50 mb-4 max-w-lg">
                Your Personal AI Health Coach
              </motion.p>
              <motion.p variants={fadeUp} className="text-base text-white/40 mb-8 max-w-lg">
                VitalX AI combines advanced artificial intelligence with comprehensive health tracking to deliver personalized nutrition, workout, and wellness plans that evolve with you.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-medium hover:bg-white/90 transition-all shadow-lg shadow-white/10">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#features" className="inline-flex items-center gap-2 glass px-8 py-3.5 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                  <Play className="w-4 h-4" /> Watch Demo
                </a>
              </motion.div>
              <motion.div variants={fadeUp} className="flex items-center gap-6 mt-10 text-sm text-white/40">
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Free forever plan</div>
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> No credit card</div>
                <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Cancel anytime</div>
              </motion.div>
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative glass-strong rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-white/30">Dashboard</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Calories", value: "1,847", sub: "/ 2,200", color: "text-emerald-400" },
                      { label: "Steps", value: "8,432", sub: "/ 10,000", color: "text-cyan-400" },
                      { label: "Water", value: "6", sub: "/ 8 glasses", color: "text-blue-400" },
                    ].map((m) => (
                      <div key={m.label} className="glass rounded-xl p-3">
                        <div className="text-xs text-white/40 mb-1">{m.label}</div>
                        <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                        <div className="text-xs text-white/30">{m.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-white/40">Weekly Progress</span>
                      <span className="text-xs text-emerald-400">+12%</span>
                    </div>
                    <div className="flex items-end gap-1.5 h-20">
                      {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/60 to-emerald-400/80"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {["M","T","W","T","F","S","S"].map((d,i) => (
                        <span key={i} className="text-[10px] text-white/30 flex-1 text-center">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-white/40">Workout</span>
                      </div>
                      <div className="text-sm font-semibold">Upper Body</div>
                      <div className="text-xs text-white/30">45 min • 320 cal</div>
                    </div>
                    <div className="glass rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span className="text-xs text-white/40">Heart Rate</span>
                      </div>
                      <div className="text-sm font-semibold">72 BPM</div>
                      <div className="text-xs text-white/30">Resting • Normal</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <section id="features" className="py-24 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-emerald-400 mb-4">
              <Zap className="w-3 h-3" /> Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to <span className="gradient-text">optimize your health</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Our comprehensive suite of AI-powered tools covers every aspect of your health and fitness journey.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="group glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Coach Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-cyan-400 mb-4">
                <Brain className="w-3 h-3" /> AI Coach
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">Your intelligent health <span className="gradient-text">companion</span></motion.h2>
              <motion.p variants={fadeUp} className="text-white/40 mb-6 leading-relaxed">Our AI coach learns from your data, habits, and goals to provide hyper-personalized recommendations. It adapts in real-time as you progress.</motion.p>
              <motion.ul variants={fadeUp} className="space-y-3">
                {["24/7 personalized guidance", "Learns from your patterns", "Adapts to your schedule", "Evidence-based recommendations"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-emerald-400" /></div>
                    {item}
                  </li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-strong rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium">VitalX AI</div>
                  <div className="text-xs text-white/30">Health Coach</div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { role: "user", text: "I want to lose 10kg in 3 months while building muscle. Is that realistic?" },
                  { role: "ai", text: "Absolutely! Based on your current stats and activity level, here's what I recommend:\n\n• Caloric deficit of 300-400 cal/day\n• High protein intake (1.8g/kg)\n• 4x strength training + 2x cardio\n\nI've generated a personalized plan for you. Shall we review it?" },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-emerald-500/20 text-emerald-50" : "glass text-white/70"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <input placeholder="Ask your AI coach..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50" />
                  <button className="px-4 py-2.5 bg-emerald-500 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"><ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nutrition */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-strong rounded-3xl p-8 order-2 lg:order-1">
              <div className="text-center mb-6">
                <div className="text-xs text-white/40 mb-2">Today&apos;s Macros</div>
                <div className="text-3xl font-bold">1,847 <span className="text-sm text-white/30 font-normal">/ 2,200 cal</span></div>
              </div>
              <div className="flex justify-center gap-8 mb-6">
                {[
                  { label: "Protein", value: 142, target: 165, color: "#10b981" },
                  { label: "Carbs", value: 210, target: 275, color: "#06b6d4" },
                  { label: "Fat", value: 58, target: 73, color: "#8b5cf6" },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <motion.circle
                          cx="32" cy="32" r="28" fill="none" stroke={m.color} strokeWidth="6" strokeLinecap="round"
                          initial={{ strokeDasharray: "0 176" }}
                          whileInView={{ strokeDasharray: `${(m.value / m.target) * 176} 176` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{Math.round((m.value / m.target) * 100)}%</div>
                    </div>
                    <div className="text-xs text-white/40">{m.label}</div>
                    <div className="text-sm font-medium">{m.value}g</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {["Grilled chicken salad - 380 cal", "Protein shake - 280 cal", "Brown rice & salmon - 520 cal"].map((meal) => (
                  <div key={meal} className="flex items-center gap-3 glass rounded-xl px-4 py-2.5 text-sm text-white/60">
                    <Apple className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {meal}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="order-1 lg:order-2">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-green-400 mb-4">
                <Apple className="w-3 h-3" /> Nutrition
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">Smart nutrition that <span className="gradient-text">adapts to you</span></motion.h2>
              <motion.p variants={fadeUp} className="text-white/40 mb-6 leading-relaxed">Our AI analyzes your body composition, activity level, and preferences to create meal plans you&apos;ll actually enjoy. Track macros effortlessly with photo recognition.</motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {["Photo Recognition", "Macro Tracking", "Meal Planning", "Recipe Database"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full glass text-xs text-white/50">{tag}</span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workout */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-blue-400 mb-4"><Dumbbell className="w-3 h-3" /> Workouts</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Workouts tailored to <span className="gradient-text">your goals</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">From strength training to yoga, our AI creates and adapts workout plans based on your progress and available equipment.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Dumbbell, name: "Strength", sessions: "120+ sessions", color: "from-blue-500 to-indigo-500" },
              { icon: Activity, name: "Cardio", sessions: "80+ sessions", color: "from-rose-500 to-pink-500" },
              { icon: Target, name: "HIIT", sessions: "60+ sessions", color: "from-orange-500 to-amber-500" },
              { icon: Heart, name: "Yoga", sessions: "90+ sessions", color: "from-purple-500 to-violet-500" },
            ].map((cat) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{cat.name}</h3>
                <p className="text-sm text-white/30">{cat.sessions}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-purple-400 mb-4"><Trophy className="w-3 h-3" /> Sports</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Analytics for <span className="gradient-text">every sport</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Track performance across 50+ sports with detailed metrics, training plans, and competition analysis.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Running", metric: "VO2 Max: 48", icon: "🏃" },
              { name: "Cycling", metric: "FTP: 245W", icon: "🚴" },
              { name: "Swimming", metric: "1:42/100m", icon: "🏊" },
              { name: "Basketball", metric: "Vertical: 28\"", icon: "🏀" },
              { name: "Tennis", metric: "Serve: 110mph", icon: "🎾" },
              { name: "Soccer", metric: "Distance: 11km", icon: "⚽" },
            ].map((sport) => (
              <motion.div key={sport.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.08] transition-all cursor-pointer">
                <div className="text-3xl">{sport.icon}</div>
                <div>
                  <h3 className="font-semibold">{sport.name}</h3>
                  <p className="text-sm text-white/40">{sport.metric}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 ml-auto" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="py-24 px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-amber-400 mb-4"><TrendingUp className="w-3 h-3" /> Progress</motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">Visualize your <span className="gradient-text">transformation</span></motion.h2>
              <motion.p variants={fadeUp} className="text-white/40 mb-6 leading-relaxed">Beautiful charts and insights that make your health data actionable. See trends, celebrate milestones, and stay motivated.</motion.p>
              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                {[
                  { label: "Weight Lost", value: "8.5 kg", trend: "+2.1 this month", icon: TrendingUp, color: "text-emerald-400" },
                  { label: "Workouts", value: "47", trend: "12 this month", icon: Dumbbell, color: "text-blue-400" },
                  { label: "Streak", value: "23 days", trend: "Personal best!", icon: Flame, color: "text-orange-400" },
                  { label: "Sleep Score", value: "87/100", trend: "+5 this week", icon: Clock, color: "text-purple-400" },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-xl p-4">
                    <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-white/30 mt-1">{s.trend}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-strong rounded-3xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-1">Overall Progress</h3>
                <p className="text-sm text-white/40">Last 30 days</p>
              </div>
              <div className="flex justify-center gap-6 mb-6">
                {[{ label: "Body", pct: 72, color: "#10b981" }, { label: "Nutrition", pct: 85, color: "#06b6d4" }, { label: "Fitness", pct: 68, color: "#8b5cf6" }].map((r) => (
                  <div key={r.label} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <motion.circle cx="40" cy="40" r="35" fill="none" stroke={r.color} strokeWidth="6" strokeLinecap="round"
                          initial={{ strokeDasharray: "0 220" }}
                          whileInView={{ strokeDasharray: `${(r.pct / 100) * 220} 220` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.3 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{r.pct}%</div>
                    </div>
                    <div className="text-xs text-white/40">{r.label}</div>
                  </div>
                ))}
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Weekly Streak</span>
                  <span className="text-sm text-emerald-400 font-medium">On fire!</span>
                </div>
                <div className="flex gap-1.5">
                  {["M","T","W","T","F","S","S"].map((d, i) => (
                    <div key={i} className={`flex-1 h-8 rounded-lg flex items-center justify-center text-[10px] ${i < 5 ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/20"}`}>
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-rose-400 mb-4"><Users className="w-3 h-3" /> Community</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join the <span className="gradient-text">health movement</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Connect with millions of health enthusiasts, share achievements, and stay motivated together.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-strong rounded-3xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Leaderboard</h3>
            <div className="space-y-3">
              {[
                { rank: 1, name: "Alex Rivera", points: "12,450", avatar: "AR", badge: "🥇" },
                { rank: 2, name: "Jordan Kim", points: "11,280", avatar: "JK", badge: "🥈" },
                { rank: 3, name: "Sam Chen", points: "10,920", avatar: "SC", badge: "🥉" },
                { rank: 4, name: "Priya Nair", points: "9,840", avatar: "PN", badge: "" },
                { rank: 5, name: "Morgan Lee", points: "9,120", avatar: "ML", badge: "" },
              ].map((u) => (
                <div key={u.rank} className="flex items-center gap-4 glass rounded-xl px-4 py-3">
                  <span className="text-sm font-medium w-6 text-center">{u.badge || `#${u.rank}`}</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center text-xs font-semibold text-emerald-300">{u.avatar}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{u.name}</div>
                  </div>
                  <div className="text-sm text-emerald-400 font-semibold">{u.points} pts</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-emerald-400 mb-4"><Star className="w-3 h-3" /> Testimonials</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What users are <span className="gradient-text">saying</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">See what our users have to say about their VitalX AI experience.</p>
            <p className="text-xs text-white/25 mt-3">Illustrative examples — real user stories coming soon</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-6">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center text-xs font-semibold text-emerald-300">{t.avatar}</div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-white/30">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-emerald-400 mb-4"><Zap className="w-3 h-3" /> Pricing</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent <span className="gradient-text">pricing</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`relative rounded-2xl p-6 ${plan.popular ? "bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-lg shadow-emerald-500/10" : "glass"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-xs font-medium text-white">Most Popular</div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-white/40">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-white/40 text-sm">/{plan.period}</span>
                </div>
                <Link href="/auth/register" className={`block w-full text-center py-3 rounded-xl font-medium transition-all mb-6 ${plan.popular ? "bg-emerald-500 text-white hover:bg-emerald-600" : "glass text-white hover:bg-white/10"}`}>
                  {plan.cta}
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-emerald-400 mb-4"><MessageCircle className="w-3 h-3" /> FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently asked <span className="gradient-text">questions</span></h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="text-sm font-medium pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-4 text-sm text-white/40 leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto text-center glass-strong rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to transform your health?</h2>
            <p className="text-white/40 mb-8 max-w-xl mx-auto">Join people already on their journey to a healthier life. Start your transformation today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-medium hover:bg-white/90 transition-all shadow-lg shadow-white/10">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/auth/login" className="inline-flex items-center gap-2 glass px-8 py-3.5 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">
                Log In
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
                <span className="text-lg font-bold">VitalX AI</span>
              </div>
              <p className="text-sm text-white/30 leading-relaxed">Your personal AI health coach. Optimize nutrition, fitness, and wellness with the power of artificial intelligence.</p>
            </div>
            {[
              { title: "Product", links: [{ text: "Features", href: "#features" }, { text: "Pricing", href: "#pricing" }, { text: "Integrations", href: "#features" }, { text: "API", href: "#features" }] },
              { title: "Company", links: [{ text: "About", href: "#features" }, { text: "Blog", href: "#" }, { text: "Careers", href: "#" }, { text: "Press", href: "#" }] },
              { title: "Support", links: [{ text: "Help Center", href: "#" }, { text: "Contact", href: "#" }, { text: "Privacy", href: "/privacy" }, { text: "Terms", href: "/terms" }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.text}>
                      {link.href.startsWith("/") ? (
                        <Link href={link.href} className="text-sm text-white/30 hover:text-white/60 transition-colors">{link.text}</Link>
                      ) : (
                        <a href={link.href} className="text-sm text-white/30 hover:text-white/60 transition-colors">{link.text}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20">&copy; 2026 VitalX AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {["Twitter", "GitHub", "Discord"].map((s) => (
                <a key={s} href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
