import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  WeeklyGoal,
  Leaderboard,
  AIChat,
  ChatMessage,
} from "./types";
import { generateId } from "./utils";

interface VitalXStore {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  socialLogin: (provider: string, name: string, email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Workout
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  completeWorkout: (id: string) => void;

  // Nutrition
  meals: Meal[];
  waterIntake: WaterIntake[];
  addMeal: (meal: Meal) => void;
  addWater: (water: WaterIntake) => void;
  todayCalories: () => number;
  todayProtein: () => number;
  todayCarbs: () => number;
  todayFat: () => number;

  // Health
  metrics: HealthMetric[];
  addMetric: (metric: HealthMetric) => void;
  getMetricsByType: (type: string) => HealthMetric[];

  // Sports
  activities: SportsActivity[];
  addActivity: (activity: SportsActivity) => void;

  // Body
  measurements: BodyMeasurement[];
  addMeasurement: (measurement: BodyMeasurement) => void;

  // Sleep
  sleepRecords: SleepRecord[];
  addSleepRecord: (record: SleepRecord) => void;

  // UI
  theme: "dark" | "light";
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Gamification
  xp: number;
  level: number;
  coins: number;
  streaks: number;
  achievements: Achievement[];
  weeklyGoals: WeeklyGoal[];
  leaderboard: Leaderboard[];
  addXP: (amount: number) => void;

  // Chat
  conversations: AIChat[];
  activeConversation: string | null;
  addMessage: (conversationId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  createConversation: (title?: string) => string;
}

export const useStore = create<VitalXStore>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: async (email, _password) => {
        const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        set({
          user: {
            id: generateId(),
            name,
            email,
            avatar: "",
            age: 25,
            gender: "Male",
            height: 175,
            weight: 70,
            bodyFat: 18,
            goal: "Lose Weight",
            activityLevel: "Moderate",
            medicalConditions: [],
            dietPreference: "Vegetarian",
            workoutExperience: "Intermediate",
            sportsPlayed: [],
            sleepSchedule: "10:30 PM - 6:30 AM",
            waterIntake: 8,
            targetWeight: 68,
            targetCalories: 2200,
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
        });
        return true;
      },
      register: async (name, email, _password) => {
        set({
          user: {
            id: generateId(),
            name,
            email,
            avatar: "",
            age: 25,
            gender: "Male",
            height: 175,
            weight: 70,
            bodyFat: 18,
            goal: "Lose Weight",
            activityLevel: "Moderate",
            medicalConditions: [],
            dietPreference: "Vegetarian",
            workoutExperience: "Intermediate",
            sportsPlayed: [],
            sleepSchedule: "10:30 PM - 6:30 AM",
            waterIntake: 8,
            targetWeight: 68,
            targetCalories: 2200,
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
        });
        return true;
      },
      socialLogin: (provider, name, email) =>
        set({
          user: {
            id: generateId(),
            name,
            email,
            avatar: "",
            age: 25,
            gender: "male",
            height: 175,
            weight: 70,
            bodyFat: 18,
            goal: "maintain",
            activityLevel: "moderate",
            medicalConditions: [],
            dietPreference: "vegetarian",
            workoutExperience: "intermediate",
            sportsPlayed: [],
            sleepSchedule: "7-8 hours",
            waterIntake: 8,
            targetWeight: 70,
            targetCalories: 2000,
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      // Workout
      workouts: [],
      addWorkout: (workout) =>
        set((state) => ({ workouts: [workout, ...state.workouts] })),
      completeWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.map((w) =>
            w.id === id ? { ...w, completed: true } : w
          ),
        })),

      // Nutrition
      meals: [],
      waterIntake: [],
      addMeal: (meal) =>
        set((state) => ({ meals: [meal, ...state.meals] })),
      addWater: (water) =>
        set((state) => ({
          waterIntake: [water, ...state.waterIntake],
        })),
      todayCalories: () => {
        const today = new Date().toISOString().split("T")[0];
        return get()
          .meals.filter((m) => m.timestamp.startsWith(today))
          .reduce((sum, m) => sum + m.totalCalories, 0);
      },
      todayProtein: () => {
        const today = new Date().toISOString().split("T")[0];
        return get()
          .meals.filter((m) => m.timestamp.startsWith(today))
          .reduce((sum, m) => sum + m.totalProtein, 0);
      },
      todayCarbs: () => {
        const today = new Date().toISOString().split("T")[0];
        return get()
          .meals.filter((m) => m.timestamp.startsWith(today))
          .reduce((sum, m) => sum + m.totalCarbs, 0);
      },
      todayFat: () => {
        const today = new Date().toISOString().split("T")[0];
        return get()
          .meals.filter((m) => m.timestamp.startsWith(today))
          .reduce((sum, m) => sum + m.totalFat, 0);
      },

      // Health
      metrics: [],
      addMetric: (metric) =>
        set((state) => ({ metrics: [metric, ...state.metrics] })),
      getMetricsByType: (type) =>
        get().metrics.filter((m) => m.type === type),

      // Sports
      activities: [],
      addActivity: (activity) =>
        set((state) => ({
          activities: [activity, ...state.activities],
        })),

      // Body
      measurements: [],
      addMeasurement: (measurement) =>
        set((state) => ({
          measurements: [measurement, ...state.measurements],
        })),

      // Sleep
      sleepRecords: [],
      addSleepRecord: (record) =>
        set((state) => ({
          sleepRecords: [record, ...state.sleepRecords],
        })),

      // UI
      theme: "dark",
      sidebarOpen: true,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Gamification
      xp: 2450,
      level: 12,
      coins: 850,
      streaks: 7,
      achievements: [],
      weeklyGoals: [],
      leaderboard: [],
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const xpPerLevel = 500;
          const newLevel = Math.floor(newXP / xpPerLevel) + 1;
          return { xp: newXP, level: newLevel };
        }),

      // Chat
      conversations: [],
      activeConversation: null,
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    { ...message, id: generateId(), timestamp: new Date().toISOString() },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        })),
      createConversation: (title?: string) => {
        const id = generateId();
        const chat: AIChat = {
          id,
          title: title || "New Conversation",
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          conversations: [chat, ...state.conversations],
          activeConversation: id,
        }));
        return id;
      },
    }),
    {
      name: "vitalx-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        xp: state.xp,
        level: state.level,
        coins: state.coins,
        streaks: state.streaks,
        achievements: state.achievements,
        theme: state.theme,
      }),
    }
  )
);

const useAuthStore = useStore;
export { useAuthStore };
