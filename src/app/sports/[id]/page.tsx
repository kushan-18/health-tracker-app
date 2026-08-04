"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWorkouts } from "@/lib/data-operations";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Flame, Heart } from "lucide-react";
import Link from "next/link";

const sportIcons: Record<string, string> = {
  Running: "\u{1F3C3}", Cycling: "\u{1F6B4}", Swimming: "\u{1F3CA}", Basketball: "\u{1F3C0}",
  Tennis: "\u{1F3BE}", Yoga: "\u{1F9D8}", HIIT: "\u26A1}", Cardio: "\u{1F3C3}", Strength: "\u{1F4AA}",
};

const sportColorMap: Record<string, string> = {
  Running: "from-emerald-500 to-green-500",
  Cycling: "from-blue-500 to-cyan-500",
  Swimming: "from-cyan-500 to-blue-500",
  Basketball: "from-orange-500 to-amber-500",
  Tennis: "from-yellow-500 to-amber-500",
  Yoga: "from-purple-500 to-violet-500",
  HIIT: "from-red-500 to-pink-500",
  Cardio: "from-emerald-500 to-green-500",
  Strength: "from-orange-500 to-amber-500",
};

export default function SportDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    getWorkouts(user.id).then((data) => {
      setSessions(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const session = sessions.find((s: any) => s.id === id);

  if (loading) {
    return (
      <AppLayout title="Loading...">
        <div className="text-center py-12 text-zinc-500">Loading session...</div>
      </AppLayout>
    );
  }

  if (!session) {
    return (
      <AppLayout title="Session Not Found">
        <div className="text-center py-12">
          <p className="text-zinc-400 mb-4">This session could not be found.</p>
          <Link href="/sports"><Button>Back to Sports</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const sportType = session.type || "Cardio";

  return (
    <AppLayout title={`${session.name || sportType} Session`}>
      <div className="space-y-4">
        <Link href="/sports" className="inline-flex">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className={cn("border-zinc-700/50 bg-gradient-to-br", sportColorMap[sportType] || "from-gray-500 to-gray-600")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{sportIcons[sportType] || "\u{1F3C3}"}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{session.name || sportType}</h2>
                  {session.notes && <div className="text-sm text-white/70">{session.notes}</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Clock className="h-5 w-5 text-white" /></div>
                  <div><div className="text-lg font-bold text-white">{session.duration_minutes}</div><div className="text-xs text-white/60">Minutes</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Flame className="h-5 w-5 text-white" /></div>
                  <div><div className="text-lg font-bold text-white">{session.calories_burned}</div><div className="text-xs text-white/60">Calories</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Heart className="h-5 w-5 text-white" /></div>
                  <div><div className="text-lg font-bold text-white">{session.completed ? "Yes" : "No"}</div><div className="text-xs text-white/60">Completed</div></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {session.notes && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-zinc-300">{session.notes}</p></CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader><CardTitle className="text-base">Session Info</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-400">Type</span><span className="text-zinc-200 capitalize">{sportType}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Date</span><span className="text-zinc-200">{new Date(session.completed_at || session.date).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Status</span><span className="text-zinc-200">{session.completed ? "Completed" : "Planned"}</span></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
