"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getWeightLogs } from "@/lib/data-operations";
import { useAuth } from "@/lib/auth-context";
import { calculateBMI, getBMICategory } from "@/lib/utils";
import { TrendingUp, TrendingDown, Scale, Activity, Ruler } from "lucide-react";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

const colorMap: Record<string, string> = {
  violet: "from-violet-500 to-violet-700",
  cyan: "from-cyan-500 to-cyan-700",
  emerald: "from-emerald-500 to-emerald-700",
  amber: "from-amber-500 to-amber-700",
  rose: "from-rose-500 to-rose-700",
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [weightLogs, setWeightLogs] = useState<any[]>([]);
  const [trendRange, setTrendRange] = useState("1W");

  useEffect(() => {
    if (!user) return;
    getWeightLogs(user.id).then(setWeightLogs).catch(console.error);
  }, [user]);

  const sortedLogs = useMemo(() => {
    return [...weightLogs].sort((a: any, b: any) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime());
  }, [weightLogs]);

  const latestWeight = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1].weight : null;
  const firstWeight = sortedLogs.length > 0 ? sortedLogs[0].weight : null;
  const bmi = latestWeight ? calculateBMI(latestWeight, 175) : null;

  const statCards = useMemo(() => {
    if (!latestWeight) return [];
    const change = sortedLogs.length >= 2 ? (latestWeight - sortedLogs[sortedLogs.length - 2].weight).toFixed(1) : "0.0";
    return [
      { label: "Weight", value: latestWeight.toFixed(1), unit: "kg", change: `${Number(change) >= 0 ? "+" : ""}${change}`, positive: Number(change) <= 0, icon: Scale, color: "violet" },
      { label: "BMI", value: bmi ? bmi.toFixed(1) : "—", unit: "", change: bmi ? getBMICategory(bmi) : "", positive: true, icon: Activity, color: "cyan" },
      { label: "Total Change", value: firstWeight ? (latestWeight - firstWeight).toFixed(1) : "0", unit: "kg", change: firstWeight && latestWeight <= firstWeight ? "Losing" : "Gaining", positive: firstWeight ? latestWeight <= firstWeight : true, icon: TrendingDown, color: "emerald" },
      { label: "Entries", value: String(weightLogs.length), unit: "logs", change: "", positive: true, icon: TrendingUp, color: "amber" },
    ];
  }, [latestWeight, firstWeight, bmi, weightLogs.length, sortedLogs]);

  const trendData = useMemo(() => {
    const now = new Date();
    let cutoff: Date;
    if (trendRange === "1W") cutoff = new Date(now.getTime() - 7 * 86400000);
    else if (trendRange === "1M") cutoff = new Date(now.getTime() - 30 * 86400000);
    else if (trendRange === "3M") cutoff = new Date(now.getTime() - 90 * 86400000);
    else if (trendRange === "6M") cutoff = new Date(now.getTime() - 180 * 86400000);
    else cutoff = new Date(now.getTime() - 365 * 86400000);

    return sortedLogs
      .filter((l: any) => new Date(l.logged_at) >= cutoff)
      .map((l: any) => ({
        date: new Date(l.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        weight: l.weight,
      }));
  }, [sortedLogs, trendRange]);

  return (
    <AppLayout title="Body Analytics">
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
            {statCards.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        {stat.change && (
                          <div className={`flex items-center gap-1 mt-1 text-xs ${stat.positive ? "text-emerald-400" : "text-red-400"}`}>
                            {stat.change}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No weight data yet</h3>
                <p className="text-zinc-400 text-sm">Log your weight on the Dashboard to start tracking analytics.</p>
              </Card>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div variants={fadeIn} className="lg:col-span-2">
                <Card>
                  <CardHeader><CardTitle>Weight Trend</CardTitle></CardHeader>
                  <CardContent>
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                          <YAxis domain={["dataMin - 1", "dataMax + 1"]} stroke="#71717a" fontSize={12} />
                          <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                          <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-zinc-500 text-sm">No weight entries in this period</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="h-full">
                  <CardHeader><CardTitle>BMI Gauge</CardTitle></CardHeader>
                  <CardContent className="flex flex-col items-center justify-center h-[230px]">
                    {bmi ? (
                      <>
                        <div className="relative w-48 h-24 overflow-hidden">
                          <div className="absolute inset-0 rounded-t-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-red-500 opacity-20" />
                          <div className="absolute bottom-0 left-1/2 w-1 h-full bg-zinc-900 origin-bottom -translate-x-1/2" style={{ transform: `rotate(${(bmi - 15) * 6 - 90}deg)` }} />
                          <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 shadow-lg" />
                        </div>
                        <div className="text-center mt-4">
                          <p className="text-3xl font-bold text-zinc-100">{bmi}</p>
                          <p className="text-sm text-emerald-400 font-medium">{getBMICategory(bmi)}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-zinc-500 text-sm">Log weight to calculate BMI</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Weight Trends</CardTitle>
              <div className="flex gap-1 bg-zinc-800/80 rounded-xl p-1">
                {["1W", "1M", "3M", "6M", "1Y"].map((r) => (
                  <button key={r} onClick={() => setTrendRange(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${trendRange === r ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} stroke="#71717a" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "12px" }} />
                    <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-zinc-500 text-sm">No weight entries in this period</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          <div className="grid lg:grid-cols-2 gap-6">
            {sortedLogs.length >= 2 ? (
              <>
                <motion.div variants={fadeIn} initial="initial" animate="animate">
                  <Card className="border-violet-500/30">
                    <CardHeader>
                      <CardTitle className="text-violet-400">First Entry</CardTitle>
                      <p className="text-xs text-zinc-500">{new Date(sortedLogs[0].logged_at).toLocaleDateString()}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">Weight</span>
                          <span className="text-sm font-medium text-zinc-200">{sortedLogs[0].weight} kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={fadeIn} initial="initial" animate="animate">
                  <Card className="border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="text-emerald-400">Latest Entry</CardTitle>
                      <p className="text-xs text-zinc-500">{new Date(sortedLogs[sortedLogs.length - 1].logged_at).toLocaleDateString()}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">Weight</span>
                          <span className="text-sm font-medium text-zinc-200">{sortedLogs[sortedLogs.length - 1].weight} kg</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-400">Change</span>
                          <span className={`text-sm font-medium ${(sortedLogs[sortedLogs.length - 1].weight - sortedLogs[0].weight) <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {(sortedLogs[sortedLogs.length - 1].weight - sortedLogs[0].weight).toFixed(1)} kg
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : (
              <motion.div variants={fadeIn} initial="initial" animate="animate" className="lg:col-span-2">
                <Card className="p-12 text-center">
                  <Ruler className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-white mb-2">Not enough data to compare</h3>
                  <p className="text-zinc-400 text-sm">Log at least two weight entries to see your progress comparison.</p>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
