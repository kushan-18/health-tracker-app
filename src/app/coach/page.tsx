"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Send, Brain, Dumbbell, Apple, Moon, Zap } from "lucide-react";

const suggestedPrompts = [
  { text: "Create a workout plan for me", icon: Dumbbell },
  { text: "Analyze my diet today", icon: Apple },
  { text: "How can I sleep better?", icon: Moon },
  { text: "What should I eat post-workout?", icon: Zap },
];

const aiResponses: Record<string, string> = {
  "Create a workout plan for me": `Based on your profile and fitness history, I've designed a comprehensive workout plan tailored to your goals. Here's what I recommend:\n\n**Weekly Split (4-Day Upper/Lower):**\n• Monday — Upper Body: Bench Press 4×8, Barbell Row 4×8, Overhead Press 3×10, Pull-ups 3×max, Bicep Curls 3×12, Tricep Pushdowns 3×12\n• Tuesday — Lower Body: Squat 4×8, Romanian Deadlift 4×10, Leg Press 3×12, Walking Lunges 3×12 each, Calf Raises 4×15, Plank 3×60s\n• Thursday — Upper Body (volume): Incline DB Press 4×10, Seated Row 3×12, Lateral Raises 4×15, Face Pulls 3×15, Hammer Curls 3×12\n• Friday — Lower Body (power): Deadlift 4×6, Bulgarian Split Squat 3×10, Leg Curl 3×12, Step-ups 3×10, Core circuit 15 min\n\nRest days: Wednesday, Saturday, Sunday. Focus on progressive overload — increase weight by 2.5kg each week on compound lifts. Your recovery score of 82% suggests you can handle this volume well.`,

  "Analyze my diet today": `I've analyzed your nutrition data for today. Here's the breakdown:\n\n**Current Intake vs Goals:**\n• Calories: 1,847 / 2,200 kcal (84% — you're 353 kcal short)\n• Protein: 128g / 160g (80% — add a protein shake or 200g chicken breast)\n• Carbs: 220g / 280g (79% — good fuel for workouts)\n• Fat: 65g / 80g (81% — healthy range)\n\n**Key Observations:**\n1. Your protein intake is below target. Consider adding cottage cheese or Greek yogurt as evening snacks.\n2. You're eating well with Indian staples — dal, roti, and paneer provide good macro balance.\n3. Your fiber intake looks adequate from whole grains and vegetables.\n\n**Recommendations:**\n• Add a whey protein shake post-workout (+24g protein)\n• Include a banana with almond milk before bed (+300 kcal)\n• Your micronutrient diversity is good — keep the variety of Indian dishes!`,

  "How can I sleep better": `Great question! Quality sleep is crucial for recovery and performance. Here are evidence-based strategies:\n\n**Sleep Hygiene Protocol:**\n1. **Consistent Schedule**: Your current schedule of 10 PM - 6 AM is excellent. Stick to it even on weekends.\n2. **Screen Curfew**: Stop using screens 60 minutes before bed. Blue light suppresses melatonin by up to 50%.\n3. **Temperature**: Keep your room at 18-20°C (65-68°F). Your body needs to cool down to enter deep sleep.\n4. **Caffeine Cutoff**: No caffeine after 2 PM. It has a half-life of 5-6 hours.\n\n**Evening Routine:**\n• 8:00 PM — Light dinner (avoid heavy/spicy food)\n• 9:00 PM — Gentle stretching or breathing exercise\n• 9:30 PM — Read or meditate (try our breathing timer!)\n• 10:00 PM — Lights out\n\n**Supplements to Consider:**\n• Magnesium Glycinate (200-400mg) — helps with sleep quality\n• Ashwagandha — reduces cortisol and improves deep sleep\n• Tart Cherry Juice — natural melatonin source\n\nYour current sleep score of 8.5/10 is already quite good. These tweaks could push it to 9+!`,

  "What should I eat post-workout": `Nutrition timing around workouts can significantly impact recovery and muscle growth. Here's my recommendation:\n\n**The Anabolic Window (within 30-60 min post-workout):**\n\n**Option 1 — Quick & Easy:**\n• 1 scoop Whey Protein + 1 banana + 200ml milk\n• Macros: ~350 kcal, 30g protein, 45g carbs, 5g fat\n\n**Option 2 — Indian Meal:**\n• 200g Paneer Tikka + 1 cup Rice + Dal\n• Macros: ~550 kcal, 30g protein, 55g carbs, 22g fat\n\n**Option 3 — Full Meal:**\n• Grilled Chicken Breast (200g) + Sweet Potato + Vegetables\n• Macros: ~450 kcal, 40g protein, 35g carbs, 10g fat\n\n**Key Principles:**\n1. Protein: Aim for 25-40g (whey absorbs fastest)\n2. Carbs: 1-1.5g per kg bodyweight to replenish glycogen\n3. Keep fat moderate in this meal (it slows digestion)\n4. Hydrate with 500ml water + electrolytes\n\nGiven your weight of 76.2kg, target ~75-110g carbs post-workout for optimal recovery.`,
};

const fallbackResponse = `Thank you for your question! As your AI Health Coach, I can help with:\n\n• **Workout Planning** — Custom exercise programs based on your goals\n• **Nutrition Advice** — Meal plans, macro tracking, food recommendations\n• **Sleep Optimization** — Tips for better rest and recovery\n• **Health Metrics** — Understanding your vitals and trends\n• **Mental Wellness** — Stress management, breathing exercises\n\nFeel free to ask me anything about your fitness journey, or try one of the suggested prompts below for a detailed analysis!`;

export default function CoachPage() {
  const { conversations, createConversation, addMessage } = useStore();
  const [activeConvId, setActiveConvId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const messages = activeConv?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    let convId = activeConvId;
    if (!convId) {
      convId = createConversation(msgText.slice(0, 40));
      setActiveConvId(convId);
    }

    addMessage(convId, { content: msgText, role: "user" });
    setInput("");
    setIsTyping(true);

    const responseKey = suggestedPrompts.find((p) => p.text === msgText)?.text || "";
    const response = aiResponses[responseKey] || fallbackResponse;

    setTimeout(() => {
      addMessage(convId!, { content: response, role: "assistant" });
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppLayout title="AI Coach">
      <div className="mb-4 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs text-center">
        Demo mode — AI responses are pre-generated examples. Real AI integration coming soon.
      </div>
      <div className="flex h-[calc(100vh-10rem)] gap-4">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 shrink-0">
          <Button className="w-full mb-3 gap-2" onClick={() => { setActiveConvId(null); }}>
            <Plus className="h-4 w-4" /> New Chat
          </Button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer",
                  activeConvId === conv.id
                    ? "bg-violet-500/15 text-white border border-violet-500/20"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                )}
              >
                <div className="truncate">{conv.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{new Date(conv.createdAt).toLocaleDateString()}</div>
              </button>
            ))}
            {conversations.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm">No conversations yet</div>
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !isTyping ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mb-4">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">VitalX AI Coach</h2>
                    <p className="text-sm text-zinc-400 mb-8 max-w-sm">
                      Your personal AI health coach. Ask me anything about fitness, nutrition, sleep, or wellness.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                      {suggestedPrompts.map((prompt) => (
                        <button
                          key={prompt.text}
                          onClick={() => handleSend(prompt.text)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/60 hover:border-zinc-600 transition-all text-left cursor-pointer"
                        >
                          <prompt.icon className="h-4 w-4 text-violet-400 shrink-0" />
                          <span className="text-xs text-zinc-300">{prompt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                      >
                        <div className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                            : "bg-zinc-800/80 border border-zinc-700/50 text-zinc-200"
                        )}>
                          {msg.content.split("\n").map((line, i) => (
                            <React.Fragment key={i}>
                              {line.startsWith("•") ? (
                                <div className="ml-2">{line}</div>
                              ) : line.startsWith("**") ? (
                                <div className="font-semibold mt-2 mb-1">{line.replace(/\*\*/g, "")}</div>
                              ) : (
                                <div>{line}</div>
                              )}
                              {i < msg.content.split("\n").length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                    <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-zinc-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask your AI coach..."
                    className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    disabled={isTyping}
                  />
                  <Button size="icon" onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
