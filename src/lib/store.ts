import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIChat, ChatMessage } from "./types";

function generateId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

interface VitalXStore {
  // UI
  theme: "dark" | "light";
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Gamification (local only)
  xp: number;
  level: number;
  coins: number;
  streaks: number;
  addXP: (amount: number) => void;

  // Chat (local only — AI coach not yet connected to DB)
  conversations: AIChat[];
  activeConversation: string | null;
  addMessage: (conversationId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  createConversation: (title?: string) => string;
}

export const useStore = create<VitalXStore>()(
  persist(
    (set, get) => ({
      // UI
      theme: "dark",
      sidebarOpen: true,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Gamification
      xp: 0,
      level: 1,
      coins: 0,
      streaks: 0,
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const xpPerLevel = 500;
          const newLevel = Math.floor(newXP / xpPerLevel) + 1;
          return { xp: newXP, level: newLevel };
        }),

      // Chat
      conversations: [],
      activeConversation: null,
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    { ...message, id: generateId(), timestamp: new Date().toISOString() },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        })),
      createConversation: (title?: string) => {
        const id = generateId();
        const chat: AIChat = {
          id,
          title: title || "New Conversation",
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          conversations: [chat, ...state.conversations],
          activeConversation: id,
        }));
        return id;
      },
    }),
    {
      name: "vitalx-store",
    }
  )
);

const useAuthStore = useStore;
export { useAuthStore };
