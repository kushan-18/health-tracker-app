"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWorkouts, getMeals, getHealthMetrics } from "@/lib/data-operations";
import { useAuth } from "@/lib/auth-context";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const dotColors: Record<string, string> = {
  workout: "bg-emerald-500",
  meal: "bg-blue-500",
  health: "bg-purple-500",
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalEvent = { date: string; type: string; title: string };

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getWorkouts(user.id).catch(() => []),
      getMeals(user.id).catch(() => []),
      getHealthMetrics(user.id).catch(() => []),
    ]).then(([w, m, h]) => {
      setWorkouts(w);
      setMeals(m);
      setHealthMetrics(h);
    });
  }, [user]);

  const calendarEvents: CalEvent[] = useMemo(() => {
    const events: CalEvent[] = [];
    workouts.forEach((w) => {
      const d = w.completed_at || w.date;
      if (d) events.push({ date: new Date(d).toISOString().split("T")[0], type: "workout", title: w.name || w.type });
    });
    meals.forEach((m) => {
      if (m.logged_at) events.push({ date: new Date(m.logged_at).toISOString().split("T")[0], type: "meal", title: m.name });
    });
    healthMetrics.forEach((h) => {
      if (h.recorded_at) events.push({ date: new Date(h.recorded_at).toISOString().split("T")[0], type: "health", title: h.type.replace("_", " ") });
    });
    return events;
  }, [workouts, meals, healthMetrics]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarEvents.filter((e) => e.date === dateStr);
  };

  const calendarDays: { day: number; isCurrentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  const today = new Date();
  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const selectedDayEvents = getEventsForDate(currentDate.getDate());

  return (
    <AppLayout title="Calendar">
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{months[month]} {year}</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-zinc-500 py-2">{day}</div>
                ))}
                {calendarDays.map((item, i) => {
                  const events = item.isCurrentMonth ? getEventsForDate(item.day) : [];
                  return (
                    <div
                      key={i}
                      className={`min-h-[72px] rounded-xl p-1.5 text-sm transition-all duration-200 cursor-pointer ${
                        item.isCurrentMonth
                          ? isToday(item.day)
                            ? "bg-violet-600/20 border border-violet-500/50 text-zinc-100"
                            : "bg-zinc-800/40 text-zinc-300 hover:bg-zinc-800/60 border border-transparent"
                          : "text-zinc-600 border border-transparent"
                      }`}
                    >
                      <span className="text-xs">{item.day}</span>
                      {events.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {events.map((e, j) => (
                            <div key={j} className={`h-1.5 w-1.5 rounded-full ${dotColors[e.type] || "bg-zinc-500"}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-zinc-800">
                {Object.entries(dotColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                    <span className="text-xs text-zinc-400 capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} initial="initial" animate="animate">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Events — {months[month]} {currentDate.getDate()}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">No events this day</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((event, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-800/40 p-3">
                      <div className={`h-3 w-3 rounded-full ${dotColors[event.type] || "bg-zinc-500"}`} />
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{event.title}</p>
                        <p className="text-xs text-zinc-500 capitalize">{event.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
