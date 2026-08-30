"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import AdminCardPrintViewer from "@/components/admin/CardPrint/AdminCardPrintViewer";

const AdminCardManagement = ({ members = [] }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("bulk"); // "bulk" or "individual"
  const [cardType, setCardType] = useState("standard");
  const [batchName, setBatchName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIndividualId, setSelectedIndividualId] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [cardViewOpen, setCardViewOpen] = useState(false);
  const [selectedCardOrder, setSelectedCardOrder] = useState(null);
  const [userDetailsForCard, setUserDetailsForCard] = useState(null);
  const [fetchingCardDetails, setFetchingCardDetails] = useState(false);

  const handleSelectMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMembers(members.map((m) => m._id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleOpenBulkDialog = () => {
    setDialogMode("bulk");
    setBatchName("");
    setDescription("");
    setNotes("");
    setTags("");
    setCardType("standard");
    setOpenDialog(true);
  };

  const handleOpenIndividualDialog = (memberId) => {
    setDialogMode("individual");
    setSelectedIndividualId(memberId);
    setQuantity("1");
    setCardType("standard");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIndividualId(null);
  };

  const handleCreateBulkOrder = async () => {
    if (!batchName.trim() || selectedMembers.length === 0) {
      toast.error("Please enter a batch name and select at least one member");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/admin/cardbulkorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchName,
          userIds: selectedMembers,
          cardType,
          description,
          notes,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create bulk order");
      }

      toast.success("Bulk order created successfully!");
      handleCloseDialog();
      setSelectedMembers([]);
      setBatchName("");
      setDescription("");
      setNotes("");
      setTags("");

      // Optionally refresh the list
      if (window.location.href.includes("/dashboard/admin")) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating bulk order:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIndividualOrder = async () => {
    if (!selectedIndividualId) {
      toast.error("No member selected");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/admin/cardqueue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedIndividualId,
          quantity: parseInt(quantity),
          cardType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create print request");
      }

      toast.success("Print request created successfully!");
      handleCloseDialog();

      // Refresh
      if (window.location.href.includes("/dashboard/admin")) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating print request:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Card sx={{ mb: 3, bgcolor: "#1E1E1E", color: "white" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Card Print Management
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenBulkDialog}
              disabled={selectedMembers.length === 0}
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              }}
            >
              Create Bulk Order ({selectedMembers.length} selected)
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              sx={{ color: "#00ff88", borderColor: "#00ff88" }}
            >
              Print Selected Cards
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Selection Controls */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedMembers.length === members.length && members.length > 0}
              indeterminate={selectedMembers.length > 0 && selectedMembers.length < members.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              sx={{ color: "white" }}
            />
          }
          label={`Select All (${members.length})`}
          sx={{ color: "white" }}
        />
        {selectedMembers.length > 0 && (
          <Chip
            label={`${selectedMembers.length} selected`}
            color="primary"
            onDelete={() => setSelectedMembers([])}
          />
        )}
      </Box>

      {/* Members Table with Selection */}
      <TableContainer component={Paper} sx={{ bgcolor: "#1E1E1E" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#252525" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold", width: "50px" }}>
                <Checkbox
                  checked={selectedMembers.length === members.length && members.length > 0}
                  indeterminate={selectedMembers.length > 0 && selectedMembers.length < members.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  sx={{ color: "white" }}
                />
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", width: "80px" }}>
                Photo
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member._id}
                sx={{
                  bgcolor: selectedMembers.includes(member._id)
                    ? "rgba(33, 150, 243, 0.2)"
                    : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedMembers.includes(member._id)}
                    onChange={() => handleSelectMember(member._id)}
                    sx={{ color: "white" }}
                  />
                </TableCell>
                <TableCell>
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "#4A90E2",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                    onError={(e) => {
                      // Show user initials if image fails to load
                      const firstLetter = member.name?.charAt(0)?.toUpperCase() || "?";
                      const secondLetter = member.name?.split(" ")[1]?.charAt(0)?.toUpperCase() || "";
                      const target = e.target as HTMLElement;
                      target.textContent = firstLetter + secondLetter;
                      target.style.backgroundColor = "#4A90E2";
                    }}
                  >
                    {member.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </TableCell>
                <TableCell sx={{ color: "white" }}>{member.name}</TableCell>
                <TableCell sx={{ color: "white" }}>{member.email}</TableCell>
                <TableCell>
                  <Chip
                    label={member.isActive ? "Active" : "Inactive"}
                    color={member.isActive ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={() => handleOpenIndividualDialog(member._id)}
                    variant="outlined"
                    sx={{ color: "#00ff88", borderColor: "#00ff88" }}
                  >
                    Print Card
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Bulk Order */}
      <Dialog open={openDialog && dialogMode === "bulk"} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#1E1E1E", color: "white" }}>
          Create Bulk Card Print Order
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#1E1E1E", color: "white" }}>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Batch Name"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="e.g., July 2024 Batch"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.5)",
                  opacity: 1,
                },
              }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes about this batch"
              multiline
              rows={3}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                },
              }}
            />
            <TextField
              label="Card Type"
              select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                },
                "& .MuiNativeSelect-select": {
                  color: "white",
                },
              }}
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="digital">Digital</option>
            </TextField>
            <TextField
              label="Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Separate with commas"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                },
              }}
            />
            <Alert severity="info">
              This will create {selectedMembers.length} print requests - one for each selected member.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#1E1E1E", p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateBulkOrder}
            disabled={loading}
            variant="contained"
            sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Individual Order */}
      <Dialog open={openDialog && dialogMode === "individual"} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#1E1E1E", color: "white" }}>
          Create Print Request
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#1E1E1E", color: "white" }}>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1, max: 100 }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                },
              }}
            />
            <TextField
              label="Card Type"
              select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.23)",
                  },
                },
                "& .MuiNativeSelect-select": {
                  color: "white",
                },
              }}
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="digital">Digital</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#1E1E1E", p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateIndividualOrder}
            disabled={loading}
            variant="contained"
            sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            Create Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCardManagement;
