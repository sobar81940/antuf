"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import ImageIcon from "@mui/icons-material/Image";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchSubCategories } from "@/slice/subcategorySlice";
import dynamic from "next/dynamic";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const CreateArticlePage = ({ articleId = null, initialData = null }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { list: subcategories, loading: categoriesLoading } = useAppSelector(
    (state) => state.subcategories || { list: [], loading: false }
  );

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    excerpt: "",
    content: "",
    featureImage: "",
    imageAlt: "",
    category: "",
    tags: [],
    status: "draft",
    isFeatured: false,
    difficulty: "beginner",
    language: "ne",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  });

  const [preview, setPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [seoOpen, setSeoOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Generate slug from title - handles both English and Nepali
  const generateSlug = (text) => {
    if (!text || text.trim() === '') return '';
    
    // First try to transliterate Nepali/Devanagari to Latin
    let slug = text
      .trim()
      .toLowerCase()
      // Nepali character transliteration map
      .replace(/[अ]/g, 'a')
      .replace(/[आ]/g, 'aa')
      .replace(/[इ]/g, 'i')
      .replace(/[ई]/g, 'ii')
      .replace(/[उ]/g, 'u')
      .replace(/[ऊ]/g, 'uu')
      .replace(/[ए]/g, 'e')
      .replace(/[ऐ]/g, 'ai')
      .replace(/[ओ]/g, 'o')
      .replace(/[औ]/g, 'au')
      .replace(/[क]/g, 'k')
      .replace(/[ख]/g, 'kh')
      .replace(/[ग]/g, 'g')
      .replace(/[घ]/g, 'gh')
      .replace(/[ङ]/g, 'ng')
      .replace(/[च]/g, 'ch')
      .replace(/[छ]/g, 'chh')
      .replace(/[ज]/g, 'j')
      .replace(/[झ]/g, 'jh')
      .replace(/[ञ]/g, 'ny')
      .replace(/[ट]/g, 't')
      .replace(/[ठ]/g, 'th')
      .replace(/[ड]/g, 'd')
      .replace(/[ढ]/g, 'dh')
      .replace(/[ण]/g, 'n')
      .replace(/[त]/g, 't')
      .replace(/[थ]/g, 'th')
      .replace(/[द]/g, 'd')
      .replace(/[ध]/g, 'dh')
      .replace(/[न]/g, 'n')
      .replace(/[प]/g, 'p')
      .replace(/[फ]/g, 'ph')
      .replace(/[ब]/g, 'b')
      .replace(/[भ]/g, 'bh')
      .replace(/[म]/g, 'm')
      .replace(/[य]/g, 'y')
      .replace(/[र]/g, 'r')
      .replace(/[ल]/g, 'l')
      .replace(/[व]/g, 'w')
      .replace(/[श]/g, 'sh')
      .replace(/[ष]/g, 'sh')
      .replace(/[स]/g, 's')
      .replace(/[ह]/g, 'h')
      .replace(/[्]/g, '') // Remove halant
      .replace(/[ा]/g, 'a')
      .replace(/[ि]/g, 'i')
      .replace(/[ी]/g, 'ii')
      .replace(/[ु]/g, 'u')
      .replace(/[ू]/g, 'uu')
      .replace(/[े]/g, 'e')
      .replace(/[ै]/g, 'ai')
      .replace(/[ो]/g, 'o')
      .replace(/[ौ]/g, 'au')
      .replace(/[ं]/g, 'n')
      .replace(/[ः]/g, 'h')
      // Replace spaces with hyphens
      .replace(/[\s_]+/g, '-')
      // Remove any remaining non-alphanumeric characters except hyphens
      .replace(/[^a-z0-9-]/g, '')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');
    
    // If slug is empty or too short after transliteration, create a timestamp-based slug
    if (!slug || slug.length < 3) {
      slug = 'article-' + Date.now();
    }
    
    return slug;
  };

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      console.log("CreateArticlePage received initialData:", initialData);
      
      // Extract category ID whether it's a string or object
      const categoryId = typeof initialData.category === 'object' 
        ? initialData.category?._id?.toString() || initialData.category?.toString()
        : initialData.category?.toString() || "";

      console.log("Extracted categoryId:", categoryId);

      const newFormData = {
        title: initialData.title || "",
        slug: initialData.slug || "",
        subtitle: initialData.subtitle || "",
        excerpt: initialData.excerpt || "",
        content: initialData.content || "",
        featureImage: initialData.featureImage || "",
        imageAlt: initialData.imageAlt || "",
        category: categoryId,
        tags: initialData.tags || [],
        status: initialData.status || "draft",
        isFeatured: initialData.isFeatured || false,
        difficulty: initialData.difficulty || "beginner",
        language: initialData.contentLanguage || initialData.language || "ne",
        metaTitle: initialData.metaTitle || "",
        metaDescription: initialData.metaDescription || "",
        metaKeywords: initialData.metaKeywords || [],
      };
      
      console.log("Setting formData:", newFormData);
      setFormData(newFormData);
      setPreview(initialData.featureImage || "");
    }
  }, [initialData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("upload_preset", "ml_default");

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadFormData,
          }
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error?.message || "Failed to upload image");
        }

        setFormData(prev => ({ ...prev, featureImage: uploadData.secure_url }));
        setPreview(uploadData.secure_url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSaveDraft = async () => {
    await handleSave("draft");
  };

  const handlePublish = async () => {
    await handleSave("published");
  };

  const handleSave = async (saveStatus) => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    // Validate metaTitle length
    if (formData.metaTitle && formData.metaTitle.length > 70) {
      toast.error("Meta title cannot exceed 70 characters");
      return;
    }

    // Validate metaDescription length
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      toast.error("Meta description cannot exceed 160 characters");
      return;
    }

    try {
      setIsSaving(true);

      // Auto-generate slug if not provided or if title changed
      const slug = formData.slug && formData.slug.trim() 
        ? formData.slug.trim() 
        : generateSlug(formData.title);

      // Ensure slug is not empty
      if (!slug || slug.trim() === '') {
        toast.error("Could not generate slug. Please check the title.");
        setIsSaving(false);
        return;
      }

      const dataToSubmit = {
        ...formData,
        slug,
        status: saveStatus || formData.status,
      };

      const url = articleId
        ? `/api/admin/Article/${articleId}`
        : "/api/admin/Article";
      
      const method = articleId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      // Check if response has content before trying to parse
      const text = await response.text();
      console.log("Raw response:", text);
      console.log("Response status:", response.status);
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Failed to parse response:", text);
        throw new Error(`Server error: ${text.substring(0, 200)}`);
      }

      if (!response.ok) {
        console.error("API Error Response:", data);
        console.error("Full error details:", JSON.stringify(data, null, 2));
        throw new Error(data.error || data.err || "Failed to save article");
      }

      toast.success(
        saveStatus === "published"
          ? "Article published successfully!"
          : "Draft saved successfully!"
      );

      setTimeout(() => {
        router.push("/dashboard/admin/create/post");
      }, 1500);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0a0f1e 0%, #0f172a 50%, #1e293b 100%)",
        color: "#e2e8f0",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "2px solid rgba(59, 130, 246, 0.2)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          sx={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: { xs: "16px 20px", sm: "20px 40px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => router.back()}
              sx={{
                color: "#60a5fa",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                "&:hover": {
                  background: "rgba(59, 130, 246, 0.2)",
                  transform: "translateX(-4px)",
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                {articleId ? "Edit Article" : "Create Article"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#94a3b8", fontSize: "0.9rem" }}
              >
                {formData.status === "draft" ? "Draft" : formData.status}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              sx={{
                color: "#94a3b8",
                borderColor: "rgba(148, 163, 184, 0.3)",
                display: { xs: "none", sm: "flex" },
                "&:hover": {
                  borderColor: "#60a5fa",
                  color: "#60a5fa",
                  background: "rgba(59, 130, 246, 0.1)",
                }
              }}
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSaveDraft}
              disabled={isSaving}
              sx={{
                color: "#fbbf24",
                borderColor: "rgba(251, 191, 36, 0.4)",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "#fbbf24",
                  background: "rgba(251, 191, 36, 0.1)",
                }
              }}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              startIcon={<PublishIcon />}
              onClick={handlePublish}
              disabled={isSaving}
              sx={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                fontWeight: 800,
                boxShadow: "0 4px 16px rgba(139, 92, 246, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(139, 92, 246, 0.5)",
                }
              }}
            >
              {isSaving ? <CircularProgress size={20} /> : "Publish"}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: { xs: "24px 16px", sm: "40px 40px" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" },
          gap: 4,
        }}
      >
        {/* Left Column - Editor */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Title */}
          <TextField
            fullWidth
            placeholder="Article title..."
            value={formData.title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setFormData(prev => ({ 
                ...prev, 
                title: newTitle,
                // Auto-generate slug only if slug is empty or matches previous title's slug
                slug: !prev.slug || prev.slug === generateSlug(prev.title) 
                  ? generateSlug(newTitle) 
                  : prev.slug
              }));
            }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: { xs: "2rem", sm: "3rem" },
                fontWeight: 800,
                color: "#e2e8f0",
                padding: "16px 0",
              }
            }}
            sx={{
              "& .MuiInputBase-input::placeholder": {
                color: "#475569",
                opacity: 1,
              }
            }}
          />

          {/* Slug Field */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
              /post/
            </Typography>
            <TextField
              fullWidth
              placeholder="article-slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "0.95rem",
                  color: "#60a5fa",
                  padding: "4px 0",
                  fontFamily: "monospace",
                }
              }}
              sx={{
                "& .MuiInputBase-input::placeholder": {
                  color: "#475569",
                  opacity: 1,
                }
              }}
            />
          </Box>

          {/* Subtitle/Excerpt */}
          <TextField
            fullWidth
            placeholder="Write a short description or excerpt..."
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "1.1rem",
                color: "#94a3b8",
                padding: "8px 0",
              }
            }}
            sx={{
              "& .MuiInputBase-input::placeholder": {
                color: "#475569",
                opacity: 1,
              }
            }}
          />

          {/* Content Editor */}
          <Box
            sx={{
              mt: 2,
              "& .w-md-editor": {
                backgroundColor: "transparent !important",
                color: "#e2e8f0 !important",
              },
              "& .w-md-editor-toolbar": {
                background: "rgba(15, 23, 42, 0.6)",
                borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
              },
              "& .w-md-editor-toolbar button": {
                color: "#cbd5e1 !important",
              },
              "& .w-md-editor-text-pre, & .w-md-editor-text-input": {
                color: "#e2e8f0 !important",
              },
            }}
          >
            <Typography
              sx={{
                color: "#94a3b8",
                fontWeight: 700,
                fontSize: "0.9rem",
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Content
            </Typography>
            <MDEditor
              value={formData.content}
              onChange={(val) => setFormData(prev => ({ ...prev, content: val || "" }))}
              height={600}
              preview="edit"
              data-color-mode="dark"
            />
          </Box>
        </Box>

        {/* Right Column - Sidebar */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Feature Image */}
          <Box
            sx={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <Typography
              sx={{
                color: "#e2e8f0",
                fontWeight: 700,
                fontSize: "1rem",
                mb: 2,
              }}
            >
              Feature Image
            </Typography>
            
            {preview ? (
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  onClick={() => {
                    setPreview("");
                    setFormData(prev => ({ ...prev, featureImage: "" }));
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    "&:hover": {
                      background: "rgba(239, 68, 68, 0.8)",
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Button
                component="label"
                fullWidth
                variant="outlined"
                startIcon={isUploading ? <CircularProgress size={20} /> : <ImageIcon />}
                disabled={isUploading}
                sx={{
                  height: "200px",
                  borderStyle: "dashed",
                  borderWidth: "2px",
                  borderColor: "rgba(59, 130, 246, 0.4)",
                  color: "#60a5fa",
                  borderRadius: "12px",
                  "&:hover": {
                    borderColor: "#60a5fa",
                    background: "rgba(59, 130, 246, 0.05)",
                  }
                }}
              >
                {isUploading ? "Uploading..." : "Click to upload image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </Button>
            )}
          </Box>

          {/* Settings */}
          <Box
            sx={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
              borderRadius: "20px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              overflow: "hidden",
            }}
          >
            <Box
              onClick={() => setSettingsOpen(!settingsOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(59, 130, 246, 0.05)",
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <SettingsIcon sx={{ color: "#60a5fa" }} />
                <Typography sx={{ fontWeight: 700, color: "#e2e8f0" }}>
                  Settings
                </Typography>
              </Box>
              {settingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            <Collapse in={settingsOpen}>
              <Box sx={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 2.5 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: "#94a3b8" }}>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    label="Status"
                    sx={{
                      color: "#e2e8f0",
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.6)",
                      "& fieldset": {
                        borderColor: "rgba(148, 163, 184, 0.2)",
                      },
                    }}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: "#94a3b8" }}>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    label="Category"
                    sx={{
                      color: "#e2e8f0",
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.6)",
                      "& fieldset": {
                        borderColor: "rgba(148, 163, 184, 0.2)",
                      },
                    }}
                  >
                    {subcategories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "rgba(59, 130, 246, 0.1)",
                    borderRadius: "10px",
                  }}
                >
                  <Typography sx={{ fontSize: "0.95rem", color: "#cbd5e1" }}>
                    Featured Article
                  </Typography>
                  <Box
                    component="label"
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      width: "48px",
                      height: "26px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: formData.isFeatured ? "#8b5cf6" : "rgba(148, 163, 184, 0.3)",
                        borderRadius: "26px",
                        transition: "all 0.3s",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          height: "20px",
                          width: "20px",
                          left: formData.isFeatured ? "25px" : "3px",
                          bottom: "3px",
                          backgroundColor: "#ffffff",
                          borderRadius: "50%",
                          transition: "all 0.3s",
                        }
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "0.9rem", color: "#94a3b8", mb: 1 }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
                    {formData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        sx={{
                          background: "rgba(139, 92, 246, 0.2)",
                          color: "#c4b5fd",
                          borderRadius: "8px",
                          "& .MuiChip-deleteIcon": {
                            color: "#c4b5fd",
                          }
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          background: "rgba(15, 23, 42, 0.6)",
                          color: "#e2e8f0",
                          "& fieldset": {
                            borderColor: "rgba(148, 163, 184, 0.2)",
                          },
                        }
                      }}
                    />
                    <IconButton
                      onClick={handleAddTag}
                      sx={{
                        background: "rgba(139, 92, 246, 0.2)",
                        color: "#a78bfa",
                        "&:hover": {
                          background: "rgba(139, 92, 246, 0.3)",
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* SEO Settings */}
          <Box
            sx={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
              borderRadius: "20px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              overflow: "hidden",
            }}
          >
            <Box
              onClick={() => setSeoOpen(!seoOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(59, 130, 246, 0.05)",
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography sx={{ fontSize: "1.2rem" }}>🔍</Typography>
                <Typography sx={{ fontWeight: 700, color: "#e2e8f0" }}>
                  SEO Settings
                </Typography>
              </Box>
              {seoOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            <Collapse in={seoOpen}>
              <Box sx={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Meta Title"
                  placeholder="SEO-friendly title (max 70 chars)"
                  value={formData.metaTitle}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 70) {
                      setFormData(prev => ({ ...prev, metaTitle: value }));
                    }
                  }}
                  helperText={`${formData.metaTitle.length}/70 characters`}
                  error={formData.metaTitle.length > 70}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.6)",
                      color: "#e2e8f0",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#94a3b8",
                    },
                    "& .MuiFormHelperText-root": {
                      color: formData.metaTitle.length > 70 ? "#ef4444" : "#64748b",
                    }
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label="Meta Description"
                  placeholder="SEO description (max 160 chars)"
                  value={formData.metaDescription}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 160) {
                      setFormData(prev => ({ ...prev, metaDescription: value }));
                    }
                  }}
                  helperText={`${formData.metaDescription.length}/160 characters`}
                  error={formData.metaDescription.length > 160}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.6)",
                      color: "#e2e8f0",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#94a3b8",
                    },
                    "& .MuiFormHelperText-root": {
                      color: formData.metaDescription.length > 160 ? "#ef4444" : "#64748b",
                    }
                  }}
                />
              </Box>
            </Collapse>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateArticlePage;
