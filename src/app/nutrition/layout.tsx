import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutrition",
  description: "Track your meals, macros, and nutrition goals with AI-powered insights.",
};

export default function NutritionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
