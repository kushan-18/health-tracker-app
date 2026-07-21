import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  User,
  Workout,
  Meal,
  WaterIntake,
  HealthMetric,
  SportsActivity,
  BodyMeasurement,
  SleepRecord,
  Achievement,
  AIChat,
  ChatMessage,
  WeeklyGoal,
  Leaderboard,
} from './types'
import { dummyUser, dummyWorkouts, dummyMeals, dummyWaterIntake, dummyHealthMetrics, dummySportsActivities, dummyBodyMeasurements, dummySleepRecords, dummyAchievements, dummyConversations, dummyWeeklyGoals, dummyLeaderboard } from './data'

interface AuthSlice {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  register: (name: string, email: string) => void
  socialLogin: (provider: string) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

interface WorkoutSlice {
  workouts: Workout[]
  addWorkout: (workout: Workout) => void
  completeWorkout: (id: string) => void
}

interface NutritionSlice {
  meals: Meal[]
  waterIntake: WaterIntake[]
  addMeal: (meal: Meal) => void
  addWater: (water: WaterIntake) => void
}

interface HealthSlice {
  metrics: HealthMetric[]
  addMetric: (metric: HealthMetric) => void
  getMetricsByType: (type: string) => HealthMetric[]
}

interface SportsSlice {
  activities: SportsActivity[]
  addActivity: (activity: SportsActivity) => void
}

interface BodySlice {
  measurements: BodyMeasurement[]
  addMeasurement: (measurement: BodyMeasurement) => void
}

interface SleepSlice {
  records: SleepRecord[]
  addRecord: (record: SleepRecord) => void
}

interface UISlice {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  toggleTheme: () => void
  toggleSidebar: () => void
}

interface GamificationSlice {
  xp: number
  level: number
  coins: number
  streaks: number
  addXP: (amount: number) => void
}

interface ChatSlice {
  conversations: AIChat[]
  addMessage: (conversationId: string, message: ChatMessage) => void
  createConversation: (conversation: AIChat) => void
}

interface GamificationExtraSlice {
  achievements: Achievement[]
  weeklyGoals: WeeklyGoal[]
  leaderboard: Leaderboard[]
}

type StoreState = AuthSlice &
  WorkoutSlice &
  NutritionSlice &
  HealthSlice &
  SportsSlice &
  BodySlice &
  SleepSlice &
  UISlice &
  GamificationSlice &
  GamificationExtraSlice &
  ChatSlice

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      user: dummyUser,
      isAuthenticated: true,
      login: (user) => set({ user, isAuthenticated: true }),
      register: (name, email) => set({
        user: {
          ...dummyUser,
          id: 'user_' + Date.now(),
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          createdAt: new Date().toISOString(),
        },
        isAuthenticated: true,
      }),
      socialLogin: (provider) => set({
        user: {
          ...dummyUser,
          id: 'user_' + Date.now(),
          name: provider === 'google' ? 'Google User' : 'Apple User',
          email: provider === 'google' ? 'user@gmail.com' : 'user@icloud.com',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
          createdAt: new Date().toISOString(),
        },
        isAuthenticated: true,
      }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Workouts
      workouts: dummyWorkouts,
      addWorkout: (workout) =>
        set((state) => ({ workouts: [...state.workouts, workout] })),
      completeWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, completed: true } : w
          ),
        })),

      // Nutrition
      meals: dummyMeals,
      waterIntake: dummyWaterIntake,
      addMeal: (meal) =>
        set((state) => ({ meals: [...state.meals, meal] })),
      addWater: (water) =>
        set((state) => ({
          waterIntake: [...state.waterIntake, water],
        })),

      // Health
      metrics: dummyHealthMetrics,
      addMetric: (metric) =>
        set((state) => ({ metrics: [...state.metrics, metric] })),
      getMetricsByType: (type) => get().metrics.filter((m) => m.type === type),

      // Sports
      activities: dummySportsActivities,
      addActivity: (activity) =>
        set((state) => ({
          activities: [...state.activities, activity],
        })),

      // Body
      measurements: dummyBodyMeasurements,
      addMeasurement: (measurement) =>
        set((state) => ({
          measurements: [...state.measurements, measurement],
        })),

      // Sleep
      records: dummySleepRecords,
      addRecord: (record) =>
        set((state) => ({ records: [...state.records, record] })),

      // UI
      theme: 'dark',
      sidebarOpen: true,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Gamification
      xp: 4500,
      level: 12,
      coins: 320,
      streaks: 15,
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount
          const xpPerLevel = 500
          const newLevel = Math.floor(newXP / xpPerLevel) + 1
          return { xp: newXP, level: newLevel }
        }),

      // Gamification extras
      achievements: dummyAchievements,
      weeklyGoals: dummyWeeklyGoals,
      leaderboard: dummyLeaderboard,

      // Chat
      conversations: dummyConversations,
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, message] }
              : c
          ),
        })),
      createConversation: (conversation) =>
        set((state) => ({
          conversations: [...state.conversations, conversation],
        })),
    }),
    {
      name: 'vitalx-ai-store',
    }
  )
)
