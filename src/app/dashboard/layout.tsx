import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your health dashboard with real-time nutrition, workout, and wellness tracking.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
