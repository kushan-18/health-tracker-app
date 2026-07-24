'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Plus, Dumbbell, Utensils, Heart, Trophy,
  Calendar as CalendarIcon, Flame, Clock,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/modal'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/5'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarEvent {
  id: string
  type: 'workout' | 'meal' | 'health' | 'sport'
  title: string
  date: Date
  detail: string
}

function getEventsForMonth(workouts: { date: string; name: string; caloriesBurned: number; duration: number }[], meals: { date: string; name: string; totalCalories: number }[], metrics: { date: string; type: string }[], sports: { date: string; sport: string; duration: number }[], month: Date): CalendarEvent[] {
  const events: CalendarEvent[] = []
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  workouts.forEach((w) => {
    const d = new Date(w.date)
    if (d >= monthStart && d <= monthEnd) {
      events.push({ id: `w_${w.date}_${w.name}`, type: 'workout', title: w.name, date: d, detail: `${w.duration}min · ${w.caloriesBurned} cal` })
    }
  })

  meals.forEach((m) => {
    const d = new Date(m.date)
    if (d >= monthStart && d <= monthEnd) {
      events.push({ id: `m_${m.date}_${m.name}`, type: 'meal', title: m.name, date: d, detail: `${m.totalCalories} cal` })
    }
  })

  const healthDates = new Set<string>()
  metrics.forEach((h) => {
    const key = h.date
    if (!healthDates.has(key)) {
      healthDates.add(key)
      const d = new Date(key)
      if (d >= monthStart && d <= monthEnd) {
        events.push({ id: `h_${key}`, type: 'health', title: 'Health Check', date: d, detail: 'Metrics logged' })
      }
    }
  })

  sports.forEach((s) => {
    const d = new Date(s.date)
    if (d >= monthStart && d <= monthEnd) {
      events.push({ id: `s_${s.date}_${s.sport}`, type: 'sport', title: s.sport, date: d, detail: `${s.duration}min` })
    }
  })

  return events
}

const typeColors: Record<string, { dot: string; bg: string; text: string; icon: React.ReactNode }> = {
  workout: { dot: 'bg-green-400', bg: 'bg-green-500/20', text: 'text-green-400', icon: <Dumbbell className="w-3.5 h-3.5" /> },
  meal: { dot: 'bg-blue-400', bg: 'bg-blue-500/20', text: 'text-blue-400', icon: <Utensils className="w-3.5 h-3.5" /> },
  health: { dot: 'bg-purple-400', bg: 'bg-purple-500/20', text: 'text-purple-400', icon: <Heart className="w-3.5 h-3.5" /> },
  sport: { dot: 'bg-orange-400', bg: 'bg-orange-500/20', text: 'text-orange-400', icon: <Trophy className="w-3.5 h-3.5" /> },
}

export default function CalendarPage() {
  const workouts = useStore((s) => s.workouts)
  const meals = useStore((s) => s.meals)
  const metrics = useStore((s) => s.metrics)
  const sports = useStore((s) => s.activities)

  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date())
  const [showAddModal, setShowAddModal] = React.useState(false)

  const events = React.useMemo(() => getEventsForMonth(workouts, meals, metrics, sports, currentMonth), [workouts, meals, metrics, sports, currentMonth])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPadding = getDay(monthStart)

  const selectedDayEvents = React.useMemo(() => {
    if (!selectedDate) return []
    return events.filter((e) => isSameDay(e.date, selectedDate))
  }, [events, selectedDate])

  const totalWorkouts = events.filter((e) => e.type === 'workout').length
  const totalMeals = events.filter((e) => e.type === 'meal').length
  const totalHealth = events.filter((e) => e.type === 'health').length
  const totalSports = events.filter((e) => e.type === 'sport').length

  return (
    <AppLayout title="Calendar">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
            <StatCard label="Workouts" value={totalWorkouts} icon={<Dumbbell className="w-5 h-5" />} className={CARD_HOVER} />
          </motion.div>
          <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
            <StatCard label="Meals Logged" value={totalMeals} icon={<Utensils className="w-5 h-5" />} className={CARD_HOVER} />
          </motion.div>
          <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
            <StatCard label="Health Entries" value={totalHealth} icon={<Heart className="w-5 h-5" />} className={CARD_HOVER} />
          </motion.div>
          <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
            <StatCard label="Sports" value={totalSports} icon={<Trophy className="w-5 h-5" />} className={CARD_HOVER} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Calendar Grid */}
          <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
            <Card className={CARD_HOVER}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-purple-400" />
                    <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()) }}>
                      Today
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day Labels */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_LABELS.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startPadding }).map((_, i) => (
                    <div key={`pad-${i}`} className="aspect-square" />
                  ))}
                  {calendarDays.map((day) => {
                    const dayEvents = events.filter((e) => isSameDay(e.date, day))
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const today = isToday(day)
                    const types = [...new Set(dayEvents.map((e) => e.type))]

                    return (
                      <motion.button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-sm relative transition-all duration-200 border',
                          isSelected
                            ? 'bg-purple-500/30 border-purple-500/50 text-white shadow-lg shadow-purple-500/20'
                            : today
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <span className={cn('font-medium', today && !isSelected && 'text-purple-400')}>{format(day, 'd')}</span>
                        {types.length > 0 && (
                          <div className="flex gap-0.5">
                            {types.slice(0, 4).map((type) => (
                              <div key={type} className={cn('w-1.5 h-1.5 rounded-full', typeColors[type].dot)} />
                            ))}
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/10">
                  {Object.entries(typeColors).map(([type, config]) => (
                    <div key={type} className="flex items-center gap-1.5">
                      <div className={cn('w-2 h-2 rounded-full', config.dot)} />
                      <span className="text-xs text-gray-400 capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Day Detail Panel */}
          <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible">
            <Card className={cn(CARD_HOVER, 'h-full')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {selectedDate ? format(selectedDate, 'EEEE, MMM d') : 'Select a day'}
                  </CardTitle>
                  <Button variant="default" size="icon" className="h-8 w-8" onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {selectedDayEvents.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <CalendarIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No events on this day</p>
                      <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowAddModal(true)}>
                        <Plus className="w-3.5 h-3.5" /> Add Event
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="events"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {selectedDayEvents.map((event, i) => {
                        const config = typeColors[event.type]
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={cn('flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer')}
                          >
                            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
                              <div className={config.text}>{config.icon}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{event.title}</p>
                              <p className="text-xs text-gray-500">{event.detail}</p>
                            </div>
                            <Badge variant={event.type === 'workout' ? 'success' : event.type === 'meal' ? 'info' : event.type === 'health' ? 'default' : 'warning'} className="text-[10px]">
                              {event.type}
                            </Badge>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Events */}
        <motion.div custom={6} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={CARD_HOVER}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Upcoming This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {events.slice(0, 8).map((event, i) => {
                  const config = typeColors[event.type]
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.06 }}
                      className={cn('flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors')}
                    >
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.bg)}>
                        <div className={config.text}>{config.icon}</div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{event.title}</p>
                        <p className="text-[10px] text-gray-500">{format(event.date, 'MMM d')} · {event.detail}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add Event Modal */}
        <Modal open={showAddModal} onClose={() => setShowAddModal(false)} size="md">
          <ModalHeader>
            <ModalTitle>Add Calendar Event</ModalTitle>
          </ModalHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(typeColors).map(([type, config]) => (
                <button
                  key={type}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-xl border transition-all',
                    'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', config.bg)}>
                    <div className={config.text}>{config.icon}</div>
                  </div>
                  <span className="text-sm text-white capitalize">{type}</span>
                </button>
              ))}
            </div>
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">Event creation form coming soon</p>
              <p className="text-xs text-gray-600 mt-1">Events are auto-detected from your logged data</p>
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={() => setShowAddModal(false)}>Add Event</Button>
          </ModalFooter>
        </Modal>
      </div>
    </AppLayout>
  )
}
