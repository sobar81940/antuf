"use client";

import UserChat from "@/components/user/chat/UserChat";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <UserChat />
    </Box>
  );
}
