"use client";

import Sidebar from "@/components/sidebar/SideBar";
import ModernProfile from "@/components/admin/profile/ModernProfile";
import { Box } from "@mui/material";

export default function ProfilePage() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <ModernProfile />
      </Box>
    </Box>
  );
}