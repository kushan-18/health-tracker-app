'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  User,
  Ruler,
  Target,
  Activity,
  Apple,
  Dumbbell,
  Heart,
  Moon,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface StepConfig {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const steps: StepConfig[] = [
  { icon: User, title: 'Basic Info', description: 'Tell us about yourself' },
  { icon: Ruler, title: 'Body Info', description: 'Your body measurements' },
  { icon: Target, title: 'Goals', description: 'What do you want to achieve?' },
  { icon: Activity, title: 'Activity Level', description: 'How active are you?' },
  { icon: Apple, title: 'Diet Preference', description: 'What do you eat?' },
  { icon: Dumbbell, title: 'Experience', description: 'Your workout background' },
  { icon: Heart, title: 'Medical', description: 'Any conditions to note?' },
  { icon: Moon, title: 'Sleep', description: 'Your sleep schedule' },
]

const goals = ['Lose Weight', 'Gain Muscle', 'Maintain Weight', 'Improve Fitness', 'Athletic Performance']
const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise, desk job' },
  { value: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { value: 'active', label: 'Active', desc: 'Hard exercise 6-7 days/week' },
  { value: 'very_active', label: 'Very Active', desc: 'Intense exercise, physical job' },
]
const diets = ['None', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean']
const experiences = ['Beginner', 'Intermediate', 'Advanced']

export default function ProfileSetupPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    targetWeight: '',
    bodyFat: '',
    goal: '',
    activityLevel: '',
    diet: '',
    experience: '',
    medicalConditions: '',
    bedtime: '',
    wakeTime: '',
  })

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const progress = ((step + 1) / steps.length) * 100

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  }

  const [direction, setDirection] = useState(0)

  const goNext = () => {
    if (step < steps.length - 1) {
      setDirection(1)
      setStep(step + 1)
    }
  }

  const goPrev = () => {
    if (step > 0) {
      setDirection(-1)
      setStep(step - 1)
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setLoading(false)
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="border-b border-white/10 bg-gray-950/60 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                VitalX AI
              </span>
            </Link>
            <span className="text-sm text-gray-500">
              Step {step + 1} of {steps.length}
            </span>
          </div>
        </header>

        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{Math.round(progress)}% complete</span>
            <span className="text-xs text-gray-500">{steps[step].title}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10">
                      {(() => {
                        const StepIcon = steps[step].icon
                        return <StepIcon className="h-6 w-6 text-purple-400" />
                      })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{steps[step].title}</h2>
                      <p className="text-sm text-gray-400">{steps[step].description}</p>
                    </div>
                  </div>

                  {step === 0 && (
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                      />
                      <Input
                        label="Age"
                        type="number"
                        placeholder="Your age"
                        value={form.age}
                        onChange={(e) => update('age', e.target.value)}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Gender</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['Male', 'Female', 'Other'].map((g) => (
                            <button
                              key={g}
                              onClick={() => update('gender', g.toLowerCase())}
                              className={cn(
                                'rounded-xl border px-4 py-3 text-sm font-medium transition-all',
                                form.gender === g.toLowerCase()
                                  ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                                  : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                              )}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <Input
                        label="Height (cm)"
                        type="number"
                        placeholder="e.g. 175"
                        value={form.height}
                        onChange={(e) => update('height', e.target.value)}
                      />
                      <Input
                        label="Current Weight (kg)"
                        type="number"
                        placeholder="e.g. 78"
                        value={form.weight}
                        onChange={(e) => update('weight', e.target.value)}
                      />
                      <Input
                        label="Target Weight (kg)"
                        type="number"
                        placeholder="e.g. 75"
                        value={form.targetWeight}
                        onChange={(e) => update('targetWeight', e.target.value)}
                      />
                      <Input
                        label="Body Fat % (optional)"
                        type="number"
                        placeholder="e.g. 18.5"
                        value={form.bodyFat}
                        onChange={(e) => update('bodyFat', e.target.value)}
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-2 gap-3">
                      {goals.map((g) => (
                        <button
                          key={g}
                          onClick={() => update('goal', g)}
                          className={cn(
                            'rounded-xl border px-4 py-4 text-sm font-medium transition-all text-left',
                            form.goal === g
                              ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3">
                      {activityLevels.map((level) => (
                        <button
                          key={level.value}
                          onClick={() => update('activityLevel', level.value)}
                          className={cn(
                            'w-full rounded-xl border px-4 py-4 text-left transition-all',
                            form.activityLevel === level.value
                              ? 'border-purple-500/50 bg-purple-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                          )}
                        >
                          <p className={cn(
                            'text-sm font-medium',
                            form.activityLevel === level.value ? 'text-purple-400' : 'text-white'
                          )}>
                            {level.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{level.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="grid grid-cols-2 gap-3">
                      {diets.map((d) => (
                        <button
                          key={d}
                          onClick={() => update('diet', d)}
                          className={cn(
                            'rounded-xl border px-4 py-4 text-sm font-medium transition-all',
                            form.diet === d
                              ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10'
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-3">
                      {experiences.map((exp) => (
                        <button
                          key={exp}
                          onClick={() => update('experience', exp)}
                          className={cn(
                            'w-full rounded-xl border px-4 py-4 text-left transition-all',
                            form.experience === exp
                              ? 'border-purple-500/50 bg-purple-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                          )}
                        >
                          <p className={cn(
                            'text-sm font-medium',
                            form.experience === exp ? 'text-purple-400' : 'text-white'
                          )}>
                            {exp}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {exp === 'Beginner' && 'New to working out or returning after a long break'}
                            {exp === 'Intermediate' && '6+ months of consistent training'}
                            {exp === 'Advanced' && '2+ years of serious training experience'}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 6 && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400">
                        List any medical conditions, injuries, or allergies we should know about. This is optional but helps us personalize your experience.
                      </p>
                      <textarea
                        placeholder="e.g. Lower back pain, lactose intolerant..."
                        value={form.medicalConditions}
                        onChange={(e) => update('medicalConditions', e.target.value)}
                        rows={5}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:border-white/20 resize-none"
                      />
                      <p className="text-xs text-gray-500">Leave blank if none</p>
                    </div>
                  )}

                  {step === 7 && (
                    <div className="space-y-4">
                      <Input
                        label="Usual Bedtime"
                        type="time"
                        value={form.bedtime}
                        onChange={(e) => update('bedtime', e.target.value)}
                      />
                      <Input
                        label="Usual Wake Time"
                        type="time"
                        value={form.wakeTime}
                        onChange={(e) => update('wakeTime', e.target.value)}
                      />
                      {form.bedtime && form.wakeTime && (
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <p className="text-sm text-gray-400">
                            Estimated sleep: <span className="text-white font-medium">
                              {(() => {
                                const [bh, bm] = form.bedtime.split(':').map(Number)
                                const [wh, wm] = form.wakeTime.split(':').map(Number)
                                let hours = wh - bh + (wm - bm) / 60
                                if (hours < 0) hours += 24
                                return `${Math.floor(hours)}h ${Math.abs(Math.round((hours % 1) * 60))}m`
                              })()}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={goPrev}
                disabled={step === 0}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {step < steps.length - 1 ? (
                <Button onClick={goNext}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleFinish} loading={loading}>
                  Complete Setup
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-6">
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i <= step ? 'w-8 bg-gradient-to-r from-purple-500 to-blue-500' : 'w-1.5 bg-white/10'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
