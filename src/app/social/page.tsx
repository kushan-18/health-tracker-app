"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageCircle, Trophy, Heart } from "lucide-react";

const comingSoonFeatures = [
  { icon: MessageCircle, title: "Social Feed", description: "Share workouts, meals, and achievements with friends" },
  { icon: Users, title: "Friends & Groups", description: "Connect with workout partners and join health challenges" },
  { icon: Trophy, title: "Challenges", description: "Compete in community challenges and climb the leaderboard" },
  { icon: Heart, title: "Accountability", description: "Stay motivated with friend check-ins and shared goals" },
];

export default function SocialPage() {
  return (
    <AppLayout title="Social">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Social Features Coming Soon</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We&apos;re building a community experience to help you stay motivated and connected on your health journey.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {comingSoonFeatures.map((f) => (
            <Card key={f.title} className="opacity-70">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{f.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
