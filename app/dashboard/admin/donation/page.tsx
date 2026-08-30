"use client";

import React from "react";
import { Box } from "@mui/material";
import DonationAdmin from "@/components/admin/donation/DonationAdmin";
import Sidebar from "@/components/sidebar/SideBar";

export default function AdminDonationPage() {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f7fb" }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, minWidth: 0, ml: { sm: "70px", md: "240px" } }}>
                <DonationAdmin />
            </Box>
        </Box>
    );
}
