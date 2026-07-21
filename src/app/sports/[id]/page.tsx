'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Timer, Flame, Heart, MapPin, TrendingUp, TrendingDown,
  Share2, Trash2, Edit3, Cloud, Sun, Thermometer, Trophy,
} from 'lucide-react'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid, BarChart, Bar,
} from 'recharts'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: 'rgba(15, 15, 25, 0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '12px',
  },
}

const SPORT_EMOJIS: Record<string, string> = {
  Football: '⚽', Cricket: '🏏', Badminton: '🏸', Basketball: '🏀',
  Running: '🏃', Cycling: '🚴', Swimming: '🏊', Tennis: '🎾',
  'Table Tennis': '🏓', Volleyball: '🏐', Kabaddi: '🤼',
}

const heartRateData = [
  { time: '0:00', bpm: 72 }, { time: '5:00', bpm: 98 }, { time: '10:00', bpm: 128 },
  { time: '15:00', bpm: 145 }, { time: '20:00', bpm: 155 }, { time: '25:00', bpm: 162 },
  { time: '30:00', bpm: 158 }, { time: '35:00', bpm: 150 }, { time: '40:00', bpm: 142 },
  { time: '45:00', bpm: 130 }, { time: '50:00', bpm: 105 }, { time: '55:00', bpm: 88 },
]

const paceData = [
  { km: '1', pace: '5:32' }, { km: '2', pace: '5:18' }, { km: '3', pace: '5:05' },
  { km: '4', pace: '5:12' }, { km: '5', pace: '5:28' },
]

const comparisonData = [
  { metric: 'Duration', current: 45, previous: 40 },
  { metric: 'Calories', current: 380, previous: 340 },
  { metric: 'Distance', current: 5.2, previous: 4.8 },
  { metric: 'Avg HR', current: 142, previous: 138 },
]

export default function SportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const activities = useStore((s) => s.activities)
  const activity = activities.find((a) => a.id === params.id)

  const sport = activity?.sport || 'Running'
  const emoji = SPORT_EMOJIS[sport] || '🏃'
  const duration = activity?.duration || 45
  const calories = activity?.caloriesBurned || 380
  const distance = activity?.distance || 5.2
  const heartRate = activity?.heartRate || 142
  const date = activity?.date || format(new Date(), 'yyyy-MM-dd')

  return (
    <AppLayout title="Sport Detail">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sports
          </Button>
        </motion.div>

        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-white/10">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{emoji}</div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{sport} Session</h1>
                    <p className="text-gray-400">{date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
                    <Edit3 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white">
                    <Share2 className="w-4 h-4 mr-1" /> Share
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Duration', value: `${duration} min`, icon: Timer, color: 'text-blue-400' },
            { label: 'Calories', value: `${calories} kcal`, icon: Flame, color: 'text-orange-400' },
            { label: 'Distance', value: `${distance} km`, icon: MapPin, color: 'text-green-400' },
            { label: 'Avg Heart Rate', value: `${heartRate} BPM`, icon: Heart, color: 'text-red-400' },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i + 1} variants={fadeInUp} initial="hidden" animate="visible">
              <Card className="bg-white/[0.05] border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={cn('w-4 h-4', stat.color)} />
                    <span className="text-xs text-gray-400">{stat.label}</span>
                  </div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
            <Card className="bg-white/[0.05] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">Heart Rate Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  {[
                    { label: 'Rest', range: '<100', color: 'bg-green-500', pct: '10%' },
                    { label: 'Fat Burn', range: '100-140', color: 'bg-yellow-500', pct: '25%' },
                    { label: 'Cardio', range: '140-170', color: 'bg-orange-500', pct: '50%' },
                    { label: 'Peak', range: '170+', color: 'bg-red-500', pct: '15%' },
                  ].map((zone) => (
                    <div key={zone.label} className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn('w-2 h-2 rounded-full', zone.color)} />
                        <span className="text-xs text-gray-400">{zone.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{zone.range} BPM</p>
                      <p className="text-sm font-medium text-white">{zone.pct}</p>
                    </div>
                  ))}
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={heartRateData}>
                      <defs>
                        <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} domain={[60, 180]} />
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE.contentStyle} />
                      <Area type="monotone" dataKey="bpm" stroke="#ef4444" fill="url(#hrGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div custom={6} variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="bg-white/[0.05] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Timer, label: 'Start Time', value: '6:30 AM' },
                  { icon: Timer, label: 'End Time', value: '7:15 AM' },
                  { icon: Sun, label: 'Weather', value: 'Sunny, 28°C' },
                  { icon: MapPin, label: 'Route', value: 'City Park Loop' },
                  { icon: Heart, label: 'Max HR', value: '162 BPM' },
                  { icon: Flame, label: 'Avg HR', value: '142 BPM' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{item.label}</span>
                    </div>
                    <span className="text-sm text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div custom={7} variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="bg-white/[0.05] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">Pace per Kilometer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="km" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                      <Tooltip contentStyle={CHART_TOOLTIP_STYLE.contentStyle} />
                      <Bar dataKey="pace" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div custom={8} variants={fadeInUp} initial="hidden" animate="visible">
            <Card className="bg-white/[0.05] border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">vs Last Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {comparisonData.map((item) => {
                  const diff = item.current - item.previous
                  const improved = item.metric === 'Avg HR' ? diff < 0 : diff > 0
                  return (
                    <div key={item.metric} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">{item.current}</span>
                        {improved ? (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" /> +{Math.abs(diff)}
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-400 text-xs">
                            <TrendingDown className="w-3 h-3 mr-1" /> {diff}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
