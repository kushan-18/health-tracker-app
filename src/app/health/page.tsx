'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import {
  Heart, Activity, Thermometer, Droplets, Brain, Moon, Wind, Timer,
  Plus, TrendingUp, TrendingDown, ChevronRight, Play, Pause, Square,
  Check, Smile, Frown, Meh, Zap, Battery, Sun, Download,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard, InteractiveCard, GradientCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabTriggers, TabTrigger, TabContent } from '@/components/ui/tabs'
import { useStore } from '@/lib/store'
import { cn, generateId } from '@/lib/utils'
import { format, subDays } from 'date-fns'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/5'

const CHART_COLORS = {
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  cyan: '#06b6d4',
  indigo: '#6366f1',
  orange: '#f97316',
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

function MetricsTab() {
  const metrics = useStore((s) => s.metrics)
  const addMetric = useStore((s) => s.addMetric)

  const metricTypes = [
    { type: 'blood_pressure_systolic', label: 'Blood Pressure', icon: <Heart className="w-5 h-5" />, unit: 'mmHg', color: 'text-red-400', gradient: 'from-red-600/10 to-pink-600/5' },
    { type: 'blood_sugar', label: 'Blood Sugar', icon: <Droplets className="w-5 h-5" />, unit: 'mg/dL', color: 'text-amber-400', gradient: 'from-amber-600/10 to-orange-600/5' },
    { type: 'spo2', label: 'SpO2', icon: <Activity className="w-5 h-5" />, unit: '%', color: 'text-cyan-400', gradient: 'from-cyan-600/10 to-blue-600/5' },
    { type: 'heart_rate', label: 'Heart Rate', icon: <Heart className="w-5 h-5" />, unit: 'bpm', color: 'text-pink-400', gradient: 'from-pink-600/10 to-rose-600/5' },
    { type: 'body_temperature', label: 'Temperature', icon: <Thermometer className="w-5 h-5" />, unit: '°F', color: 'text-orange-400', gradient: 'from-orange-600/10 to-red-600/5' },
  ]

  const getLatestForType = (type: string) => {
    const filtered = metrics.filter((m) => m.type === type)
    return filtered[filtered.length - 1]
  }

  const getTrend = (type: string) => {
    const filtered = metrics.filter((m) => m.type === type).slice(-7)
    if (filtered.length < 2) return 0
    return filtered[filtered.length - 1].value - filtered[0].value
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricTypes.map((mt, i) => {
          const latest = getLatestForType(mt.type)
          const trend = getTrend(mt.type)
          return (
            <motion.div key={mt.type} custom={i} variants={fadeInUp} initial="hidden" animate="visible">
              <Card className={cn(CARD_HOVER, 'relative overflow-hidden')}>
                <div className={`absolute inset-0 bg-gradient-to-br ${mt.gradient} pointer-events-none`} />
                <CardContent className="pt-5 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">{mt.label}</span>
                    <div className={mt.color}>{mt.icon}</div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{latest?.value || '—'}</span>
                    <span className="text-sm text-gray-400">{mt.unit}</span>
                  </div>
                  {trend !== 0 && (
                    <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium',
                      trend > 0 ? 'text-red-400' : 'text-green-400'
                    )}>
                      {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)} from last week</span>
                    </div>
                  )}
                  <div className="mt-3 h-1 w-full rounded-full bg-white/5">
                    <motion.div
                      className={cn('h-full rounded-full', mt.color.replace('text-', 'bg-'))}
                      initial={{ width: 0 }}
                      animate={{ width: latest ? `${Math.min((latest.value / (mt.type === 'spo2' ? 100 : mt.type === 'heart_rate' ? 200 : mt.type === 'body_temperature' ? 110 : 180)) * 100, 100)}%` : '0%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Recent Readings
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                <Plus className="w-4 h-4 mr-1" /> Add Reading
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {metrics.slice(-10).reverse().map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium capitalize">{m.type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-500">{format(new Date(m.date), 'MMM d')} at {m.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">{m.value}</span>
                    <span className="text-xs text-gray-400 ml-1">{m.unit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function HeartTab() {
  const metrics = useStore((s) => s.metrics)
  const heartRateData = metrics.filter((m) => m.type === 'heart_rate')

  const dailyHR = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    bpm: 60 + Math.floor(Math.random() * 25) + (i >= 6 && i <= 8 ? 15 : 0) + (i >= 17 && i <= 19 ? 10 : 0),
  }))

  const zones = [
    { zone: 'Rest', min: 50, max: 100, color: CHART_COLORS.green, time: '8h 30m' },
    { zone: 'Fat Burn', min: 100, max: 140, color: CHART_COLORS.amber, time: '2h 15m' },
    { zone: 'Cardio', min: 140, max: 170, color: CHART_COLORS.orange || '#f97316', time: '45m' },
    { zone: 'Peak', min: 170, max: 210, color: CHART_COLORS.red, time: '15m' },
  ]

  const zoneChartData = zones.map((z) => ({
    zone: z.zone,
    minutes: parseInt(z.time) * 60 + (z.time.includes('h') ? parseInt(z.time.split('h ')[1]) || 0 : 0),
    fill: z.color,
  }))

  const hrvData = Array.from({ length: 7 }, (_, i) => ({
    day: format(subDays(new Date(), 6 - i), 'EEE'),
    hrv: 45 + Math.floor(Math.random() * 20),
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardContent className="pt-5 text-center">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Resting</span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-3xl font-bold text-green-400">62</span>
                <span className="text-xs text-gray-500">BPM</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardContent className="pt-5 text-center">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Average</span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-3xl font-bold text-blue-400">72</span>
                <span className="text-xs text-gray-500">BPM</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardContent className="pt-5 text-center">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Max</span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-3xl font-bold text-red-400">185</span>
                <span className="text-xs text-gray-500">BPM</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER, 'relative overflow-hidden')}>
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-pink-600/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Heart Rate Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-3">
                {zones.map((z) => (
                  <div key={z.zone}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{z.zone}</span>
                      <span className="text-xs text-gray-500">{z.time}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: z.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.random() * 60 + 20}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 mt-0.5">{z.min}-{z.max} BPM</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-400" />
                Daily Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={dailyHR}>
                  <defs>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.red} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.red} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" tick={{ fill: '#9ca3af', fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
                  <YAxis domain={[50, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip {...chartTooltipStyle} />
                  <Area type="monotone" dataKey="bpm" stroke={CHART_COLORS.red} fill="url(#hrGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Heart Rate Variability (HRV)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-white">52</span>
              <span className="text-sm text-gray-400">ms avg</span>
              <Badge variant="success">Good</Badge>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={hrvData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="hrv" name="HRV (ms)" radius={[4, 4, 0, 0]}>
                  {hrvData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS.purple} opacity={0.6 + (idx / 7) * 0.4} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function SleepTab() {
  const sleepRecords = useStore((s) => s.records)
  const latest = sleepRecords[sleepRecords.length - 1]

  const weeklyData = sleepRecords.slice(-7).map((r) => ({
    day: format(new Date(r.date), 'EEE'),
    hours: r.duration,
    quality: r.quality,
  }))

  const stages = [
    { stage: 'Deep Sleep', pct: 22, color: 'bg-indigo-500', time: '1h 42m' },
    { stage: 'Light Sleep', pct: 48, color: 'bg-blue-400', time: '3h 42m' },
    { stage: 'REM', pct: 25, color: 'bg-purple-500', time: '1h 57m' },
    { stage: 'Awake', pct: 5, color: 'bg-gray-500', time: '24m' },
  ]

  const factors = [
    { label: 'Consistent bedtime', checked: true },
    { label: 'No caffeine after 2 PM', checked: true },
    { label: 'Dark room', checked: true },
    { label: 'No screens 1hr before bed', checked: false },
    { label: 'Exercise earlier in day', checked: true },
    { label: 'Light dinner', checked: false },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <GradientCard gradient="from-indigo-600/20 to-purple-600/20" className="border border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg width="100" height="100" className="-rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none" stroke="url(#sleepGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.85) }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="sleepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">8.5</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sleep Score</h3>
                <p className="text-sm text-gray-400 mt-1">Quality: <span className="text-indigo-400 font-medium">Excellent</span></p>
                <p className="text-xs text-gray-500 mt-1">{latest?.bedTime} — {latest?.wakeTime}</p>
                <p className="text-xs text-gray-500">{latest?.duration.toFixed(1)} hours total</p>
              </div>
            </div>
          </GradientCard>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                Sleep Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full rounded-full flex overflow-hidden mb-4">
                {stages.map((s) => (
                  <motion.div
                    key={s.stage}
                    className={cn('h-full', s.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stages.map((s) => (
                  <div key={s.stage} className="flex items-center gap-2">
                    <div className={cn('w-2.5 h-2.5 rounded-full', s.color)} />
                    <span className="text-xs text-gray-400">{s.stage}</span>
                    <span className="text-xs text-white ml-auto">{s.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              Weekly Sleep Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="hours" name="Hours" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((_, idx) => (
                    <Cell key={idx} fill={idx === weeklyData.length - 1 ? CHART_COLORS.indigo : 'rgba(99,102,241,0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Sleep Quality Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {factors.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center border',
                    f.checked ? 'bg-green-500/20 border-green-500/40' : 'bg-white/5 border-white/10'
                  )}>
                    {f.checked && <Check className="w-3 h-3 text-green-400" />}
                  </div>
                  <span className={cn('text-sm', f.checked ? 'text-white' : 'text-gray-400')}>{f.label}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function MentalTab() {
  const [stressLevel, setStressLevel] = React.useState(4)
  const [selectedMood, setSelectedMood] = React.useState(1)
  const [energy, setEnergy] = React.useState(7)
  const [breathTimer, setBreathTimer] = React.useState(0)
  const [breathPhase, setBreathPhase] = React.useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle')
  const [breathActive, setBreathActive] = React.useState(false)
  const [meditationTime, setMeditationTime] = React.useState(0)
  const [meditationActive, setMeditationActive] = React.useState(false)
  const breathIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const meditationIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const moods = [
    { emoji: '😢', label: 'Sad' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😊', label: 'Good' },
    { emoji: '😄', label: 'Great' },
    { emoji: '🔥', label: 'Amazing' },
  ]

  const startBreathing = () => {
    if (breathActive) {
      setBreathActive(false)
      setBreathPhase('idle')
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current)
      return
    }
    setBreathActive(true)
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale'
    let count = 0
    const maxCounts = { inhale: 4, hold: 7, exhale: 8 }
    setBreathPhase('inhale')
    setBreathTimer(4)

    breathIntervalRef.current = setInterval(() => {
      count++
      setBreathTimer(maxCounts[phase] - count)
      if (count >= maxCounts[phase]) {
        count = 0
        if (phase === 'inhale') phase = 'hold'
        else if (phase === 'hold') phase = 'exhale'
        else phase = 'inhale'
        setBreathPhase(phase)
        setBreathTimer(maxCounts[phase])
      }
    }, 1000)
  }

  const toggleMeditation = () => {
    if (meditationActive) {
      setMeditationActive(false)
      if (meditationIntervalRef.current) clearInterval(meditationIntervalRef.current)
    } else {
      setMeditationActive(true)
      meditationIntervalRef.current = setInterval(() => {
        setMeditationTime((t) => t + 1)
      }, 1000)
    }
  }

  React.useEffect(() => {
    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current)
      if (meditationIntervalRef.current) clearInterval(meditationIntervalRef.current)
    }
  }, [])

  const formatSeconds = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardContent className="pt-5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Stress Level</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white">{stressLevel}</span>
                <span className="text-sm text-gray-500">/ 10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full mt-3 accent-green-500"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>Calm</span>
                <span>Stressed</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                {stressLevel <= 3 ? 'Excellent — keep it up' : stressLevel <= 6 ? 'Moderate — try some breathing' : 'High — take a break now'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardContent className="pt-5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Mood</span>
              <div className="grid grid-cols-5 gap-1 mt-3">
                {moods.map((m, i) => (
                  <motion.button
                    key={m.label}
                    onClick={() => setSelectedMood(i)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      'aspect-square rounded-lg flex flex-col items-center justify-center text-lg border transition-all',
                      selectedMood === i
                        ? 'bg-purple-500/20 border-purple-500/40 shadow-lg shadow-purple-500/10'
                        : 'bg-white/[0.03] border-white/5'
                    )}
                  >
                    <span>{m.emoji}</span>
                    <span className="text-[8px] text-gray-400 mt-0.5">{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardContent className="pt-5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Energy Level</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white">{energy}</span>
                <span className="text-sm text-gray-500">/ 10</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 mt-3">
                <motion.div
                  className="h-full rounded-full bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(energy / 10) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                {energy >= 7 ? 'High energy — great day!' : energy >= 4 ? 'Moderate — fuel up' : 'Low — rest recommended'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardContent className="pt-5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Recovery Score</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-white">82</span>
                <span className="text-sm text-gray-500">%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 mt-3">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-[10px] text-green-400 mt-2 font-medium">Well recovered</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER, 'relative overflow-hidden')}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-cyan-400" />
                Breathing Exercise (4-7-8)
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-center">
                <motion.div
                  className={cn(
                    'w-32 h-32 mx-auto rounded-full border-2 flex items-center justify-center mb-4',
                    breathActive ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/10 bg-white/5'
                  )}
                  animate={breathActive ? {
                    scale: breathPhase === 'inhale' ? 1.2 : breathPhase === 'hold' ? 1.2 : 1,
                  } : {}}
                  transition={{ duration: breathPhase === 'inhale' ? 4 : breathPhase === 'exhale' ? 8 : 0.3 }}
                >
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">{breathTimer}</span>
                    <p className="text-xs text-cyan-400 mt-1 capitalize">{breathPhase === 'idle' ? 'Ready' : breathPhase}</p>
                  </div>
                </motion.div>
                <Button
                  onClick={startBreathing}
                  className={cn(
                    'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white',
                  )}
                >
                  {breathActive ? <><Square className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER, 'relative overflow-hidden')}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-purple-400" />
                Meditation Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full border-2 border-purple-500/30 bg-purple-500/10 flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-white">{formatSeconds(meditationTime)}</span>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={toggleMeditation}
                    className={cn(
                      meditationActive
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
                      'text-white'
                    )}
                  >
                    {meditationActive ? <><Square className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start</>}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => { setMeditationTime(0); setMeditationActive(false); if (meditationIntervalRef.current) clearInterval(meditationIntervalRef.current) }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function LogTab() {
  const addMetric = useStore((s) => s.addMetric)
  const metrics = useStore((s) => s.metrics)
  const [logType, setLogType] = React.useState('blood_pressure_systolic')
  const [logValue, setLogValue] = React.useState('')
  const [logDiastolic, setLogDiastolic] = React.useState('')
  const [logNotes, setLogNotes] = React.useState('')

  const logTypes = [
    { value: 'blood_pressure_systolic', label: 'Blood Pressure (Systolic)', unit: 'mmHg' },
    { value: 'blood_pressure_diastolic', label: 'Blood Pressure (Diastolic)', unit: 'mmHg' },
    { value: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL' },
    { value: 'spo2', label: 'SpO2', unit: '%' },
    { value: 'body_temperature', label: 'Temperature', unit: '°F' },
  ]

  const handleLog = () => {
    if (!logValue) return
    const selected = logTypes.find((t) => t.value === logType)
    if (!selected) return
    addMetric({
      id: generateId(),
      userId: 'user_001',
      type: logType,
      value: parseFloat(logValue),
      unit: selected.unit,
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
    })
    setLogValue('')
    setLogDiastolic('')
    setLogNotes('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                Quick Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Metric Type</label>
                  <select
                    value={logType}
                    onChange={(e) => setLogType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  >
                    {logTypes.map((t) => (
                      <option key={t.value} value={t.value} className="bg-gray-900">{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Value ({logTypes.find((t) => t.value === logType)?.unit})
                  </label>
                  <Input
                    type="number"
                    value={logValue}
                    onChange={(e) => setLogValue(e.target.value)}
                    placeholder="Enter value"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Notes (optional)</label>
                  <textarea
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="Any notes..."
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>
                <Button onClick={handleLog} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Save Reading
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Recent Logs
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  <Download className="w-4 h-4 mr-1" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {metrics.slice(-15).reverse().map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium capitalize">{m.type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-500">{format(new Date(m.date), 'MMM d')} at {m.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-white">{m.value}</span>
                      <span className="text-xs text-gray-400 ml-1">{m.unit}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default function HealthPage() {
  return (
    <AppLayout title="Health Tracking">
      <div className="max-w-[1600px] mx-auto">
        <Tabs defaultValue="metrics">
          <TabTriggers className="mb-6">
            <TabTrigger value="metrics" label="Metrics" />
            <TabTrigger value="heart" label="Heart" />
            <TabTrigger value="sleep" label="Sleep" />
            <TabTrigger value="mental" label="Mental" />
            <TabTrigger value="log" label="Log" />
          </TabTriggers>
          <TabContent value="metrics"><MetricsTab /></TabContent>
          <TabContent value="heart"><HeartTab /></TabContent>
          <TabContent value="sleep"><SleepTab /></TabContent>
          <TabContent value="mental"><MentalTab /></TabContent>
          <TabContent value="log"><LogTab /></TabContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
