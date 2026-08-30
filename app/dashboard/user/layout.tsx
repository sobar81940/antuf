"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/user/sidebar/Sidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages that should NOT render the dashboard sidebar
  const noSidebarPages = ["/dashboard/user/success", "/dashboard/user/cancel"];

  if (noSidebarPages.includes(pathname)) {
    return <>{children}</>;
  }

  return <Sidebar>{children}</Sidebar>;
}
