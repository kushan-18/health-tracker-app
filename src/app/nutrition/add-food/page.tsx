'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Search, Plus, Minus, ArrowLeft, Clock, Utensils, Salad,
  Flame, Target, Zap, Trash2, Save, ChevronRight,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import { cn, generateId } from '@/lib/utils'
import type { Food } from '@/lib/types'
import { useRouter } from 'next/navigation'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

const CARD_HOVER = 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/5'

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

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const

export default function AddFoodPage() {
  const router = useRouter()
  const meals = useStore((s) => s.meals)
  const addMeal = useStore((s) => s.addMeal)
  const today = new Date().toISOString().split('T')[0]

  const [search, setSearch] = React.useState('')
  const [selectedFood, setSelectedFood] = React.useState<Food | null>(null)
  const [portionSize, setPortionSize] = React.useState(1)
  const [addToMealType, setAddToMealType] = React.useState<string>('')
  const [activeTab, setActiveTab] = React.useState<'search' | 'recent' | 'custom'>('search')

  const [customFood, setCustomFood] = React.useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: '',
  })

  const filteredFoods = foodDatabase.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const recentFoods = React.useMemo(() => {
    const todayMeals = meals.filter((m) => m.date === today)
    const recentMap = new Map<string, Food>()
    todayMeals.forEach((meal) => {
      meal.foods.forEach((food) => {
        if (!recentMap.has(food.id)) {
          recentMap.set(food.id, food)
        }
      })
    })
    return Array.from(recentMap.values()).slice(0, 8)
  }, [meals, today])

  const addFoodToMeal = (food: Food) => {
    if (!addToMealType) return
    const portionedFood = {
      ...food,
      calories: Math.round(food.calories * portionSize),
      protein: Math.round(food.protein * portionSize),
      carbs: Math.round(food.carbs * portionSize),
      fat: Math.round(food.fat * portionSize),
    }
    const existingMeal = meals.find(
      (m) => m.type === addToMealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack' && m.date === today
    )
    if (existingMeal) {
      addMeal({
        ...existingMeal,
        foods: [...existingMeal.foods, portionedFood],
        totalCalories: existingMeal.totalCalories + portionedFood.calories,
        totalProtein: existingMeal.totalProtein + portionedFood.protein,
        totalCarbs: existingMeal.totalCarbs + portionedFood.carbs,
        totalFat: existingMeal.totalFat + portionedFood.fat,
      })
    } else {
      addMeal({
        id: generateId(),
        userId: 'user_001',
        name: addToMealType,
        type: addToMealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        foods: [portionedFood],
        date: today,
        totalCalories: portionedFood.calories,
        totalProtein: portionedFood.protein,
        totalCarbs: portionedFood.carbs,
        totalFat: portionedFood.fat,
      })
    }
    setSelectedFood(null)
    setPortionSize(1)
    router.push('/nutrition')
  }

  const addCustomFood = () => {
    if (!customFood.name || !customFood.calories || !addToMealType) return
    const newFood: Food = {
      id: generateId(),
      name: customFood.name,
      calories: Number(customFood.calories),
      protein: Number(customFood.protein) || 0,
      carbs: Number(customFood.carbs) || 0,
      fat: Number(customFood.fat) || 0,
      fiber: 0,
      servingSize: customFood.servingSize || '1 serving',
    }
    addFoodToMeal(newFood)
  }

  return (
    <AppLayout title="Add Food">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Back to Nutrition
          </Button>
        </motion.div>

        <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardContent className="pt-6">
              <div className="flex gap-2 mb-4">
                {(['search', 'recent', 'custom'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                      activeTab === tab
                        ? 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 text-white border border-white/10'
                        : 'text-gray-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10'
                    )}
                  >
                    {tab === 'search' ? 'Search Foods' : tab === 'recent' ? 'Recently Eaten' : 'Custom Entry'}
                  </button>
                ))}
              </div>

              {activeTab === 'search' && (
                <Input
                  placeholder="Search Indian & International foods..."
                  icon={<Search className="w-4 h-4" />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {activeTab === 'search' && (
          <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFoods.map((food, i) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <InteractiveCard className="p-4" onClick={() => setSelectedFood(food)}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
                        <Salad className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{food.name}</p>
                        <p className="text-xs text-gray-500">{food.servingSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-400">{food.calories} kcal</span>
                      <div className="flex gap-2 text-xs text-gray-400">
                        <span className="text-purple-400">P:{food.protein}g</span>
                        <span className="text-blue-400">C:{food.carbs}g</span>
                        <span className="text-amber-400">F:{food.fat}g</span>
                      </div>
                    </div>
                  </InteractiveCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'recent' && (
          <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
            {recentFoods.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentFoods.map((food, i) => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <InteractiveCard className="p-4" onClick={() => setSelectedFood(food)}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{food.name}</p>
                          <p className="text-xs text-gray-500">{food.servingSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-400">{food.calories} kcal</span>
                        <Badge variant="info">Recent</Badge>
                      </div>
                    </InteractiveCard>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className={cn(CARD_HOVER)}>
                <CardContent className="py-12 text-center">
                  <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No foods logged today yet.</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'custom' && (
          <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
            <Card className={cn(CARD_HOVER)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-400" />
                  Create Custom Food
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Food Name"
                    placeholder="e.g., Homemade Chicken Biryani"
                    value={customFood.name}
                    onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                  />
                  <Input
                    label="Serving Size"
                    placeholder="e.g., 1 plate, 1 bowl, 150g"
                    value={customFood.servingSize}
                    onChange={(e) => setCustomFood({ ...customFood, servingSize: e.target.value })}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Input
                      label="Calories"
                      type="number"
                      placeholder="kcal"
                      value={customFood.calories}
                      onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                    />
                    <Input
                      label="Protein"
                      type="number"
                      placeholder="grams"
                      value={customFood.protein}
                      onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                    />
                    <Input
                      label="Carbs"
                      type="number"
                      placeholder="grams"
                      value={customFood.carbs}
                      onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                    />
                    <Input
                      label="Fat"
                      type="number"
                      placeholder="grams"
                      value={customFood.fat}
                      onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
          <Card className={cn(CARD_HOVER)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-purple-400" />
                Add to Meal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {mealTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setAddToMealType(type)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-all text-center',
                      addToMealType === type
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                        : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <span className="text-lg block mb-1">
                      {type === 'Breakfast' ? '🌅' : type === 'Lunch' ? '☀️' : type === 'Dinner' ? '🌙' : '🍎'}
                    </span>
                    {type}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {selectedFood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-x-0 bottom-0 z-50 p-4"
          >
            <Card className="max-w-2xl mx-auto border-purple-500/30 bg-gray-900/98 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{selectedFood.name}</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedFood(null)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: 'Calories', value: Math.round(selectedFood.calories * portionSize), color: 'text-orange-400', bg: 'bg-orange-500/10' },
                    { label: 'Protein', value: `${Math.round(selectedFood.protein * portionSize)}g`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Carbs', value: `${Math.round(selectedFood.carbs * portionSize)}g`, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Fat', value: `${Math.round(selectedFood.fat * portionSize)}g`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  ].map((m) => (
                    <div key={m.label} className={cn('text-center p-2 rounded-xl', m.bg)}>
                      <span className={cn('text-lg font-bold', m.color)}>{m.value}</span>
                      <p className="text-[10px] text-gray-500">{m.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-300">Portion Size</span>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPortionSize(Math.max(0.5, portionSize - 0.5))}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold text-white min-w-[40px] text-center">{portionSize}x</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPortionSize(portionSize + 0.5)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  variant="success"
                  size="lg"
                  className="w-full"
                  disabled={!addToMealType}
                  onClick={() => addFoodToMeal(selectedFood)}
                >
                  <Save className="w-4 h-4" />
                  Add to {addToMealType || 'Select Meal Type'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'custom' && customFood.name && customFood.calories && addToMealType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-x-0 bottom-0 z-50 p-4"
          >
            <Card className="max-w-2xl mx-auto border-green-500/30 bg-gray-900/98 backdrop-blur-xl">
              <CardContent className="pt-6">
                <Button variant="success" size="lg" className="w-full" onClick={addCustomFood}>
                  <Plus className="w-4 h-4" />
                  Add Custom Food to {addToMealType}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}

function InteractiveCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-black/10',
        'transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
