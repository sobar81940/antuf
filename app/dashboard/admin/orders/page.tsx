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
  Avatar,
} from "@mui/material";
import Sidebar from "@/components/sidebar/SideBar";
import { useSession } from "next-auth/react";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import AdminCardPrintViewer from "@/components/admin/CardPrint/AdminCardPrintViewer";

const AdminOrdersPage = () => {
  const { data: session, status } = useSession({ required: true });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
  });
  const [cardViewOpen, setCardViewOpen] = useState(false);
  const [selectedCardOrder, setSelectedCardOrder] = useState(null);
  const [userDetailsForCard, setUserDetailsForCard] = useState(null);
  const [orderDetails, setOrderDetails] = useState({}); // Store full order details with user info

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  // Fetch full user details for all orders when they load
  useEffect(() => {
    const enrichOrdersWithUserDetails = async () => {
      if (orders.length === 0) return;
      
      console.log(`📥 Processing ${orders.length} orders for user details...`);
      const enrichedOrders = {};
      let successCount = 0;
      let alreadyPopulated = 0;
      
      for (const order of orders) {
        try {
          // Check if userId is already a populated user object (from the API)
          let user = null;
          
          if (typeof order.userId === 'object' && order.userId !== null && order.userId._id) {
            // userId is already populated with user details
            user = order.userId;
            console.log(`✓ User already populated for ${order._id}: ${user?.name}`);
            console.log(`  - Image: ${user?.image ? user.image.substring(0, 50) + '...' : 'null'}`);
            alreadyPopulated++;
          } else {
            // userId is just an ID string, need to fetch user details
            console.log(`🔄 Fetching user details for ${order._id} (userId: ${order.userId})`);
            const userIdString = String(order.userId);
            const params = new URLSearchParams();
            params.append('userId', userIdString);
            const url = `/api/admin/users/profile?${params.toString()}`;
            
            const response = await fetch(url, {
              credentials: 'include',
            });
            
            if (response.ok) {
              const userData = await response.json();
              
              // Extract user from response
              if (userData.success && userData.data && Array.isArray(userData.data)) {
                user = userData.data[0];
              } else if (userData.data && !Array.isArray(userData.data)) {
                user = userData.data;
              } else if (userData.user) {
                user = userData.user;
              } else {
                user = userData;
              }
              
              console.log(`✓ User fetched for ${order._id}: ${user?.name}`);
              console.log(`  - Image: ${user?.image ? user.image.substring(0, 50) + '...' : 'null'}`);
            } else {
              console.warn(`✗ Failed to fetch user for ${order._id}: ${response.status}`);
              user = null;
            }
          }
          
          enrichedOrders[order._id] = user;
          if (user) successCount++;
        } catch (err) {
          console.error(`❌ Error processing order ${order._id}:`, err.message);
          enrichedOrders[order._id] = null;
        }
      }
      
      console.log(`✅ Processing complete: ${successCount}/${orders.length} have user details (${alreadyPopulated} already populated)`);
      setOrderDetails(enrichedOrders);
    };
    
    enrichOrdersWithUserDetails();
  }, [orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const query = filterStatus === "all" ? "" : `?status=${filterStatus}`;
      const response = await fetch(`/api/admin/cardqueue${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.queues);

      // Calculate stats
      const allOrders = data.queues;
      setStats({
        total: allOrders.length,
        pending: allOrders.filter((o) => o.status === "pending").length,
        processing: allOrders.filter((o) => o.status === "processing").length,
        completed: allOrders.filter((o) => o.status === "printed" || o.status === "shipped" || o.status === "delivered").length,
      });

      // Initialize empty order details - will be fetched in useEffect
      setOrderDetails({});
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

  const handleViewCard = async (order) => {
    try {
      setSelectedCardOrder(order);
      // Check if userId is already populated with user details
      let user = null;
      
      if (typeof order.userId === 'object' && order.userId !== null && order.userId._id) {
        // userId is already populated
        user = order.userId;
        console.log(`✓ Using already populated user for card: ${user?.name}`);
      } else {
        // Need to fetch user details
        const userIdString = String(order.userId);
        const response = await fetch(`/api/admin/users/profile?userId=${userIdString}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          
          // Extract user from response
          if (userData.success && userData.data && Array.isArray(userData.data)) {
            user = userData.data[0];
          } else if (userData.data && !Array.isArray(userData.data)) {
            user = userData.data;
          } else if (userData.user) {
            user = userData.user;
          } else {
            user = userData;
          }
        }
      }
      
      setUserDetailsForCard(user || { name: order.userName, email: order.userEmail });
      setCardViewOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserDetailsForCard({ name: order.userName, email: order.userEmail });
      setCardViewOpen(true);
    }
  };

  const handleCloseCardView = () => {
    setCardViewOpen(false);
    setSelectedCardOrder(null);
    setUserDetailsForCard(null);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/cardqueue/${orderId}`, {
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

  const exportToCSV = () => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    const headers = ["User Name", "Email", "Card Type", "Quantity", "Status", "Order Date", "Member #"];
    const rows = orders.map((order) => [
      order.userName,
      order.userEmail,
      order.cardType,
      order.quantity,
      order.status,
      formatDate(order.createdAt),
      order._id.slice(-8).toUpperCase(),
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `card-orders-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV successfully!");
  };

  const exportOrdersPrint = () => {
    if (orders.length === 0) {
      toast.error("No orders to print");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Card Orders Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #003366; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #003366; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f5f5f5; }
            .summary { margin-top: 30px; font-size: 14px; }
            .page-break { page-break-after: always; }
          </style>
        </head>
        <body>
          <h1>ANTUF Card Orders Report</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Orders:</strong> ${orders.length}</p>
          
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Card Type</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              ${orders
                .map(
                  (order) => `
                <tr>
                  <td>${order.userName}</td>
                  <td>${order.userEmail}</td>
                  <td>${order.cardType}</td>
                  <td>${order.quantity}</td>
                  <td>${order.status}</td>
                  <td>${formatDate(order.createdAt)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="summary">
            <h3>Summary</h3>
            <p>Pending: ${stats.pending}</p>
            <p>Processing: ${stats.processing}</p>
            <p>Completed: ${stats.completed}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
            User Card Orders Management
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Monitor and manage all user card order requests
          </Typography>
        </Box>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3
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
              md: 3
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
              md: 3
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
              md: 3
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

        {/* Filter & Export */}
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
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

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={exportToCSV}
              sx={{
                background: "linear-gradient(45deg, #4CAF50 30%, #81C784 90%)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Export CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={exportOrdersPrint}
              sx={{
                background: "linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Print Report
            </Button>
          </Stack>
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
                    Image
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    User
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Card Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Order Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center", color: "white", py: 4 }}>
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow
                      key={order._id}
                      sx={{
                        "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                      }}
                    >
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        <Avatar
                          alt={order.userName}
                          src={orderDetails[order._id]?.image || ''}
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: "#4A90E2",
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: "white",
                          }}
                        >
                          {`${order.userName?.charAt(0)?.toUpperCase() || "U"}${order.userName?.split(" ")[1]?.charAt(0)?.toUpperCase() || ""}`}
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            {order.userName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            {order.userEmail}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.cardType}
                          size="small"
                          variant="outlined"
                          sx={{ color: "white", borderColor: "white" }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>{order.quantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            startIcon={<PrintIcon />}
                            onClick={() => handleViewCard(order)}
                            sx={{ color: "#FFD700" }}
                          >
                            View Card
                          </Button>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenDialog(order)}
                            sx={{ color: "#00ff88" }}
                          >
                            Edit
                          </Button>
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
            Update Order Status
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#1E1E1E", color: "white" }}>
            {selectedOrder && (
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body2">
                  <strong>User:</strong> {selectedOrder.userName}
                </Typography>
                <Typography variant="body2">
                  <strong>Card Type:</strong> {selectedOrder.cardType}
                </Typography>
                <Typography variant="body2">
                  <strong>Quantity:</strong> {selectedOrder.quantity}
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
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="printed">Printed</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
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

        {/* Card Print Viewer */}
        {selectedCardOrder && (
          <AdminCardPrintViewer
            open={cardViewOpen}
            onClose={handleCloseCardView}
            order={selectedCardOrder}
            userDetails={userDetailsForCard}
          />
        )}
      </Box>
    </Box>
  );
};

export default AdminOrdersPage;
