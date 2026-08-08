"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getSportSessions, addSportSession } from "@/lib/data-operations";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Timer, Flame, Heart, Trophy, TrendingUp,
  ChevronDown, ChevronUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

type SportType = "Running" | "Cycling" | "Swimming" | "Basketball" | "Football" | "Tennis" | "Cricket" | "Badminton" | "Yoga" | "Pilates" | "HIIT";

const sportIcons: Record<string, string> = {
  Running: "\u{1F3C3}", Cycling: "\u{1F6B4}", Swimming: "\u{1F3CA}", Basketball: "\u{1F3C0}",
  Football: "\u26BD", Tennis: "\u{1F3BE}", Badminton: "\u{1F3F8}", Cricket: "\u{1F3CF}",
  Yoga: "\u{1F9D8}", Pilates: "\u{1F938}", HIIT: "\u26A1", Boxing: "\u{1F94A}",
  Cardio: "\u{1F3C3}", Strength: "\u{1F4AA}", Flexibility: "\u{1F9D8}",
};

const sportColors: Record<string, string> = {
  Running: "from-emerald-500 to-green-500",
  Cycling: "from-blue-500 to-cyan-500",
  Swimming: "from-cyan-500 to-blue-500",
  Basketball: "from-orange-500 to-amber-500",
  Football: "from-green-500 to-emerald-500",
  Tennis: "from-yellow-500 to-amber-500",
  Badminton: "from-pink-500 to-rose-500",
  Cricket: "from-red-500 to-orange-500",
  Yoga: "from-purple-500 to-violet-500",
  Pilates: "from-teal-500 to-cyan-500",
  HIIT: "from-red-500 to-pink-500",
  Boxing: "from-red-600 to-red-500",
  Cardio: "from-emerald-500 to-green-500",
  Strength: "from-orange-500 to-amber-500",
  Flexibility: "from-purple-500 to-violet-500",
};

const allSports: SportType[] = ["Running", "Cycling", "Swimming", "Basketball", "Football", "Tennis", "Cricket", "Badminton", "Yoga", "Pilates", "HIIT"];

export default function SportPage() {
  return (
    <AppLayout title="Sport">
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active"><Play className="h-4 w-4 mr-1.5" />Active</TabsTrigger>
          <TabsTrigger value="history"><Timer className="h-4 w-4 mr-1.5" />History</TabsTrigger>
          <TabsTrigger value="performance"><TrendingUp className="h-4 w-4 mr-1.5" />Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="active"><ActiveSportTab /></TabsContent>
        <TabsContent value="history"><SportHistoryTab /></TabsContent>
        <TabsContent value="performance"><PerformanceTab /></TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function ActiveSportTab() {
  const { user } = useAuth();
  const [selectedSport, setSelectedSport] = React.useState<SportType | null>(null);
  const [tracking, setTracking] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [heartRate, setHeartRate] = React.useState(72);
  const [distance, setDistance] = React.useState(0);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!tracking || isPaused) return;
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
      setHeartRate((hr) => Math.round(hr + (Math.random() - 0.4) * 6));
      setDistance((d) => d + Math.random() * 0.02);
    }, 1000);
    return () => clearInterval(interval);
  }, [tracking, isPaused]);

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const pace = elapsed > 0 ? (elapsed / 60 / Math.max(distance, 0.01)).toFixed(2) : "0.00";
  const estimatedCalories = Math.round(elapsed * 0.15 * (heartRate / 100));

  const saveSession = async () => {
    if (!selectedSport || !user) return;
    setSaveError(null);
    const durationMinutes = Math.max(1, Math.round(elapsed / 60));
    try {
      await addSportSession(user.id, {
        sport: selectedSport,
        duration_minutes: durationMinutes,
        calories_burned: estimatedCalories,
        distance: Number(distance.toFixed(2)),
        avg_heart_rate: Math.round(heartRate),
      });
    } catch (e) {
      console.error("Failed to save sport session:", e);
      setSaveError("Failed to save session. Please try again.");
      return;
    }
    setTracking(false);
    setIsPaused(false);
    setSelectedSport(null);
    setElapsed(0);
    setHeartRate(72);
    setDistance(0);
  };

  if (!selectedSport) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-400">Choose a sport to start tracking</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {allSports.map((sport, i) => (
            <motion.div key={sport} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
              <button
                onClick={() => setSelectedSport(sport)}
                className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition-all text-center group cursor-pointer"
              >
                <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-3 text-2xl", sportColors[sport] || "from-gray-500 to-gray-600")}>
                  {sportIcons[sport] || "\u{1F3C3}"}
                </div>
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{sport}</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelectedSport(null)}>{"\u2190"} Back to Sports</Button>
        <Card className={cn("border-zinc-700/50 bg-gradient-to-br", sportColors[selectedSport] || "from-gray-500 to-gray-600")}>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{sportIcons[selectedSport] || "\u{1F3C3}"}</div>
            <h2 className="text-2xl font-bold text-white mb-2">{selectedSport}</h2>
            <p className="text-white/70 mb-6">Ready to start your session?</p>
            <Button size="lg" className="bg-white text-zinc-900 hover:bg-white/90" onClick={() => { setTracking(true); setElapsed(0); setHeartRate(72); setDistance(0); }}>
              <Play className="h-5 w-5" /> Start Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={saveSession}>{"\u2190"} End Session</Button>
        <span className="text-sm text-zinc-400">{sportIcons[selectedSport] || "\u{1F3C3}"} {selectedSport}</span>
      </div>
      <Card className="border-zinc-700/50 bg-gradient-to-br from-zinc-900/80 to-zinc-800/50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-mono font-bold text-white mb-1">{formatElapsed(elapsed)}</div>
            <div className="text-sm text-zinc-400">Duration</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-400 mb-1"><Heart className="h-4 w-4" /><span className="text-xl font-bold">{heartRate}</span></div>
              <div className="text-xs text-zinc-500">BPM</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-orange-400 mb-1"><Flame className="h-4 w-4" /><span className="text-xl font-bold">{estimatedCalories}</span></div>
              <div className="text-xs text-zinc-500">Calories</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400 mb-1"><span className="text-xl font-bold">{distance.toFixed(2)}</span></div>
              <div className="text-xs text-zinc-500">km</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1"><span className="text-xl font-bold">{pace}</span></div>
              <div className="text-xs text-zinc-500">min/km</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-3">
        <Button variant={isPaused ? "default" : "secondary"} className="flex-1" onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? <><Play className="h-4 w-4" /> Resume</> : <><Pause className="h-4 w-4" /> Pause</>}
        </Button>
        <Button variant="success" className="flex-1" onClick={saveSession}><Trophy className="h-4 w-4" /> Finish</Button>
      </div>
      {saveError && <p className="text-sm text-red-400 text-center">{saveError}</p>}
    </div>
  );
}

function SportHistoryTab() {
  const { user } = useAuth();
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState<string>("All");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    getSportSessions(user.id).then(setSessions).catch(console.error);
  }, [user]);

  const filtered = filter === "All" ? sessions : sessions.filter((s: any) => s.sport === filter);
  const sportTypes = [...new Set(sessions.map((s: any) => s.sport))];

  if (sessions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Timer className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-white mb-2">No sport sessions yet</h3>
        <p className="text-zinc-400 text-sm">Complete a workout or active sport session to see your history here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant={filter === "All" ? "default" : "secondary"} size="sm" onClick={() => setFilter("All")}>All</Button>
        {sportTypes.map((sport: string) => (
          <Button key={sport} variant={filter === sport ? "default" : "secondary"} size="sm" onClick={() => setFilter(sport)}>{sport}</Button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((session: any, i: number) => (
          <motion.div key={session.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="overflow-hidden">
              <button onClick={() => setExpandedId(expandedId === session.id ? null : session.id)} className="w-full text-left p-4 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg", sportColors[session.sport] || "from-gray-500 to-gray-600")}>
                    {sportIcons[session.sport] || "\u{1F3C3}"}
                  </div>
                  <div>
                    <div className="font-medium text-white">{session.sport}</div>
                    <div className="text-xs text-zinc-400">{session.duration_minutes} min</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-orange-400">{session.calories_burned} cal</div>
                  </div>
                  {expandedId === session.id ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                </div>
              </button>
              <AnimatePresence>
                {expandedId === session.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-zinc-800 space-y-3">
                      <div className="grid grid-cols-2 gap-3 py-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-400">{session.calories_burned}</div>
                          <div className="text-xs text-zinc-500">Calories</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-emerald-400">{session.duration_minutes}</div>
                          <div className="text-xs text-zinc-500">Minutes</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{Number(session.distance || 0).toFixed(2)}</div>
                          <div className="text-xs text-zinc-500">Distance (km)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-400">{session.avg_heart_rate} bpm</div>
                          <div className="text-xs text-zinc-500">Avg Heart Rate</div>
                        </div>
                      </div>
                      {session.notes && <p className="text-sm text-zinc-400">{session.notes}</p>}
                      <p className="text-xs text-zinc-500">{new Date(session.completed_at || session.date).toLocaleString()}</p>
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

function PerformanceTab() {
  const { user } = useAuth();
  const [sessions, setSessions] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    getSportSessions(user.id).then(setSessions).catch(console.error);
  }, [user]);

  const sportCounts: Record<string, number> = {};
  sessions.forEach((s: any) => { sportCounts[s.sport] = (sportCounts[s.sport] || 0) + 1; });
  const barData = Object.entries(sportCounts).map(([name, count]) => ({ name, sessions: count }));

  const totalCalories = sessions.reduce((s, w) => s + (w.calories_burned || 0), 0);
  const totalMinutes = sessions.reduce((s, w) => s + (w.duration_minutes || 0), 0);

  if (sessions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <TrendingUp className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-white mb-2">No performance data yet</h3>
        <p className="text-zinc-400 text-sm">Complete sport sessions to see your performance analytics.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-400">{totalCalories.toLocaleString()}</p>
            <p className="text-xs text-zinc-500">Total Calories Burned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">{totalMinutes}</p>
            <p className="text-xs text-zinc-500">Total Minutes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-violet-400" /> Sessions by Sport</CardTitle></CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }} />
                <Bar dataKey="sessions" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
