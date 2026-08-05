import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description: "View your health activities, workouts, and meals on a calendar.",
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
