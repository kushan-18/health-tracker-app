"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { foods, recipes, nutritionData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  UtensilsCrossed, Search, BookOpen, Droplets, Plus, Clock, ChefHat,
  Flame,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const nd = nutritionData as any;

const dailyMeals = [
  { type: "Breakfast", time: "8:00 AM", items: ["Masala Oats", "Boiled Eggs (2)", "Banana"], calories: 410 },
  { type: "Lunch", time: "1:00 PM", items: ["Chicken Biryani", "Raita"], calories: 520 },
  { type: "Snack", time: "4:00 PM", items: ["Almonds", "Greek Yogurt"], calories: 264 },
  { type: "Dinner", time: "7:30 PM", items: ["Dal Tadka", "Roti (2)", "Palak Paneer"], calories: 630 },
];

const weeklyCalories = [
  { day: "Mon", calories: 2100 }, { day: "Tue", calories: 2350 }, { day: "Wed", calories: 1950 },
  { day: "Thu", calories: 2200 }, { day: "Fri", calories: 2450 }, { day: "Sat", calories: 2600 }, { day: "Sun", calories: 2050 },
];

const recipeIcons = ["🥣", "🍛", "🍲", "🥤", "🥘"];

const recipeGradients = [
  "from-orange-500/20 to-red-500/20", "from-green-500/20 to-emerald-500/20",
  "from-blue-500/20 to-cyan-500/20", "from-purple-500/20 to-violet-500/20",
  "from-pink-500/20 to-rose-500/20", "from-amber-500/20 to-yellow-500/20",
];

export default function NutritionPage() {
  return (
    <AppLayout title="Nutrition">
      <Tabs defaultValue="today">
        <TabsList className="mb-6">
          <TabsTrigger value="today"><UtensilsCrossed className="h-4 w-4 mr-1.5" />Today</TabsTrigger>
          <TabsTrigger value="planner"><BookOpen className="h-4 w-4 mr-1.5" />Meal Planner</TabsTrigger>
          <TabsTrigger value="search"><Search className="h-4 w-4 mr-1.5" />Food Search</TabsTrigger>
          <TabsTrigger value="recipes"><ChefHat className="h-4 w-4 mr-1.5" />Recipes</TabsTrigger>
          <TabsTrigger value="water"><Droplets className="h-4 w-4 mr-1.5" />Water</TabsTrigger>
        </TabsList>
        <TabsContent value="today"><TodayTab /></TabsContent>
        <TabsContent value="planner"><MealPlannerTab /></TabsContent>
        <TabsContent value="search"><FoodSearchTab /></TabsContent>
        <TabsContent value="recipes"><RecipesTab /></TabsContent>
        <TabsContent value="water"><WaterTab /></TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function TodayTab() {
  const daily = nd.daily || { calories: 1847, protein: 128, carbs: 220, fat: 65 };
  const targets = nd.targets || { calories: 2200, protein: 160, carbs: 280, fat: 80 };
  const calPct = Math.round((daily.calories / targets.calories) * 100);
  const totalMacros = daily.protein + daily.carbs + daily.fat;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg width="160" height="160" className="-rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="url(#nutGrad)" strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - calPct / 100)}
                  strokeLinecap="round" className="transition-all duration-1000" />
                <defs>
                  <linearGradient id="nutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{daily.calories}</span>
                <span className="text-xs text-zinc-400">/ {targets.calories} kcal</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 mt-3">{calPct}% of daily goal</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">Macronutrients</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Protein", current: daily.protein, goal: targets.protein, color: "bg-emerald-500" },
                { label: "Carbs", current: daily.carbs, goal: targets.carbs, color: "bg-blue-500" },
                { label: "Fat", current: daily.fat, goal: targets.fat, color: "bg-amber-500" },
              ].map((macro) => (
                <div key={macro.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-zinc-300">{macro.label}</span>
                    <span className="text-sm text-zinc-400">{macro.current}g / {macro.goal}g</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-zinc-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((macro.current / macro.goal) * 100, 100)}%` }}
                      transition={{ duration: 0.8 }}
                      className={cn("h-full rounded-full", macro.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t border-zinc-800">
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-emerald-400">{daily.protein}g</div>
                <div className="text-xs text-zinc-500">Protein ({Math.round((daily.protein / totalMacros) * 100)}%)</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-blue-400">{daily.carbs}g</div>
                <div className="text-xs text-zinc-500">Carbs ({Math.round((daily.carbs / totalMacros) * 100)}%)</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-amber-400">{daily.fat}g</div>
                <div className="text-xs text-zinc-500">Fat ({Math.round((daily.fat / totalMacros) * 100)}%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Today&apos;s Meals</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyMeals.map((meal, i) => (
              <motion.div key={meal.type} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm">
                    {meal.type[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-white">{meal.type}</span>
                        <span className="text-xs text-zinc-500 ml-2">{meal.time}</span>
                      </div>
                      <span className="text-sm font-bold text-violet-400">{meal.calories} kcal</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {meal.items.map((food) => (
                        <span key={food} className="px-2 py-0.5 rounded-md bg-zinc-700/50 text-xs text-zinc-300">{food}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MealPlannerTab() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const plannedMeals = [
    { breakfast: "Oats + Eggs", lunch: "Chicken Rice", dinner: "Dal Roti", snack: "Fruits" },
    { breakfast: "Smoothie Bowl", lunch: "Paneer Tikka", dinner: "Grilled Salmon", snack: "Nuts" },
    { breakfast: "Poha + Tea", lunch: "Biryani", dinner: "Sabzi Roti", snack: "Yogurt" },
    { breakfast: "Masala Oats", lunch: "Rajma Chawal", dinner: "Fish Curry", snack: "Protein Bar" },
    { breakfast: "Idli Sambar", lunch: "Butter Chicken", dinner: "Dal Rice", snack: "Banana" },
    { breakfast: "Paratha", lunch: "Chole Bhature", dinner: "Tandoori Roti", snack: "Samosa" },
    { breakfast: "Egg Bhurji", lunch: "Palak Paneer", dinner: "Grilled Chicken", snack: "Smoothie" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Weekly Meal Plan</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => (
              <div key={day} className="text-center">
                <div className="text-xs font-bold text-violet-400 mb-2">{day}</div>
                <div className="space-y-2">
                  {(["Breakfast", "Lunch", "Dinner"] as const).map((meal) => (
                    <div key={meal} className="p-2 rounded-lg bg-zinc-800/50 text-[10px] text-zinc-300 leading-tight">
                      <div className="font-medium text-zinc-400 mb-0.5">{meal.slice(0, 3)}</div>
                      {plannedMeals[i][meal.toLowerCase() as keyof typeof plannedMeals[0]]}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Daily Calorie Targets</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyCalories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="calories" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function FoodSearchTab() {
  const [search, setSearch] = React.useState("");
  const [addedFoods, setAddedFoods] = React.useState<Set<string>>(new Set());

  const foodList = (foods as any[]) || [];
  const filteredFoods = foodList.filter((f: any) => f.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (id: string) => {
    setAddedFoods((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search foods (e.g. dal, paneer, chicken)..."
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <p className="text-xs text-zinc-500">{filteredFoods.length} foods found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredFoods.map((food: any, i: number) => (
          <motion.div key={food.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}>
            <Card className={cn("transition-all", addedFoods.has(food.id) && "border-emerald-500/30 bg-emerald-500/5")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-white">{food.name}</h3>
                    <p className="text-xs text-zinc-500">{food.serving}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/15 text-blue-400">
                    {food.category}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center mb-3">
                  <div><div className="text-sm font-bold text-white">{food.calories}</div><div className="text-[10px] text-zinc-500">kcal</div></div>
                  <div><div className="text-sm font-bold text-emerald-400">{food.protein}g</div><div className="text-[10px] text-zinc-500">Protein</div></div>
                  <div><div className="text-sm font-bold text-blue-400">{food.carbs}g</div><div className="text-[10px] text-zinc-500">Carbs</div></div>
                  <div><div className="text-sm font-bold text-amber-400">{food.fat}g</div><div className="text-[10px] text-zinc-500">Fat</div></div>
                </div>
                <Button
                  size="sm" variant={addedFoods.has(food.id) ? "success" : "outline"} className="w-full"
                  onClick={() => handleAdd(food.id)}
                >
                  {addedFoods.has(food.id) ? "✓ Added" : <><Plus className="h-3 w-3" /> Add</>}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RecipesTab() {
  const recipeList = (recipes as any[]) || [];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipeList.map((recipe: any, i: number) => (
        <motion.div key={recipe.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className={cn("bg-gradient-to-br overflow-hidden", recipeGradients[i % recipeGradients.length])}>
            <CardContent className="p-0">
              <div className="h-32 flex items-center justify-center text-6xl">{recipeIcons[i % recipeIcons.length]}</div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-white mb-1">{recipe.name}</h3>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.time} min</span>
                  <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {recipe.calories} kcal</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/10">{recipe.category}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <div className="text-center flex-1 rounded-lg bg-white/5 py-1">
                    <div className="text-xs font-bold text-emerald-400">{recipe.protein}g</div>
                    <div className="text-[10px] text-zinc-500">Protein</div>
                  </div>
                  <div className="text-center flex-1 rounded-lg bg-white/5 py-1">
                    <div className="text-xs font-bold text-blue-400">{recipe.carbs}g</div>
                    <div className="text-[10px] text-zinc-500">Carbs</div>
                  </div>
                  <div className="text-center flex-1 rounded-lg bg-white/5 py-1">
                    <div className="text-xs font-bold text-amber-400">{recipe.fat}g</div>
                    <div className="text-[10px] text-zinc-500">Fat</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function WaterTab() {
  const [glasses, setGlasses] = React.useState(6);
  const goalGlasses = 8;
  const weeklyWater = [
    { day: "Mon", ml: 2200 }, { day: "Tue", ml: 2500 }, { day: "Wed", ml: 1800 },
    { day: "Thu", ml: 2400 }, { day: "Fri", ml: 2000 }, { day: "Sat", ml: 2600 }, { day: "Sun", ml: 1500 },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
        <CardContent className="p-8 flex flex-col items-center">
          <div className="relative w-40 h-56 mb-6">
            <svg viewBox="0 0 120 180" className="w-full h-full">
              <defs>
                <clipPath id="bottleClip">
                  <path d="M35,30 L35,20 Q35,10 45,10 L75,10 Q85,10 85,20 L85,30 Q95,40 95,60 L95,160 Q95,170 85,170 L35,170 Q25,170 25,160 L25,60 Q25,40 35,30Z" />
                </clipPath>
              </defs>
              <path d="M35,30 L35,20 Q35,10 45,10 L75,10 Q85,10 85,20 L85,30 Q95,40 95,60 L95,160 Q95,170 85,170 L35,170 Q25,170 25,160 L25,60 Q25,40 35,30Z" fill="none" stroke="#27272a" strokeWidth="2" />
              <g clipPath="url(#bottleClip)">
                <motion.rect
                  x="25" width="70" rx="0"
                  fill="#06b6d4" fillOpacity="0.3"
                  initial={{ y: 170, height: 0 }}
                  animate={{ y: 170 - (glasses / goalGlasses) * 160, height: (glasses / goalGlasses) * 160 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{glasses}</span>
              <span className="text-xs text-cyan-400">/ {goalGlasses} glasses</span>
            </div>
          </div>
          <p className="text-sm text-zinc-300 mb-4">{glasses * 250}ml of {goalGlasses * 250}ml daily goal</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setGlasses((g) => Math.max(0, g - 1))}>-250ml</Button>
            <Button onClick={() => setGlasses((g) => Math.min(goalGlasses + 4, g + 1))} className="bg-cyan-600 hover:bg-cyan-500">
              <Plus className="h-4 w-4" /> +250ml
            </Button>
            <Button onClick={() => setGlasses((g) => Math.min(goalGlasses + 4, g + 2))} className="bg-blue-600 hover:bg-blue-500">
              <Plus className="h-4 w-4" /> +500ml
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Weekly Water Intake</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyWater}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="ml" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
