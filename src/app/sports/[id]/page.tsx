"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sportSessions } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Flame, Heart, MapPin, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const sportIcons: Record<string, string> = {
  Running: "🏃", Cycling: "🚴", Swimming: "🏊", Basketball: "🏀",
  Football: "⚽", Tennis: "🎾", Yoga: "🧘", HIIT: "⚡",
};

const sportColorMap: Record<string, string> = {
  Running: "from-emerald-500 to-green-500",
  Cycling: "from-blue-500 to-cyan-500",
  Swimming: "from-cyan-500 to-blue-500",
  Basketball: "from-orange-500 to-amber-500",
  Tennis: "from-yellow-500 to-amber-500",
  Yoga: "from-purple-500 to-violet-500",
  HIIT: "from-red-500 to-pink-500",
};

const zoneColors = ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"];

export default function SportDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const sessions = (sportSessions as any[]) || [];
  const session = sessions.find((s: any) => s.id === id);

  if (!session) {
    return (
      <AppLayout title="Session Not Found">
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">This session could not be found.</p>
          <Link href="/sport"><Button>Back to Sports</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const hrZoneData = [
    { zone: "Rest", minutes: Math.round(session.duration * 0.1), color: zoneColors[0] },
    { zone: "Fat Burn", minutes: Math.round(session.duration * 0.2), color: zoneColors[1] },
    { zone: "Cardio", minutes: Math.round(session.duration * 0.35), color: zoneColors[2] },
    { zone: "Hard", minutes: Math.round(session.duration * 0.25), color: zoneColors[3] },
    { zone: "Peak", minutes: Math.round(session.duration * 0.1), color: zoneColors[4] },
  ];

  const hrData = Array.from({ length: Math.min(session.duration, 30) }, (_, i) => ({
    time: i,
    bpm: Math.round((session.heartRate || 140) + Math.sin(i * 0.3) * 15 + (Math.random() - 0.5) * 10),
  }));

  const similarSessions = sessions.filter((s: any) => s.sport === session.sport && s.id !== session.id).slice(0, 4);

  return (
    <AppLayout title={`${session.sport} Session`}>
      <div className="space-y-4">
        <Link href="/sport" className="inline-flex">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className={cn("border-zinc-700/50 bg-gradient-to-br", sportColorMap[session.sport] || "from-gray-500 to-gray-600")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{sportIcons[session.sport] || "🏃"}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{session.sport}</h2>
                  {session.notes && <div className="text-sm text-white/70">{session.notes}</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Clock className="h-5 w-5 text-white" /></div>
                  <div><div className="text-lg font-bold text-white">{session.duration}</div><div className="text-xs text-white/60">Minutes</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Flame className="h-5 w-5 text-white" /></div>
                  <div><div className="text-lg font-bold text-white">{session.caloriesBurned}</div><div className="text-xs text-white/60">Calories</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Heart className="h-5 w-5 text-white" /></div>
                  <div><div className="text-lg font-bold text-white">{session.heartRate || "—"}</div><div className="text-xs text-white/60">Heart Rate</div></div>
                </div>
                {session.distance && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-white" /></div>
                    <div><div className="text-lg font-bold text-white">{session.distance}</div><div className="text-xs text-white/60">km</div></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-violet-400" /> Heart Rate Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={hrData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="time" stroke="#71717a" fontSize={11} />
                  <YAxis domain={[60, "dataMax + 10"]} stroke="#71717a" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }} />
                  <Area type="monotone" dataKey="bpm" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full">
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-violet-400" /> Heart Rate Zones</CardTitle></CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hrZoneData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis type="number" stroke="#71717a" fontSize={11} />
                      <YAxis type="category" dataKey="zone" stroke="#71717a" fontSize={11} width={70} />
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }} />
                      <Bar dataKey="minutes" radius={[0, 6, 6, 0]}>
                        {hrZoneData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="h-full">
              <CardHeader><CardTitle className="text-base">Session Comparison</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {similarSessions.length > 0 ? similarSessions.map((s: any) => {
                    const diff = s.caloriesBurned - session.caloriesBurned;
                    return (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50">
                        <div>
                          <div className="text-sm font-medium text-white">{s.sport}</div>
                          <div className="text-xs text-zinc-500">{s.duration} min</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">{s.caloriesBurned} cal</div>
                          <div className={cn("text-xs", diff >= 0 ? "text-emerald-400" : "text-red-400")}>
                            {diff >= 0 ? "+" : ""}{diff} vs current
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <p className="text-sm text-zinc-500 text-center py-4">No other sessions to compare</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {session.notes && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-zinc-300">{session.notes}</p></CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
