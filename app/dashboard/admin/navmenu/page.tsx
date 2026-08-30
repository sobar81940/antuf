"use client";

import { useState, useEffect } from "react";
import {
  Box, Button, Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Switch,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Tooltip, Chip, Divider, CircularProgress, Stack, Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon,
  SubdirectoryArrowRight as ChildIcon,
} from "@mui/icons-material";
import Sidebar from "@/components/sidebar/SideBar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const emptyItem = { label: "", labelEn: "", path: "", children: [], order: 0, isVisible: true };
const emptyChild = { label: "", labelEn: "", path: "" };

export default function NavMenuPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/");
  }, [session, status]);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/navmenu");
      const json = await res.json();
      if (json.success) setItems(json.data);
      else setError(json.error);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ ...emptyItem, order: items.length });
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      label: item.label, labelEn: item.labelEn, path: item.path,
      children: item.children || [], order: item.order, isVisible: item.isVisible,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => { setDialogOpen(false); setEditItem(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editItem ? "PUT" : "POST";
      const url = editItem ? `/api/admin/navmenu/${editItem._id}` : "/api/admin/navmenu";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) { await fetchItems(); closeDialog(); }
      else setError(json.error);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/navmenu/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { setDeleteConfirm(null); await fetchItems(); }
      else setError(json.error);
    } catch (e) { setError(e.message); }
  };

  const toggleVisibility = async (item) => {
    try {
      await fetch(`/api/admin/navmenu/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isVisible: !item.isVisible }),
      });
      await fetchItems();
    } catch (e) { setError(e.message); }
  };

  const moveItem = async (index, dir) => {
    const swapIdx = index + dir;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const updated = [...items];
    [updated[index], updated[swapIdx]] = [updated[swapIdx], updated[index]];
    // Update orders
    await Promise.all(updated.map((item, i) =>
      fetch(`/api/admin/navmenu/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, order: i }),
      })
    ));
    await fetchItems();
  };

  // Child management
  const addChild = () => setForm(f => ({ ...f, children: [...f.children, { ...emptyChild }] }));
  const updateChild = (i, field, val) =>
    setForm(f => { const c = [...f.children]; c[i] = { ...c[i], [field]: val }; return { ...f, children: c }; });
  const removeChild = (i) =>
    setForm(f => { const c = [...f.children]; c.splice(i, 1); return { ...f, children: c }; });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, ml: { sm: "70px", md: "240px" } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#1e293b">
                🗂️ Navigation Menu Manager
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Add, edit, reorder and toggle navbar items shown on the home page
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2, px: 3, fontWeight: 600,
                "&:hover": { background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)" },
              }}
            >
              Add Menu Item
            </Button>
          </Box>

          {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress sx={{ color: "#667eea" }} />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "linear-gradient(90deg,#667eea,#764ba2)" }}>
                    {["Order","Label (NP)","Label (EN)","Path","Children","Visible","Actions"].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: "#374151", bgcolor: "#f1f5f9" }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                        No menu items yet. Click "Add Menu Item" to create the first one.
                      </TableCell>
                    </TableRow>
                  )}
                  {items.map((item, index) => (
                    <TableRow key={item._id} hover sx={{ "&:last-child td": { border: 0 } }}>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Tooltip title="Move up">
                            <span>
                              <IconButton size="small" onClick={() => moveItem(index, -1)} disabled={index === 0}>
                                <UpIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Typography variant="body2" fontWeight={600} sx={{ minWidth: 20, textAlign: "center" }}>
                            {index + 1}
                          </Typography>
                          <Tooltip title="Move down">
                            <span>
                              <IconButton size="small" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1}>
                                <DownIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>{item.label}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{item.labelEn || "—"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: "monospace", color: "#6366f1" }}>
                          {item.path || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {item.children?.length > 0 ? (
                          <Chip
                            icon={<ChildIcon sx={{ fontSize: 14 }} />}
                            label={`${item.children.length} sub-items`}
                            size="small"
                            sx={{ bgcolor: "#ede9fe", color: "#7c3aed" }}
                          />
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.isVisible}
                          onChange={() => toggleVisibility(item)}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openEdit(item)} sx={{ color: "#6366f1" }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setDeleteConfirm(item)} sx={{ color: "#ef4444" }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: "#1e293b" }}>
          {editItem ? "Edit Menu Item" : "New Menu Item"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Label (Nepali) *"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              fullWidth size="small"
              placeholder="e.g. हाम्रो बारेमा"
            />
            <TextField
              label="Label (English)"
              value={form.labelEn}
              onChange={e => setForm(f => ({ ...f, labelEn: e.target.value }))}
              fullWidth size="small"
              placeholder="e.g. About Us"
            />
            <TextField
              label="Path / URL"
              value={form.path}
              onChange={e => setForm(f => ({ ...f, path: e.target.value }))}
              fullWidth size="small"
              placeholder="e.g. /pages/about  (leave blank for dropdown-only)"
              helperText="Leave empty if this item is a dropdown with children only"
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">Visible:</Typography>
              <Switch
                checked={form.isVisible}
                onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))}
                color="success"
              />
            </Box>

            {/* Children / Dropdown sub-items */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#374151">
                  Dropdown Sub-items
                </Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={addChild}
                  sx={{ color: "#667eea", textTransform: "none" }}>
                  Add Sub-item
                </Button>
              </Box>
              {form.children.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  No sub-items. Click "Add Sub-item" to create a dropdown.
                </Typography>
              )}
              {form.children.map((child, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center", flexWrap: "wrap" }}>
                  <TextField
                    size="small" label="Label (NP)" value={child.label}
                    onChange={e => updateChild(i, "label", e.target.value)}
                    sx={{ flex: 1, minWidth: 120 }}
                  />
                  <TextField
                    size="small" label="Label (EN)" value={child.labelEn}
                    onChange={e => updateChild(i, "labelEn", e.target.value)}
                    sx={{ flex: 1, minWidth: 100 }}
                  />
                  <TextField
                    size="small" label="Path" value={child.path}
                    onChange={e => updateChild(i, "path", e.target.value)}
                    sx={{ flex: 1.5, minWidth: 140 }}
                  />
                  <IconButton size="small" onClick={() => removeChild(i)} sx={{ color: "#ef4444" }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeDialog} sx={{ color: "text.secondary" }}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !form.label}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": { background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)" },
            }}
          >
            {saving ? <CircularProgress size={20} sx={{ color: "white" }} /> : editItem ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Delete Menu Item?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>"{deleteConfirm?.label}"</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            variant="contained" color="error"
            onClick={() => handleDelete(deleteConfirm._id)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
