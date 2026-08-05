export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageRow {
  id: string;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface HealthContext {
  profile: {
    name: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    goal: string;
    activityLevel: string;
    dietPreference: string;
    workoutExperience: string;
    medicalConditions: string[];
    targetWeight: number;
    targetCalories: number;
  } | null;
  todaySummary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
    currentWeight: number | null;
    mealCount: number;
  };
  recentWorkouts: {
    name: string;
    type: string;
    duration_minutes: number;
    calories_burned: number;
    date: string;
  }[];
  recentWeightLogs: {
    weight: number;
    logged_at: string;
  }[];
  recentHealthMetrics: {
    type: string;
    value: number;
    unit: string;
    recorded_at: string;
  }[];
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  conversationId: string;
  messageId: string;
}
