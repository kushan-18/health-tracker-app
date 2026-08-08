import { createClient } from "@/lib/supabase/server";
import type { HealthContext } from "./types";

export async function buildHealthContext(userId: string): Promise<HealthContext> {
  const supabase = await createClient();

  const [profileResult, mealsResult, waterResult, weightResult, workoutsResult, metricsResult] =
    await Promise.allSettled([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase
        .from("meals")
        .select("calories, protein_g, carbs_g, fat_g, logged_at")
        .eq("user_id", userId)
        .gte("logged_at", getTodayStart())
        .lte("logged_at", getTodayEnd()),
      supabase
        .from("water_logs")
        .select("glasses, logged_at")
        .eq("user_id", userId)
        .gte("logged_at", getTodayStart())
        .lte("logged_at", getTodayEnd()),
      supabase
        .from("weight_logs")
        .select("weight, logged_at")
        .eq("user_id", userId)
        .order("logged_at", { ascending: false })
        .limit(7),
      supabase
        .from("workouts")
        .select("name, type, duration_minutes, calories_burned, date")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(5),
      supabase
        .from("health_metrics")
        .select("type, value, unit, recorded_at")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false })
        .limit(10),
    ]);

  const profile = profileResult.status === "fulfilled" ? profileResult.value?.data : null;

  const meals = mealsResult.status === "fulfilled" ? mealsResult.value?.data ?? [] : [];
  const totalCalories = meals.reduce((s: number, m: { calories?: number }) => s + (m.calories || 0), 0);
  const totalProtein = meals.reduce((s: number, m: { protein_g?: number }) => s + (m.protein_g || 0), 0);
  const totalCarbs = meals.reduce((s: number, m: { carbs_g?: number }) => s + (m.carbs_g || 0), 0);
  const totalFat = meals.reduce((s: number, m: { fat_g?: number }) => s + (m.fat_g || 0), 0);

  const waterLogs = waterResult.status === "fulfilled" ? waterResult.value?.data ?? [] : [];
  const totalWater = waterLogs.reduce((s: number, w: { glasses?: number }) => s + (w.glasses || 0), 0);

  const weights = weightResult.status === "fulfilled" ? weightResult.value?.data ?? [] : [];
  const currentWeight = weights[0]?.weight ?? profile?.weight ?? null;

  const workouts = workoutsResult.status === "fulfilled" ? workoutsResult.value?.data ?? [] : [];
  const metrics = metricsResult.status === "fulfilled" ? metricsResult.value?.data ?? [] : [];

  return {
    profile: profile
      ? {
          name: profile.name || "User",
          age: profile.age || 0,
          gender: profile.gender || "unknown",
          height: profile.height || 0,
          weight: profile.weight || 0,
          goal: profile.fitness_goal || "General fitness",
          activityLevel: profile.activity_level || "moderate",
          dietPreference: profile.diet_preference || "No preference",
          workoutExperience: profile.workout_experience || "beginner",
          medicalConditions: profile.medical_conditions || [],
          targetWeight: profile.target_weight || 0,
          targetCalories: profile.target_calories || 2200,
        }
      : null,
    todaySummary: {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      water: totalWater,
      currentWeight,
      mealCount: meals.length,
    },
    recentWorkouts: workouts.map((w: { name: string; type: string; duration_minutes: number; calories_burned: number; date: string }) => ({
      name: w.name,
      type: w.type,
      duration_minutes: w.duration_minutes,
      calories_burned: w.calories_burned,
      date: w.date,
    })),
    recentWeightLogs: weights.map((w: { weight: number; logged_at: string }) => ({
      weight: w.weight,
      logged_at: w.logged_at,
    })),
    recentHealthMetrics: metrics.map((m: { type: string; value: number; unit: string; recorded_at: string }) => ({
      type: m.type,
      value: m.value,
      unit: m.unit,
      recorded_at: m.recorded_at,
    })),
  };
}

function getTodayStart(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function getTodayEnd(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}
