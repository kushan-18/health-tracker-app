"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity, Heart, Droplets, Thermometer, Wind, ArrowLeft, Save
} from "lucide-react";
import Link from "next/link";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const metricTypes = [
  { id: "blood_pressure", label: "Blood Pressure", icon: Activity, color: "text-rose-400", unit: "mmHg" },
  { id: "blood_sugar", label: "Blood Sugar", icon: Droplets, color: "text-amber-400", unit: "mg/dL" },
  { id: "spo2", label: "SpO2", icon: Wind, color: "text-cyan-400", unit: "%" },
  { id: "heart_rate", label: "Heart Rate", icon: Heart, color: "text-red-400", unit: "bpm" },
  { id: "temperature", label: "Temperature", icon: Thermometer, color: "text-orange-400", unit: "°F" },
];

export default function AddMetricPage() {
  const [selectedType, setSelectedType] = useState("blood_pressure");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [notes, setNotes] = useState("");

  const isBP = selectedType === "blood_pressure";

  return (
    <AppLayout title="Add Health Metric">
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div variants={fadeIn} initial="initial" animate="animate">
          <Link href="/health" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Health
          </Link>
          <Card>
            <CardHeader>
              <CardTitle>Select Metric Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {metricTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                      selectedType === type.id
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/60"
                    }`}
                  >
                    <type.icon className={`h-6 w-6 ${type.color}`} />
                    <span className="text-xs font-medium text-zinc-300">{type.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} initial="initial" animate="animate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(metricTypes.find((t) => t.id === selectedType)!.icon, { className: "h-5 w-5 text-violet-400" })}
                {metricTypes.find((t) => t.id === selectedType)!.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isBP ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Systolic</label>
                      <input type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="120" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Diastolic</label>
                      <input type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="80" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Value ({metricTypes.find((t) => t.id === selectedType)!.unit})</label>
                    <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="Enter value..." />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Time</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="Optional notes..." rows={3} />
                </div>

                <Button className="w-full gap-2" size="lg">
                  <Save className="h-4 w-4" /> Save Metric
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
