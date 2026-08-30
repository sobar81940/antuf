"use client";

import Orders from "@/components/user/order/Order";
import { Box } from "@mui/material";

export default function UserOrdersPage() {
  return (
    <Box sx={{ py: 4, bgcolor: "#f8fafc" }}>
      <Orders />
    </Box>
  );
}
