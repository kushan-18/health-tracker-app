"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { foods } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Clock, Plus, Save, X } from "lucide-react";
import Link from "next/link";

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
          </TabsList>
          <TabsContent value="search"><SearchTab /></TabsContent>
          <TabsContent value="recent"><RecentTab /></TabsContent>
          <TabsContent value="custom"><CustomTab /></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function SearchTab() {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);

  const results = foods.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
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
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {results.map((food) => (
          <button key={food.id} onClick={() => toggle(food.id)} className={cn("w-full text-left p-3 rounded-xl border transition-all cursor-pointer", selected.includes(food.id) ? "border-emerald-500/50 bg-emerald-500/5" : "border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/60")}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{food.name}</div>
                <div className="text-xs text-zinc-500">{food.serving} · {food.calories} kcal</div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-emerald-400">P:{food.protein}g</span>
                <span className="text-blue-400">C:{food.carbs}g</span>
                <span className="text-amber-400">F:{food.fat}g</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <Button className="w-full gap-2"><Save className="h-4 w-4" /> Add {selected.length} item(s)</Button>
      )}
    </div>
  );
}

function RecentTab() {
  const recentFoods = [
    { name: "Masala Oats", calories: 180, time: "Today, 8:00 AM" },
    { name: "Boiled Eggs (2)", calories: 156, time: "Today, 8:00 AM" },
    { name: "Chicken Biryani", calories: 450, time: "Yesterday, 1:00 PM" },
    { name: "Banana", calories: 105, time: "Yesterday, 4:00 PM" },
    { name: "Greek Yogurt", calories: 100, time: "Jul 22, 3:00 PM" },
    { name: "Roti (Whole Wheat)", calories: 120, time: "Jul 22, 7:30 PM" },
  ];

  return (
    <div className="space-y-3">
      {recentFoods.map((food, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
          <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors">
            <div>
              <div className="text-sm font-medium text-white">{food.name}</div>
              <div className="text-xs text-zinc-500">{food.time}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-violet-400">{food.calories} kcal</span>
              <Button size="sm" variant="ghost"><Plus className="h-3 w-3" /></Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function CustomTab() {
  const [name, setName] = React.useState("");
  const [calories, setCalories] = React.useState("");
  const [protein, setProtein] = React.useState("");
  const [carbs, setCarbs] = React.useState("");
  const [fat, setFat] = React.useState("");
  const [serving, setServing] = React.useState("");

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
          <Button className="w-full gap-2"><Save className="h-4 w-4" /> Save Custom Food</Button>
        </div>
      </CardContent>
    </Card>
  );
}
