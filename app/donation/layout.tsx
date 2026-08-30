import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support ANTUF's work to protect and empower workers across Nepal.",
  alternates: { canonical: "/donation" },
};

export default function DonationLayout({ children }: { children: React.ReactNode }) {
  return children;
}