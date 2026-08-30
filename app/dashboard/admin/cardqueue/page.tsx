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
} from "@mui/material";
import Sidebar from "@/components/sidebar/SideBar";
import { useSession } from "next-auth/react";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CardPrintQueuePage = () => {
  const { data: session, status } = useSession({ required: true });
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    printed: 0,
    shipped: 0,
    total: 0,
  });

  useEffect(() => {
    fetchQueues();
  }, [filterStatus]);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      const query = filterStatus === "all" ? "" : `?status=${filterStatus}`;
      const response = await fetch(`/api/admin/cardqueue${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch queues");
      }
      const data = await response.json();
      setQueues(data.queues);

      // Calculate stats
      const allQueues = data.queues;
      setStats({
        pending: allQueues.filter((q) => q.status === "pending").length,
        processing: allQueues.filter((q) => q.status === "processing").length,
        printed: allQueues.filter((q) => q.status === "printed").length,
        shipped: allQueues.filter((q) => q.status === "shipped").length,
        total: allQueues.length,
      });
    } catch (err) {
      console.error("Error fetching queues:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (queue) => {
    setSelectedQueue(queue);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQueue(null);
  };

  const handleStatusUpdate = async (queueId, newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/cardqueue/${queueId}`, {
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
      fetchQueues();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrintCards = (queueId) => {
    // Trigger print for this specific queue
    const printUrl = `/api/admin/cardqueue/${queueId}/print`;
    window.open(printUrl, "_blank");
  };

  const handleDeleteQueue = async (queueId) => {
    if (!window.confirm("Are you sure you want to delete this print request?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/cardqueue/${queueId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("Print request deleted");
      fetchQueues();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(error.message);
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
            Card Print Queue Management
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Monitor and manage membership card printing requests
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
                  Total Requests
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
                  Printed
                </Typography>
                <Typography variant="h5">{stats.printed}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2.4
            }}>
            <Card sx={{ bgcolor: "rgba(156,39,176,0.1)", color: "white", textAlign: "center" }}>
              <CardContent>
                <Typography color="textSecondary" sx={{ fontSize: 12 }}>
                  Shipped
                </Typography>
                <Typography variant="h5">{stats.shipped}</Typography>
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
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="printed">Printed</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
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
          <TableContainer component={Paper} sx={{ bgcolor: "#1E1E1E" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#252525" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    User
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Card Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Requested Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", color: "white", py: 4 }}>
                      No print requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  queues.map((queue) => (
                    <TableRow
                      key={queue._id}
                      sx={{
                        "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            {queue.userName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            {queue.userEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>{queue.quantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={queue.cardType}
                          size="small"
                          variant="outlined"
                          sx={{ color: "white", borderColor: "white" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={queue.status}
                          color={getStatusColor(queue.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {formatDate(queue.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit">
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenDialog(queue)}
                              sx={{ color: "#00ff88" }}
                            >
                              Edit
                            </Button>
                          </Tooltip>
                          <Tooltip title="Print">
                            <Button
                              size="small"
                              startIcon={<PrintIcon />}
                              onClick={() => handlePrintCards(queue._id)}
                              sx={{ color: "#2196F3" }}
                            >
                              Print
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteQueue(queue._id)}
                              sx={{ color: "#f44336" }}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: "#1E1E1E", color: "white" }}>
            Update Print Request
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#1E1E1E", color: "white" }}>
            {selectedQueue && (
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2">
                  <strong>User:</strong> {selectedQueue.userName} ({selectedQueue.userEmail})
                </Typography>
                <Typography variant="body2">
                  <strong>Quantity:</strong> {selectedQueue.quantity}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "white" }}>Status</InputLabel>
                  <Select
                    value={selectedQueue.status}
                    onChange={(e) =>
                      setSelectedQueue({ ...selectedQueue, status: e.target.value })
                    }
                    label="Status"
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.23)",
                      },
                    }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="printed">Printed</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Processing Notes"
                  multiline
                  rows={3}
                  value={selectedQueue.processingNotes || ""}
                  onChange={(e) =>
                    setSelectedQueue({ ...selectedQueue, processingNotes: e.target.value })
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
                handleStatusUpdate(selectedQueue._id, selectedQueue.status);
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

export default CardPrintQueuePage;
