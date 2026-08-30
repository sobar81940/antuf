"use client";

import React, { useEffect, useState } from "react";
import {
    Alert, Box, Button, Card, CircularProgress, Container, Divider, Grid, IconButton,
    Snackbar, Stack, TextField, Typography,
} from "@mui/material";
import { Add, Delete, Save } from "@mui/icons-material";

const emptyPage = {
    headerTitle: "", headerTitleEn: "", headerSubtitle: "", intro: "",
    stats: [], milestones: [], visionTitle: "", vision: "",
};

export default function HistoryAdmin() {
    const [formData, setFormData] = useState<any>(emptyPage);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        fetch("/api/admin/history").then((response) => response.json()).then((result) => {
            if (result.success) setFormData(result.data);
            else setNotice(result.error || "Unable to load history page");
        }).catch(() => setNotice("Unable to load history page")).finally(() => setLoading(false));
    }, []);

    const update = (field: string, value: any) => setFormData((current) => ({ ...current, [field]: value }));
    const updateItem = (collection: "stats" | "milestones", index: number, field: string, value: string) => {
        const next = [...(formData[collection] || [])];
        next[index] = { ...next[index], [field]: value };
        update(collection, next);
    };
    const addItem = (collection: "stats" | "milestones") => update(collection, [...(formData[collection] || []), collection === "stats" ? { value: "", label: "", description: "" } : { year: "", title: "", description: "" }]);
    const removeItem = (collection: "stats" | "milestones", index: number) => update(collection, formData[collection].filter((_, itemIndex) => itemIndex !== index));
    const save = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/admin/history", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || "Unable to save history page");
            setFormData(result.data); setNotice("History page saved successfully");
        } catch (error) { setNotice(error.message); } finally { setSaving(false); }
    };

    if (loading) return <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;

    return <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2} sx={{ mb: 4 }}>
            <Box><Typography variant="h4" fontWeight={800}>इतिहास व्यवस्थापन</Typography><Typography color="text.secondary">Edit the public History page content.</Typography></Box>
            <Button variant="contained" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />} onClick={save} disabled={saving}>Save changes</Button>
        </Stack>
        <Stack spacing={3}>
            <Card sx={{ p: 3 }}><Typography variant="h6" fontWeight={700} gutterBottom>Header and introduction</Typography><Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Title (Nepali)" value={formData.headerTitle || ""} onChange={(e) => update("headerTitle", e.target.value)} /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Title (English)" value={formData.headerTitleEn || ""} onChange={(e) => update("headerTitleEn", e.target.value)} /></Grid>
                <Grid size={12}><TextField fullWidth multiline rows={2} label="Subtitle" value={formData.headerSubtitle || ""} onChange={(e) => update("headerSubtitle", e.target.value)} /></Grid>
                <Grid size={12}><TextField fullWidth multiline rows={3} label="Introduction" value={formData.intro || ""} onChange={(e) => update("intro", e.target.value)} /></Grid>
            </Grid></Card>
            <Card sx={{ p: 3 }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" fontWeight={700}>Impact statistics</Typography><Button startIcon={<Add />} onClick={() => addItem("stats")}>Add statistic</Button></Stack><Stack spacing={2} sx={{ mt: 2 }}>{(formData.stats || []).map((item, index) => <Box key={index} sx={{ p: 2, bgcolor: "#f7f8f8" }}><Grid container spacing={2} alignItems="center"><Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth label="Value" value={item.value || ""} onChange={(e) => updateItem("stats", index, "value", e.target.value)} /></Grid><Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Label" value={item.label || ""} onChange={(e) => updateItem("stats", index, "label", e.target.value)} /></Grid><Grid size={{ xs: 11, sm: 4 }}><TextField fullWidth label="Description" value={item.description || ""} onChange={(e) => updateItem("stats", index, "description", e.target.value)} /></Grid><Grid size={{ xs: 1, sm: 1 }}><IconButton color="error" onClick={() => removeItem("stats", index)} aria-label="Delete statistic"><Delete /></IconButton></Grid></Grid></Box>)}</Stack></Card>
            <Card sx={{ p: 3 }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h6" fontWeight={700}>Timeline milestones</Typography><Button startIcon={<Add />} onClick={() => addItem("milestones")}>Add milestone</Button></Stack><Stack spacing={2} sx={{ mt: 2 }}>{(formData.milestones || []).map((item, index) => <Box key={index} sx={{ p: 2, bgcolor: "#f7f8f8" }}><Grid container spacing={2} alignItems="center"><Grid size={{ xs: 12, sm: 2 }}><TextField fullWidth label="Year" value={item.year || ""} onChange={(e) => updateItem("milestones", index, "year", e.target.value)} /></Grid><Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Title" value={item.title || ""} onChange={(e) => updateItem("milestones", index, "title", e.target.value)} /></Grid><Grid size={{ xs: 11, sm: 5 }}><TextField fullWidth multiline label="Description" value={item.description || ""} onChange={(e) => updateItem("milestones", index, "description", e.target.value)} /></Grid><Grid size={{ xs: 1, sm: 1 }}><IconButton color="error" onClick={() => removeItem("milestones", index)} aria-label="Delete milestone"><Delete /></IconButton></Grid></Grid></Box>)}</Stack></Card>
            <Card sx={{ p: 3 }}><Typography variant="h6" fontWeight={700} gutterBottom>Vision</Typography><Grid container spacing={2}><Grid size={{ xs: 12, md: 5 }}><TextField fullWidth label="Vision title" value={formData.visionTitle || ""} onChange={(e) => update("visionTitle", e.target.value)} /></Grid><Grid size={12}><TextField fullWidth multiline rows={3} label="Vision statement" value={formData.vision || ""} onChange={(e) => update("vision", e.target.value)} /></Grid></Grid></Card>
        </Stack>
        <Divider sx={{ mt: 4 }} />
        <Snackbar open={Boolean(notice)} autoHideDuration={5000} onClose={() => setNotice("")}><Alert severity={notice.includes("success") ? "success" : "error"} onClose={() => setNotice("")}>{notice}</Alert></Snackbar>
    </Container>;
}