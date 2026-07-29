"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress, Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { completedWorkouts } from "@/lib/data";
import type { MuscleGroup } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Dumbbell, Clock, Weight, TrendingUp, Target } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const muscleGroupPositions: Record<MuscleGroup, { x: number; y: number }> = {
  Chest: { x: 50, y: 28 },
  Back: { x: 50, y: 28 },
  Shoulders: { x: 30, y: 22 },
  Arms: { x: 20, y: 38 },
  Legs: { x: 40, y: 65 },
  Core: { x: 50, y: 42 },
};

function WorkoutDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const workout = completedWorkouts.find((w) => w.id === id);

  if (!workout) {
    return (
      <AppLayout title="Workout Not Found">
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">This workout could not be found.</p>
          <Link href="/workout">
            <Button>Back to Workouts</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const maxVolumeExercise = workout.exercises.reduce(
    (max, ex) => {
      const vol = ex.sets.reduce((s, set) => s + set.reps * set.weight, 0);
      return vol > max.vol ? { name: ex.name, vol } : max;
    },
    { name: "", vol: 0 }
  );

  const chartData = workout.exercises.map((ex) => ({
    name: ex.name.slice(0, 12),
    volume: ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
    sets: ex.sets.length,
  }));

  return (
    <AppLayout title={workout.name}>
      <div className="space-y-4">
        <Link href="/workout" className="inline-flex">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10">
            <CardContent className="p-6">
              <div className="text-sm text-zinc-400 mb-1">{workout.date}</div>
              <h2 className="text-2xl font-bold text-white mb-4">{workout.name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{workout.duration}</div>
                    <div className="text-xs text-zinc-500">Minutes</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)}</div>
                    <div className="text-xs text-zinc-500">Sets</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Weight className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{workout.exercises.reduce((sum, ex) => sum + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0), 0).toLocaleString()}</div>
                    <div className="text-xs text-zinc-500">Volume (kg)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{workout.caloriesBurned}</div>
                    <div className="text-xs text-zinc-500">Calories</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-400" /> Exercise Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }}
                    />
                    <Bar dataKey="volume" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {workout.exercises.map((we) => {
                  const vol = we.sets.reduce((s, set) => s + set.reps * set.weight, 0);
                  const maxVol = maxVolumeExercise.vol || 1;
                  return (
                    <div key={we.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{we.name}</span>
                        <span className="text-zinc-400">{vol.toLocaleString()} kg</span>
                      </div>
                      <Progress value={vol} max={maxVol} color="from-violet-500 to-purple-500" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-violet-400" /> Muscle Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mx-auto" style={{ maxWidth: 300 }}>
                <svg viewBox="0 0 100 100" className="w-full">
                  {/* Head */}
                  <circle cx="50" cy="12" r="7" fill="none" stroke="#3f3f46" strokeWidth="1" />
                  {/* Neck */}
                  <line x1="50" y1="19" x2="50" y2="23" stroke="#3f3f46" strokeWidth="1" />
                  {/* Torso */}
                  <path d="M 38 23 L 35 50 L 42 55 L 58 55 L 65 50 L 62 23 Z" fill="none" stroke="#3f3f46" strokeWidth="1" />
                  {/* Arms */}
                  <path d="M 38 23 L 28 35 L 22 52" fill="none" stroke="#3f3f46" strokeWidth="1" />
                  <path d="M 62 23 L 72 35 L 78 52" fill="none" stroke="#3f3f46" strokeWidth="1" />
                  {/* Legs */}
                  <path d="M 42 55 L 38 72 L 36 92" fill="none" stroke="#3f3f46" strokeWidth="1" />
                  <path d="M 58 55 L 62 72 L 64 92" fill="none" stroke="#3f3f46" strokeWidth="1" />
                  {/* Active muscles */}
                  {(() => {
                    const colorMap: Record<MuscleGroup, string> = {
                      Chest: "#ef4444", Back: "#3b82f6", Shoulders: "#f59e0b",
                      Arms: "#8b5cf6", Legs: "#10b981", Core: "#f97316",
                    };
                    const muscleGroups = [...new Set(workout.exercises.map((e) => (e.muscle || 'Core') as MuscleGroup))];
                    return muscleGroups.map((mg) => {
                      const pos = muscleGroupPositions[mg];
                      return pos ? (
                        <g key={mg}>
                          <circle cx={pos.x} cy={pos.y} r="6" fill={colorMap[mg]} opacity="0.3" />
                          <circle cx={pos.x} cy={pos.y} r="3" fill={colorMap[mg]} />
                        </g>
                      ) : null;
                    });
                  })()}
                </svg>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {(() => {
                    const colorMap: Record<MuscleGroup, string> = {
                      Chest: "bg-red-500", Back: "bg-blue-500", Shoulders: "bg-amber-500",
                      Arms: "bg-violet-500", Legs: "bg-emerald-500", Core: "bg-orange-500",
                    };
                    const muscleGroups = [...new Set(workout.exercises.map((e) => (e.muscle || 'Core') as MuscleGroup))];
                    return muscleGroups.map((mg) => (
                      <div key={mg} className="flex items-center gap-1.5">
                        <div className={cn("w-2.5 h-2.5 rounded-full", colorMap[mg])} />
                        <span className="text-xs text-zinc-300">{mg}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {workout.notes && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-300">{workout.notes}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}

export default WorkoutDetailPage;
