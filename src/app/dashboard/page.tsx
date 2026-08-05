"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getTodaySummary, getWorkouts, getWeightLogs, getMeals, getHealthMetrics } from "@/lib/data-operations";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  UtensilsCrossed, Dumbbell, Droplets, Scale, Brain,
  Heart, Flame, Target, Plus, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { ErrorBoundary } from "@/components/error-boundary";

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDateNice() {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

const ChartTooltipStyle = { backgroundColor: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#f3f4f6", fontSize: "12px", padding: "8px 12px" };

// Empty state component
function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: { icon: React.ElementType; title: string; description: string; actionLabel: string; actionHref: string }) {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-white/20" />
      </div>
      <h3 className="text-white font-medium mb-2">{title}</h3>
      <p className="text-white/40 text-sm mb-4">{description}</p>
      <Link href={actionHref} className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all">
        {actionLabel} <ArrowRight className="w-4 h-4" />
      </Link>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, currentWeight: null as number | null, mealCount: 0 });
  const [recentWorkouts, setRecentWorkouts] = useState<{ name: string; type: string; duration_minutes: number; calories_burned: number; date: string }[]>([]);
  const [weightTrend, setWeightTrend] = useState<{ date: string; weight: number }[]>([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const uid = user!.id;
      const [summaryResult, workoutsResult, weightsResult, mealsResult, metricsResult] = await Promise.allSettled([
        getTodaySummary(uid),
        getWorkouts(uid),
        getWeightLogs(uid),
        getMeals(uid),
        getHealthMetrics(uid),
      ]);

      if (summaryResult.status === "fulfilled") setSummary(summaryResult.value);
      if (workoutsResult.status === "fulfilled") setRecentWorkouts(workoutsResult.value.slice(0, 5));
      if (weightsResult.status === "fulfilled") setWeightTrend(weightsResult.value.slice(0, 10).reverse().map((w: any) => ({ date: new Date(w.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }), weight: w.weight })));
      if (mealsResult.status === "fulfilled" && weightsResult.status === "fulfilled" && workoutsResult.status === "fulfilled" && metricsResult.status === "fulfilled") {
        setHasData(mealsResult.value.length > 0 || workoutsResult.value.length > 0 || weightsResult.value.length > 0 || metricsResult.value.length > 0);
      }

      [summaryResult, workoutsResult, weightsResult, mealsResult, metricsResult].forEach((r) => {
        if (r.status === "rejected") console.error("Dashboard data fetch failed:", r.reason?.message || r.reason);
      });

      setLoading(false);
    }
    load();
  }, [user]);

  const calories = useCountUp(summary.calories);
  const water = useCountUp(summary.water);

  const caloriePercent = summary.calories > 0 ? Math.min(100, Math.round((summary.calories / 2200) * 100)) : 0;

  const macroData = [
    { name: "Protein", value: summary.protein || 0, color: "#10b981" },
    { name: "Carbs", value: summary.carbs || 0, color: "#3b82f6" },
    { name: "Fat", value: summary.fat || 0, color: "#f59e0b" },
  ].filter((d) => d.value > 0);

  const miniStats = [
    { label: "Calories", value: calories, goal: 2200, unit: "kcal", color: "bg-emerald-500", icon: Flame, percent: caloriePercent },
    { label: "Water", value: water, goal: 8, unit: "glasses", color: "bg-blue-500", icon: Droplets, percent: Math.min(100, Math.round((summary.water / 8) * 100)) },
    { label: "Weight", value: summary.currentWeight ?? 0, goal: 0, unit: "kg", color: "bg-purple-500", icon: Scale, percent: 0, isWeight: true },
    { label: "Meals", value: summary.mealCount, goal: 0, unit: "logged", color: "bg-orange-500", icon: UtensilsCrossed, percent: 0 },
  ];

  return (
    <AppLayout title="Dashboard">
      <ErrorBoundary>
      {!loading && !hasData && (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
          <EmptyState
            icon={Target}
            title="Welcome to VitalX AI!"
            description="Start by logging your first meal, workout, or weight entry. Your data will appear here."
            actionLabel="Log Your First Meal"
            actionHref="/nutrition"
          />
        </div>
      )}

      <motion.div variants={container} initial="hidden" animate="show" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 space-y-6">
        {/* Row 1: Greeting + Stats */}
        <motion.div variants={item}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, {user?.user_metadata?.name?.split(" ")[0] || "there"}</h1>
            <p className="text-muted-foreground text-sm mt-1">{formatDateNice()}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {miniStats.map((s) => (
              <Card key={s.label} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${s.color}/10 flex items-center justify-center`}>
                    <s.icon className={`w-4 h-4 ${s.color.replace("bg-", "text-")}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {s.isWeight ? (s.value > 0 ? `${s.value} kg` : "—") : s.value.toLocaleString()}
                </div>
                {!s.isWeight && s.goal > 0 && <p className="text-xs text-muted-foreground mt-1">Goal: {s.goal.toLocaleString()} {s.unit}</p>}
                {s.isWeight && <p className="text-xs text-muted-foreground mt-1">Current weight</p>}
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Row 2: Macros + Calorie Chart */}
        <motion.div variants={item}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Today&apos;s Macros</h3>
              {macroData.length > 0 ? (
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={macroData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                          {macroData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {[
                      { label: "Protein", value: summary.protein, goal: 160, color: "bg-emerald-500", unit: "g" },
                      { label: "Carbs", value: summary.carbs, goal: 280, color: "bg-blue-500", unit: "g" },
                      { label: "Fat", value: summary.fat, goal: 80, color: "bg-yellow-500", unit: "g" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{m.label}</span>
                          <span className="text-foreground">{Math.round(m.value)} / {m.goal}{m.unit}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${Math.min(100, (m.value / m.goal) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">No meals logged today</p>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Calorie Intake</h3>
              <div className="text-center mb-2">
                <span className="text-3xl font-bold text-foreground">{summary.calories}</span>
                <span className="text-muted-foreground text-sm ml-1">/ 2,200 kcal</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${caloriePercent}%` }} />
              </div>
              {summary.calories > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={[{ name: "Today", calories: summary.calories }, { name: "Goal", calories: 2200 }]}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Bar dataKey="calories" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">Log meals to see your calorie chart</p>
              )}
            </Card>
          </div>
        </motion.div>

        {/* Row 3: Recent Workouts + Weight Trend */}
        <motion.div variants={item}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Recent Workouts</h3>
                <Link href="/workout" className="text-xs text-emerald-400 hover:text-emerald-300">View All</Link>
              </div>
              {recentWorkouts.length > 0 ? (
                <div className="space-y-3">
                  {recentWorkouts.map((w, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Dumbbell className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.duration_minutes}min · {w.calories_burned} kcal</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">No workouts yet</p>
              )}
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Weight Trend</h3>
              {weightTrend.length > 1 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weightTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip contentStyle={ChartTooltipStyle} />
                    <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">Log weight entries to see your trend</p>
              )}
            </Card>
          </div>
        </motion.div>

        {/* Row 4: Water + Quick Actions */}
        <motion.div variants={item}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Water Intake</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-foreground">{summary.water}</span>
                <span className="text-muted-foreground text-sm ml-1">/ 8 glasses</span>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`aspect-square rounded-xl flex items-center justify-center ${i < summary.water ? "bg-blue-500/20" : "bg-white/5"}`}>
                    <Droplets className={`w-4 h-4 ${i < summary.water ? "text-blue-400" : "text-white/10"}`} />
                  </div>
                ))}
              </div>
              <Link href="/nutrition" className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
                <Plus className="w-4 h-4" /> Log Water
              </Link>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Log Meal", href: "/nutrition", color: "text-emerald-400", icon: UtensilsCrossed },
                  { label: "Start Workout", href: "/workout", color: "text-blue-400", icon: Dumbbell },
                  { label: "Log Weight", href: "/health", color: "text-purple-400", icon: Scale },
                  { label: "AI Coach", href: "/coach", color: "text-yellow-400", icon: Brain },
                ].map((a) => (
                  <Link key={a.label} href={a.href} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <a.icon className={`w-5 h-5 ${a.color}`} />
                    <span className="text-sm text-foreground">{a.label}</span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </motion.div>
      </ErrorBoundary>
    </AppLayout>
  );
}
