"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText, Download, Share2, TrendingUp, Heart,
  Brain, Dumbbell, Utensils, Eye
} from "lucide-react";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

const reports = [
  { id: "weekly", title: "Weekly Summary", description: "Overview of your week's activities, nutrition, and progress.", icon: FileText, color: "from-violet-500 to-violet-700", generated: true },
  { id: "body", title: "Body Composition", description: "Detailed analysis of weight, muscle, fat, and measurements.", icon: TrendingUp, color: "from-cyan-500 to-cyan-700", generated: true },
  { id: "nutrition", title: "Nutrition Report", description: "Macros breakdown, calorie tracking, and meal analysis.", icon: Utensils, color: "from-emerald-500 to-emerald-700", generated: false },
  { id: "fitness", title: "Fitness Progress", description: "Workout history, performance metrics, and strength gains.", icon: Dumbbell, color: "from-amber-500 to-amber-700", generated: true },
  { id: "health", title: "Health Metrics", description: "Vitals tracking, sleep analysis, and mental wellness.", icon: Heart, color: "from-rose-500 to-rose-700", generated: false },
  { id: "monthly", title: "Monthly Report", description: "Comprehensive monthly summary with trends and insights.", icon: Brain, color: "from-purple-500 to-purple-700", generated: false },
];

const weeklyData = [
  { day: "Mon", calories: 2200, protein: 120 },
  { day: "Tue", calories: 2400, protein: 135 },
  { day: "Wed", calories: 2100, protein: 115 },
  { day: "Thu", calories: 2350, protein: 128 },
  { day: "Fri", calories: 2500, protein: 140 },
  { day: "Sat", calories: 2800, protein: 150 },
  { day: "Sun", calories: 2250, protein: 125 },
];

const macrosData = [
  { name: "Protein", value: 35, color: "#8b5cf6" },
  { name: "Carbs", value: 45, color: "#06b6d4" },
  { name: "Fat", value: 20, color: "#f59e0b" },
];

export default function ReportsPage() {
  const [previewing, setPreviewing] = useState<string | null>(null);

  const generatePDF = () => {
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) return;
    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>VitalX AI Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; }
          h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
          h2 { color: #333; margin-top: 30px; }
          .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px 0; }
          .stat { background: #f8f9fa; border-radius: 8px; padding: 16px; text-align: center; }
          .stat .value { font-size: 28px; font-weight: bold; color: #7c3aed; }
          .stat .label { font-size: 12px; color: #666; margin-top: 4px; }
          .stat .change { font-size: 12px; color: #22c55e; margin-top: 4px; }
          .insight { background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 10px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>VitalX AI - ${previewing ? reports.find(r => r.id === previewing)?.title || 'Weekly' : 'Weekly'} Report</h1>
        <p style="color: #666;">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <h2>Daily Calories</h2>
        <div class="stat-grid">
          <div class="stat"><div class="value">2,200</div><div class="label">Mon</div></div>
          <div class="stat"><div class="value">2,400</div><div class="label">Tue</div></div>
          <div class="stat"><div class="value">2,100</div><div class="label">Wed</div></div>
          <div class="stat"><div class="value">2,350</div><div class="label">Thu</div></div>
          <div class="stat"><div class="value">2,500</div><div class="label">Fri</div></div>
          <div class="stat"><div class="value">2,800</div><div class="label">Sat</div></div>
          <div class="stat"><div class="value">2,250</div><div class="label">Sun</div></div>
        </div>

        <h2>Macronutrient Split</h2>
        <div class="stat-grid">
          <div class="stat"><div class="value">35%</div><div class="label">Protein</div></div>
          <div class="stat"><div class="value">45%</div><div class="label">Carbs</div></div>
          <div class="stat"><div class="value">20%</div><div class="label">Fat</div></div>
        </div>

        <h2>Key Insights</h2>
        <div class="insight"><strong>Avg Calories:</strong> 2,371 (-5% from last week)</div>
        <div class="insight"><strong>Avg Protein:</strong> 130g (+8% from last week)</div>
        <div class="insight"><strong>Workouts Completed:</strong> 5/7 (+1 from last week)</div>
        <div class="insight"><strong>Body Weight:</strong> 76.2 kg (trending down)</div>
        <div class="insight"><strong>Sleep Score:</strong> 8.5/10 (excellent)</div>
        <div class="insight"><strong>Streak:</strong> 7 days consecutive activity</div>

        <div class="footer">
          <p>VitalX AI - Your Personal AI Health Coach</p>
          <p>This report was generated by VitalX AI. For more insights, visit the app.</p>
        </div>
      </body>
      </html>
    `);
    reportWindow.document.close();
    setTimeout(() => { reportWindow.print(); }, 500);
  };

  const handlePDFClick = (reportId: string) => {
    setPreviewing(reportId);
    setTimeout(() => generatePDF(), 300);
  };

  return (
    <AppLayout title="Reports">
      <div className="mb-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs text-center">
        Reports currently use sample data. Dynamic report generation from your real data coming soon.
      </div>
      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <motion.div key={report.id} variants={fadeIn}>
              <Card className="group hover:border-zinc-700 transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${report.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <report.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100 mb-1">{report.title}</h3>
                  <p className="text-sm text-zinc-400 mb-4">{report.description}</p>
                  <div className="flex gap-2">
                    {report.generated ? (
                      <>
                        <Button size="sm" className="gap-1.5 flex-1" onClick={() => setPreviewing(report.id)}>
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handlePDFClick(report.id)}>
                          <Download className="h-3.5 w-3.5" /> PDF
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="secondary" className="gap-1.5 flex-1">
                        Generate Report
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {previewing && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-100">Report Preview</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2"><Share2 className="h-4 w-4" /> Share</Button>
                <Button className="gap-2" onClick={generatePDF}><Download className="h-4 w-4" /> Export PDF</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Daily Calories</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                      <YAxis stroke="#71717a" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                      <Line type="monotone" dataKey="calories" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Macronutrient Split</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={macrosData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                          {macrosData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-3">
                      {macrosData.map((m) => (
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
            </div>

            <Card>
              <CardHeader><CardTitle>Key Insights</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "Avg Calories", value: "2,371", change: "-5%", trend: "down" },
                    { label: "Avg Protein", value: "130g", change: "+8%", trend: "up" },
                    { label: "Workouts", value: "5/7", change: "+1", trend: "up" },
                  ].map((insight) => (
                    <div key={insight.label} className="rounded-xl border border-zinc-800 bg-zinc-800/40 p-4">
                      <p className="text-xs text-zinc-400">{insight.label}</p>
                      <p className="text-2xl font-bold text-zinc-100">{insight.value}</p>
                      <p className={`text-xs ${insight.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>{insight.change}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
}
