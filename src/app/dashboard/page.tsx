"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  UtensilsCrossed,
  Dumbbell,
  Droplets,
  Scale,
  Brain,
  BarChart3,
  Heart,
  Flame,
  Zap,
  Moon,
  Target,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  nutritionData,
  activityData,
  heartRateHistory,
  bodyMetrics,
  recentWorkouts,
  weeklyWorkouts,
  lifestyleData,
  monthlyProgress,
  weeklyGoals,
  aiRecommendations,
  quickActions,
  macroDistribution,
} from "@/lib/data";

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDateNice() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const ChartTooltipStyle = {
  backgroundColor: "#1f2937",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#f3f4f6",
  fontSize: "12px",
  padding: "8px 12px",
};

// --- Row 1: Greeting + Stats ---
function Row1() {
  const calories = useCountUp(nutritionData.calories.current);
  const steps = useCountUp(activityData.stepsToday);
  const water = useCountUp(activityData.waterIntake);
  const workout = useCountUp(45);

  const miniStats = [
    {
      label: "Calories",
      value: calories,
      goal: nutritionData.calories.goal,
      unit: "kcal",
      color: "bg-emerald-500",
      progressColor: "bg-emerald-500",
    },
    {
      label: "Steps",
      value: steps,
      goal: activityData.stepsGoal,
      unit: "",
      color: "bg-blue-500",
      progressColor: "bg-blue-500",
    },
    {
      label: "Water",
      value: water,
      goal: activityData.waterGoal,
      unit: "glasses",
      color: "bg-cyan-500",
      progressColor: "bg-cyan-500",
    },
    {
      label: "Workout",
      value: workout,
      goal: 60,
      unit: "min",
      color: "bg-purple-500",
      progressColor: "bg-purple-500",
    },
  ];

  return (
    <motion.div variants={item}>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">
          {getGreeting()}, Rahul!
        </h1>
        <p className="text-gray-400 text-sm mt-1">{formatDateNice()}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="flex flex-col items-center justify-center text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
            AI Health Score
          </p>
          <CircularProgress value={87} size={120} strokeWidth={8} showLabel={false} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-gray-100">87</span>
            <span className="text-[10px] text-gray-400 tracking-widest">SCORE</span>
          </div>
        </Card>

        {miniStats.map((s) => {
          const pct = Math.min((s.value / s.goal) * 100, 100);
          return (
            <Card key={s.label}>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-bold text-gray-100 mt-1">
                {s.value.toLocaleString()}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  /{s.goal.toLocaleString()}
                  {s.unit ? ` ${s.unit}` : ""}
                </span>
              </p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${s.progressColor}`}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}

// --- Row 2: Nutrition Overview ---
function Row2() {
  const macroColors = ["#10b981", "#3b82f6", "#f59e0b"];

  return (
    <motion.div variants={item}>
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Nutrition Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-gray-400 mb-4">Macro Split</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {macroDistribution.map((_, i) => (
                    <Cell key={i} fill={macroColors[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={ChartTooltipStyle}
                  formatter={(v, name) => [`${v}g`, name as string]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {macroDistribution.map((m, i) => (
              <div key={m.name} className="flex items-center gap-2 text-xs text-gray-300">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: macroColors[i] }}
                />
                {m.name} {m.value}g
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm text-gray-400 mb-4">Daily Macros</p>
          <div className="space-y-5 mt-2">
            {[
              {
                label: "Protein",
                current: nutritionData.protein.current,
                goal: nutritionData.protein.goal,
                color: "bg-emerald-500",
              },
              {
                label: "Carbs",
                current: nutritionData.carbs.current,
                goal: nutritionData.carbs.goal,
                color: "bg-blue-500",
              },
              {
                label: "Fat",
                current: nutritionData.fat.current,
                goal: nutritionData.fat.goal,
                color: "bg-amber-500",
              },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{m.label}</span>
                  <span className="text-gray-400">
                    {m.current}g / {m.goal}g
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((m.current / m.goal) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${m.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// --- Row 3: Activity & Health ---
function Row3() {
  const sleepStages = [
    { label: "Deep", value: 1.8, color: "bg-indigo-500" },
    { label: "Light", value: 3.2, color: "bg-blue-400" },
    { label: "REM", value: 1.5, color: "bg-purple-400" },
    { label: "Awake", value: 0.5, color: "bg-gray-500" },
  ];

  const glasses = Array.from({ length: activityData.waterGoal }, (_, i) => i);

  return (
    <motion.div variants={item}>
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Activity & Health</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-red-400" />
            <p className="text-sm text-gray-400">Heart Rate</p>
          </div>
          <p className="text-3xl font-bold text-gray-100">
            {activityData.heartRate} <span className="text-sm font-normal text-gray-400">BPM</span>
          </p>
          <div className="h-20 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateHistory}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="bpm"
                  stroke="#ef4444"
                  fill="url(#hrGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Steps */}
        <Card>
          <p className="text-sm text-gray-400 mb-3">Daily Steps</p>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData.weeklySteps}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip contentStyle={ChartTooltipStyle} />
                <Bar dataKey="steps" radius={[4, 4, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sleep */}
        <Card className="flex flex-col items-center text-center">
          <p className="text-sm text-gray-400 mb-2">Sleep</p>
          <div className="relative">
            <CircularProgress
              value={activityData.sleepScore * 10}
              size={90}
              strokeWidth={6}
              color="stroke-indigo-500"
              showLabel={false}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-100">{activityData.sleepScore}</span>
              <span className="text-[9px] text-gray-400">/10</span>
            </div>
          </div>
          <div className="w-full mt-3 space-y-1.5">
            {sleepStages.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-gray-400 flex-1 text-left">{s.label}</span>
                <span className="text-gray-300">{s.value}h</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Water */}
        <Card>
          <p className="text-sm text-gray-400 mb-3">Water Intake</p>
          <p className="text-2xl font-bold text-gray-100 mb-3">
            {activityData.waterIntake}/{activityData.waterGoal}{" "}
            <span className="text-sm font-normal text-gray-400">glasses</span>
          </p>
          <div className="grid grid-cols-4 gap-2">
            {glasses.map((i) => (
              <div
                key={i}
                className={`flex items-center justify-center h-10 rounded-lg text-lg transition-colors ${
                  i < activityData.waterIntake
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-white/5 text-gray-600"
                }`}
              >
                💧
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// --- Row 4: Body Metrics ---
function Row4() {
  return (
    <motion.div variants={item}>
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Body Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Weight Trend */}
        <Card className="sm:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400">Weight Trend</p>
            <Badge variant="success">-2.3 kg</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-100 mb-1">
            {bodyMetrics.currentWeight}{" "}
            <span className="text-sm font-normal text-gray-400">kg</span>
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bodyMetrics.weightTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip contentStyle={ChartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#8b5cf6" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">BMI</p>
            <p className="text-3xl font-bold text-gray-100">{bodyMetrics.bmi}</p>
            <Badge variant="success" className="mt-2">
              {bodyMetrics.bmiCategory}
            </Badge>
          </Card>

          <Card className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Body Fat</p>
            <div className="relative">
              <CircularProgress
                value={bodyMetrics.bodyFat}
                size={80}
                strokeWidth={5}
                color="stroke-amber-500"
                showLabel={false}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-100">{bodyMetrics.bodyFat}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// --- Row 5: Workout & Sports ---
function Row5() {
  return (
    <motion.div variants={item}>
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Workout & Sports</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-gray-400 mb-3">Weekly Workout Minutes</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyWorkouts}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip contentStyle={ChartTooltipStyle} />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-gray-400 mb-3">Recent Workouts</p>
          <div className="space-y-3">
            {recentWorkouts.slice(0, 4).map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-2xl">{w.type === 'Strength' ? '🏋️' : w.type === 'Cardio' ? '🏃' : w.type === 'HIIT' ? '⚡' : '💪'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">{w.type}</p>
                  <p className="text-xs text-gray-400">
                    {w.date} · {w.duration} min
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-orange-400">{w.caloriesBurned}</p>
                  <p className="text-[10px] text-gray-500">kcal</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// --- Row 6: Lifestyle ---
function Row6() {
  const [selectedMood, setSelectedMood] = useState("happy");
  const moods = [
    { key: "terrible", emoji: "😫" },
    { key: "bad", emoji: "😟" },
    { key: "neutral", emoji: "😐" },
    { key: "happy", emoji: "🙂" },
    { key: "great", emoji: "😄" },
  ];

  const lifestyleBars = [
    {
      label: "Energy",
      value: lifestyleData.energy,
      max: 10,
      color: "bg-emerald-500",
      icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      label: "Stress",
      value: lifestyleData.stress,
      max: 10,
      color: "bg-red-500",
      icon: <Brain className="w-3.5 h-3.5 text-red-400" />,
    },
    {
      label: "Recovery",
      value: lifestyleData.recovery,
      max: 100,
      color: "bg-purple-500",
      icon: <Moon className="w-3.5 h-3.5 text-purple-400" />,
    },
  ];

  return (
    <motion.div variants={item}>
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Lifestyle</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="sm:col-span-2">
          <div className="space-y-5">
            {lifestyleBars.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {b.icon}
                    <span className="text-sm text-gray-300">{b.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-100">
                    {b.value}/{b.max}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(b.value / b.max) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${b.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <p className="text-sm text-gray-400 mb-3">Mood Tracker</p>
            <div className="flex justify-between">
              {moods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setSelectedMood(m.key)}
                  className={`text-2xl p-2 rounded-xl transition-all ${
                    selectedMood === m.key
                      ? "bg-purple-500/20 scale-110 ring-2 ring-purple-500/40"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </Card>

          <Card className="flex-1 flex flex-col items-center justify-center text-center">
            <Flame className="w-8 h-8 text-orange-400 mb-1" />
            <p className="text-2xl font-bold text-gray-100">{lifestyleData.habitStreak}</p>
            <p className="text-xs text-gray-400">Day Streak</p>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

// --- Row 7: Goals & AI ---
function Row7() {
  return (
    <motion.div variants={item}>
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Goals & AI Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Progress */}
        <Card>
          <p className="text-sm text-gray-400 mb-3">Monthly Progress</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[60, 100]}
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip contentStyle={ChartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <p className="text-sm text-gray-400 mb-4">Weekly Goals</p>
          <div className="space-y-4">
            {weeklyGoals.map((g) => (
              <div key={g.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{g.title}</span>
                  <span className="text-gray-400">
                    {g.current}/{g.target} {g.unit}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((g.current / g.target) * 100, 100)}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      g.current >= g.target ? "bg-emerald-500" : "bg-purple-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <p className="text-sm text-gray-400">AI Recommendations</p>
          </div>
          <div className="space-y-3">
            {aiRecommendations.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-lg">{r.category === 'nutrition' ? '🥗' : r.category === 'sleep' ? '😴' : r.category === 'fitness' ? '💪' : '✨'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {r.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      r.priority === "high"
                        ? "destructive"
                        : r.priority === "medium"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {r.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// --- Row 8: Quick Actions ---
function Row8() {
  const iconMap: Record<string, React.ReactNode> = {
    UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
    Dumbbell: <Dumbbell className="w-5 h-5" />,
    Droplets: <Droplets className="w-5 h-5" />,
    Scale: <Scale className="w-5 h-5" />,
    Brain: <Brain className="w-5 h-5" />,
    BarChart3: <BarChart3 className="w-5 h-5" />,
  };

  return (
    <motion.div variants={item}>
      <h2 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {quickActions.map((a) => (
          <motion.button
            key={a.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${a.color} text-white shadow-lg hover:shadow-xl transition-shadow`}
          >
            {iconMap[a.icon]}
            <span className="text-xs font-medium">{a.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// --- Main Dashboard ---
export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <Row1 />
        <Row2 />
        <Row3 />
        <Row4 />
        <Row5 />
        <Row6 />
        <Row7 />
        <Row8 />
      </motion.div>
    </AppLayout>
  );
}
