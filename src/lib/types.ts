export interface User {
  id: string
  name: string
  email: string
  avatar: string
  age: number
  gender: string
  height: number
  weight: number
  bodyFat?: number
  goal: string
  activityLevel: string
  medicalConditions: string[]
  dietPreference: string
  workoutExperience: string
  sportsPlayed: string[]
  sleepSchedule: string
  waterIntake: number
  targetWeight?: number
  targetCalories?: number
  createdAt: string
}

export interface Workout {
  id: string
  userId: string
  name: string
  type: string
  exercises: Exercise[]
  duration: number
  caloriesBurned: number
  date: string
  completed: boolean
}

export interface Exercise {
  id: string
  name: string
  sets: Set[]
  muscle: string
  equipment: string
  notes?: string
}

export interface Set {
  reps: number
  weight: number
  completed: boolean
}

export interface Meal {
  id: string
  userId: string
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foods: Food[]
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface Food {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  servingSize: string
  barcode?: string
}

export interface HealthMetric {
  id: string
  userId: string
  type: string
  value: number
  unit: string
  date: string
  time: string
}

export interface SportsActivity {
  id: string
  userId: string
  sport: string
  duration: number
  caloriesBurned: number
  distance?: number
  heartRate?: number
  date: string
  stats?: Record<string, string | number>
}

export interface BodyMeasurement {
  id: string
  userId: string
  weight: number
  bodyFat?: number
  muscleMass?: number
  waist?: number
  chest?: number
  arms?: number
  legs?: number
  date: string
}

export interface SleepRecord {
  id: string
  userId: string
  date: string
  bedTime: string
  wakeTime: string
  quality: number
  duration: number
}

export interface WaterIntake {
  id: string
  userId: string
  amount: number
  date: string
  time: string
}

export interface Reminder {
  id: string
  userId: string
  type: string
  time: string
  message: string
  active: boolean
  days: string[]
}

export interface Achievement {
  id: string
  userId: string
  name: string
  description: string
  icon: string
  unlockedAt: string
}

export interface AIChat {
  id: string
  userId: string
  messages: ChatMessage[]
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Report {
  id: string
  userId: string
  type: string
  dateRange: { start: string; end: string }
  data: Record<string, unknown>
  generatedAt: string
}

export interface WeeklyGoal {
  id: string
  userId: string
  type: string
  target: number
  current: number
  week: string
}

export interface Leaderboard {
  id: string
  userId: string
  username: string
  avatar: string
  xp: number
  level: number
  rank: number
}
