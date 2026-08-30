"use client";

import AdminChat from "@/components/admin/chat/AdminChat";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <AdminChat />
    </Box>
  );
}
