"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, Checkbox, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Add, Delete, Edit, Image as ImageIcon } from "@mui/icons-material";
import Sidebar from "@/components/sidebar/SideBar";

const empty = { image: "", title: "", caption: "", category: "home", order: 0, isPublished: true };

export default function GalleryAdminPage() {
  const [images, setImages] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [batchFiles, setBatchFiles] = useState<File[]>([]);

  const load = async () => {
    setLoading(true);
    try { const result = await fetch("/api/admin/gallery").then((response) => response.json()); if (!result.success) throw new Error(result.error); setImages(result.data || []); }
    catch (loadError) { setError(loadError.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const update = (field: string, value: any) => setForm((current: any) => ({ ...current, [field]: value }));
  const openCreate = () => { setEditing(null); setBatchFiles([]); setForm({ ...empty, order: images.length }); setOpen(true); };
  const openEdit = (image: any) => { setEditing(image); setBatchFiles([]); setForm({ ...image }); setOpen(true); };
  const save = async () => {
    if ((!form.image && !batchFiles.length) || !form.category) { setError("Select an image or provide an image URL, and choose a category."); return; }
    setSaving(true);
    try {
      const uploadedImages = !editing && batchFiles.length ? await Promise.all(batchFiles.map(upload)) : [form.image];
      for (const [index, image] of uploadedImages.entries()) {
        const payload = { ...form, image, order: Number(form.order || 0) + index };
        const response = await fetch(editing ? `/api/admin/gallery/${editing._id}` : "/api/admin/gallery", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const result = await response.json(); if (!response.ok || !result.success) throw new Error(result.error);
      }
      setOpen(false); setBatchFiles([]); await load();
    } catch (saveError) { setError(saveError.message); } finally { setSaving(false); }
  };
  const remove = async (id: string) => { if (!window.confirm("Delete this gallery image?")) return; await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" }); await load(); };
  const upload = async (file: File) => {
    const data = new FormData(); data.append("file", file); data.append("upload_preset", "ml_default");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
    const result = await response.json(); if (!response.ok) throw new Error("Image upload failed"); return result.secure_url;
  };
  const visibleImages = category === "all" ? images : images.filter((image) => image.category === category);
  const categories = [...new Set(images.map((image) => image.category))];

  return <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}><Sidebar /><Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, ml: { sm: "70px", md: "240px" } }}><Container maxWidth="xl">
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2} sx={{ mb: 4 }}><Box><Typography variant="h4" fontWeight={800}>Image Gallery</Typography><Typography color="text.secondary">Create categorized image collections shown across the website.</Typography></Box><Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add image</Button></Stack>
    {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3 }}>{error}</Alert>}
    <TextField select size="small" label="Filter category" value={category} onChange={(event) => setCategory(event.target.value)} sx={{ minWidth: 220, mb: 3 }}><MenuItem value="all">All categories</MenuItem>{categories.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>
    {loading ? <Box sx={{ display: "grid", placeItems: "center", py: 10 }}><CircularProgress /></Box> : <Grid container spacing={3}>{visibleImages.map((image) => <Grid key={image._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}><Card sx={{ height: "100%" }}><Box component="img" src={image.image} alt={image.title || image.category} sx={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", display: "block" }} /><Box sx={{ p: 2 }}><Typography fontWeight={700} noWrap>{image.title || "Untitled image"}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{image.category} {image.isPublished ? "· Published" : "· Draft"}</Typography><Stack direction="row" justifyContent="flex-end"><IconButton onClick={() => openEdit(image)} aria-label="Edit image"><Edit /></IconButton><IconButton color="error" onClick={() => remove(image._id)} aria-label="Delete image"><Delete /></IconButton></Stack></Box></Card></Grid>)}</Grid>}
    {!loading && visibleImages.length === 0 && <Typography color="text.secondary" sx={{ py: 8, textAlign: "center" }}>No images in this category yet.</Typography>}
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"><DialogTitle>{editing ? "Edit gallery image" : "Add gallery image"}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><Button component="label" variant="outlined" startIcon={<ImageIcon />}>{editing ? "Replace image" : "Select one or multiple images"}<input hidden multiple={!editing} accept="image/*" type="file" onChange={(event) => { const files = Array.from(event.target.files || []); if (editing && files[0]) upload(files[0]).then((image) => update("image", image)).catch((uploadError) => setError(uploadError.message)); else setBatchFiles(files); }} /></Button>{!editing && batchFiles.length > 0 && <Typography variant="body2" color="text.secondary">{batchFiles.length} image{batchFiles.length === 1 ? "" : "s"} selected. They will share the details below.</Typography>}{form.image && editing && <Box component="img" src={form.image} alt="Preview" sx={{ width: "100%", maxHeight: 220, objectFit: "cover" }} />}{editing && <TextField fullWidth label="Image URL" value={form.image} onChange={(event) => update("image", event.target.value)} required />}{!editing && !batchFiles.length && <TextField fullWidth label="Image URL" value={form.image} onChange={(event) => update("image", event.target.value)} helperText="Use this for one image, or select multiple files above." required />}{!editing && batchFiles.length > 0 && <TextField fullWidth label="Image URL (optional)" value={form.image} onChange={(event) => update("image", event.target.value)} />}<Grid container spacing={2}><Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Image title" value={form.title} onChange={(event) => update("title", event.target.value)} /></Grid><Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Category name" value={form.category} onChange={(event) => update("category", event.target.value)} helperText="Example: home, events, training" required /></Grid></Grid><TextField fullWidth multiline rows={2} label="Caption" value={form.caption} onChange={(event) => update("caption", event.target.value)} /><TextField fullWidth type="number" label="Display order" value={form.order} onChange={(event) => update("order", Number(event.target.value))} /><FormControlLabel control={<Checkbox checked={Boolean(form.isPublished)} onChange={(event) => update("isPublished", event.target.checked)} />} label="Published" /></Stack></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save} variant="contained" disabled={saving}>{saving ? "Uploading..." : "Save image"}</Button></DialogActions></Dialog>
  </Container></Box></Box>;
}