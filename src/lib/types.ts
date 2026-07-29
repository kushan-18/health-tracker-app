export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bodyFat: number;
  goal: string;
  activityLevel: string;
  medicalConditions: string[];
  dietPreference: string;
  workoutExperience: string;
  sportsPlayed: string[];
  sleepSchedule: string;
  waterIntake: number;
  targetWeight: number;
  targetCalories: number;
  createdAt: string;
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  duration?: number;
  setNumber?: number;
  isWarmup?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  muscle: string;
  icon?: string;
  weight?: number;
  reps?: number;
  duration?: number;
  restPeriod?: number;
  exercise?: Exercise;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  exercises: Exercise[];
  date: string;
  completed: boolean;
  notes: string;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  category: string;
  image?: string;
}

export interface Meal {
  id: string;
  type: string;
  foods: Food[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  timestamp: string;
}

export interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: string;
  notes: string;
  timestamp: string;
}

export interface SportsActivity {
  id: string;
  sport: string;
  duration: number;
  caloriesBurned: number;
  distance: number;
  heartRate: number;
  timestamp: string;
  notes: string;
  stats: Record<string, unknown>;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  waist: number;
  chest: number;
  arms: number;
  hips: number;
}

export interface SleepRecord {
  id: string;
  date: string;
  duration: number;
  quality: number;
  deepSleep: number;
  lightSleep: number;
  rem: number;
  awake: number;
  notes: string;
}

export interface WaterIntake {
  id: string;
  amount: number;
  timestamp: string;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  enabled: boolean;
  type: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: string;
  xpReward: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface AIChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  summary: string;
  metrics: Record<string, unknown>;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface Leaderboard {
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  rank: number;
}

export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Core';

export type WorkoutSet = Set;
export type WorkoutExercise = Exercise;
export type CompletedWorkout = Workout;
