'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MessageCircle, Share2, Search, Plus, Trophy, Users,
  Star, Flame, Award, ChevronRight, MoreHorizontal, Send,
  Bookmark, Image as ImageIcon, Smile, Target, Crown,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabTriggers, TabTrigger, TabContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20'

interface FeedPost {
  id: string
  user: { name: string; avatar: string; level: number }
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  liked: boolean
  type: 'workout' | 'achievement' | 'milestone' | 'general'
}

const feedPosts: FeedPost[] = [
  {
    id: 'p_001',
    user: { name: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', level: 15 },
    content: 'Just hit a new PR on deadlift! 120kg for 5 reps! 💪 Consistency really pays off. 3 months of dedicated training and the results speak for themselves.',
    timestamp: '2 hours ago',
    likes: 47,
    comments: 12,
    liked: false,
    type: 'workout',
  },
  {
    id: 'p_002',
    user: { name: 'Raj Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj', level: 14 },
    content: '🏆 Achievement Unlocked: Marathon Runner! Completed my first full marathon in 4:12:00. Never thought I\'d say those words!',
    timestamp: '5 hours ago',
    likes: 89,
    comments: 23,
    liked: true,
    type: 'achievement',
  },
  {
    id: 'p_003',
    user: { name: 'Neha Singh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha', level: 11 },
    content: '30-day yoga challenge complete! 🧘‍♀️ Feeling more flexible, calm, and centered than ever. Namaste!',
    timestamp: '1 day ago',
    likes: 62,
    comments: 15,
    liked: false,
    type: 'milestone',
  },
  {
    id: 'p_004',
    user: { name: 'Vikram Reddy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', level: 11 },
    content: 'Morning run along the beach was absolutely magical today. 10K in perfect weather. Anyone else training for the upcoming city half-marathon?',
    timestamp: '1 day ago',
    likes: 34,
    comments: 8,
    liked: false,
    type: 'general',
  },
  {
    id: 'p_005',
    user: { name: 'Anita Desai', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita', level: 9 },
    content: 'Down 5kg in 2 months! 📉 Meal tracking has been a game-changer. Thank you VitalX AI for the personalized nutrition plan!',
    timestamp: '2 days ago',
    likes: 156,
    comments: 31,
    liked: true,
    type: 'milestone',
  },
]

interface Friend {
  id: string
  name: string
  avatar: string
  level: number
  xp: number
  online: boolean
  lastActive: string
  mutualWorkouts: number
}

const friends: Friend[] = [
  { id: 'f_001', name: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', level: 15, xp: 6200, online: true, lastActive: 'Now', mutualWorkouts: 12 },
  { id: 'f_002', name: 'Raj Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj', level: 14, xp: 5800, online: true, lastActive: 'Now', mutualWorkouts: 8 },
  { id: 'f_003', name: 'Neha Singh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha', level: 11, xp: 3900, online: false, lastActive: '3h ago', mutualWorkouts: 5 },
  { id: 'f_004', name: 'Vikram Reddy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', level: 11, xp: 4200, online: false, lastActive: '1d ago', mutualWorkouts: 3 },
  { id: 'f_005', name: 'Anita Desai', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita', level: 9, xp: 3200, online: true, lastActive: 'Now', mutualWorkouts: 7 },
  { id: 'f_006', name: 'Surya Nair', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Surya', level: 8, xp: 2800, online: false, lastActive: '5h ago', mutualWorkouts: 2 },
]

interface Challenge {
  id: string
  title: string
  description: string
  participants: number
  maxParticipants: number
  progress: number
  daysLeft: number
  prize: string
  icon: string
  joined: boolean
}

const challenges: Challenge[] = [
  { id: 'ch_001', title: '30-Day Push-Up Challenge', description: 'Complete 3000 push-ups in 30 days', participants: 234, maxParticipants: 500, progress: 65, daysLeft: 12, prize: '500 XP + Gold Badge', icon: '💪', joined: true },
  { id: 'ch_002', title: 'Hydration Hero Week', description: 'Drink 3L of water daily for 7 days', participants: 189, maxParticipants: 300, progress: 42, daysLeft: 4, prize: '200 XP', icon: '💧', joined: true },
  { id: 'ch_003', title: '10K Steps Daily', description: 'Hit 10,000 steps every day this month', participants: 456, maxParticipants: 600, progress: 78, daysLeft: 8, prize: '1000 XP + Running Badge', icon: '🏃', joined: false },
  { id: 'ch_004', title: 'Veggie Warrior', description: 'Eat 5 servings of vegetables daily for 14 days', participants: 123, maxParticipants: 200, progress: 30, daysLeft: 10, prize: '300 XP + Nutrition Badge', icon: '🥗', joined: false },
]

interface AchievementBadge {
  id: string
  name: string
  icon: string
  description: string
  unlocked: boolean
  unlockedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const achievementBadges: AchievementBadge[] = [
  { id: 'b_001', name: 'First Workout', icon: '🏋️', description: 'Complete your first workout', unlocked: true, unlockedAt: 'Jan 16', rarity: 'common' },
  { id: 'b_002', name: 'Week Warrior', icon: '🔥', description: 'Work out 7 days in a row', unlocked: true, unlockedAt: 'Jan 22', rarity: 'rare' },
  { id: 'b_003', name: 'Hydration Hero', icon: '💧', description: 'Log water intake for 14 days', unlocked: true, unlockedAt: 'Feb 1', rarity: 'common' },
  { id: 'b_004', name: 'Protein Pro', icon: '🥩', description: 'Hit protein target for 7 days', unlocked: true, unlockedAt: 'Feb 5', rarity: 'rare' },
  { id: 'b_005', name: 'Early Bird', icon: '🌅', description: 'Workout before 7 AM', unlocked: true, unlockedAt: 'Feb 8', rarity: 'common' },
  { id: 'b_006', name: 'Iron Pumper', icon: '💪', description: 'Bench press your bodyweight', unlocked: true, unlockedAt: 'Feb 12', rarity: 'epic' },
  { id: 'b_007', name: 'Marathon Runner', icon: '🏃', description: 'Run a total of 50 km', unlocked: true, unlockedAt: 'Feb 15', rarity: 'epic' },
  { id: 'b_008', name: 'Sleep Master', icon: '😴', description: '8+ hours sleep for 7 days', unlocked: true, unlockedAt: 'Feb 18', rarity: 'rare' },
  { id: 'b_009', name: 'Nutrition Guru', icon: '🥗', description: 'Track all meals for 14 days', unlocked: true, unlockedAt: 'Feb 20', rarity: 'rare' },
  { id: 'b_010', name: 'Level 12', icon: '⭐', description: 'Reach Level 12', unlocked: true, unlockedAt: 'Feb 22', rarity: 'common' },
  { id: 'b_011', name: 'Century Club', icon: '💯', description: 'Complete 100 workouts', unlocked: false, rarity: 'legendary' },
  { id: 'b_012', name: 'Iron Will', icon: '🏋️', description: 'Squat 1.5x bodyweight', unlocked: false, rarity: 'legendary' },
  { id: 'b_013', name: 'Ultra Runner', icon: '🏅', description: 'Run 200 km total', unlocked: false, rarity: 'epic' },
  { id: 'b_014', name: 'Perfect Week', icon: '✨', description: 'Hit all goals for 7 days straight', unlocked: false, rarity: 'legendary' },
]

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  common: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  rare: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  epic: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  legendary: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
}

function FeedTab() {
  const [likedPosts, setLikedPosts] = React.useState<Set<string>>(new Set(['p_002', 'p_005']))

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  const typeIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    workout: { icon: <Flame className="w-3.5 h-3.5" />, color: 'text-orange-400' },
    achievement: { icon: <Trophy className="w-3.5 h-3.5" />, color: 'text-amber-400' },
    milestone: { icon: <Star className="w-3.5 h-3.5" />, color: 'text-purple-400' },
    general: { icon: <Users className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  }

  return (
    <div className="space-y-4">
      {/* Post Input */}
      <Card className={CARD_HOVER}>
        <CardContent className="pt-5">
          <div className="flex items-start gap-3">
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" fallback="RS" size="md" />
            <div className="flex-1">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-400 cursor-pointer hover:bg-white/[0.08] transition-colors">
                Share your progress...
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <ImageIcon className="w-4 h-4" /> Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <Smile className="w-4 h-4" /> Feeling
                </Button>
                <div className="flex-1" />
                <Button size="sm">
                  <Send className="w-3.5 h-3.5" /> Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed Posts */}
      {feedPosts.map((post, i) => (
        <motion.div key={post.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={CARD_HOVER}>
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <Avatar src={post.user.avatar} fallback={post.user.name} size="md" online={i < 2} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{post.user.name}</span>
                    <Badge variant="default" className="text-[10px]">Lv.{post.user.level}</Badge>
                    <div className={cn('flex items-center gap-1', typeIcons[post.type].color)}>
                      {typeIcons[post.type].icon}
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">{post.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleLike(post.id)}
                      className={cn('flex items-center gap-1.5 text-sm transition-colors', likedPosts.has(post.id) ? 'text-red-400' : 'text-gray-500 hover:text-red-400')}
                    >
                      <Heart className={cn('w-4 h-4', likedPosts.has(post.id) && 'fill-current')} />
                      {post.likes + (likedPosts.has(post.id) && !feedPosts.find((p) => p.id === post.id)?.liked ? 1 : 0)}
                    </motion.button>
                    <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-400 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="ml-auto text-gray-500 hover:text-white transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

function FriendsTab() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredFriends = friends.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <Card className={CARD_HOVER}>
        <CardContent className="pt-5">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button>
              <Plus className="w-4 h-4" /> Add Friend
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Online Friends */}
      <Card className={CARD_HOVER}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Online Now ({friends.filter((f) => f.online).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredFriends.filter((f) => f.online).map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <Avatar src={friend.avatar} fallback={friend.name} size="md" online />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{friend.name}</span>
                    <Badge variant="default" className="text-[10px]">Lv.{friend.level}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{friend.mutualWorkouts} mutual workouts</p>
                </div>
                <Button variant="ghost" size="sm">Invite</Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Friends */}
      <Card className={CARD_HOVER}>
        <CardHeader>
          <CardTitle className="text-base">All Friends ({friends.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredFriends.map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <Avatar src={friend.avatar} fallback={friend.name} size="md" online={friend.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{friend.name}</span>
                    <Badge variant="default" className="text-[10px]">Lv.{friend.level}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{friend.online ? 'Online' : friend.lastActive} · {friend.mutualWorkouts} mutual workouts</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ChallengesTab() {
  return (
    <div className="space-y-4">
      {challenges.map((challenge, i) => (
        <motion.div key={challenge.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={CARD_HOVER}>
            <CardContent className="pt-5">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{challenge.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white">{challenge.title}</h3>
                    {challenge.joined && <Badge variant="success" className="text-[10px]">Joined</Badge>}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{challenge.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Users className="w-3.5 h-3.5" />
                      {challenge.participants}/{challenge.maxParticipants}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Trophy className="w-3.5 h-3.5" />
                      {challenge.prize}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Target className="w-3.5 h-3.5" />
                      {challenge.daysLeft} days left
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={challenge.progress} color={challenge.progress >= 70 ? 'bg-green-500' : challenge.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'} />
                    <p className="text-[10px] text-gray-500 mt-1">{challenge.progress}% complete</p>
                  </div>
                </div>
                <Button variant={challenge.joined ? 'secondary' : 'default'} size="sm">
                  {challenge.joined ? 'View' : 'Join'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

function AchievementsTab() {
  const unlockedCount = achievementBadges.filter((b) => b.unlocked).length
  const totalCount = achievementBadges.length

  return (
    <div className="space-y-4">
      {/* Progress Summary */}
      <Card className={CARD_HOVER}>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Achievement Progress</h3>
              <p className="text-sm text-gray-400">{unlockedCount} of {totalCount} unlocked</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-purple-400">{Math.round((unlockedCount / totalCount) * 100)}%</span>
            </div>
          </div>
          <Progress value={unlockedCount} max={totalCount} showLabel />
        </CardContent>
      </Card>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {achievementBadges.map((badge, i) => {
          const rarity = rarityColors[badge.rarity]
          return (
            <motion.div key={badge.id} custom={i} variants={fadeInUp} initial="hidden" animate="visible">
              <Card className={cn(CARD_HOVER, !badge.unlocked && 'opacity-50')}>
                <CardContent className="pt-5">
                  <div className="text-center">
                    <div className={cn('w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl border', rarity.bg, rarity.border, !badge.unlocked && 'grayscale')}>
                      {badge.unlocked ? badge.icon : '🔒'}
                    </div>
                    <h4 className="text-sm font-medium text-white mt-3">{badge.name}</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{badge.description}</p>
                    <Badge variant={badge.rarity === 'legendary' ? 'premium' : badge.rarity === 'epic' ? 'default' : badge.rarity === 'rare' ? 'info' : 'success'} className="mt-2 text-[10px]">
                      {badge.rarity}
                    </Badge>
                    {badge.unlocked && badge.unlockedAt && (
                      <p className="text-[10px] text-gray-600 mt-1">Unlocked {badge.unlockedAt}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function SocialPage() {
  return (
    <AppLayout title="Social">
      <div className="max-w-[1000px] mx-auto">
        <Tabs defaultValue="feed">
          <TabTriggers>
            <TabTrigger value="feed" label="Feed" />
            <TabTrigger value="friends" label="Friends" />
            <TabTrigger value="challenges" label="Challenges" />
            <TabTrigger value="achievements" label="Achievements" />
          </TabTriggers>
          <TabContent value="feed"><FeedTab /></TabContent>
          <TabContent value="friends"><FriendsTab /></TabContent>
          <TabContent value="challenges"><ChallengesTab /></TabContent>
          <TabContent value="achievements"><AchievementsTab /></TabContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
