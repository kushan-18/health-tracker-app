"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { foods } from "@/lib/data";
import { getMeals, addMeal } from "@/lib/data-operations";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft, Search, Clock, Plus, Save, X, Minus,
  Camera, Upload, AlertTriangle, Trash2, Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SelectedFood = { food: typeof foods[number]; quantity: number };

type AnalyzedFood = {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
};

export default function AddFoodPage() {
  return (
    <AppLayout title="Add Food">
      <div className="max-w-2xl mx-auto space-y-4">
        <Link href="/nutrition" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Nutrition
        </Link>
        <Tabs defaultValue="search">
          <TabsList className="mb-4">
            <TabsTrigger value="search"><Search className="h-4 w-4 mr-1.5" />Search</TabsTrigger>
            <TabsTrigger value="recent"><Clock className="h-4 w-4 mr-1.5" />Recently Eaten</TabsTrigger>
            <TabsTrigger value="custom"><Plus className="h-4 w-4 mr-1.5" />Custom Entry</TabsTrigger>
            <TabsTrigger value="photo"><Camera className="h-4 w-4 mr-1.5" />Photo</TabsTrigger>
          </TabsList>
          <TabsContent value="search"><SearchTab /></TabsContent>
          <TabsContent value="recent"><RecentTab /></TabsContent>
          <TabsContent value="custom"><CustomTab /></TabsContent>
          <TabsContent value="photo"><PhotoTab /></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function QuantityStepper({ quantity, onChange }: { quantity: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={(e) => { e.stopPropagation(); onChange(Math.max(1, quantity - 1)); }}
        className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-7 text-center text-sm font-medium text-white">{quantity}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onChange(quantity + 1); }}
        className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

function SearchTab() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Map<string, SelectedFood>>(new Map());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const results = foods.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  const toggle = (food: typeof foods[number]) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(food.id)) {
        next.delete(food.id);
      } else {
        next.set(food.id, { food, quantity: 1 });
      }
      return next;
    });
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const item = next.get(foodId);
      if (item) next.set(foodId, { ...item, quantity });
      return next;
    });
  };

  const totalCalories = Array.from(selected.values()).reduce(
    (s, item) => s + item.food.calories * item.quantity, 0
  );

  const handleAdd = async () => {
    if (!user || selected.size === 0) return;
    setSaving(true);
    setError(null);
    try {
      const items = Array.from(selected.values());
      await Promise.all(
        items.map((item) =>
          addMeal(user.id, {
            name: item.food.name,
            type: "snack",
            calories: item.food.calories * item.quantity,
            protein_g: item.food.protein * item.quantity,
            carbs_g: item.food.carbs * item.quantity,
            fat_g: item.food.fat * item.quantity,
          })
        )
      );
      router.push("/nutrition");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save meals");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search food database..."
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {results.map((food) => {
          const isSelected = selected.has(food.id);
          const item = selected.get(food.id);
          return (
            <div key={food.id} className={cn(
              "w-full text-left p-3 rounded-xl border transition-all",
              isSelected ? "border-emerald-500/50 bg-emerald-500/5" : "border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/60"
            )}>
              <div className="flex items-center justify-between">
                <button onClick={() => toggle(food)} className="flex-1 text-left cursor-pointer">
                  <div className="text-sm font-medium text-white">{food.name}</div>
                  <div className="text-xs text-zinc-500">{food.serving} · {food.calories} kcal</div>
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 text-xs">
                    <span className="text-emerald-400">P:{food.protein}g</span>
                    <span className="text-blue-400">C:{food.carbs}g</span>
                    <span className="text-amber-400">F:{food.fat}g</span>
                  </div>
                  {isSelected && item && (
                    <QuantityStepper
                      quantity={item.quantity}
                      onChange={(q) => updateQuantity(food.id, q)}
                    />
                  )}
                </div>
              </div>
              {isSelected && (
                <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    {item!.quantity}× {food.calories} = <span className="text-emerald-400 font-medium">{food.calories * item!.quantity} kcal</span>
                  </span>
                  <button
                    onClick={() => toggle(food)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}
      {selected.size > 0 && (
        <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-between">
          <span className="text-sm text-zinc-300">
            {selected.size} item(s) · <span className="text-emerald-400 font-medium">{totalCalories} kcal</span>
          </span>
          <Button onClick={handleAdd} loading={saving} className="gap-2">
            <Save className="h-4 w-4" /> Add {selected.size} item(s)
          </Button>
        </div>
      )}
    </div>
  );
}

function RecentTab() {
  const { user } = useAuth();
  const router = useRouter();
  const [recentMeals, setRecentMeals] = React.useState<{ name: string; calories: number; protein: number; carbs: number; fat: number; time: string }[]>([]);
  const [selected, setSelected] = React.useState<Map<string, SelectedFood>>(new Map());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getMeals(user.id).then((meals) => {
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
  }, [user]);

  const toggleRecent = (meal: typeof recentMeals[number]) => {
    const key = meal.name;
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.set(key, {
          food: { id: key, name: meal.name, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fat: meal.fat, serving: "1 serving", category: "recent" },
          quantity: 1,
        });
      }
      return next;
    });
  };

  const updateQuantity = (key: string, quantity: number) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const item = next.get(key);
      if (item) next.set(key, { ...item, quantity });
      return next;
    });
  };

  const handleAdd = async () => {
    if (!user || selected.size === 0) return;
    setSaving(true);
    setError(null);
    try {
      const items = Array.from(selected.values());
      await Promise.all(
        items.map((item) =>
          addMeal(user.id, {
            name: item.food.name,
            type: "snack",
            calories: item.food.calories * item.quantity,
            protein_g: item.food.protein * item.quantity,
            carbs_g: item.food.carbs * item.quantity,
            fat_g: item.food.fat * item.quantity,
          })
        )
      );
      router.push("/nutrition");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save meals");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (recentMeals.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
        <p className="text-sm text-zinc-400">No recent meals found.</p>
        <p className="text-xs text-zinc-600 mt-1">Log some meals first, then they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentMeals.map((food, i) => {
        const isSelected = selected.has(food.name);
        const item = selected.get(food.name);
        return (
          <motion.div key={food.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className={cn(
              "p-3 rounded-xl border transition-all",
              isSelected ? "border-emerald-500/50 bg-emerald-500/5" : "border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/60"
            )}>
              <div className="flex items-center justify-between">
                <button onClick={() => toggleRecent(food)} className="text-left flex-1 cursor-pointer">
                  <div className="text-sm font-medium text-white">{food.name}</div>
                  <div className="text-xs text-zinc-500">{food.time}</div>
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-violet-400">{food.calories} kcal</span>
                  {isSelected && item ? (
                    <QuantityStepper
                      quantity={item.quantity}
                      onChange={(q) => updateQuantity(food.name, q)}
                    />
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => toggleRecent(food)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              {isSelected && item && (
                <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    {item.quantity}× {food.calories} = <span className="text-emerald-400 font-medium">{food.calories * item.quantity} kcal</span>
                  </span>
                  <button
                    onClick={() => toggleRecent(food)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}
      {selected.size > 0 && (
        <div className="p-3 rounded-xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-between">
          <span className="text-sm text-zinc-300">
            {selected.size} item(s) selected
          </span>
          <Button onClick={handleAdd} loading={saving} className="gap-2">
            <Save className="h-4 w-4" /> Add Selected
          </Button>
        </div>
      )}
    </div>
  );
}

function CustomTab() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [calories, setCalories] = React.useState("");
  const [protein, setProtein] = React.useState("");
  const [carbs, setCarbs] = React.useState("");
  const [fat, setFat] = React.useState("");
  const [serving, setServing] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSave = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await addMeal(user.id, {
        name: name.trim(),
        type: "custom",
        calories: Number(calories) || 0,
        protein_g: Number(protein) || 0,
        carbs_g: Number(carbs) || 0,
        fat_g: Number(fat) || 0,
      });
      router.push("/nutrition");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save food");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Custom Food Entry</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Food Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="e.g. Homemade Dal" />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Serving Size</label>
            <input type="text" value={serving} onChange={(e) => setServing(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="e.g. 1 bowl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-zinc-400 mb-1 block">Calories (kcal)</label><input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="0" /></div>
            <div><label className="text-xs text-zinc-400 mb-1 block">Protein (g)</label><input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="0" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-zinc-400 mb-1 block">Carbs (g)</label><input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="0" /></div>
            <div><label className="text-xs text-zinc-400 mb-1 block">Fat (g)</label><input type="number" value={fat} onChange={(e) => setFat(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-600" placeholder="0" /></div>
          </div>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}
          <Button onClick={handleSave} loading={saving} disabled={!name.trim()} className="w-full gap-2">
            <Save className="h-4 w-4" /> Save Custom Food
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PhotoTab() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [analyzedItems, setAnalyzedItems] = React.useState<AnalyzedFood[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const analyzeImage = async () => {
    if (!imagePreview || !user) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePreview }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to analyze image");
        return;
      }
      const items: AnalyzedFood[] = (data.items || []).map((item: Omit<AnalyzedFood, "quantity">) => ({
        ...item,
        quantity: 1,
      }));
      setAnalyzedItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
    } finally {
      setAnalyzing(false);
    }
  };

  const updateAnalyzedItem = (index: number, updates: Partial<AnalyzedFood>) => {
    setAnalyzedItems((prev) => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const removeAnalyzedItem = (index: number) => {
    setAnalyzedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addManualItem = () => {
    setAnalyzedItems((prev) => [...prev, { name: "", serving: "1 serving", calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1 }]);
  };

  const handleLogMeal = async () => {
    if (!user || analyzedItems.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await Promise.all(
        analyzedItems.filter((item) => item.name.trim()).map((item) =>
          addMeal(user.id, {
            name: item.name.trim(),
            type: "photo",
            calories: item.calories * item.quantity,
            protein_g: item.protein * item.quantity,
            carbs_g: item.carbs * item.quantity,
            fat_g: item.fat * item.quantity,
          })
        )
      );
      router.push("/nutrition");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save meals");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-300">AI estimates may not be 100% accurate — please review before logging.</p>
      </div>

      {!imagePreview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
            dragOver ? "border-violet-500 bg-violet-500/5" : "border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50"
          )}
        >
          <Camera className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-white mb-1">Take a photo or upload an image</p>
          <p className="text-xs text-zinc-500">JPG, PNG up to 10MB</p>
          <div className="flex gap-2 justify-center mt-4">
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              <Upload className="h-3 w-3" /> Upload
            </Button>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              <Camera className="h-3 w-3" /> Camera
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-700">
            <img src={imagePreview} alt="Food preview" className="w-full max-h-64 object-cover" />
            <button
              onClick={() => { setImagePreview(null); setAnalyzedItems([]); setError(null); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 cursor-pointer"
            >
              <X className="h-4 w-4" />
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Identified Items</h3>
            <Button size="sm" variant="ghost" onClick={addManualItem}>
              <Plus className="h-3 w-3" /> Add Item
            </Button>
          </div>
          {analyzedItems.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-zinc-800 bg-zinc-800/40">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateAnalyzedItem(index, { name: e.target.value })}
                      placeholder="Food name"
                      className="bg-transparent text-sm font-medium text-white border-b border-zinc-700 focus:border-violet-500 focus:outline-none flex-1 mr-2"
                    />
                    <div className="flex items-center gap-2">
                      <QuantityStepper
                        quantity={item.quantity}
                        onChange={(q) => updateAnalyzedItem(index, { quantity: q })}
                      />
                      <button
                        onClick={() => removeAnalyzedItem(index)}
                        className="text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={item.serving}
                    onChange={(e) => updateAnalyzedItem(index, { serving: e.target.value })}
                    placeholder="Serving size"
                    className="bg-transparent text-xs text-zinc-400 border-b border-zinc-800 focus:border-zinc-600 focus:outline-none w-full"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: "calories" as const, label: "kcal", color: "text-white" },
                      { key: "protein" as const, label: "Protein", color: "text-emerald-400" },
                      { key: "carbs" as const, label: "Carbs", color: "text-blue-400" },
                      { key: "fat" as const, label: "Fat", color: "text-amber-400" },
                    ].map((field) => (
                      <div key={field.key}>
                        <input
                          type="number"
                          value={item[field.key]}
                          onChange={(e) => updateAnalyzedItem(index, { [field.key]: Number(e.target.value) })}
                          className={cn("w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-1 focus:ring-violet-500", field.color)}
                        />
                        <div className="text-[10px] text-zinc-500 text-center mt-0.5">{field.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right text-xs text-zinc-500">
                    Total: <span className="text-emerald-400 font-medium">{item.calories * item.quantity} kcal</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {analyzedItems.length > 0 && (
        <Button onClick={handleLogMeal} loading={saving} className="w-full gap-2">
          <Save className="h-4 w-4" /> Log This Meal
        </Button>
      )}
    </div>
  );
}
