'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Clock, Flame, Dumbbell, Weight, Target, Edit3, Trash2,
  Share2, ChevronRight, Calendar, Zap,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard, GradientCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const MUSCLE_BODY_MAP: Record<string, { top: string; left: string; width: string; height: string }> = {
  Chest: { top: '18%', left: '30%', width: '40%', height: '12%' },
  Back: { top: '18%', left: '25%', width: '50%', height: '18%' },
  Shoulders: { top: '14%', left: '15%', width: '70%', height: '8%' },
  'Upper Chest': { top: '18%', left: '30%', width: '40%', height: '8%' },
  Triceps: { top: '22%', left: '70%', width: '18%', height: '20%' },
  Biceps: { top: '22%', left: '5%', width: '18%', height: '20%' },
  Quads: { top: '48%', left: '25%', width: '22%', height: '35%' },
  Hamstrings: { top: '48%', left: '53%', width: '22%', height: '35%' },
  Legs: { top: '48%', left: '25%', width: '50%', height: '35%' },
  Calves: { top: '70%', left: '25%', width: '22%', height: '20%' },
  'Rear Delt': { top: '14%', left: '15%', width: '70%', height: '8%' },
  Arms: { top: '22%', left: '5%', width: '90%', height: '25%' },
  Core: { top: '30%', left: '30%', width: '40%', height: '18%' },
}

const MUSCLE_COLORS: Record<string, string> = {
  Chest: 'from-red-500/30 to-pink-500/30',
  Back: 'from-blue-500/30 to-indigo-500/30',
  Shoulders: 'from-amber-500/30 to-orange-500/30',
  Arms: 'from-purple-500/30 to-violet-500/30',
  Legs: 'from-green-500/30 to-emerald-500/30',
  Core: 'from-cyan-500/30 to-teal-500/30',
}

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const workouts = useStore((s) => s.workouts)
  const workout = workouts.find((w) => w.id === id)

  if (!workout) {
    return (
      <AppLayout title="Workout Details">
        <div className="max-w-[800px] mx-auto">
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-400 mb-4">Workout not found</p>
              <Button onClick={() => router.push('/workout')}>Back to Workouts</Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  const totalVolume = workout.exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) => s + (set.completed ? set.reps * set.weight : 0), 0), 0)

  const totalReps = workout.exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) => s + set.reps, 0), 0)

  const muscleGroups = [...new Set(workout.exercises.map((ex) => ex.muscle))]

  const NOTES = "Great session! Felt strong on the main lifts. Consider increasing bench press weight next session."

  return (
    <AppLayout title="Workout Details">
      <div className="max-w-[800px] mx-auto space-y-4">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <Button variant="ghost" onClick={() => router.push('/workout')} className="mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Workouts
          </Button>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <GradientCard gradient="from-purple-600/20 to-blue-600/20">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{workout.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={workout.completed ? 'success' : 'warning'}>
                    {workout.completed ? 'Completed' : 'In Progress'}
                  </Badge>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(workout.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                  <Edit3 className="w-4 h-4" /> Edit
                </Button>
                <Button size="sm" variant="secondary">
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
                <Button size="sm" variant="secondary">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </div>
          </GradientCard>
        </motion.div>

        <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="pt-5 text-center">
                <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{workout.duration}</p>
                <p className="text-xs text-gray-400">Minutes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Weight className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{totalVolume.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Volume (kg)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{workout.caloriesBurned}</p>
                <p className="text-xs text-gray-400">Calories</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Dumbbell className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{workout.exercises.length}</p>
                <p className="text-xs text-gray-400">Exercises</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-purple-400" /> Exercise Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workout.exercises.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No exercises recorded</p>
              ) : (
                <div className="space-y-4">
                  {workout.exercises.map((exercise, exIdx) => (
                    <div key={exercise.id} className="border border-white/5 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-white/5">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
                            {exIdx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-white">{exercise.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="info" className="text-[10px]">{exercise.muscle}</Badge>
                              <span className="text-[10px] text-gray-500">{exercise.equipment}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{exercise.sets.length} sets</span>
                      </div>
                      {exercise.sets.length > 0 && (
                        <div className="p-3">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-500">
                                <th className="text-left pb-1 font-medium">Set</th>
                                <th className="text-center pb-1 font-medium">Reps</th>
                                <th className="text-center pb-1 font-medium">Weight</th>
                                <th className="text-center pb-1 font-medium">Volume</th>
                                <th className="text-center pb-1 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exercise.sets.map((set, setIdx) => (
                                <tr key={setIdx} className="border-t border-white/5">
                                  <td className="py-1.5 text-gray-300">{setIdx + 1}</td>
                                  <td className="py-1.5 text-center text-white">{set.reps}</td>
                                  <td className="py-1.5 text-center text-white">{set.weight} kg</td>
                                  <td className="py-1.5 text-center text-gray-400">{set.reps * set.weight} kg</td>
                                  <td className="py-1.5 text-center">
                                    {set.completed ? (
                                      <span className="text-green-400">✓</span>
                                    ) : (
                                      <span className="text-gray-600">—</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" /> Muscle Groups Hit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative w-48 h-64 flex-shrink-0">
                  <svg viewBox="0 0 100 160" className="w-full h-full">
                    <ellipse cx="50" cy="20" rx="15" ry="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    <rect x="35" y="38" width="30" height="40" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
                    <rect x="20" y="42" width="15" height="35" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <rect x="65" y="42" width="15" height="35" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <rect x="37" y="78" width="12" height="50" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <rect x="51" y="78" width="12" height="50" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    {muscleGroups.map((muscle) => {
                      const map = MUSCLE_BODY_MAP[muscle]
                      if (!map) return null
                      return (
                        <rect
                          key={muscle}
                          x={map.left}
                          y={map.top}
                          width={map.width}
                          height={map.height}
                          rx="4"
                          fill="rgba(168,85,247,0.5)"
                          stroke="rgba(168,85,247,0.8)"
                          strokeWidth="1"
                        />
                      )
                    })}
                  </svg>
                </div>
                <div className="flex-1 space-y-2 w-full">
                  {muscleGroups.map((muscle) => {
                    const exCount = workout.exercises.filter((ex) => ex.muscle === muscle).length
                    const setsCount = workout.exercises
                      .filter((ex) => ex.muscle === muscle)
                      .reduce((sum, ex) => sum + ex.sets.length, 0)
                    return (
                      <div key={muscle} className="flex items-center gap-3">
                        <div className={cn('w-3 h-3 rounded-full bg-gradient-to-br', MUSCLE_COLORS[muscle] || 'from-purple-500/30 to-blue-500/30')} />
                        <span className="text-sm text-white flex-1">{muscle}</span>
                        <span className="text-xs text-gray-400">{exCount} exercises · {setsCount} sets</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" /> Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 leading-relaxed">{NOTES}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}
