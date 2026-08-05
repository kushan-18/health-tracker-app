"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Send, Brain, Dumbbell, Apple, Moon, Zap } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const suggestedPrompts = [
  { text: "Create a workout plan for me", icon: Dumbbell },
  { text: "Analyze my diet today", icon: Apple },
  { text: "How can I sleep better?", icon: Moon },
  { text: "What should I eat post-workout?", icon: Zap },
];

export default function CoachPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  React.useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [user]);

  React.useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    }
  }, [activeConvId]);

  async function fetchConversations() {
    try {
      const res = await fetch("/api/chat/history");
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
    } catch {
      console.error("Failed to load conversations");
    }
  }

  async function fetchMessages(convId: string) {
    try {
      const res = await fetch(`/api/chat/history?conversationId=${convId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(
          data.messages.map((m: { id: string; role: string; content: string; created_at: string }) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.content,
            timestamp: m.created_at,
          }))
        );
      }
    } catch {
      console.error("Failed to load messages");
    }
  }

  async function handleSend(text?: string) {
    const msgText = text || input.trim();
    if (!msgText || isStreaming) return;

    setError(null);
    setInput("");

    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: msgText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const assistantMsg: Message = {
      id: `temp-assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsStreaming(true);

    try {
      abortRef.current = new AbortController();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText, conversationId: activeConvId }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to get response");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.content) {
                accumulated += data.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    updated[updated.length - 1] = { ...lastMsg, content: accumulated };
                  }
                  return updated;
                });
              }

              if (data.done && data.conversationId) {
                if (!activeConvId) {
                  setActiveConvId(data.conversationId);
                  fetchConversations();
                }
              }

              if (data.error) {
                setError(data.error);
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === "assistant" && !lastMsg.content) {
          updated[updated.length - 1] = {
            ...lastMsg,
            content: "I wasn't able to generate a response. Please try again.",
          };
        }
        return updated;
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          updated[updated.length - 1] = {
            ...lastMsg,
            content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleNewChat() {
    setActiveConvId(null);
    setMessages([]);
  }

  function renderMarkdown(content: string) {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("•") || line.startsWith("-")) {
        return (
          <div key={i} className="ml-2 flex gap-1">
            <span className="text-violet-400">{line[0]}</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <div key={i} className="font-semibold mt-2 mb-1">{line.replace(/\*\*/g, "")}</div>;
      }
      if (line.startsWith("## ")) {
        return <div key={i} className="font-semibold mt-3 mb-1 text-violet-300">{line.slice(3)}</div>;
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <div key={i}>{line}</div>;
    });
  }

  return (
    <AppLayout title="AI Coach">
      <div className="flex h-[calc(100vh-10rem)] gap-4">
        <div className="hidden lg:flex flex-col w-64 shrink-0">
          <Button className="w-full mb-3 gap-2" onClick={handleNewChat}>
            <Plus className="h-4 w-4" /> New Chat
          </Button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer group",
                  activeConvId === conv.id
                    ? "bg-violet-500/15 text-white border border-violet-500/20"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                )}
              >
                <div className="truncate">{conv.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  {new Date(conv.updated_at || conv.created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
            {conversations.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm">No conversations yet</div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !isStreaming ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mb-4">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">VitalX AI Coach</h2>
                    <p className="text-sm text-muted-foreground mb-8 max-w-sm">
                      Your personal AI health coach. I have access to your real health data and can provide personalized recommendations.
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
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                            msg.role === "user"
                              ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                              : "bg-zinc-800/80 border border-zinc-700/50 text-zinc-200"
                          )}
                        >
                          {msg.role === "assistant" ? (
                            renderMarkdown(msg.content)
                          ) : (
                            msg.content
                          )}
                          {msg.role === "assistant" && isStreaming && msg.id === messages[messages.length - 1]?.id && (
                            <span className="inline-block w-1.5 h-4 bg-violet-400 ml-0.5 animate-pulse" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                    <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}

                {error && (
                  <div className="text-center text-xs text-red-400 py-2">{error}</div>
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
                    placeholder="Ask your AI coach about fitness, nutrition, sleep..."
                    className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    disabled={isStreaming}
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isStreaming}
                  >
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
