"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getHealthMetrics, addHealthMetric } from "@/lib/data-operations";
import { useAuth } from "@/lib/auth-context";
import {
  Heart, Thermometer, Wind, Droplets, Activity, Moon,
  Brain, Smile, Zap, Play, Pause, RotateCcw, Plus
} from "lucide-react";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

const moodOptions = ["😔", "😐", "😊", "😄", "🤩"];
const stressLevels = [
  { level: 1, label: "Very Low", color: "#22c55e" },
  { level: 2, label: "Low", color: "#84cc16" },
  { level: 3, label: "Moderate", color: "#eab308" },
  { level: 4, label: "High", color: "#f97316" },
  { level: 5, label: "Very High", color: "#ef4444" },
];

const metricTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string; unit: string }> = {
  blood_pressure: { icon: Activity, color: "text-rose-400", bg: "from-rose-500/20 to-rose-500/5", label: "Blood Pressure", unit: "mmHg" },
  blood_sugar: { icon: Droplets, color: "text-amber-400", bg: "from-amber-500/20 to-amber-500/5", label: "Blood Sugar", unit: "mg/dL" },
  spo2: { icon: Wind, color: "text-cyan-400", bg: "from-cyan-500/20 to-cyan-500/5", label: "SpO2", unit: "%" },
  heart_rate: { icon: Heart, color: "text-red-400", bg: "from-red-500/20 to-red-500/5", label: "Heart Rate", unit: "bpm" },
  temperature: { icon: Thermometer, color: "text-orange-400", bg: "from-orange-500/20 to-orange-500/5", label: "Temperature", unit: "°F" },
};

export default function HealthPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [logType, setLogType] = useState("heart_rate");
  const [logValue, setLogValue] = useState("");
  const [logNotes, setLogNotes] = useState("");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (!user) return;
    getHealthMetrics(user.id).then(setMetrics).catch(console.error);
  }, [user]);

  useEffect(() => {
    return () => {
      if (breathingRef.current) clearInterval(breathingRef.current);
      if (meditationRef.current) clearInterval(meditationRef.current);
    };
  }, []);

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

  const formatMeditationTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSaveLog = async () => {
    if (!user || !logValue.trim()) return;
    setSaving(true);
    try {
      const entry = await addHealthMetric(user.id, {
        type: logType,
        value: logValue.trim(),
        unit: metricTypeConfig[logType]?.unit || "",
      });
      setMetrics((prev) => [entry, ...prev]);
      setLogValue("");
      setLogNotes("");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const groupedMetrics = React.useMemo(() => {
    const map = new Map<string, any[]>();
    metrics.forEach((m) => {
      const arr = map.get(m.type) || [];
      arr.push(m);
      map.set(m.type, arr);
    });
    return map;
  }, [metrics]);

  const heartRateChartData = React.useMemo(() => {
    const hrMetrics = groupedMetrics.get("heart_rate") || [];
    return hrMetrics.slice(0, 7).reverse().map((m) => ({
      date: new Date(m.recorded_at).toLocaleDateString("en-US", { weekday: "short" }),
      value: Number(m.value),
    }));
  }, [groupedMetrics]);

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
            {metrics.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from(groupedMetrics.entries()).map(([type, entries]) => {
                  const latest = entries[0];
                  const cfg = metricTypeConfig[type] || { icon: Activity, color: "text-zinc-400", bg: "from-zinc-500/20 to-zinc-500/5", label: type.replace("_", " "), unit: latest?.unit || "" };
                  const Icon = cfg.icon;
                  return (
                    <motion.div key={type} variants={fadeIn}>
                      <Card className={`bg-gradient-to-br ${cfg.bg} border-zinc-800`}>
                        <CardContent className="p-4">
                          <Icon className={`h-6 w-6 ${cfg.color} mb-3`} />
                          <p className="text-xs text-zinc-400 mb-1 capitalize">{cfg.label}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-zinc-100">{latest.value}</span>
                            <span className="text-xs text-zinc-500">{cfg.unit}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-1">{entries.length} total readings</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No health metrics yet</h3>
                <p className="text-zinc-400 text-sm mb-6">Log your first health reading to see your vitals here.</p>
              </Card>
            )}

            {heartRateChartData.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader><CardTitle>Heart Rate Trend</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={heartRateChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                          <YAxis stroke="#71717a" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} name="Heart Rate (bpm)" />
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
                        {metrics.slice(0, 10).map((m) => {
                          const cfg = metricTypeConfig[m.type] || { icon: Activity, color: "text-violet-400" };
                          const Icon = cfg.icon;
                          return (
                            <div key={m.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/40 p-3">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                  <Icon className={`h-4 w-4 ${cfg.color}`} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-zinc-200 capitalize">{m.type.replace("_", " ")}</p>
                                  <p className="text-xs text-zinc-500">{new Date(m.recorded_at).toLocaleString()}</p>
                                </div>
                              </div>
                              <p className="text-sm font-medium text-zinc-200">
                                {m.value} {m.unit}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="heart">
          <div className="space-y-6">
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Heart data requires a wearable</h3>
              <p className="text-zinc-400 text-sm mb-4">Connect a smartwatch or heart rate monitor to track heart rate zones, HRV, and continuous monitoring.</p>
              {(groupedMetrics.get("heart_rate") || []).length > 0 && (
                <p className="text-xs text-zinc-500">You have {groupedMetrics.get("heart_rate")!.length} manual heart rate logs in Metrics.</p>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sleep">
          <div className="space-y-6">
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <Moon className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No sleep data yet</h3>
              <p className="text-zinc-400 text-sm mb-4">Connect a wearable or log your sleep manually to track sleep stages and quality.</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Log Sleep Manually
              </Button>
            </Card>
          </div>
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
                        type="range" min={1} max={5} value={stressLevel}
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
                          key={mood} onClick={() => setSelectedMood(mood)}
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
                    <input type="range" min={0} max={100} value={energy}
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
                    <input type="range" min={0} max={100} value={recovery}
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
                      <Wind className="h-5 w-5 text-cyan-400" /> Breathing Exercise
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
                      <Brain className="h-5 w-5 text-violet-400" /> Meditation Timer
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Type</label>
                      <select
                        value={logType}
                        onChange={(e) => setLogType(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      >
                        <option value="heart_rate">Heart Rate</option>
                        <option value="blood_pressure">Blood Pressure</option>
                        <option value="blood_sugar">Blood Sugar</option>
                        <option value="spo2">SpO2</option>
                        <option value="temperature">Temperature</option>
                        <option value="weight">Weight</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Value</label>
                      <input
                        type="text" value={logValue} onChange={(e) => setLogValue(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600"
                        placeholder="e.g. 72, 120/80, 95..."
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Notes</label>
                      <textarea
                        value={logNotes} onChange={(e) => setLogNotes(e.target.value)}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600"
                        placeholder="Optional notes..." rows={3}
                      />
                    </div>
                    <Button onClick={handleSaveLog} disabled={saving || !logValue.trim()} className="w-full">
                      {saving ? "Saving..." : "Save Entry"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card className="h-full">
                <CardHeader><CardTitle>History</CardTitle></CardHeader>
                <CardContent>
                  {metrics.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {metrics.map((m) => {
                        const cfg = metricTypeConfig[m.type] || { icon: Activity, color: "text-violet-400" };
                        const Icon = cfg.icon;
                        return (
                          <div key={m.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/40 p-3 hover:bg-zinc-800/60 transition-colors">
                            <div>
                              <p className="text-sm font-medium text-zinc-200 capitalize">{m.type.replace("_", " ")}</p>
                              <p className="text-xs text-zinc-500">{new Date(m.recorded_at).toLocaleString()}</p>
                            </div>
                            <p className="text-sm font-medium text-violet-400">{m.value} {m.unit}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                      <p className="text-sm text-zinc-400">No entries yet. Log your first reading above.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
