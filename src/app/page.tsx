'use client'

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  Brain,
  Apple,
  Dumbbell,
  Trophy,
  Heart,
  Activity,
  ArrowRight,
  Play,
  Zap,
  Check,
  ChevronDown,
  ChevronRight,
  Star,
  Menu,
  X,
  Sparkles,
  Target,
  Flame,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Smartphone,
  BarChart3,
  Moon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useRef } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/60 backdrop-blur-2xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              VitalX AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/10 bg-gray-950/95 backdrop-blur-xl"
        >
          <div className="px-4 py-4 space-y-3">
            {['Features', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-sm text-gray-400 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full">Log In</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[128px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="premium" className="mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Advanced AI
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            <span className="text-white">Become the healthiest</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              version of yourself.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Your Personal AI Health Coach
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/register">
              <Button size="lg" className="text-base px-8">
                Start Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-base px-8">
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl shadow-purple-500/10">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-gray-500">VitalX AI Dashboard</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Calories', value: '2,150', sub: '/ 2,800', color: 'from-purple-500 to-blue-500' },
                { label: 'Protein', value: '142g', sub: '/ 160g', color: 'from-green-500 to-emerald-500' },
                { label: 'Workouts', value: '5/5', sub: 'completed', color: 'from-orange-500 to-red-500' },
                { label: 'Sleep', value: '7.5h', sub: 'quality 85%', color: 'from-blue-500 to-indigo-500' },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={cn('h-full rounded-full bg-gradient-to-r', stat.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${60 + i * 10}%` }}
                      transition={{ delay: 1.5 + i * 0.2, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white mb-3">Weekly Activity</p>
                <div className="flex items-end gap-2 h-32">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-purple-600 to-blue-600"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 1.5 + i * 0.1, duration: 0.6 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <span key={d} className="text-[10px] text-gray-500 flex-1 text-center">{d}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white mb-3">AI Insights</p>
                <div className="space-y-3">
                  {[
                    { icon: TrendingUp, text: 'Strength up 12% this week', color: 'text-green-400' },
                    { icon: Target, text: 'Hit protein goal 5/7 days', color: 'text-blue-400' },
                    { icon: Flame, text: '15-day streak active!', color: 'text-orange-400' },
                  ].map((insight, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <insight.icon className={cn('h-4 w-4 shrink-0', insight.color)} />
                      <span className="text-xs text-gray-300">{insight.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    { icon: Brain, title: 'AI Coach', description: 'Personalized coaching powered by advanced AI that adapts to your goals and progress.' },
    { icon: Apple, title: 'Smart Nutrition', description: 'AI-powered meal tracking, calorie counting, and personalized nutrition plans.' },
    { icon: Dumbbell, title: 'Workout Tracking', description: 'Track every rep, set, and workout with intelligent progressive overload suggestions.' },
    { icon: Trophy, title: 'Sports Analytics', description: 'Track performance across cricket, football, running, cycling, swimming and more.' },
    { icon: Heart, title: 'Health Monitoring', description: 'Monitor heart rate, blood pressure, sleep, and vital health metrics in real-time.' },
    { icon: Activity, title: 'Body Analytics', description: 'Track body measurements, weight trends, body fat percentage, and composition changes.' },
  ]

  return (
    <section id="features" ref={ref} className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              crush your goals
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            A complete AI-powered health operating system designed to transform the way you train, eat, and live.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 group-hover:from-purple-600/30 group-hover:to-blue-600/30 transition-all">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function AiCoachSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    'Daily personalized coaching',
    'Smart workout suggestions',
    'Recovery & rest optimization',
    'Mental health guidance',
  ]

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <Badge variant="info" className="mb-4">AI Powered</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Your AI Fitness{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Mentor
              </span>
            </h2>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Experience personalized fitness coaching powered by artificial intelligence. Your AI coach learns from your data, adapts to your lifestyle, and evolves with your goals.
            </p>
            <ul className="mt-8 space-y-4">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30">
                    <Check className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-300">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/auth/register">
                <Button>
                  Try AI Coach Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl shadow-purple-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">VitalX AI Coach</p>
                  <p className="text-xs text-green-400">● Online</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-purple-600/20 border border-purple-500/20 px-4 py-3">
                    <p className="text-sm text-white">What should I eat post-workout?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 border border-white/10 px-4 py-3">
                    <p className="text-sm text-gray-300">
                      For optimal recovery, consume <span className="text-purple-400 font-medium">30-40g protein</span> with <span className="text-blue-400 font-medium">40-60g carbs</span> within 30-60 minutes post-workout. Try a whey protein shake with a banana!
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-purple-600/20 border border-purple-500/20 px-4 py-3">
                    <p className="text-sm text-white">How is my progress this week?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 border border-white/10 px-4 py-3">
                    <p className="text-sm text-gray-300">
                      Great week! <span className="text-green-400 font-medium">6 workouts</span> completed, volume up <span className="text-green-400 font-medium">8%</span>. New bench PR at 95kg! 💪
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="text"
                  placeholder="Ask your AI coach..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function NutritionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-[400px] w-[400px] rounded-full bg-green-600/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <Badge variant="success" className="mb-4">Nutrition</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Fuel Your Body{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Right
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            AI-powered nutrition tracking with smart meal scanning, macro analysis, and personalized meal plans.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={fadeUp} className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <p className="text-sm font-medium text-white mb-6">Today&apos;s Macros</p>
            <div className="flex items-center justify-around">
              {[
                { label: 'Calories', value: 2150, max: 2800, color: '#a855f7', unit: 'kcal' },
                { label: 'Protein', value: 142, max: 160, color: '#22c55e', unit: 'g' },
                { label: 'Carbs', value: 245, max: 320, color: '#3b82f6', unit: 'g' },
                { label: 'Fat', value: 68, max: 85, color: '#f59e0b', unit: 'g' },
              ].map((macro, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="relative h-20 w-20">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                      <motion.circle
                        cx="40" cy="40" r="34" fill="none" stroke={macro.color}
                        strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 34}
                        initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                        animate={isInView ? { strokeDashoffset: 2 * Math.PI * 34 * (1 - macro.value / macro.max) } : {}}
                        transition={{ delay: 0.5 + i * 0.2, duration: 1.2 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{Math.round(macro.value / macro.max * 100)}%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">{macro.label}</p>
                  <p className="text-sm font-semibold text-white">{macro.value}<span className="text-gray-500 text-xs">/{macro.max}{macro.unit}</span></p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <p className="text-sm font-medium text-white mb-4">AI Meal Scanner</p>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-white/10 flex items-center justify-center">
                <Apple className="h-12 w-12 text-green-400" />
              </div>
              <p className="mt-4 text-sm text-gray-400 text-center">Snap a photo of your meal and let AI analyze the nutrition</p>
              <Button variant="secondary" size="sm" className="mt-4">
                <Sparkles className="h-4 w-4" />
                Scan Meal
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function WorkoutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const categories = [
    { icon: Dumbbell, name: 'Strength', count: '120+ exercises', color: 'from-purple-600/20 to-purple-600/10' },
    { icon: Flame, name: 'HIIT', count: '50+ workouts', color: 'from-orange-600/20 to-orange-600/10' },
    { icon: Activity, name: 'Yoga', count: '80+ sessions', color: 'from-blue-600/20 to-blue-600/10' },
    { icon: Heart, name: 'Cardio', count: '60+ routines', color: 'from-red-600/20 to-red-600/10' },
  ]

  return (
    <section ref={ref} className="py-24 relative">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <Badge variant="warning" className="mb-4">Workouts</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Train Smarter,{' '}
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Not Harder
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Intelligent workout tracking with progressive overload suggestions, form tips, and performance analytics.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={cn(
                  'rounded-2xl border border-white/10 bg-gradient-to-br p-6 text-center cursor-pointer transition-all hover:border-white/20',
                  cat.color
                )}
              >
                <Icon className="h-8 w-8 text-white mx-auto" />
                <p className="mt-3 text-sm font-semibold text-white">{cat.name}</p>
                <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-white">Progressive Overload Tracker</p>
            <Badge variant="success">+8% this week</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { exercise: 'Bench Press', prev: '80kg', current: '85kg', change: '+6.3%' },
              { exercise: 'Squat', prev: '100kg', current: '110kg', change: '+10%' },
              { exercise: 'Deadlift', prev: '120kg', current: '130kg', change: '+8.3%' },
              { exercise: 'OHP', prev: '45kg', current: '50kg', change: '+11.1%' },
            ].map((ex, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-gray-500">{ex.exercise}</p>
                <p className="text-lg font-bold text-white mt-1">{ex.current}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 line-through">{ex.prev}</span>
                  <span className="text-xs text-green-400">{ex.change}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SportsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const sports = [
    { name: 'Cricket', icon: '🏏', metric: '45 runs, 2 wickets' },
    { name: 'Football', icon: '⚽', metric: '1 goal, 2 assists' },
    { name: 'Running', icon: '🏃', metric: '5.2km in 33:48' },
    { name: 'Cycling', icon: '🚴', metric: '18km @ 24km/h' },
    { name: 'Swimming', icon: '🏊', metric: '30 laps freestyle' },
  ]

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <Badge variant="info" className="mb-4">Sports</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Track Every{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Game
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Comprehensive sports tracking across multiple disciplines with detailed performance analytics.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {sports.map((sport, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.03 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 text-center cursor-pointer transition-all hover:bg-white/10 hover:border-white/20"
            >
              <span className="text-3xl">{sport.icon}</span>
              <p className="mt-3 text-sm font-semibold text-white">{sport.name}</p>
              <p className="text-xs text-gray-400 mt-1">{sport.metric}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
          <p className="text-sm font-medium text-white mb-4">Performance Metrics</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Distance', value: '32.7 km', icon: TrendingUp },
              { label: 'Calories Burned', value: '2,530', icon: Flame },
              { label: 'Avg Heart Rate', value: '148 bpm', icon: Heart },
              { label: 'Active Time', value: '5h 25m', icon: Clock },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <m.icon className="h-5 w-5 text-purple-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{m.label}</p>
                  <p className="text-sm font-bold text-white">{m.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProgressSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 relative">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <Badge variant="success" className="mb-4">Progress</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Watch Yourself{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Transform
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Visualize your progress with detailed charts, body measurements, and milestone tracking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Weight', start: '82 kg', current: '78 kg', target: '75 kg', progress: 64, color: '#a855f7' },
            { label: 'Calories Burned', start: '2,100/week', current: '3,350/week', target: '4,000/week', progress: 72, color: '#3b82f6' },
            { label: 'Workouts', start: '2/week', current: '6/week', target: '6/week', progress: 100, color: '#22c55e' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <span className="text-xs font-bold text-green-400">{item.progress === 100 ? '✓ Goal Met' : `${item.progress}%`}</span>
              </div>
              <div className="relative h-32 flex items-end justify-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none" stroke={item.color}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={isInView ? { strokeDashoffset: 2 * Math.PI * 50 * (1 - item.progress / 100) } : {}}
                    transition={{ delay: 0.6 + i * 0.2, duration: 1.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{item.progress}%</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <div>
                  <p className="text-gray-500">Start</p>
                  <p className="text-gray-300 font-medium">{item.start}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Current</p>
                  <p className="text-white font-medium">{item.current}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CommunitySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const leaderboard = [
    { rank: 1, name: 'FitQueen99', xp: '6,200', level: 15 },
    { rank: 2, name: 'GymBro_Raj', xp: '5,800', level: 14 },
    { rank: 3, name: 'RahulSharma', xp: '4,500', level: 12 },
  ]

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <Badge variant="default" className="mb-4">Community</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Join the{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Movement
              </span>
            </h2>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Connect with like-minded fitness enthusiasts. Compete on leaderboards, share achievements, and stay motivated together.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Compete on global leaderboards',
                'Earn XP and unlock achievements',
                'Join community challenges',
                'Share your fitness journey',
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 border border-purple-500/30">
                    <Check className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-300">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <p className="text-sm font-medium text-white">Leaderboard</p>
              </div>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                      entry.rank === 1 && 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
                      entry.rank === 2 && 'bg-gray-300/20 text-gray-300 border border-gray-300/30',
                      entry.rank === 3 && 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
                    )}>
                      {entry.rank}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{entry.name}</p>
                      <p className="text-xs text-gray-500">Level {entry.level}</p>
                    </div>
                    <span className="text-sm font-semibold text-purple-400">{entry.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const testimonials = [
    { name: 'Priya M.', role: 'Fitness Enthusiast', quote: 'VitalX AI completely changed how I approach fitness. The AI coach feels like having a personal trainer 24/7.', rating: 5 },
    { name: 'Arjun K.', role: 'Cricket Player', quote: 'The sports analytics feature is incredible. I can track my cricket performance and improve my game with data-driven insights.', rating: 5 },
    { name: 'Sneha R.', role: 'Yoga Practitioner', quote: 'The nutrition tracking is seamless. AI meal scanning saves me so much time. Lost 8kg in 3 months!', rating: 5 },
  ]

  return (
    <section ref={ref} className="py-24 relative">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Loved by{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              thousands
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">&quot;{t.quote}&quot;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: ['Basic workout tracking', 'Manual nutrition logging', 'Health metrics dashboard', 'Community access'],
      popular: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For serious fitness enthusiasts',
      features: ['AI Coach (unlimited)', 'Smart meal scanning', 'Progressive overload AI', 'Sports analytics', 'Advanced reports', 'Priority support'],
      popular: true,
    },
    {
      name: 'Elite',
      price: '$39',
      period: '/month',
      description: 'For athletes & professionals',
      features: ['Everything in Pro', 'Custom AI training plans', 'Body composition analysis', 'Sleep optimization AI', 'Team/club features', 'API access', 'Dedicated support'],
      popular: false,
    },
  ]

  return (
    <section id="pricing" ref={ref} className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Start free and upgrade as you grow. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className={cn(
                'relative rounded-2xl border backdrop-blur-xl p-8 transition-all',
                plan.popular
                  ? 'border-purple-500/50 bg-gradient-to-b from-purple-600/10 to-blue-600/10 shadow-2xl shadow-purple-500/20'
                  : 'border-white/10 bg-white/5'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="premium">Most Popular</Badge>
                </div>
              )}
              <p className="text-sm font-medium text-gray-400">{plan.name}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">{plan.description}</p>
              <div className="mt-8 space-y-3">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-400 shrink-0" />
                    <span className="text-sm text-gray-300">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/auth/register">
                  <Button
                    variant={plan.popular ? 'default' : 'secondary'}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FaqSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { q: 'What is VitalX AI?', a: 'VitalX AI is a premium AI-powered health operating system that combines workout tracking, nutrition management, health monitoring, and sports analytics into one intelligent platform.' },
    { q: 'How does the AI Coach work?', a: 'Our AI Coach analyzes your workout data, nutrition, sleep, and body metrics to provide personalized coaching recommendations. It learns from your progress and adapts its suggestions over time.' },
    { q: 'Is there a free plan available?', a: 'Yes! Our Free plan includes basic workout tracking, manual nutrition logging, health metrics dashboard, and community access. No credit card required.' },
    { q: 'Can I track multiple sports?', a: 'Absolutely! VitalX AI supports cricket, football, running, cycling, swimming, and many more sports. Each sport has tailored metrics and analytics.' },
    { q: 'How accurate is the AI meal scanner?', a: 'Our AI meal scanner uses advanced computer vision to identify food items and estimate nutritional content with approximately 90-95% accuracy. You can always fine-tune the results.' },
    { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your Pro or Elite subscription at any time from your account settings. You\'ll continue to have access until the end of your billing period.' },
  ]

  return (
    <section ref={ref} className="py-24 relative">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown className={cn(
                  'h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300',
                  openIndex === i && 'rotate-180'
                )} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white">
            Ready to transform{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              your health?
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of people who are already using VitalX AI to become the healthiest version of themselves.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="text-base px-10">
                Start Free Today
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">No credit card required. Free forever plan available.</p>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  const links = {
    Product: ['Features', 'Pricing', 'AI Coach', 'Nutrition', 'Workouts', 'Analytics'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Resources: ['Documentation', 'Help Center', 'Community', 'Changelog'],
    Legal: ['Privacy', 'Terms', 'Security'],
  }

  return (
    <footer className="border-t border-white/10 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                VitalX AI
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-xs leading-relaxed">
              Your personal AI health operating system. Train smarter, eat better, live healthier.
            </p>
            <div className="mt-6 flex gap-3">
              {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <span className="text-xs font-medium">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-white mb-4">{title}</p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-gray-500">&copy; 2026 VitalX AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AiCoachSection />
      <NutritionSection />
      <WorkoutSection />
      <SportsSection />
      <ProgressSection />
      <CommunitySection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
