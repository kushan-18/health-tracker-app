'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Timer, Plus, Check, X, Search, Dumbbell, Flame, Zap, RotateCcw,
  ChevronDown, ChevronUp, Play, Pause, StopCircle, Sparkles, CheckCircle2,
  Clock, Target, Weight, Battery, Eye, Info, ArrowRight, Loader2,
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard, InteractiveCard, GradientCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress, CircularProgress } from '@/components/ui/progress'
import { Tabs, TabTriggers, TabTrigger, TabContent } from '@/components/ui/tabs'
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/modal'
import { useStore } from '@/lib/store'
import { cn, generateId } from '@/lib/utils'
import type { Workout, Exercise, Set as ExerciseSet } from '@/lib/types'
import { format, subDays, isThisWeek, isThisMonth } from 'date-fns'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/5'

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'] as const

const EXERCISE_DATABASE: Exercise[] = [
  { id: 'ex_db_001', name: 'Bench Press', sets: [], muscle: 'Chest', equipment: 'Barbell' },
  { id: 'ex_db_002', name: 'Incline Dumbbell Press', sets: [], muscle: 'Chest', equipment: 'Dumbbells' },
  { id: 'ex_db_003', name: 'Cable Fly', sets: [], muscle: 'Chest', equipment: 'Cable' },
  { id: 'ex_db_004', name: 'Push Ups', sets: [], muscle: 'Chest', equipment: 'Bodyweight' },
  { id: 'ex_db_005', name: 'Deadlift', sets: [], muscle: 'Back', equipment: 'Barbell' },
  { id: 'ex_db_006', name: 'Barbell Row', sets: [], muscle: 'Back', equipment: 'Barbell' },
  { id: 'ex_db_007', name: 'Pull Ups', sets: [], muscle: 'Back', equipment: 'Bodyweight' },
  { id: 'ex_db_008', name: 'Seated Cable Row', sets: [], muscle: 'Back', equipment: 'Cable' },
  { id: 'ex_db_009', name: 'Overhead Press', sets: [], muscle: 'Shoulders', equipment: 'Barbell' },
  { id: 'ex_db_010', name: 'Lateral Raise', sets: [], muscle: 'Shoulders', equipment: 'Dumbbells' },
  { id: 'ex_db_011', name: 'Face Pulls', sets: [], muscle: 'Shoulders', equipment: 'Cable' },
  { id: 'ex_db_012', name: 'Barbell Curl', sets: [], muscle: 'Arms', equipment: 'Barbell' },
  { id: 'ex_db_013', name: 'Tricep Dips', sets: [], muscle: 'Arms', equipment: 'Bodyweight' },
  { id: 'ex_db_014', name: 'Hammer Curl', sets: [], muscle: 'Arms', equipment: 'Dumbbells' },
  { id: 'ex_db_015', name: 'Squat', sets: [], muscle: 'Legs', equipment: 'Barbell' },
  { id: 'ex_db_016', name: 'Leg Press', sets: [], muscle: 'Legs', equipment: 'Machine' },
  { id: 'ex_db_017', name: 'Romanian Deadlift', sets: [], muscle: 'Legs', equipment: 'Barbell' },
  { id: 'ex_db_018', name: 'Calf Raises', sets: [], muscle: 'Legs', equipment: 'Machine' },
  { id: 'ex_db_019', name: 'Plank', sets: [], muscle: 'Core', equipment: 'Bodyweight' },
  { id: 'ex_db_020', name: 'Cable Crunch', sets: [], muscle: 'Core', equipment: 'Cable' },
]

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

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

function ActiveWorkoutTab() {
  const workouts = useStore((s) => s.workouts)
  const addWorkout = useStore((s) => s.addWorkout)
  const [activeWorkout, setActiveWorkout] = React.useState<Workout | null>(() => {
    const incomplete = workouts.find((w) => !w.completed)
    return incomplete || null
  })
  const [timerRunning, setTimerRunning] = React.useState(false)
  const [elapsedTime, setElapsedTime] = React.useState(0)
  const [restTimer, setRestTimer] = React.useState<number | null>(null)
  const [restCountdown, setRestCountdown] = React.useState(0)
  const [showExerciseModal, setShowExerciseModal] = React.useState(false)
  const [exerciseSearch, setExerciseSearch] = React.useState('')
  const [selectedExercise, setSelectedExercise] = React.useState<Exercise | null>(null)
  const [showExerciseDetail, setShowExerciseDetail] = React.useState(false)

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerRunning) {
      interval = setInterval(() => setElapsedTime((p) => p + 1), 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [timerRunning])

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (restTimer !== null && restCountdown > 0) {
      interval = setInterval(() => {
        setRestCountdown((p) => {
          if (p <= 1) {
            setRestTimer(null)
            return 0
          }
          return p - 1
        })
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [restTimer, restCountdown])

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const totalVolume = activeWorkout?.exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) => s + (set.completed ? set.reps * set.weight : 0), 0), 0) || 0

  const completedSets = activeWorkout?.exercises.reduce((total, ex) =>
    total + ex.sets.filter((s) => s.completed).length, 0) || 0

  const totalSets = activeWorkout?.exercises.reduce((total, ex) => total + ex.sets.length, 0) || 0

  const startNewWorkout = () => {
    const newWorkout: Workout = {
      id: `wk_${generateId()}`,
      userId: 'user_001',
      name: 'New Workout',
      type: 'strength',
      exercises: [],
      duration: 0,
      caloriesBurned: 0,
      date: new Date().toISOString().split('T')[0],
      completed: false,
    }
    addWorkout(newWorkout)
    setActiveWorkout(newWorkout)
    setElapsedTime(0)
    setTimerRunning(true)
  }

  const addExerciseToWorkout = (exercise: Exercise) => {
    if (!activeWorkout) return
    const newExercise: Exercise = {
      ...exercise,
      id: `ex_${generateId()}`,
      sets: [{ reps: 10, weight: 0, completed: false }],
    }
    const updated = { ...activeWorkout, exercises: [...activeWorkout.exercises, newExercise] }
    setActiveWorkout(updated)
    setShowExerciseModal(false)
    setExerciseSearch('')
  }

  const addSet = (exerciseId: string) => {
    if (!activeWorkout) return
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: [...ex.sets, { reps: 10, weight: 0, completed: false }] }
          : ex
      ),
    }
    setActiveWorkout(updated)
  }

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    if (!activeWorkout) return
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s, i) =>
                i === setIndex ? { ...s, completed: !s.completed } : s
              ),
            }
          : ex
      ),
    }
    setActiveWorkout(updated)
  }

  const updateSet = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
    if (!activeWorkout) return
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s, i) =>
                i === setIndex ? { ...s, [field]: value } : s
              ),
            }
          : ex
      ),
    }
    setActiveWorkout(updated)
  }

  const removeExercise = (exerciseId: string) => {
    if (!activeWorkout) return
    const updated = {
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter((ex) => ex.id !== exerciseId),
    }
    setActiveWorkout(updated)
  }

  const finishWorkout = () => {
    if (!activeWorkout) return
    const updated = {
      ...activeWorkout,
      duration: Math.round(elapsedTime / 60),
      caloriesBurned: Math.round(elapsedTime / 60 * 8),
      completed: true,
    }
    setActiveWorkout(updated)
    setTimerRunning(false)
  }

  const filteredExercises = EXERCISE_DATABASE.filter((ex) =>
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.muscle.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.equipment.toLowerCase().includes(exerciseSearch.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {!activeWorkout ? (
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                <Dumbbell className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Active Workout</h3>
              <p className="text-gray-400 text-sm mb-6">Start a new workout session to track your exercises</p>
              <Button onClick={startNewWorkout} size="lg">
                <Play className="w-5 h-5" /> Start Workout
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
            <GradientCard gradient="from-purple-600/20 to-blue-600/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{activeWorkout.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{format(new Date(), 'EEEE, MMMM d')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-3xl font-bold text-white font-mono">
                      <Timer className="w-6 h-6 text-purple-400" />
                      {formatTimer(elapsedTime)}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Duration</p>
                  </div>
                  <div className="flex gap-2">
                    {!timerRunning ? (
                      <Button size="sm" onClick={() => setTimerRunning(true)}>
                        <Play className="w-4 h-4" /> Resume
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => setTimerRunning(false)}>
                        <Pause className="w-4 h-4" /> Pause
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={finishWorkout}>
                      <StopCircle className="w-4 h-4" /> Finish
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{totalVolume.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Volume (kg)</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{completedSets}/{totalSets}</p>
                  <p className="text-xs text-gray-400">Sets Done</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{Math.round(elapsedTime / 60 * 8)}</p>
                  <p className="text-xs text-gray-400">Calories</p>
                </div>
              </div>
            </GradientCard>
          </motion.div>

          <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" /> Rest Timer
                  </CardTitle>
                  {restTimer !== null && (
                    <div className="flex items-center gap-2">
                      <CircularProgress value={restCountdown} max={restTimer} size={40} strokeWidth={3} />
                      <span className="text-lg font-bold text-white font-mono">{restCountdown}s</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {[60, 90, 120].map((sec) => (
                    <Button
                      key={sec}
                      size="sm"
                      variant={restTimer === sec ? 'default' : 'secondary'}
                      onClick={() => { setRestTimer(sec); setRestCountdown(sec) }}
                    >
                      {sec}s
                    </Button>
                  ))}
                  {restTimer !== null && (
                    <Button size="sm" variant="ghost" onClick={() => { setRestTimer(null); setRestCountdown(0) }}>
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-3">
            {activeWorkout.exercises.map((exercise, exIdx) => (
              <motion.div
                key={exercise.id}
                custom={exIdx + 2}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{exercise.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="info">{exercise.muscle}</Badge>
                          <Badge variant="default">{exercise.equipment}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => addSet(exercise.id)}>
                          <Plus className="w-4 h-4" /> Add Set
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeExercise(exercise.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400 text-xs">
                            <th className="text-left pb-2 font-medium">Set</th>
                            <th className="text-center pb-2 font-medium">Reps</th>
                            <th className="text-center pb-2 font-medium">Weight (kg)</th>
                            <th className="text-center pb-2 font-medium">Done</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set, setIdx) => (
                            <tr key={setIdx} className={cn('border-t border-white/5', set.completed && 'bg-green-500/5')}>
                              <td className="py-2 text-gray-300 font-medium">{setIdx + 1}</td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) => updateSet(exercise.id, setIdx, 'reps', parseInt(e.target.value) || 0)}
                                  className="w-16 text-center bg-white/5 border border-white/10 rounded-lg py-1 text-white text-sm focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                />
                              </td>
                              <td className="py-2">
                                <input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) => updateSet(exercise.id, setIdx, 'weight', parseInt(e.target.value) || 0)}
                                  className="w-16 text-center bg-white/5 border border-white/10 rounded-lg py-1 text-white text-sm focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                />
                              </td>
                              <td className="py-2 text-center">
                                <button
                                  onClick={() => toggleSetComplete(exercise.id, setIdx)}
                                  className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                                    set.completed
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                  )}
                                >
                                  {set.completed ? <Check className="w-4 h-4" /> : <div className="w-3 h-3 rounded border border-gray-500" />}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div custom={activeWorkout.exercises.length + 3} variants={fadeInUp} initial="hidden" animate="visible">
            <Button onClick={() => setShowExerciseModal(true)} variant="secondary" className="w-full" size="lg">
              <Plus className="w-5 h-5" /> Add Exercise
            </Button>
          </motion.div>
        </>
      )}

      <Modal open={showExerciseModal} onClose={() => setShowExerciseModal(false)} size="lg">
        <ModalHeader>
          <ModalTitle>Add Exercise</ModalTitle>
          <ModalDescription>Search and select exercises to add to your workout</ModalDescription>
        </ModalHeader>
        <Input
          placeholder="Search exercises..."
          icon={<Search className="w-4 h-4" />}
          value={exerciseSearch}
          onChange={(e) => setExerciseSearch(e.target.value)}
        />
        <div className="mt-4 max-h-[400px] overflow-y-auto space-y-2">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => addExerciseToWorkout(exercise)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
            >
              <div>
                <p className="text-sm font-medium text-white">{exercise.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="info">{exercise.muscle}</Badge>
                  <span className="text-xs text-gray-400">{exercise.equipment}</span>
                </div>
              </div>
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}

function HistoryTab() {
  const workouts = useStore((s) => s.workouts)
  const [filter, setFilter] = React.useState<'week' | 'month' | 'all'>('all')
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  const filteredWorkouts = workouts.filter((w) => {
    if (!w.completed) return false
    if (filter === 'week') return isThisWeek(new Date(w.date))
    if (filter === 'month') return isThisMonth(new Date(w.date))
    return true
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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

      <div className="space-y-3">
        {filteredWorkouts.map((workout, i) => (
          <motion.div
            key={workout.id}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <InteractiveCard onClick={() => setExpandedId(expandedId === workout.id ? null : workout.id)}>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      workout.type === 'strength' ? 'bg-purple-500/20' : workout.type === 'cardio' ? 'bg-blue-500/20' : 'bg-green-500/20'
                    )}>
                      {workout.type === 'strength' ? '🏋️' : workout.type === 'cardio' ? '🏃' : '🧘'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{workout.name}</p>
                      <p className="text-xs text-gray-400">{format(new Date(workout.date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-white">{workout.duration} min</p>
                      <p className="text-xs text-gray-400">{workout.caloriesBurned} cal</p>
                    </div>
                    {expandedId === workout.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {expandedId === workout.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-white/5 pt-3">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <p className="text-sm font-bold text-white">{workout.duration}m</p>
                          <p className="text-[10px] text-gray-400">Duration</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <p className="text-sm font-bold text-white">{workout.exercises.length}</p>
                          <p className="text-[10px] text-gray-400">Exercises</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <p className="text-sm font-bold text-white">{workout.caloriesBurned}</p>
                          <p className="text-[10px] text-gray-400">Calories</p>
                        </div>
                      </div>
                      {workout.exercises.length > 0 && (
                        <div className="space-y-2">
                          {workout.exercises.map((ex) => (
                            <div key={ex.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">{ex.name}</span>
                              <span className="text-gray-500 text-xs">
                                {ex.sets.length} sets · {ex.sets.reduce((s, set) => s + set.reps, 0)} reps
                              </span>
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
      </div>
    </div>
  )
}

function ExerciseLibraryTab() {
  const [search, setSearch] = React.useState('')
  const [selectedMuscle, setSelectedMuscle] = React.useState<string | null>(null)
  const [selectedExercise, setSelectedExercise] = React.useState<Exercise | null>(null)
  const [showDetail, setShowDetail] = React.useState(false)

  const filtered = EXERCISE_DATABASE.filter((ex) => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(search.toLowerCase())
    const matchMuscle = !selectedMuscle || ex.muscle === selectedMuscle
    return matchSearch && matchMuscle
  })

  const grouped = MUSCLE_GROUPS.reduce((acc, group) => {
    acc[group] = filtered.filter((ex) => ex.muscle === group)
    return acc
  }, {} as Record<string, Exercise[]>)

  const MUSCLE_COLORS: Record<string, string> = {
    Chest: 'from-red-500/20 to-pink-500/20',
    Back: 'from-blue-500/20 to-indigo-500/20',
    Shoulders: 'from-amber-500/20 to-orange-500/20',
    Arms: 'from-purple-500/20 to-violet-500/20',
    Legs: 'from-green-500/20 to-emerald-500/20',
    Core: 'from-cyan-500/20 to-teal-500/20',
  }

  const MUSCLE_BODY_MAP: Record<string, { top: string; left: string; width: string; height: string }> = {
    Chest: { top: '18%', left: '30%', width: '40%', height: '12%' },
    Back: { top: '18%', left: '25%', width: '50%', height: '18%' },
    Shoulders: { top: '14%', left: '15%', width: '70%', height: '8%' },
    Arms: { top: '22%', left: '5%', width: '18%', height: '25%' },
    Legs: { top: '48%', left: '25%', width: '22%', height: '35%' },
    Core: { top: '30%', left: '30%', width: '40%', height: '18%' },
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search exercises..."
        icon={<Search className="w-4 h-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          size="sm"
          variant={!selectedMuscle ? 'default' : 'secondary'}
          onClick={() => setSelectedMuscle(null)}
        >
          All
        </Button>
        {MUSCLE_GROUPS.map((group) => (
          <Button
            key={group}
            size="sm"
            variant={selectedMuscle === group ? 'default' : 'secondary'}
            onClick={() => setSelectedMuscle(group)}
          >
            {group}
          </Button>
        ))}
      </div>

      {!selectedMuscle && !search ? (
        MUSCLE_GROUPS.map((group) => (
          grouped[group].length > 0 && (
            <div key={group}>
              <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">{group}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {grouped[group].map((exercise) => (
                  <InteractiveCard
                    key={exercise.id}
                    onClick={() => { setSelectedExercise(exercise); setShowDetail(true) }}
                  >
                    <div className={cn('p-4 rounded-t-2xl bg-gradient-to-br', MUSCLE_COLORS[group])}>
                      <div className="text-center py-4">
                        <div className="relative w-20 h-32 mx-auto">
                          <svg viewBox="0 0 100 160" className="w-full h-full">
                            <ellipse cx="50" cy="20" rx="15" ry="18" fill="rgba(255,255,255,0.1)" />
                            <rect x="35" y="38" width="30" height="40" rx="8" fill="rgba(255,255,255,0.08)" />
                            <rect x="20" y="42" width="15" height="35" rx="6" fill="rgba(255,255,255,0.06)" />
                            <rect x="65" y="42" width="15" height="35" rx="6" fill="rgba(255,255,255,0.06)" />
                            <rect x="37" y="78" width="12" height="50" rx="6" fill="rgba(255,255,255,0.06)" />
                            <rect x="51" y="78" width="12" height="50" rx="6" fill="rgba(255,255,255,0.06)" />
                            {MUSCLE_BODY_MAP[group] && (
                              <rect
                                x={MUSCLE_BODY_MAP[group].left}
                                y={MUSCLE_BODY_MAP[group].top}
                                width={MUSCLE_BODY_MAP[group].width}
                                height={MUSCLE_BODY_MAP[group].height}
                                rx="4"
                                fill="rgba(168,85,247,0.4)"
                                stroke="rgba(168,85,247,0.6)"
                                strokeWidth="1"
                              />
                            )}
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-white">{exercise.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="info">{exercise.muscle}</Badge>
                        <span className="text-xs text-gray-400">{exercise.equipment}</span>
                      </div>
                    </div>
                  </InteractiveCard>
                ))}
              </div>
            </div>
          )
        ))
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((exercise) => (
            <InteractiveCard
              key={exercise.id}
              onClick={() => { setSelectedExercise(exercise); setShowDetail(true) }}
            >
              <div className={cn('p-4 rounded-t-2xl bg-gradient-to-br', MUSCLE_COLORS[exercise.muscle])}>
                <div className="text-center py-4">
                  <div className="relative w-20 h-32 mx-auto">
                    <svg viewBox="0 0 100 160" className="w-full h-full">
                      <ellipse cx="50" cy="20" rx="15" ry="18" fill="rgba(255,255,255,0.1)" />
                      <rect x="35" y="38" width="30" height="40" rx="8" fill="rgba(255,255,255,0.08)" />
                      <rect x="20" y="42" width="15" height="35" rx="6" fill="rgba(255,255,255,0.06)" />
                      <rect x="65" y="42" width="15" height="35" rx="6" fill="rgba(255,255,255,0.06)" />
                      <rect x="37" y="78" width="12" height="50" rx="6" fill="rgba(255,255,255,0.06)" />
                      <rect x="51" y="78" width="12" height="50" rx="6" fill="rgba(255,255,255,0.06)" />
                      {MUSCLE_BODY_MAP[exercise.muscle] && (
                        <rect
                          x={MUSCLE_BODY_MAP[exercise.muscle].left}
                          y={MUSCLE_BODY_MAP[exercise.muscle].top}
                          width={MUSCLE_BODY_MAP[exercise.muscle].width}
                          height={MUSCLE_BODY_MAP[exercise.muscle].height}
                          rx="4"
                          fill="rgba(168,85,247,0.4)"
                          stroke="rgba(168,85,247,0.6)"
                          strokeWidth="1"
                        />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-white">{exercise.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="info">{exercise.muscle}</Badge>
                  <span className="text-xs text-gray-400">{exercise.equipment}</span>
                </div>
              </div>
            </InteractiveCard>
          ))}
        </div>
      )}

      <Modal open={showDetail} onClose={() => setShowDetail(false)} size="md">
        {selectedExercise && (
          <>
            <ModalHeader>
              <ModalTitle>{selectedExercise.name}</ModalTitle>
              <ModalDescription>Exercise Details</ModalDescription>
            </ModalHeader>
            <div className="space-y-4">
              <div className={cn('rounded-2xl bg-gradient-to-br p-6', MUSCLE_COLORS[selectedExercise.muscle])}>
                <div className="text-center">
                  <div className="relative w-32 h-48 mx-auto">
                    <svg viewBox="0 0 100 160" className="w-full h-full">
                      <ellipse cx="50" cy="20" rx="15" ry="18" fill="rgba(255,255,255,0.1)" />
                      <rect x="35" y="38" width="30" height="40" rx="8" fill="rgba(255,255,255,0.08)" />
                      <rect x="20" y="42" width="15" height="35" rx="6" fill="rgba(255,255,255,0.06)" />
                      <rect x="65" y="42" width="15" height="35" rx="6" fill="rgba(255,255,255,0.06)" />
                      <rect x="37" y="78" width="12" height="50" rx="6" fill="rgba(255,255,255,0.06)" />
                      <rect x="51" y="78" width="12" height="50" rx="6" fill="rgba(255,255,255,0.06)" />
                      {MUSCLE_BODY_MAP[selectedExercise.muscle] && (
                        <rect
                          x={MUSCLE_BODY_MAP[selectedExercise.muscle].left}
                          y={MUSCLE_BODY_MAP[selectedExercise.muscle].top}
                          width={MUSCLE_BODY_MAP[selectedExercise.muscle].width}
                          height={MUSCLE_BODY_MAP[selectedExercise.muscle].height}
                          rx="4"
                          fill="rgba(168,85,247,0.5)"
                          stroke="rgba(168,85,247,0.8)"
                          strokeWidth="1.5"
                        />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 text-center">
                  <p className="text-xs text-gray-400">Muscle Group</p>
                  <p className="text-sm font-medium text-white mt-1">{selectedExercise.muscle}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 text-center">
                  <p className="text-xs text-gray-400">Equipment</p>
                  <p className="text-sm font-medium text-white mt-1">{selectedExercise.equipment}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-300">
                  This exercise targets the {selectedExercise.muscle.toLowerCase()} muscles using {selectedExercise.equipment.toLowerCase()}.
                  Perform with proper form for best results.
                </p>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

function AIGeneratorTab() {
  const [goal, setGoal] = React.useState('gain_muscle')
  const [experience, setExperience] = React.useState('intermediate')
  const [daysPerWeek, setDaysPerWeek] = React.useState(4)
  const [equipment, setEquipment] = React.useState('full_gym')
  const [duration, setDuration] = React.useState(60)
  const [generating, setGenerating] = React.useState(false)
  const [generated, setGenerated] = React.useState(false)
  const [generatedWorkout, setGeneratedWorkout] = React.useState<{ name: string; exercises: { name: string; sets: number; reps: string; muscle: string }[] }[]>([])

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      const plans = [
        {
          name: 'Push Day',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: '8-10', muscle: 'Chest' },
            { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', muscle: 'Upper Chest' },
            { name: 'Overhead Press', sets: 4, reps: '8-10', muscle: 'Shoulders' },
            { name: 'Lateral Raise', sets: 3, reps: '12-15', muscle: 'Side Delts' },
            { name: 'Tricep Dips', sets: 3, reps: '10-12', muscle: 'Triceps' },
          ],
        },
        {
          name: 'Pull Day',
          exercises: [
            { name: 'Deadlift', sets: 4, reps: '6-8', muscle: 'Back' },
            { name: 'Barbell Row', sets: 4, reps: '8-10', muscle: 'Back' },
            { name: 'Pull Ups', sets: 3, reps: '8-12', muscle: 'Lats' },
            { name: 'Face Pulls', sets: 3, reps: '12-15', muscle: 'Rear Delts' },
            { name: 'Barbell Curl', sets: 3, reps: '10-12', muscle: 'Biceps' },
          ],
        },
        {
          name: 'Leg Day',
          exercises: [
            { name: 'Squat', sets: 4, reps: '8-10', muscle: 'Quads' },
            { name: 'Romanian Deadlift', sets: 3, reps: '10-12', muscle: 'Hamstrings' },
            { name: 'Leg Press', sets: 3, reps: '12-15', muscle: 'Quads' },
            { name: 'Calf Raises', sets: 4, reps: '15-20', muscle: 'Calves' },
          ],
        },
      ]
      setGeneratedWorkout(plans)
      setGenerated(true)
      setGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> AI Workout Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'lose_fat', label: 'Lose Fat', icon: '🔥' },
                  { value: 'gain_muscle', label: 'Gain Muscle', icon: '💪' },
                  { value: 'general', label: 'General Fitness', icon: '🏃' },
                ].map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={cn(
                      'p-3 rounded-xl border text-center transition-all',
                      goal === g.value
                        ? 'bg-purple-500/20 border-purple-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    <span className="text-xl">{g.icon}</span>
                    <p className="text-xs mt-1">{g.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Experience Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setExperience(level.toLowerCase())}
                    className={cn(
                      'p-3 rounded-xl border text-center transition-all',
                      experience === level.toLowerCase()
                        ? 'bg-purple-500/20 border-purple-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    <p className="text-sm font-medium">{level}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Days per Week</label>
                <div className="flex gap-2">
                  {[3, 4, 5, 6].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDaysPerWeek(d)}
                      className={cn(
                        'w-10 h-10 rounded-xl border text-sm font-medium transition-all',
                        daysPerWeek === d
                          ? 'bg-purple-500/20 border-purple-500/40 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Duration (min)</label>
                <div className="flex gap-2">
                  {[30, 45, 60, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={cn(
                        'w-10 h-10 rounded-xl border text-sm font-medium transition-all',
                        duration === d
                          ? 'bg-purple-500/20 border-purple-500/40 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Equipment Available</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'full_gym', label: 'Full Gym' },
                  { value: 'home', label: 'Home Setup' },
                  { value: 'bodyweight', label: 'Bodyweight' },
                ].map((eq) => (
                  <button
                    key={eq.value}
                    onClick={() => setEquipment(eq.value)}
                    className={cn(
                      'p-3 rounded-xl border text-center transition-all',
                      equipment === eq.value
                        ? 'bg-purple-500/20 border-purple-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    <p className="text-sm">{eq.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              loading={generating}
              className="w-full"
              size="lg"
            >
              <Sparkles className="w-5 h-5" /> Generate Workout
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            {generatedWorkout.map((day, dayIdx) => (
              <Card key={dayIdx}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-purple-400" /> {day.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {day.exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-6">{exIdx + 1}.</span>
                          <div>
                            <p className="text-sm text-white">{ex.name}</p>
                            <p className="text-xs text-gray-400">{ex.muscle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-purple-400 font-medium">{ex.sets} × {ex.reps}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button className="w-full" size="lg">
              <CheckCircle2 className="w-5 h-5" /> Accept & Start
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function WorkoutPage() {
  return (
    <AppLayout title="Workout Tracker">
      <div className="max-w-[1200px] mx-auto">
        <Tabs defaultValue="active">
          <TabTriggers>
            <TabTrigger value="active" label="Active Workout" />
            <TabTrigger value="history" label="History" />
            <TabTrigger value="library" label="Exercise Library" />
            <TabTrigger value="ai" label="AI Generator" />
          </TabTriggers>
          <TabContent value="active">
            <ActiveWorkoutTab />
          </TabContent>
          <TabContent value="history">
            <HistoryTab />
          </TabContent>
          <TabContent value="library">
            <ExerciseLibraryTab />
          </TabContent>
          <TabContent value="ai">
            <AIGeneratorTab />
          </TabContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
