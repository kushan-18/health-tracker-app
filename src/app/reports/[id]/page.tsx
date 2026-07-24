'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Download, Share2, Printer, Calendar, TrendingUp,
  Heart, Dumbbell, Utensils, Moon, Activity, Brain, Flame,
  ArrowUpRight, ArrowDownRight, Minus, Sparkles, FileText,
  BarChart3, PieChart as PieChartIcon, Zap, Target, Crown, Star, Trophy,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard, GradientCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { format, subDays } from 'date-fns'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20'

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
  indigo: '#6366f1',
}

interface ReportData {
  title: string
  subtitle: string
  dateRange: string
  sections: ReportSection[]
  summary: ReportSummary
}

interface ReportSection {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  charts: ReportChart[]
  insights: string[]
}

interface ReportChart {
  type: 'area' | 'bar' | 'line' | 'pie' | 'radar'
  title: string
  data: Record<string, unknown>[]
  dataKey: string
  secondDataKey?: string
  thirdDataKey?: string
  nameKey?: string
  color?: string
}

interface ReportSummary {
  stats: { label: string; value: string; change?: { value: number; positive: boolean }; icon: React.ReactNode }[]
  aiInsights: string[]
  recommendations: string[]
}

function getReportData(id: string, workouts: ReturnType<typeof useStore.getState>['workouts'], meals: ReturnType<typeof useStore.getState>['meals'], metrics: ReturnType<typeof useStore.getState>['metrics'], sleep: ReturnType<typeof useStore.getState>['records']): ReportData {
  const weeklyCalories = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i)
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayMeals = meals.filter((m) => m.date === dayStr)
    const dayWorkouts = workouts.filter((w) => w.date === dayStr)
    return {
      day: format(day, 'EEE'),
      consumed: dayMeals.reduce((s, m) => s + m.totalCalories, 0),
      burned: dayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0),
      net: dayMeals.reduce((s, m) => s + m.totalCalories, 0) - dayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0),
    }
  })

  const weeklyMacros = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i)
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayMeals = meals.filter((m) => m.date === dayStr)
    return {
      day: format(day, 'EEE'),
      protein: dayMeals.reduce((s, m) => s + m.totalProtein, 0),
      carbs: dayMeals.reduce((s, m) => s + m.totalCarbs, 0),
      fat: dayMeals.reduce((s, m) => s + m.totalFat, 0),
    }
  })

  const sleepData = sleep.slice(0, 7).reverse().map((s) => ({
    day: format(new Date(s.date), 'EEE'),
    duration: s.duration,
    quality: s.quality,
  }))

  const heartRateData = metrics.filter((m) => m.type === 'heart_rate').slice(-7).map((m) => ({
    day: format(new Date(m.date), 'EEE'),
    bpm: m.value,
  }))

  const workoutTypes = [
    { type: 'Strength', count: workouts.filter((w) => w.type === 'strength').length, fill: CHART_COLORS.purple },
    { type: 'Cardio', count: workouts.filter((w) => w.type === 'cardio').length, fill: CHART_COLORS.blue },
    { type: 'Flexibility', count: workouts.filter((w) => w.type === 'flexibility').length, fill: CHART_COLORS.green },
    { type: 'Sports', count: workouts.filter((w) => w.type === 'sports').length, fill: CHART_COLORS.amber },
  ]

  const muscleGroupData = [
    { muscle: 'Chest', sessions: 3 },
    { muscle: 'Back', sessions: 3 },
    { muscle: 'Legs', sessions: 3 },
    { muscle: 'Shoulders', sessions: 2 },
    { muscle: 'Arms', sessions: 2 },
    { muscle: 'Core', sessions: 1 },
  ]

  const bloodPressure = metrics.filter((m) => m.type === 'blood_pressure_systolic').slice(-7).map((m, i) => {
    const diastolic = metrics.filter((mm) => mm.type === 'blood_pressure_diastolic').slice(-7)
    return {
      day: format(new Date(m.date), 'EEE'),
      systolic: m.value,
      diastolic: diastolic[i]?.value || 80,
    }
  })

  const reports: Record<string, ReportData> = {
    'weekly-health': {
      title: 'Weekly Health Report',
      subtitle: 'Comprehensive health metrics analysis',
      dateRange: 'Jul 14 - Jul 20, 2025',
      sections: [
        {
          id: 'heart',
          title: 'Heart Rate Trends',
          icon: <Heart className="w-5 h-5" />,
          color: 'text-red-400',
          charts: [
            {
              type: 'area',
              title: 'Daily Heart Rate',
              data: heartRateData,
              dataKey: 'bpm',
              color: CHART_COLORS.red,
            },
          ],
          insights: [
            'Average resting heart rate: 72 bpm (healthy range)',
            'Heart rate variability indicates good recovery',
            'Peak heart rate during workouts: 165 bpm',
          ],
        },
        {
          id: 'blood',
          title: 'Blood Pressure',
          icon: <Activity className="w-5 h-5" />,
          color: 'text-pink-400',
          charts: [
            {
              type: 'line',
              title: 'Blood Pressure Readings',
              data: bloodPressure,
              dataKey: 'systolic',
              secondDataKey: 'diastolic',
              color: CHART_COLORS.pink,
            },
          ],
          insights: [
            'Systolic average: 122 mmHg (normal)',
            'Diastolic average: 78 mmHg (normal)',
            'No significant fluctuations detected',
          ],
        },
        {
          id: 'spo2',
          title: 'Blood Oxygen (SpO2)',
          icon: <Zap className="w-5 h-5" />,
          color: 'text-cyan-400',
          charts: [
            {
              type: 'bar',
              title: 'SpO2 Levels',
              data: metrics.filter((m) => m.type === 'spo2').slice(-7).map((m) => ({ day: format(new Date(m.date), 'EEE'), value: m.value })),
              dataKey: 'value',
              color: CHART_COLORS.cyan,
            },
          ],
          insights: [
            'Average SpO2: 98% (excellent)',
            'All readings within healthy range (95-100%)',
          ],
        },
      ],
      summary: {
        stats: [
          { label: 'Avg Heart Rate', value: '72 bpm', change: { value: 3, positive: true }, icon: <Heart className="w-5 h-5" /> },
          { label: 'Avg Blood Pressure', value: '122/78', change: { value: 2, positive: true }, icon: <Activity className="w-5 h-5" /> },
          { label: 'Avg SpO2', value: '98%', change: { value: 1, positive: true }, icon: <Zap className="w-5 h-5" /> },
          { label: 'Health Score', value: '87/100', change: { value: 5, positive: true }, icon: <Target className="w-5 h-5" /> },
        ],
        aiInsights: [
          'Your cardiovascular health is excellent. Resting heart rate is in the optimal zone.',
          'Blood pressure readings are consistently within normal range. Keep up the good work!',
          'SpO2 levels are stable and indicate healthy lung function.',
        ],
        recommendations: [
          'Continue regular cardio exercise to maintain heart health',
          'Consider adding meditation to further improve heart rate variability',
          'Monitor blood pressure during high-intensity workouts',
        ],
      },
    },
    'monthly-fitness': {
      title: 'Monthly Fitness Report',
      subtitle: 'Workout frequency, volume, and strength progression',
      dateRange: 'Jun 21 - Jul 20, 2025',
      sections: [
        {
          id: 'calories',
          title: 'Calorie Balance',
          icon: <Flame className="w-5 h-5" />,
          color: 'text-orange-400',
          charts: [
            {
              type: 'bar',
              title: 'Calories Consumed vs Burned',
              data: weeklyCalories,
              dataKey: 'consumed',
              secondDataKey: 'burned',
              color: CHART_COLORS.purple,
            },
          ],
          insights: [
            'Total calories burned this week: 3,350',
            'Average daily intake: 2,252 calories',
            'Caloric surplus: +350 cal/day (optimal for muscle gain)',
          ],
        },
        {
          id: 'macros',
          title: 'Macro Distribution',
          icon: <Utensils className="w-5 h-5" />,
          color: 'text-green-400',
          charts: [
            {
              type: 'area',
              title: 'Daily Macros',
              data: weeklyMacros,
              dataKey: 'protein',
              secondDataKey: 'carbs',
              thirdDataKey: 'fat',
              color: CHART_COLORS.green,
            },
          ],
          insights: [
            'Average protein: 146g/day (target: 160g)',
            'Carb intake: 245g/day — well distributed around workouts',
            'Fat intake: 72g/day — within recommended range',
          ],
        },
        {
          id: 'workouts',
          title: 'Workout Analysis',
          icon: <Dumbbell className="w-5 h-5" />,
          color: 'text-purple-400',
          charts: [
            {
              type: 'pie',
              title: 'Workout Type Distribution',
              data: workoutTypes,
              dataKey: 'count',
              nameKey: 'type',
              color: CHART_COLORS.purple,
            },
            {
              type: 'radar',
              title: 'Muscle Group Coverage',
              data: muscleGroupData,
              dataKey: 'sessions',
              nameKey: 'muscle',
              color: CHART_COLORS.indigo,
            },
          ],
          insights: [
            '6 workouts completed this week (target: 5)',
            'Total volume increased by 8% vs last week',
            'New PR on bench press: 95kg!',
          ],
        },
      ],
      summary: {
        stats: [
          { label: 'Workouts', value: '6', change: { value: 20, positive: true }, icon: <Dumbbell className="w-5 h-5" /> },
          { label: 'Calories Burned', value: '3,350', change: { value: 12, positive: true }, icon: <Flame className="w-5 h-5" /> },
          { label: 'Avg Duration', value: '62 min', change: { value: 5, positive: true }, icon: <Target className="w-5 h-5" /> },
          { label: 'Total Volume', value: '12.5t', change: { value: 8, positive: true }, icon: <TrendingUp className="w-5 h-5" /> },
        ],
        aiInsights: [
          'Excellent training consistency! You exceeded your weekly workout target.',
          'Volume progression is on track. Progressive overload is working well.',
          'Consider adding an extra pulling session to balance push/pull ratio.',
        ],
        recommendations: [
          'Focus on hitting protein target of 160g consistently',
          'Add a dedicated shoulder day to improve muscle group balance',
          'Consider deload week in 2 weeks to prevent overtraining',
        ],
      },
    },
    'nutrition': {
      title: 'Nutrition Report',
      subtitle: 'Calorie intake, macro distribution, and meal patterns',
      dateRange: 'Jul 14 - Jul 20, 2025',
      sections: [
        {
          id: 'calories',
          title: 'Calorie Tracking',
          icon: <Flame className="w-5 h-5" />,
          color: 'text-orange-400',
          charts: [
            {
              type: 'area',
              title: 'Daily Calorie Intake',
              data: weeklyCalories,
              dataKey: 'consumed',
              color: CHART_COLORS.amber,
            },
          ],
          insights: [
            'Average daily calories: 2,252 (target: 2,800)',
            'Most calorie-dense meal: Lunch (837 avg)',
            'Protein shake contributing 399 cal post-workout',
          ],
        },
        {
          id: 'macros',
          title: 'Macro Breakdown',
          icon: <Utensils className="w-5 h-5" />,
          color: 'text-green-400',
          charts: [
            {
              type: 'pie',
              title: 'Weekly Macro Split',
              data: [
                { name: 'Protein', value: 146, fill: CHART_COLORS.purple },
                { name: 'Carbs', value: 245, fill: CHART_COLORS.blue },
                { name: 'Fat', value: 72, fill: CHART_COLORS.amber },
              ],
              dataKey: 'value',
              nameKey: 'name',
            },
            {
              type: 'line',
              title: 'Daily Protein Intake',
              data: weeklyMacros,
              dataKey: 'protein',
              color: CHART_COLORS.purple,
            },
          ],
          insights: [
            'Protein distribution is good — averaging 21g per meal',
            'Carb timing is well-aligned with workout schedule',
            'Fiber intake could be increased (current: ~18g/day)',
          ],
        },
        {
          id: 'meals',
          title: 'Meal Patterns',
          icon: <Calendar className="w-5 h-5" />,
          color: 'text-blue-400',
          charts: [
            {
              type: 'bar',
              title: 'Calories by Meal Type',
              data: [
                { meal: 'Breakfast', calories: 411, fill: CHART_COLORS.purple },
                { meal: 'Lunch', calories: 837, fill: CHART_COLORS.blue },
                { meal: 'Snack', calories: 399, fill: CHART_COLORS.green },
                { meal: 'Dinner', calories: 605, fill: CHART_COLORS.amber },
              ],
              dataKey: 'calories',
            },
          ],
          insights: [
            'Consistent meal timing throughout the week',
            'Breakfast protein could be increased',
            'Post-workout nutrition is on point',
          ],
        },
      ],
      summary: {
        stats: [
          { label: 'Avg Calories', value: '2,252', change: { value: 3, positive: false }, icon: <Flame className="w-5 h-5" /> },
          { label: 'Avg Protein', value: '146g', change: { value: 5, positive: false }, icon: <Target className="w-5 h-5" /> },
          { label: 'Meals Logged', value: '28', icon: <Utensils className="w-5 h-5" /> },
          { label: 'Streak', value: '14 days', icon: <Zap className="w-5 h-5" /> },
        ],
        aiInsights: [
          'You are consistently under-eating by ~550 calories. This may hinder muscle growth.',
          'Protein is close to target but could be optimized with one additional shake.',
          'Meal timing is excellent — nutrients are well-distributed throughout the day.',
        ],
        recommendations: [
          'Add a 500-calorie meal or shake to reach daily target',
          'Increase breakfast protein with extra eggs or whey',
          'Add more fiber-rich foods: vegetables, whole grains',
        ],
      },
    },
    'workout': {
      title: 'Workout Analysis',
      subtitle: 'Exercise breakdown and performance metrics',
      dateRange: 'Jul 14 - Jul 20, 2025',
      sections: [
        {
          id: 'volume',
          title: 'Training Volume',
          icon: <Dumbbell className="w-5 h-5" />,
          color: 'text-purple-400',
          charts: [
            {
              type: 'bar',
              title: 'Volume by Day',
              data: Array.from({ length: 7 }, (_, i) => {
                const day = subDays(new Date(), 6 - i)
                const dayStr = format(day, 'yyyy-MM-dd')
                const dayWorkouts = workouts.filter((w) => w.date === dayStr)
                return {
                  day: format(day, 'EEE'),
                  volume: dayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0),
                }
              }),
              dataKey: 'volume',
              color: CHART_COLORS.purple,
            },
          ],
          insights: [
            'Total weekly volume: 3,350 calories burned',
            'Average per session: 558 calories',
            'Peak day: Tuesday (650 cal)',
          ],
        },
        {
          id: 'types',
          title: 'Exercise Distribution',
          icon: <Activity className="w-5 h-5" />,
          color: 'text-blue-400',
          charts: [
            {
              type: 'pie',
              title: 'Workout Types',
              data: workoutTypes,
              dataKey: 'count',
              nameKey: 'type',
            },
            {
              type: 'radar',
              title: 'Muscle Group Frequency',
              data: muscleGroupData,
              dataKey: 'sessions',
              nameKey: 'muscle',
            },
          ],
          insights: [
            'Strength training dominates (60% of sessions)',
            'Good cardio diversity with running and cycling',
            'Flexibility work could be increased',
          ],
        },
      ],
      summary: {
        stats: [
          { label: 'Total Workouts', value: '6', icon: <Dumbbell className="w-5 h-5" /> },
          { label: 'Total Duration', value: '6.2 hrs', icon: <Calendar className="w-5 h-5" /> },
          { label: 'Calories Burned', value: '3,350', icon: <Flame className="w-5 h-5" /> },
          { label: 'New PRs', value: '2', change: { value: 100, positive: true }, icon: <TrendingUp className="w-5 h-5" /> },
        ],
        aiInsights: [
          'Training frequency is excellent. You are well above average for consistency.',
          'Bench press PR of 95kg is impressive at your body weight!',
          'Consider periodizing your training for continued strength gains.',
        ],
        recommendations: [
          'Add yoga or stretching 2x per week for flexibility',
          'Track RPE (Rate of Perceived Exertion) for better load management',
          'Consider progressive overload on compound lifts',
        ],
      },
    },
    'sleep': {
      title: 'Sleep Quality Report',
      subtitle: 'Sleep duration, quality, and patterns',
      dateRange: 'Jul 7 - Jul 20, 2025',
      sections: [
        {
          id: 'duration',
          title: 'Sleep Duration',
          icon: <Moon className="w-5 h-5" />,
          color: 'text-indigo-400',
          charts: [
            {
              type: 'area',
              title: 'Nightly Sleep Duration',
              data: sleepData,
              dataKey: 'duration',
              color: CHART_COLORS.indigo,
            },
          ],
          insights: [
            'Average sleep: 7.3 hours (target: 8 hours)',
            'Consistent bedtime between 11:00-11:30 PM',
            'Most restful night: Monday (8.2 hours)',
          ],
        },
        {
          id: 'quality',
          title: 'Sleep Quality Score',
          icon: <Star className="w-5 h-5" />,
          color: 'text-purple-400',
          charts: [
            {
              type: 'bar',
              title: 'Quality Score by Night',
              data: sleepData,
              dataKey: 'quality',
              color: CHART_COLORS.purple,
            },
          ],
          insights: [
            'Average quality score: 8.1/10',
            'Sleep efficiency is improving week over week',
            'Weekend sleep is 0.5 hours longer on average',
          ],
        },
      ],
      summary: {
        stats: [
          { label: 'Avg Duration', value: '7.3h', change: { value: 5, positive: true }, icon: <Moon className="w-5 h-5" /> },
          { label: 'Avg Quality', value: '8.1/10', icon: <Target className="w-5 h-5" /> },
          { label: 'Bedtime', value: '11:15 PM', icon: <Calendar className="w-5 h-5" /> },
          { label: 'Consistency', value: '92%', icon: <Zap className="w-5 h-5" /> },
        ],
        aiInsights: [
          'Your sleep is good but could be optimized. Aim for 7.5-8 hours.',
          'Consistent bedtime is a strength — keep it up!',
          'Consider reducing screen time 30 min before bed.',
        ],
        recommendations: [
          'Set a 10:30 PM wind-down alarm',
          'Avoid caffeine after 2 PM',
          'Try white noise or meditation for deeper sleep',
        ],
      },
    },
    'sports-performance': {
      title: 'Sports Performance',
      subtitle: 'Activity-specific metrics and sport statistics',
      dateRange: 'Jun 21 - Jul 20, 2025',
      sections: [
        {
          id: 'activities',
          title: 'Sports Activities',
          icon: <Trophy className="w-5 h-5" />,
          color: 'text-amber-400',
          charts: [
            {
              type: 'bar',
              title: 'Calories Burned by Sport',
              data: [
                { sport: 'Cricket', calories: 720, fill: CHART_COLORS.amber },
                { sport: 'Running', calories: 380, fill: CHART_COLORS.green },
                { sport: 'Football', calories: 680, fill: CHART_COLORS.blue },
                { sport: 'Cycling', calories: 420, fill: CHART_COLORS.purple },
                { sport: 'Swimming', calories: 350, fill: CHART_COLORS.cyan },
              ],
              dataKey: 'calories',
            },
          ],
          insights: [
            'Cricket burns the most calories per session (720 cal)',
            'Running sessions are the most frequent',
            'Swimming provides excellent full-body workout',
          ],
        },
        {
          id: 'endurance',
          title: 'Endurance Metrics',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'text-green-400',
          charts: [
            {
              type: 'line',
              title: 'Distance by Activity',
              data: [
                { week: 'Week 1', running: 5.2, cycling: 18, swimming: 1.5 },
                { week: 'Week 2', running: 5.8, cycling: 20, swimming: 1.8 },
                { week: 'Week 3', running: 6.1, cycling: 22, swimming: 2.0 },
                { week: 'Week 4', running: 5.2, cycling: 18, swimming: 1.5 },
              ],
              dataKey: 'running',
              secondDataKey: 'cycling',
              thirdDataKey: 'swimming',
            },
          ],
          insights: [
            'Running endurance improving — pace decreased from 7:00 to 6:44 /km',
            'Cycling distance consistent at 18-22 km per session',
            'Swimming lap count increased by 15%',
          ],
        },
      ],
      summary: {
        stats: [
          { label: 'Sports Sessions', value: '5', icon: <Trophy className="w-5 h-5" /> },
          { label: 'Total Distance', value: '34.2 km', icon: <TrendingUp className="w-5 h-5" /> },
          { label: 'Calories Burned', value: '2,550', icon: <Flame className="w-5 h-5" /> },
          { label: 'Avg Heart Rate', value: '148 bpm', icon: <Heart className="w-5 h-5" /> },
        ],
        aiInsights: [
          'Great sports diversity! Mixing cardio and skill-based activities.',
          'Cricket stats show solid all-round performance.',
          'Consider adding a dedicated sprint session for explosive power.',
        ],
        recommendations: [
          'Try interval training once a week for speed improvement',
          'Track cricket performance metrics more consistently',
          'Add stretching routines post-sports activities',
        ],
      },
    },
  }

  return reports[id] || reports['weekly-health']
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ChartSection({ section, index }: { section: ReportSection; index: number }) {
  return (
    <motion.div custom={index + 2} variants={fadeInUp} initial="hidden" animate="visible">
      <Card className={CARD_HOVER}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center bg-white/10', section.color)}>
              {section.icon}
            </div>
            <CardTitle className="text-base">{section.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {section.charts.map((chart, ci) => (
              <div key={ci}>
                <p className="text-sm text-gray-400 mb-3">{chart.title}</p>
                <ResponsiveContainer width="100%" height={220}>
                  {chart.type === 'area' ? (
                    <AreaChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey={chart.nameKey || 'day'} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                      <Tooltip {...chartTooltipStyle} />
                      <Area type="monotone" dataKey={chart.dataKey} stroke={chart.color || CHART_COLORS.purple} fill={chart.color || CHART_COLORS.purple} fillOpacity={0.15} strokeWidth={2} />
                      {chart.secondDataKey && <Area type="monotone" dataKey={chart.secondDataKey} stroke={CHART_COLORS.blue} fill={CHART_COLORS.blue} fillOpacity={0.1} strokeWidth={2} />}
                      {chart.thirdDataKey && <Area type="monotone" dataKey={chart.thirdDataKey} stroke={CHART_COLORS.green} fill={CHART_COLORS.green} fillOpacity={0.1} strokeWidth={2} />}
                    </AreaChart>
                  ) : chart.type === 'bar' ? (
                    <BarChart data={chart.data} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey={chart.nameKey || 'day'} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                      <Tooltip {...chartTooltipStyle} />
                      <Bar dataKey={chart.dataKey} fill={chart.color || CHART_COLORS.purple} radius={[4, 4, 0, 0]} opacity={0.85} />
                      {chart.secondDataKey && <Bar dataKey={chart.secondDataKey} fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} opacity={0.85} />}
                    </BarChart>
                  ) : chart.type === 'line' ? (
                    <LineChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey={chart.nameKey || 'day'} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                      <Tooltip {...chartTooltipStyle} />
                      <Line type="monotone" dataKey={chart.dataKey} stroke={chart.color || CHART_COLORS.purple} strokeWidth={2} dot={{ fill: chart.color || CHART_COLORS.purple, r: 3 }} />
                      {chart.secondDataKey && <Line type="monotone" dataKey={chart.secondDataKey} stroke={CHART_COLORS.blue} strokeWidth={2} dot={{ fill: CHART_COLORS.blue, r: 3 }} />}
                      {chart.thirdDataKey && <Line type="monotone" dataKey={chart.thirdDataKey} stroke={CHART_COLORS.green} strokeWidth={2} dot={{ fill: CHART_COLORS.green, r: 3 }} />}
                    </LineChart>
                  ) : chart.type === 'pie' ? (
                    <div className="flex items-center justify-center gap-6">
                      <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                          <Pie data={chart.data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey={chart.dataKey} stroke="none">
                            {chart.data.map((entry, idx) => (
                              <Cell key={idx} fill={(entry as Record<string, unknown>).fill as string || CHART_COLORS.purple} />
                            ))}
                          </Pie>
                          <Tooltip {...chartTooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {chart.data.map((entry, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: (entry as Record<string, unknown>).fill as string || CHART_COLORS.purple }} />
                            <span className="text-xs text-gray-400">{(entry as Record<string, unknown>)[chart.nameKey || 'name'] as string}</span>
                            <span className="text-xs text-white font-medium">{(entry as Record<string, unknown>)[chart.dataKey] as number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <RadarChart data={chart.data}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey={chart.nameKey || 'muscle'} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                      <Radar name="Sessions" dataKey={chart.dataKey} stroke={CHART_COLORS.purple} fill={CHART_COLORS.purple} fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip {...chartTooltipStyle} />
                    </RadarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {section.insights.map((insight, ii) => (
              <div key={ii} className="flex items-start gap-2 text-sm text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                {insight}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ReportDetailPage() {
  const params = useParams()
  const id = params.id as string
  const workouts = useStore((s) => s.workouts)
  const meals = useStore((s) => s.meals)
  const metrics = useStore((s) => s.metrics)
  const sleep = useStore((s) => s.records)

  const report = getReportData(id, workouts, meals, metrics, sleep)

  return (
    <AppLayout title={report.title}>
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link href="/reports" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to Reports
              </Link>
              <h1 className="text-2xl font-bold text-white">{report.title}</h1>
              <p className="text-sm text-gray-400 mt-1">{report.subtitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" /> {report.dateRange}
                </Badge>
                <Badge variant="success" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Generated
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <Printer className="w-4 h-4" /> Print
              </Button>
              <Button variant="secondary" size="sm">
                <Share2 className="w-4 h-4" /> Share
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4" /> Export PDF
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {report.summary.stats.map((stat, i) => (
              <StatCard
                key={i}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                className={CARD_HOVER}
              />
            ))}
          </div>
        </motion.div>

        {/* Chart Sections */}
        {report.sections.map((section, i) => (
          <ChartSection key={section.id} section={section} index={i} />
        ))}

        {/* AI Insights */}
        <motion.div custom={report.sections.length + 2} variants={fadeInUp} initial="hidden" animate="visible">
          <GradientCard gradient="from-purple-600/20 to-blue-600/20">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">AI Insights & Recommendations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Key Insights</p>
                <div className="space-y-3">
                  {report.summary.aiInsights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      {insight}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Recommendations</p>
                <div className="space-y-3">
                  {report.summary.recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      {rec}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </GradientCard>
        </motion.div>

        {/* Export Options */}
        <motion.div custom={report.sections.length + 3} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={CARD_HOVER}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Export this report</p>
                    <p className="text-xs text-gray-500">Download as PDF or share with your doctor</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <FileText className="w-3.5 h-3.5" /> Export PDF
                  </Button>
                  <Button variant="secondary" size="sm">
                    <BarChart3 className="w-3.5 h-3.5" /> Export CSV
                  </Button>
                  <Button size="sm">
                    <Share2 className="w-3.5 h-3.5" /> Share Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}
