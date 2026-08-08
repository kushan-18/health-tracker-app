import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_PHOTO_SCANS_PER_DAY = 20;

interface AnalyzedFoodItem {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI food analysis is not configured yet." }),
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("meals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", "photo")
      .gte("logged_at", todayStart.toISOString());

    if ((count ?? 0) >= MAX_PHOTO_SCANS_PER_DAY) {
      return new Response(
        JSON.stringify({
          error: `You've reached the daily limit of ${MAX_PHOTO_SCANS_PER_DAY} photo scans. Try again tomorrow.`,
        }),
        { status: 429 }
      );
    }

    const body = await req.json();
    const { image } = body as { image: string };

    if (!image) {
      return new Response(JSON.stringify({ error: "Image is required" }), { status: 400 });
    }

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const base64Data = image.includes(",") ? image.split(",")[1] : image;
    const mimeType = image.match(/data:(.*?);/)?.[1] || "image/jpeg";

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: `Analyze this food photo. Identify each distinct food item visible. For each item, estimate:
- name (common name)
- serving size (e.g. "1 bowl", "2 pieces", "1 plate")
- calories (kcal)
- protein (grams)
- carbs (grams)
- fat (grams)

Respond with ONLY a valid JSON array. No markdown, no explanation, no code fences. Example format:
[{"name":"Rice","serving":"1 plate","calories":300,"protein":5,"carbs":65,"fat":2},{"name":"Dal","serving":"1 bowl","calories":210,"protein":12,"carbs":28,"fat":6}]`,
            },
          ],
        },
      ],
      config: {
        maxOutputTokens: 1024,
        temperature: 0.3,
      },
    });

    const text = response.text || "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return new Response(
        JSON.stringify({ error: "Could not parse food items from the image. Please try again or log manually." }),
        { status: 422 }
      );
    }

    let items: AnalyzedFoodItem[];
    try {
      items = JSON.parse(jsonMatch[0]);
    } catch {
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response. Please try again." }),
        { status: 422 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "No food items detected in the image." }),
        { status: 422 }
      );
    }

    const sanitized: AnalyzedFoodItem[] = items.map((item) => ({
      name: String(item.name || "Unknown").slice(0, 100),
      serving: String(item.serving || "1 serving").slice(0, 50),
      calories: Math.max(0, Math.round(Number(item.calories) || 0)),
      protein: Math.max(0, Math.round(Number(item.protein) || 0)),
      carbs: Math.max(0, Math.round(Number(item.carbs) || 0)),
      fat: Math.max(0, Math.round(Number(item.fat) || 0)),
    }));

    return new Response(JSON.stringify({ items: sanitized }), { status: 200 });
  } catch (err) {
    console.error("Food analysis error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
