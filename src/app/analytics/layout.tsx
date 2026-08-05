import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Visualize your health data with comprehensive charts and trend analysis.",
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
