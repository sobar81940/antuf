"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Breadcrumbs, Button, Card, CardContent, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Link, Paper, TextField, Typography } from "@mui/material";
import { Close as CloseIcon, Description as DescriptionIcon, Download as DownloadIcon, Home as HomeIcon, InsertDriveFile as FileIcon, NavigateNext as NavigateNextIcon, PictureAsPdf as PdfIcon, Search as SearchIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const categoryLabels: Record<string, string> = { constitution: "विधान", report: "प्रतिवेदन", form: "फारम", financial: "आर्थिक", template: "ढाँचा", rules: "नियम", other: "अन्य" };
const formatSize = (bytes?: number) => !bytes ? "—" : `${(bytes / 1024 / 1024).toFixed(bytes < 1024 * 1024 ? 2 : 1)} MB`;

export default function DocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/documents").then((response) => response.json()).then((payload) => setDocuments(payload.data || [])).catch(() => setDocuments([])).finally(() => setLoading(false));
  }, []);
  const filteredDocuments = useMemo(() => documents.filter((document) => `${document.title} ${document.titleNepali || ""}`.toLowerCase().includes(searchQuery.toLowerCase())), [documents, searchQuery]);
  const closeViewer = () => setSelectedDocument(null);

  return <><Navbar /><Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}><Container maxWidth="lg">
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
      <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => router.push("/")}><HomeIcon sx={{ mr: .5 }} fontSize="inherit" />गृहपृष्ठ / Home</Link>
      <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => router.push("/pages")}>पृष्ठहरू / Pages</Link><Typography color="text.primary">दस्तावेज / Documents</Typography>
    </Breadcrumbs>
    <Paper elevation={0} sx={{ p: 4, mb: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: 2, color: "white", textAlign: "center" }}><DescriptionIcon sx={{ fontSize: 60, mb: 2 }} /><Typography variant="h3" fontWeight={700}>महत्त्वपूर्ण दस्तावेजहरू</Typography><Typography variant="h4" fontWeight={600}>Important Documents</Typography></Paper>
    <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 2 }}><TextField fullWidth placeholder="दस्तावेज खोज्नुहोस् / Search documents..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} /></Paper>
    {loading ? <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box> : filteredDocuments.length ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3 }}>{filteredDocuments.map((document) => <Card key={document._id} elevation={2} sx={{ transition: "all .3s", "&:hover": { transform: "translateY(-4px)", boxShadow: 6 } }}><CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}><Box sx={{ width: 60, height: 60, borderRadius: 2, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "grid", placeItems: "center", color: "white", flexShrink: 0 }}>{document.fileType === "PDF" ? <PdfIcon sx={{ fontSize: 30 }} /> : <FileIcon sx={{ fontSize: 30 }} />}</Box><Box><Typography variant="h6" fontWeight={600}>{document.title}</Typography>{document.titleNepali && <Typography variant="body2" color="text.secondary">{document.titleNepali}</Typography>}<Box sx={{ display: "flex", gap: 1, mt: 1 }}><Chip label={categoryLabels[document.category] || document.category} size="small" color="primary" /><Chip label={document.fileType || "FILE"} size="small" variant="outlined" /></Box></Box></Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, borderTop: "1px solid #eee" }}><Typography variant="caption" color="text.secondary">📅 {new Date(document.createdAt).toLocaleDateString()}<br />📦 {formatSize(document.fileSize)}</Typography><Box sx={{ display: "flex", gap: 1 }}><Button variant="outlined" startIcon={<VisibilityIcon />} size="small" onClick={() => setSelectedDocument(document)}>हेर्नुहोस्</Button><Button component="a" href={document.fileUrl} target="_blank" rel="noreferrer" variant="contained" startIcon={<DownloadIcon />} size="small">डाउनलोड</Button></Box></Box>
    </CardContent></Card>)}</Box> : <Paper elevation={2} sx={{ p: 6, textAlign: "center", borderRadius: 2 }}><SearchIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} /><Typography variant="h6" color="text.secondary">{documents.length ? "No documents found matching your search" : "No documents have been published yet."}</Typography></Paper>}
  </Container></Box><Dialog open={Boolean(selectedDocument)} onClose={closeViewer} maxWidth="lg" fullWidth PaperProps={{ sx: { height: { xs: "90vh", md: "85vh" } } }}><DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>{selectedDocument?.titleNepali || selectedDocument?.title}<IconButton aria-label="Close PDF viewer" onClick={closeViewer}><CloseIcon /></IconButton></DialogTitle><DialogContent dividers sx={{ p: 0, bgcolor: "#f5f5f5" }}>{selectedDocument && <iframe src={`${selectedDocument.fileUrl}#toolbar=1`} title={selectedDocument.title} width="100%" height="100%" style={{ border: 0, display: "block" }} />}</DialogContent><DialogActions><Button onClick={closeViewer}>बन्द गर्नुहोस्</Button>{selectedDocument && <Button component="a" href={selectedDocument.fileUrl} target="_blank" rel="noreferrer" variant="contained" startIcon={<DownloadIcon />}>डाउनलोड</Button>}</DialogActions></Dialog><Footer /></>;
}
