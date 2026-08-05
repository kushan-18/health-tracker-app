import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildHealthContext } from "@/lib/ai/context-engine";
import { buildSystemPrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI coach is not configured yet. Please add OPENAI_API_KEY to your environment." }),
        { status: 503 }
      );
    }

    const { default: OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey });
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const { message, conversationId } = body as { message: string; conversationId?: string };

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    let convId = conversationId;

    if (!convId) {
      const title = message.length > 60 ? message.slice(0, 60) + "..." : message;
      const { data: conv, error: convError } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, title })
        .select("id")
        .single();

      if (convError) throw convError;
      convId = conv.id;
    }

    await supabase.from("chat_messages").insert({
      conversation_id: convId,
      user_id: user.id,
      role: "user",
      content: message,
    });

    const ctx = await buildHealthContext(user.id);
    const systemPrompt = buildSystemPrompt(ctx);

    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(50);

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    if (history) {
      for (const msg of history) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true,
      max_tokens: 2048,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullResponse = "";

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }

          await supabase.from("chat_messages").insert({
            conversation_id: convId,
            user_id: user.id,
            role: "assistant",
            content: fullResponse,
          });

          await supabase
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", convId);

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true, conversationId: convId })}\n\n`)
          );
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Stream failed";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
