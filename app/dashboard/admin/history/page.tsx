"use client";

import { Box } from "@mui/material";
import HistoryAdmin from "@/components/admin/history/HistoryAdmin";
import Sidebar from "@/components/sidebar/SideBar";

export default function AdminHistoryPage() {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, ml: { sm: "70px", md: "240px" } }}>
                <HistoryAdmin />
            </Box>
        </Box>
    );
}