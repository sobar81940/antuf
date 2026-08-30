import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Explore ANTUF events, activities, and programs for workers across Nepal.",
  alternates: { canonical: "/events" },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}