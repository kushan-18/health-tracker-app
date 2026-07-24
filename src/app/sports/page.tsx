'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Timer, Play, Pause, StopCircle, Trophy, Medal, Flame, Heart,
  Zap, Target, TrendingUp, Award, Star, Users, ChevronDown, ChevronUp,
  Activity, MapPin, Clock, Dumbbell, CircleDot, Bike, Waves, Table2,
  Volleyball, Swords, Volleyball as VolleyballIcon,
} from 'lucide-react'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid, BarChart, Bar, LineChart, Line, RadarChart,
  PolarGrid, PolarAngleAxis, Radar as RechartsRadar,
} from 'recharts'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard, InteractiveCard, GradientCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabTriggers, TabTrigger, TabContent } from '@/components/ui/tabs'
import { useStore } from '@/lib/store'
import { cn, generateId } from '@/lib/utils'
import type { SportsActivity } from '@/lib/types'
import { format, subDays, isThisWeek, isThisMonth } from 'date-fns'

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
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: '12px',
  },
}

interface SportOption {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  gradient: string
  metrics: string[]
}

const SPORTS: SportOption[] = [
  { id: 'football', name: 'Football', icon: <span className="text-2xl">⚽</span>, color: 'from-green-500/20 to-emerald-500/20', gradient: 'from-green-500 to-emerald-500', metrics: ['Goals', 'Assists', 'Passes', 'Distance'] },
  { id: 'cricket', name: 'Cricket', icon: <span className="text-2xl">🏏</span>, color: 'from-red-500/20 to-pink-500/20', gradient: 'from-red-500 to-pink-500', metrics: ['Runs', 'Wickets', 'Overs', 'Strike Rate'] },
  { id: 'badminton', name: 'Badminton', icon: <span className="text-2xl">🏸</span>, color: 'from-yellow-500/20 to-orange-500/20', gradient: 'from-yellow-500 to-orange-500', metrics: ['Smashes', 'Rallies', 'Points Won', 'Aces'] },
  { id: 'basketball', name: 'Basketball', icon: <span className="text-2xl">🏀</span>, color: 'from-orange-500/20 to-amber-500/20', gradient: 'from-orange-500 to-amber-500', metrics: ['Points', 'Rebounds', 'Assists', 'Steals'] },
  { id: 'running', name: 'Running', icon: <span className="text-2xl">🏃</span>, color: 'from-blue-500/20 to-cyan-500/20', gradient: 'from-blue-500 to-cyan-500', metrics: ['Distance', 'Pace', 'Heart Rate', 'Calories'] },
  { id: 'cycling', name: 'Cycling', icon: <span className="text-2xl">🚴</span>, color: 'from-purple-500/20 to-violet-500/20', gradient: 'from-purple-500 to-violet-500', metrics: ['Distance', 'Speed', 'Elevation', 'Power'] },
  { id: 'swimming', name: 'Swimming', icon: <span className="text-2xl">🏊</span>, color: 'from-cyan-500/20 to-teal-500/20', gradient: 'from-cyan-500 to-teal-500', metrics: ['Laps', 'Stroke Rate', 'Style', 'Distance'] },
  { id: 'tennis', name: 'Tennis', icon: <span className="text-2xl">🎾</span>, color: 'from-lime-500/20 to-green-500/20', gradient: 'from-lime-500 to-green-500', metrics: ['Aces', 'Winners', 'Rallies', 'Sets Won'] },
  { id: 'table_tennis', name: 'Table Tennis', icon: <span className="text-2xl">🏓</span>, color: 'from-indigo-500/20 to-blue-500/20', gradient: 'from-indigo-500 to-blue-500', metrics: ['Smashes', 'Serves', 'Rallies', 'Points'] },
  { id: 'volleyball', name: 'Volleyball', icon: <span className="text-2xl">🏐</span>, color: 'from-amber-500/20 to-yellow-500/20', gradient: 'from-amber-500 to-yellow-500', metrics: ['Spikes', 'Blocks', 'Serves', 'Sets'] },
  { id: 'kabaddi', name: 'Kabaddi', icon: <span className="text-2xl">🤼</span>, color: 'from-red-500/20 to-rose-500/20', gradient: 'from-red-500 to-rose-500', metrics: ['Raids', 'Tackles', 'Points', 'Bonus'] },
]

function ActiveSportsTab() {
  const activities = useStore((s) => s.activities)
  const addActivity = useStore((s) => s.addActivity)
  const [selectedSport, setSelectedSport] = React.useState<SportOption | null>(null)
  const [tracking, setTracking] = React.useState(false)
  const [timerRunning, setTimerRunning] = React.useState(false)
  const [elapsedTime, setElapsedTime] = React.useState(0)
  const [heartRate, setHeartRate] = React.useState(72)
  const [calories, setCalories] = React.useState(0)
  const [sportMetrics, setSportMetrics] = React.useState<Record<string, string>>({})
  const [showComplete, setShowComplete] = React.useState(false)

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerRunning && tracking) {
      interval = setInterval(() => {
        setElapsedTime((p) => p + 1)
        setHeartRate((p) => Math.min(190, p + Math.floor(Math.random() * 3)))
        setCalories(Math.round(elapsedTime / 60 * 10))
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [timerRunning, tracking, elapsedTime])

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const startTracking = (sport: SportOption) => {
    setSelectedSport(sport)
    setTracking(true)
    setTimerRunning(true)
    setElapsedTime(0)
    setHeartRate(72)
    setCalories(0)
    setSportMetrics({})
  }

  const pauseTracking = () => setTimerRunning(false)
  const resumeTracking = () => setTimerRunning(true)

  const stopTracking = () => {
    setTimerRunning(false)
    setShowComplete(true)
  }

  const saveActivity = () => {
    if (!selectedSport) return
    const newActivity: SportsActivity = {
      id: `sa_${generateId()}`,
      userId: 'user_001',
      sport: selectedSport.name,
      duration: Math.round(elapsedTime / 60),
      caloriesBurned: calories,
      heartRate,
      date: new Date().toISOString().split('T')[0],
      stats: Object.fromEntries(
        Object.entries(sportMetrics).map(([k, v]) => [k, v || '0'])
      ),
    }
    addActivity(newActivity)
    setTracking(false)
    setSelectedSport(null)
    setShowComplete(false)
    setElapsedTime(0)
    setCalories(0)
    setHeartRate(72)
    setSportMetrics({})
  }

  const cancelTracking = () => {
    setTracking(false)
    setSelectedSport(null)
    setShowComplete(false)
    setTimerRunning(false)
    setElapsedTime(0)
    setCalories(0)
    setHeartRate(72)
    setSportMetrics({})
  }

  if (tracking && selectedSport) {
    return (
      <div className="space-y-4">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <GradientCard gradient={`${selectedSport.gradient.split(' ')[0]}/20 ${selectedSport.gradient.split(' ')[1] || 'to-blue-600/20'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br', selectedSport.color)}>
                  {selectedSport.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedSport.name} Session</h3>
                  <p className="text-sm text-gray-400 mt-1">{format(new Date(), 'EEEE, MMMM d · h:mm a')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="flex items-center gap-2 text-3xl font-bold text-white font-mono">
                    <Timer className="w-6 h-6 text-purple-400" />
                    {formatTimer(elapsedTime)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Duration</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{heartRate}</p>
                <p className="text-xs text-gray-400">Heart Rate</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{calories}</p>
                <p className="text-xs text-gray-400">Calories</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{Math.round(elapsedTime / 60)}</p>
                <p className="text-xs text-gray-400">Minutes</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{Math.round(calories * 0.7)}</p>
                <p className="text-xs text-gray-400">XP Earned</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {!timerRunning ? (
                <Button onClick={resumeTracking} className="flex-1" size="lg">
                  <Play className="w-5 h-5" /> Resume
                </Button>
              ) : (
                <Button onClick={pauseTracking} variant="secondary" className="flex-1" size="lg">
                  <Pause className="w-5 h-5" /> Pause
                </Button>
              )}
              <Button onClick={stopTracking} variant="destructive" className="flex-1" size="lg">
                <StopCircle className="w-5 h-5" /> Finish
              </Button>
            </div>
          </GradientCard>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" /> Sport-Specific Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {selectedSport.metrics.map((metric) => (
                  <div key={metric} className="p-3 rounded-xl bg-white/5">
                    <label className="text-xs text-gray-400 block mb-1">{metric}</label>
                    <input
                      type="text"
                      value={sportMetrics[metric] || ''}
                      onChange={(e) => setSportMetrics({ ...sportMetrics, [metric]: e.target.value })}
                      placeholder="0"
                      className="w-full text-center bg-white/5 border border-white/10 rounded-lg py-2 text-white text-sm focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {showComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelTracking} />
              <div className="relative z-50 w-full max-w-md rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-xl p-6 shadow-2xl">
                <div className="text-center mb-6">
                  <div className={cn('w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-br mb-4', selectedSport.color)}>
                    {selectedSport.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">Workout Complete!</h3>
                  <p className="text-sm text-gray-400 mt-1">Great {selectedSport.name} session</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <p className="text-lg font-bold text-white">{formatTimer(elapsedTime)}</p>
                    <p className="text-xs text-gray-400">Duration</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <p className="text-lg font-bold text-white">{calories}</p>
                    <p className="text-xs text-gray-400">Calories</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <p className="text-lg font-bold text-white">{heartRate}</p>
                    <p className="text-xs text-gray-400">Avg Heart Rate</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <p className="text-lg font-bold text-white">{Math.round(calories * 0.7)}</p>
                    <p className="text-xs text-gray-400">XP Earned</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={cancelTracking} variant="secondary" className="flex-1">Discard</Button>
                  <Button onClick={saveActivity} className="flex-1">Save Activity</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-400" /> Choose Your Sport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {SPORTS.map((sport, i) => (
                <motion.div
                  key={sport.id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <InteractiveCard onClick={() => startTracking(sport)}>
                    <div className={cn('p-4 rounded-t-2xl bg-gradient-to-br', sport.color)}>
                      <div className="text-center py-3">
                        {sport.icon}
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <p className="text-sm font-medium text-white">{sport.name}</p>
                      <div className="flex flex-wrap gap-1 justify-center mt-2">
                        {sport.metrics.slice(0, 2).map((m) => (
                          <span key={m} className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">{m}</span>
                        ))}
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={SPORTS.length} variants={fadeInUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" /> Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { sport: SPORTS.find(s => s.id === 'running')!, label: 'Quick Run', desc: '30 min target' },
                { sport: SPORTS.find(s => s.id === 'cycling')!, label: 'Evening Ride', desc: '15 km route' },
                { sport: SPORTS.find(s => s.id === 'swimming')!, label: 'Pool Session', desc: '40 laps goal' },
              ].map((item, i) => (
                <InteractiveCard key={i} onClick={() => startTracking(item.sport)}>
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', item.sport.color)}>
                        {item.sport.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function HistoryTab() {
  const activities = useStore((s) => s.activities)
  const [filter, setFilter] = React.useState<'week' | 'month' | 'all'>('all')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const filteredActivities = activities.filter((a) => {
    if (filter === 'week') return isThisWeek(new Date(a.date))
    if (filter === 'month') return isThisMonth(new Date(a.date))
    return true
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getSportIcon = (sport: string) => {
    const found = SPORTS.find((s) => s.name.toLowerCase() === sport.toLowerCase())
    return found?.icon || <span className="text-xl">🏅</span>
  }

  const getSportColor = (sport: string) => {
    const found = SPORTS.find((s) => s.name.toLowerCase() === sport.toLowerCase())
    return found?.color || 'from-purple-500/20 to-blue-500/20'
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[
          { value: 'week' as const, label: 'This Week' },
          { value: 'month' as const, label: 'This Month' },
          { value: 'all' as const, label: 'All Time' },
        ].map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? 'default' : 'secondary'}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Sessions" value={filteredActivities.length} icon={<Trophy className="w-4 h-4" />} />
        <StatCard label="Total Duration" value={`${filteredActivities.reduce((s, a) => s + a.duration, 0)}m`} icon={<Timer className="w-4 h-4" />} />
        <StatCard label="Calories Burned" value={filteredActivities.reduce((s, a) => s + a.caloriesBurned, 0).toLocaleString()} icon={<Flame className="w-4 h-4" />} />
        <StatCard label="Sports Played" value={new Set(filteredActivities.map((a) => a.sport)).size} icon={<Medal className="w-4 h-4" />} />
      </div>

      <div className="space-y-3">
        {filteredActivities.map((activity, i) => (
          <motion.div
            key={activity.id}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <InteractiveCard onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br', getSportColor(activity.sport))}>
                      {getSportIcon(activity.sport)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{activity.sport}</p>
                      <p className="text-xs text-gray-400">{format(new Date(activity.date), 'MMM d, yyyy · h:mm a')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-white">{activity.duration} min</p>
                      <p className="text-xs text-gray-400">{activity.caloriesBurned} cal</p>
                    </div>
                    {expandedId === activity.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {expandedId === activity.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-white/5 pt-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <p className="text-sm font-bold text-white">{activity.duration}m</p>
                          <p className="text-[10px] text-gray-400">Duration</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <p className="text-sm font-bold text-white">{activity.caloriesBurned}</p>
                          <p className="text-[10px] text-gray-400">Calories</p>
                        </div>
                        {activity.heartRate && (
                          <div className="text-center p-2 rounded-lg bg-white/5">
                            <p className="text-sm font-bold text-white">{activity.heartRate}</p>
                            <p className="text-[10px] text-gray-400">Avg HR</p>
                          </div>
                        )}
                        {activity.distance && (
                          <div className="text-center p-2 rounded-lg bg-white/5">
                            <p className="text-sm font-bold text-white">{activity.distance}</p>
                            <p className="text-[10px] text-gray-400">km</p>
                          </div>
                        )}
                      </div>
                      {activity.stats && Object.keys(activity.stats).length > 0 && (
                        <div className="space-y-1.5">
                          {Object.entries(activity.stats).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="text-white font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </InteractiveCard>
          </motion.div>
        ))}
        {filteredActivities.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No activities found</p>
              <p className="text-sm text-gray-500 mt-1">Start tracking to see your history</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function PerformanceTab() {
  const activities = useStore((s) => s.activities)

  const sportStats = React.useMemo(() => {
    const stats: Record<string, { totalDuration: number; totalCalories: number; sessions: number; avgHR: number }> = {}
    activities.forEach((a) => {
      if (!stats[a.sport]) {
        stats[a.sport] = { totalDuration: 0, totalCalories: 0, sessions: 0, avgHR: 0 }
      }
      stats[a.sport].totalDuration += a.duration
      stats[a.sport].totalCalories += a.caloriesBurned
      stats[a.sport].sessions += 1
      if (a.heartRate) {
        stats[a.sport].avgHR = Math.round((stats[a.sport].avgHR * (stats[a.sport].sessions - 1) + a.heartRate) / stats[a.sport].sessions)
      }
    })
    return stats
  }, [activities])

  const weeklyData = React.useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      const dayActivities = activities.filter((a) => {
        const aDate = new Date(a.date)
        return aDate.toDateString() === date.toDateString()
      })
      return {
        day: format(date, 'EEE'),
        duration: dayActivities.reduce((s, a) => s + a.duration, 0),
        calories: dayActivities.reduce((s, a) => s + a.caloriesBurned, 0),
        sessions: dayActivities.length,
      }
    })
    return days
  }, [activities])

  const radarData = React.useMemo(() => {
    const sports = Object.entries(sportStats)
    return sports.map(([name, stats]) => ({
      sport: name,
      sessions: stats.sessions,
      duration: stats.totalDuration,
      calories: stats.totalCalories,
    }))
  }, [sportStats])

  const bestRecords = React.useMemo(() => {
    const records: { sport: string; label: string; value: string; date: string }[] = []
    const bySport: Record<string, SportsActivity[]> = {}
    activities.forEach((a) => {
      if (!bySport[a.sport]) bySport[a.sport] = []
      bySport[a.sport].push(a)
    })
    Object.entries(bySport).forEach(([sport, acts]) => {
      const longest = acts.reduce((max, a) => a.duration > max.duration ? a : max, acts[0])
      records.push({ sport, label: 'Longest Session', value: `${longest.duration} min`, date: longest.date })
      const mostCalories = acts.reduce((max, a) => a.caloriesBurned > max.caloriesBurned ? a : max, acts[0])
      records.push({ sport, label: 'Most Calories', value: `${mostCalories.caloriesBurned} cal`, date: mostCalories.date })
    })
    return records
  }, [activities])

  const getSportIcon = (sport: string) => {
    const found = SPORTS.find((s) => s.name.toLowerCase() === sport.toLowerCase())
    return found?.icon || <span className="text-lg">🏅</span>
  }

  return (
    <div className="space-y-4">
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" /> Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE.contentStyle} />
                  <Bar dataKey="duration" name="Duration (min)" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" /> Calories Burned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE.contentStyle} />
                    <defs>
                      <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="calories" name="Calories" stroke="#f97316" fill="url(#caloriesGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" /> Sport Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {radarData.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="sport" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                      <RechartsRadar name="Sessions" dataKey="sessions" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-gray-500 text-sm">No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" /> Best Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bestRecords.slice(0, 6).map((record, i) => {
                const sportData = SPORTS.find((s) => s.name === record.sport)
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br', sportData?.color || 'from-purple-500/20 to-blue-500/20')}>
                        {getSportIcon(record.sport)}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{record.sport}</p>
                        <p className="text-xs text-gray-400">{record.label}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{record.value}</p>
                      <p className="text-xs text-gray-500">{format(new Date(record.date), 'MMM d')}</p>
                    </div>
                  </div>
                )
              })}
              {bestRecords.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">No records yet. Start tracking!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" /> Sport Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(sportStats).map(([sport, stats]) => {
                const sportData = SPORTS.find((s) => s.name === sport)
                return (
                  <div key={sport} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br', sportData?.color || 'from-purple-500/20 to-blue-500/20')}>
                        {getSportIcon(sport)}
                      </div>
                      <span className="text-sm font-medium text-white">{sport}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Sessions</p>
                        <p className="text-white font-medium">{stats.sessions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="text-white font-medium">{stats.totalDuration}m</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Calories</p>
                        <p className="text-white font-medium">{stats.totalCalories}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Avg HR</p>
                        <p className="text-white font-medium">{stats.avgHR || '—'}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function LeaderboardTab() {
  const leaderboard = useStore((s) => s.leaderboard)
  const user = useStore((s) => s.user)
  const [period, setPeriod] = React.useState<'weekly' | 'monthly' | 'all'>('weekly')

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp)

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-lg">🥇</span>
    if (rank === 2) return <span className="text-lg">🥈</span>
    if (rank === 3) return <span className="text-lg">🥉</span>
    return <span className="text-sm font-medium text-gray-400 w-6 text-center">#{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
    if (rank === 2) return 'from-gray-300/20 to-gray-400/20 border-gray-400/30'
    if (rank === 3) return 'from-orange-500/20 to-amber-600/20 border-orange-500/30'
    return 'border-white/10'
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[
          { value: 'weekly' as const, label: 'This Week' },
          { value: 'monthly' as const, label: 'This Month' },
          { value: 'all' as const, label: 'All Time' },
        ].map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant={period === p.value ? 'default' : 'secondary'}
            onClick={() => setPeriod(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {sortedLeaderboard.length >= 3 && (
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <GradientCard gradient="from-yellow-600/20 to-amber-600/20">
            <div className="flex items-end justify-around">
              {[sortedLeaderboard[1], sortedLeaderboard[0], sortedLeaderboard[2]].map((entry, i) => {
                const isFirst = i === 1
                const height = isFirst ? 'h-24' : i === 0 ? 'h-16' : 'h-12'
                return (
                  <div key={entry.id} className="flex flex-col items-center">
                    <Avatar
                      src={entry.avatar}
                      alt={entry.username}
                      fallback={entry.username}
                      size={isFirst ? 'lg' : 'md'}
                      className={cn(isFirst && 'ring-2 ring-yellow-500/50')}
                    />
                    <p className="text-sm font-medium text-white mt-2">{entry.username}</p>
                    <p className="text-xs text-gray-400">{entry.xp.toLocaleString()} XP</p>
                    <div className={cn(
                      'mt-2 w-16 rounded-t-lg flex items-center justify-center',
                      height,
                      isFirst ? 'bg-gradient-to-b from-yellow-500/30 to-yellow-500/10' :
                        i === 0 ? 'bg-gradient-to-b from-gray-400/20 to-gray-400/5' :
                          'bg-gradient-to-b from-orange-500/20 to-orange-500/5'
                    )}>
                      {getRankBadge(entry.rank)}
                    </div>
                  </div>
                )
              })}
            </div>
          </GradientCard>
        </motion.div>
      )}

      <div className="space-y-2">
        {sortedLeaderboard.map((entry, i) => {
          const isCurrentUser = entry.userId === user?.id
          return (
            <motion.div
              key={entry.id}
              custom={i + 1}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <div className={cn(
                'flex items-center gap-3 p-3 rounded-xl border transition-all',
                isCurrentUser
                  ? 'bg-purple-500/10 border-purple-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/[0.08]',
                i < 3 && getRankColor(entry.rank)
              )}>
                <div className="w-8 flex justify-center">
                  {getRankBadge(entry.rank)}
                </div>
                <Avatar
                  src={entry.avatar}
                  alt={entry.username}
                  fallback={entry.username}
                  size="md"
                  online={i < 3}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{entry.username}</p>
                    {isCurrentUser && <Badge variant="default">You</Badge>}
                  </div>
                  <p className="text-xs text-gray-400">Level {entry.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{entry.xp.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">XP</p>
                </div>
                <div className="w-20">
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${(entry.xp / (sortedLeaderboard[0]?.xp || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div custom={sortedLeaderboard.length + 2} variants={fadeInUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" /> Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-white">#{sortedLeaderboard.find((e) => e.userId === user?.id)?.rank || '—'}</p>
                <p className="text-xs text-gray-400">Rank</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-white">{useStore.getState().xp.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Total XP</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-2xl font-bold text-white">Lv.{useStore.getState().level}</p>
                <p className="text-xs text-gray-400">Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function SportsPage() {
  return (
    <AppLayout title="Sports Tracker">
      <div className="max-w-[1200px] mx-auto">
        <Tabs defaultValue="active">
          <TabTriggers>
            <TabTrigger value="active" label="Active" />
            <TabTrigger value="history" label="History" />
            <TabTrigger value="performance" label="Performance" />
            <TabTrigger value="leaderboard" label="Leaderboard" />
          </TabTriggers>
          <TabContent value="active">
            <ActiveSportsTab />
          </TabContent>
          <TabContent value="history">
            <HistoryTab />
          </TabContent>
          <TabContent value="performance">
            <PerformanceTab />
          </TabContent>
          <TabContent value="leaderboard">
            <LeaderboardTab />
          </TabContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
