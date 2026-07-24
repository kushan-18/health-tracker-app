'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLayout } from '@/components/layout/app-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Send, Mic, Paperclip, Plus, MessageSquare, Sparkles, Bot, User, ChevronLeft
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  'Create a workout plan',
  'Analyze my diet',
  'How can I sleep better?',
  'What should I eat post-workout?',
]

const predefinedResponses: Record<string, string> = {
  'create a workout plan': `Here's a personalized 5-day workout plan based on your profile:\n\n**Day 1 - Push (Chest, Shoulders, Triceps)**\n- Bench Press: 4x8-10\n- Incline DB Press: 3x10-12\n- Overhead Press: 3x10\n- Lateral Raises: 3x15\n- Tricep Dips: 3x12\n\n**Day 2 - Pull (Back, Biceps)**\n- Deadlift: 3x6-8\n- Barbell Row: 4x10\n- Pull Ups: 3x max\n- Face Pulls: 3x15\n- Barbell Curl: 3x10\n\n**Day 3 - Legs**\n- Squat: 4x8-10\n- Romanian Deadlift: 3x12\n- Leg Press: 3x15\n- Calf Raises: 4x15\n\n**Day 4 - Active Recovery**\n- 30 min yoga or light walking\n\n**Day 5 - Full Body**\n- Focus on compound movements\n\nRest days: Wednesday & Sunday\n\nShall I adjust the volume or add specific exercises?`,
  'analyze my diet': `Based on your recent food logs, here's my analysis:\n\n**Caloric Intake:** ~2,250 kcal/day (target: 2,800 kcal)\nYou're eating 550 calories below your muscle-building target.\n\n**Macros Breakdown:**\n- Protein: 146g/day (good! hitting ~1.9g/kg)\n- Carbs: 230g/day (could be higher)\n- Fat: 68g/day (within range)\n\n**Strengths:**\n✅ High protein intake from quality sources\n✅ Good meal frequency (4 meals/day)\n✅ Adequate fiber from dal, roti, and vegetables\n\n**Areas to Improve:**\n⚠️ Add 1 more serving of complex carbs (oats, brown rice)\n⚠️ Include more healthy fats (nuts, seeds, ghee)\n⚠️ Consider a pre-workout meal 1-2 hours before training\n\n**Suggested Meal Plan:**\n- Pre-workout: Banana + peanut butter toast\n- Post-workout: Whey shake + oats\n- Add a serving of mixed nuts between meals\n\nWant me to create a detailed meal plan?`,
  'how can i sleep better?': `Great question! Sleep is crucial for recovery. Here are evidence-based tips:\n\n**Sleep Hygiene Tips:**\n\n1. **Consistent Schedule** - Your current: 11 PM - 6:30 AM. Try to maintain this on weekends too.\n\n2. **Screen curfew** - Stop screens 30-60 min before bed. Blue light suppresses melatonin.\n\n3. **Room Environment:**\n   - Temperature: 18-20°C (65-68°F)\n   - Complete darkness\n   - Consider white noise\n\n4. **Pre-Sleep Routine:**\n   - Magnesium supplement (400mg)\n   - Chamomile tea\n   - Light stretching or reading\n   - Avoid caffeine after 2 PM\n\n5. **Nutrition for Sleep:**\n   - Foods rich in tryptophan: milk, curd, bananas\n   - Complex carbs before bed (helps serotonin production)\n   - Avoid heavy meals within 2 hours of sleep\n\n**Your Current Stats:**\n- Average sleep: 7.3 hours\n- Quality score: 8/10\n- Room for improvement: consistency\n\nStick to these for 2 weeks and you'll notice significant improvement in recovery and energy levels!`,
  'what should i eat post-workout?': `For optimal post-workout recovery, consume protein + carbs within 30-60 minutes:\n\n**Your Ideal Post-Workout Meal:**\n\n🥇 **Option 1 (Quick):**\n- 1 scoop whey protein + 1 banana\n- 2 tbsp peanut butter on brown bread\n- ~400 cal, 35g protein, 45g carbs\n\n🥈 **Option 2 (Full Meal):**\n- Grilled chicken breast (150g)\n- 1 cup brown rice\n- Green salad\n- ~500 cal, 48g protein, 50g carbs\n\n🥉 **Option 3 (Indian):**\n- 2 roti + paneer bhurji\n- 1 bowl dal\n- ~550 cal, 35g protein, 55g carbs\n\n**Key Principles:**\n- Protein: 30-40g (maximizes muscle protein synthesis)\n- Carbs: 40-60g (replenishes glycogen)\n- Ratio: ~1:1 protein to carbs\n- Timing: Within 30-60 min post-workout\n\nBased on your push day workout (520 cal burned), Option 1 or 2 would be ideal!`,
}

const conversationHistory = [
  { id: 'conv_1', title: 'Post-workout nutrition', time: 'Yesterday' },
  { id: 'conv_2', title: 'Weekly progress review', time: '2 days ago' },
  { id: 'conv_3', title: 'Sleep optimization tips', time: '4 days ago' },
]

export default function CoachPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI Health Coach. I'm here to help you optimize your fitness, nutrition, and overall health. What would you like to work on today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase()
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lower.includes(key) || key.split(' ').some(w => lower.includes(w) && w.length > 3)) {
        return response
      }
    }
    return `That's a great question! Based on your health profile and goals, here's what I recommend:\n\nAs your AI Health Coach, I can help you with:\n\n- 🏋️ **Workout Plans** - Personalized training programs\n- 🥗 **Nutrition Advice** - Meal plans and macro tracking\n- 😴 **Sleep Optimization** - Better rest for recovery\n- 📊 **Progress Analysis** - Weekly and monthly insights\n- 💊 **Supplement Guidance** - Evidence-based recommendations\n\nCould you be more specific about what you'd like help with? For example, ask me to "create a workout plan" or "analyze my diet".`
  }

  const sendMessage = (content?: string) => {
    const text = content || input.trim()
    if (!text) return

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: getAIResponse(text),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <AppLayout title="AI Health Coach">
      <div className="flex h-[calc(100vh-120px)] gap-0 -m-4 lg:-m-6">
        {/* Sidebar */}
        <motion.div
          className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white/5 border-r border-white/10 flex-shrink-0 overflow-hidden transition-all duration-300 hidden md:flex flex-col`}
          animate={{ width: sidebarOpen ? 256 : 0 }}
        >
          <div className="p-4 space-y-4">
            <Button className="w-full" onClick={() => {
              setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: "Hello! I'm your AI Health Coach. I'm here to help you optimize your fitness, nutrition, and overall health. What would you like to work on today?",
                timestamp: new Date(),
              }])
            }}>
              <Plus className="w-4 h-4" /> New Chat
            </Button>
            <div className="space-y-1">
              {conversationHistory.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left p-3 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  <span className="text-xs text-gray-600 ml-6">{conv.time}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">VitalX AI Coach</h2>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Suggested prompts (only show at start) */}
            {messages.length === 1 && (
              <motion.div
                className="flex flex-wrap gap-2 justify-center pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {suggestedPrompts.map((prompt, i) => (
                  <motion.button
                    key={i}
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-gray-300 hover:bg-white/20 hover:border-purple-500/50 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage(prompt)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    {prompt}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Message list */}
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  layout
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white/10 backdrop-blur-md border border-white/10 text-gray-200'
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 bg-purple-400 rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                ref={inputRef}
                placeholder="Ask your AI coach anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                className="flex-shrink-0"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
