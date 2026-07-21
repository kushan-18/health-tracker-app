'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import {
  Heart, Footprints, Droplets, Flame, Moon, Brain, Zap, Smile,
  Activity, TrendingUp, Target, Timer, Utensils, Dumbbell, MessageSquare,
  FileText, Plus, ArrowUpRight, ChevronRight, Clock, Sun, CloudSun,
  Cloud, MoonIcon, Stethoscope, TrendingDown, Award, Sparkles,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard, InteractiveCard, GradientCard } from '@/components/ui/card'
import { Progress, CircularProgress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useStore } from '@/lib/store'
import { cn, formatDate, calculateBMI, getBMICategory } from '@/lib/utils'
import { format, subDays } from 'date-fns'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

function useCountUp(end: number, duration = 1500, delay = 300) {
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      let startTime: number | null = null
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, delay)
    return () => clearTimeout(timer)
  }, [end, duration, delay])
  return count
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', icon: <Sun className="w-6 h-6 text-amber-400" /> }
  if (hour < 17) return { text: 'Good afternoon', icon: <CloudSun className="w-6 h-6 text-orange-400" /> }
  return { text: 'Good evening', icon: <MoonIcon className="w-6 h-6 text-indigo-400" /> }
}

const CHART_COLORS = {
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  cyan: '#06b6d4',
  indigo: '#6366f1',
}

const chartTooltipStyle = {
  contentStyle: {
    background: 'rgba(15, 15, 25, 0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: '12px',
  },
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/5'

function Row1Greeting() {
  const user = useStore((s) => s.user)
  const greeting = getGreeting()
  const today = new Date()
  const healthScore = useCountUp(87, 1800, 500)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
        <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent pointer-events-none" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{greeting.icon}</div>
              <div>
                <CardTitle className="text-2xl lg:text-3xl">
                  {greeting.text}, {user?.name.split(' ')[0]}!
                </CardTitle>
                <p className="text-gray-400 text-sm mt-1">{format(today, 'EEEE, MMMM d, yyyy')}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success">On Track</Badge>
              <span className="text-xs text-gray-500">You&apos;re doing great today</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
        <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-teal-600/5 to-transparent pointer-events-none" />
          <CardContent className="pt-6 relative flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <CircularProgress value={87} size={120} strokeWidth={8} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{healthScore}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Score</span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">AI Health Score</h3>
              <p className="text-gray-400 text-sm mt-1">Your overall health is excellent</p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 text-xs font-medium">+3 from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function Row1Stats() {
  const calories = useCountUp(1847, 1200, 600)
  const steps = useCountUp(8432, 1400, 700)
  const water = useCountUp(6, 800, 800)
  const workout = useCountUp(45, 1000, 900)

  const stats = [
    { label: 'Calories Today', value: `${calories.toLocaleString()}`, sub: '/ 2,200', icon: <Flame className="w-5 h-5" />, progress: 1847, max: 2200, color: 'text-orange-400', barColor: 'bg-orange-500' },
    { label: 'Steps', value: steps.toLocaleString(), sub: '/ 10,000', icon: <Footprints className="w-5 h-5" />, progress: 8432, max: 10000, color: 'text-blue-400', barColor: 'bg-blue-500' },
    { label: 'Water', value: `${water}`, sub: '/ 8 glasses', icon: <Droplets className="w-5 h-5" />, progress: 6, max: 8, color: 'text-cyan-400', barColor: 'bg-cyan-500' },
    { label: 'Workout', value: `${workout}`, sub: ' min', icon: <Dumbbell className="w-5 h-5" />, progress: 45, max: 60, color: 'text-purple-400', barColor: 'bg-purple-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} custom={i + 2} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER, 'relative overflow-hidden')}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.sub}</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-white/5">
                <motion.div
                  className={cn('h-full rounded-full', stat.barColor)}
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.progress / stat.max) * 100}%` }}
                  transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

function Row2Nutrition() {
  const totalCalories = 1847
  const targetCalories = 2200
  const remaining = targetCalories - totalCalories

  const macros = [
    { name: 'Protein', current: 128, target: 160, color: 'bg-purple-500', textColor: 'text-purple-400' },
    { name: 'Carbs', current: 220, target: 280, color: 'bg-blue-500', textColor: 'text-blue-400' },
    { name: 'Fat', current: 65, target: 80, color: 'bg-amber-500', textColor: 'text-amber-400' },
  ]

  const pieData = [
    { name: 'Protein', value: 128, fill: CHART_COLORS.purple },
    { name: 'Carbs', value: 220, fill: CHART_COLORS.blue },
    { name: 'Fat', value: 65, fill: CHART_COLORS.amber },
  ]

  return (
    <motion.div custom={6} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
      <Card className={cn(CARD_HOVER, 'h-full')}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-green-400" />
            <CardTitle>Nutrition Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative">
                <CircularProgress value={totalCalories} max={targetCalories} size={130} strokeWidth={8} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{totalCalories.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400">of {targetCalories.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400">{remaining} remaining</span>
            </div>

            <div className="flex-1 space-y-3">
              {macros.map((macro) => (
                <div key={macro.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{macro.name}</span>
                    <span className={cn('text-sm font-medium', macro.textColor)}>{macro.current}g / {macro.target}g</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5">
                    <motion.div
                      className={cn('h-full rounded-full', macro.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${(macro.current / macro.target) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center flex-shrink-0">
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Row3HeartRate() {
  const heartRate = useCountUp(72, 1200, 600)
  const heartData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    bpm: 60 + Math.floor(Math.random() * 25) + (i >= 6 && i <= 8 ? 15 : 0) + (i >= 17 && i <= 19 ? 10 : 0),
  }))

  return (
    <motion.div custom={7} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-pink-600/5 pointer-events-none" />
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            <CardTitle>Heart Rate</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-bold text-white">{heartRate}</span>
            <span className="text-sm text-gray-400">BPM</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={heartData}>
              <defs>
                <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.red} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="bpm" stroke={CHART_COLORS.red} fill="url(#heartGrad)" strokeWidth={2} dot={false} />
              <Tooltip {...chartTooltipStyle} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>Resting: 62</span>
            <span>Avg: 72</span>
            <span>Max: 155</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Row3Steps() {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const stepsData = daysOfWeek.map((day, i) => ({
    day,
    steps: i === 6 ? 8432 : 5000 + Math.floor(Math.random() * 5000),
  }))

  return (
    <motion.div custom={8} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className={cn(CARD_HOVER, 'h-full')}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Footprints className="w-5 h-5 text-blue-400" />
            <CardTitle>Steps This Week</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={stepsData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="steps" radius={[4, 4, 0, 0]}>
                {stepsData.map((_, idx) => (
                  <Cell key={idx} fill={idx === 6 ? CHART_COLORS.purple : CHART_COLORS.blue} opacity={idx === 6 ? 1 : 0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Row3Sleep() {
  return (
    <motion.div custom={9} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/5 pointer-events-none" />
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            <CardTitle>Sleep Score</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <CircularProgress value={85} size={80} strokeWidth={6} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">8.5</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-300">Quality: <span className="text-indigo-400 font-medium">Excellent</span></p>
              <p className="text-xs text-gray-500 mt-1">11:15 PM — 6:45 AM</p>
              <p className="text-xs text-gray-500">7h 30m total</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Deep Sleep', value: 25, color: 'bg-indigo-500' },
              { label: 'Light Sleep', value: 50, color: 'bg-blue-400' },
              { label: 'REM', value: 25, color: 'bg-purple-500' },
            ].map((stage) => (
              <div key={stage.label} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-16">{stage.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5">
                  <motion.div
                    className={cn('h-full rounded-full', stage.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.value}%` }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 w-6 text-right">{stage.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Row3Water() {
  const totalGlasses = 6
  const targetGlasses = 8

  return (
    <motion.div custom={10} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className={cn(CARD_HOVER, 'h-full')}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <CardTitle>Water Intake</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-white">{totalGlasses}</span>
            <span className="text-sm text-gray-400">/ {targetGlasses} glasses</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: targetGlasses }, (_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 200 }}
                className={cn(
                  'aspect-square rounded-xl flex items-center justify-center text-xl border',
                  i < totalGlasses
                    ? 'bg-cyan-500/20 border-cyan-500/30'
                    : 'bg-white/5 border-white/10'
                )}
              >
                💧
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            {targetGlasses - totalGlasses} more glasses to reach your goal
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function Row4BodyMetrics() {
  const weightData = Array.from({ length: 30 }, (_, i) => ({
    day: format(subDays(new Date(), 29 - i), 'MMM d'),
    weight: 78 - (1 - (29 - i) / 30) * 0.5 + (Math.random() - 0.5) * 0.3,
  }))

  const bmi = calculateBMI(78, 175)
  const bmiCategory = getBMICategory(bmi)
  const bodyFat = 18.2

  return (
    <>
      <motion.div custom={11} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
        <Card className={cn(CARD_HOVER, 'h-full')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                <CardTitle>Weight Trend</CardTitle>
              </div>
              <Badge variant="success">-0.5 kg</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-white">78.0</span>
              <span className="text-sm text-gray-400">kg</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weightData}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 9 }} axisLine={false} tickLine={false} interval={6} />
                <YAxis domain={[77, 79]} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="weight" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} fill="url(#weightGrad)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={12} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/5 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              BMI
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-center">
              <span className="text-4xl font-bold text-white">{bmi.toFixed(1)}</span>
              <div className="mt-2">
                <Badge variant="success">{bmiCategory}</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-3">18.5 — 24.9 Normal</p>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-amber-500 to-red-500 relative">
              <motion.div
                className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-lg"
                initial={{ left: '0%' }}
                animate={{ left: `${((bmi - 15) / 20) * 100}%` }}
                transition={{ duration: 1.2, delay: 1 }}
                style={{ transform: 'translateX(-50%)' }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={13} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/5 pointer-events-none" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Body Fat
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-center">
              <span className="text-4xl font-bold text-white">{bodyFat}%</span>
              <div className="mt-2">
                <Badge variant="success">Athletic</Badge>
              </div>
            </div>
            <div className="mt-4 relative h-3 w-full">
              <div className="absolute inset-0 rounded-full bg-white/5" />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${(bodyFat / 30) * 100}%` }}
                transition={{ duration: 1.2, delay: 1 }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-2 text-center">6-13% Athletes · 14-17% Fitness · 18-24% Average</p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

function Row5Workouts() {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const workoutMinutes = [65, 70, 75, 55, 90, 0, 45]
  const weeklyData = weekDays.map((day, i) => ({
    day,
    minutes: workoutMinutes[i],
    calories: [520, 580, 650, 440, 600, 0, 900][i],
  }))

  const recentWorkouts = [
    { name: 'Push Day', duration: '65 min', calories: 520, type: 'strength' },
    { name: 'Morning Run', duration: '35 min', calories: 380, type: 'cardio' },
    { name: 'Pull Day', duration: '70 min', calories: 580, type: 'strength' },
  ]

  return (
    <>
      <motion.div custom={14} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
        <Card className={cn(CARD_HOVER, 'h-full')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-purple-400" />
                <CardTitle>Weekly Workouts</CardTitle>
              </div>
              <Badge variant="default">6 sessions</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="minutes" name="Minutes" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((_, idx) => (
                    <Cell key={idx} fill={idx === 6 ? CHART_COLORS.purple : 'rgba(168, 85, 247, 0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={15} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER, 'h-full')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentWorkouts.map((w, i) => (
                <motion.div
                  key={w.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                    w.type === 'strength' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                  )}>
                    {w.type === 'strength' ? '🏋️' : '🏃'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{w.name}</p>
                    <p className="text-xs text-gray-500">{w.duration} · {w.calories} cal</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={16} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER, 'h-full')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Sports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {[
                { sport: '🏏 Cricket', cal: 720, date: '3d ago' },
                { sport: '⚽ Football', cal: 680, date: '5d ago' },
                { sport: '🏊 Swimming', cal: 350, date: '10d ago' },
              ].map((s, i) => (
                <motion.div
                  key={s.sport}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]"
                >
                  <span className="text-sm text-white">{s.sport}</span>
                  <div className="text-right">
                    <span className="text-xs text-amber-400">{s.cal} cal</span>
                    <p className="text-[10px] text-gray-600">{s.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

function Row6Lifestyle() {
  const [selectedMood, setSelectedMood] = React.useState(1)

  const moods = [
    { emoji: '😴', label: 'Tired' },
    { emoji: '😊', label: 'Good' },
    { emoji: '💪', label: 'Strong' },
    { emoji: '🔥', label: 'On Fire' },
  ]

  const lifestyleMetrics = [
    { label: 'Energy Level', value: 7, max: 10, icon: <Zap className="w-4 h-4 text-amber-400" />, color: 'bg-amber-500', emoji: '⚡' },
    { label: 'Stress Level', value: 4, max: 10, icon: <Brain className="w-4 h-4 text-green-400" />, color: 'bg-green-500', emoji: '🧘', lowGood: true },
    { label: 'Recovery Score', value: 82, max: 100, icon: <Heart className="w-4 h-4 text-pink-400" />, color: 'bg-pink-500', emoji: '💚', suffix: '%' },
  ]

  return (
    <>
      {lifestyleMetrics.map((metric, i) => (
        <motion.div key={metric.label} custom={17 + i} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER, 'h-full')}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 uppercase tracking-wider">{metric.label}</span>
                <span className="text-lg">{metric.emoji}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-white">{metric.value}</span>
                <span className="text-sm text-gray-500">/ {metric.max}{metric.suffix || ''}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5">
                <motion.div
                  className={cn('h-full rounded-full', metric.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                  transition={{ duration: 1, delay: 1.5 + i * 0.1 }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                {metric.lowGood
                  ? (metric.value <= 3 ? 'Great — keep it low' : metric.value <= 6 ? 'Moderate — consider relaxing' : 'High — take a break')
                  : (metric.value >= 7 ? 'Excellent' : metric.value >= 4 ? 'Good' : 'Needs attention')
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <motion.div custom={20} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER, 'h-full')}>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Today&apos;s Mood</span>
              <Smile className="w-4 h-4 text-pink-400" />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {moods.map((mood, i) => (
                <motion.button
                  key={mood.label}
                  onClick={() => setSelectedMood(i)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-xl border transition-all',
                    selectedMood === i
                      ? 'bg-purple-500/20 border-purple-500/40 shadow-lg shadow-purple-500/10'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                  )}
                >
                  <span>{mood.emoji}</span>
                  <span className="text-[9px] text-gray-400">{mood.label}</span>
                </motion.button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xl">🔥</span>
              <span className="text-sm text-white font-medium">15 day streak</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

function Row7Progress() {
  const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    day: format(subDays(new Date(), 29 - i), 'MMM d'),
    score: 70 + Math.floor(Math.random() * 15) + Math.floor(i / 3),
  }))

  const goals = useStore((s) => s.weeklyGoals).slice(0, 3)

  const recommendations = [
    { icon: '🥩', text: 'Increase protein intake by 15g to hit your muscle-building target' },
    { icon: '😴', text: 'Your sleep has been great — maintain the 11 PM bedtime' },
    { icon: '💧', text: 'Try to drink 2 more glasses of water before noon' },
  ]

  return (
    <>
      <motion.div custom={21} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
        <Card className={cn(CARD_HOVER, 'h-full')}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <CardTitle>Monthly Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlyData}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 9 }} axisLine={false} tickLine={false} interval={6} />
                <YAxis domain={[60, 90]} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="score" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} fill="url(#progressGrad)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={22} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER, 'h-full')}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <CardTitle>Weekly Goals</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => {
                const pct = Math.min((goal.current / goal.target) * 100, 100)
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{goal.type}</span>
                      <span className="text-xs text-gray-500">{Math.round(pct)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5">
                      <motion.div
                        className={cn(
                          'h-full rounded-full',
                          pct >= 100 ? 'bg-green-500' : pct >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 1.8 }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={23} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/5 pointer-events-none" />
          <CardHeader className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <CardTitle>AI Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + i * 0.15 }}
                  className="flex gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <span className="text-lg flex-shrink-0">{rec.icon}</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{rec.text}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

function Row8Actions() {
  const actions = [
    { label: 'Log Meal', icon: <Utensils className="w-5 h-5" />, color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/20', textColor: 'text-green-400' },
    { label: 'Start Workout', icon: <Dumbbell className="w-5 h-5" />, color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/20', textColor: 'text-purple-400' },
    { label: 'Track Water', icon: <Droplets className="w-5 h-5" />, color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/20', textColor: 'text-cyan-400' },
    { label: 'Record Weight', icon: <TrendingDown className="w-5 h-5" />, color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/20', textColor: 'text-amber-400' },
    { label: 'AI Chat', icon: <MessageSquare className="w-5 h-5" />, color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/20', textColor: 'text-pink-400' },
    { label: 'View Reports', icon: <FileText className="w-5 h-5" />, color: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/20', textColor: 'text-indigo-400' },
  ]

  return (
    <motion.div custom={24} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-3">
      <Card className={cn(CARD_HOVER, 'h-full')}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <CardTitle>Quick Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {actions.map((action, i) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + i * 0.08 }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer',
                  `bg-gradient-to-br ${action.color} ${action.border}`,
                  'hover:shadow-lg hover:shadow-purple-500/10'
                )}
              >
                <div className={action.textColor}>{action.icon}</div>
                <span className="text-xs text-gray-300 font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <Row1Greeting />
        <Row1Stats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <Row2Nutrition />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Row3HeartRate />
          <Row3Steps />
          <Row3Sleep />
          <Row3Water />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Row4BodyMetrics />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Row5Workouts />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Row6Lifestyle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Row7Progress />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          <Row8Actions />
        </div>
      </div>
    </AppLayout>
  )
}
