import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "Generate and view comprehensive health and fitness reports.",
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
