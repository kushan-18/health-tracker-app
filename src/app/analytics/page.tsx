'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Scale, Activity, Ruler, Target, ArrowUpRight,
  ArrowDownRight, Camera, ChevronDown, Plus, Heart, Dumbbell, Minus, Clock,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard, InteractiveCard, GradientCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabTriggers, TabTrigger, TabContent } from '@/components/ui/tabs'
import { useStore } from '@/lib/store'
import { cn, calculateBMI, getBMICategory, generateId } from '@/lib/utils'
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

function OverviewTab() {
  const user = useStore((s) => s.user)
  const measurements = useStore((s) => s.measurements)
  const latest = measurements[measurements.length - 1]
  const bmi = calculateBMI(latest?.weight || user?.weight || 78, user?.height || 175)
  const bmiCategory = getBMICategory(bmi)

  const weightData = Array.from({ length: 30 }, (_, i) => ({
    day: format(subDays(new Date(), 29 - i), 'MMM d'),
    weight: (78 - (1 - (29 - i) / 30) * 0.5 + (Math.random() - 0.5) * 0.3),
  }))

  const compositionData = [
    { name: 'Muscle', value: latest?.muscleMass || 35, fill: CHART_COLORS.purple },
    { name: 'Fat', value: latest?.bodyFat || 18.5, fill: CHART_COLORS.amber },
    { name: 'Bone & Water', value: 100 - (latest?.muscleMass || 35) - (latest?.bodyFat || 18.5), fill: CHART_COLORS.blue },
  ]

  const stats = [
    { label: 'Weight', value: `${(latest?.weight || 78).toFixed(1)} kg`, icon: <Scale className="w-5 h-5" />, change: { value: -0.5, positive: false }, color: 'text-emerald-400' },
    { label: 'BMI', value: bmi.toFixed(1), icon: <Activity className="w-5 h-5" />, sub: bmiCategory, color: 'text-blue-400' },
    { label: 'Body Fat', value: `${(latest?.bodyFat || 18.5).toFixed(1)}%`, icon: <Target className="w-5 h-5" />, change: { value: -1.2, positive: false }, color: 'text-amber-400' },
    { label: 'Muscle Mass', value: `${(latest?.muscleMass || 35).toFixed(1)} kg`, icon: <Dumbbell className="w-5 h-5" />, change: { value: 1.1, positive: true }, color: 'text-purple-400' },
    { label: 'Waist', value: `${(latest?.waist || 82).toFixed(0)} cm`, icon: <Ruler className="w-5 h-5" />, change: { value: -1.5, positive: false }, color: 'text-cyan-400' },
    { label: 'Chest', value: `${(latest?.chest || 98).toFixed(0)} cm`, icon: <Ruler className="w-5 h-5" />, change: { value: 0.8, positive: true }, color: 'text-pink-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeInUp} initial="hidden" animate="visible">
            <Card className={cn(CARD_HOVER)}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                {stat.change && (
                  <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-medium',
                    stat.change.positive ? 'text-green-400' : 'text-red-400'
                  )}>
                    {stat.change.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{stat.change.positive ? '+' : ''}{stat.change.value}% this month</span>
                  </div>
                )}
                {stat.sub && <p className="text-xs text-gray-500 mt-1.5">{stat.sub}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div custom={6} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className={cn(CARD_HOVER, 'h-full')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                  <CardTitle>Weight Trend (30 Days)</CardTitle>
                </div>
                <Badge variant="success">-0.5 kg</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-white">{(latest?.weight || 78).toFixed(1)}</span>
                <span className="text-sm text-gray-400">kg</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="weightGradAnalytics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 9 }} axisLine={false} tickLine={false} interval={6} />
                  <YAxis domain={[77, 79]} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip {...chartTooltipStyle} />
                  <Area type="monotone" dataKey="weight" stroke={CHART_COLORS.green} fill="url(#weightGradAnalytics)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={7} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                BMI Gauge
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-center mb-4">
                <span className="text-5xl font-bold text-white">{bmi.toFixed(1)}</span>
                <div className="mt-2">
                  <Badge variant="success">{bmiCategory}</Badge>
                </div>
              </div>
              <div className="h-3 w-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-amber-500 to-red-500 relative">
                <motion.div
                  className="absolute -top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-500 shadow-lg"
                  initial={{ left: '0%' }}
                  animate={{ left: `${Math.min(Math.max(((bmi - 15) / 20) * 100, 0), 100)}%` }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  style={{ transform: 'translateX(-50%)' }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 mt-2">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">Normal range: 18.5 — 24.9</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={8} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className={cn(CARD_HOVER, 'h-full')}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <CardTitle>Body Composition</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie data={compositionData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                        {compositionData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip {...chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {compositionData.map((item) => (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="text-sm text-gray-300">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{item.value.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/5">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.fill }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={9} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Body Fat
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-center mb-4">
                <span className="text-5xl font-bold text-white">{(latest?.bodyFat || 18.5).toFixed(1)}%</span>
                <div className="mt-2">
                  <Badge variant="success">Athletic</Badge>
                </div>
              </div>
              <div className="relative h-3 w-full">
                <div className="absolute inset-0 rounded-full bg-white/5" />
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((latest?.bodyFat || 18.5) / 30) * 100}%` }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-3 text-center">6-13% Athletes · 14-17% Fitness · 18-24% Average</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function MeasurementsTab() {
  const measurements = useStore((s) => s.measurements)
  const addMeasurement = useStore((s) => s.addMeasurement)
  const [form, setForm] = React.useState({
    weight: '',
    bodyFat: '',
    waist: '',
    chest: '',
    arms: '',
    legs: '',
    muscleMass: '',
  })

  const handleSubmit = () => {
    if (!form.weight) return
    addMeasurement({
      id: generateId(),
      userId: 'user_001',
      weight: parseFloat(form.weight),
      bodyFat: form.bodyFat ? parseFloat(form.bodyFat) : undefined,
      muscleMass: form.muscleMass ? parseFloat(form.muscleMass) : undefined,
      waist: form.waist ? parseFloat(form.waist) : undefined,
      chest: form.chest ? parseFloat(form.chest) : undefined,
      arms: form.arms ? parseFloat(form.arms) : undefined,
      legs: form.legs ? parseFloat(form.legs) : undefined,
      date: format(new Date(), 'yyyy-MM-dd'),
    })
    setForm({ weight: '', bodyFat: '', waist: '', chest: '', arms: '', legs: '', muscleMass: '' })
  }

  const sorted = [...measurements].reverse()
  const latest = sorted[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              <CardTitle>Add Measurement</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Weight (kg) *</label>
                <Input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="78.0" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Body Fat (%)</label>
                <Input type="number" value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} placeholder="18.5" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Muscle Mass (kg)</label>
                <Input type="number" value={form.muscleMass} onChange={(e) => setForm({ ...form, muscleMass: e.target.value })} placeholder="35.0" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Waist (cm)</label>
                <Input type="number" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} placeholder="82" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Chest (cm)</label>
                <Input type="number" value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} placeholder="98" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Arms (cm)</label>
                <Input type="number" value={form.arms} onChange={(e) => setForm({ ...form, arms: e.target.value })} placeholder="35" className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Legs (cm)</label>
                <Input type="number" value={form.legs} onChange={(e) => setForm({ ...form, legs: e.target.value })} placeholder="56" className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <Button onClick={handleSubmit} className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              Save Measurement
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-cyan-400" />
              <CardTitle>Body Outline</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative flex items-center justify-center py-4">
              <svg viewBox="0 0 200 360" className="w-40 h-72">
                <ellipse cx="100" cy="40" rx="28" ry="32" fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="2" />
                <path d="M 70 72 Q 60 120 65 180 L 75 280 Q 80 300 85 320 L 100 320 L 115 320 Q 120 300 125 280 L 135 180 Q 140 120 130 72 Z" fill="none" stroke="rgba(59,130,246,0.4)" strokeWidth="2" />
                <line x1="70" y1="72" x2="30" y2="160" stroke="rgba(6,182,212,0.4)" strokeWidth="2" />
                <line x1="130" y1="72" x2="170" y2="160" stroke="rgba(6,182,212,0.4)" strokeWidth="2" />
                <ellipse cx="100" cy="120" rx="30" ry="40" fill="none" stroke="rgba(168,85,247,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                <text x="100" y="120" textAnchor="middle" fill="#9ca3af" fontSize="8">{(latest?.chest || 98).toFixed(0)} cm</text>
                <text x="100" y="175" textAnchor="middle" fill="#9ca3af" fontSize="8">{(latest?.waist || 82).toFixed(0)} cm</text>
                <text x="15" y="120" textAnchor="middle" fill="#9ca3af" fontSize="8">{(latest?.arms || 35).toFixed(0)} cm</text>
                <text x="185" y="120" textAnchor="middle" fill="#9ca3af" fontSize="8">{(latest?.arms || 35).toFixed(0)} cm</text>
                <text x="100" y="340" textAnchor="middle" fill="#9ca3af" fontSize="8">{(latest?.legs || 56).toFixed(0)} cm</text>
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-400 mt-2">
              <div className="p-2 rounded-lg bg-white/5"><span className="text-white font-medium block">{(latest?.chest || 98).toFixed(0)} cm</span>Chest</div>
              <div className="p-2 rounded-lg bg-white/5"><span className="text-white font-medium block">{(latest?.waist || 82).toFixed(0)} cm</span>Waist</div>
              <div className="p-2 rounded-lg bg-white/5"><span className="text-white font-medium block">{(latest?.arms || 35).toFixed(0)} cm</span>Arms</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Measurement History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {sorted.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
                >
                  <div>
                    <p className="text-sm text-white font-medium">{m.weight.toFixed(1)} kg</p>
                    <p className="text-xs text-gray-500">{format(new Date(m.date), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400">
                    {m.bodyFat && <span>{m.bodyFat.toFixed(1)}% fat</span>}
                    {m.waist && <span>{m.waist.toFixed(0)}cm waist</span>}
                    {m.muscleMass && <span>{m.muscleMass.toFixed(1)}kg muscle</span>}
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

function TrendsTab() {
  const [timeRange, setTimeRange] = React.useState('1M')
  const measurements = useStore((s) => s.measurements)

  const ranges: Record<string, number> = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }
  const days = ranges[timeRange]
  const data = measurements.slice(-days)

  const weightTrend = data.map((m, i) => ({
    day: format(new Date(m.date), timeRange === '1W' ? 'EEE' : timeRange === '1M' ? 'MMM d' : 'MMM'),
    weight: m.weight,
  }))

  const bodyFatTrend = data.map((m) => ({
    day: format(new Date(m.date), timeRange === '1W' ? 'EEE' : timeRange === '1M' ? 'MMM d' : 'MMM'),
    bodyFat: m.bodyFat || 0,
  }))

  const muscleTrend = data.map((m) => ({
    day: format(new Date(m.date), timeRange === '1W' ? 'EEE' : timeRange === '1M' ? 'MMM d' : 'MMM'),
    muscleMass: m.muscleMass || 0,
  }))

  const latest = measurements[measurements.length - 1]
  const oldest = measurements[Math.max(0, measurements.length - days)]
  const weightChange = latest && oldest ? (latest.weight - oldest.weight).toFixed(1) : '0'
  const bodyFatChange = latest && oldest && latest.bodyFat && oldest.bodyFat ? (latest.bodyFat - oldest.bodyFat).toFixed(1) : '0'
  const muscleChange = latest && oldest && latest.muscleMass && oldest.muscleMass ? (latest.muscleMass - oldest.muscleMass).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 w-fit">
        {Object.keys(ranges).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={cn(
              'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
              timeRange === range ? 'text-white' : 'text-gray-400 hover:text-gray-300'
            )}
          >
            {timeRange === range && (
              <motion.div
                layoutId="trendRange"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/50 to-blue-600/50 border border-white/10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{range}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className={cn(CARD_HOVER)}>
          <CardContent className="pt-5">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Weight</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{latest?.weight.toFixed(1)} kg</span>
              <span className={cn('text-xs font-medium', parseFloat(weightChange) <= 0 ? 'text-green-400' : 'text-red-400')}>
                {parseFloat(weightChange) > 0 ? '+' : ''}{weightChange} kg
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className={cn(CARD_HOVER)}>
          <CardContent className="pt-5">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Body Fat</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{latest?.bodyFat?.toFixed(1) || '—'}%</span>
              <span className={cn('text-xs font-medium', parseFloat(bodyFatChange) <= 0 ? 'text-green-400' : 'text-red-400')}>
                {parseFloat(bodyFatChange) > 0 ? '+' : ''}{bodyFatChange}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className={cn(CARD_HOVER)}>
          <CardContent className="pt-5">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Muscle Mass</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{latest?.muscleMass?.toFixed(1) || '—'} kg</span>
              <span className={cn('text-xs font-medium', parseFloat(muscleChange) >= 0 ? 'text-green-400' : 'text-red-400')}>
                {parseFloat(muscleChange) > 0 ? '+' : ''}{muscleChange} kg
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className={cn(CARD_HOVER)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                Weight Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weightTrend}>
                  <defs>
                    <linearGradient id="weightTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.green} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 9 }} axisLine={false} tickLine={false} interval={Math.floor(days / 7)} />
                  <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip {...chartTooltipStyle} />
                  <Area type="monotone" dataKey="weight" stroke={CHART_COLORS.green} fill="url(#weightTrendGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Body Fat %
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={bodyFatTrend}>
                  <defs>
                    <linearGradient id="bfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.amber} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.amber} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 9 }} axisLine={false} tickLine={false} interval={Math.floor(days / 7)} />
                  <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip {...chartTooltipStyle} />
                  <Area type="monotone" dataKey="bodyFat" stroke={CHART_COLORS.amber} fill="url(#bfGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-purple-400" />
              Muscle Mass Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={muscleTrend}>
                <defs>
                  <linearGradient id="muscleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.purple} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.purple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 9 }} axisLine={false} tickLine={false} interval={Math.floor(days / 7)} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="muscleMass" stroke={CHART_COLORS.purple} fill="url(#muscleGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function CompareTab() {
  const measurements = useStore((s) => s.measurements)
  const first = measurements[0]
  const latest = measurements[measurements.length - 1]

  const comparison = [
    { metric: 'Weight', before: first?.weight || 78, after: latest?.weight || 78, unit: 'kg' },
    { metric: 'Body Fat', before: first?.bodyFat || 18.5, after: latest?.bodyFat || 18.5, unit: '%' },
    { metric: 'Muscle Mass', before: first?.muscleMass || 35, after: latest?.muscleMass || 35, unit: 'kg' },
    { metric: 'Waist', before: first?.waist || 82, after: latest?.waist || 82, unit: 'cm' },
    { metric: 'Chest', before: first?.chest || 98, after: latest?.chest || 98, unit: 'cm' },
    { metric: 'Arms', before: first?.arms || 35, after: latest?.arms || 35, unit: 'cm' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <GradientCard gradient="from-purple-600/20 to-blue-600/20" className="border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm text-gray-400">Then</span>
              <span className="text-xs text-gray-500">{first ? format(new Date(first.date), 'MMM d, yyyy') : '—'}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {comparison.map((c) => (
                <div key={c.metric} className="p-3 rounded-xl bg-white/5">
                  <span className="text-xs text-gray-400 block">{c.metric}</span>
                  <span className="text-lg font-bold text-white">{c.before.toFixed(1)} {c.unit}</span>
                </div>
              ))}
            </div>
          </GradientCard>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <GradientCard gradient="from-emerald-600/20 to-teal-600/20" className="border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-400">Now</span>
              <span className="text-xs text-gray-500">{latest ? format(new Date(latest.date), 'MMM d, yyyy') : '—'}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {comparison.map((c) => (
                <div key={c.metric} className="p-3 rounded-xl bg-white/5">
                  <span className="text-xs text-gray-400 block">{c.metric}</span>
                  <span className="text-lg font-bold text-white">{c.after.toFixed(1)} {c.unit}</span>
                </div>
              ))}
            </div>
          </GradientCard>
        </motion.div>
      </div>

      <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {comparison.map((c, i) => {
                const diff = c.after - c.before
                const isPositive = diff > 0
                const isGood = c.metric === 'Chest' || c.metric === 'Arms' || c.metric === 'Muscle Mass' ? isPositive : !isPositive
                return (
                  <motion.div
                    key={c.metric}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center',
                        isGood ? 'bg-green-500/20' : 'bg-red-500/20'
                      )}>
                        {isGood ? <ArrowDownRight className="w-4 h-4 text-green-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                      </div>
                      <div>
                        <span className="text-sm text-white font-medium">{c.metric}</span>
                        <p className="text-xs text-gray-500">{c.before.toFixed(1)} → {c.after.toFixed(1)} {c.unit}</p>
                      </div>
                    </div>
                    <span className={cn('text-sm font-bold', isGood ? 'text-green-400' : 'text-red-400')}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-pink-400" />
              Progress Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Front', 'Side', 'Back', 'Progress'].map((label) => (
                <div key={label} className="aspect-[3/4] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-purple-500/30 transition-colors cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-600" />
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-[10px] text-gray-600">Tap to add</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <AppLayout title="Body Analytics">
      <div className="max-w-[1600px] mx-auto">
        <Tabs defaultValue="overview">
          <TabTriggers className="mb-6">
            <TabTrigger value="overview" label="Overview" />
            <TabTrigger value="measurements" label="Measurements" />
            <TabTrigger value="trends" label="Trends" />
            <TabTrigger value="compare" label="Compare" />
          </TabTriggers>
          <TabContent value="overview"><OverviewTab /></TabContent>
          <TabContent value="measurements"><MeasurementsTab /></TabContent>
          <TabContent value="trends"><TrendsTab /></TabContent>
          <TabContent value="compare"><CompareTab /></TabContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}


