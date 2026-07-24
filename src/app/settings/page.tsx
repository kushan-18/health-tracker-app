'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon, Moon, Sun, Bell, BellOff, Shield, Eye,
  User, Mail, Lock, Ruler, Scale, Download, Trash2, CreditCard,
  Crown, ChevronRight, Check, Globe, Smartphone, Volume2,
  MessageSquare, Heart, Dumbbell, Utensils, Calendar, Sparkles,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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

interface ToggleProps {
  enabled: boolean
  onChange: () => void
  label: string
  description?: string
  icon?: React.ReactNode
}

function Toggle({ enabled, onChange, label, description, icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {icon && <div className="text-gray-400">{icon}</div>}
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        onClick={onChange}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-300',
          enabled ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-white/10'
        )}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

function SettingsSection({ title, icon, children, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn(CARD_HOVER, className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="text-purple-400">{icon}</div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-white/5">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  const user = useStore((s) => s.user)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)

  const [notifications, setNotifications] = React.useState({
    push: true,
    email: false,
    workout: true,
    meals: true,
    water: true,
    sleep: false,
    social: true,
    achievements: true,
    aiInsights: true,
    reminders: true,
  })

  const [privacy, setPrivacy] = React.useState({
    profileVisible: true,
    activityVisible: true,
    showOnline: true,
    allowChallenges: true,
    dataSharing: false,
  })

  const [units, setUnits] = React.useState<'metric' | 'imperial'>('metric')

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <AppLayout title="Settings">
      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Premium Banner */}
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className="relative overflow-hidden border-yellow-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-amber-600/5 to-orange-600/10 pointer-events-none" />
            <CardContent className="pt-6 relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">VitalX AI Premium</h3>
                    <p className="text-sm text-gray-400">Unlock all features, AI coaching, and advanced analytics</p>
                  </div>
                </div>
                <Badge variant="premium" className="text-sm px-4 py-1.5">
                  Active — Renews Aug 15, 2025
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appearance */}
          <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
            <SettingsSection title="Appearance" icon={<Moon className="w-5 h-5" />}>
              <div className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-gray-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    <div>
                      <p className="text-sm font-medium text-white">Theme</p>
                      <p className="text-xs text-gray-500">Switch between dark and light mode</p>
                    </div>
                  </div>
                  <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                    <button
                      onClick={theme === 'light' ? toggleTheme : undefined}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', theme === 'dark' ? 'bg-purple-500/30 text-white' : 'text-gray-400 hover:text-white')}
                    >
                      <Moon className="w-3.5 h-3.5 inline mr-1" /> Dark
                    </button>
                    <button
                      onClick={theme === 'dark' ? toggleTheme : undefined}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', theme === 'light' ? 'bg-purple-500/30 text-white' : 'text-gray-400 hover:text-white')}
                    >
                      <Sun className="w-3.5 h-3.5 inline mr-1" /> Light
                    </button>
                  </div>
                </div>
              </div>
            </SettingsSection>
          </motion.div>

          {/* Units */}
          <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
            <SettingsSection title="Units" icon={<Ruler className="w-5 h-5" />}>
              <div className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Scale className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Measurement System</p>
                      <p className="text-xs text-gray-500">Choose your preferred units</p>
                    </div>
                  </div>
                  <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                    <button
                      onClick={() => setUnits('metric')}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', units === 'metric' ? 'bg-purple-500/30 text-white' : 'text-gray-400 hover:text-white')}
                    >
                      Metric
                    </button>
                    <button
                      onClick={() => setUnits('imperial')}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', units === 'imperial' ? 'bg-purple-500/30 text-white' : 'text-gray-400 hover:text-white')}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
              </div>
            </SettingsSection>
          </motion.div>

          {/* Notifications */}
          <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible" className="md:col-span-2">
            <SettingsSection title="Notifications" icon={<Bell className="w-5 h-5" />}>
              <Toggle
                enabled={notifications.push}
                onChange={() => toggleNotif('push')}
                label="Push Notifications"
                description="Receive notifications on your device"
                icon={<Smartphone className="w-4 h-4" />}
              />
              <Toggle
                enabled={notifications.email}
                onChange={() => toggleNotif('email')}
                label="Email Notifications"
                description="Get weekly reports via email"
                icon={<Mail className="w-4 h-4" />}
              />
              <Toggle
                enabled={notifications.workout}
                onChange={() => toggleNotif('workout')}
                label="Workout Reminders"
                description="Daily workout reminders at your preferred time"
                icon={<Dumbbell className="w-4 h-4" />}
              />
              <Toggle
                enabled={notifications.meals}
                onChange={() => toggleNotif('meals')}
                label="Meal Reminders"
                description="Log your meals on time"
                icon={<Utensils className="w-4 h-4" />}
              />
              <Toggle
                enabled={notifications.water}
                onChange={() => toggleNotif('water')}
                label="Hydration Alerts"
                description="Stay hydrated throughout the day"
                icon={<span className="text-lg">💧</span>}
              />
              <Toggle
                enabled={notifications.social}
                onChange={() => toggleNotif('social')}
                label="Social Updates"
                description="Friend activity and challenge updates"
                icon={<MessageSquare className="w-4 h-4" />}
              />
              <Toggle
                enabled={notifications.aiInsights}
                onChange={() => toggleNotif('aiInsights')}
                label="AI Insights"
                description="Personalized health recommendations"
                icon={<Sparkles className="w-4 h-4" />}
              />
            </SettingsSection>
          </motion.div>

          {/* Account */}
          <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible">
            <SettingsSection title="Account" icon={<User className="w-5 h-5" />}>
              <div className="py-3 space-y-3">
                <Input label="Full Name" defaultValue={user?.name} icon={<User className="w-4 h-4" />} />
                <Input label="Email" defaultValue={user?.email} type="email" icon={<Mail className="w-4 h-4" />} />
              </div>
              <div className="py-3 space-y-3">
                <p className="text-sm font-medium text-white">Change Password</p>
                <Input label="Current Password" type="password" icon={<Lock className="w-4 h-4" />} />
                <Input label="New Password" type="password" icon={<Lock className="w-4 h-4" />} />
                <Input label="Confirm Password" type="password" icon={<Lock className="w-4 h-4" />} />
              </div>
              <div className="pt-3">
                <Button>Save Changes</Button>
              </div>
            </SettingsSection>
          </motion.div>

          {/* Privacy */}
          <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible">
            <SettingsSection title="Privacy" icon={<Shield className="w-5 h-5" />}>
              <Toggle
                enabled={privacy.profileVisible}
                onChange={() => togglePrivacy('profileVisible')}
                label="Public Profile"
                description="Allow others to view your profile"
                icon={<Eye className="w-4 h-4" />}
              />
              <Toggle
                enabled={privacy.activityVisible}
                onChange={() => togglePrivacy('activityVisible')}
                label="Activity Visibility"
                description="Show your workouts and progress"
                icon={<Dumbbell className="w-4 h-4" />}
              />
              <Toggle
                enabled={privacy.showOnline}
                onChange={() => togglePrivacy('showOnline')}
                label="Online Status"
                description="Show when you're online"
                icon={<Globe className="w-4 h-4" />}
              />
              <Toggle
                enabled={privacy.allowChallenges}
                onChange={() => togglePrivacy('allowChallenges')}
                label="Allow Challenges"
                description="Let friends send you challenges"
                icon={<span className="text-lg">🏆</span>}
              />
              <Toggle
                enabled={privacy.dataSharing}
                onChange={() => togglePrivacy('dataSharing')}
                label="Anonymous Data Sharing"
                description="Help improve VitalX AI with usage data"
                icon={<Shield className="w-4 h-4" />}
              />
            </SettingsSection>
          </motion.div>

          {/* Data Management */}
          <motion.div custom={6} variants={fadeInUp} initial="hidden" animate="visible" className="md:col-span-2">
            <SettingsSection title="Data Management" icon={<Download className="w-5 h-5" />}>
              <div className="py-3">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Export Your Data</p>
                      <p className="text-xs text-gray-500">Download all your health data as JSON or CSV</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      <Download className="w-3.5 h-3.5" /> Export JSON
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </Button>
                  </div>
                </div>
              </div>
              <div className="py-3">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Delete Account</p>
                      <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-3.5 h-3.5" /> Delete Account
                  </Button>
                </div>
              </div>
            </SettingsSection>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
