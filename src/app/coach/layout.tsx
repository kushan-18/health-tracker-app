import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Coach",
  description: "Get personalized health, fitness, and nutrition guidance from your AI coach.",
};

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
