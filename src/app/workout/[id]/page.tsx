"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
import type { MuscleGroup } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Dumbbell, Clock, Weight, TrendingUp, Target } from "lucide-react";
import Link from "next/link";


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
  const { user } = useAuth();
  const [workout, setWorkout] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user || !id) return;
    const fetchWorkout = async () => {
      const { data } = await supabase.from("workouts").select("*").eq("id", id).eq("user_id", user.id).single();
      setWorkout(data);
      setLoading(false);
    };
    fetchWorkout().catch(() => setLoading(false));
  }, [user, id]);

  if (loading) {
    return (
      <AppLayout title="Workout">
        <div className="text-center py-12 text-zinc-400">Loading...</div>
      </AppLayout>
    );
  }

  if (!workout) {
    return (
      <AppLayout title="Workout Not Found">
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">This workout could not be found.</p>
          <Link href="/workout"><Button>Back to Workouts</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const exercises = workout.exercises || [];
  const chartData = exercises.map((ex: any) => ({
    name: (ex.name || "Exercise").slice(0, 12),
    volume: 0,
    sets: 1,
  }));

  const muscleGroups = Array.from(new Set<string>(exercises.map((e: any) => (e.muscle || "Core") as string))) as MuscleGroup[];

  return (
    <AppLayout title={workout.name || "Workout"}>
      <div className="space-y-4">
        <Link href="/workout" className="inline-flex">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10">
            <CardContent className="p-6">
              <div className="text-sm text-zinc-400 mb-1">{new Date(workout.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
              <h2 className="text-2xl font-bold text-white mb-4">{workout.name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center"><Clock className="h-5 w-5 text-violet-400" /></div>
                  <div><div className="text-lg font-bold text-white">{workout.duration_minutes}</div><div className="text-xs text-zinc-500">Minutes</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><Dumbbell className="h-5 w-5 text-blue-400" /></div>
                  <div><div className="text-lg font-bold text-white">{exercises.length}</div><div className="text-xs text-zinc-500">Exercises</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Weight className="h-5 w-5 text-emerald-400" /></div>
                  <div><div className="text-lg font-bold text-white">—</div><div className="text-xs text-zinc-500">Volume (kg)</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center"><Flame className="h-5 w-5 text-orange-400" /></div>
                  <div><div className="text-lg font-bold text-white">{workout.calories_burned}</div><div className="text-xs text-zinc-500">Calories</div></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {exercises.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-violet-400" /> Exercises</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercises.map((ex: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-sm text-white">{ex.name}</span>
                      <span className="text-xs text-zinc-400">{ex.muscle || "—"}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {muscleGroups.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-violet-400" /> Muscle Map</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  {muscleGroups.map((mg) => {
                    const colorMap: Record<MuscleGroup, string> = { Chest: "bg-red-500", Back: "bg-blue-500", Shoulders: "bg-amber-500", Arms: "bg-violet-500", Legs: "bg-emerald-500", Core: "bg-orange-500" };
                    return (
                      <div key={mg} className="flex items-center gap-1.5">
                        <div className={cn("w-2.5 h-2.5 rounded-full", colorMap[mg])} />
                        <span className="text-xs text-zinc-300">{mg}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {workout.notes && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-zinc-300">{workout.notes}</p></CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}

export default WorkoutDetailPage;
