'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login, socialLogin } = useStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    login({
      id: 'user_' + Date.now(),
      name: data.email.split('@')[0],
      email: data.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      age: 25,
      gender: 'male',
      height: 175,
      weight: 75,
      goal: 'general_fitness',
      activityLevel: 'moderate',
      medicalConditions: [],
      dietPreference: 'none',
      workoutExperience: 'intermediate',
      sportsPlayed: [],
      sleepSchedule: '10:30 PM - 7:00 AM',
      waterIntake: 8,
      targetWeight: 72,
      targetCalories: 2200,
      createdAt: new Date().toISOString(),
    })
    setLoading(false)
    router.push('/dashboard')
  }

  const handleSocialLogin = async (provider: string) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    socialLogin(provider)
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900/40 via-gray-950 to-blue-900/40 items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg px-8"
        >
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              VitalX AI
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Welcome back to your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              health journey
            </span>
          </h1>
          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Track workouts, optimize nutrition, and achieve your fitness goals with AI-powered coaching.
          </p>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center">
                <span className="text-lg">💪</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">AI-Powered Coaching</p>
                <p className="text-xs text-gray-400">Personalized recommendations based on your data</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-white/10 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Advanced Analytics</p>
                <p className="text-xs text-gray-400">Deep insights into your health metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-white/10 flex items-center justify-center">
                <span className="text-lg">🏆</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Gamified Experience</p>
                <p className="text-xs text-gray-400">Earn XP, level up, and compete with friends</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 sm:px-8 py-12 bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                VitalX AI
              </span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-white">Log in to your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>

          <div className="mt-8 space-y-4">
            <Button variant="secondary" className="w-full h-12" onClick={() => handleSocialLogin('google')} loading={loading} type="button">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            <Button variant="secondary" className="w-full h-12" onClick={() => handleSocialLogin('apple')} loading={loading} type="button">
              <svg className="h-5 w-5 mr-2" fill="white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </Button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-950 px-3 text-gray-500">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/50"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12" loading={loading}>
              Log In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
