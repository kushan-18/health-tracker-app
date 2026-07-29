"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { healthMetrics, heartRateData, heartRateZones, hrvData, sleepData, sleepSummary, mentalHealthData, healthLogs } from "@/lib/data";
import {
  Heart, Thermometer, Wind, Droplets, Activity, Moon,
  Brain, Smile, Zap, Timer, Play, Pause, RotateCcw, Plus
} from "lucide-react";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

const metricCards = [
  { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: Activity, color: "text-rose-400", bg: "from-rose-500/20 to-rose-500/5" },
  { label: "Blood Sugar", value: "95", unit: "mg/dL", icon: Droplets, color: "text-amber-400", bg: "from-amber-500/20 to-amber-500/5" },
  { label: "SpO2", value: "98", unit: "%", icon: Wind, color: "text-cyan-400", bg: "from-cyan-500/20 to-cyan-500/5" },
  { label: "Heart Rate", value: "68", unit: "bpm", icon: Heart, color: "text-red-400", bg: "from-red-500/20 to-red-500/5" },
  { label: "Temperature", value: "98.4", unit: "°F", icon: Thermometer, color: "text-orange-400", bg: "from-orange-500/20 to-orange-500/5" },
];

const moodOptions = ["😔", "😐", "😊", "😄", "🤩"];
const stressLevels = [
  { level: 1, label: "Very Low", color: "#22c55e" },
  { level: 2, label: "Low", color: "#84cc16" },
  { level: 3, label: "Moderate", color: "#eab308" },
  { level: 4, label: "High", color: "#f97316" },
  { level: 5, label: "Very High", color: "#ef4444" },
];

export default function HealthPage() {
  const [selectedMood, setSelectedMood] = useState("😊");
  const [stressLevel, setStressLevel] = useState(2);
  const [energy, setEnergy] = useState(75);
  const [recovery, setRecovery] = useState(82);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale");
  const [breathingCount, setBreathingCount] = useState(4);
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const breathingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meditationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startBreathing = () => {
    if (breathingActive) {
      setBreathingActive(false);
      if (breathingRef.current) clearInterval(breathingRef.current);
      return;
    }
    setBreathingActive(true);
    let phase = 0;
    const phases = ["Inhale", "Hold", "Exhale", "Hold"];
    const durations = [4, 4, 4, 4];
    let count = durations[0];
    setBreathingPhase(phases[0]);
    setBreathingCount(count);
    breathingRef.current = setInterval(() => {
      count--;
      if (count <= 0) {
        phase = (phase + 1) % 4;
        count = durations[phase];
        setBreathingPhase(phases[phase]);
      }
      setBreathingCount(count);
    }, 1000);
  };

  const startMeditation = () => {
    if (meditationActive) {
      setMeditationActive(false);
      if (meditationRef.current) clearInterval(meditationRef.current);
      return;
    }
    setMeditationActive(true);
    meditationRef.current = setInterval(() => {
      setMeditationTime((t) => t + 1);
    }, 1000);
  };

  const resetMeditation = () => {
    setMeditationActive(false);
    setMeditationTime(0);
    if (meditationRef.current) clearInterval(meditationRef.current);
  };

  useEffect(() => {
    return () => {
      if (breathingRef.current) clearInterval(breathingRef.current);
      if (meditationRef.current) clearInterval(meditationRef.current);
    };
  }, []);

  const formatMeditationTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const sleepBreakdown = [
    { name: "Deep", value: sleepSummary.deep, color: "#6366f1" },
    { name: "Light", value: sleepSummary.light, color: "#818cf8" },
    { name: "REM", value: sleepSummary.rem, color: "#a78bfa" },
    { name: "Awake", value: sleepSummary.awake, color: "#374151" },
  ];

  return (
    <AppLayout title="Health Tracking">
      <Tabs defaultValue="metrics">
        <TabsList className="mb-6">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="heart">Heart</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="mental">Mental</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {metricCards.map((metric, i) => (
                <motion.div key={metric.label} variants={fadeIn}>
                  <Card className={`bg-gradient-to-br ${metric.bg} border-zinc-800`}>
                    <CardContent className="p-4">
                      <metric.icon className={`h-6 w-6 ${metric.color} mb-3`} />
                      <p className="text-xs text-zinc-400 mb-1">{metric.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-zinc-100">{metric.value}</span>
                        <span className="text-xs text-zinc-500">{metric.unit}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader><CardTitle>Weekly Vitals</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={heartRateData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                        <Legend />
                        <Line type="monotone" dataKey="resting" stroke="#8b5cf6" strokeWidth={2} name="Resting" />
                        <Line type="monotone" dataKey="active" stroke="#06b6d4" strokeWidth={2} name="Active" />
                        <Line type="monotone" dataKey="peak" stroke="#ef4444" strokeWidth={2} name="Peak" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader><CardTitle>Recent Readings</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                      {healthMetrics.map((m) => (
                        <div key={m.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/40 p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                              <Activity className="h-4 w-4 text-violet-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-200 capitalize">{m.type.replace("_", " ")}</p>
                              <p className="text-xs text-zinc-500">{new Date(m.date).toLocaleString()}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-zinc-200">
                            {m.value} {m.unit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="heart">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Resting HR", value: 68, unit: "bpm", icon: Heart, color: "text-red-400" },
                { label: "Max HR", value: 165, unit: "bpm", icon: Activity, color: "text-orange-400" },
                { label: "Average HR", value: 82, unit: "bpm", icon: Zap, color: "text-amber-400" },
                { label: "HRV", value: 42, unit: "ms", icon: Heart, color: "text-violet-400" },
              ].map((item) => (
                <motion.div key={item.label} variants={fadeIn}>
                  <Card>
                    <CardContent className="p-4">
                      <item.icon className={`h-5 w-5 ${item.color} mb-2`} />
                      <p className="text-xs text-zinc-400">{item.label}</p>
                      <p className="text-2xl font-bold text-zinc-100">{item.value} <span className="text-xs text-zinc-500">{item.unit}</span></p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader><CardTitle>Heart Rate Zones</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={heartRateZones}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                        <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                          {heartRateZones.map((entry, i) => (
                            <motion.rect key={i} fill={entry.color} initial={{ height: 0 }} animate={{ height: "auto" }} transition={{ delay: i * 0.1 }} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader><CardTitle>Daily Heart Rate</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                       <AreaChart data={heartRateData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                        <Area type="monotone" dataKey="peak" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                        <Area type="monotone" dataKey="active" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                        <Area type="monotone" dataKey="resting" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn} className="lg:col-span-2">
                <Card>
                  <CardHeader><CardTitle>HRV Trend</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={hrvData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                        <YAxis domain={[30, 65]} stroke="#71717a" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                        <Line type="monotone" dataKey="hrv" stroke="#06b6d4" strokeWidth={3} dot={{ fill: "#06b6d4", r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="sleep">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div variants={fadeIn}>
                <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-transparent">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <Moon className="h-10 w-10 text-indigo-400 mb-4" />
                    <p className="text-sm text-zinc-400 mb-1">Sleep Score</p>
                    <p className="text-5xl font-bold text-zinc-100">8.5</p>
                    <p className="text-sm text-zinc-500">/ 10</p>
                    <div className="w-full mt-4">
                      <Progress value={85} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border-indigo-500/30">
                  <CardHeader><CardTitle>Sleep Stages</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sleepBreakdown.map((stage) => (
                        <div key={stage.name}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-zinc-400">{stage.name}</span>
                            <span className="text-sm font-medium text-zinc-200">{stage.value}h</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-zinc-800">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(stage.value / 7.5) * 100}%`, backgroundColor: stage.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 mt-4">Total: 7.5 hours</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border-indigo-500/30">
                  <CardHeader><CardTitle>Weekly Sleep</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={sleepData.slice(0, 7)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                        <YAxis domain={[6, 9]} stroke="#71717a" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                        <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="mental">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader><CardTitle>Stress Level</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={stressLevel}
                        onChange={(e) => setStressLevel(Number(e.target.value))}
                        className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-violet-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: stressLevels[stressLevel - 1].color }} />
                        <span className="text-sm text-zinc-200">{stressLevels[stressLevel - 1].label}</span>
                      </div>
                    </div>
                    <div className="flex justify-between px-1">
                      {stressLevels.map((s) => (
                        <div key={s.level} className="flex flex-col items-center gap-1">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-[10px] text-zinc-500">{s.level}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader><CardTitle>Mood</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex justify-center gap-4">
                      {moodOptions.map((mood) => (
                        <button
                          key={mood}
                          onClick={() => setSelectedMood(mood)}
                          className={`text-3xl p-3 rounded-xl transition-all duration-200 ${selectedMood === mood ? "bg-violet-500/20 scale-110 ring-2 ring-violet-500" : "hover:bg-zinc-800"}`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader><CardTitle>Energy Level</CardTitle></CardHeader>
                  <CardContent>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={energy}
                      onChange={(e) => setEnergy(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-zinc-500">Low</span>
                      <span className="text-lg font-bold text-zinc-100">{energy}%</span>
                      <span className="text-xs text-zinc-500">High</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader><CardTitle>Recovery Score</CardTitle></CardHeader>
                  <CardContent>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={recovery}
                      onChange={(e) => setRecovery(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-zinc-500">Poor</span>
                      <span className="text-lg font-bold text-zinc-100">{recovery}%</span>
                      <span className="text-xs text-zinc-500">Excellent</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={fadeIn}>
                <Card className="border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wind className="h-5 w-5 text-cyan-400" />
                      Breathing Exercise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={breathingPhase}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all duration-1000 ${
                          breathingActive ? "bg-cyan-500/30 ring-4 ring-cyan-500/20" : "bg-zinc-800"
                        }`}
                      >
                        <div className="text-center">
                          <p className="text-lg font-bold text-zinc-100">{breathingCount}</p>
                          <p className="text-xs text-zinc-400">{breathingPhase}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <Button onClick={startBreathing} variant={breathingActive ? "secondary" : "default"} className="gap-2">
                      {breathingActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {breathingActive ? "Pause" : "Start"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border-violet-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-violet-400" />
                      Meditation Timer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                      meditationActive ? "bg-violet-500/30 ring-4 ring-violet-500/20" : "bg-zinc-800"
                    }`}>
                      <p className="text-3xl font-bold text-zinc-100">{formatMeditationTime(meditationTime)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={startMeditation} variant={meditationActive ? "secondary" : "default"} className="gap-2">
                        {meditationActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {meditationActive ? "Stop" : "Start"}
                      </Button>
                      <Button onClick={resetMeditation} variant="ghost" className="gap-2">
                        <RotateCcw className="h-4 w-4" /> Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="log">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Quick Log</CardTitle>
                  <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Type</label>
                      <select className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500">
                        <option>Blood Pressure</option>
                        <option>Blood Sugar</option>
                        <option>Heart Rate</option>
                        <option>Sleep</option>
                        <option>Mood</option>
                        <option>Weight</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Value</label>
                      <input type="text" className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="Enter value..." />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Notes</label>
                      <textarea className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="Optional notes..." rows={3} />
                    </div>
                    <Button className="w-full">Save Entry</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card className="h-full">
                <CardHeader><CardTitle>History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {healthLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/40 p-3 hover:bg-zinc-800/60 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-zinc-200 capitalize">{log.type.replace("_", " ")}</p>
                          <p className="text-xs text-zinc-500">{new Date(log.date).toLocaleString()}</p>
                          {log.notes && <p className="text-xs text-zinc-500 mt-1">{log.notes}</p>}
                        </div>
                        <p className="text-sm font-medium text-violet-400">{log.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
