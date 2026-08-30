"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
  Divider,
  Switch,
  CircularProgress,
  alpha,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PublicIcon from "@mui/icons-material/Public";
import DraftsIcon from "@mui/icons-material/Drafts";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "@/components/sidebar/SideBar";
import ArticleCard from "./ArticleCard";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchSubCategories } from "@/slice/subcategorySlice";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false });

// ── theme constants ──────────────────────────────────────────────────────────
const ACCENT  = "#667eea";
const ACCENT2 = "#764ba2";
const BG      = "#f8fafc";
const CARD_BG = "#ffffff";
const BORDER  = "rgba(102,126,234,0.12)";

const generateSlug = (text: string) =>
  text.trim().toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || `article-${Date.now()}`;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2, bgcolor: BG,
    "& fieldset": { borderColor: BORDER },
    "&:hover fieldset": { borderColor: alpha(ACCENT, 0.4) },
    "&.Mui-focused fieldset": { borderColor: ACCENT, borderWidth: 2 },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
};

// ── stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, bg }: any) => (
  <Box sx={{
    flex: "1 1 130px", bgcolor: CARD_BG,
    border: `1px solid ${BORDER}`, borderRadius: 3,
    px: 2.5, py: 2,
    display: "flex", alignItems: "center", gap: 1.5,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  }}>
    <Box sx={{
      width: 42, height: 42, borderRadius: 2, bgcolor: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, flexShrink: 0,
    }}>
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: "0.73rem", color: "#64748b", fontWeight: 500, mt: 0.2 }}>
        {label}
      </Typography>
    </Box>
  </Box>
);

// ── main component ────────────────────────────────────────────────────────────
// ── section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: string }) => (
  <Typography sx={{ fontSize:"0.7rem", fontWeight:800, textTransform:"uppercase",
    letterSpacing:1.2, color:ACCENT, mb:1.5 }}>
    {children}
  </Typography>
);

const Articles = () => {
  const dispatch = useAppDispatch();

  const { list: subcategories, loading: catLoading } = useAppSelector(
    (state: any) => state.subcategories || { list: [], loading: false }
  );

  // dialog / UI state
  const [open,       setOpen]       = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [preview,    setPreview]    = useState("");
  const [search,     setSearch]     = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // form fields
  const [title,      setTitle]      = useState("");
  const [subtitle,   setSubtitle]   = useState("");
  const [excerpt,    setExcerpt]    = useState("");
  const [content,    setContent]    = useState("");
  const [imageUrl,   setImageUrl]   = useState("");
  const [imageAlt,   setImageAlt]   = useState("");
  const [category,   setCategory]   = useState("");
  const [tags,       setTags]       = useState("");
  const [status,     setStatus]     = useState("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [language,   setLanguage]   = useState("ne");

  // stats
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, featured: 0 });

  useEffect(() => { dispatch(fetchSubCategories() as any); }, [dispatch]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/Article");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setStats({
            total:     data.length,
            published: data.filter((a: any) => a.status === "published").length,
            drafts:    data.filter((a: any) => a.status === "draft").length,
            featured:  data.filter((a: any) => a.isFeatured).length,
          });
        }
      } catch (_) {}
    };
    load();
  }, [refreshKey]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "ml_default");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME)}/image/upload`,
        { method: "POST", body: fd }
      );
      const d = await res.json();
      setImageUrl(d.secure_url);
      setPreview(d.secure_url);
      toast.success("Image uploaded!");
    } catch { toast.error("Image upload failed"); }
    finally { setUploading(false); }
  };

  const resetForm = () => {
    setTitle(""); setSubtitle(""); setExcerpt("");
    setImageUrl(""); setImageAlt(""); setCategory("");
    setTags(""); setStatus("draft"); setIsFeatured(false);
    setContent(""); setLanguage("ne"); setPreview("");
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!category)     { toast.error("Category is required"); return; }
    try {
      setSaving(true);
      const payload = {
        title: title.trim(), slug: generateSlug(title),
        subtitle: subtitle.trim(), excerpt: excerpt.trim(),
        featureImage: imageUrl,
        imageAlt: imageAlt.trim() || `${title.trim()} feature image`,
        content,
        category,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        status, isFeatured, language,
      };
      const res = await fetch("/api/admin/Article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");
      toast.success("Post created successfully!");
      resetForm(); setOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err: any) { toast.error(err.message || "Failed to create post"); }
    finally { setSaving(false); }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: BG }}>
      <Sidebar />

      {/* ── main content ── */}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>

        {/* ── sticky top header ── */}
        <Box sx={{
          px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2, sm: 3 }, pb: 2,
          bgcolor: CARD_BG, borderBottom: `1px solid ${BORDER}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 2,
          position: "sticky", top: 0, zIndex: 10,
          boxShadow: "0 1px 6px rgba(102,126,234,0.08)",
        }}>
          {/* breadcrumb */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 0.3 }}>
              <Box sx={{
                width: 34, height: 34, borderRadius: 2,
                background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ArticleOutlinedIcon sx={{ color: "#fff", fontSize: 18 }} />
              </Box>
              <Typography sx={{
                fontSize: { xs: "1.1rem", sm: "1.3rem" }, fontWeight: 800,
                background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Posts & Articles
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", ml: 0.5 }}>
              Dashboard / Content / Posts
            </Typography>
          </Box>

          {/* search + CTA */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <TextField
              size="small" placeholder="Search posts..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                </InputAdornment>
              )}}
              sx={{
                width: { xs: "100%", sm: 220 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5, bgcolor: BG,
                  "& fieldset": { borderColor: BORDER },
                  "&:hover fieldset": { borderColor: alpha(ACCENT, 0.35) },
                  "&.Mui-focused fieldset": { borderColor: ACCENT },
                },
              }}
            />
            <Button
              variant="contained" startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{
                background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`,
                color: "#fff", fontWeight: 700, fontSize: "0.875rem",
                px: 2.5, py: 1, borderRadius: 2.5, textTransform: "none",
                whiteSpace: "nowrap",
                boxShadow: `0 4px 14px ${alpha(ACCENT, 0.35)}`,
                "&:hover": {
                  background: `linear-gradient(135deg,#5a6fd6,${ACCENT2})`,
                  boxShadow: `0 6px 20px ${alpha(ACCENT, 0.5)}`,
                  transform: "translateY(-1px)",
                },
              }}
            >
              New Post
            </Button>
          </Box>
        </Box>

        {/* ── stats row ── */}
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: 3, pb: 1, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <StatCard icon={<ArticleOutlinedIcon fontSize="small"/>} label="Total Posts"
            value={stats.total} color={ACCENT} bg={alpha(ACCENT,0.1)} />
          <StatCard icon={<PublicIcon fontSize="small"/>} label="Published"
            value={stats.published} color="#10b981" bg="rgba(16,185,129,0.1)" />
          <StatCard icon={<DraftsIcon fontSize="small"/>} label="Drafts"
            value={stats.drafts} color="#f59e0b" bg="rgba(245,158,11,0.1)" />
          <StatCard icon={<StarBorderIcon fontSize="small"/>} label="Featured"
            value={stats.featured} color="#8b5cf6" bg="rgba(139,92,246,0.1)" />
        </Box>

        {/* ── article list ── */}
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 4, flex: 1 }}>
          <ArticleCard searchQuery={search} refreshKey={refreshKey} />
        </Box>
      </Box>


      {/* ═══════════════ CREATE POST DIALOG ═══════════════ */}
      <Dialog open={open} onClose={() => { setOpen(false); resetForm(); }}
        maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: CARD_BG, overflow: "hidden" }}}>
        {/* header */}
        <Box sx={{ px:3, py:2.5, background:`linear-gradient(135deg,${ACCENT},${ACCENT2})`,
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
            <ArticleOutlinedIcon sx={{ color:"#fff", fontSize:22 }} />
            <Typography sx={{ color:"#fff", fontWeight:800, fontSize:"1.05rem" }}>Create New Post</Typography>
          </Box>
          <IconButton onClick={() => { setOpen(false); resetForm(); }}
            sx={{ color:"rgba(255,255,255,0.8)", "&:hover":{ bgcolor:"rgba(255,255,255,0.15)" }}}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p:0, overflowY:"auto" }}>
          <Grid container>
            {/* left: details */}
            <Grid size={{ xs:12, md:7 }} sx={{ p:{ xs:2.5, sm:3 }, borderRight:{ md:`1px solid ${BORDER}` } }}>
              <SectionLabel>Post Details</SectionLabel>
              <Box sx={{ display:"flex", flexDirection:"column", gap:2 }}>
                <TextField autoFocus fullWidth label="Post Title *" value={title} onChange={(e)=>setTitle(e.target.value)} sx={fieldSx} />
                <TextField fullWidth label="Subtitle" value={subtitle} onChange={(e)=>setSubtitle(e.target.value)} sx={fieldSx} />
                <TextField fullWidth multiline minRows={3} label="Excerpt" value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} sx={fieldSx} />

                {/* ── Main Content Editor ── */}
                <Box>
                  <Typography sx={{
                    fontSize: "0.82rem", fontWeight: 700, color: "#475569", mb: 1,
                  }}>
                    Main Content
                  </Typography>
                  <TiptapEditor value={content} onChange={setContent} />
                </Box>

                <TextField fullWidth label="Tags" placeholder="comma, separated" value={tags}
                  onChange={(e)=>setTags(e.target.value)} helperText="Separate with commas" sx={fieldSx} />
              </Box>
              <Divider sx={{ my:2.5, borderColor:BORDER }} />
              <SectionLabel>Feature Image</SectionLabel>
              <Box sx={{ border:`2px dashed ${BORDER}`, borderRadius:3, p:2,
                display:"flex", alignItems:"center", gap:2, bgcolor:BG, flexWrap:"wrap" }}>
                {preview
                  ? <Box component="img" src={preview} alt="preview"
                      sx={{ width:80, height:60, objectFit:"cover", borderRadius:2, flexShrink:0 }} />
                  : <Box sx={{ width:80, height:60, borderRadius:2, bgcolor:alpha(ACCENT,0.08),
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <ImageIcon sx={{ color:ACCENT, fontSize:28 }} />
                    </Box>
                }
                <Box sx={{ flex:1, minWidth:120 }}>
                  <Typography sx={{ fontSize:"0.8rem", color:"#475569", mb:0.8 }}>
                    {preview ? "Uploaded ✓" : "Upload a cover image"}
                  </Typography>
                  <Button component="label" size="small" variant="outlined" disabled={uploading}
                    sx={{ borderColor:ACCENT, color:ACCENT, borderRadius:2, textTransform:"none",
                      fontSize:"0.78rem", "&:hover":{ bgcolor:alpha(ACCENT,0.06) }}}>
                    {uploading ? <CircularProgress size={14} sx={{ color:ACCENT }} /> : "Choose Image"}
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  </Button>
                </Box>
                {preview && <Button size="small" onClick={()=>{setPreview("");setImageUrl("");}}
                  sx={{ color:"#ef4444", fontSize:"0.75rem", textTransform:"none", p:0.5 }}>Remove</Button>}
              </Box>
              {preview && <TextField fullWidth size="small" label="Image Alt Text" value={imageAlt}
                onChange={(e)=>setImageAlt(e.target.value)} sx={{ mt:1.5, ...fieldSx }} />}
            </Grid>


            {/* right: settings */}
            <Grid size={{ xs:12, md:5 }} sx={{ p:{ xs:2.5, sm:3 }, bgcolor:BG }}>
              <SectionLabel>Publication Settings</SectionLabel>
              <Box sx={{ display:"flex", flexDirection:"column", gap:2 }}>
                <FormControl fullWidth size="small" sx={fieldSx}>
                  <InputLabel>Category *</InputLabel>
                  <Select value={category} onChange={(e)=>setCategory(e.target.value)} label="Category *">
                    {catLoading
                      ? <MenuItem disabled><CircularProgress size={14} sx={{ mr:1 }} />Loading...</MenuItem>
                      : subcategories?.length > 0
                        ? subcategories.map((sc:any)=><MenuItem key={sc._id} value={sc._id}>{sc.name}</MenuItem>)
                        : <MenuItem disabled>No categories available</MenuItem>}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={fieldSx}>
                  <InputLabel>Status</InputLabel>
                  <Select value={status} onChange={(e)=>setStatus(e.target.value)} label="Status">
                    {[{val:"draft",dot:"#f59e0b",lbl:"Draft"},{val:"published",dot:"#10b981",lbl:"Published"},{val:"archived",dot:"#94a3b8",lbl:"Archived"}]
                      .map(({val,dot,lbl})=>(
                        <MenuItem key={val} value={val}>
                          <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
                            <Box sx={{ width:8, height:8, borderRadius:"50%", bgcolor:dot }} />{lbl}
                          </Box>
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={fieldSx}>
                  <InputLabel>Language</InputLabel>
                  <Select value={language} onChange={(e)=>setLanguage(e.target.value)} label="Language">
                    <MenuItem value="ne">🇳🇵 Nepali</MenuItem>
                    <MenuItem value="en">🇬🇧 English</MenuItem>
                    <MenuItem value="hi">🇮🇳 Hindi</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Divider sx={{ my:2.5, borderColor:BORDER }} />
              <SectionLabel>Options</SectionLabel>
              <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                p:1.5, borderRadius:2, bgcolor:CARD_BG, border:`1px solid ${BORDER}` }}>
                <Box>
                  <Typography sx={{ fontSize:"0.875rem", fontWeight:600, color:"#334155" }}>Mark as Featured</Typography>
                  <Typography sx={{ fontSize:"0.72rem", color:"#94a3b8" }}>Appear in featured sections</Typography>
                </Box>
                <Switch checked={isFeatured} onChange={(e)=>setIsFeatured(e.target.checked)}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked":{ color:ACCENT },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":{ bgcolor:ACCENT } }} />
              </Box>
              {title && (
                <Box sx={{ mt:2, p:1.5, bgcolor:alpha(ACCENT,0.05), borderRadius:2, border:`1px solid ${alpha(ACCENT,0.15)}` }}>
                  <Typography sx={{ fontSize:"0.68rem", color:ACCENT, fontWeight:800, mb:0.4, letterSpacing:1 }}>
                    AUTO-GENERATED SLUG
                  </Typography>
                  <Typography sx={{ fontSize:"0.8rem", color:"#475569", fontFamily:"monospace", wordBreak:"break-all" }}>
                    /post/{generateSlug(title)}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px:3, py:2, gap:1.5, borderTop:`1px solid ${BORDER}`, bgcolor:BG }}>
          <Button onClick={()=>{ setOpen(false); resetForm(); }}
            sx={{ color:"#64748b", textTransform:"none", fontWeight:600, px:2.5, borderRadius:2.5,
              "&:hover":{ bgcolor:alpha("#64748b",0.08) }}}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} variant="contained"
            sx={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})`, color:"#fff",
              textTransform:"none", fontWeight:700, px:3.5, py:1, borderRadius:2.5, minWidth:130,
              boxShadow:`0 4px 14px ${alpha(ACCENT,0.4)}`,
              "&:hover":{ background:`linear-gradient(135deg,#5a6fd6,${ACCENT2})` },
              "&:disabled":{ opacity:0.6 }}}>
            {saving ? <CircularProgress size={18} color="inherit" /> : "Create Post"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Articles;
