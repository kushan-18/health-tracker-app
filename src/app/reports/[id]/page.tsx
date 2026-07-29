"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const reportData: Record<string, {
  title: string;
  date: string;
  summary: string;
  sections: { title: string; content: string; metric?: string; change?: string; positive?: boolean }[];
  recommendations: string[];
  chartData: { calories: number; protein: number; day: string }[];
  macroData: { name: string; value: number; color: string }[];
}> = {
  weekly: {
    title: "Weekly Summary Report",
    date: "Jul 17 - Jul 23, 2026",
    summary: "You had an excellent week with 5 workouts completed, maintaining a consistent nutrition plan. Your total volume increased by 12% compared to last week.",
    sections: [
      { title: "Workouts Completed", content: "5 of 5 planned sessions finished", metric: "5/5", change: "+1 vs last week", positive: true },
      { title: "Average Daily Calories", content: "Averaged 2,371 kcal/day across the week", metric: "2,371 kcal", change: "-5% vs last week", positive: true },
      { title: "Average Protein", content: "Averaged 130g protein daily, hitting 81% of target", metric: "130g/day", change: "+8% vs last week", positive: true },
      { title: "Total Volume", content: "Moved 25,140 kg across all sessions", metric: "25,140 kg", change: "+12% vs last week", positive: true },
    ],
    recommendations: [
      "Increase protein intake by 30g daily to reach your 160g target more consistently.",
      "Add one more rest day or active recovery session to prevent overtraining.",
      "Consider adding more stretching after workouts to improve flexibility score.",
    ],
    chartData: [
      { day: "Mon", calories: 2200, protein: 120 }, { day: "Tue", calories: 2400, protein: 135 },
      { day: "Wed", calories: 2100, protein: 115 }, { day: "Thu", calories: 2350, protein: 128 },
      { day: "Fri", calories: 2500, protein: 140 }, { day: "Sat", calories: 2800, protein: 150 },
      { day: "Sun", calories: 2250, protein: 125 },
    ],
    macroData: [
      { name: "Protein", value: 35, color: "#8b5cf6" },
      { name: "Carbs", value: 45, color: "#06b6d4" },
      { name: "Fat", value: 20, color: "#f59e0b" },
    ],
  },
  body: {
    title: "Body Composition Report",
    date: "January 2025 - July 2026",
    summary: "Outstanding body composition improvements over 18 months. You've lost 9.5kg of total weight while gaining 3.4kg of muscle mass.",
    sections: [
      { title: "Weight Change", content: "From 88.0kg to 78.5kg", metric: "78.5 kg", change: "-9.5 kg total", positive: true },
      { title: "Body Fat", content: "Reduced from 24.0% to 18.2%", metric: "18.2%", change: "-5.8% total", positive: true },
      { title: "Muscle Mass", content: "Increased from 32.0kg to 35.4kg", metric: "35.4 kg", change: "+3.4 kg total", positive: true },
      { title: "Waist", content: "Reduced from 92cm to 82cm", metric: "82 cm", change: "-10 cm total", positive: true },
    ],
    recommendations: [
      "You're making excellent progress toward your 75kg target weight. Maintain current deficit.",
      "Keep prioritizing protein to preserve muscle while cutting. 1.6-2.2g/kg is optimal.",
      "Consider adding more hip and chest measurements for complete tracking.",
    ],
    chartData: [
      { day: "Jan'25", calories: 88, protein: 32 }, { day: "Apr'25", calories: 82, protein: 33.2 },
      { day: "Jul'25", calories: 80.2, protein: 34.1 }, { day: "Oct'25", calories: 79.1, protein: 34.8 },
      { day: "Jan'26", calories: 78.5, protein: 35.4 },
    ],
    macroData: [
      { name: "Muscle", value: 35.4, color: "#8b5cf6" },
      { name: "Fat", value: 14.3, color: "#ef4444" },
      { name: "Bone", value: 3.4, color: "#06b6d4" },
      { name: "Water", value: 25.4, color: "#22c55e" },
    ],
  },
  nutrition: {
    title: "Nutrition Report",
    date: "July 2026",
    summary: "Your nutrition has been consistent this month with an average daily intake of 2,250 kcal. Protein intake improved significantly after supplement changes.",
    sections: [
      { title: "Avg Daily Calories", content: "Consuming 2,250 kcal/day against 2,200 goal", metric: "2,250 kcal", change: "+2% vs target", positive: true },
      { title: "Avg Protein", content: "Averaging 128g/day, need to push to 160g", metric: "128g/day", change: "+5% vs last month", positive: true },
      { title: "Carb Intake", content: "Averaging 220g/day — good for workout fuel", metric: "220g/day", change: "On target", positive: true },
      { title: "Hydration", content: "Averaging 6.5 glasses/day, target is 8", metric: "6.5 glasses", change: "+0.5 vs last month", positive: true },
    ],
    recommendations: [
      "Add a post-workout protein shake to consistently hit 160g protein daily.",
      "Increase water intake by 1-2 glasses, especially on workout days.",
      "Consider meal prepping on Sundays to maintain consistent nutrition throughout the week.",
    ],
    chartData: [
      { day: "Mon", calories: 2100, protein: 120 }, { day: "Tue", calories: 2350, protein: 135 },
      { day: "Wed", calories: 1950, protein: 110 }, { day: "Thu", calories: 2200, protein: 128 },
      { day: "Fri", calories: 2450, protein: 140 }, { day: "Sat", calories: 2600, protein: 150 },
      { day: "Sun", calories: 2050, protein: 115 },
    ],
    macroData: [
      { name: "Protein", value: 34, color: "#8b5cf6" },
      { name: "Carbs", value: 47, color: "#06b6d4" },
      { name: "Fat", value: 19, color: "#f59e0b" },
    ],
  },
  fitness: {
    title: "Fitness Progress Report",
    date: "July 2026",
    summary: "Your strength and endurance have improved significantly. You've hit new personal records on 3 compound lifts this month.",
    sections: [
      { title: "Bench Press PR", content: "New personal record: 80kg × 6 reps", metric: "80 kg", change: "+5 kg vs last month", positive: true },
      { title: "Squat PR", content: "New personal record: 110kg × 6 reps", metric: "110 kg", change: "+10 kg vs last month", positive: true },
      { title: "Total Volume", content: "Monthly volume: 98,400 kg across 20 sessions", metric: "98.4k kg", change: "+15% vs last month", positive: true },
      { title: "Workout Consistency", content: "Completed 20 of 22 planned sessions", metric: "91%", change: "+5% vs last month", positive: true },
    ],
    recommendations: [
      "Your squat is progressing rapidly — consider a dedicated leg day twice per week.",
      "Add progressive overload tracking for isolation exercises too.",
      "Consider deload week every 4-6 weeks to prevent plateaus.",
    ],
    chartData: [
      { day: "Wk1", calories: 22000, protein: 18 }, { day: "Wk2", calories: 24500, protein: 19 },
      { day: "Wk3", calories: 23000, protein: 20 }, { day: "Wk4", calories: 28900, protein: 20 },
    ],
    macroData: [
      { name: "Push", value: 30, color: "#ef4444" },
      { name: "Pull", value: 28, color: "#3b82f6" },
      { name: "Legs", value: 32, color: "#22c55e" },
      { name: "Core", value: 10, color: "#f59e0b" },
    ],
  },
  health: {
    title: "Health Metrics Report",
    date: "July 2026",
    summary: "All vital signs are within healthy ranges. Your resting heart rate has improved by 3 bpm over the past month.",
    sections: [
      { title: "Resting Heart Rate", content: "Average 68 bpm — excellent cardiovascular fitness", metric: "68 bpm", change: "-3 bpm vs last month", positive: true },
      { title: "Blood Pressure", content: "Consistently at 120/80 mmHg — optimal range", metric: "120/80", change: "Stable", positive: true },
      { title: "Sleep Score", content: "Average 8.5/10 sleep quality this month", metric: "8.5/10", change: "+0.3 vs last month", positive: true },
      { title: "HRV", content: "Average 48 ms — good recovery capacity", metric: "48 ms", change: "+5 ms vs last month", positive: true },
    ],
    recommendations: [
      "Maintain your current sleep schedule — it's clearly working well.",
      "Continue breathing exercises to keep stress levels manageable.",
      "Consider tracking blood oxygen more regularly for complete health picture.",
    ],
    chartData: [
      { day: "Mon", calories: 68, protein: 48 }, { day: "Tue", calories: 70, protein: 45 },
      { day: "Wed", calories: 66, protein: 50 }, { day: "Thu", calories: 65, protein: 52 },
      { day: "Fri", calories: 68, protein: 48 }, { day: "Sat", calories: 62, protein: 55 },
      { day: "Sun", calories: 64, protein: 50 },
    ],
    macroData: [
      { name: "Deep Sleep", value: 2.1, color: "#6366f1" },
      { name: "Light Sleep", value: 3.8, color: "#818cf8" },
      { name: "REM", value: 1.8, color: "#a78bfa" },
      { name: "Awake", value: 0.5, color: "#374151" },
    ],
  },
  monthly: {
    title: "Monthly Progress Report",
    date: "July 2026",
    summary: "July was your best month yet! You achieved 87% of your overall fitness score, a 6-point improvement from June.",
    sections: [
      { title: "Fitness Score", content: "Overall score: 87/100", metric: "87", change: "+6 vs June", positive: true },
      { title: "Workouts", content: "20 sessions completed, 18,200 total minutes", metric: "20 sessions", change: "+3 vs June", positive: true },
      { title: "Nutrition Compliance", content: "Hit protein goals on 22 of 31 days", metric: "71%", change: "+10% vs June", positive: true },
      { title: "Body Composition", content: "Lost 0.6kg fat, gained 0.2kg muscle", metric: "Net -0.4kg", change: "Positive trend", positive: true },
    ],
    recommendations: [
      "Continue the momentum — your consistency is paying off.",
      "Focus on hitting protein goals more consistently in August.",
      "Set a new target: aim for 90+ fitness score next month.",
    ],
    chartData: [
      { day: "Wk1", calories: 78, protein: 72 }, { day: "Wk2", calories: 82, protein: 78 },
      { day: "Wk3", calories: 85, protein: 81 }, { day: "Wk4", calories: 87, protein: 87 },
    ],
    macroData: [
      { name: "Workouts", value: 90, color: "#8b5cf6" },
      { name: "Nutrition", value: 75, color: "#06b6d4" },
      { name: "Sleep", value: 85, color: "#22c55e" },
      { name: "Recovery", value: 82, color: "#f59e0b" },
    ],
  },
};

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const report = reportData[id];

  if (!report) {
    return (
      <AppLayout title="Report Not Found">
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">This report could not be found.</p>
          <Link href="/reports"><Button>Back to Reports</Button></Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={report.title}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/reports" className="inline-flex">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Back</Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5"><Share2 className="h-3.5 w-3.5" /> Share</Button>
            <Button size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export PDF</Button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-5 w-5 text-violet-400" />
                <span className="text-sm text-zinc-400">{report.date}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{report.title}</h2>
              <p className="text-sm text-zinc-300">{report.summary}</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {report.sections.map((section, i) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-white">{section.title}</h3>
                    {section.positive !== undefined && (
                      section.positive ? <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mb-2">{section.content}</p>
                  {section.metric && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{section.metric}</span>
                      {section.change && (
                        <span className={cn("text-xs", section.positive ? "text-emerald-400" : "text-amber-400")}>{section.change}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="h-full">
              <CardHeader><CardTitle className="text-base">Trends</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={report.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                    <YAxis stroke="#71717a" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }} />
                    <Line type="monotone" dataKey="calories" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="protein" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="h-full">
              <CardHeader><CardTitle className="text-base">Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={report.macroData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                        {report.macroData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-3">
                    {report.macroData.map((m) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="text-sm text-zinc-400">{m.name}</span>
                        <span className="text-sm font-medium text-zinc-200">{m.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-violet-400" /> AI Recommendations</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40">
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-violet-400">{i + 1}</span>
                    </div>
                    <p className="text-sm text-zinc-300">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
