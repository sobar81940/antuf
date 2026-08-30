"use client";

import { Box } from "@mui/material";

import Profile from "@/components/user/profile/Profile";
import UserInfoPrintCard from "@/components/user/profile/UserInfoPrintCard";
import UserCardOrderWidget from "@/components/user/profile/UserCardOrderWidget";
import UserOrderTracking from "@/components/user/profile/UserOrderTracking";

const ProfileCreate = () => {
  return (
    <>
      <Box sx={{ display: "flex", gap: 2, p: 2, backgroundColor: "#f5f5f5", justifyContent: "center" }}>
        <UserInfoPrintCard />
      </Box>

      <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <UserCardOrderWidget />
        </Box>
      </Box>
 <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
         <UserOrderTracking /> 
      </Box>
        </Box>

    </>
  );
};

export default ProfileCreate;