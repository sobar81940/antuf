"use client";

import { Box } from "@mui/material";
import Sidebar from "@/components/sidebar/SideBar";
import DonationTransactionsAdmin from "@/components/admin/donation/DonationTransactionsAdmin";

export default function DonationTransactionsPage() {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f7fb" }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, minWidth: 0, ml: { sm: "70px", md: "240px" } }}>
                <DonationTransactionsAdmin />
            </Box>
        </Box>
    );
}