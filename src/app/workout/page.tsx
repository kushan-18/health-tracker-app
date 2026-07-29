"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/ui/modal";
import { exercises, completedWorkouts, workoutPlanSample } from "@/lib/data";
import type { Exercise, WorkoutSet, WorkoutExercise, CompletedWorkout, MuscleGroup } from "@/lib/types";
import { cn, generateId, formatTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, RotateCcw, Plus, Trash2, Timer, Dumbbell, ChevronDown, ChevronUp,
  Search, Sparkles, Zap, Target, Clock, Flame, Weight, X, Check, BookOpen, Filter,
  Calendar, TrendingUp, List,
} from "lucide-react";

const muscleGroups: MuscleGroup[] = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];
const muscleGroupColors: Record<MuscleGroup, string> = {
  Chest: "from-red-500 to-pink-500",
  Back: "from-blue-500 to-cyan-500",
  Shoulders: "from-amber-500 to-yellow-500",
  Arms: "from-purple-500 to-violet-500",
  Legs: "from-emerald-500 to-green-500",
  Core: "from-orange-500 to-red-500",
};

function WorkoutPage() {
  return (
    <AppLayout title="Workout">
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active"><Play className="h-4 w-4 mr-1.5" />Active</TabsTrigger>
          <TabsTrigger value="history"><Clock className="h-4 w-4 mr-1.5" />History</TabsTrigger>
          <TabsTrigger value="library"><BookOpen className="h-4 w-4 mr-1.5" />Library</TabsTrigger>
          <TabsTrigger value="ai"><Sparkles className="h-4 w-4 mr-1.5" />AI Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="active"><ActiveWorkoutTab /></TabsContent>
        <TabsContent value="history"><HistoryTab /></TabsContent>
        <TabsContent value="library"><LibraryTab /></TabsContent>
        <TabsContent value="ai"><AIGeneratorTab /></TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function ActiveWorkoutTab() {
  const [started, setStarted] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [workoutExercises, setWorkoutExercises] = React.useState<WorkoutExercise[]>([]);
  const [showAddExercise, setShowAddExercise] = React.useState(false);
  const [showRestTimer, setShowRestTimer] = React.useState(false);
  const [restTime, setRestTime] = React.useState(90);
  const [restRemaining, setRestRemaining] = React.useState(90);
  const [notes, setNotes] = React.useState("");
  const [workoutName, setWorkoutName] = React.useState("My Workout");

  React.useEffect(() => {
    if (!started || isPaused) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [started, isPaused]);

  React.useEffect(() => {
    if (!showRestTimer || restRemaining <= 0) {
      if (restRemaining <= 0 && showRestTimer) setShowRestTimer(false);
      return;
    }
    const interval = setInterval(() => setRestRemaining((r) => r - 1), 1000);
    return () => clearInterval(interval);
  }, [showRestTimer, restRemaining]);

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
  };

  const totalVolume = workoutExercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).reduce((s, set) => s + set.reps * set.weight, 0),
    0
  );
  const totalSets = workoutExercises.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0);

  const addExercise = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      id: generateId(),
      name: exercise.name,
      muscle: exercise.muscle,
      exercise,
      sets: [{ id: generateId(), setNumber: 1, reps: 0, weight: 0, completed: false, isWarmup: false }],
      notes: "",
    };
    setWorkoutExercises((prev) => [...prev, newWorkoutExercise]);
    setShowAddExercise(false);
  };

  const addSet = (exerciseId: string) => {
    setWorkoutExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [
            ...ex.sets,
            { id: generateId(), setNumber: ex.sets.length + 1, reps: lastSet?.reps || 0, weight: lastSet?.weight || 0, completed: false, isWarmup: false },
          ],
        };
      })
    );
  };

  const updateSet = (exerciseId: string, setId: string, field: "reps" | "weight", value: number) => {
    setWorkoutExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
        };
      })
    );
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setWorkoutExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, completed: !s.completed } : s)),
        };
      })
    );
    setShowRestTimer(true);
    setRestRemaining(restTime);
  };

  const removeExercise = (exerciseId: string) => {
    setWorkoutExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };

  const finishWorkout = () => {
    setStarted(false);
    setElapsed(0);
    setWorkoutExercises([]);
    setNotes("");
  };

  if (!started) {
    return (
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Ready to Crush It?</h2>
              <p className="text-zinc-400 mb-6">Start a new workout and track your progress</p>
              <div className="flex items-center justify-center gap-3 mb-6">
                <input
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Workout name"
                />
              </div>
              <Button size="lg" onClick={() => setStarted(true)}>
                <Play className="h-5 w-5" /> Start Workout
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{completedWorkouts.length}</div>
              <div className="text-xs text-zinc-400 mt-1">This Week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{completedWorkouts.reduce((s, w) => s + w.exercises.reduce((vs, ex) => vs + ex.sets.reduce((ss, set) => ss + set.reps * set.weight, 0), 0), 0).toLocaleString()}</div>
              <div className="text-xs text-zinc-400 mt-1">Total Volume</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{completedWorkouts.reduce((s, w) => s + w.caloriesBurned, 0)}</div>
              <div className="text-xs text-zinc-400 mt-1">Calories</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-blue-500/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">{workoutName}</h2>
              <p className="text-sm text-zinc-400">{formatElapsed(elapsed)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant={isPaused ? "default" : "secondary"} size="icon" onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button variant="success" onClick={finishWorkout}>
                <Check className="h-4 w-4" /> Finish
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-violet-400">{formatElapsed(elapsed)}</div>
              <div className="text-xs text-zinc-500">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{totalSets}</div>
              <div className="text-xs text-zinc-500">Sets</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400">{totalVolume.toLocaleString()}</div>
              <div className="text-xs text-zinc-500">Volume (kg)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {workoutExercises.map((we) => (
          <motion.div key={we.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{we.name}</CardTitle>
                    <p className="text-xs text-zinc-500">{we.muscle}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeExercise(we.id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-zinc-500 text-xs">
                        <th className="text-left pb-2">Set</th>
                        <th className="text-center pb-2">Weight (kg)</th>
                        <th className="text-center pb-2">Reps</th>
                        <th className="text-center pb-2 w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {we.sets.map((set) => (
                        <tr key={set.id} className={cn("border-t border-zinc-800", set.completed && "bg-emerald-500/5")}>
                          <td className="py-2 text-zinc-400">{set.setNumber}</td>
                          <td className="py-2">
                            <input
                              type="number"
                              value={set.weight || ""}
                              onChange={(e) => updateSet(we.id, set.id, "weight", Number(e.target.value))}
                              className="w-16 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-center text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              value={set.reps || ""}
                              onChange={(e) => updateSet(we.id, set.id, "reps", Number(e.target.value))}
                              className="w-16 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-center text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2 text-center">
                            <button
                              onClick={() => toggleSetComplete(we.id, set.id)}
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer",
                                set.completed ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => addSet(we.id)}>
                  <Plus className="h-4 w-4" /> Add Set
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button variant="outline" className="w-full" onClick={() => setShowAddExercise(true)}>
        <Plus className="h-4 w-4" /> Add Exercise
      </Button>

      <div className="space-y-2">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Workout notes..."
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          rows={3}
        />
      </div>

      <Modal open={showAddExercise} onClose={() => setShowAddExercise(false)}>
        <div className="p-4 border-b border-zinc-800"><h3 className="text-lg font-semibold text-white">Add Exercise</h3></div>
        <div className="max-h-80 overflow-y-auto space-y-2 p-2">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => addExercise(ex)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 transition-colors text-left cursor-pointer"
            >
              <div>
                <div className="text-sm font-medium text-white">{ex.name}</div>
                <div className="text-xs text-zinc-500">{ex.muscle}</div>
              </div>
              <Plus className="h-4 w-4 text-zinc-400" />
            </button>
          ))}
        </div>
      </Modal>

      {showRestTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowRestTimer(false)} />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 bg-zinc-900/95 border border-zinc-700/50 rounded-3xl p-8 text-center backdrop-blur-xl"
          >
            <div className="text-sm text-zinc-400 mb-4">REST TIMER</div>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg width="192" height="192" className="-rotate-90">
                <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle
                  cx="96" cy="96" r="88" fill="none" stroke="#8b5cf6" strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - restRemaining / restTime)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">{restRemaining}</span>
                <span className="text-sm text-zinc-400">seconds</span>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="secondary" onClick={() => setRestRemaining(restTime)}>
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              <Button onClick={() => setShowRestTimer(false)}>Skip</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function HistoryTab() {
  const [filter, setFilter] = React.useState<string>("All");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const filteredWorkouts = React.useMemo(() => {
    const now = new Date();
    return completedWorkouts.filter((w) => {
      if (filter === "All") return true;
      const d = new Date(w.date);
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (filter === "This Week") return diffDays <= 7;
      if (filter === "This Month") return diffDays <= 30;
      return true;
    });
  }, [filter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", "This Week", "This Month"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredWorkouts.map((w, i) => (
          <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === w.id ? null : w.id)}
                className="w-full text-left p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{w.name}</div>
                    <div className="text-xs text-zinc-400">{w.date} · {w.duration} min</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-violet-400">{w.exercises.reduce((vs, ex) => vs + ex.sets.reduce((ss, set) => ss + set.reps * set.weight, 0), 0).toLocaleString()} kg</div>
                    <div className="text-xs text-zinc-500">{w.caloriesBurned} cal</div>
                  </div>
                  {expandedId === w.id ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                </div>
              </button>

              <AnimatePresence>
                {expandedId === w.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-zinc-800">
                      <div className="grid grid-cols-3 gap-3 py-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{w.duration}</div>
                          <div className="text-xs text-zinc-500">Minutes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{w.exercises.reduce((s, ex) => s + ex.sets.length, 0)}</div>
                          <div className="text-xs text-zinc-500">Sets</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{w.caloriesBurned}</div>
                          <div className="text-xs text-zinc-500">Calories</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {w.exercises.map((we) => (
                          <div key={we.id} className="bg-zinc-800/50 rounded-lg p-3">
                            <div className="text-sm font-medium text-white">{we.name}</div>
                            <div className="text-xs text-zinc-400 mt-1">
                              {we.sets.length} sets · {we.sets.reduce((s, set) => s + set.reps, 0)} total reps
                            </div>
                          </div>
                        ))}
                      </div>
                      {(() => {
                        const muscleGroups = [...new Set(w.exercises.map((e) => e.muscle))];
                        return muscleGroups.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {muscleGroups.map((mg) => (
                              <span key={mg} className="px-2 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-300">
                                {mg}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LibraryTab() {
  const [selectedGroup, setSelectedGroup] = React.useState<MuscleGroup | "All">("All");
  const [search, setSearch] = React.useState("");

  const filteredExercises = React.useMemo(() => {
    return exercises.filter((ex) => {
      if (selectedGroup !== "All" && ex.muscle !== selectedGroup) return false;
      if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [selectedGroup, search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant={selectedGroup === "All" ? "default" : "secondary"} size="sm" onClick={() => setSelectedGroup("All")}>
          All
        </Button>
        {muscleGroups.map((mg) => (
          <Button key={mg} variant={selectedGroup === mg ? "default" : "secondary"} size="sm" onClick={() => setSelectedGroup(mg)}>
            {mg}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredExercises.map((ex, i) => (
          <motion.div key={ex.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
            <Card className="hover:border-zinc-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white">{ex.name}</h3>
                  <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r text-white", muscleGroupColors[ex.muscle as MuscleGroup])}>
                    {ex.muscle}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">{ex.muscle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AIGeneratorTab() {
  const [goal, setGoal] = React.useState("Muscle Building");
  const [experience, setExperience] = React.useState("Intermediate");
  const [days, setDays] = React.useState("4");
  const [equipment, setEquipment] = React.useState("Full Gym");
  const [generated, setGenerated] = React.useState(false);

  return (
    <div className="space-y-4">
      {!generated ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" /> AI Workout Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">Goal</label>
              <div className="grid grid-cols-2 gap-2">
                {["Muscle Building", "Fat Loss", "Strength", "Endurance", "General Fitness"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={cn(
                      "p-3 rounded-xl text-sm font-medium transition-all cursor-pointer border",
                      goal === g
                        ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
                        : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:border-zinc-600"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">Experience</label>
              <div className="grid grid-cols-3 gap-2">
                {["Beginner", "Intermediate", "Advanced"].map((e) => (
                  <button
                    key={e}
                    onClick={() => setExperience(e)}
                    className={cn(
                      "p-3 rounded-xl text-sm font-medium transition-all cursor-pointer border",
                      experience === e
                        ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
                        : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:border-zinc-600"
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">Days per Week</label>
              <div className="grid grid-cols-5 gap-2">
                {["3", "4", "5", "6", "7"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={cn(
                      "p-3 rounded-xl text-sm font-medium transition-all cursor-pointer border",
                      days === d
                        ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
                        : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:border-zinc-600"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">Equipment</label>
              <div className="grid grid-cols-2 gap-2">
                {["Full Gym", "Dumbbells Only", "Bodyweight", "Minimal Equipment"].map((eq) => (
                  <button
                    key={eq}
                    onClick={() => setEquipment(eq)}
                    className={cn(
                      "p-3 rounded-xl text-sm font-medium transition-all cursor-pointer border",
                      equipment === eq
                        ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
                        : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:border-zinc-600"
                    )}
                  >
                    {eq}
                  </button>
                ))}
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={() => setGenerated(true)}>
              <Sparkles className="h-5 w-5" /> Generate Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white">AI {goal} Plan</h2>
                <Button variant="ghost" size="sm" onClick={() => setGenerated(false)}>
                  <X className="h-4 w-4" /> Edit
                </Button>
              </div>
              <p className="text-sm text-zinc-400">{experience} · {days} days/week · {equipment}</p>
            </CardContent>
          </Card>

          {workoutPlanSample.filter((d) => d.exercises.length > 0).map((day, i) => (
            <motion.div key={day.day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{day.day} — {day.focus}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {day.exercises.map((ex, j) => (
                      <div key={j} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                        <span className="text-sm text-white">{ex}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <Button className="w-full" onClick={() => alert("Plan saved!")}>
            <Check className="h-4 w-4" /> Save This Plan
          </Button>
        </div>
      )}
    </div>
  );
}

export default WorkoutPage;
