import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact ANTUF",
  description: "Contact the All Nepal Federation of Trade Unions for support, membership, and partnership inquiries.",
  alternates: { canonical: "/pages/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}