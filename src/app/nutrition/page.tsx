"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { foods, recipes } from "@/lib/data";
import { getMeals, addMeal, getWaterLogs, addWaterLog } from "@/lib/data-operations";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  UtensilsCrossed, Search, BookOpen, Droplets, Plus, Clock, ChefHat,
  Flame, Apple, ArrowRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


const recipeIcons = ["\u{1F963}", "\u{1F35B}", "\u{1F372}", "\u{1F964}", "\u{1F958}"];

const recipeGradients = [
  "from-orange-500/20 to-red-500/20", "from-green-500/20 to-emerald-500/20",
  "from-blue-500/20 to-cyan-500/20", "from-purple-500/20 to-violet-500/20",
  "from-pink-500/20 to-rose-500/20", "from-amber-500/20 to-yellow-500/20",
];

type MealRow = { id: string; name: string; type: string; calories: number; protein_g: number; carbs_g: number; fat_g: number; logged_at: string };

interface TabProps {
  meals: MealRow[];
  waterCount: number;
  onAddMeal: (meal: Omit<MealRow, "id" | "logged_at">) => void;
  onAddWater: () => void;
  userId: string;
  onSwitchTab?: (tab: string) => void;
}

export default function NutritionPage() {
  const { user } = useAuth();
  const [meals, setMeals] = React.useState<MealRow[]>([]);
  const [waterCount, setWaterCount] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("today");

  React.useEffect(() => {
    if (!user) return;
    getMeals(user.id).then(setMeals).catch(console.error);
    getWaterLogs(user.id).then((logs) => {
      const today = new Date().toISOString().split("T")[0];
      const todayLogs = logs.filter((l: any) => l.logged_at.startsWith(today));
      setWaterCount(todayLogs.reduce((s: number, l: any) => s + l.glasses, 0));
    }).catch(console.error);
  }, [user]);

  const handleAddMeal = async (mealData: { name: string; type: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }) => {
    if (!user || !mealData.name) return;
    try {
      const meal = await addMeal(user.id, mealData);
      setMeals((prev) => [meal, ...prev]);
    } catch (e) { console.error(e); }
  };

  const handleAddWater = async () => {
    if (!user) return;
    try {
      await addWaterLog(user.id, 1);
      setWaterCount((c) => c + 1);
    } catch (e) { console.error(e); }
  };

  return (
    <AppLayout title="Nutrition">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="today"><UtensilsCrossed className="h-4 w-4 mr-1.5" />Today</TabsTrigger>
          <TabsTrigger value="planner"><BookOpen className="h-4 w-4 mr-1.5" />Meal Planner</TabsTrigger>
          <TabsTrigger value="search"><Search className="h-4 w-4 mr-1.5" />Food Search</TabsTrigger>
          <TabsTrigger value="recipes"><ChefHat className="h-4 w-4 mr-1.5" />Recipes</TabsTrigger>
          <TabsTrigger value="water"><Droplets className="h-4 w-4 mr-1.5" />Water</TabsTrigger>
        </TabsList>
        <TabsContent value="today"><TodayTab meals={meals} waterCount={waterCount} onAddMeal={handleAddMeal} onAddWater={handleAddWater} userId={user?.id || ""} onSwitchTab={setActiveTab} /></TabsContent>
        <TabsContent value="planner"><MealPlannerTab meals={meals} /></TabsContent>
        <TabsContent value="search"><FoodSearchTab onAddMeal={handleAddMeal} /></TabsContent>
        <TabsContent value="recipes"><RecipesTab /></TabsContent>
        <TabsContent value="water"><WaterTab waterCount={waterCount} onAddWater={handleAddWater} /></TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function TodayTab({ meals, onSwitchTab }: TabProps) {
  const today = new Date().toISOString().split("T")[0];
  const todayMeals = meals.filter((m) => m.logged_at?.startsWith(today));
  const totalCalories = todayMeals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalProtein = todayMeals.reduce((s, m) => s + (m.protein_g || 0), 0);
  const totalCarbs = todayMeals.reduce((s, m) => s + (m.carbs_g || 0), 0);
  const totalFat = todayMeals.reduce((s, m) => s + (m.fat_g || 0), 0);

  const targets = { calories: 2200, protein: 160, carbs: 280, fat: 80 };
  const calPct = totalCalories > 0 ? Math.round((totalCalories / targets.calories) * 100) : 0;
  const totalMacros = totalProtein + totalCarbs + totalFat || 1;

  if (todayMeals.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <Apple className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No meals logged today</h3>
        <p className="text-zinc-400 text-sm mb-6">Start tracking your nutrition by logging your first meal.</p>
        <Button onClick={() => onSwitchTab?.("search")} className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all">
          Log Your First Meal <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    );
  }

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
                <span className="text-3xl font-bold text-white">{totalCalories}</span>
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
                { label: "Protein", current: totalProtein, goal: targets.protein, color: "bg-emerald-500" },
                { label: "Carbs", current: totalCarbs, goal: targets.carbs, color: "bg-blue-500" },
                { label: "Fat", current: totalFat, goal: targets.fat, color: "bg-amber-500" },
              ].map((macro) => (
                <div key={macro.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-zinc-300">{macro.label}</span>
                    <span className="text-sm text-zinc-400">{Math.round(macro.current)}g / {macro.goal}g</span>
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
                <div className="text-lg font-bold text-emerald-400">{Math.round(totalProtein)}g</div>
                <div className="text-xs text-zinc-500">Protein ({Math.round((totalProtein / totalMacros) * 100)}%)</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-blue-400">{Math.round(totalCarbs)}g</div>
                <div className="text-xs text-zinc-500">Carbs ({Math.round((totalCarbs / totalMacros) * 100)}%)</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-amber-400">{Math.round(totalFat)}g</div>
                <div className="text-xs text-zinc-500">Fat ({Math.round((totalFat / totalMacros) * 100)}%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Today&apos;s Meals</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayMeals.map((meal, i) => (
              <motion.div key={meal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-800/40">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm">
                    {meal.type?.[0]?.toUpperCase() || "M"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-white">{meal.name}</span>
                        <span className="text-xs text-zinc-500 ml-2 capitalize">{meal.type}</span>
                      </div>
                      <span className="text-sm font-bold text-violet-400">{meal.calories} kcal</span>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-zinc-500">
                      <span>P: {meal.protein_g}g</span>
                      <span>C: {meal.carbs_g}g</span>
                      <span>F: {meal.fat_g}g</span>
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

function MealPlannerTab({ meals }: { meals: MealRow[] }) {
  const thisWeek = React.useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekMeals: Record<string, MealRow[]> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - dayOfWeek + i);
      const key = d.toISOString().split("T")[0];
      weekMeals[key] = meals.filter((m) => m.logged_at?.startsWith(key));
    }
    return weekMeals;
  }, [meals]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const weekData = days.map((day, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const key = d.toISOString().split("T")[0];
    const dayMeals = thisWeek[key] || [];
    const total = dayMeals.reduce((s, m) => s + (m.calories || 0), 0);
    return { day, calories: total, isToday: key === now.toISOString().split("T")[0] };
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">This Week&apos;s Calories</CardTitle></CardHeader>
        <CardContent>
          {weekData.some((d) => d.calories > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, color: "#fff" }} />
                <Bar dataKey="calories" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-sm">No meals logged this week.</p>
              <p className="text-zinc-500 text-xs mt-1">Start logging meals to see your weekly chart.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Daily Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {weekData.map((d) => (
              <div key={d.day} className={cn("flex items-center justify-between p-3 rounded-xl", d.isToday ? "bg-violet-500/10 border border-violet-500/20" : "bg-zinc-800/30")}>
                <div className="flex items-center gap-3">
                  <span className={cn("text-sm font-medium w-8", d.isToday ? "text-violet-400" : "text-zinc-400")}>{d.day}</span>
                  {d.isToday && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300">Today</span>}
                </div>
                <span className="text-sm font-medium text-white">{d.calories > 0 ? `${d.calories} kcal` : "\u2014"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FoodSearchTab({ onAddMeal }: { onAddMeal: (meal: { name: string; type: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }) => void }) {
  const [search, setSearch] = React.useState("");
  const [addedIds, setAddedIds] = React.useState<Set<string>>(new Set());

  const foodList = (foods as any[]) || [];
  const filteredFoods = foodList.filter((f: any) => f.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (food: any) => {
    onAddMeal({
      name: food.name,
      type: "snack",
      calories: food.calories,
      protein_g: food.protein,
      carbs_g: food.carbs,
      fat_g: food.fat,
    });
    setAddedIds((prev) => new Set(prev).add(food.id));
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
            <Card className={cn("transition-all", addedIds.has(food.id) && "border-emerald-500/30 bg-emerald-500/5")}>
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
                  size="sm" variant={addedIds.has(food.id) ? "success" : "outline"} className="w-full"
                  onClick={() => handleAdd(food)}
                >
                  {addedIds.has(food.id) ? "\u2713 Added" : <><Plus className="h-3 w-3" /> Add</>}
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

function WaterTab({ waterCount, onAddWater }: { waterCount: number; onAddWater: () => void }) {
  const goalGlasses = 8;

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
                  animate={{ y: 170 - (waterCount / goalGlasses) * 160, height: (waterCount / goalGlasses) * 160 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{waterCount}</span>
              <span className="text-xs text-cyan-400">/ {goalGlasses} glasses</span>
            </div>
          </div>
          <p className="text-sm text-zinc-300 mb-4">{waterCount * 250}ml of {goalGlasses * 250}ml daily goal</p>
          <div className="flex gap-3">
            <Button onClick={onAddWater} className="bg-cyan-600 hover:bg-cyan-500">
              <Plus className="h-4 w-4" /> +250ml
            </Button>
          </div>
        </CardContent>
      </Card>

      {waterCount === 0 && (
        <Card className="p-8 text-center">
          <Droplets className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-white mb-1">No water logged today</h3>
          <p className="text-xs text-zinc-400">Tap the button above to log your first glass.</p>
        </Card>
      )}
    </div>
  );
}
