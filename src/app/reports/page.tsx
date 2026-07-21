'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Download, TrendingUp, Dumbbell, Utensils, Moon, Trophy,
  Activity, Heart, ArrowRight, Calendar, Clock, Sparkles, Eye,
  BarChart3, PieChart as PieChartIcon,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, GradientCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { format, subDays, subWeeks } from 'date-fns'
import Link from 'next/link'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/5'

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

const CHART_COLORS = {
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  cyan: '#06b6d4',
}

interface ReportCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  dateRange: string
  color: string
  gradient: string
  generated: boolean
}

const reportCards: ReportCard[] = [
  {
    id: 'weekly-health',
    title: 'Weekly Health',
    description: 'Heart rate, blood pressure, SpO2, and body temperature trends',
    icon: <Heart className="w-6 h-6" />,
    dateRange: 'Jul 14 - Jul 20, 2025',
    color: 'text-red-400',
    gradient: 'from-red-600/20 to-pink-600/20',
    generated: true,
  },
  {
    id: 'monthly-fitness',
    title: 'Monthly Fitness',
    description: 'Workout frequency, volume, calories burned, and strength progression',
    icon: <Dumbbell className="w-6 h-6" />,
    dateRange: 'Jun 21 - Jul 20, 2025',
    color: 'text-purple-400',
    gradient: 'from-purple-600/20 to-violet-600/20',
    generated: true,
  },
  {
    id: 'nutrition',
    title: 'Nutrition Report',
    description: 'Calorie intake, macro distribution, meal patterns, and nutritional gaps',
    icon: <Utensils className="w-6 h-6" />,
    dateRange: 'Jul 14 - Jul 20, 2025',
    color: 'text-green-400',
    gradient: 'from-green-600/20 to-emerald-600/20',
    generated: true,
  },
  {
    id: 'workout',
    title: 'Workout Analysis',
    description: 'Exercise breakdown, muscle group distribution, and performance metrics',
    icon: <Activity className="w-6 h-6" />,
    dateRange: 'Jul 14 - Jul 20, 2025',
    color: 'text-blue-400',
    gradient: 'from-blue-600/20 to-cyan-600/20',
    generated: false,
  },
  {
    id: 'sleep',
    title: 'Sleep Quality',
    description: 'Sleep duration, quality score, bedtime consistency, and patterns',
    icon: <Moon className="w-6 h-6" />,
    dateRange: 'Jul 7 - Jul 20, 2025',
    color: 'text-indigo-400',
    gradient: 'from-indigo-600/20 to-purple-600/20',
    generated: false,
  },
  {
    id: 'sports-performance',
    title: 'Sports Performance',
    description: 'Activity-specific metrics, endurance, and sport statistics',
    icon: <Trophy className="w-6 h-6" />,
    dateRange: 'Jun 21 - Jul 20, 2025',
    color: 'text-amber-400',
    gradient: 'from-amber-600/20 to-orange-600/20',
    generated: false,
  },
]

function GeneratedPreview() {
  const workouts = useStore((s) => s.workouts)
  const meals = useStore((s) => s.meals)

  const weeklyCalories = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i)
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayMeals = meals.filter((m) => m.date === dayStr)
    const dayWorkouts = workouts.filter((w) => w.date === dayStr)
    return {
      day: format(day, 'EEE'),
      consumed: dayMeals.reduce((s, m) => s + m.totalCalories, 0),
      burned: dayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0),
    }
  })

  const macroData = [
    { name: 'Protein', value: 146, fill: CHART_COLORS.purple },
    { name: 'Carbs', value: 245, fill: CHART_COLORS.blue },
    { name: 'Fat', value: 72, fill: CHART_COLORS.amber },
  ]

  const workoutTypes = [
    { type: 'Strength', count: 4, fill: CHART_COLORS.purple },
    { type: 'Cardio', count: 2, fill: CHART_COLORS.blue },
    { type: 'Flexibility', count: 1, fill: CHART_COLORS.green },
  ]

  return (
    <motion.div custom={7} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className={CARD_HOVER}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <CardTitle>Weekly Health Report Preview</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="success">Generated</Badge>
              <Button variant="secondary" size="sm">
                <Eye className="w-3.5 h-3.5" /> View Full
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calorie Chart */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Calorie Balance</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyCalories} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="consumed" name="Consumed" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar dataKey="burned" name="Burned" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Macro Pie */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Macro Distribution</p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={macroData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={4} dataKey="value" stroke="none">
                      {macroData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip {...chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {macroData.map((m) => (
                    <div key={m.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.fill }} />
                      <span className="text-xs text-gray-400">{m.name}</span>
                      <span className="text-xs text-white font-medium">{m.value}g</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Workout Types */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Workout Breakdown</p>
              <div className="space-y-3">
                {workoutTypes.map((wt) => (
                  <div key={wt.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300">{wt.type}</span>
                      <span className="text-sm text-white font-medium">{wt.count} sessions</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: wt.fill }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(wt.count / 7) * 100}%` }}
                        transition={{ duration: 1, delay: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
            {[
              { label: 'Avg Calories', value: '2,252', sub: '/day', color: 'text-purple-400' },
              { label: 'Workouts', value: '6', sub: 'sessions', color: 'text-green-400' },
              { label: 'Avg Sleep', value: '7.3h', sub: '/night', color: 'text-indigo-400' },
              { label: 'Health Score', value: '87', sub: '/100', color: 'text-pink-400' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-white/[0.03]">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className={cn('text-xl font-bold mt-1', stat.color)}>{stat.value}</p>
                <p className="text-[10px] text-gray-600">{stat.sub}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ReportHistory() {
  const pastReports = [
    { id: 'r_001', title: 'Weekly Health Report', date: 'Jul 14, 2025', type: 'health', status: 'completed' },
    { id: 'r_002', title: 'Monthly Fitness Report', date: 'Jun 30, 2025', type: 'fitness', status: 'completed' },
    { id: 'r_003', title: 'Nutrition Report', date: 'Jul 7, 2025', type: 'nutrition', status: 'completed' },
    { id: 'r_004', title: 'Sleep Quality Report', date: 'Jun 28, 2025', type: 'sleep', status: 'completed' },
    { id: 'r_005', title: 'Sports Performance', date: 'Jun 21, 2025', type: 'sports', status: 'completed' },
  ]

  const typeColors: Record<string, string> = {
    health: 'bg-red-500/20 text-red-400',
    fitness: 'bg-purple-500/20 text-purple-400',
    nutrition: 'bg-green-500/20 text-green-400',
    sleep: 'bg-indigo-500/20 text-indigo-400',
    sports: 'bg-amber-500/20 text-amber-400',
  }

  return (
    <motion.div custom={8} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className={CARD_HOVER}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <CardTitle>Report History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pastReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.08 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-sm', typeColors[report.type] || 'bg-gray-500/20 text-gray-400')}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{report.title}</p>
                    <p className="text-xs text-gray-500">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-[10px]">Completed</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ReportsPage() {
  return (
    <AppLayout title="Reports">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCards.map((report, i) => (
            <motion.div key={report.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible">
              <Link href={report.generated ? `/reports/${report.id}` : '#'}>
                <GradientCard
                  gradient={report.gradient}
                  className={cn(CARD_HOVER, 'h-full group')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-white/10', report.color)}>
                      {report.icon}
                    </div>
                    {report.generated ? (
                      <Badge variant="success" className="text-[10px]">Ready</Badge>
                    ) : (
                      <Badge variant="default" className="text-[10px]">Pending</Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {report.dateRange}
                    </div>
                    <Button variant={report.generated ? 'default' : 'secondary'} size="sm" className="group-hover:shadow-lg group-hover:shadow-purple-500/20">
                      {report.generated ? 'View Report' : 'Generate'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </GradientCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Generated Report Preview */}
        <GeneratedPreview />

        {/* Report History */}
        <ReportHistory />

        {/* Export Section */}
        <motion.div custom={9} variants={fadeInUp} initial="hidden" animate="visible">
          <GradientCard gradient="from-purple-600/20 to-blue-600/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-purple-400" />
                  Export All Reports
                </h3>
                <p className="text-sm text-gray-400 mt-1">Download your complete health history as a PDF report</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary">
                  <FileText className="w-4 h-4" /> Export PDF
                </Button>
                <Button>
                  <BarChart3 className="w-4 h-4" /> Export CSV
                </Button>
              </div>
            </div>
          </GradientCard>
        </motion.div>
      </div>
    </AppLayout>
  )
}
