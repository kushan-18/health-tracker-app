import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workout",
  description: "Log workouts, track progress, and get AI-powered training recommendations.",
};

export default function WorkoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
