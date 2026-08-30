"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { toast } from "react-toastify";

const UserCardOrderWidget = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cardType, setCardType] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  const cardPrices = {
    standard: 50,
    premium: 100,
    digital: 0,
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOrderInfo(null);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 100) {
      setQuantity(value);
    }
  };

  const handleCreateOrder = async () => {
    if (quantity < 1 || quantity > 100) {
      toast.error("Quantity must be between 1 and 100");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/user/cardorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          cardType,
          notes: "Card order from user profile",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setOrderInfo(data.order);
      toast.success("Card order created successfully!");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = quantity * cardPrices[cardType];

  return (
    <>
      <Card
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          mb: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#003366" }}>
            📇 Order Membership Card
          </Typography>

          <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
            Order physical membership cards to be printed and shipped to you.
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption" sx={{ display: "block", fontWeight: "bold", mb: 1 }}>
                Card Pricing
              </Typography>
              <Typography variant="body2">
                ✓ Standard: Rs. 50 per card
              </Typography>
              <Typography variant="body2">
                ✓ Premium: Rs. 100 per card
              </Typography>
              <Typography variant="body2">
                ✓ Digital: Free (Email only)
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={handleOpenDialog}
              fullWidth
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                fontWeight: "bold",
              }}
            >
              Order Cards Now
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Order Dialog */}
      <Dialog open={openDialog && !orderInfo} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#003366", color: "white", fontWeight: "bold" }}>
          Order Membership Cards
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Card Type</InputLabel>
              <Select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                label="Card Type"
              >
                <MenuItem value="standard">Standard (Rs. 50)</MenuItem>
                <MenuItem value="premium">Premium (Rs. 100)</MenuItem>
                <MenuItem value="digital">Digital (Free)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1, max: 100 }}
              fullWidth
            />

            <Box sx={{ p: 2, bgcolor: "#f0f0f0", borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Card Type:</strong> {cardType.toUpperCase()}
              </Typography>
              <Typography variant="body2">
                <strong>Quantity:</strong> {quantity} card(s)
              </Typography>
              <Typography variant="body2">
                <strong>Unit Price:</strong> Rs. {cardPrices[cardType]}
              </Typography>
              <Typography
                variant="h6"
                sx={{ mt: 1, color: "#2196F3", fontWeight: "bold" }}
              >
                Total: Rs. {totalPrice}
              </Typography>
            </Box>

            <Alert severity="info">
              Physical cards will be printed and shipped within 5-7 business days.
              Digital cards will be sent via email immediately.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrder}
            disabled={loading}
            variant="contained"
            sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
          >
            {loading ? <CircularProgress size={20} /> : "Place Order"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Confirmation Dialog */}
      <Dialog open={!!orderInfo} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#00a64f", color: "white", fontWeight: "bold" }}>
          ✓ Order Placed Successfully
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {orderInfo && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Alert severity="success">
                Your card order has been created and is pending payment.
              </Alert>

              <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Order ID:</strong> {orderInfo._id}
                </Typography>
                <Typography variant="body2">
                  <strong>Card Type:</strong> {orderInfo.cardType.toUpperCase()}
                </Typography>
                <Typography variant="body2">
                  <strong>Quantity:</strong> {orderInfo.quantity}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> Pending
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Order Date:</strong> {new Date(orderInfo.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: "#666" }}>
                You can track your order status in the "My Orders" section of your profile.
              </Typography>

              <Typography variant="caption" sx={{ color: "#999" }}>
                A confirmation email will be sent to your registered email address.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            fullWidth
            sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserCardOrderWidget;
