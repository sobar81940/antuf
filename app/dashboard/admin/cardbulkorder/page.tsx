"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Sidebar from "@/components/sidebar/SideBar";
import { useSession } from "next-auth/react";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CardBulkOrderPage = () => {
  const { data: session, status } = useSession({ required: true });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    draft: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = filterStatus === "all" ? "" : `?status=${filterStatus}`;
      const response = await fetch(`/api/admin/cardbulkorder${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.orders);

      // Calculate stats
      const allOrders = data.orders;
      setStats({
        draft: allOrders.filter((o) => o.status === "draft").length,
        pending: allOrders.filter((o) => o.status === "pending").length,
        processing: allOrders.filter((o) => o.status === "processing").length,
        completed: allOrders.filter((o) => o.status === "completed").length,
        total: allOrders.length,
      });
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleSubmitOrder = async (orderId) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/cardbulkorder/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "submit_for_processing" }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      toast.success("Order submitted for processing");
      fetchOrders();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/cardbulkorder/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(`Status updated to ${newStatus}`);
      fetchOrders();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this bulk order?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/cardbulkorder/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("Bulk order deleted");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(error.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "default",
      pending: "warning",
      processing: "info",
      completed: "success",
      cancelled: "error",
    };
    return colors[status] || "default";
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
    <Box sx={{ display: "flex", bgcolor: "#121212", minHeight: "100vh" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            p: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
            Card Bulk Order Management
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Create and manage bulk card printing orders
          </Typography>
        </Box>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2.4
            }}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", textAlign: "center" }}>
              <CardContent>
                <Typography color="textSecondary" sx={{ fontSize: 12 }}>
                  Total Orders
                </Typography>
                <Typography variant="h5">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2.4
            }}>
            <Card sx={{ bgcolor: "rgba(158,158,158,0.1)", color: "white", textAlign: "center" }}>
              <CardContent>
                <Typography color="textSecondary" sx={{ fontSize: 12 }}>
                  Draft
                </Typography>
                <Typography variant="h5">{stats.draft}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2.4
            }}>
            <Card sx={{ bgcolor: "rgba(255,193,7,0.1)", color: "white", textAlign: "center" }}>
              <CardContent>
                <Typography color="textSecondary" sx={{ fontSize: 12 }}>
                  Pending
                </Typography>
                <Typography variant="h5">{stats.pending}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2.4
            }}>
            <Card sx={{ bgcolor: "rgba(33,150,243,0.1)", color: "white", textAlign: "center" }}>
              <CardContent>
                <Typography color="textSecondary" sx={{ fontSize: 12 }}>
                  Processing
                </Typography>
                <Typography variant="h5">{stats.processing}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2.4
            }}>
            <Card sx={{ bgcolor: "rgba(76,175,80,0.1)", color: "white", textAlign: "center" }}>
              <CardContent>
                <Typography color="textSecondary" sx={{ fontSize: 12 }}>
                  Completed
                </Typography>
                <Typography variant="h5">{stats.completed}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter */}
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: "white" }}>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {orders.length === 0 ? (
              <Alert severity="info">No bulk orders found</Alert>
            ) : (
              orders.map((order) => (
                <Accordion
                  key={order._id}
                  sx={{
                    mb: 2,
                    bgcolor: "#1E1E1E",
                    color: "white",
                    "& .MuiAccordionSummary-root": {
                      bgcolor: "#252525",
                    },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}>
                    <Grid container spacing={2} sx={{ width: "100%", alignItems: "center" }}>
                      <Grid
                        size={{
                          xs: 12,
                          sm: 4
                        }}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {order.batchName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                          {order.totalCards} cards
                        </Typography>
                      </Grid>
                      <Grid
                        size={{
                          xs: 12,
                          sm: 2
                        }}>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Grid>
                      <Grid
                        size={{
                          xs: 12,
                          sm: 3
                        }}>
                        <Typography variant="caption">
                          Created: {formatDate(order.createdAt)}
                        </Typography>
                      </Grid>
                      <Grid
                        size={{
                          xs: 12,
                          sm: 3
                        }}>
                        <Typography variant="caption">
                          By: {order.createdBy?.name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>

                  <AccordionDetails sx={{ bgcolor: "#1E1E1E" }}>
                    <Box>
                      {/* Order Details */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid
                          size={{
                            xs: 12,
                            sm: 6
                          }}>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            Card Type:
                          </Typography>
                          <Chip
                            label={order.cardType}
                            size="small"
                            variant="outlined"
                            sx={{ color: "white", borderColor: "white", mt: 0.5 }}
                          />
                        </Grid>
                        <Grid
                          size={{
                            xs: 12,
                            sm: 6
                          }}>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            Completed/Shipped:
                          </Typography>
                          <Typography variant="body2">
                            {order.cardsCompleted} / {order.cardsShipped}
                          </Typography>
                        </Grid>
                        {order.description && (
                          <Grid size={12}>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                              Description:
                            </Typography>
                            <Typography variant="body2">{order.description}</Typography>
                          </Grid>
                        )}
                        {order.notes && (
                          <Grid size={12}>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                              Notes:
                            </Typography>
                            <Typography variant="body2">{order.notes}</Typography>
                          </Grid>
                        )}
                      </Grid>

                      {/* Users List */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                          Members ({order.userIds?.length || 0}):
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          {order.userIds?.map((user) => (
                            <Chip
                              key={user._id}
                              label={`${user.name} (${user.email})`}
                              size="small"
                              variant="outlined"
                              sx={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Actions */}
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        {order.status === "draft" && (
                          <Button
                            variant="contained"
                            startIcon={<SendIcon />}
                            onClick={() => handleSubmitOrder(order._id)}
                            disabled={updating}
                            sx={{
                              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                            }}
                          >
                            Submit for Processing
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenDialog(order)}
                          sx={{ color: "#00ff88", borderColor: "#00ff88" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteOrder(order._id)}
                          sx={{ color: "#f44336", borderColor: "#f44336" }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Box>
        )}

        {/* Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: "#1E1E1E", color: "white" }}>
            Update Bulk Order
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#1E1E1E", color: "white" }}>
            {selectedOrder && (
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2">
                  <strong>Batch:</strong> {selectedOrder.batchName}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Cards:</strong> {selectedOrder.totalCards}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "white" }}>Status</InputLabel>
                  <Select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, status: e.target.value })
                    }
                    label="Status"
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.23)",
                      },
                    }}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Notes"
                  multiline
                  rows={3}
                  value={selectedOrder.notes || ""}
                  onChange={(e) =>
                    setSelectedOrder({ ...selectedOrder, notes: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.23)",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ bgcolor: "#1E1E1E", p: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleStatusUpdate(selectedOrder._id, selectedOrder.status);
              }}
              disabled={updating}
              variant="contained"
              sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
            >
              {updating ? <CircularProgress size={20} /> : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CardBulkOrderPage;
