'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabTriggers, TabTrigger, TabContent } from '@/components/ui/tabs'
import {
  Users, Utensils, Dumbbell, BarChart3, Search, Plus, Edit2, Trash2, Shield, TrendingUp, Activity, Flame, Eye, Ban
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }

const stats = [
  { label: 'Total Users', value: '12,847', icon: <Users className="w-5 h-5" />, change: { value: 8.2, positive: true } },
  { label: 'Active Today', value: '3,241', icon: <Activity className="w-5 h-5" />, change: { value: 3.1, positive: true } },
  { label: 'Workouts Today', value: '1,892', icon: <Dumbbell className="w-5 h-5" />, change: { value: 5.7, positive: true } },
  { label: 'Meals Logged', value: '5,673', icon: <Utensils className="w-5 h-5" />, change: { value: 2.4, positive: true } },
]

const usersData = [
  { name: 'Rahul Sharma', email: 'rahul.s@example.com', joined: 'Jan 15, 2025', status: 'Premium' },
  { name: 'Priya Patel', email: 'priya.p@example.com', joined: 'Feb 3, 2025', status: 'Active' },
  { name: 'Raj Kumar', email: 'raj.k@example.com', joined: 'Mar 12, 2025', status: 'Active' },
  { name: 'Neha Gupta', email: 'neha.g@example.com', joined: 'Mar 28, 2025', status: 'Inactive' },
  { name: 'Vikram Singh', email: 'vikram.s@example.com', joined: 'Apr 5, 2025', status: 'Premium' },
  { name: 'Anita Desai', email: 'anita.d@example.com', joined: 'Apr 18, 2025', status: 'Active' },
  { name: 'Surya Nair', email: 'surya.n@example.com', joined: 'May 1, 2025', status: 'Active' },
  { name: 'Karan Mehta', email: 'karan.m@example.com', joined: 'May 20, 2025', status: 'Inactive' },
]

const foodsData = [
  { name: 'Grilled Chicken Breast', category: 'Protein', calories: 231, protein: 43, carbs: 0, fat: 5 },
  { name: 'Brown Rice', category: 'Carbs', calories: 216, protein: 5, carbs: 45, fat: 2 },
  { name: 'Dal (Toor)', category: 'Protein', calories: 200, protein: 12, carbs: 30, fat: 3 },
  { name: 'Paneer Bhurji', category: 'Protein', calories: 260, protein: 18, carbs: 6, fat: 18 },
  { name: 'Roti (Wheat Chapati)', category: 'Carbs', calories: 120, protein: 3, carbs: 22, fat: 2 },
  { name: 'Oatmeal', category: 'Carbs', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: 'Banana', category: 'Fruit', calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: 'Almonds', category: 'Fats', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Whey Protein Shake', category: 'Supplement', calories: 130, protein: 25, carbs: 3, fat: 1 },
  { name: 'Green Salad', category: 'Vegetable', calories: 45, protein: 2, carbs: 8, fat: 0 },
]

const exercisesData = [
  { name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', difficulty: 'Intermediate' },
  { name: 'Squat', muscle: 'Quadriceps', equipment: 'Barbell', difficulty: 'Advanced' },
  { name: 'Deadlift', muscle: 'Back', equipment: 'Barbell', difficulty: 'Advanced' },
  { name: 'Pull Ups', muscle: 'Back', equipment: 'Bodyweight', difficulty: 'Intermediate' },
  { name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', difficulty: 'Intermediate' },
  { name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell', difficulty: 'Intermediate' },
  { name: 'Leg Press', muscle: 'Quadriceps', equipment: 'Machine', difficulty: 'Beginner' },
  { name: 'Dumbbell Curl', muscle: 'Biceps', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { name: 'Tricep Dips', muscle: 'Triceps', equipment: 'Bodyweight', difficulty: 'Intermediate' },
  { name: 'Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbells', difficulty: 'Beginner' },
]

const userGrowthData = [
  { month: 'Jan', users: 3200 }, { month: 'Feb', users: 4100 }, { month: 'Mar', users: 5200 },
  { month: 'Apr', users: 6400 }, { month: 'May', users: 7800 }, { month: 'Jun', users: 8900 },
  { month: 'Jul', users: 9500 }, { month: 'Aug', users: 10200 }, { month: 'Sep', users: 10800 },
  { month: 'Oct', users: 11400 }, { month: 'Nov', users: 12100 }, { month: 'Dec', users: 12847 },
]

const workoutsPerDayData = [
  { day: 'Mon', workouts: 2100 }, { day: 'Tue', workouts: 1850 }, { day: 'Wed', workouts: 2300 },
  { day: 'Thu', workouts: 1750 }, { day: 'Fri', workouts: 2400 }, { day: 'Sat', workouts: 2800 },
  { day: 'Sun', workouts: 1900 },
]

const popularExercisesData = [
  { name: 'Bench Press', count: 8400 }, { name: 'Squat', count: 7200 }, { name: 'Deadlift', count: 6800 },
  { name: 'Pull Ups', count: 5900 }, { name: 'OHP', count: 4500 },
]

const revenueData = [
  { month: 'Jan', revenue: 42000 }, { month: 'Feb', revenue: 51000 }, { month: 'Mar', revenue: 63000 },
  { month: 'Apr', revenue: 72000 }, { month: 'May', revenue: 85000 }, { month: 'Jun', revenue: 94000 },
  { month: 'Jul', revenue: 108000 }, { month: 'Aug', revenue: 115000 }, { month: 'Sep', revenue: 128000 },
  { month: 'Oct', revenue: 142000 }, { month: 'Nov', revenue: 158000 }, { month: 'Dec', revenue: 172000 },
]

const demographicsData = [
  { name: '18-24', value: 3200, color: '#a855f7' },
  { name: '25-34', value: 4800, color: '#6366f1' },
  { name: '35-44', value: 2800, color: '#3b82f6' },
  { name: '45-54', value: 1400, color: '#10b981' },
  { name: '55+', value: 647, color: '#f59e0b' },
]

const tooltipStyle = {
  contentStyle: { background: 'rgba(15,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' },
  itemStyle: { color: '#fff' },
}

export default function AdminPage() {
  const [userSearch, setUserSearch] = React.useState('')
  const [foodSearch, setFoodSearch] = React.useState('')
  const [foodCategory, setFoodCategory] = React.useState('All')

  const filteredUsers = usersData.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredFoods = foodsData.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(foodSearch.toLowerCase())
    const matchCat = foodCategory === 'All' || f.category === foodCategory
    return matchSearch && matchCat
  })

  const categories = ['All', ...new Set(foodsData.map(f => f.category))]

  return (
    <AppLayout title="Admin Panel">
      <div className="space-y-6">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" {...fadeIn}>
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} icon={s.icon} change={s.change} />
          ))}
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Tabs defaultValue="users">
            <TabTriggers>
              <TabTrigger value="users" label="Users" />
              <TabTrigger value="foods" label="Foods" />
              <TabTrigger value="exercises" label="Exercises" />
              <TabTrigger value="analytics" label="Analytics" />
            </TabTriggers>

            <TabContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      icon={<Search className="w-4 h-4" />}
                      className="w-64"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, i) => (
                          <motion.tr
                            key={i}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <td className="py-3 px-4 text-white font-medium">{u.name}</td>
                            <td className="py-3 px-4 text-gray-400">{u.email}</td>
                            <td className="py-3 px-4 text-gray-400">{u.joined}</td>
                            <td className="py-3 px-4">
                              <Badge variant={u.status === 'Premium' ? 'premium' : u.status === 'Active' ? 'success' : 'warning'}>
                                {u.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                                  <Ban className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabContent>

            <TabContent value="foods">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Food Database</CardTitle>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Search foods..."
                      value={foodSearch}
                      onChange={e => setFoodSearch(e.target.value)}
                      icon={<Search className="w-4 h-4" />}
                      className="w-48"
                    />
                    <select
                      value={foodCategory}
                      onChange={e => setFoodCategory(e.target.value)}
                      className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Button size="sm"><Plus className="w-4 h-4" /> Add Food</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                          <th className="text-right py-3 px-4 text-gray-400 font-medium">Calories</th>
                          <th className="text-right py-3 px-4 text-gray-400 font-medium">Protein</th>
                          <th className="text-right py-3 px-4 text-gray-400 font-medium">Carbs</th>
                          <th className="text-right py-3 px-4 text-gray-400 font-medium">Fat</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFoods.map((f, i) => (
                          <motion.tr
                            key={i}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <td className="py-3 px-4 text-white font-medium">{f.name}</td>
                            <td className="py-3 px-4"><Badge variant="info">{f.category}</Badge></td>
                            <td className="py-3 px-4 text-right text-gray-300">{f.calories}</td>
                            <td className="py-3 px-4 text-right text-green-400">{f.protein}g</td>
                            <td className="py-3 px-4 text-right text-blue-400">{f.carbs}g</td>
                            <td className="py-3 px-4 text-right text-amber-400">{f.fat}g</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabContent>

            <TabContent value="exercises">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Exercise Database</CardTitle>
                  <Button size="sm"><Plus className="w-4 h-4" /> Add Exercise</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Muscle Group</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Equipment</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Difficulty</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercisesData.map((ex, i) => (
                          <motion.tr
                            key={i}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <td className="py-3 px-4 text-white font-medium">{ex.name}</td>
                            <td className="py-3 px-4 text-gray-300">{ex.muscle}</td>
                            <td className="py-3 px-4"><Badge>{ex.equipment}</Badge></td>
                            <td className="py-3 px-4">
                              <Badge variant={ex.difficulty === 'Advanced' ? 'danger' : ex.difficulty === 'Intermediate' ? 'warning' : 'success'}>
                                {ex.difficulty}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabContent>

            <TabContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-400" /> User Growth</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={userGrowthData}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip {...tooltipStyle} />
                        <Area type="monotone" dataKey="users" stroke="#a855f7" fill="url(#colorUsers)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-400" /> Workouts Per Day</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={workoutsPerDayData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip {...tooltipStyle} />
                        <Bar dataKey="workouts" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Dumbbell className="w-5 h-5 text-blue-400" /> Popular Exercises</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={popularExercisesData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" stroke="#6b7280" fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={100} />
                        <Tooltip {...tooltipStyle} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-green-400" /> Revenue</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                        <Tooltip {...tooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#colorRevenue)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-amber-400" /> User Demographics</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie data={demographicsData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                            {demographicsData.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip {...tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-col gap-3 min-w-[160px]">
                        {demographicsData.map((d, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                            <span className="text-sm text-gray-300">{d.name}</span>
                            <span className="text-sm text-white font-medium ml-auto">{d.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  )
}
