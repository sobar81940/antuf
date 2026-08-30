"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Box, Typography, IconButton, Tooltip,
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Avatar, alpha,
} from "@mui/material";
import { useRouter } from "next/navigation";

const ACCENT  = "#667eea";
const ACCENT2 = "#764ba2";
const BG      = "#f8fafc";
const BORDER  = "rgba(102,126,234,0.12)";

const statusMeta: Record<string, { color: string; dot: string }> = {
  published: { color: "#059669", dot: "#10b981" },
  draft:     { color: "#b45309", dot: "#f59e0b" },
  archived:  { color: "#6b7280", dot: "#9ca3af" },
  scheduled: { color: "#7c3aed", dot: "#8b5cf6" },
};

interface Props { searchQuery?: string; refreshKey?: number; }

const ArticleCard = ({ searchQuery = "", refreshKey = 0 }: Props) => {
  const router = useRouter();
  const [content,       setContent]       = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editOpen,      setEditOpen]      = useState(false);
  const [deleteOpen,    setDeleteOpen]    = useState(false);
  const [currentItem,   setCurrentItem]   = useState<any>(null);
  const [newTitle,      setNewTitle]      = useState("");

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/Article");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setContent(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load posts"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContent(); }, [refreshKey]);

  const filtered = content.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item?.title?.toLowerCase().includes(q) || item?.slug?.toLowerCase().includes(q);
  });

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/Article/${currentItem?._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setContent((p) => p.filter((c) => c._id !== currentItem?._id));
      toast.success("Post deleted"); setDeleteOpen(false);
    } catch { toast.error("Delete failed"); }
    finally { setActionLoading(false); }
  };

  const handleEditSave = async () => {
    if (!newTitle.trim()) { toast.error("Title required"); return; }
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/Article/${currentItem?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(), slug: currentItem?.slug,
          category: currentItem?.category?._id || currentItem?.category,
          status: currentItem?.status,
          language: currentItem?.contentLanguage || "ne",
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setContent((p) => p.map((c) => (c._id === updated._id ? updated : c)));
      toast.success("Post updated"); setEditOpen(false);
    } catch { toast.error("Update failed"); }
    finally { setActionLoading(false); }
  };

  if (loading) return (
    <Box sx={{ display:"flex", justifyContent:"center", py:10 }}>
      <CircularProgress sx={{ color: ACCENT }} size={40} />
    </Box>
  );

  return (
    <>
      {/* toolbar */}
      <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:1.5, mt:2, mb:1.5 }}>
        <Typography sx={{ fontSize:"0.82rem", color:"#64748b", fontWeight:500 }}>
          {filtered.length} post{filtered.length !== 1 ? "s" : ""}
          {searchQuery ? ` matching "${searchQuery}"` : " total"}
        </Typography>
        <Button size="small" startIcon={<RefreshIcon sx={{ fontSize:16 }} />}
          onClick={fetchContent} disabled={loading}
          sx={{ color:ACCENT, textTransform:"none", fontWeight:600, fontSize:"0.82rem",
            borderRadius:2, px:1.5, "&:hover":{ bgcolor:alpha(ACCENT,0.07) }}}>
          Refresh
        </Button>
      </Box>

      {/* empty state */}
      {filtered.length === 0 && (
        <Box sx={{ textAlign:"center", py:10, bgcolor:"#fff", borderRadius:3,
          border:`1px solid ${BORDER}`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
          <Typography sx={{ fontSize:"2.5rem", mb:1.5 }}>📄</Typography>
          <Typography sx={{ fontWeight:700, color:"#334155", mb:0.5 }}>
            {searchQuery ? "No posts match your search" : "No posts yet"}
          </Typography>
          <Typography sx={{ fontSize:"0.85rem", color:"#94a3b8" }}>
            {searchQuery ? "Try a different keyword" : `Click "New Post" to create your first post`}
          </Typography>
        </Box>
      )}

      {/* posts table */}
      {filtered.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius:3, border:`1px solid ${BORDER}`,
          boxShadow:"0 1px 8px rgba(0,0,0,0.05)", overflow:"hidden" }}>
          <Table sx={{ minWidth: 680 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(ACCENT, 0.05) }}>
                {["#","Cover","Title","Category","Status","Actions"].map((h) => (
                  <TableCell key={h} align={h==="Actions"?"center":"left"} sx={{ color:ACCENT,
                    fontWeight:800, fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:0.8,
                    borderBottom:`2px solid ${alpha(ACCENT,0.15)}`, py:1.8, whiteSpace:"nowrap" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item, idx) => {
                const sm = statusMeta[item?.status] || statusMeta.draft;
                return (
                  <TableRow key={item._id} sx={{ "&:hover":{ bgcolor:alpha(ACCENT,0.025) },
                    "&:last-child td":{ borderBottom:"none" } }}>
                    <TableCell sx={{ color:"#94a3b8", fontSize:"0.8rem", fontWeight:600, py:1.5, width:36 }}>
                      {idx+1}
                    </TableCell>
                    <TableCell sx={{ py:1.5, width:60 }}>
                      <Avatar variant="rounded" src={item?.featureImage||""}
                        sx={{ width:48, height:40, borderRadius:1.5, bgcolor:alpha(ACCENT,0.1), fontSize:"1rem" }}>
                        📄
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ py:1.5, maxWidth:220 }}>
                      <Typography sx={{ fontWeight:700, fontSize:"0.88rem", color:"#1e293b",
                        overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2,
                        WebkitBoxOrient:"vertical", lineHeight:1.35, mb:0.25 }}>
                        {item?.title||"Untitled"}
                      </Typography>
                      <Typography sx={{ fontSize:"0.7rem", color:"#94a3b8", fontFamily:"monospace",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        /post/{item?.slug}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py:1.5 }}>
                      <Chip label={item?.category?.name||item?.category||"—"} size="small"
                        sx={{ bgcolor:alpha(ACCENT,0.08), color:ACCENT, fontWeight:600, fontSize:"0.75rem",
                          border:`1px solid ${alpha(ACCENT,0.2)}`, "& .MuiChip-label":{ px:1 } }} />
                    </TableCell>
                    <TableCell sx={{ py:1.5 }}>
                      <Box sx={{ display:"flex", alignItems:"center", gap:0.7 }}>
                        <Box sx={{ width:7, height:7, borderRadius:"50%", bgcolor:sm.dot }} />
                        <Typography sx={{ fontSize:"0.78rem", fontWeight:700, color:sm.color, textTransform:"capitalize" }}>
                          {item?.status||"draft"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ py:1.5 }}>
                      <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0.3 }}>
                        <Tooltip title="View">
                          <IconButton size="small" onClick={()=>router.push(`/post/${item?.slug}`)}
                            sx={{ color:"#cbd5e1","&:hover":{color:ACCENT,bgcolor:alpha(ACCENT,0.08)} }}>
                            <OpenInNewIcon sx={{ fontSize:16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit content">
                          <IconButton size="small"
                            onClick={()=>router.push(`/dashboard/admin/create/post/articleeditorcontent?id=${item?._id}`)}
                            sx={{ color:"#cbd5e1","&:hover":{color:"#8b5cf6",bgcolor:"rgba(139,92,246,0.08)"} }}>
                            <EditNoteIcon sx={{ fontSize:16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Quick edit">
                          <IconButton size="small"
                            onClick={()=>{setCurrentItem(item);setNewTitle(item?.title);setEditOpen(true);}}
                            sx={{ color:"#cbd5e1","&:hover":{color:ACCENT,bgcolor:alpha(ACCENT,0.08)} }}>
                            <EditIcon sx={{ fontSize:16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small"
                            onClick={()=>{setCurrentItem(item);setDeleteOpen(true);}}
                            sx={{ color:"#cbd5e1","&:hover":{color:"#ef4444",bgcolor:"rgba(239,68,68,0.08)"} }}>
                            <DeleteOutlineIcon sx={{ fontSize:16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}


      {/* ── quick-edit dialog ── */}
      <Dialog open={editOpen} onClose={()=>setEditOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:3 } }}>
        <DialogTitle sx={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})`,
          color:"#fff", fontWeight:800, py:2, px:3, fontSize:"1rem" }}>
          Quick Edit Post
        </DialogTitle>
        <DialogContent sx={{ pt:3, pb:1, px:3 }}>
          <TextField fullWidth autoFocus label="Post Title" value={newTitle}
            onChange={(e)=>setNewTitle(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root":{ borderRadius:2,
              "& fieldset":{borderColor:BORDER},
              "&.Mui-focused fieldset":{borderColor:ACCENT,borderWidth:2} },
              "& .MuiInputLabel-root.Mui-focused":{color:ACCENT} }} />
        </DialogContent>
        <DialogActions sx={{ px:3, py:2, gap:1, borderTop:`1px solid ${BORDER}` }}>
          <Button onClick={()=>setEditOpen(false)}
            sx={{ color:"#64748b", textTransform:"none", fontWeight:600 }}>Cancel</Button>
          <Button onClick={handleEditSave} disabled={actionLoading} variant="contained"
            sx={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})`, textTransform:"none",
              fontWeight:700, borderRadius:2, px:3, "&:disabled":{opacity:0.6} }}>
            {actionLoading ? <CircularProgress size={16} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── delete dialog ── */}
      <Dialog open={deleteOpen} onClose={()=>setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:3 } }}>
        <DialogTitle sx={{ fontWeight:800, color:"#1e293b", py:2, px:3, fontSize:"1rem",
          borderBottom:`1px solid ${BORDER}` }}>
          Delete Post?
        </DialogTitle>
        <DialogContent sx={{ pt:2.5, px:3 }}>
          <Typography sx={{ fontSize:"0.9rem", color:"#475569", lineHeight:1.6 }}>
            Are you sure you want to delete{" "}
            <Box component="span" sx={{ fontWeight:700, color:"#1e293b" }}>
              &quot;{currentItem?.title}&quot;
            </Box>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px:3, py:2, gap:1, borderTop:`1px solid ${BORDER}` }}>
          <Button onClick={()=>setDeleteOpen(false)}
            sx={{ color:"#64748b", textTransform:"none", fontWeight:600 }}>Cancel</Button>
          <Button onClick={handleDelete} disabled={actionLoading} variant="contained"
            sx={{ bgcolor:"#ef4444", textTransform:"none", fontWeight:700, borderRadius:2, px:3,
              "&:hover":{bgcolor:"#dc2626"}, "&:disabled":{opacity:0.6} }}>
            {actionLoading ? <CircularProgress size={16} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ArticleCard;
