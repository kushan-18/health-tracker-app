"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Users, UserPlus, Trophy, Award, Heart, MessageCircle, Share2,
  MoreHorizontal, Image, ThumbsUp, Send, Flame, Target, Star,
} from "lucide-react";

const feedPosts = [
  {
    id: 1, user: "Alex Runner", avatar: "🏃", time: "2h ago",
    content: "Just completed a new PR on my 5K run! 21:34 — shaving off 30 seconds from my best. The consistent training is paying off!",
    likes: 24, comments: 8, type: "achievement", metric: "5K in 21:34",
  },
  {
    id: 2, user: "Sarah Cyclist", avatar: "🚴", time: "4h ago",
    content: "Beautiful morning ride through the countryside. 45km at an average pace of 28 km/h. Weather was perfect!",
    likes: 32, comments: 12, type: "activity", metric: "45 km ride",
  },
  {
    id: 3, user: "Mike Swimmer", avatar: "🏊", time: "6h ago",
    content: "Hit my protein goal for the 15th day in a row! Feeling stronger every week. Consistency is key.",
    likes: 18, comments: 5, type: "nutrition", metric: "15 day streak",
  },
  {
    id: 4, user: "Jordan Ball", avatar: "🏀", time: "1d ago",
    content: "Basketball practice was intense today. Worked on three-point shooting and defensive drills for 2 hours.",
    likes: 15, comments: 3, type: "activity", metric: "2h practice",
  },
];

const friends = [
  { id: 1, name: "Alex Runner", avatar: "🏃", status: "online", streak: 15, level: 14 },
  { id: 2, name: "Sarah Cyclist", avatar: "🚴", status: "online", streak: 12, level: 13 },
  { id: 3, name: "Mike Swimmer", avatar: "🏊", status: "offline", streak: 10, level: 11 },
  { id: 4, name: "Jordan Ball", avatar: "🏀", status: "away", streak: 7, level: 10 },
  { id: 5, name: "Chris Boxer", avatar: "🥊", status: "offline", streak: 6, level: 9 },
  { id: 6, name: "Pat Yogi", avatar: "🧘", status: "online", streak: 20, level: 15 },
  { id: 7, name: "Riley Racket", avatar: "🎾", status: "offline", streak: 5, level: 8 },
  { id: 8, name: "Sam Sprinter", avatar: "⚡", status: "online", streak: 9, level: 12 },
];

const challenges = [
  { id: 1, title: "30-Day Push-up Challenge", participants: 234, daysLeft: 12, progress: 60, icon: "💪" },
  { id: 2, title: "Run 100km This Month", participants: 189, daysLeft: 8, progress: 72, icon: "🏃" },
  { id: 3, title: "Protein Streak — 30 Days", participants: 312, daysLeft: 18, progress: 40, icon: "🥩" },
  { id: 4, title: "Yoga Every Day — July", participants: 156, daysLeft: 8, progress: 77, icon: "🧘" },
];

const achievements = [
  { id: 1, title: "First Workout", description: "Complete your first workout", icon: "🏋️", unlocked: true, xp: 50 },
  { id: 2, title: "Week Warrior", description: "5 workouts in a week", icon: "⚔️", unlocked: true, xp: 100 },
  { id: 3, title: "Protein Pro", description: "Hit protein goal 7 days straight", icon: "🥩", unlocked: true, xp: 150 },
  { id: 4, title: "Marathon Prep", description: "Run 42km total", icon: "🏅", unlocked: false, xp: 200 },
  { id: 5, title: "Iron Will", description: "30-day workout streak", icon: "🔥", unlocked: false, xp: 500 },
  { id: 6, title: "Century Club", description: "100 workouts completed", icon: "💯", unlocked: false, xp: 300 },
  { id: 7, title: "Early Bird", description: "Workout before 7 AM 10 times", icon: "🌅", unlocked: true, xp: 100 },
  { id: 8, title: "Social Butterfly", description: "Add 10 friends", icon: "🦋", unlocked: false, xp: 75 },
];

export default function SocialPage() {
  return (
    <AppLayout title="Social">
      <Tabs defaultValue="feed">
        <TabsList className="mb-6">
          <TabsTrigger value="feed"><MessageCircle className="h-4 w-4 mr-1.5" />Feed</TabsTrigger>
          <TabsTrigger value="friends"><Users className="h-4 w-4 mr-1.5" />Friends</TabsTrigger>
          <TabsTrigger value="challenges"><Trophy className="h-4 w-4 mr-1.5" />Challenges</TabsTrigger>
          <TabsTrigger value="achievements"><Award className="h-4 w-4 mr-1.5" />Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="feed"><FeedTab /></TabsContent>
        <TabsContent value="friends"><FriendsTab /></TabsContent>
        <TabsContent value="challenges"><ChallengesTab /></TabsContent>
        <TabsContent value="achievements"><AchievementsTab /></TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function FeedTab() {
  const [liked, setLiked] = React.useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold">Y</div>
            <input type="text" placeholder="Share your progress..." className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </CardContent>
      </Card>

      {feedPosts.map((post, i) => (
        <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{post.avatar}</div>
                  <div>
                    <div className="text-sm font-medium text-white">{post.user}</div>
                    <div className="text-xs text-zinc-500">{post.time}</div>
                  </div>
                </div>
                <Badge variant={post.type === "achievement" ? "success" : post.type === "nutrition" ? "secondary" : "default"}>
                  {post.metric}
                </Badge>
              </div>
              <p className="text-sm text-zinc-300 mb-3">{post.content}</p>
              <div className="flex items-center gap-4 pt-3 border-t border-zinc-800">
                <button onClick={() => toggleLike(post.id)} className={cn("flex items-center gap-1.5 text-xs transition-colors", liked.has(post.id) ? "text-red-400" : "text-zinc-500 hover:text-zinc-300")}>
                  <ThumbsUp className="h-3.5 w-3.5" /> {post.likes + (liked.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function FriendsTab() {
  const statusColors: Record<string, string> = {
    online: "bg-emerald-500", away: "bg-amber-500", offline: "bg-zinc-600",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">{friends.length} Friends</h3>
        <Button size="sm" className="gap-1.5"><UserPlus className="h-3.5 w-3.5" /> Add Friend</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {friends.map((friend, i) => (
          <motion.div key={friend.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="relative">
                  <div className="text-3xl">{friend.avatar}</div>
                  <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-900", statusColors[friend.status])} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{friend.name}</div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-orange-400" /> {friend.streak} day streak</span>
                    <span>Lv. {friend.level}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost"><MessageCircle className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ChallengesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">Active Challenges</h3>
        <Button size="sm" variant="outline"><Trophy className="h-3.5 w-3.5 mr-1.5" /> Browse All</Button>
      </div>
      {challenges.map((challenge, i) => (
        <motion.div key={challenge.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{challenge.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-white">{challenge.title}</h3>
                    <span className="text-xs text-zinc-500">{challenge.daysLeft} days left</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {challenge.participants} joined</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 mb-1">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${challenge.progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>{challenge.progress}% complete</span>
                    <span>{100 - challenge.progress}% to go</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function AchievementsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {achievements.map((ach, i) => (
          <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
            <Card className={cn("text-center", ach.unlocked ? "border-violet-500/20 bg-violet-500/5" : "opacity-50")}>
              <CardContent className="p-4">
                <div className="text-4xl mb-2">{ach.icon}</div>
                <h3 className="text-sm font-semibold text-white mb-1">{ach.title}</h3>
                <p className="text-xs text-zinc-400 mb-2">{ach.description}</p>
                <Badge variant={ach.unlocked ? "success" : "outline"}>
                  {ach.unlocked ? `✓ ${ach.xp} XP` : `🔒 ${ach.xp} XP`}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
