import { createClient } from "@/lib/supabase/client";
import type { User as Profile } from "@/lib/types";

const supabase = createClient();

// ============================================================
// Profile
// ============================================================
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data as Profile & { id: string };
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// Workouts
// ============================================================
export async function getWorkouts(userId: string) {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addWorkout(userId: string, workout: {
  name: string;
  type: string;
  duration_minutes: number;
  calories_burned: number;
  exercises?: unknown[];
  date?: string;
  completed?: boolean;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("workouts")
    .insert({ ...workout, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateWorkout(workoutId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("workouts")
    .update(updates)
    .eq("id", workoutId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWorkout(workoutId: string) {
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId);
  if (error) throw error;
}

// ============================================================
// Meals
// ============================================================
export async function getMeals(userId: string) {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addMeal(userId: string, meal: {
  name: string;
  type: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  foods?: unknown[];
}) {
  const { data, error } = await supabase
    .from("meals")
    .insert({ ...meal, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMeal(mealId: string) {
  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", mealId);
  if (error) throw error;
}

// ============================================================
// Weight Logs
// ============================================================
export async function getWeightLogs(userId: string) {
  const { data, error } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addWeightLog(userId: string, weight: number) {
  const { data, error } = await supabase
    .from("weight_logs")
    .insert({ user_id: userId, weight })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWeightLog(id: string) {
  const { error } = await supabase
    .from("weight_logs")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ============================================================
// Water Logs
// ============================================================
export async function getWaterLogs(userId: string) {
  const { data, error } = await supabase
    .from("water_logs")
    .select("*")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addWaterLog(userId: string, glasses: number = 1) {
  const { data, error } = await supabase
    .from("water_logs")
    .insert({ user_id: userId, glasses })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWaterLog(id: string) {
  const { error } = await supabase
    .from("water_logs")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ============================================================
// Health Metrics
// ============================================================
export async function getHealthMetrics(userId: string) {
  const { data, error } = await supabase
    .from("health_metrics")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addHealthMetric(userId: string, metric: {
  type: string;
  value: number | string;
  unit: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("health_metrics")
    .insert({ ...metric, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteHealthMetric(id: string) {
  const { error } = await supabase
    .from("health_metrics")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ============================================================
// Chat History
// ============================================================
export async function getChatHistory(userId: string, conversationId: string = "default") {
  const { data, error } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", userId)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addChatMessage(userId: string, message: string, role: "user" | "assistant", conversationId: string = "default") {
  const { data, error } = await supabase
    .from("chat_history")
    .insert({ user_id: userId, conversation_id: conversationId, message, role })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================================
// Helper: Get today's aggregated data
// ============================================================
export async function getTodaySummary(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const [meals, waterLogs, weightLogs] = await Promise.all([
    supabase
      .from("meals")
      .select("calories, protein_g, carbs_g, fat_g")
      .eq("user_id", userId)
      .gte("logged_at", `${today}T00:00:00`)
      .lte("logged_at", `${today}T23:59:59`),
    supabase
      .from("water_logs")
      .select("glasses")
      .eq("user_id", userId)
      .gte("logged_at", `${today}T00:00:00`)
      .lte("logged_at", `${today}T23:59:59`),
    supabase
      .from("weight_logs")
      .select("weight")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false })
      .limit(1),
  ]);

  const totalCalories = meals.data?.reduce((s: number, m: any) => s + (m.calories || 0), 0) ?? 0;
  const totalProtein = meals.data?.reduce((s: number, m: any) => s + (m.protein_g || 0), 0) ?? 0;
  const totalCarbs = meals.data?.reduce((s: number, m: any) => s + (m.carbs_g || 0), 0) ?? 0;
  const totalFat = meals.data?.reduce((s: number, m: any) => s + (m.fat_g || 0), 0) ?? 0;
  const totalWater = waterLogs.data?.reduce((s: number, w: any) => s + (w.glasses || 0), 0) ?? 0;
  const currentWeight = weightLogs.data?.[0]?.weight ?? null;

  return {
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
    water: totalWater,
    currentWeight,
    mealCount: meals.data?.length ?? 0,
  };
}
