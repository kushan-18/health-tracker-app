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
  WeeklyGoal,
  Leaderboard,
} from './types'

export const dummyUser: User = {
  id: 'user_001',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  age: 28,
  gender: 'male',
  height: 175,
  weight: 78,
  bodyFat: 18.5,
  goal: 'Build Muscle',
  activityLevel: 'active',
  medicalConditions: [],
  dietPreference: 'Non-Vegetarian',
  workoutExperience: 'Intermediate',
  sportsPlayed: ['Cricket', 'Football', 'Swimming'],
  sleepSchedule: '11:00 PM - 6:30 AM',
  waterIntake: 8,
  targetWeight: 82,
  targetCalories: 2800,
  createdAt: '2025-01-15T00:00:00Z',
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const dummyWorkouts: Workout[] = [
  // Today
  {
    id: 'wk_001',
    userId: 'user_001',
    name: 'Push Day',
    type: 'strength',
    exercises: [
      { id: 'ex_001', name: 'Bench Press', sets: [{ reps: 12, weight: 80, completed: true }, { reps: 10, weight: 85, completed: true }, { reps: 8, weight: 90, completed: true }, { reps: 6, weight: 95, completed: false }], muscle: 'Chest', equipment: 'Barbell' },
      { id: 'ex_002', name: 'Incline Dumbbell Press', sets: [{ reps: 12, weight: 30, completed: true }, { reps: 10, weight: 32, completed: true }, { reps: 10, weight: 32, completed: true }], muscle: 'Upper Chest', equipment: 'Dumbbells' },
      { id: 'ex_003', name: 'Overhead Press', sets: [{ reps: 10, weight: 50, completed: true }, { reps: 8, weight: 55, completed: true }, { reps: 8, weight: 55, completed: true }], muscle: 'Shoulders', equipment: 'Barbell' },
      { id: 'ex_004', name: 'Tricep Dips', sets: [{ reps: 15, weight: 0, completed: true }, { reps: 12, weight: 0, completed: true }, { reps: 10, weight: 10, completed: true }], muscle: 'Triceps', equipment: 'Bodyweight' },
    ],
    duration: 65,
    caloriesBurned: 520,
    date: daysAgo(0),
    completed: true,
  },
  {
    id: 'wk_002',
    userId: 'user_001',
    name: 'Morning Run',
    type: 'cardio',
    exercises: [],
    duration: 35,
    caloriesBurned: 380,
    date: daysAgo(0),
    completed: true,
  },
  // Yesterday
  {
    id: 'wk_003',
    userId: 'user_001',
    name: 'Pull Day',
    type: 'strength',
    exercises: [
      { id: 'ex_005', name: 'Deadlift', sets: [{ reps: 8, weight: 120, completed: true }, { reps: 6, weight: 130, completed: true }, { reps: 5, weight: 140, completed: true }], muscle: 'Back', equipment: 'Barbell' },
      { id: 'ex_006', name: 'Barbell Row', sets: [{ reps: 12, weight: 70, completed: true }, { reps: 10, weight: 75, completed: true }, { reps: 10, weight: 75, completed: true }], muscle: 'Back', equipment: 'Barbell' },
      { id: 'ex_007', name: 'Face Pulls', sets: [{ reps: 15, weight: 20, completed: true }, { reps: 15, weight: 20, completed: true }], muscle: 'Rear Delt', equipment: 'Cable' },
      { id: 'ex_008', name: 'Barbell Curl', sets: [{ reps: 12, weight: 30, completed: true }, { reps: 10, weight: 35, completed: true }, { reps: 8, weight: 35, completed: false }], muscle: 'Biceps', equipment: 'Barbell' },
    ],
    duration: 70,
    caloriesBurned: 580,
    date: daysAgo(1),
    completed: true,
  },
  {
    id: 'wk_004',
    userId: 'user_001',
    name: 'Yoga Session',
    type: 'flexibility',
    exercises: [],
    duration: 45,
    caloriesBurned: 180,
    date: daysAgo(1),
    completed: true,
  },
  // 2 days ago
  {
    id: 'wk_005',
    userId: 'user_001',
    name: 'Leg Day',
    type: 'strength',
    exercises: [
      { id: 'ex_009', name: 'Squat', sets: [{ reps: 10, weight: 100, completed: true }, { reps: 8, weight: 110, completed: true }, { reps: 6, weight: 120, completed: true }], muscle: 'Quads', equipment: 'Barbell' },
      { id: 'ex_010', name: 'Romanian Deadlift', sets: [{ reps: 12, weight: 80, completed: true }, { reps: 10, weight: 90, completed: true }], muscle: 'Hamstrings', equipment: 'Barbell' },
      { id: 'ex_011', name: 'Leg Press', sets: [{ reps: 15, weight: 160, completed: true }, { reps: 12, weight: 180, completed: true }, { reps: 10, weight: 200, completed: true }], muscle: 'Quads', equipment: 'Machine' },
      { id: 'ex_012', name: 'Calf Raises', sets: [{ reps: 20, weight: 60, completed: true }, { reps: 15, weight: 70, completed: true }], muscle: 'Calves', equipment: 'Machine' },
    ],
    duration: 75,
    caloriesBurned: 650,
    date: daysAgo(2),
    completed: true,
  },
  // 3 days ago
  {
    id: 'wk_006',
    userId: 'user_001',
    name: 'Push Day',
    type: 'strength',
    exercises: [
      { id: 'ex_013', name: 'Bench Press', sets: [{ reps: 12, weight: 77, completed: true }, { reps: 10, weight: 82, completed: true }, { reps: 8, weight: 87, completed: true }], muscle: 'Chest', equipment: 'Barbell' },
      { id: 'ex_014', name: 'Lateral Raise', sets: [{ reps: 15, weight: 12, completed: true }, { reps: 12, weight: 14, completed: true }, { reps: 12, weight: 14, completed: true }], muscle: 'Shoulders', equipment: 'Dumbbells' },
    ],
    duration: 55,
    caloriesBurned: 440,
    date: daysAgo(3),
    completed: true,
  },
  {
    id: 'wk_007',
    userId: 'user_001',
    name: 'Cricket Practice',
    type: 'sports',
    exercises: [],
    duration: 90,
    caloriesBurned: 600,
    date: daysAgo(3),
    completed: true,
  },
  // 4 days ago
  {
    id: 'wk_008',
    userId: 'user_001',
    name: 'Pull Day',
    type: 'strength',
    exercises: [
      { id: 'ex_015', name: 'Pull Ups', sets: [{ reps: 12, weight: 0, completed: true }, { reps: 10, weight: 5, completed: true }, { reps: 8, weight: 10, completed: true }], muscle: 'Back', equipment: 'Bodyweight' },
      { id: 'ex_016', name: 'Seated Cable Row', sets: [{ reps: 12, weight: 60, completed: true }, { reps: 10, weight: 65, completed: true }], muscle: 'Back', equipment: 'Cable' },
    ],
    duration: 60,
    caloriesBurned: 480,
    date: daysAgo(4),
    completed: true,
  },
  // 5 days ago
  {
    id: 'wk_009',
    userId: 'user_001',
    name: 'Leg Day',
    type: 'strength',
    exercises: [
      { id: 'ex_017', name: 'Squat', sets: [{ reps: 10, weight: 95, completed: true }, { reps: 8, weight: 105, completed: true }, { reps: 6, weight: 115, completed: true }], muscle: 'Quads', equipment: 'Barbell' },
    ],
    duration: 65,
    caloriesBurned: 550,
    date: daysAgo(5),
    completed: true,
  },
  {
    id: 'wk_010',
    userId: 'user_001',
    name: 'Evening Cycling',
    type: 'cardio',
    exercises: [],
    duration: 40,
    caloriesBurned: 350,
    date: daysAgo(5),
    completed: true,
  },
  // 6 days ago
  {
    id: 'wk_011',
    userId: 'user_001',
    name: 'Upper Body',
    type: 'strength',
    exercises: [
      { id: 'ex_018', name: 'Bench Press', sets: [{ reps: 12, weight: 75, completed: true }, { reps: 10, weight: 80, completed: true }], muscle: 'Chest', equipment: 'Barbell' },
      { id: 'ex_019', name: 'Dumbbell Curl', sets: [{ reps: 12, weight: 14, completed: true }, { reps: 10, weight: 16, completed: true }], muscle: 'Biceps', equipment: 'Dumbbells' },
    ],
    duration: 50,
    caloriesBurned: 400,
    date: daysAgo(6),
    completed: true,
  },
]

const foodDatabase = {
  oatmeal: { id: 'f_001', name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, servingSize: '1 cup' },
  eggs: { id: 'f_002', name: 'Boiled Eggs (2)', calories: 156, protein: 13, carbs: 1, fat: 11, fiber: 0, servingSize: '2 eggs' },
  banana: { id: 'f_003', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, servingSize: '1 medium' },
  roti: { id: 'f_004', name: 'Roti (Wheat Chapati)', calories: 120, protein: 3, carbs: 22, fat: 2, fiber: 3, servingSize: '1 piece' },
  dal: { id: 'f_005', name: 'Dal (Toor)', calories: 200, protein: 12, carbs: 30, fat: 3, fiber: 8, servingSize: '1 bowl' },
  rice: { id: 'f_006', name: 'White Rice', calories: 206, protein: 4, carbs: 45, fat: 0, fiber: 1, servingSize: '1 cup cooked' },
  chicken: { id: 'f_007', name: 'Grilled Chicken Breast', calories: 231, protein: 43, carbs: 0, fat: 5, fiber: 0, servingSize: '150g' },
  paneer: { id: 'f_008', name: 'Paneer Bhurji', calories: 260, protein: 18, carbs: 6, fat: 18, fiber: 1, servingSize: '1 bowl' },
  curd: { id: 'f_009', name: 'Curd / Yogurt', calories: 100, protein: 6, carbs: 8, fat: 4, fiber: 0, servingSize: '1 cup' },
  almonds: { id: 'f_010', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 4, servingSize: '28g (23 nuts)' },
  whey: { id: 'f_011', name: 'Whey Protein Shake', calories: 130, protein: 25, carbs: 3, fat: 1, fiber: 0, servingSize: '1 scoop' },
  bread: { id: 'f_012', name: 'Brown Bread', calories: 138, protein: 5, carbs: 24, fat: 2, fiber: 3, servingSize: '2 slices' },
  peanut_butter: { id: 'f_013', name: 'Peanut Butter', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2, servingSize: '2 tbsp' },
  milk: { id: 'f_014', name: 'Whole Milk', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, servingSize: '1 glass' },
  sambar: { id: 'f_015', name: 'Sambar', calories: 180, protein: 8, carbs: 24, fat: 5, fiber: 6, servingSize: '1 bowl' },
  salad: { id: 'f_016', name: 'Green Salad', calories: 45, protein: 2, carbs: 8, fat: 0, fiber: 3, servingSize: '1 plate' },
  fruits: { id: 'f_017', name: 'Mixed Fruits', calories: 120, protein: 2, carbs: 28, fat: 0, fiber: 5, servingSize: '1 plate' },
  chicken_curry: { id: 'f_018', name: 'Chicken Curry', calories: 280, protein: 35, carbs: 8, fat: 12, fiber: 2, servingSize: '1 bowl' },
  fish: { id: 'f_019', name: 'Grilled Fish', calories: 200, protein: 34, carbs: 0, fat: 7, fiber: 0, servingSize: '150g' },
  soup: { id: 'f_020', name: 'Tomato Soup', calories: 80, protein: 3, carbs: 14, fat: 2, fiber: 2, servingSize: '1 bowl' },
}

export const dummyMeals: Meal[] = Array.from({ length: 14 }, (_, i) => {
  const dayOffset = 13 - i
  const date = daysAgo(dayOffset)
  return [
    {
      id: `meal_breakfast_${dayOffset}`,
      userId: 'user_001',
      name: 'Breakfast',
      type: 'breakfast' as const,
      foods: [foodDatabase.oatmeal, foodDatabase.eggs, foodDatabase.banana],
      date,
      totalCalories: 411,
      totalProtein: 19,
      totalCarbs: 55,
      totalFat: 14,
    },
    {
      id: `meal_lunch_${dayOffset}`,
      userId: 'user_001',
      name: 'Lunch',
      type: 'lunch' as const,
      foods: [foodDatabase.rice, foodDatabase.dal, foodDatabase.chicken, foodDatabase.salad, foodDatabase.curd],
      date,
      totalCalories: 837,
      totalProtein: 64,
      totalCarbs: 83,
      totalFat: 12,
    },
    {
      id: `meal_dinner_${dayOffset}`,
      userId: 'user_001',
      name: 'Dinner',
      type: 'dinner' as const,
      foods: [foodDatabase.roti, foodDatabase.paneer, foodDatabase.sambar, foodDatabase.salad],
      date,
      totalCalories: 605,
      totalProtein: 31,
      totalCarbs: 60,
      totalFat: 21,
    },
    {
      id: `meal_snack_${dayOffset}`,
      userId: 'user_001',
      name: 'Snack',
      type: 'snack' as const,
      foods: [foodDatabase.whey, foodDatabase.almonds, foodDatabase.banana],
      date,
      totalCalories: 399,
      totalProtein: 32,
      totalCarbs: 40,
      totalFat: 15,
    },
  ]
}).flat()

export const dummyWaterIntake: WaterIntake[] = Array.from({ length: 14 }, (_, i) => {
  const dayOffset = 13 - i
  const date = daysAgo(dayOffset)
  return Array.from({ length: 8 }, (_, j) => ({
    id: `water_${dayOffset}_${j}`,
    userId: 'user_001',
    amount: 250 + Math.floor(Math.random() * 100),
    date,
    time: `${7 + j * 2}:${j % 2 === 0 ? '00' : '30'}`,
  }))
}).flat()

const healthTypes = [
  { type: 'heart_rate', unit: 'bpm', min: 62, max: 88 },
  { type: 'blood_pressure_systolic', unit: 'mmHg', min: 115, max: 130 },
  { type: 'blood_pressure_diastolic', unit: 'mmHg', min: 75, max: 85 },
  { type: 'blood_sugar', unit: 'mg/dL', min: 85, max: 110 },
  { type: 'spo2', unit: '%', min: 96, max: 99 },
  { type: 'body_temperature', unit: '°F', min: 97.5, max: 98.6 },
]

export const dummyHealthMetrics: HealthMetric[] = Array.from({ length: 30 }, (_, dayIdx) => {
  const date = daysAgo(29 - dayIdx)
  return healthTypes.map((ht) => ({
    id: `hm_${dayIdx}_${ht.type}`,
    userId: 'user_001',
    type: ht.type,
    value: ht.min + Math.round(Math.random() * (ht.max - ht.min)),
    unit: ht.unit,
    date,
    time: '08:00',
  }))
}).flat()

export const dummySportsActivities: SportsActivity[] = [
  { id: 'sa_001', userId: 'user_001', sport: 'Cricket', duration: 120, caloriesBurned: 720, distance: 5, heartRate: 142, date: daysAgo(3), stats: { runs: 45, wickets: 2, overs: 4 } },
  { id: 'sa_002', userId: 'user_001', sport: 'Running', duration: 35, caloriesBurned: 380, distance: 5.2, heartRate: 155, date: daysAgo(0), stats: { pace: '6:44', splits: '33:48' } },
  { id: 'sa_003', userId: 'user_001', sport: 'Football', duration: 90, caloriesBurned: 680, distance: 8, heartRate: 160, date: daysAgo(5), stats: { goals: 1, assists: 2, passes: 45 } },
  { id: 'sa_004', userId: 'user_001', sport: 'Cycling', duration: 45, caloriesBurned: 420, distance: 18, heartRate: 138, date: daysAgo(7), stats: { avgSpeed: '24 km/h', maxSpeed: '35 km/h', elevation: '120m' } },
  { id: 'sa_005', userId: 'user_001', sport: 'Swimming', duration: 40, caloriesBurned: 350, distance: 1.5, heartRate: 145, date: daysAgo(10), stats: { laps: 30, style: 'Freestyle', strokeRate: '28/min' } },
]

export const dummyBodyMeasurements: BodyMeasurement[] = Array.from({ length: 30 }, (_, i) => {
  const dayOffset = 29 - i
  const progressFactor = 1 - dayOffset / 30
  return {
    id: `bm_${i}`,
    userId: 'user_001',
    weight: 78 - progressFactor * 0.5,
    bodyFat: 18.5 - progressFactor * 0.3,
    muscleMass: 35 + progressFactor * 0.4,
    waist: 82 - progressFactor * 0.5,
    chest: 98 + progressFactor * 0.3,
    arms: 35 + progressFactor * 0.2,
    legs: 56 + progressFactor * 0.1,
    date: daysAgo(dayOffset),
  }
})

export const dummySleepRecords: SleepRecord[] = Array.from({ length: 14 }, (_, i) => {
  const dayOffset = 13 - i
  const hours = 6.5 + Math.random() * 2
  return {
    id: `sr_${i}`,
    userId: 'user_001',
    date: daysAgo(dayOffset),
    bedTime: `23:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`,
    wakeTime: `06:${Math.floor(Math.random() * 30).toString().padStart(2, '0')}`,
    quality: 7 + Math.floor(Math.random() * 3),
    duration: Math.round(hours * 10) / 10,
  }
})

export const dummyAchievements: Achievement[] = [
  { id: 'ach_001', userId: 'user_001', name: 'First Workout', description: 'Complete your first workout', icon: '🏋️', unlockedAt: '2025-01-16T00:00:00Z' },
  { id: 'ach_002', userId: 'user_001', name: 'Week Warrior', description: 'Work out 7 days in a row', icon: '🔥', unlockedAt: '2025-01-22T00:00:00Z' },
  { id: 'ach_003', userId: 'user_001', name: 'Hydration Hero', description: 'Log water intake for 14 days', icon: '💧', unlockedAt: '2025-02-01T00:00:00Z' },
  { id: 'ach_004', userId: 'user_001', name: 'Protein Pro', description: 'Hit your protein target for 7 days', icon: '🥩', unlockedAt: '2025-02-05T00:00:00Z' },
  { id: 'ach_005', userId: 'user_001', name: 'Early Bird', description: 'Complete a workout before 7 AM', icon: '🌅', unlockedAt: '2025-02-08T00:00:00Z' },
  { id: 'ach_006', userId: 'user_001', name: 'Iron Pumper', description: 'Bench press your bodyweight', icon: '💪', unlockedAt: '2025-02-12T00:00:00Z' },
  { id: 'ach_007', userId: 'user_001', name: 'Marathon Runner', description: 'Run a total of 50 km', icon: '🏃', unlockedAt: '2025-02-15T00:00:00Z' },
  { id: 'ach_008', userId: 'user_001', name: 'Sleep Master', description: 'Get 8+ hours of sleep for 7 days', icon: '😴', unlockedAt: '2025-02-18T00:00:00Z' },
  { id: 'ach_009', userId: 'user_001', name: 'Nutrition Guru', description: 'Track all meals for 14 days', icon: '🥗', unlockedAt: '2025-02-20T00:00:00Z' },
  { id: 'ach_010', userId: 'user_001', name: 'Level 12', description: 'Reach Level 12', icon: '⭐', unlockedAt: '2025-02-22T00:00:00Z' },
]

export const dummyConversations: AIChat[] = [
  {
    id: 'conv_001',
    userId: 'user_001',
    createdAt: daysAgo(1),
    messages: [
      {
        id: 'msg_001',
        role: 'user',
        content: 'What should I eat post-workout for muscle recovery?',
        timestamp: '2025-07-19T18:30:00Z',
      },
      {
        id: 'msg_002',
        role: 'assistant',
        content: "For optimal post-workout recovery, I recommend consuming a combination of protein and carbohydrates within 30-60 minutes after your workout. Based on your profile:\n\n**Protein (30-40g):**\n- Whey protein shake with milk (25g protein)\n- 2-3 boiled eggs (13-19g protein)\n- Grilled chicken breast (43g protein per 150g)\n\n**Carbs (40-60g):**\n- 1 banana + 1 cup oats\n- Brown bread with peanut butter\n- Rice with dal\n\n**Your ideal post-workout meal:**\n1 whey protein shake + 1 banana + 2 tbsp peanut butter on brown bread = ~400 cal, 35g protein, 45g carbs.\n\nThis ratio of roughly 1:1 protein to carbs will maximize muscle protein synthesis and replenish glycogen stores. Stay hydrated with at least 500ml water!",
        timestamp: '2025-07-19T18:30:05Z',
      },
      {
        id: 'msg_003',
        role: 'user',
        content: 'How is my progress this week?',
        timestamp: '2025-07-20T09:00:00Z',
      },
      {
        id: 'msg_004',
        role: 'assistant',
        content: "Here's your weekly progress summary:\n\n**Workouts:** 6 sessions completed (target: 5) ✅\n- Total volume increased by 8% compared to last week\n- You hit a new PR on bench press: 95kg!\n\n**Nutrition:**\n- Average daily calories: 2,252 / 2,800 target\n- Average protein: 146g / 160g target\n- You're slightly under on calories — consider adding a post-workout shake\n\n**Body Metrics:**\n- Weight: 78kg (stable)\n- Body fat: 18.5% → estimated 18.2%\n\n**Sleep:** Average 7.3 hours, quality score 8/10\n\n**Overall:** Great week! You're making consistent progress. Focus on hitting your calorie target and keep the protein intake high. You're on track for your muscle-building goal! 💪",
        timestamp: '2025-07-20T09:00:05Z',
      },
    ],
  },
]

export const dummyWeeklyGoals: WeeklyGoal[] = [
  { id: 'wg_001', userId: 'user_001', type: 'Workouts', target: 5, current: 6, week: 'Jul 14 - Jul 20' },
  { id: 'wg_002', userId: 'user_001', type: 'Calories Burned', target: 3000, current: 3350, week: 'Jul 14 - Jul 20' },
  { id: 'wg_003', userId: 'user_001', type: 'Water Intake (L)', target: 56, current: 48, week: 'Jul 14 - Jul 20' },
  { id: 'wg_004', userId: 'user_001', type: 'Protein (g)', target: 1120, current: 1022, week: 'Jul 14 - Jul 20' },
  { id: 'wg_005', userId: 'user_001', type: 'Sleep (hrs)', target: 56, current: 51.1, week: 'Jul 14 - Jul 20' },
]

export const dummyLeaderboard: Leaderboard[] = [
  { id: 'lb_001', userId: 'user_002', username: 'FitQueen99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', xp: 6200, level: 15, rank: 1 },
  { id: 'lb_002', userId: 'user_003', username: 'GymBro_Raj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj', xp: 5800, level: 14, rank: 2 },
  { id: 'lb_003', userId: 'user_001', username: 'RahulSharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', xp: 4500, level: 12, rank: 3 },
  { id: 'lb_004', userId: 'user_004', username: 'RunnerVikram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', xp: 4200, level: 11, rank: 4 },
  { id: 'lb_005', userId: 'user_005', username: 'YogaWithNeha', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha', xp: 3900, level: 11, rank: 5 },
  { id: 'lb_006', userId: 'user_006', username: 'CricketKing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Virat', xp: 3600, level: 10, rank: 6 },
  { id: 'lb_007', userId: 'user_007', username: 'HealthyAnita', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita', xp: 3200, level: 9, rank: 7 },
  { id: 'lb_008', userId: 'user_008', username: 'IronMan_Surya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Surya', xp: 2800, level: 8, rank: 8 },
  { id: 'lb_009', userId: 'user_009', username: 'SwimStar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera', xp: 2400, level: 7, rank: 9 },
  { id: 'lb_010', userId: 'user_010', username: 'BeginnerKaran', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan', xp: 1800, level: 5, rank: 10 },
]

export const dummyReminders = [
  { id: 'rem_001', userId: 'user_001', type: 'water', time: '08:00', message: 'Time to hydrate! Drink a glass of water.', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { id: 'rem_002', userId: 'user_001', type: 'workout', time: '06:30', message: 'Morning workout time! Let\'s crush it.', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  { id: 'rem_003', userId: 'user_001', type: 'supplement', time: '08:30', message: 'Take your creatine & multivitamin.', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { id: 'rem_004', userId: 'user_001', type: 'sleep', time: '22:30', message: 'Wind down & prepare for sleep.', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { id: 'rem_005', userId: 'user_001', type: 'meal', time: '13:00', message: 'Lunch time! Don\'t skip your protein.', active: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
]
