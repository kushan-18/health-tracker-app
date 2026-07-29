import type {
  User,
  Workout,
  Meal,
  BodyMeasurement,
  SleepRecord,
  WaterIntake,
  HealthMetric,
  SportsActivity,
  Achievement,
  AIChat,
  ChatMessage,
  WeeklyGoal,
  Leaderboard,
  Food,
  Exercise,
} from "./types";
import { generateId } from "./utils";

export const currentUser: User = {
  id: "usr_rahul_001",
  name: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  avatar: "",
  age: 28,
  gender: "Male",
  height: 175,
  weight: 74.5,
  bodyFat: 18.5,
  goal: "Lose Weight",
  activityLevel: "Moderate",
  medicalConditions: ["Mild Lactose Intolerance"],
  dietPreference: "Vegetarian",
  workoutExperience: "Intermediate",
  sportsPlayed: ["Cricket", "Badminton"],
  sleepSchedule: "10:30 PM - 6:30 AM",
  waterIntake: 8,
  targetWeight: 68,
  targetCalories: 2200,
  createdAt: "2025-01-15T10:00:00.000Z",
};

const exerciseLibrary: Record<string, Exercise[]> = {
  pushDay: [
    {
      id: generateId(),
      name: "Barbell Bench Press",
      sets: [
        { id: generateId(), reps: 12, weight: 60, completed: true },
        { id: generateId(), reps: 10, weight: 70, completed: true },
        { id: generateId(), reps: 8, weight: 80, completed: true },
        { id: generateId(), reps: 6, weight: 85, completed: true },
      ],
      muscle: "Chest",
      restPeriod: 90,
    },
    {
      id: generateId(),
      name: "Incline Dumbbell Press",
      sets: [
        { id: generateId(), reps: 12, weight: 24, completed: true },
        { id: generateId(), reps: 10, weight: 28, completed: true },
        { id: generateId(), reps: 8, weight: 30, completed: true },
      ],
      muscle: "Upper Chest",
      restPeriod: 75,
    },
    {
      id: generateId(),
      name: "Overhead Press",
      sets: [
        { id: generateId(), reps: 12, weight: 30, completed: true },
        { id: generateId(), reps: 10, weight: 35, completed: true },
        { id: generateId(), reps: 8, weight: 40, completed: true },
      ],
      muscle: "Shoulders",
      restPeriod: 75,
    },
    {
      id: generateId(),
      name: "Tricep Dips",
      sets: [
        { id: generateId(), reps: 15, weight: 0, completed: true },
        { id: generateId(), reps: 12, weight: 0, completed: true },
        { id: generateId(), reps: 10, weight: 0, completed: true },
      ],
      muscle: "Triceps",
      restPeriod: 60,
    },
  ],
  pullDay: [
    {
      id: generateId(),
      name: "Deadlift",
      sets: [
        { id: generateId(), reps: 10, weight: 80, completed: true },
        { id: generateId(), reps: 8, weight: 100, completed: true },
        { id: generateId(), reps: 6, weight: 120, completed: true },
      ],
      muscle: "Back",
      restPeriod: 120,
    },
    {
      id: generateId(),
      name: "Pull-Ups",
      sets: [
        { id: generateId(), reps: 10, weight: 0, completed: true },
        { id: generateId(), reps: 8, weight: 0, completed: true },
        { id: generateId(), reps: 6, weight: 0, completed: true },
      ],
      muscle: "Lats",
      restPeriod: 90,
    },
    {
      id: generateId(),
      name: "Barbell Rows",
      sets: [
        { id: generateId(), reps: 12, weight: 50, completed: true },
        { id: generateId(), reps: 10, weight: 60, completed: true },
        { id: generateId(), reps: 8, weight: 65, completed: true },
      ],
      muscle: "Mid Back",
      restPeriod: 75,
    },
    {
      id: generateId(),
      name: "Barbell Curls",
      sets: [
        { id: generateId(), reps: 12, weight: 20, completed: true },
        { id: generateId(), reps: 10, weight: 25, completed: true },
        { id: generateId(), reps: 8, weight: 27, completed: true },
      ],
      muscle: "Biceps",
      restPeriod: 60,
    },
  ],
  legDay: [
    {
      id: generateId(),
      name: "Barbell Squat",
      sets: [
        { id: generateId(), reps: 12, weight: 60, completed: true },
        { id: generateId(), reps: 10, weight: 80, completed: true },
        { id: generateId(), reps: 8, weight: 100, completed: true },
        { id: generateId(), reps: 6, weight: 110, completed: true },
      ],
      muscle: "Quadriceps",
      restPeriod: 120,
    },
    {
      id: generateId(),
      name: "Romanian Deadlift",
      sets: [
        { id: generateId(), reps: 12, weight: 60, completed: true },
        { id: generateId(), reps: 10, weight: 70, completed: true },
        { id: generateId(), reps: 8, weight: 80, completed: true },
      ],
      muscle: "Hamstrings",
      restPeriod: 90,
    },
    {
      id: generateId(),
      name: "Leg Press",
      sets: [
        { id: generateId(), reps: 15, weight: 120, completed: true },
        { id: generateId(), reps: 12, weight: 140, completed: true },
        { id: generateId(), reps: 10, weight: 160, completed: true },
      ],
      muscle: "Quadriceps",
      restPeriod: 90,
    },
    {
      id: generateId(),
      name: "Calf Raises",
      sets: [
        { id: generateId(), reps: 20, weight: 40, completed: true },
        { id: generateId(), reps: 15, weight: 50, completed: true },
        { id: generateId(), reps: 15, weight: 50, completed: true },
      ],
      muscle: "Calves",
      restPeriod: 60,
    },
  ],
  coreDay: [
    {
      id: generateId(),
      name: "Hanging Leg Raises",
      sets: [
        { id: generateId(), reps: 15, weight: 0, completed: true },
        { id: generateId(), reps: 12, weight: 0, completed: true },
        { id: generateId(), reps: 10, weight: 0, completed: true },
      ],
      muscle: "Lower Abs",
      restPeriod: 45,
    },
    {
      id: generateId(),
      name: "Cable Crunches",
      sets: [
        { id: generateId(), reps: 15, weight: 25, completed: true },
        { id: generateId(), reps: 12, weight: 30, completed: true },
        { id: generateId(), reps: 10, weight: 35, completed: true },
      ],
      muscle: "Upper Abs",
      restPeriod: 45,
    },
    {
      id: generateId(),
      name: "Russian Twists",
      sets: [
        { id: generateId(), reps: 20, weight: 8, completed: true },
        { id: generateId(), reps: 20, weight: 8, completed: true },
        { id: generateId(), reps: 20, weight: 8, completed: true },
      ],
      muscle: "Obliques",
      restPeriod: 30,
    },
    {
      id: generateId(),
      name: "Plank Hold",
      sets: [
        { id: generateId(), reps: 1, weight: 0, completed: true, duration: 60 },
        { id: generateId(), reps: 1, weight: 0, completed: true, duration: 45 },
        { id: generateId(), reps: 1, weight: 0, completed: true, duration: 30 },
      ],
      muscle: "Core",
      restPeriod: 30,
    },
  ],
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const workouts: Workout[] = [
  {
    id: generateId(),
    name: "Push Day - Chest & Shoulders",
    type: "Strength",
    duration: 65,
    caloriesBurned: 420,
    exercises: exerciseLibrary.pushDay,
    date: daysAgo(0),
    completed: true,
    notes: "Felt strong today. Increased bench press weight.",
  },
  {
    id: generateId(),
    name: "Pull Day - Back & Biceps",
    type: "Strength",
    duration: 60,
    caloriesBurned: 380,
    exercises: exerciseLibrary.pullDay,
    date: daysAgo(1),
    completed: true,
    notes: "Good deadlift session. PR on 120kg.",
  },
  {
    id: generateId(),
    name: "Leg Day - Quads & Hamstrings",
    type: "Strength",
    duration: 70,
    caloriesBurned: 510,
    exercises: exerciseLibrary.legDay,
    date: daysAgo(2),
    completed: true,
    notes: "Squats were challenging but completed all sets.",
  },
  {
    id: generateId(),
    name: "Core & Abs",
    type: "Strength",
    duration: 40,
    caloriesBurned: 250,
    exercises: exerciseLibrary.coreDay,
    date: daysAgo(3),
    completed: true,
    notes: "Great core session.",
  },
  {
    id: generateId(),
    name: "Morning Cardio",
    type: "Cardio",
    duration: 45,
    caloriesBurned: 380,
    exercises: [
      {
        id: generateId(),
        name: "Treadmill Running",
        sets: [
          { id: generateId(), reps: 1, weight: 0, completed: true, duration: 30 },
        ],
        muscle: "Full Body",
        duration: 30,
      },
      {
        id: generateId(),
        name: "Jump Rope",
        sets: [
          { id: generateId(), reps: 1, weight: 0, completed: true, duration: 15 },
        ],
        muscle: "Full Body",
        duration: 15,
      },
    ],
    date: daysAgo(4),
    completed: true,
    notes: "5K run in 28 minutes.",
  },
  {
    id: generateId(),
    name: "Push Day - Shoulders Focus",
    type: "Strength",
    duration: 55,
    caloriesBurned: 350,
    exercises: exerciseLibrary.pushDay,
    date: daysAgo(5),
    completed: true,
    notes: "Shoulder focused workout.",
  },
  {
    id: generateId(),
    name: "Full Body HIIT",
    type: "HIIT",
    duration: 30,
    caloriesBurned: 400,
    exercises: [
      {
        id: generateId(),
        name: "Burpees",
        sets: [
          { id: generateId(), reps: 15, weight: 0, completed: true },
          { id: generateId(), reps: 12, weight: 0, completed: true },
          { id: generateId(), reps: 10, weight: 0, completed: true },
        ],
        muscle: "Full Body",
      },
      {
        id: generateId(),
        name: "Mountain Climbers",
        sets: [
          { id: generateId(), reps: 20, weight: 0, completed: true },
          { id: generateId(), reps: 20, weight: 0, completed: true },
          { id: generateId(), reps: 15, weight: 0, completed: true },
        ],
        muscle: "Full Body",
      },
      {
        id: generateId(),
        name: "Box Jumps",
        sets: [
          { id: generateId(), reps: 12, weight: 0, completed: true },
          { id: generateId(), reps: 10, weight: 0, completed: true },
          { id: generateId(), reps: 10, weight: 0, completed: true },
        ],
        muscle: "Legs",
      },
    ],
    date: daysAgo(6),
    completed: true,
    notes: "Intense HIIT session. Great calorie burn.",
  },
];

export const foodsDatabase: Food[] = [
  { id: generateId(), name: "Dal Tadka", calories: 210, protein: 12, carbs: 28, fat: 6, serving: "1 bowl (250g)", category: "Indian" },
  { id: generateId(), name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 2, serving: "1 cup cooked", category: "Grains" },
  { id: generateId(), name: "Roti (Whole Wheat)", calories: 120, protein: 4, carbs: 22, fat: 3, serving: "1 medium", category: "Indian" },
  { id: generateId(), name: "Paneer Bhurji", calories: 280, protein: 18, carbs: 8, fat: 20, serving: "1 cup", category: "Indian" },
  { id: generateId(), name: "Idli", calories: 130, protein: 4, carbs: 26, fat: 1, serving: "2 pieces", category: "South Indian" },
  { id: generateId(), name: "Sambar", calories: 150, protein: 8, carbs: 20, fat: 4, serving: "1 bowl", category: "South Indian" },
  { id: generateId(), name: "Curd Rice", calories: 180, protein: 6, carbs: 30, fat: 4, serving: "1 bowl", category: "South Indian" },
  { id: generateId(), name: "Chicken Tikka", calories: 250, protein: 28, carbs: 4, fat: 14, serving: "4 pieces", category: "Indian" },
  { id: generateId(), name: "Palak Paneer", calories: 220, protein: 14, carbs: 10, fat: 16, serving: "1 cup", category: "Indian" },
  { id: generateId(), name: "Aloo Gobi", calories: 160, protein: 4, carbs: 22, fat: 7, serving: "1 cup", category: "Indian" },
  { id: generateId(), name: "Chole", calories: 240, protein: 12, carbs: 32, fat: 8, serving: "1 cup", category: "Indian" },
  { id: generateId(), name: "Rajma", calories: 230, protein: 10, carbs: 34, fat: 5, serving: "1 cup", category: "Indian" },
  { id: generateId(), name: "Butter Chicken", calories: 350, protein: 24, carbs: 12, fat: 24, serving: "1 cup", category: "Indian" },
  { id: generateId(), name: "Egg Omelette", calories: 150, protein: 12, carbs: 2, fat: 10, serving: "2 eggs", category: "Breakfast" },
  { id: generateId(), name: "Oats Porridge", calories: 180, protein: 6, carbs: 32, fat: 4, serving: "1 bowl", category: "Breakfast" },
  { id: generateId(), name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0, serving: "1 medium", category: "Fruits" },
  { id: generateId(), name: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0, serving: "1 medium", category: "Fruits" },
  { id: generateId(), name: "Almonds", calories: 165, protein: 6, carbs: 6, fat: 14, serving: "20 pieces", category: "Nuts" },
  { id: generateId(), name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0, serving: "170g", category: "Dairy" },
  { id: generateId(), name: "Milk (Toned)", calories: 90, protein: 6, carbs: 12, fat: 2, serving: "200ml", category: "Dairy" },
  { id: generateId(), name: "Poha", calories: 180, protein: 4, carbs: 32, fat: 5, serving: "1 plate", category: "Indian" },
  { id: generateId(), name: "Upma", calories: 190, protein: 5, carbs: 30, fat: 6, serving: "1 plate", category: "South Indian" },
  { id: generateId(), name: "Dosha (Masala)", calories: 220, protein: 6, carbs: 32, fat: 8, serving: "1 large", category: "South Indian" },
  { id: generateId(), name: "Biryani (Veg)", calories: 300, protein: 8, carbs: 48, fat: 10, serving: "1 plate", category: "Indian" },
  { id: generateId(), name: "Fish Curry", calories: 260, protein: 22, carbs: 8, fat: 16, serving: "1 cup", category: "Indian" },
  { id: generateId(), name: "Sprouts Salad", calories: 120, protein: 8, carbs: 18, fat: 2, serving: "1 bowl", category: "Healthy" },
  { id: generateId(), name: "Sweet Potato", calories: 112, protein: 2, carbs: 26, fat: 0, serving: "1 medium", category: "Vegetables" },
  { id: generateId(), name: "Broccoli", calories: 55, protein: 4, carbs: 11, fat: 0, serving: "1 cup", category: "Vegetables" },
  { id: generateId(), name: "Avocado", calories: 240, protein: 3, carbs: 12, fat: 22, serving: "1 whole", category: "Fruits" },
  { id: generateId(), name: "Protein Shake", calories: 120, protein: 24, carbs: 3, fat: 1, serving: "1 scoop + water", category: "Supplements" },
  { id: generateId(), name: "Lassi (Sweet)", calories: 180, protein: 6, carbs: 30, fat: 4, serving: "1 glass", category: "Indian" },
  { id: generateId(), name: "Masala Chai", calories: 60, protein: 1, carbs: 10, fat: 2, serving: "1 cup", category: "Beverages" },
];

function makeMeal(
  type: string,
  foods: { name: string; grams: number }[],
  timestamp: string
): Meal {
  const resolvedFoods = foods.map((f) => {
    const db = foodsDatabase.find((d) => d.name === f.name) || foodsDatabase[0];
    const ratio = f.grams / 100;
    return {
      ...db,
      id: generateId(),
      calories: Math.round(db.calories * ratio),
      protein: Math.round(db.protein * ratio),
      carbs: Math.round(db.carbs * ratio),
      fat: Math.round(db.fat * ratio),
    };
  });
  return {
    id: generateId(),
    type,
    foods: resolvedFoods,
    totalCalories: resolvedFoods.reduce((s, f) => s + f.calories, 0),
    totalProtein: resolvedFoods.reduce((s, f) => s + f.protein, 0),
    totalCarbs: resolvedFoods.reduce((s, f) => s + f.carbs, 0),
    totalFat: resolvedFoods.reduce((s, f) => s + f.fat, 0),
    timestamp,
  };
}

export const meals: Meal[] = [
  makeMeal("Breakfast", [{ name: "Oats Porridge", grams: 150 }, { name: "Banana", grams: 120 }, { name: "Almonds", grams: 30 }], daysAgo(0)),
  makeMeal("Lunch", [{ name: "Brown Rice", grams: 200 }, { name: "Dal Tadka", grams: 250 }, { name: "Palak Paneer", grams: 150 }], daysAgo(0)),
  makeMeal("Snack", [{ name: "Greek Yogurt", grams: 170 }, { name: "Apple", grams: 180 }], daysAgo(0)),
  makeMeal("Dinner", [{ name: "Roti (Whole Wheat)", grams: 100 }, { name: "Aloo Gobi", grams: 200 }, { name: "Curd Rice", grams: 150 }], daysAgo(0)),
  makeMeal("Breakfast", [{ name: "Idli", grams: 100 }, { name: "Sambar", grams: 200 }], daysAgo(1)),
  makeMeal("Lunch", [{ name: "Chole", grams: 200 }, { name: "Roti (Whole Wheat)", grams: 100 }, { name: "Sprouts Salad", grams: 100 }], daysAgo(1)),
  makeMeal("Dinner", [{ name: "Paneer Bhurji", grams: 200 }, { name: "Brown Rice", grams: 180 }], daysAgo(1)),
  makeMeal("Breakfast", [{ name: "Poha", grams: 200 }, { name: "Masala Chai", grams: 200 }], daysAgo(2)),
  makeMeal("Lunch", [{ name: "Rajma", grams: 200 }, { name: "Brown Rice", grams: 200 }, { name: "Curd Rice", grams: 100 }], daysAgo(2)),
  makeMeal("Dinner", [{ name: "Roti (Whole Wheat)", grams: 100 }, { name: "Fish Curry", grams: 200 }], daysAgo(2)),
  makeMeal("Breakfast", [{ name: "Egg Omelette", grams: 100 }, { name: "Poha", grams: 150 }], daysAgo(3)),
  makeMeal("Lunch", [{ name: "Biryani (Veg)", grams: 250 }, { name: "Raita", grams: 100 }], daysAgo(3)),
  makeMeal("Dinner", [{ name: "Dal Tadka", grams: 250 }, { name: "Roti (Whole Wheat)", grams: 100 }], daysAgo(3)),
  makeMeal("Breakfast", [{ name: "Upma", grams: 200 }, { name: "Banana", grams: 120 }], daysAgo(4)),
  makeMeal("Lunch", [{ name: "Butter Chicken", grams: 200 }, { name: "Brown Rice", grams: 200 }], daysAgo(4)),
  makeMeal("Dinner", [{ name: "Dosha (Masala)", grams: 200 }, { name: "Sambar", grams: 150 }], daysAgo(4)),
  makeMeal("Breakfast", [{ name: "Oats Porridge", grams: 150 }, { name: "Almonds", grams: 30 }], daysAgo(5)),
  makeMeal("Lunch", [{ name: "Chicken Tikka", grams: 200 }, { name: "Roti (Whole Wheat)", grams: 100 }], daysAgo(5)),
  makeMeal("Dinner", [{ name: "Aloo Gobi", grams: 200 }, { name: "Brown Rice", grams: 180 }], daysAgo(5)),
  makeMeal("Breakfast", [{ name: "Idli", grams: 100 }, { name: "Sambar", grams: 200 }, { name: "Curd Rice", grams: 100 }], daysAgo(6)),
  makeMeal("Lunch", [{ name: "Palak Paneer", grams: 200 }, { name: "Brown Rice", grams: 200 }], daysAgo(6)),
  makeMeal("Dinner", [{ name: "Sprouts Salad", grams: 150 }, { name: "Protein Shake", grams: 100 }], daysAgo(6)),
  makeMeal("Breakfast", [{ name: "Masala Chai", grams: 200 }, { name: "Poha", grams: 200 }], daysAgo(7)),
  makeMeal("Lunch", [{ name: "Rajma", grams: 200 }, { name: "Roti (Whole Wheat)", grams: 100 }], daysAgo(7)),
  makeMeal("Dinner", [{ name: "Fish Curry", grams: 200 }, { name: "Brown Rice", grams: 200 }], daysAgo(7)),
  makeMeal("Breakfast", [{ name: "Egg Omelette", grams: 100 }, { name: "Apple", grams: 180 }], daysAgo(8)),
  makeMeal("Lunch", [{ name: "Chole", grams: 200 }, { name: "Brown Rice", grams: 200 }], daysAgo(8)),
  makeMeal("Dinner", [{ name: "Paneer Bhurji", grams: 200 }, { name: "Roti (Whole Wheat)", grams: 100 }], daysAgo(8)),
  makeMeal("Breakfast", [{ name: "Upma", grams: 200 }, { name: "Banana", grams: 120 }], daysAgo(9)),
  makeMeal("Lunch", [{ name: "Butter Chicken", grams: 200 }, { name: "Brown Rice", grams: 200 }], daysAgo(9)),
  makeMeal("Dinner", [{ name: "Dal Tadka", grams: 250 }, { name: "Brown Rice", grams: 200 }], daysAgo(9)),
  makeMeal("Breakfast", [{ name: "Oats Porridge", grams: 150 }, { name: "Almonds", grams: 30 }], daysAgo(10)),
  makeMeal("Lunch", [{ name: "Biryani (Veg)", grams: 250 }], daysAgo(10)),
  makeMeal("Dinner", [{ name: "Roti (Whole Wheat)", grams: 100 }, { name: "Aloo Gobi", grams: 200 }], daysAgo(10)),
  makeMeal("Breakfast", [{ name: "Idli", grams: 100 }, { name: "Sambar", grams: 200 }], daysAgo(11)),
  makeMeal("Lunch", [{ name: "Chicken Tikka", grams: 200 }, { name: "Roti (Whole Wheat)", grams: 100 }], daysAgo(11)),
  makeMeal("Dinner", [{ name: "Sprouts Salad", grams: 150 }], daysAgo(11)),
  makeMeal("Breakfast", [{ name: "Poha", grams: 200 }, { name: "Masala Chai", grams: 200 }], daysAgo(12)),
  makeMeal("Lunch", [{ name: "Rajma", grams: 200 }, { name: "Brown Rice", grams: 200 }], daysAgo(12)),
  makeMeal("Dinner", [{ name: "Fish Curry", grams: 200 }, { name: "Brown Rice", grams: 200 }], daysAgo(12)),
  makeMeal("Breakfast", [{ name: "Egg Omelette", grams: 100 }, { name: "Banana", grams: 120 }], daysAgo(13)),
  makeMeal("Lunch", [{ name: "Dosha (Masala)", grams: 200 }, { name: "Sambar", grams: 150 }], daysAgo(13)),
  makeMeal("Dinner", [{ name: "Palak Paneer", grams: 200 }, { name: "Roti (Whole Wheat)", grams: 100 }], daysAgo(13)),
];

function genMeasurements(): BodyMeasurement[] {
  const result: BodyMeasurement[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      id: generateId(),
      date: d.toISOString(),
      weight: 76 - i * 0.08 + Math.random() * 0.3,
      bodyFat: 19 - i * 0.03 + Math.random() * 0.2,
      muscleMass: 32 + i * 0.02 + Math.random() * 0.1,
      waist: 82 - i * 0.1 + Math.random() * 0.2,
      chest: 96 + Math.random() * 0.3,
      arms: 34 + Math.random() * 0.2,
      hips: 94 - i * 0.05 + Math.random() * 0.2,
    });
  }
  return result;
}

export const bodyMeasurements: BodyMeasurement[] = genMeasurements();

function genSleepRecords(): SleepRecord[] {
  const result: SleepRecord[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const total = 6.5 + Math.random() * 2;
    const deep = total * (0.15 + Math.random() * 0.1);
    const rem = total * (0.2 + Math.random() * 0.05);
    const awake = 0.3 + Math.random() * 0.5;
    const light = total - deep - rem - awake;
    result.push({
      id: generateId(),
      date: d.toISOString(),
      duration: Number(total.toFixed(1)),
      quality: Math.round(60 + Math.random() * 35),
      deepSleep: Number(deep.toFixed(1)),
      lightSleep: Number(light.toFixed(1)),
      rem: Number(rem.toFixed(1)),
      awake: Number(awake.toFixed(1)),
      notes: "",
    });
  }
  return result;
}

export const sleepRecords: SleepRecord[] = genSleepRecords();

function genWaterIntake(): WaterIntake[] {
  const result: WaterIntake[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    for (let j = 0; j < 6 + Math.floor(Math.random() * 3); j++) {
      const t = new Date(d);
      t.setHours(7 + j * 2 + Math.floor(Math.random() * 2));
      result.push({
        id: generateId(),
        amount: 250 + Math.floor(Math.random() * 1) * 250,
        timestamp: t.toISOString(),
      });
    }
  }
  return result;
}

export const waterIntakeData: WaterIntake[] = genWaterIntake();

export const healthMetrics: HealthMetric[] = [
  { id: generateId(), type: "Blood Pressure", value: 120, unit: "mmHg", date: daysAgo(0), notes: "Systolic: 120, Diastolic: 80", timestamp: daysAgo(0) },
  { id: generateId(), type: "Blood Pressure", value: 118, unit: "mmHg", date: daysAgo(3), notes: "Systolic: 118, Diastolic: 78", timestamp: daysAgo(3) },
  { id: generateId(), type: "Blood Pressure", value: 122, unit: "mmHg", date: daysAgo(7), notes: "Systolic: 122, Diastolic: 82", timestamp: daysAgo(7) },
  { id: generateId(), type: "Blood Sugar", value: 95, unit: "mg/dL", date: daysAgo(0), notes: "Fasting glucose", timestamp: daysAgo(0) },
  { id: generateId(), type: "Blood Sugar", value: 110, unit: "mg/dL", date: daysAgo(2), notes: "Post-meal", timestamp: daysAgo(2) },
  { id: generateId(), type: "Heart Rate", value: 72, unit: "bpm", date: daysAgo(0), notes: "Resting", timestamp: daysAgo(0) },
  { id: generateId(), type: "Heart Rate", value: 68, unit: "bpm", date: daysAgo(1), notes: "Resting", timestamp: daysAgo(1) },
  { id: generateId(), type: "Heart Rate", value: 75, unit: "bpm", date: daysAgo(3), notes: "Morning", timestamp: daysAgo(3) },
  { id: generateId(), type: "Weight", value: 74.5, unit: "kg", date: daysAgo(0), notes: "", timestamp: daysAgo(0) },
  { id: generateId(), type: "Weight", value: 74.8, unit: "kg", date: daysAgo(7), notes: "", timestamp: daysAgo(7) },
  { id: generateId(), type: "Temperature", value: 98.4, unit: "F", date: daysAgo(0), notes: "Normal", timestamp: daysAgo(0) },
  { id: generateId(), type: "Oxygen Saturation", value: 98, unit: "%", date: daysAgo(0), notes: "", timestamp: daysAgo(0) },
  { id: generateId(), type: "Body Fat", value: 18.5, unit: "%", date: daysAgo(0), notes: "Measured via caliper", timestamp: daysAgo(0) },
];

export const sportsActivities: SportsActivity[] = [
  {
    id: generateId(),
    sport: "Cricket",
    duration: 120,
    caloriesBurned: 650,
    distance: 0,
    heartRate: 145,
    timestamp: daysAgo(1),
    notes: "2-hour practice session at the club ground.",
    stats: { runs: 42, fours: 5, twos: 3, overs_bowled: 0 },
  },
  {
    id: generateId(),
    sport: "Badminton",
    duration: 60,
    caloriesBurned: 380,
    distance: 0,
    heartRate: 155,
    timestamp: daysAgo(3),
    notes: "Singles match. Won 2-1.",
    stats: { sets_won: 2, sets_lost: 1, smash_count: 18 },
  },
  {
    id: generateId(),
    sport: "Running",
    duration: 35,
    caloriesBurned: 350,
    distance: 5.2,
    heartRate: 160,
    timestamp: daysAgo(4),
    notes: "Morning run around the park.",
    stats: { pace: "6:44", split_1km: "6:50", split_5km: "33:40" },
  },
  {
    id: generateId(),
    sport: "Cycling",
    duration: 45,
    caloriesBurned: 300,
    distance: 15,
    heartRate: 138,
    timestamp: daysAgo(6),
    notes: "Evening ride to the lake and back.",
    stats: { avg_speed: "20 km/h", max_speed: "32 km/h", elevation: "85m" },
  },
  {
    id: generateId(),
    sport: "Swimming",
    duration: 40,
    caloriesBurned: 400,
    distance: 1.5,
    heartRate: 142,
    timestamp: daysAgo(8),
    notes: "Pool session - freestyle and backstroke.",
    stats: { laps: 30, stroke_type: "Freestyle", pool_length: "25m" },
  },
];

export const achievements: Achievement[] = [
  { id: generateId(), title: "First Workout", description: "Complete your first workout", icon: "🏋️", unlockedAt: daysAgo(30), category: "Fitness", xpReward: 100 },
  { id: generateId(), title: "7-Day Streak", description: "Work out 7 days in a row", icon: "🔥", unlockedAt: daysAgo(20), category: "Consistency", xpReward: 250 },
  { id: generateId(), title: "Calorie Crusher", description: "Burn 2000 calories in a week", icon: "💪", unlockedAt: daysAgo(15), category: "Fitness", xpReward: 200 },
  { id: generateId(), title: "Hydration Hero", description: "Drink 8 glasses of water daily for a week", icon: "💧", unlockedAt: daysAgo(12), category: "Health", xpReward: 150 },
  { id: generateId(), title: "Early Bird", description: "Complete a workout before 7 AM", icon: "🌅", unlockedAt: daysAgo(10), category: "Habit", xpReward: 100 },
  { id: generateId(), title: "Protein Pro", description: "Hit protein target 5 days in a row", icon: "🥩", unlockedAt: daysAgo(8), category: "Nutrition", xpReward: 200 },
  { id: generateId(), title: "Step Master", description: "Walk 10,000 steps in a day", icon: "👟", unlockedAt: daysAgo(6), category: "Fitness", xpReward: 150 },
  { id: generateId(), title: "Sleep Champion", description: "Get 8+ hours of sleep for 3 nights", icon: "😴", unlockedAt: daysAgo(4), category: "Health", xpReward: 100 },
  { id: generateId(), title: "Meal Prep Master", description: "Log all meals for 7 days", icon: "🍎", unlockedAt: daysAgo(2), category: "Nutrition", xpReward: 200 },
  { id: generateId(), title: "Level Up!", description: "Reach Level 10", icon: "⭐", unlockedAt: daysAgo(1), category: "Achievement", xpReward: 500 },
];

const chatMessages: ChatMessage[] = [
  {
    id: generateId(),
    content: "Hi! I'm your AI Health Coach. How can I help you today?",
    role: "assistant",
    timestamp: daysAgo(2),
  },
  {
    id: generateId(),
    content: "I want to lose 5 kg in the next 2 months. What should I do?",
    role: "user",
    timestamp: daysAgo(2),
  },
  {
    id: generateId(),
    content:
      "Great goal, Rahul! Based on your profile, here's my recommendation:\n\n1. **Calorie Deficit**: Aim for 2000-2200 calories/day (your maintenance is ~2500)\n2. **Protein**: Keep protein high at 1.6g/kg bodyweight (~120g/day) to preserve muscle\n3. **Workout**: 4-5 strength sessions + 2-3 cardio sessions per week\n4. **Sleep**: Aim for 7-8 hours consistently\n\nYour current progress shows a downward trend in weight which is excellent. Keep it up!",
    role: "assistant",
    timestamp: daysAgo(2),
  },
  {
    id: generateId(),
    content: "Should I cut carbs or fats?",
    role: "user",
    timestamp: daysAgo(1),
  },
  {
    id: generateId(),
    content:
      "For Indian vegetarian diet, I'd suggest:\n\n- **Don't cut carbs too aggressively** - they fuel your workouts\n- Focus on **complex carbs**: roti, brown rice, oats, poha\n- **Moderate fats**: Use ghee sparingly, add nuts for healthy fats\n- **Reduce**: Fried foods, excessive oil, sugar\n\nA balanced approach works best for sustainable fat loss.",
    role: "assistant",
    timestamp: daysAgo(1),
  },
];

export const aiConversations: AIChat[] = [
  {
    id: generateId(),
    title: "Weight Loss Plan",
    messages: chatMessages,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
];

export const weeklyGoals: WeeklyGoal[] = [
  { id: generateId(), title: "Workout Sessions", target: 5, current: 4, unit: "sessions", completed: false },
  { id: generateId(), title: "Calories Burned", target: 2000, current: 1640, unit: "kcal", completed: false },
  { id: generateId(), title: "Water Intake", target: 56, current: 48, unit: "glasses", completed: false },
  { id: generateId(), title: "Protein Target", target: 7, current: 5, unit: "days", completed: false },
  { id: generateId(), title: "Sleep Goal", target: 7, current: 6, unit: "days (7h+)", completed: false },
  { id: generateId(), title: "Steps", target: 70000, current: 58200, unit: "steps", completed: false },
];

export const leaderboardData: Leaderboard[] = [
  { id: generateId(), name: "Rahul Sharma", avatar: "", score: 2450, level: 12, rank: 1 },
  { id: generateId(), name: "Priya Patel", avatar: "", score: 2320, level: 11, rank: 2 },
  { id: generateId(), name: "Arjun Singh", avatar: "", score: 2180, level: 11, rank: 3 },
  { id: generateId(), name: "Sneha Reddy", avatar: "", score: 2050, level: 10, rank: 4 },
  { id: generateId(), name: "Vikram Kumar", avatar: "", score: 1980, level: 10, rank: 5 },
  { id: generateId(), name: "Ananya Gupta", avatar: "", score: 1870, level: 9, rank: 6 },
  { id: generateId(), name: "Rohan Mehta", avatar: "", score: 1750, level: 9, rank: 7 },
  { id: generateId(), name: "Kavya Nair", avatar: "", score: 1620, level: 8, rank: 8 },
  { id: generateId(), name: "Aditya Joshi", avatar: "", score: 1500, level: 8, rank: 9 },
  { id: generateId(), name: "Divya Iyer", avatar: "", score: 1380, level: 7, rank: 10 },
];

export const exerciseLibraryData: Exercise[] = [
  { id: generateId(), name: "Barbell Bench Press", sets: [], muscle: "Chest", icon: "dumbbell" },
  { id: generateId(), name: "Incline Dumbbell Press", sets: [], muscle: "Upper Chest", icon: "dumbbell" },
  { id: generateId(), name: "Decline Bench Press", sets: [], muscle: "Lower Chest", icon: "dumbbell" },
  { id: generateId(), name: "Cable Flyes", sets: [], muscle: "Chest", icon: "dumbbell" },
  { id: generateId(), name: "Push-Ups", sets: [], muscle: "Chest", icon: "dumbbell" },
  { id: generateId(), name: "Barbell Squat", sets: [], muscle: "Quadriceps", icon: "dumbbell" },
  { id: generateId(), name: "Leg Press", sets: [], muscle: "Quadriceps", icon: "dumbbell" },
  { id: generateId(), name: "Romanian Deadlift", sets: [], muscle: "Hamstrings", icon: "dumbbell" },
  { id: generateId(), name: "Leg Curls", sets: [], muscle: "Hamstrings", icon: "dumbbell" },
  { id: generateId(), name: "Calf Raises", sets: [], muscle: "Calves", icon: "dumbbell" },
  { id: generateId(), name: "Deadlift", sets: [], muscle: "Back", icon: "dumbbell" },
  { id: generateId(), name: "Pull-Ups", sets: [], muscle: "Lats", icon: "dumbbell" },
  { id: generateId(), name: "Barbell Rows", sets: [], muscle: "Mid Back", icon: "dumbbell" },
  { id: generateId(), name: "Lat Pulldown", sets: [], muscle: "Lats", icon: "dumbbell" },
  { id: generateId(), name: "Seated Cable Row", sets: [], muscle: "Mid Back", icon: "dumbbell" },
  { id: generateId(), name: "Overhead Press", sets: [], muscle: "Shoulders", icon: "dumbbell" },
  { id: generateId(), name: "Lateral Raises", sets: [], muscle: "Side Delts", icon: "dumbbell" },
  { id: generateId(), name: "Front Raises", sets: [], muscle: "Front Delts", icon: "dumbbell" },
  { id: generateId(), name: "Barbell Curls", sets: [], muscle: "Biceps", icon: "dumbbell" },
  { id: generateId(), name: "Hammer Curls", sets: [], muscle: "Biceps", icon: "dumbbell" },
  { id: generateId(), name: "Tricep Pushdowns", sets: [], muscle: "Triceps", icon: "dumbbell" },
  { id: generateId(), name: "Skull Crushers", sets: [], muscle: "Triceps", icon: "dumbbell" },
  { id: generateId(), name: "Hanging Leg Raises", sets: [], muscle: "Lower Abs", icon: "dumbbell" },
  { id: generateId(), name: "Plank", sets: [], muscle: "Core", icon: "dumbbell" },
  { id: generateId(), name: "Russian Twists", sets: [], muscle: "Obliques", icon: "dumbbell" },
  { id: generateId(), name: "Cable Crunches", sets: [], muscle: "Upper Abs", icon: "dumbbell" },
  { id: generateId(), name: "Mountain Climbers", sets: [], muscle: "Full Body", icon: "dumbbell" },
  { id: generateId(), name: "Burpees", sets: [], muscle: "Full Body", icon: "dumbbell" },
  { id: generateId(), name: "Box Jumps", sets: [], muscle: "Legs", icon: "dumbbell" },
  { id: generateId(), name: "Dumbbell Lunges", sets: [], muscle: "Quadriceps", icon: "dumbbell" },
  { id: generateId(), name: "Hip Thrusts", sets: [], muscle: "Glutes", icon: "dumbbell" },
];

export const foods = foodsDatabase;

export const recipes = [
  { id: generateId(), name: "Protein Oats Bowl", calories: 320, protein: 22, carbs: 42, fat: 8, time: 10, category: "Breakfast" },
  { id: generateId(), name: "Paneer Tikka Salad", calories: 280, protein: 18, carbs: 12, fat: 18, time: 15, category: "Lunch" },
  { id: generateId(), name: "Moong Dal Khichdi", calories: 250, protein: 12, carbs: 40, fat: 4, time: 20, category: "Dinner" },
  { id: generateId(), name: "Banana Protein Shake", calories: 220, protein: 28, carbs: 24, fat: 2, time: 5, category: "Snack" },
  { id: generateId(), name: "Vegetable Upma", calories: 190, protein: 5, carbs: 32, fat: 5, time: 15, category: "Breakfast" },
];

export const nutritionData = {
  calories: { current: 2150, goal: 2200 },
  protein: { current: 112, goal: 120 },
  carbs: { current: 265, goal: 275 },
  fat: { current: 68, goal: 73 },
  daily: { calories: 2150, protein: 112, carbs: 265, fat: 68 },
  weekly: { avgCalories: 2080, avgProtein: 105, avgCarbs: 258, avgFat: 72 },
  targets: { calories: 2200, protein: 120, carbs: 275, fat: 73 },
};

export const bodyMetrics = {
  currentWeight: 74.5,
  targetWeight: 68,
  bmi: 24.3,
  bmiCategory: "Normal",
  bodyFat: 18.5,
  muscleMass: 32.2,
  bmr: 1680,
  tdee: 2520,
  weightTrend: Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toISOString().slice(5, 10),
      weight: 76.2 - (i * 0.06),
    };
  }),
};

export const heartRateData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  resting: 60 + Math.random() * 15,
  active: i >= 6 && i <= 8 ? 140 + Math.random() * 30 : 70 + Math.random() * 20,
}));

export const heartRateZones = [
  { name: "Rest", min: 0, max: 60, minutes: 480, color: "#6b7280" },
  { name: "Fat Burn", min: 60, max: 100, minutes: 120, color: "#22c55e" },
  { name: "Cardio", min: 100, max: 140, minutes: 45, color: "#f59e0b" },
  { name: "Peak", min: 140, max: 180, minutes: 15, color: "#ef4444" },
];

export const hrvData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toISOString().split("T")[0],
    value: 45 + Math.random() * 20,
    baseline: 55,
  };
});

export const sleepData = sleepRecords.map((r) => ({
  date: new Date(r.date).toISOString().split("T")[0],
  duration: r.duration,
  quality: r.quality,
  deep: r.deepSleep,
  light: r.lightSleep,
  rem: r.rem,
}));

export const sleepSummary = {
  deep: 95,
  light: 210,
  rem: 105,
  awake: 30,
};

export const mentalHealthData = {
  moodScore: 7.5,
  stressLevel: "Moderate",
  energyLevel: "High",
  weeklyMood: [7, 8, 6, 7, 8, 9, 7],
};

export const healthLogs = healthMetrics;

export const completedWorkouts = workouts.filter((w) => w.completed);

export const recentWorkouts = workouts.slice(0, 5);

export const weeklyWorkouts = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 60 },
  { day: "Wed", minutes: 0 },
  { day: "Thu", minutes: 50 },
  { day: "Fri", minutes: 30 },
  { day: "Sat", minutes: 45 },
  { day: "Sun", minutes: 0 },
];

export const weeklyWorkoutSummary = {
  total: 5,
  completed: 4,
  totalCalories: 1640,
  totalDuration: 290,
};

export const workoutPlanSample = [
  { day: "Monday", focus: "Push", exercises: ["Bench Press", "OHP", "Tricep Dips"] },
  { day: "Tuesday", focus: "Pull", exercises: ["Deadlift", "Pull-Ups", "Barbell Rows"] },
  { day: "Wednesday", focus: "Legs", exercises: ["Squats", "Romanian DL", "Calf Raises"] },
  { day: "Thursday", focus: "Rest", exercises: [] },
  { day: "Friday", focus: "Upper", exercises: ["Bench Press", "Pull-Ups", "OHP"] },
  { day: "Saturday", focus: "Lower", exercises: ["Squats", "Leg Press", "Hip Thrusts"] },
  { day: "Sunday", focus: "Rest", exercises: [] },
];

export const quickActions = [
  { id: generateId(), label: "Log Workout", icon: "dumbbell", href: "/workout", color: "from-purple-500 to-blue-500" },
  { id: generateId(), label: "Add Meal", icon: "apple", href: "/nutrition", color: "from-green-500 to-emerald-500" },
  { id: generateId(), label: "Track Water", icon: "droplets", href: "/health", color: "from-blue-500 to-cyan-500" },
  { id: generateId(), label: "Check BP", icon: "heart", href: "/health", color: "from-red-500 to-pink-500" },
];

export const calendarEvents = [
  { id: generateId(), title: "Push Day Workout", date: new Date().toISOString(), type: "workout", color: "#a855f7" },
  { id: generateId(), title: "Nutrition Review", date: new Date(Date.now() + 86400000).toISOString(), type: "health", color: "#22c55e" },
  { id: generateId(), title: "Cricket Practice", date: new Date(Date.now() + 2 * 86400000).toISOString(), type: "sport", color: "#3b82f6" },
  { id: generateId(), title: "Weekly Report", date: new Date(Date.now() + 5 * 86400000).toISOString(), type: "report", color: "#f59e0b" },
];

export const aiRecommendations = [
  { id: generateId(), title: "Increase Protein Intake", description: "Add one more protein-rich meal to reach your daily target.", priority: "high", category: "nutrition" },
  { id: generateId(), title: "Improve Sleep Quality", description: "Try to sleep before 11 PM for better recovery.", priority: "medium", category: "sleep" },
  { id: generateId(), title: "Add Stretching", description: "Include 10 minutes of stretching after workouts.", priority: "low", category: "fitness" },
];

export const sportSessions = sportsActivities;

export const sportRecords = [
  { id: generateId(), sport: "Cricket", record: "42 runs in a single innings", date: daysAgo(1) },
  { id: generateId(), sport: "Running", record: "5K in 28 minutes", date: daysAgo(4) },
  { id: generateId(), sport: "Badminton", record: "Won 2-1 in singles", date: daysAgo(3) },
  { id: generateId(), sport: "Swimming", record: "30 laps in 40 minutes", date: daysAgo(8) },
];

export const weeklyWeightData = bodyMeasurements.slice(0, 7).reverse().map((m) => ({
  date: new Date(m.date).toISOString().split("T")[0],
  weight: Number(m.weight.toFixed(1)),
  bodyFat: Number(m.bodyFat.toFixed(1)),
}));

export const monthlyProgress = bodyMeasurements.map((m) => ({
  date: new Date(m.date).toISOString().split("T")[0],
  weight: Number(m.weight.toFixed(1)),
  bodyFat: Number(m.bodyFat.toFixed(1)),
  muscleMass: Number(m.muscleMass.toFixed(1)),
  waist: Number(m.waist.toFixed(1)),
}));

export const macroDistribution = [
  { name: "Protein", value: 112, color: "#a855f7" },
  { name: "Carbs", value: 265, color: "#3b82f6" },
  { name: "Fat", value: 68, color: "#f59e0b" },
];

export const lifestyleData = {
  energy: 8,
  stress: 4,
  recovery: 7,
  habitStreak: 7,
  avgSleep: 7.2,
  avgWater: 7.5,
  avgSteps: 8300,
  screenTime: 4.5,
  sedentaryHours: 6,
};

export const heartRateHistory = heartRateData;

export const activityData = {
  stepsToday: 8320,
  stepsGoal: 10000,
  waterIntake: 6,
  waterGoal: 8,
  heartRate: 72,
  sleepScore: 7.5,
  weeklySteps: [
    { day: "Mon", steps: 8500 },
    { day: "Tue", steps: 9200 },
    { day: "Wed", steps: 7800 },
    { day: "Thu", steps: 10100 },
    { day: "Fri", steps: 8300 },
    { day: "Sat", steps: 6500 },
    { day: "Sun", steps: 8320 },
  ],
  sessions: sportsActivities.map((a) => ({
    ...a,
    date: new Date(a.timestamp).toISOString().split("T")[0],
  })),
};

export const exercises = exerciseLibraryData;
