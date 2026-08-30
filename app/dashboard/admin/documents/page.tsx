"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  Alert, Box, Button, Checkbox, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Sidebar from "@/components/sidebar/SideBar";

const emptyDocument = { title: "", titleNepali: "", category: "other", fileUrl: "", fileName: "", fileType: "", fileSize: 0, isPublished: true, displayOrder: 0 };
const categories = ["constitution", "report", "form", "financial", "template", "rules", "other"];

const formatSize = (bytes: number) => !bytes ? "—" : `${(bytes / 1024 / 1024).toFixed(bytes < 1024 * 1024 ? 2 : 1)} MB`;

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(emptyDocument);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/documents", { credentials: "include" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load documents");
      setDocuments(payload.data || []);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchDocuments(); }, []);

  const update = (key: string, value: any) => setCurrent((previous: any) => ({ ...previous, [key]: value }));
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true); setError("");
      const form = new FormData(); form.append("file", file); form.append("folder", "antuf/documents");
      const response = await fetch("/api/upload", { method: "POST", body: form, credentials: "include" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || "Upload failed");
      setCurrent((previous: any) => ({ ...previous, fileUrl: payload.url, fileName: file.name, fileType: file.name.split(".").pop()?.toUpperCase() || file.type, fileSize: file.size }));
    } catch (err: any) { setError(err.message); } finally { setUploading(false); event.target.value = ""; }
  };
  const save = async () => {
    if (!current.title || !current.fileUrl || !current.fileName) { setError("Enter a title and upload a media file."); return; }
    try {
      setSaving(true); setError("");
      const response = await fetch(current._id ? `/api/admin/documents/${current._id}` : "/api/admin/documents", {
        method: current._id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(current),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not save document");
      setOpen(false); setCurrent(emptyDocument); fetchDocuments();
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  };
  const remove = async (id: string) => {
    if (!window.confirm("Delete this document record? The uploaded file will remain in media storage.")) return;
    try {
      const response = await fetch(`/api/admin/documents/${id}`, { method: "DELETE", credentials: "include" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not delete document");
      fetchDocuments();
    } catch (err: any) { setError(err.message); }
  };

  return <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
    <Sidebar />
    <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 }, ml: { xs: 0, sm: "72px", md: "240px" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}>
        <Box><Typography variant="h4" fontWeight={700}>Documents & Media</Typography><Typography color="text.secondary">Upload, edit, publish, and remove files shown on the Documents page.</Typography></Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setCurrent(emptyDocument); setError(""); setOpen(true); }}>Add document</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      <TableContainer component={Paper}>{loading ? <Box sx={{ p: 6, textAlign: "center" }}><CircularProgress /></Box> : <Table>
        <TableHead><TableRow><TableCell>Title</TableCell><TableCell>Type</TableCell><TableCell>Category</TableCell><TableCell>Size</TableCell><TableCell>Published</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
        <TableBody>{documents.length ? documents.map((document) => <TableRow key={document._id}>
          <TableCell><Typography fontWeight={600}>{document.title}</Typography><Typography variant="caption" color="text.secondary">{document.fileName}</Typography></TableCell>
          <TableCell><Chip label={document.fileType || "FILE"} size="small" /></TableCell><TableCell>{document.category}</TableCell><TableCell>{formatSize(document.fileSize)}</TableCell><TableCell>{document.isPublished ? "Yes" : "No"}</TableCell>
          <TableCell align="right"><IconButton aria-label="edit document" onClick={() => { setCurrent(document); setError(""); setOpen(true); }}><EditIcon /></IconButton><IconButton aria-label="delete document" color="error" onClick={() => remove(document._id)}><DeleteIcon /></IconButton></TableCell>
        </TableRow>) : <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}>No documents yet. Add your first file.</TableCell></TableRow>}</TableBody>
      </Table>}</TableContainer>
      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{current._id ? "Edit document" : "Add document"}</DialogTitle><DialogContent>
          <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
            <TextField label="Title" required value={current.title} onChange={(e) => update("title", e.target.value)} />
            <TextField label="Nepali title (optional)" value={current.titleNepali || ""} onChange={(e) => update("titleNepali", e.target.value)} />
            <TextField select label="Category" value={current.category} onChange={(e) => update("category", e.target.value)}>{categories.map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}</TextField>
            <Button component="label" variant="outlined" startIcon={uploading ? <CircularProgress size={18} /> : <UploadFileIcon />} disabled={uploading}>{uploading ? "Uploading…" : current.fileUrl ? "Replace media file" : "Upload media file"}<input hidden type="file" onChange={handleFileUpload} /></Button>
            {current.fileUrl && <Alert severity="success">Uploaded: <a href={current.fileUrl} target="_blank" rel="noreferrer">{current.fileName}</a> ({formatSize(current.fileSize)})</Alert>}
            <TextField label="Display order" type="number" value={current.displayOrder} onChange={(e) => update("displayOrder", Number(e.target.value))} />
            <FormControlLabel control={<Checkbox checked={Boolean(current.isPublished)} onChange={(e) => update("isPublished", e.target.checked)} />} label="Published on public Documents page" />
          </Box>
        </DialogContent><DialogActions><Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button><Button variant="contained" onClick={save} disabled={saving || uploading}>{saving ? "Saving…" : "Save document"}</Button></DialogActions>
      </Dialog>
    </Box>
  </Box>;
}
