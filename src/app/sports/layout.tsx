import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports",
  description: "Track sports performance, view history, and analyze training metrics.",
};

export default function SportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
