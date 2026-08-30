"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Typography,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { format, parseISO } from "date-fns";

const UserOrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, receiptsRes] = await Promise.all([
        fetch("/api/user/cardorder"),
        fetch("/api/user/cartreceipt"),
      ]);

      if (!ordersRes.ok || !receiptsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const ordersData = await ordersRes.json();
      const receiptsData = await receiptsRes.json();

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setReceipts(receiptsData.receipts || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      processing: "info",
      printed: "primary",
      shipped: "secondary",
      delivered: "success",
      cancelled: "error",
    };
    return colors[status] || "default";
  };

  const getStatusStep = (status) => {
    const steps = {
      pending: 0,
      processing: 1,
      printed: 2,
      shipped: 3,
      delivered: 4,
    };
    return steps[status] || 0;
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Card sx={{ bgcolor: "white", borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#003366" }}>
          📦 My Orders & Receipts
        </Typography>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`Card Orders (${orders.length})`} />
            <Tab label={`Receipts (${receipts.length})`} />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {/* Card Orders Tab */}
            {tabValue === 0 && (
              <Box>
                {orders.length === 0 ? (
                  <Alert severity="info">No card orders yet.</Alert>
                ) : (
                  <Box>
                    {orders.map((order) => (
                      <Card
                        key={order._id}
                        sx={{
                          mb: 2,
                          border: "1px solid #eee",
                          "&:hover": { boxShadow: 2 },
                        }}
                      >
                        <CardContent>
                          {/* Order Header */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="body2" sx={{ color: "#999" }}>
                                Order ID: {order._id.slice(-8).toUpperCase()}
                              </Typography>
                              <Typography variant="caption">
                                Ordered: {formatDate(order.createdAt)}
                              </Typography>
                            </Box>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </Box>

                          {/* Order Details */}
                          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: "#999" }}>
                                Card Type
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                {order.cardType.toUpperCase()}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: "#999" }}>
                                Quantity
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                {order.quantity} card(s)
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: "#999" }}>
                                Cost
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                Rs. {order.cost || "0"}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Status Progress */}
                          <Stepper
                            activeStep={getStatusStep(order.status)}
                            sx={{ py: 2 }}
                          >
                            <Step>
                              <StepLabel>Pending</StepLabel>
                            </Step>
                            <Step>
                              <StepLabel>Processing</StepLabel>
                            </Step>
                            <Step>
                              <StepLabel>Printed</StepLabel>
                            </Step>
                            <Step>
                              <StepLabel>Shipped</StepLabel>
                            </Step>
                            <Step>
                              <StepLabel>Delivered</StepLabel>
                            </Step>
                          </Stepper>

                          {/* Tracking Info */}
                          {order.trackingNumber && (
                            <Box sx={{ mt: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                              <Typography variant="caption" sx={{ color: "#999" }}>
                                Tracking Number
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#0066cc" }}>
                                {order.trackingNumber}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* Receipts Tab */}
            {tabValue === 1 && (
              <Box>
                {receipts.length === 0 ? (
                  <Alert severity="info">No receipts yet.</Alert>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                          <TableCell>Order ID</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell>Payment Status</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {receipts.map((receipt) => (
                          <TableRow key={receipt._id}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                {receipt.orderId}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                Rs. {receipt.total}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={receipt.paymentStatus}
                                color={
                                  receipt.paymentStatus === "completed"
                                    ? "success"
                                    : receipt.paymentStatus === "failed"
                                    ? "error"
                                    : "warning"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {formatDate(receipt.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserOrderTracking;
