"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { sportSessions, sportRecords, leaderboardData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Timer, Flame, Heart, Trophy, TrendingUp,
  Medal, Crown, ChevronDown, ChevronUp, Zap, Target,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

type SportType = "Running" | "Cycling" | "Swimming" | "Basketball" | "Football" | "Tennis" | "Cricket" | "Badminton" | "Yoga" | "Pilates" | "HIIT";

const sportIcons: Record<string, string> = {
  Running: "🏃", Cycling: "🚴", Swimming: "🏊", Basketball: "🏀",
  Football: "⚽", Tennis: "🎾", Badminton: "🏸", Cricket: "🏏",
  Yoga: "🧘", Pilates: "🤸", HIIT: "⚡", Boxing: "🥊",
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
          <TabsTrigger value="leaderboard"><Trophy className="h-4 w-4 mr-1.5" />Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="active"><ActiveSportTab /></TabsContent>
        <TabsContent value="history"><SportHistoryTab /></TabsContent>
        <TabsContent value="performance"><PerformanceTab /></TabsContent>
        <TabsContent value="leaderboard"><LeaderboardTab /></TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function ActiveSportTab() {
  const [selectedSport, setSelectedSport] = React.useState<SportType | null>(null);
  const [tracking, setTracking] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [heartRate, setHeartRate] = React.useState(72);
  const [distance, setDistance] = React.useState(0);

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
                <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-3 text-2xl", sportColors[sport])}>
                  {sportIcons[sport]}
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
        <Button variant="ghost" size="sm" onClick={() => setSelectedSport(null)}>← Back to Sports</Button>
        <Card className={cn("border-zinc-700/50 bg-gradient-to-br", sportColors[selectedSport])}>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{sportIcons[selectedSport]}</div>
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
        <Button variant="ghost" size="sm" onClick={() => { setTracking(false); setSelectedSport(null); }}>← End Session</Button>
        <span className="text-sm text-zinc-400">{sportIcons[selectedSport]} {selectedSport}</span>
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
        <Button variant="success" className="flex-1" onClick={() => setTracking(false)}><Trophy className="h-4 w-4" /> Finish</Button>
      </div>
    </div>
  );
}

function SportHistoryTab() {
  const [filter, setFilter] = React.useState<string>("All");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const sessions = (sportSessions as any[]) || [];
  const filtered = filter === "All" ? sessions : sessions.filter((s: any) => s.sport === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant={filter === "All" ? "default" : "secondary"} size="sm" onClick={() => setFilter("All")}>All</Button>
        {[...new Set(sessions.map((s: any) => s.sport))].map((sport: string) => (
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
                    {sportIcons[session.sport] || "🏃"}
                  </div>
                  <div>
                    <div className="font-medium text-white">{session.sport}</div>
                    <div className="text-xs text-zinc-400">{session.duration} min</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-orange-400">{session.caloriesBurned} cal</div>
                    {session.distance && <div className="text-xs text-zinc-500">{session.distance} km</div>}
                  </div>
                  {expandedId === session.id ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                </div>
              </button>
              <AnimatePresence>
                {expandedId === session.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-zinc-800 space-y-3">
                      <div className="grid grid-cols-3 gap-3 py-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-400">{session.heartRate || "—"}</div>
                          <div className="text-xs text-zinc-500">Heart Rate</div>
                        </div>
                        {session.distance && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">{session.distance}</div>
                            <div className="text-xs text-zinc-500">km</div>
                          </div>
                        )}
                        <div className="text-center">
                          <div className="text-lg font-bold text-emerald-400">{session.duration}</div>
                          <div className="text-xs text-zinc-500">min</div>
                        </div>
                      </div>
                      {session.notes && <p className="text-sm text-zinc-400">{session.notes}</p>}
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
  const sessions = (sportSessions as any[]) || [];
  const sportCounts: Record<string, number> = {};
  sessions.forEach((s: any) => { sportCounts[s.sport] = (sportCounts[s.sport] || 0) + 1; });
  const barData = Object.entries(sportCounts).map(([name, sessions]) => ({ name, sessions }));

  const radarData = [
    { subject: "Endurance", value: 85 }, { subject: "Strength", value: 72 },
    { subject: "Speed", value: 68 }, { subject: "Agility", value: 75 },
    { subject: "Flexibility", value: 60 }, { subject: "Recovery", value: 80 },
  ];

  const records = (sportRecords as any[]) || [];

  return (
    <div className="space-y-4">
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

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-violet-400" /> Performance Radar</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#71717a", fontSize: 11 }} />
                <Radar name="Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Medal className="h-4 w-4 text-violet-400" /> Best Records</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {records.map((record: any, i: number) => (
              <motion.div key={record.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg", sportColors[record.sport] || "from-gray-500 to-gray-600")}>
                      {sportIcons[record.sport] || "🏃"}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{record.sport}</div>
                      <div className="text-xs text-zinc-500">{record.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-violet-400">{record.record}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LeaderboardTab() {
  const leaders = (leaderboardData as any[]) || [];
  const topThree = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="space-y-6">
      <Card className="border-zinc-700/50 bg-gradient-to-br from-amber-500/10 to-yellow-500/10">
        <CardContent className="p-6">
          <div className="flex items-end justify-center gap-6">
            {[1, 0, 2].map((idx) => {
              const e = topThree[idx];
              if (!e) return null;
              const heights = ["h-24", "h-32", "h-20"];
              const medalColors = ["text-amber-400", "text-zinc-300", "text-amber-600"];
              return (
                <div key={e.id} className="flex flex-col items-center">
                  <div className="text-2xl mb-1">{e.avatar || "👤"}</div>
                  <div className="text-xs font-medium text-white mb-1">{e.name}</div>
                  <div className="text-xs text-zinc-400 mb-2">{e.score}</div>
                  <div className={cn("w-16 rounded-t-xl bg-zinc-800 flex items-center justify-center", heights[idx])}>
                    <Crown className={cn("h-6 w-6", medalColors[idx])} />
                  </div>
                  <div className="text-xs font-bold text-white mt-1">#{e.rank}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {rest.map((entry: any, i: number) => (
          <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 text-center text-sm font-bold text-zinc-400">#{entry.rank}</div>
                <div className="text-xl">{entry.avatar || "👤"}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{entry.name}</div>
                  <div className="text-xs text-zinc-500">Level {entry.level}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-violet-400">{entry.score}</div>
                  <div className="text-xs text-zinc-500">pts</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
