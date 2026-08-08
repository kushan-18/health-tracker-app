"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { foods, recipes } from "@/lib/data";
import { getMeals, addMeal, deleteMeal, getWaterLogs, addWaterLog } from "@/lib/data-operations";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  UtensilsCrossed, Search, BookOpen, Droplets, Plus, Clock, ChefHat,
  Flame, Apple, ArrowRight, Trash2, Camera, AlertTriangle, Minus, X,
  Loader2, Upload, Save,
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
  onDeleteMeal: (mealId: string) => void;
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

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteMeal(mealId);
      setMeals((prev) => prev.filter((m) => m.id !== mealId));
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
        <TabsContent value="today"><TodayTab meals={meals} waterCount={waterCount} onAddMeal={handleAddMeal} onDeleteMeal={handleDeleteMeal} onAddWater={handleAddWater} userId={user?.id || ""} onSwitchTab={setActiveTab} /></TabsContent>
        <TabsContent value="planner"><MealPlannerTab meals={meals} /></TabsContent>
        <TabsContent value="search"><FoodSearchTab onAddMeal={handleAddMeal} userId={user?.id || ""} /></TabsContent>
        <TabsContent value="recipes"><RecipesTab /></TabsContent>
        <TabsContent value="water"><WaterTab waterCount={waterCount} onAddWater={handleAddWater} /></TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function TodayTab({ meals, onDeleteMeal, onSwitchTab }: TabProps) {
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
                { label: "Protein", current: totalProtein, goal: targets.protein, grad: "grad-bar-emerald" },
                { label: "Carbs", current: totalCarbs, goal: targets.carbs, grad: "grad-bar-blue" },
                { label: "Fat", current: totalFat, goal: targets.fat, grad: "grad-bar-amber" },
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
                      className={cn("h-full rounded-full", macro.grad)}
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-violet-400">{meal.calories} kcal</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${meal.name}"?`)) {
                              onDeleteMeal(meal.id);
                            }
                          }}
                          className="text-zinc-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          title="Delete meal"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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

function FoodSearchTab({ onAddMeal, userId }: { onAddMeal: (meal: { name: string; type: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }) => void; userId: string }) {
  const [subTab, setSubTab] = React.useState<"search" | "recent" | "photo" | "custom">("search");

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800">
        {([
          { key: "search" as const, label: "Search", icon: Search },
          { key: "recent" as const, label: "Recent", icon: Clock },
          { key: "photo" as const, label: "Photo", icon: Camera },
          { key: "custom" as const, label: "Custom", icon: Plus },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer",
              subTab === key
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>
      {subTab === "search" && <SearchSubTab onAddMeal={onAddMeal} />}
      {subTab === "recent" && <RecentSubTab onAddMeal={onAddMeal} userId={userId} />}
      {subTab === "photo" && <PhotoSubTab onAddMeal={onAddMeal} userId={userId} />}
      {subTab === "custom" && <CustomSubTab onAddMeal={onAddMeal} />}
    </div>
  );
}

function QuantityStepper({ quantity, onChange }: { quantity: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => { e.stopPropagation(); onChange(Math.max(1, quantity - 1)); }}
        className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-6 text-center text-xs font-medium text-white">{quantity}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onChange(quantity + 1); }}
        className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

type FoodItem = { id: string; name: string; calories: number; protein: number; carbs: number; fat: number; serving: string; category: string };

function SearchSubTab({ onAddMeal }: { onAddMeal: (meal: { name: string; type: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }) => void }) {
  const [search, setSearch] = React.useState("");
  const [quantities, setQuantities] = React.useState<Map<string, number>>(new Map());
  const [addedIds, setAddedIds] = React.useState<Set<string>>(new Set());

  const foodList = (foods as FoodItem[]) || [];
  const filteredFoods = foodList.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const getQty = (id: string) => quantities.get(id) || 1;

  const updateQty = (id: string, q: number) => {
    setQuantities((prev) => {
      const next = new Map(prev);
      next.set(id, Math.max(1, q));
      return next;
    });
  };

  const handleAdd = (food: FoodItem) => {
    const qty = getQty(food.id);
    onAddMeal({
      name: food.name,
      type: "snack",
      calories: food.calories * qty,
      protein_g: food.protein * qty,
      carbs_g: food.carbs * qty,
      fat_g: food.fat * qty,
    });
    setAddedIds((prev) => new Set(prev).add(food.id));
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(food.id); return n; }), 1500);
  };

  return (
    <div className="space-y-3">
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
        {filteredFoods.map((food, i) => (
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
                <div className="flex items-center gap-2">
                  <QuantityStepper quantity={getQty(food.id)} onChange={(q) => updateQty(food.id, q)} />
                  <Button
                    size="sm" variant={addedIds.has(food.id) ? "success" : "outline"} className="flex-1"
                    onClick={() => handleAdd(food)}
                  >
                    {addedIds.has(food.id) ? "\u2713 Added" : <><Plus className="h-3 w-3" /> Add</>}
                  </Button>
                </div>
                {getQty(food.id) > 1 && (
                  <p className="text-[10px] text-zinc-500 mt-1 text-right">
                    {getQty(food.id)}× {food.calories} = <span className="text-emerald-400">{food.calories * getQty(food.id)} kcal</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RecentSubTab({ onAddMeal, userId }: { onAddMeal: (meal: { name: string; type: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }) => void; userId: string }) {
  const [recentMeals, setRecentMeals] = React.useState<{ name: string; calories: number; protein: number; carbs: number; fat: number; time: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [addedNames, setAddedNames] = React.useState<Set<string>>(new Set());
  const [quantities, setQuantities] = React.useState<Map<string, number>>(new Map());

  React.useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getMeals(userId).then((meals) => {
      const seen = new Map<string, { name: string; calories: number; protein: number; carbs: number; fat: number; time: string }>();
      for (const m of meals) {
        if (!seen.has(m.name)) {
          const d = new Date(m.logged_at);
          const now = new Date();
          const diffMs = now.getTime() - d.getTime();
          const diffDays = Math.floor(diffMs / 86400000);
          let timeLabel = "";
          if (diffDays === 0) timeLabel = `Today, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
          else if (diffDays === 1) timeLabel = `Yesterday, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
          else timeLabel = `${diffDays} days ago`;
          seen.set(m.name, {
            name: m.name,
            calories: m.calories,
            protein: m.protein_g,
            carbs: m.carbs_g,
            fat: m.fat_g,
            time: timeLabel,
          });
        }
      }
      if (!cancelled) setRecentMeals(Array.from(seen.values()).slice(0, 10));
    }).catch(console.error).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  const getQty = (name: string) => quantities.get(name) || 1;
  const updateQty = (name: string, q: number) => {
    setQuantities((prev) => { const n = new Map(prev); n.set(name, Math.max(1, q)); return n; });
  };

  const handleAdd = (food: typeof recentMeals[number]) => {
    const qty = getQty(food.name);
    onAddMeal({ name: food.name, type: "snack", calories: food.calories * qty, protein_g: food.protein * qty, carbs_g: food.carbs * qty, fat_g: food.fat * qty });
    setAddedNames((prev) => new Set(prev).add(food.name));
    setTimeout(() => setAddedNames((prev) => { const n = new Set(prev); n.delete(food.name); return n; }), 1500);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 text-zinc-500 animate-spin" /></div>;
  if (recentMeals.length === 0) return (
    <div className="text-center py-12">
      <Clock className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
      <p className="text-sm text-zinc-400">No recent meals found.</p>
      <p className="text-xs text-zinc-600 mt-1">Log some meals first, then they will appear here.</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {recentMeals.map((food, i) => (
        <motion.div key={food.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">{food.name}</div>
              <div className="text-xs text-zinc-500">{food.time} · {food.calories} kcal</div>
            </div>
            <div className="flex items-center gap-2">
              <QuantityStepper quantity={getQty(food.name)} onChange={(q) => updateQty(food.name, q)} />
              <Button size="sm" variant={addedNames.has(food.name) ? "success" : "outline"} onClick={() => handleAdd(food)}>
                {addedNames.has(food.name) ? "\u2713" : <Plus className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

type AnalyzedFood = { name: string; serving: string; calories: number; protein: number; carbs: number; fat: number; quantity: number };

function PhotoSubTab({ onAddMeal, userId }: { onAddMeal: (meal: { name: string; type: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }) => void; userId: string }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [analyzedItems, setAnalyzedItems] = React.useState<AnalyzedFood[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10MB."); return; }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const analyzeImage = async () => {
    if (!imagePreview) return;
    setAnalyzing(true); setError(null);
    try {
      const res = await fetch("/api/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePreview }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to analyze image"); return; }
      setAnalyzedItems((data.items || []).map((item: Omit<AnalyzedFood, "quantity">) => ({ ...item, quantity: 1 })));
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to analyze image"); }
    finally { setAnalyzing(false); }
  };

  const updateItem = (index: number, updates: Partial<AnalyzedFood>) => {
    setAnalyzedItems((prev) => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const handleLogMeal = async () => {
    if (analyzedItems.length === 0) return;
    setSaving(true); setError(null);
    try {
      analyzedItems.filter((item) => item.name.trim()).forEach((item) => {
        onAddMeal({ name: item.name.trim(), type: "photo", calories: item.calories * item.quantity, protein_g: item.protein * item.quantity, carbs_g: item.carbs * item.quantity, fat_g: item.fat * item.quantity });
      });
      setAnalyzedItems([]);
      setImagePreview(null);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to save meals"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-300">AI estimates may not be 100% accurate — please review before logging.</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileInput} />

      {!imagePreview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
            dragOver ? "border-violet-500 bg-violet-500/5" : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600"
          )}
        >
          <Camera className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-white mb-1">Take a photo or upload an image</p>
          <p className="text-xs text-zinc-500">JPG, PNG up to 10MB</p>
          <div className="flex gap-2 justify-center mt-3">
            <Button size="sm" variant="outline" type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              <Upload className="h-3 w-3" /> Upload
            </Button>
            <Button size="sm" variant="outline" type="button" onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}>
              <Camera className="h-3 w-3" /> Camera
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-700">
            <img src={imagePreview} alt="Food preview" className="w-full max-h-48 object-cover" />
            <button onClick={() => { setImagePreview(null); setAnalyzedItems([]); setError(null); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 cursor-pointer">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {analyzedItems.length === 0 && (
            <Button onClick={analyzeImage} loading={analyzing} className="w-full gap-2">
              <Camera className="h-4 w-4" /> Analyze Food
            </Button>
          )}
        </div>
      )}

      {analyzedItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-zinc-400">Identified Items</h4>
          {analyzedItems.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-zinc-800 bg-zinc-800/40">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <input type="text" value={item.name} onChange={(e) => updateItem(index, { name: e.target.value })}
                      placeholder="Food name" className="bg-transparent text-sm font-medium text-white border-b border-zinc-700 focus:border-violet-500 focus:outline-none flex-1 mr-2" />
                    <div className="flex items-center gap-2">
                      <QuantityStepper quantity={item.quantity} onChange={(q) => updateItem(index, { quantity: q })} />
                      <button onClick={() => setAnalyzedItems((prev) => prev.filter((_, i) => i !== index))} className="text-zinc-500 hover:text-red-400 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <input type="text" value={item.serving} onChange={(e) => updateItem(index, { serving: e.target.value })}
                    placeholder="Serving size" className="bg-transparent text-xs text-zinc-400 border-b border-zinc-800 focus:border-zinc-600 focus:outline-none w-full" />
                  <div className="grid grid-cols-4 gap-2">
                    {([
                      { key: "calories" as const, label: "kcal", color: "text-white" },
                      { key: "protein" as const, label: "Protein", color: "text-emerald-400" },
                      { key: "carbs" as const, label: "Carbs", color: "text-blue-400" },
                      { key: "fat" as const, label: "Fat", color: "text-amber-400" },
                    ]).map((field) => (
                      <div key={field.key}>
                        <input type="number" value={item[field.key]} onChange={(e) => updateItem(index, { [field.key]: Number(e.target.value) })}
                          className={cn("w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-violet-500", field.color)} />
                        <div className="text-[10px] text-zinc-500 text-center mt-0.5">{field.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right text-[10px] text-zinc-500">
                    Total: <span className="text-emerald-400 font-medium">{item.calories * item.quantity} kcal</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setAnalyzedItems((prev) => [...prev, { name: "", serving: "1 serving", calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1 }])}>
              <Plus className="h-3 w-3" /> Add Item
            </Button>
          </div>
        </div>
      )}

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}

      {analyzedItems.length > 0 && (
        <Button onClick={handleLogMeal} loading={saving} className="w-full gap-2">
          <Save className="h-4 w-4" /> Log This Meal
        </Button>
      )}
    </div>
  );
}

function CustomSubTab({ onAddMeal }: { onAddMeal: (meal: { name: string; type: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }) => void }) {
  const [name, setName] = React.useState("");
  const [calories, setCalories] = React.useState("");
  const [protein, setProtein] = React.useState("");
  const [carbs, setCarbs] = React.useState("");
  const [fat, setFat] = React.useState("");
  const [serving, setServing] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onAddMeal({ name: name.trim(), type: "custom", calories: Number(calories) || 0, protein_g: Number(protein) || 0, carbs_g: Number(carbs) || 0, fat_g: Number(fat) || 0 });
    setSaved(true);
    setTimeout(() => { setName(""); setCalories(""); setProtein(""); setCarbs(""); setFat(""); setServing(""); setSaved(false); }, 1200);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Food Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="e.g. Homemade Dal" />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Serving Size</label>
          <input type="text" value={serving} onChange={(e) => setServing(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="e.g. 1 bowl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-zinc-400 mb-1 block">Calories (kcal)</label><input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="0" /></div>
          <div><label className="text-xs text-zinc-400 mb-1 block">Protein (g)</label><input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="0" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-zinc-400 mb-1 block">Carbs (g)</label><input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="0" /></div>
          <div><label className="text-xs text-zinc-400 mb-1 block">Fat (g)</label><input type="number" value={fat} onChange={(e) => setFat(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="0" /></div>
        </div>
        <Button onClick={handleSave} disabled={!name.trim()} variant={saved ? "success" : "default"} className="w-full gap-2">
          {saved ? "\u2713 Saved!" : <><Save className="h-4 w-4" /> Save Custom Food</>}
        </Button>
      </CardContent>
    </Card>
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
