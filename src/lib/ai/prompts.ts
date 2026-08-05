import type { HealthContext } from "./types";

export function buildSystemPrompt(ctx: HealthContext): string {
  const sections: string[] = [];

  sections.push(`You are VitalX AI, an expert health and fitness coach. You provide personalized, evidence-based advice for nutrition, exercise, recovery, and overall wellness.

Your role:
- Analyze the user's real health data and provide actionable recommendations
- Be concise but thorough — use bullet points and short paragraphs
- Reference their actual numbers when giving advice
- If data is missing, acknowledge it and ask for clarification
- Never make up medical diagnoses — recommend consulting a healthcare professional when appropriate
- Use a supportive, motivating tone`);

  if (ctx.profile) {
    const p = ctx.profile;
    sections.push(`## User Profile
- Name: ${p.name}
- Age: ${p.age}, Gender: ${p.gender}
- Height: ${p.height}cm, Weight: ${p.weight}kg
- Goal: ${p.goal}
- Activity Level: ${p.activityLevel}
- Diet Preference: ${p.dietPreference}
- Workout Experience: ${p.workoutExperience}
- Target Weight: ${p.targetWeight}kg
- Target Calories: ${p.targetCalories} kcal/day
${p.medicalConditions.length > 0 ? `- Medical Conditions: ${p.medicalConditions.join(", ")}` : ""}`);
  }

  const ts = ctx.todaySummary;
  if (ts.calories > 0 || ts.water > 0 || ts.mealCount > 0) {
    sections.push(`## Today's Summary
- Calories: ${ts.calories} kcal (${ts.mealCount} meals logged)
- Protein: ${ts.protein}g | Carbs: ${ts.carbs}g | Fat: ${ts.fat}g
- Water: ${ts.water} glasses
${ts.currentWeight ? `- Current Weight: ${ts.currentWeight}kg` : ""}`);
  }

  if (ctx.recentWorkouts.length > 0) {
    const workoutLines = ctx.recentWorkouts.slice(0, 5).map(
      (w) => `- ${w.name} (${w.type}) — ${w.duration_minutes}min, ${w.calories_burned} kcal — ${new Date(w.date).toLocaleDateString()}`
    );
    sections.push(`## Recent Workouts\n${workoutLines.join("\n")}`);
  }

  if (ctx.recentWeightLogs.length > 0) {
    const weightLines = ctx.recentWeightLogs.slice(0, 7).map(
      (w) => `- ${w.weight}kg on ${new Date(w.logged_at).toLocaleDateString()}`
    );
    sections.push(`## Weight History\n${weightLines.join("\n")}`);
  }

  if (ctx.recentHealthMetrics.length > 0) {
    const metricLines = ctx.recentHealthMetrics.slice(0, 10).map(
      (m) => `- ${m.type}: ${m.value} ${m.unit} on ${new Date(m.recorded_at).toLocaleDateString()}`
    );
    sections.push(`## Health Metrics\n${metricLines.join("\n")}`);
  }

  sections.push(`## Response Guidelines
- Keep responses focused and actionable
- Use markdown formatting: **bold** for key terms, bullet points for lists
- When recommending foods, consider their diet preference
- When recommending workouts, consider their experience level and recent activity
- If they ask about something outside your scope, recommend they consult a professional`);

  return sections.join("\n\n");
}
