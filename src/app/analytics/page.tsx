"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { bodyMeasurements, weeklyWeightData } from "@/lib/data";
import { calculateBMI, getBMICategory } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Scale, Activity, Ruler,
  Plus, ChevronDown, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

const statCards = [
  { label: "Weight", value: "78.5", unit: "kg", change: "-0.6", positive: true, icon: Scale, color: "violet" },
  { label: "BMI", value: "25.6", unit: "", change: "-0.2", positive: true, icon: Activity, color: "cyan" },
  { label: "Body Fat", value: "18.2", unit: "%", change: "-0.3", positive: true, icon: TrendingDown, color: "emerald" },
  { label: "Muscle Mass", value: "35.4", unit: "kg", change: "+0.2", positive: true, icon: TrendingUp, color: "amber" },
  { label: "Waist", value: "82", unit: "cm", change: "-1.0", positive: true, icon: Ruler, color: "rose" },
  { label: "Chest", value: "102", unit: "cm", change: "+0.5", positive: true, icon: Ruler, color: "blue" },
];

const bodyCompData = [
  { name: "Muscle", value: 35.4, color: "#8b5cf6" },
  { name: "Fat", value: 14.3, color: "#ef4444" },
  { name: "Bone", value: 3.4, color: "#06b6d4" },
  { name: "Water", value: 25.4, color: "#22c55e" },
];

const trendData1W = [
  { date: "Mon", weight: 79.1 }, { date: "Tue", weight: 78.9 }, { date: "Wed", weight: 79.0 },
  { date: "Thu", weight: 78.7 }, { date: "Fri", weight: 78.6 }, { date: "Sat", weight: 78.5 }, { date: "Sun", weight: 78.5 },
];
const trendData1M = [
  { date: "Week 1", weight: 80.2 }, { date: "Week 2", weight: 79.8 }, { date: "Week 3", weight: 79.1 }, { date: "Week 4", weight: 78.5 },
];
const trendData3M = [
  { date: "Apr", weight: 82.0 }, { date: "May", weight: 81.0 }, { date: "Jun", weight: 80.2 }, { date: "Jul", weight: 78.5 },
];
const trendData6M = [
  { date: "Feb", weight: 85.0 }, { date: "Mar", weight: 84.0 }, { date: "Apr", weight: 82.0 }, { date: "May", weight: 81.0 }, { date: "Jun", weight: 80.2 }, { date: "Jul", weight: 78.5 },
];
const trendData1Y = [
  { date: "Aug", weight: 88.0 }, { date: "Oct", weight: 86.0 }, { date: "Dec", weight: 85.0 }, { date: "Feb", weight: 84.0 }, { date: "Apr", weight: 82.0 }, { date: "Jun", weight: 80.2 }, { date: "Jul", weight: 78.5 },
];

const colorMap: Record<string, string> = {
  violet: "from-violet-500 to-violet-700",
  cyan: "from-cyan-500 to-cyan-700",
  emerald: "from-emerald-500 to-emerald-700",
  amber: "from-amber-500 to-amber-700",
  rose: "from-rose-500 to-rose-700",
  blue: "from-blue-500 to-blue-700",
};

export default function AnalyticsPage() {
  const [trendRange, setTrendRange] = useState("1W");
  const [measurementForm, setMeasurementForm] = useState({ weight: "", bodyFat: "", muscleMass: "", waist: "", chest: "", arms: "" });

  const bmi = calculateBMI(78.5, 175);
  const trendData = { "1W": trendData1W, "1M": trendData1M, "3M": trendData3M, "6M": trendData6M, "1Y": trendData1Y }[trendRange];

  const first = bodyMeasurements[0];
  const last = bodyMeasurements[bodyMeasurements.length - 1];

  return (
    <AppLayout title="Body Analytics">
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((stat, i) => (
                <motion.div key={stat.label} variants={fadeIn}>
                  <Card className="hover:border-zinc-700 transition-all duration-200">
                    <CardContent className="p-4">
                      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${colorMap[stat.color]} mb-3`}>
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs text-zinc-400 mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-zinc-100">{stat.value}</span>
                        <span className="text-xs text-zinc-500">{stat.unit}</span>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-xs ${stat.positive ? "text-emerald-400" : "text-red-400"}`}>
                        {stat.positive ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                        {stat.change}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div variants={fadeIn} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Weight Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyWeightData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                        <YAxis domain={[78, 80]} stroke="#71717a" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                        <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>BMI Gauge</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center h-[230px]">
                    <div className="relative w-48 h-24 overflow-hidden">
                      <div className="absolute inset-0 rounded-t-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-red-500 opacity-20" />
                      <div className="absolute bottom-0 left-1/2 w-1 h-full bg-zinc-900 origin-bottom -translate-x-1/2" style={{ transform: `rotate(${(bmi - 15) * 6 - 90}deg)` }} />
                      <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 shadow-lg" />
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-3xl font-bold text-zinc-100">{bmi}</p>
                      <p className="text-sm text-emerald-400 font-medium">{getBMICategory(bmi)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>Body Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={bodyCompData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">
                          {bodyCompData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-3">
                      {bodyCompData.map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-zinc-400 w-16">{item.name}</span>
                          <span className="text-sm font-medium text-zinc-200">{item.value} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="measurements">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Add Measurement</CardTitle>
                  <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {["Weight", "Body Fat %", "Muscle Mass", "Waist", "Chest", "Arms"].map((field) => (
                      <div key={field}>
                        <label className="text-xs text-zinc-400 mb-1 block">{field}</label>
                        <input
                          type="number"
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-zinc-600"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="text-xs text-zinc-400 mb-1 block">Notes</label>
                    <textarea
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder-zinc-600"
                      placeholder="Optional notes..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {bodyMeasurements.map((m) => (
                      <div key={m.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/40 p-3 hover:bg-zinc-800/60 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-zinc-200">{m.weight} kg</p>
                          <p className="text-xs text-zinc-500">{new Date(m.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-400">BF: {m.bodyFat}% | MM: {m.muscleMass}kg</p>
                          <p className="text-xs text-zinc-500">W:{m.waist} C:{m.chest} A:{m.arms}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} initial="initial" animate="animate" className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Body Outline</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <svg viewBox="0 0 200 400" className="w-48 h-96">
                    <ellipse cx="100" cy="40" rx="28" ry="32" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                    <line x1="100" y1="72" x2="100" y2="200" stroke="#8b5cf6" strokeWidth="2" />
                    <line x1="100" y1="100" x2="40" y2="160" stroke="#8b5cf6" strokeWidth="2" />
                    <line x1="100" y1="100" x2="160" y2="160" stroke="#8b5cf6" strokeWidth="2" />
                    <line x1="100" y1="200" x2="60" y2="340" stroke="#8b5cf6" strokeWidth="2" />
                    <line x1="100" y1="200" x2="140" y2="340" stroke="#8b5cf6" strokeWidth="2" />
                    <text x="10" y="110" fill="#06b6d4" fontSize="10">Chest: 102cm</text>
                    <text x="150" y="110" fill="#06b6d4" fontSize="10">Arms: 36cm</text>
                    <text x="10" y="210" fill="#f59e0b" fontSize="10">Waist: 82cm</text>
                    <line x1="100" y1="155" x2="10" y2="155" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4" />
                    <line x1="100" y1="155" x2="190" y2="155" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4" />
                    <line x1="100" y1="200" x2="10" y2="200" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4" />
                  </svg>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Weight Trends</CardTitle>
              <div className="flex gap-1 bg-zinc-800/80 rounded-xl p-1">
                {["1W", "1M", "3M", "6M", "1Y"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrendRange(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${trendRange === r ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} stroke="#71717a" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                  <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader><CardTitle>Body Fat %</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={bodyMeasurements.map(m => ({ date: new Date(m.date).toLocaleDateString("en", { month: "short", day: "numeric" }), value: m.bodyFat }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                    <YAxis domain={[15, 25]} stroke="#71717a" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                    <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Muscle Mass</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={bodyMeasurements.map(m => ({ date: new Date(m.date).toLocaleDateString("en", { month: "short", day: "numeric" }), value: m.muscleMass }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                    <YAxis domain={[30, 38]} stroke="#71717a" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                    <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compare">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card className="border-violet-500/30">
                <CardHeader>
                  <CardTitle className="text-violet-400">January 2025</CardTitle>
                  <p className="text-xs text-zinc-500">Starting Point</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Weight", value: `${last.weight} kg`, first: `${first.weight} kg`, diff: first.weight - last.weight },
                      { label: "Body Fat", value: `${last.bodyFat}%`, first: `${first.bodyFat}%`, diff: first.bodyFat - last.bodyFat },
                      { label: "Muscle Mass", value: `${last.muscleMass} kg`, first: `${first.muscleMass} kg`, diff: last.muscleMass - first.muscleMass },
                      { label: "Waist", value: `${last.waist} cm`, first: `${first.waist} cm`, diff: first.waist - last.waist },
                      { label: "Chest", value: `${last.chest} cm`, first: `${first.chest} cm`, diff: last.chest - first.chest },
                      { label: "Arms", value: `${last.arms} cm`, first: `${first.arms} cm`, diff: last.arms - first.arms },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">{item.label}</span>
                        <div className="text-right">
                          <span className="text-sm font-medium text-zinc-200">{item.first}</span>
                          <span className="text-zinc-600 mx-2">→</span>
                          <span className="text-sm font-medium text-zinc-200">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} initial="initial" animate="animate">
              <Card className="border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="text-emerald-400">July 2026</CardTitle>
                  <p className="text-xs text-zinc-500">Now</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Weight", current: `${last.weight} kg`, target: "75 kg", progress: Math.round(((88 - last.weight) / (88 - 75)) * 100) },
                      { label: "Body Fat", current: `${last.bodyFat}%`, target: "15%", progress: Math.round(((24 - last.bodyFat) / (24 - 15)) * 100) },
                      { label: "Muscle Mass", current: `${last.muscleMass} kg`, target: "37 kg", progress: Math.round(((last.muscleMass - 32) / (37 - 32)) * 100) },
                      { label: "Waist", current: `${last.waist} cm`, target: "78 cm", progress: Math.round(((92 - last.waist) / (92 - 78)) * 100) },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-zinc-400">{item.label}</span>
                          <span className="text-xs text-zinc-500">Target: {item.target}</span>
                        </div>
                        <Progress value={item.progress} />
                        <p className="text-xs text-zinc-500 mt-1">{item.current} — {item.progress}% to goal</p>
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
