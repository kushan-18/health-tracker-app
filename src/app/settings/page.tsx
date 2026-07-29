"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Sun, Moon, Bell, Shield, User, Ruler, Database,
  ChevronRight, LogOut, Trash2, Download, Check,
} from "lucide-react";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

export default function SettingsPage() {
  const { theme, toggleTheme, user } = useStore();
  const [notifications, setNotifications] = React.useState({ workout: true, meals: true, water: true, social: false, news: false });
  const [units, setUnits] = React.useState({ weight: "kg", height: "cm", distance: "km" });
  const [privacy, setPrivacy] = React.useState({ profileVisibility: "friends", activitySharing: true, showOnLeaderboard: true });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppLayout title="Settings">
      <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-2xl mx-auto space-y-6">
        {/* Appearance */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sun className="h-4 w-4 text-violet-400" /> Appearance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Theme</p>
                  <p className="text-xs text-zinc-500">Switch between light and dark mode</p>
                </div>
                <button onClick={toggleTheme} className={cn("relative w-14 h-7 rounded-full transition-colors", theme === "dark" ? "bg-violet-600" : "bg-zinc-700")}>
                  <div className={cn("absolute top-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center transition-transform", theme === "dark" ? "translate-x-7" : "translate-x-0.5")}>
                    {theme === "dark" ? <Moon className="h-3.5 w-3.5 text-violet-600" /> : <Sun className="h-3.5 w-3.5 text-amber-600" />}
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-violet-400" /> Notifications</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "workout" as const, label: "Workout Reminders", desc: "Get reminded about scheduled workouts" },
                  { key: "meals" as const, label: "Meal Logging", desc: "Reminders to log your meals" },
                  { key: "water" as const, label: "Hydration Alerts", desc: "Water intake reminders throughout the day" },
                  { key: "social" as const, label: "Social Updates", desc: "Friend activities and challenges" },
                  { key: "news" as const, label: "Health Tips", desc: "Daily health and nutrition tips" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                    <button onClick={() => toggleNotif(item.key)} className={cn("relative w-12 h-6 rounded-full transition-colors", notifications[item.key] ? "bg-violet-600" : "bg-zinc-700")}>
                      <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform", notifications[item.key] ? "translate-x-6" : "translate-x-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-violet-400" /> Privacy</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Profile Visibility</p>
                    <p className="text-xs text-zinc-500">Who can see your profile</p>
                  </div>
                  <select value={privacy.profileVisibility} onChange={(e) => setPrivacy((p) => ({ ...p, profileVisibility: e.target.value }))} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option value="public">Public</option>
                    <option value="friends">Friends</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                {[
                  { key: "activitySharing" as const, label: "Activity Sharing", desc: "Share activities with friends" },
                  { key: "showOnLeaderboard" as const, label: "Leaderboard Visibility", desc: "Show your profile on leaderboards" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                    <button onClick={() => setPrivacy((p) => ({ ...p, [item.key]: !p[item.key] }))} className={cn("relative w-12 h-6 rounded-full transition-colors", privacy[item.key] ? "bg-violet-600" : "bg-zinc-700")}>
                      <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform", privacy[item.key] ? "translate-x-6" : "translate-x-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-violet-400" /> Account</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40">
                  <div><p className="text-sm text-white">Email</p><p className="text-xs text-zinc-500">{user?.email || "user@vitalx.ai"}</p></div>
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40">
                  <div><p className="text-sm text-white">Change Password</p><p className="text-xs text-zinc-500">Last changed 30 days ago</p></div>
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40">
                  <div><p className="text-sm text-white">Connected Accounts</p><p className="text-xs text-zinc-500">Google, Apple</p></div>
                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Units */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Ruler className="h-4 w-4 text-violet-400" /> Units</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "weight" as const, label: "Weight", options: ["kg", "lbs"] },
                  { key: "height" as const, label: "Height", options: ["cm", "ft/in"] },
                  { key: "distance" as const, label: "Distance", options: ["km", "miles"] },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <p className="text-sm text-white">{item.label}</p>
                    <div className="flex gap-1 bg-zinc-800 rounded-lg p-0.5">
                      {item.options.map((opt) => (
                        <button key={opt} onClick={() => setUnits((u) => ({ ...u, [item.key]: opt }))} className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all", units[item.key] === opt ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200")}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4 text-violet-400" /> Data</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2"><Download className="h-4 w-4" /> Export All Data</Button>
                <Button variant="destructive" className="w-full justify-start gap-2"><Trash2 className="h-4 w-4" /> Delete All Data</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Button variant="destructive" className="w-full gap-2"><LogOut className="h-4 w-4" /> Sign Out</Button>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
