import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health",
  description: "Monitor vital signs, mental wellness, and overall health metrics.",
};

export default function HealthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
