'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell,
} from 'recharts'
import {
  Utensils, Apple, Plus, Search, Clock, ChefHat, Droplets,
  Flame, ArrowUp, ArrowDown, ShoppingCart, Camera, Sparkles,
  ChevronRight, ChevronUp, ChevronDown, Minus, GlassWater,
  Target, Zap, Salad, Beef, Wheat, Egg, Timer, Star,
  Trash2,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent, StatCard, InteractiveCard, GradientCard } from '@/components/ui/card'
import { CircularProgress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabTriggers, TabTrigger, TabContent } from '@/components/ui/tabs'
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/modal'
import { useStore } from '@/lib/store'
import { cn, generateId } from '@/lib/utils'
import type { Food, Meal } from '@/lib/types'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/5'

const CHART_COLORS = {
  purple: '#a855f7',
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  cyan: '#06b6d4',
}

const chartTooltipStyle = {
  contentStyle: {
    background: 'rgba(15, 15, 25, 0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: '12px',
  },
}

const foodDatabase: Food[] = [
  { id: 'f_001', name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, servingSize: '1 cup' },
  { id: 'f_002', name: 'Boiled Eggs (2)', calories: 156, protein: 13, carbs: 1, fat: 11, fiber: 0, servingSize: '2 eggs' },
  { id: 'f_003', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, servingSize: '1 medium' },
  { id: 'f_004', name: 'Roti (Wheat Chapati)', calories: 120, protein: 3, carbs: 22, fat: 2, fiber: 3, servingSize: '1 piece' },
  { id: 'f_005', name: 'Dal (Toor)', calories: 200, protein: 12, carbs: 30, fat: 3, fiber: 8, servingSize: '1 bowl' },
  { id: 'f_006', name: 'White Rice', calories: 206, protein: 4, carbs: 45, fat: 0, fiber: 1, servingSize: '1 cup cooked' },
  { id: 'f_007', name: 'Grilled Chicken Breast', calories: 231, protein: 43, carbs: 0, fat: 5, fiber: 0, servingSize: '150g' },
  { id: 'f_008', name: 'Paneer Bhurji', calories: 260, protein: 18, carbs: 6, fat: 18, fiber: 1, servingSize: '1 bowl' },
  { id: 'f_009', name: 'Curd / Yogurt', calories: 100, protein: 6, carbs: 8, fat: 4, fiber: 0, servingSize: '1 cup' },
  { id: 'f_010', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 4, servingSize: '28g (23 nuts)' },
  { id: 'f_011', name: 'Whey Protein Shake', calories: 130, protein: 25, carbs: 3, fat: 1, fiber: 0, servingSize: '1 scoop' },
  { id: 'f_012', name: 'Brown Bread', calories: 138, protein: 5, carbs: 24, fat: 2, fiber: 3, servingSize: '2 slices' },
  { id: 'f_013', name: 'Peanut Butter', calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2, servingSize: '2 tbsp' },
  { id: 'f_014', name: 'Whole Milk', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, servingSize: '1 glass' },
  { id: 'f_015', name: 'Sambar', calories: 180, protein: 8, carbs: 24, fat: 5, fiber: 6, servingSize: '1 bowl' },
  { id: 'f_016', name: 'Green Salad', calories: 45, protein: 2, carbs: 8, fat: 0, fiber: 3, servingSize: '1 plate' },
  { id: 'f_017', name: 'Mixed Fruits', calories: 120, protein: 2, carbs: 28, fat: 0, fiber: 5, servingSize: '1 plate' },
  { id: 'f_018', name: 'Chicken Curry', calories: 280, protein: 35, carbs: 8, fat: 12, fiber: 2, servingSize: '1 bowl' },
  { id: 'f_019', name: 'Grilled Fish', calories: 200, protein: 34, carbs: 0, fat: 7, fiber: 0, servingSize: '150g' },
  { id: 'f_020', name: 'Tomato Soup', calories: 80, protein: 3, carbs: 14, fat: 2, fiber: 2, servingSize: '1 bowl' },
  { id: 'f_021', name: 'Idli', calories: 68, protein: 2, carbs: 14, fat: 0, fiber: 1, servingSize: '2 pieces' },
  { id: 'f_022', name: 'Dosa', calories: 135, protein: 3, carbs: 22, fat: 4, fiber: 1, servingSize: '1 piece' },
  { id: 'f_023', name: 'Paratha', calories: 210, protein: 4, carbs: 30, fat: 9, fiber: 2, servingSize: '1 piece' },
  { id: 'f_024', name: 'Bhatura', calories: 250, protein: 5, carbs: 35, fat: 10, fiber: 2, servingSize: '1 piece' },
  { id: 'f_025', name: 'Chole', calories: 230, protein: 10, carbs: 30, fat: 8, fiber: 7, servingSize: '1 bowl' },
  { id: 'f_026', name: 'Rajma', calories: 210, protein: 10, carbs: 28, fat: 6, fiber: 6, servingSize: '1 bowl' },
  { id: 'f_027', name: 'Grilled Salmon', calories: 280, protein: 39, carbs: 0, fat: 13, fiber: 0, servingSize: '150g' },
  { id: 'f_028', name: 'Sweet Potato', calories: 103, protein: 2, carbs: 24, fat: 0, fiber: 4, servingSize: '1 medium' },
  { id: 'f_029', name: 'Avocado Toast', calories: 220, protein: 5, carbs: 20, fat: 14, fiber: 7, servingSize: '1 slice' },
  { id: 'f_030', name: 'Greek Yogurt', calories: 130, protein: 17, carbs: 6, fat: 5, fiber: 0, servingSize: '1 cup' },
]

const recipes = [
  { id: 'r_001', name: 'Protein Power Bowl', calories: 420, prepTime: '15 min', difficulty: 'Easy' as const, category: 'Lunch' as const, gradient: 'from-green-500/30 to-emerald-600/20', ingredients: ['Grilled Chicken', 'Brown Rice', 'Avocado', 'Spinach', 'Olive Oil'], instructions: ['Cook brown rice', 'Grill seasoned chicken breast', 'Slice avocado and arrange on bowl', 'Add fresh spinach', 'Drizzle with olive oil and lemon'] },
  { id: 'r_002', name: 'Masala Omelette', calories: 280, prepTime: '10 min', difficulty: 'Easy' as const, category: 'Breakfast' as const, gradient: 'from-amber-500/30 to-orange-600/20', ingredients: ['3 Eggs', 'Onion', 'Tomato', 'Green Chili', 'Coriander', 'Turmeric'], instructions: ['Beat eggs with spices', 'Finely chop vegetables', 'Heat pan with oil', 'Pour egg mixture with veggies', 'Cook until golden on both sides'] },
  { id: 'r_003', name: 'Dal Khichdi', calories: 350, prepTime: '25 min', difficulty: 'Easy' as const, category: 'Lunch' as const, gradient: 'from-yellow-500/30 to-amber-600/20', ingredients: ['Moong Dal', 'Basmati Rice', 'Ghee', 'Turmeric', 'Cumin', 'Ginger'], instructions: ['Wash dal and rice together', 'Heat ghee and add cumin seeds', 'Add turmeric and ginger', 'Add dal and rice with water', 'Pressure cook for 3 whistles'] },
  { id: 'r_004', name: 'Chicken Tikka Salad', calories: 310, prepTime: '20 min', difficulty: 'Medium' as const, category: 'Lunch' as const, gradient: 'from-red-500/30 to-rose-600/20', ingredients: ['Chicken Tikka', 'Mixed Greens', 'Cucumber', 'Tomato', 'Onion', 'Lemon Dressing'], instructions: ['Marinate and grill chicken tikka', 'Chop all vegetables', 'Toss greens in a large bowl', 'Top with chicken tikka pieces', 'Drizzle with lemon dressing'] },
  { id: 'r_005', name: 'Berry Smoothie', calories: 180, prepTime: '5 min', difficulty: 'Easy' as const, category: 'Smoothies' as const, gradient: 'from-purple-500/30 to-pink-600/20', ingredients: ['Mixed Berries', 'Greek Yogurt', 'Honey', 'Oats', 'Milk'], instructions: ['Add all berries to blender', 'Add Greek yogurt and milk', 'Add a tablespoon of honey', 'Throw in some oats', 'Blend until smooth'] },
  { id: 'r_006', name: 'Palak Paneer', calories: 320, prepTime: '30 min', difficulty: 'Medium' as const, category: 'Dinner' as const, gradient: 'from-emerald-500/30 to-green-600/20', ingredients: ['Paneer', 'Spinach', 'Onion', 'Garlic', 'Ginger', 'Cream'], instructions: ['Blanch and puree spinach', 'Sauté onion, garlic, ginger', 'Add spinach puree and spices', 'Add cubed paneer', 'Finish with cream'] },
  { id: 'r_007', name: 'Overnight Oats', calories: 290, prepTime: '5 min + overnight', difficulty: 'Easy' as const, category: 'Breakfast' as const, gradient: 'from-blue-500/30 to-cyan-600/20', ingredients: ['Rolled Oats', 'Milk', 'Chia Seeds', 'Honey', 'Banana', 'Almonds'], instructions: ['Mix oats with milk and chia seeds', 'Add honey and stir', 'Refrigerate overnight', 'Top with sliced banana', 'Sprinkle crushed almonds'] },
  { id: 'r_008', name: 'Protein Banana Pancakes', calories: 380, prepTime: '15 min', difficulty: 'Medium' as const, category: 'Breakfast' as const, gradient: 'from-orange-500/30 to-yellow-600/20', ingredients: ['Banana', 'Eggs', 'Whey Protein', 'Oats', 'Cinnamon'], instructions: ['Blend banana, eggs, and oats', 'Add whey protein and cinnamon', 'Heat non-stick pan', 'Pour batter into small circles', 'Cook until bubbles form, then flip'] },
  { id: 'r_009', name: 'Grilled Chicken Wrap', calories: 400, prepTime: '15 min', difficulty: 'Easy' as const, category: 'Snacks' as const, gradient: 'from-teal-500/30 to-cyan-600/20', ingredients: ['Whole Wheat Wrap', 'Grilled Chicken', 'Hummus', 'Lettuce', 'Tomato'], instructions: ['Grill seasoned chicken', 'Spread hummus on wrap', 'Layer chicken, lettuce, tomato', 'Roll tightly and cut in half', 'Serve immediately'] },
  { id: 'r_010', name: 'Ragi Smoothie', calories: 220, prepTime: '5 min', difficulty: 'Easy' as const, category: 'Smoothies' as const, gradient: 'from-rose-500/30 to-red-600/20', ingredients: ['Ragi Flour', 'Milk', 'Banana', 'Jaggery', 'Cardamom'], instructions: ['Roast ragi flour lightly', 'Mix with cold milk to avoid lumps', 'Add banana and jaggery', 'Blend until smooth', 'Sprinkle cardamom powder'] },
]

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const

function TodayTab() {
  const meals = useStore((s) => s.meals)
  const user = useStore((s) => s.user)
  const targetCalories = user?.targetCalories || 2800
  const [addFoodMeal, setAddFoodMeal] = React.useState<string | null>(null)
  const [addFoodSearch, setAddFoodSearch] = React.useState('')
  const [addFoodPortion, setAddFoodPortion] = React.useState(1)

  const today = new Date().toISOString().split('T')[0]
  const todayMeals = meals.filter((m) => m.date === today)

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0)
  const totalProtein = todayMeals.reduce((sum, m) => sum + m.totalProtein, 0)
  const totalCarbs = todayMeals.reduce((sum, m) => sum + m.totalCarbs, 0)
  const totalFat = todayMeals.reduce((sum, m) => sum + m.totalFat, 0)

  const targetProtein = 160
  const targetCarbs = 350
  const targetFat = 90

  const remaining = {
    calories: Math.max(targetCalories - totalCalories, 0),
    protein: Math.max(targetProtein - totalProtein, 0),
    carbs: Math.max(targetCarbs - totalCarbs, 0),
    fat: Math.max(targetFat - totalFat, 0),
  }

  const filteredFoods = foodDatabase.filter((f) =>
    f.name.toLowerCase().includes(addFoodSearch.toLowerCase())
  )

  const mealSections = [
    { type: 'breakfast' as const, label: 'Breakfast', icon: <Egg className="w-4 h-4" />, emoji: '🌅', time: '7:00 - 9:00 AM' },
    { type: 'lunch' as const, label: 'Lunch', icon: <Salad className="w-4 h-4" />, emoji: '☀️', time: '12:00 - 2:00 PM' },
    { type: 'dinner' as const, label: 'Dinner', icon: <Utensils className="w-4 h-4" />, emoji: '🌙', time: '7:00 - 9:00 PM' },
    { type: 'snack' as const, label: 'Snacks', icon: <Apple className="w-4 h-4" />, emoji: '🍎', time: 'Anytime' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-1">
          <Card className={cn(CARD_HOVER, 'h-full relative overflow-hidden')}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                Daily Calories
              </CardTitle>
            </CardHeader>
            <CardContent className="relative flex flex-col items-center">
              <div className="relative mb-4">
                <CircularProgress value={totalCalories} max={targetCalories} size={180} strokeWidth={12} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{totalCalories.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">of {targetCalories.toLocaleString()} kcal</span>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-3 mt-2">
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <span className="text-lg font-bold text-green-400">{remaining.calories}</span>
                  <p className="text-[10px] text-gray-500">Remaining</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <span className="text-lg font-bold text-orange-400">{totalCalories}</span>
                  <p className="text-[10px] text-gray-500">Consumed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className={cn(CARD_HOVER, 'h-full')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Macro Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Protein', current: totalProtein, target: targetProtein, color: 'bg-purple-500', textColor: 'text-purple-400', icon: '🥩' },
                  { name: 'Carbs', current: totalCarbs, target: targetCarbs, color: 'bg-blue-500', textColor: 'text-blue-400', icon: '🌾' },
                  { name: 'Fat', current: totalFat, target: targetFat, color: 'bg-amber-500', textColor: 'text-amber-400', icon: '🥑' },
                ].map((macro, i) => (
                  <div key={macro.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{macro.icon}</span>
                        <span className="text-sm font-medium text-gray-300">{macro.name}</span>
                      </div>
                      <span className={cn('text-sm font-semibold', macro.textColor)}>
                        {macro.current}g / {macro.target}g
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className={cn('h-full rounded-full', macro.color)}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-gray-600">{Math.round((macro.current / macro.target) * 100)}% of goal</span>
                      <span className="text-[10px] text-gray-600">{Math.max(macro.target - macro.current, 0)}g remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-4">
        {mealSections.map((section, sIdx) => {
          const sectionMeals = todayMeals.filter((m) => m.type === section.type)
          const sectionCalories = sectionMeals.reduce((sum, m) => sum + m.totalCalories, 0)

          return (
            <motion.div key={section.type} custom={sIdx + 2} variants={fadeInUp} initial="hidden" animate="visible">
              <Card className={cn(CARD_HOVER)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.emoji}</span>
                      <div>
                        <CardTitle>{section.label}</CardTitle>
                        <p className="text-xs text-gray-500 mt-0.5">{section.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-orange-400">{sectionCalories} kcal</span>
                      <Button variant="outline" size="sm" onClick={() => setAddFoodMeal(section.type)}>
                        <Plus className="w-4 h-4" />
                        Add Food
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {sectionMeals.length > 0 ? (
                    <div className="space-y-2">
                      {sectionMeals.map((meal) =>
                        meal.foods.map((food) => (
                          <div key={food.id + meal.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
                                <Salad className="w-5 h-5 text-green-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{food.name}</p>
                                <p className="text-xs text-gray-500">{food.servingSize}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right hidden sm:block">
                                <p className="text-xs text-gray-400">
                                  P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-orange-400 min-w-[60px] text-right">{food.calories} kcal</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      No foods logged yet. Tap &quot;Add Food&quot; to start tracking.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Modal open={addFoodMeal !== null} onClose={() => { setAddFoodMeal(null); setAddFoodSearch(''); setAddFoodPortion(1) }} size="lg">
        <ModalHeader>
          <ModalTitle>Add Food to {addFoodMeal && addFoodMeal.charAt(0).toUpperCase() + addFoodMeal.slice(1)}</ModalTitle>
          <ModalDescription>Search and select foods to add</ModalDescription>
        </ModalHeader>
        <div className="mb-4">
          <Input placeholder="Search foods..." icon={<Search className="w-4 h-4" />} value={addFoodSearch} onChange={(e) => setAddFoodSearch(e.target.value)} />
        </div>
        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
          {filteredFoods.map((food) => (
            <div key={food.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
                  <Salad className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{food.name}</p>
                  <p className="text-xs text-gray-500">{food.servingSize} · {food.calories} kcal</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAddFoodPortion(Math.max(0.5, addFoodPortion - 0.5))}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-xs text-white min-w-[24px] text-center">{addFoodPortion}x</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAddFoodPortion(addFoodPortion + 0.5)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <Button variant="success" size="sm" onClick={() => {
                  const store = useStore.getState()
                  const portionedFood = { ...food, calories: Math.round(food.calories * addFoodPortion), protein: Math.round(food.protein * addFoodPortion), carbs: Math.round(food.carbs * addFoodPortion), fat: Math.round(food.fat * addFoodPortion) }
                  const existingMeal = store.meals.find((m) => m.type === addFoodMeal && m.date === today)
                  if (existingMeal) {
                    store.addMeal({ ...existingMeal, foods: [...existingMeal.foods, portionedFood], totalCalories: existingMeal.totalCalories + portionedFood.calories, totalProtein: existingMeal.totalProtein + portionedFood.protein, totalCarbs: existingMeal.totalCarbs + portionedFood.carbs, totalFat: existingMeal.totalFat + portionedFood.fat })
                  } else {
                    store.addMeal({ id: generateId(), userId: 'user_001', name: addFoodMeal!.charAt(0).toUpperCase() + addFoodMeal!.slice(1), type: addFoodMeal as 'breakfast' | 'lunch' | 'dinner' | 'snack', foods: [portionedFood], date: today, totalCalories: portionedFood.calories, totalProtein: portionedFood.protein, totalCarbs: portionedFood.carbs, totalFat: portionedFood.fat })
                  }
                  setAddFoodMeal(null)
                  setAddFoodSearch('')
                  setAddFoodPortion(1)
                }}>
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => { setAddFoodMeal(null); setAddFoodSearch('') }}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

function MealPlannerTab() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [selectedDay, setSelectedDay] = React.useState(0)
  const [plannerMeals, setPlannerMeals] = React.useState<Record<string, Record<string, Food[]>>>(() => {
    const initial: Record<string, Record<string, Food[]>> = {}
    days.forEach((day) => {
      initial[day] = {
        Breakfast: [foodDatabase[0], foodDatabase[1]],
        Lunch: [foodDatabase[5], foodDatabase[4], foodDatabase[6]],
        Dinner: [foodDatabase[3], foodDatabase[7], foodDatabase[14]],
        Snacks: [foodDatabase[10], foodDatabase[9]],
      }
    })
    return initial
  })

  const dayCalories = days.map((day) => {
    const dayMeals = plannerMeals[day]
    let total = 0
    Object.values(dayMeals).forEach((foods) => {
      foods.forEach((f) => { total += f.calories })
    })
    return { day, calories: total }
  })

  const moveFood = (day: string, meal: string, foodIdx: number, direction: 'up' | 'down') => {
    setPlannerMeals((prev) => {
      const foods = [...prev[day][meal]]
      const newIdx = direction === 'up' ? foodIdx - 1 : foodIdx + 1
      if (newIdx < 0 || newIdx >= foods.length) return prev
      ;[foods[foodIdx], foods[newIdx]] = [foods[newIdx], foods[foodIdx]]
      return { ...prev, [day]: { ...prev[day], [meal]: foods } }
    })
  }

  return (
    <div className="space-y-6">
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Weekly Meal Plan
              </CardTitle>
              <Button variant="secondary" size="sm">
                <ShoppingCart className="w-4 h-4" />
                Shopping List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
              {days.map((day, i) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(i)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                    selectedDay === i
                      ? 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 text-white border border-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={dayCalories} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="calories" name="Calories" radius={[4, 4, 0, 0]}>
                  {dayCalories.map((_, idx) => (
                    <Cell key={idx} fill={idx === selectedDay ? CHART_COLORS.purple : 'rgba(168, 85, 247, 0.3)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <CardTitle>{days[selectedDay]}&apos;s Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mealTypes.map((mealType) => {
                const foods = plannerMeals[days[selectedDay]][mealType] || []
                const mealCals = foods.reduce((sum, f) => sum + f.calories, 0)
                return (
                  <div key={mealType} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white">{mealType}</h4>
                      <span className="text-xs text-orange-400 font-medium">{mealCals} kcal</span>
                    </div>
                    <div className="space-y-2">
                      {foods.map((food, fIdx) => (
                        <div key={food.id + fIdx} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                          <div className="flex items-center gap-2">
                            <Salad className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-300">{food.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{food.calories} kcal</span>
                            <div className="flex flex-col">
                              <button onClick={() => moveFood(days[selectedDay], mealType, fIdx, 'up')} className="text-gray-500 hover:text-white transition-colors"><ChevronUp className="w-3 h-3" /></button>
                              <button onClick={() => moveFood(days[selectedDay], mealType, fIdx, 'down')} className="text-gray-500 hover:text-white transition-colors"><ChevronDown className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function FoodSearchTab() {
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState('All')
  const [cuisine, setCuisine] = React.useState('All')
  const [selectedFood, setSelectedFood] = React.useState<Food | null>(null)
  const [portionSize, setPortionSize] = React.useState(1)
  const [addToMealType, setAddToMealType] = React.useState<string>('')

  const categories = ['All', 'Indian', 'International', 'High Protein', 'Low Calorie']
  const cuisines = ['All', 'Indian', 'American', 'Mediterranean', 'Asian']

  const filteredFoods = foodDatabase.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase())
    let matchCategory = true
    if (category === 'High Protein') matchCategory = f.protein >= 15
    else if (category === 'Low Calorie') matchCategory = f.calories <= 150
    else if (category === 'Indian') matchCategory = ['Roti (Wheat Chapati)', 'Dal (Toor)', 'White Rice', 'Paneer Bhurji', 'Chicken Curry', 'Sambar', 'Idli', 'Dosa', 'Paratha', 'Bhatura', 'Chole', 'Rajma'].some(n => f.name.includes(n))
    else if (category === 'International') matchCategory = ['Oatmeal', 'Grilled Chicken Breast', 'Grilled Fish', 'Grilled Salmon', 'Greek Yogurt', 'Avocado Toast'].some(n => f.name.includes(n))
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-6">
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input placeholder="Search foods (Indian, International, High Protein...)" icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button variant="secondary" className="flex-shrink-0">
                <Camera className="w-4 h-4" />
                Barcode Scanner
              </Button>
              <Button variant="default" className="flex-shrink-0">
                <Sparkles className="w-4 h-4" />
                AI Meal Scanner
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    category === cat
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
                  )}
                >
                  {cat}
                </button>
              ))}
              <span className="text-gray-600 mx-1">|</span>
              {cuisines.map((c) => (
                <button
                  key={c}
                  onClick={() => setCuisine(c)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    cuisine === c
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredFoods.map((food, i) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <InteractiveCard className="p-4" onClick={() => setSelectedFood(food)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
                      <Salad className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{food.name}</p>
                      <p className="text-xs text-gray-500">{food.servingSize}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-orange-400">{food.calories} kcal</span>
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span className="text-purple-400">P: {food.protein}g</span>
                    <span className="text-blue-400">C: {food.carbs}g</span>
                    <span className="text-amber-400">F: {food.fat}g</span>
                  </div>
                </div>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Modal open={selectedFood !== null} onClose={() => { setSelectedFood(null); setPortionSize(1); setAddToMealType('') }} size="md">
        {selectedFood && (
          <>
            <ModalHeader>
              <ModalTitle>{selectedFood.name}</ModalTitle>
              <ModalDescription>{selectedFood.servingSize}</ModalDescription>
            </ModalHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <span className="text-2xl font-bold text-orange-400">{Math.round(selectedFood.calories * portionSize)}</span>
                  <p className="text-xs text-gray-500">Calories</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <span className="text-2xl font-bold text-purple-400">{Math.round(selectedFood.protein * portionSize)}g</span>
                  <p className="text-xs text-gray-500">Protein</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <span className="text-2xl font-bold text-blue-400">{Math.round(selectedFood.carbs * portionSize)}g</span>
                  <p className="text-xs text-gray-500">Carbs</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <span className="text-2xl font-bold text-amber-400">{Math.round(selectedFood.fat * portionSize)}g</span>
                  <p className="text-xs text-gray-500">Fat</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Portion Size</label>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setPortionSize(Math.max(0.5, portionSize - 0.5))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold text-white min-w-[60px] text-center">{portionSize}x</span>
                  <Button variant="ghost" size="icon" onClick={() => setPortionSize(portionSize + 0.5)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Add to Meal</label>
                <div className="grid grid-cols-4 gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setAddToMealType(type)}
                      className={cn(
                        'px-3 py-2 rounded-xl text-xs font-medium transition-all',
                        addToMealType === type
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => { setSelectedFood(null); setPortionSize(1); setAddToMealType('') }}>Cancel</Button>
              <Button variant="success" disabled={!addToMealType} onClick={() => {
                const store = useStore.getState()
                const portionedFood = { ...selectedFood, calories: Math.round(selectedFood.calories * portionSize), protein: Math.round(selectedFood.protein * portionSize), carbs: Math.round(selectedFood.carbs * portionSize), fat: Math.round(selectedFood.fat * portionSize) }
                const today = new Date().toISOString().split('T')[0]
                const existingMeal = store.meals.find((m) => m.type === addToMealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack' && m.date === today)
                if (existingMeal) {
                  store.addMeal({ ...existingMeal, foods: [...existingMeal.foods, portionedFood], totalCalories: existingMeal.totalCalories + portionedFood.calories, totalProtein: existingMeal.totalProtein + portionedFood.protein, totalCarbs: existingMeal.totalCarbs + portionedFood.carbs, totalFat: existingMeal.totalFat + portionedFood.fat })
                } else {
                  store.addMeal({ id: generateId(), userId: 'user_001', name: addToMealType, type: addToMealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack', foods: [portionedFood], date: today, totalCalories: portionedFood.calories, totalProtein: portionedFood.protein, totalCarbs: portionedFood.carbs, totalFat: portionedFood.fat })
                }
                setSelectedFood(null)
                setPortionSize(1)
                setAddToMealType('')
              }}>
                Add to {addToMealType || '...'}
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </div>
  )
}

function RecipesTab() {
  const [selectedRecipe, setSelectedRecipe] = React.useState<typeof recipes[0] | null>(null)
  const [filter, setFilter] = React.useState('All')
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Smoothies']

  const filteredRecipes = filter === 'All' ? recipes : recipes.filter((r) => r.category === filter)

  const difficultyColors = { Easy: 'text-green-400', Medium: 'text-amber-400', Hard: 'text-red-400' }

  return (
    <div className="space-y-6">
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                filter === cat
                  ? 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 text-white border border-white/10'
                  : 'text-gray-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe, i) => (
          <motion.div
            key={recipe.id}
            custom={i + 1}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <InteractiveCard className="overflow-hidden" onClick={() => setSelectedRecipe(recipe)}>
              <div className={cn('h-32 bg-gradient-to-br flex items-center justify-center relative', recipe.gradient)}>
                <ChefHat className="w-12 h-12 text-white/60" />
                <div className="absolute top-3 right-3">
                  <Badge variant="default">{recipe.category}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-1">{recipe.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{recipe.calories} kcal</span>
                  <span className="flex items-center gap-1"><Timer className="w-3 h-3 text-blue-400" />{recipe.prepTime}</span>
                  <span className={cn('flex items-center gap-1', difficultyColors[recipe.difficulty])}>{recipe.difficulty}</span>
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        ))}
      </div>

      <Modal open={selectedRecipe !== null} onClose={() => setSelectedRecipe(null)} size="lg">
        {selectedRecipe && (
          <>
            <ModalHeader>
              <ModalTitle>{selectedRecipe.name}</ModalTitle>
              <ModalDescription>{selectedRecipe.category} · {selectedRecipe.calories} kcal · {selectedRecipe.prepTime}</ModalDescription>
            </ModalHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Ingredients</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-white/5 text-xs text-gray-300 border border-white/5">{ing}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Instructions</h4>
                <div className="space-y-2">
                  {selectedRecipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-3 p-2 rounded-lg bg-white/[0.03]">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                      <span className="text-sm text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ModalFooter>
              <Button variant="secondary" onClick={() => setSelectedRecipe(null)}>Close</Button>
              <Button variant="default"><Plus className="w-4 h-4" />Add to Meal Plan</Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </div>
  )
}

function WaterTab() {
  const waterIntake = useStore((s) => s.waterIntake)
  const addWater = useStore((s) => s.addWater)
  const today = new Date().toISOString().split('T')[0]

  const todayWater = waterIntake.filter((w) => w.date === today)
  const totalMl = todayWater.reduce((sum, w) => sum + w.amount, 0)
  const targetMl = 2000
  const glassesTarget = 8
  const glassesConsumed = Math.floor(totalMl / 250)

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const dayWater = waterIntake.filter((w) => w.date === dateStr)
    const dayTotal = dayWater.reduce((sum, w) => sum + w.amount, 0)
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), ml: dayTotal }
  })

  const addWaterAmount = (amount: number) => {
    addWater({
      id: generateId(),
      userId: 'user_001',
      amount,
      date: today,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER, 'relative overflow-hidden')}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/5 pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-400" />
                Water Intake
              </CardTitle>
            </CardHeader>
            <CardContent className="relative flex flex-col items-center">
              <div className="relative w-48 h-64 mb-6">
                <div className="absolute inset-0 rounded-b-3xl rounded-t-3xl border-4 border-white/10 overflow-hidden bg-white/5">
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/60 to-blue-400/40 backdrop-blur-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min((totalMl / targetMl) * 100, 100)}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  >
                    <div className="absolute inset-0 opacity-30">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-full h-1 bg-white/20 rounded-full"
                          style={{ bottom: `${i * 12}%` }}
                          animate={{ x: [0, 10, -5, 0] }}
                          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Droplets className="w-8 h-8 text-white mb-1" />
                  <span className="text-2xl font-bold text-white">{(totalMl / 1000).toFixed(1)}L</span>
                  <span className="text-xs text-gray-400">of {(targetMl / 1000).toFixed(1)}L</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button variant="default" size="lg" onClick={() => addWaterAmount(250)}>
                  <Plus className="w-4 h-4" />
                  +250ml
                </Button>
                <Button variant="secondary" size="lg" onClick={() => addWaterAmount(500)}>
                  <Plus className="w-4 h-4" />
                  +500ml
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER, 'h-full')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Daily Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {Array.from({ length: glassesTarget }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 200 }}
                    className={cn(
                      'aspect-square rounded-xl flex flex-col items-center justify-center text-xl border transition-all',
                      i < glassesConsumed
                        ? 'bg-cyan-500/20 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                        : 'bg-white/5 border-white/10'
                    )}
                  >
                    <GlassWater className={cn('w-6 h-6', i < glassesConsumed ? 'text-cyan-400' : 'text-gray-600')} />
                    <span className="text-[9px] text-gray-500 mt-1">{(i + 1) * 250}ml</span>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-2 text-center">
                <p className="text-sm text-gray-300">
                  <span className="text-cyan-400 font-semibold">{glassesConsumed}</span> of {glassesTarget} glasses
                </p>
                <p className="text-xs text-gray-500">
                  {Math.max(glassesTarget - glassesConsumed, 0)} more glasses to reach your goal
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Hydration Tip</span>
                </div>
                <p className="text-xs text-gray-300">Drink a glass of water first thing in the morning to kickstart your metabolism and stay hydrated throughout the day.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
        <Card className={cn(CARD_HOVER)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Weekly Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="ml" name="ml" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((_, idx) => (
                    <Cell key={idx} fill={idx === 6 ? CHART_COLORS.cyan : 'rgba(6, 182, 212, 0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function NutritionPage() {
  return (
    <AppLayout title="Nutrition">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <Tabs defaultValue="today">
          <TabTriggers>
            <TabTrigger value="today" label="Today" />
            <TabTrigger value="planner" label="Meal Planner" />
            <TabTrigger value="search" label="Food Search" />
            <TabTrigger value="recipes" label="Recipes" />
            <TabTrigger value="water" label="Water" />
          </TabTriggers>

          <TabContent value="today">
            <TodayTab />
          </TabContent>
          <TabContent value="planner">
            <MealPlannerTab />
          </TabContent>
          <TabContent value="search">
            <FoodSearchTab />
          </TabContent>
          <TabContent value="recipes">
            <RecipesTab />
          </TabContent>
          <TabContent value="water">
            <WaterTab />
          </TabContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
