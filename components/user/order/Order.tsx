"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Paper,
  useMediaQuery,
  Chip,
} from "@mui/material";

import { useTheme } from "@mui/material";
import { ContentPasteSearchOutlined } from "@mui/icons-material";

const getStatusChip = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "success" || s === "paid") {
    return <Chip label={status} size="small" sx={{ bgcolor: "#d1fae5", color: "#065f46", fontWeight: 700 }} />;
  }
  if (s === "pending" || s === "processing") {
    return <Chip label={status} size="small" sx={{ bgcolor: "#fef3c7", color: "#92400e", fontWeight: 700 }} />;
  }
  return <Chip label={status || "N/A"} size="small" sx={{ bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 700 }} />;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/user/orders');
        if (!response.ok) {
          throw new Error("Error fetching orders");
        }
        const data = await response.json();
        console.log(data);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress sx={{ color: "#667eea" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mt: 4,
          textAlign: "center",
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 800,
            backgroundImage: "linear-gradient(45deg, #667eea, #764ba2)",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
          }}
        >
          Your Order History
        </Typography>
      </Box>

      {orders?.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center", borderRadius: "16px", border: "1px dashed #e5e7eb", bgcolor: "transparent" }}>
          <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
            No Orders Found!
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)", border: "1px solid #e5e7eb", overflow: "hidden", mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "& .MuiTableCell-head": {
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  },
                }}
              >
                <TableCell>Order ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Order Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order: any) => (
                <TableRow
                  key={order._id}
                  sx={{
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(102, 126, 234, 0.05)",
                      cursor: "pointer",
                    },
                    "& .MuiTableCell-body": {
                      color: "#374151",
                      fontWeight: 500,
                      py: 2,
                    },
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#6b7280" }}>
                    #{order._id?.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {getStatusChip(order.orderStatus)}
                  </TableCell>
                  <TableCell sx={{ textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 600 }}>
                    {order.paymentMethod || "N/A"}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(order.paymentStatus)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#6b7280" }}>
                    {order.transactionId ? `${order.transactionId.substring(0, 10)}...` : "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#111827" }}>
                    NPR {order.totalPrice}
                  </TableCell>
                  <TableCell sx={{ color: "#6b7280", fontSize: "0.875rem" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
export default Orders;
