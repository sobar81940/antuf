"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Delete,
  Mail,
  MailOutline,
  MarkEmailRead,
  Search,
  Refresh,
} from "@mui/icons-material";
import Sidebar from "@/components/sidebar/SideBar";

interface ContactMessage {
  _id: string;
  reason: string;
  name: string;
  email: string;
  contactNumber: string;
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [working, setWorking] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/messages?${params.toString()}`);
      const payload = await res.json();
      if (!res.ok || !payload.success) throw new Error(payload.error || "Could not load messages");
      setMessages(payload.data || []);
      setUnreadCount(payload.unreadCount || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (message: ContactMessage, status: "read" | "unread") => {
    try {
      const res = await fetch(`/api/admin/messages/${message._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.success) throw new Error(payload.error || "Failed to update");
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setWorking(true);
    try {
      const res = await fetch(`/api/admin/messages/${deleteTarget._id}`, { method: "DELETE" });
      const payload = await res.json();
      if (!res.ok || !payload.success) throw new Error(payload.error || "Failed to delete");
      setDeleteTarget(null);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setWorking(false);
    }
  };
return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, ml: { sm: "70px", md: "240px" } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { sm: "center" }, gap: 2, mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={800}>Contact Messages</Typography>
              <Typography color="text.secondary">Messages sent from the website&apos;s &quot;Send Us a Message&quot; form.</Typography>
            </Box>
            <Button variant="outlined" startIcon={<Refresh />} onClick={load}>Refresh</Button>
          </Box>

          {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3 }}>{error}</Alert>}

          <Card sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: { md: "center" } }}>
              <TextField
                size="small"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") load(); }}
                placeholder="Search by name, email or message..."
                InputProps={{ startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} /> }}
              />
              <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                <Button variant={filter === "all" ? "contained" : "outlined"} onClick={() => setFilter("all")}>
                  All <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }} />
                </Button>
                <Button variant={filter === "unread" ? "contained" : "outlined"} onClick={() => setFilter("unread")}>Unread</Button>
                <Button variant={filter === "read" ? "contained" : "outlined"} onClick={() => setFilter("read")}>Read</Button>
              </Box>
            </Box>
          </Card>
{loading ? (
            <Box sx={{ display: "grid", placeItems: "center", py: 10 }}><CircularProgress /></Box>
          ) : messages.length === 0 ? (
            <Card sx={{ py: 8, textAlign: "center" }}>
              <MailOutline sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
              <Typography color="text.secondary">No contact messages found.</Typography>
            </Card>
          ) : (
            messages.map((message) => (
              <Card key={message._id} sx={{ mb: 2, borderLeft: message.status === "unread" ? "4px solid #1976d2" : "none", bgcolor: message.status === "unread" ? "#f0f7ff" : "background.paper" }}>
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 1 }}>
                    <Chip
                      icon={message.status === "unread" ? <Mail fontSize="small" /> : <MarkEmailRead fontSize="small" />}
                      label={message.status === "unread" ? "Unread" : "Read"}
                      size="small"
                      color={message.status === "unread" ? "primary" : "default"}
                    />
                    {message.reason && <Chip label={message.reason} size="small" variant="outlined" />}
                    <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                      {new Date(message.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>{message.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {message.email}{message.contactNumber ? ` · ${message.contactNumber}` : ""}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>{message.message}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
                    <Tooltip title={message.status === "unread" ? "Mark as read" : "Mark as unread"}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={message.status === "unread" ? <MarkEmailRead /> : <MailOutline />}
                        onClick={() => setStatus(message, message.status === "unread" ? "read" : "unread")}
                      >
                        {message.status === "unread" ? "Mark as read" : "Mark as unread"}
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" size="small" onClick={() => setDeleteTarget(message)} aria-label="Delete message">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Card>
            ))
          )}
        </Container>
      </Box>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete message</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete this message from {deleteTarget?.name}? This cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={working}>
            {working ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}