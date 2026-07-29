"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Users, Activity, TrendingUp, DollarSign, MoreHorizontal,
  Search, ArrowUpRight, ArrowDownRight, Eye, Edit, Trash2,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

const stats = [
  { label: "Total Users", value: "12,847", change: "+12%", positive: true, icon: Users, color: "from-violet-500 to-violet-700" },
  { label: "Active Today", value: "3,421", change: "+5%", positive: true, icon: Activity, color: "from-emerald-500 to-emerald-700" },
  { label: "Workouts Logged", value: "48,293", change: "+18%", positive: true, icon: TrendingUp, color: "from-blue-500 to-blue-700" },
  { label: "Revenue", value: "$24,580", change: "+8%", positive: true, icon: DollarSign, color: "from-amber-500 to-amber-700" },
];

const analyticsData = [
  { date: "Jan", users: 5200, revenue: 12400 }, { date: "Feb", users: 6100, revenue: 14200 },
  { date: "Mar", users: 7400, revenue: 16800 }, { date: "Apr", users: 8200, revenue: 18500 },
  { date: "May", users: 9500, revenue: 20100 }, { date: "Jun", users: 11200, revenue: 22800 },
  { date: "Jul", users: 12847, revenue: 24580 },
];

const users = [
  { id: 1, name: "Alex Runner", email: "alex@email.com", plan: "Premium", status: "active", workouts: 156, joinDate: "Jan 2025" },
  { id: 2, name: "Sarah Cyclist", email: "sarah@email.com", plan: "Pro", status: "active", workouts: 142, joinDate: "Feb 2025" },
  { id: 3, name: "Mike Swimmer", email: "mike@email.com", plan: "Free", status: "active", workouts: 89, joinDate: "Mar 2025" },
  { id: 4, name: "Jordan Ball", email: "jordan@email.com", plan: "Premium", status: "active", workouts: 128, joinDate: "Apr 2025" },
  { id: 5, name: "Chris Boxer", email: "chris@email.com", plan: "Pro", status: "inactive", workouts: 67, joinDate: "May 2025" },
  { id: 6, name: "Pat Yogi", email: "pat@email.com", plan: "Premium", status: "active", workouts: 198, joinDate: "Jan 2025" },
  { id: 7, name: "Riley Racket", email: "riley@email.com", plan: "Free", status: "active", workouts: 45, joinDate: "Jun 2025" },
  { id: 8, name: "Sam Sprinter", email: "sam@email.com", plan: "Pro", status: "active", workouts: 112, joinDate: "Mar 2025" },
];

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Admin Dashboard">
      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} variants={fadeIn}>
              <Card className="hover:border-zinc-700 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-bold text-zinc-100 mt-2">{stat.value}</p>
                      <div className={cn("flex items-center gap-1 mt-1 text-xs", stat.positive ? "text-emerald-400" : "text-red-400")}>
                        {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center", stat.color)}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Analytics Chart */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader><CardTitle className="text-base">User Growth & Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#71717a" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#71717a" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }} />
                  <Area yAxisId="left" type="monotone" dataKey="users" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} name="Users" />
                  <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} name="Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Users</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 w-56"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-zinc-500 text-xs border-b border-zinc-800">
                      <th className="text-left pb-3 font-medium">User</th>
                      <th className="text-left pb-3 font-medium">Plan</th>
                      <th className="text-left pb-3 font-medium">Status</th>
                      <th className="text-right pb-3 font-medium">Workouts</th>
                      <th className="text-left pb-3 font-medium">Joined</th>
                      <th className="text-right pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, i) => (
                      <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3">
                          <div>
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-xs text-zinc-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant={user.plan === "Premium" ? "default" : user.plan === "Pro" ? "secondary" : "outline"}>
                            {user.plan}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <div className={cn("h-2 w-2 rounded-full", user.status === "active" ? "bg-emerald-500" : "bg-zinc-600")} />
                            <span className="text-xs text-zinc-400 capitalize">{user.status}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-sm text-zinc-300">{user.workouts}</td>
                        <td className="py-3 text-xs text-zinc-500">{user.joinDate}</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"><Eye className="h-3.5 w-3.5 text-zinc-400" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"><Edit className="h-3.5 w-3.5 text-zinc-400" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
