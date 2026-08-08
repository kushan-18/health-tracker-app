import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_GOALS = ["Muscle Building", "Fat Loss", "Strength", "Endurance", "General Fitness"];
const VALID_EXPERIENCE = ["Beginner", "Intermediate", "Advanced"];
const VALID_EQUIPMENT = ["Full Gym", "Dumbbells Only", "Bodyweight", "Minimal Equipment"];

interface PlanExercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

interface PlanDay {
  day: string;
  focus: string;
  exercises: PlanExercise[];
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI workout generator is not configured yet. Please add GEMINI_API_KEY to your environment." }),
        { status: 503 }
      );
    }

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const { goal, experience, days, equipment } = body as {
      goal: string;
      experience: string;
      days: number;
      equipment: string;
    };

    if (!VALID_GOALS.includes(goal) || !VALID_EXPERIENCE.includes(experience) || !VALID_EQUIPMENT.includes(equipment)) {
      return new Response(JSON.stringify({ error: "Invalid generation parameters." }), { status: 400 });
    }

    const daysNum = Number(days);
    if (!Number.isInteger(daysNum) || daysNum < 3 || daysNum > 7) {
      return new Response(JSON.stringify({ error: "Days per week must be between 3 and 7." }), { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a professional strength and conditioning coach. Generate a weekly workout plan with EXACTLY ${daysNum} training days and the rest as rest/recovery days.

Constraints:
- Goal: ${goal}
- Experience level: ${experience}
- Days per week: ${daysNum}
- Available equipment: ${equipment}

Rules:
- Match the exercises to the equipment. If equipment is "Bodyweight" or "Minimal Equipment", do NOT use barbells, machines, or dumbbells.
- For ${experience} experience, keep exercise difficulty and volume appropriate.
- Provide concrete exercises with sets and reps (or duration for time-based ones).
- Day names should be real weekdays (Monday-Sunday), training days spread across the week.

Respond with ONLY a valid JSON array. No markdown, no explanation, no code fences. Example format:
[{"day":"Monday","focus":"Push","exercises":[{"name":"Bench Press","sets":4,"reps":"8-12","notes":"Keep shoulders back"}]},{"day":"Tuesday","focus":"Rest","exercises":[]}]`,
            },
          ],
        },
      ],
      config: {
        maxOutputTokens: 8192,
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    if (process.env.NODE_ENV !== "production") {
      console.log("[generate-workout] Gemini raw length:", text.length);
    }
    const parsePlan = (raw: string): PlanDay[] | null => {
      if (!raw) return null;
      // 1. Full text as JSON
      try {
        const parsed = JSON.parse(raw.trim());
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as PlanDay[];
      } catch { /* fall through */ }

      // 2. Strip markdown code fences
      try {
        const stripped = raw.replace(/```(?:json)?/gi, "").trim();
        const parsed = JSON.parse(stripped);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as PlanDay[];
      } catch { /* fall through */ }

      // 3. Extract first balanced JSON array
      const start = raw.indexOf("[");
      if (start !== -1) {
        let depth = 0, inString = false, escaped = false;
        for (let i = start; i < raw.length; i++) {
          const ch = raw[i];
          if (inString) {
            if (escaped) escaped = false;
            else if (ch === "\\") escaped = true;
            else if (ch === '"') inString = false;
            continue;
          }
          if (ch === '"') { inString = true; continue; }
          if (ch === "[") depth++;
          else if (ch === "]") {
            depth--;
            if (depth === 0) {
              try {
                const parsed = JSON.parse(raw.slice(start, i + 1));
                if (Array.isArray(parsed) && parsed.length > 0) return parsed as PlanDay[];
              } catch { /* ignore */ }
              break;
            }
          }
        }
      }
      return null;
    };

    let plan = parsePlan(text);

    // Graceful fallback for truncated/malformed responses: retry once with a stricter prompt
    if (!plan || plan.length === 0) {
      const retryText = `Create a concise ${daysNum}-day workout plan for a ${experience} lifter, goal ${goal}, equipment: ${equipment}. Reply with ONLY a compact JSON array in this exact shape (no markdown, no extra words): [{"day":"Monday","focus":"Push","exercises":[{"name":"Bench Press","sets":4,"reps":"8-12"}]}]`;
      try {
        const r2 = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: [{ role: "user", parts: [{ text: retryText }] }],
          config: { maxOutputTokens: 4096, temperature: 0.4, responseMimeType: "application/json" },
        });
        plan = parsePlan(r2.text || "");
      } catch { /* ignore retry failure */ }
    }

    if (!plan || plan.length === 0) {
      return new Response(
        JSON.stringify({ error: "Could not parse the generated plan. Please try again." }),
        { status: 422 }
      );
    }

    const sanitized: PlanDay[] = plan.slice(0, 7).map((day) => ({
      day: String(day.day || "Training Day").slice(0, 20),
      focus: String(day.focus || "Training").slice(0, 40),
      exercises: Array.isArray(day.exercises)
        ? day.exercises.map((ex) => ({
            name: String(ex.name || "Exercise").slice(0, 80),
            sets: Math.max(0, Math.min(10, Math.round(Number(ex.sets) || 0))),
            reps: String(ex.reps || "—").slice(0, 20),
            notes: ex.notes ? String(ex.notes).slice(0, 120) : undefined,
          }))
        : [],
    }));

    return Response.json({ plan: sanitized }, { status: 200 });
  } catch (err) {
    console.error("Workout generation error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
