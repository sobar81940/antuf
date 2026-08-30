"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { ImageOutlined, SaveOutlined } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createActivity } from "@/slice/activitySlice";
import ImageUpload from "@/utility/ImageUpload";
import { stripHtml } from "@/utility/richText";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/admin/Articles/TiptapEditor"),
  { ssr: false }
);

const ActivityForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.activities);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "शैक्षिक / Education",
    date: "",
    status: "planned",
    details: "",
    location: "",
    organizer: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState(false);

  const categories = [
    'शैक्षिक / Education',
    'सामाजिक / Social',
    'स्वास्थ्य / Health',
    'जागरुकता / Awareness',
    'अन्य / Other'
  ];

  const statuses = [
    { value: 'planned', label: 'Planned' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      description: html,
    }));
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data?.secure_url;
    } catch (error) {
      console.log("Error uploading image", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess(false);

    if (!formData.title || !stripHtml(formData.description)) {
      setLocalError("Please fill in all required fields");
      return;
    }

    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const activityData = {
        ...formData,
        image: imageUrl,
      };

      await dispatch(createActivity(activityData)).unwrap();
      setLocalSuccess(true);

      setFormData({
        title: "",
        description: "",
        category: "शैक्षिक / Education",
        date: "",
        status: "planned",
        details: "",
        location: "",
        organizer: "",
      });
      setImagePreview("");
      setImageFile(null);
    } catch (error) {
      setLocalError(error.message || "Failed to create activity");
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "#ffffff",
        border: "1px solid #dce7e6",
        borderRadius: 2,
        boxShadow: "0 14px 40px rgba(23, 70, 70, .07)",
      }}
    >
      {(localError || error) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {localError || error}
        </Alert>
      )}

      {localSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Activity created successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.35fr) minmax(260px, .65fr)" }, gap: { xs: 3, md: 4 }, alignItems: "start" }}>
          <Box>
            <Typography sx={{ mb: 2, fontWeight: 800, color: "#183b3f" }}>Activity details</Typography>

            <TextField fullWidth label="Title" name="title" required value={formData.title} onChange={handleChange} size={isSmallScreen ? "small" : "medium"} sx={{ mb: 2 }} />

            <Typography sx={{ mb: 1, fontWeight: 700, color: "#183b3f" }}>
              Description <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
            </Typography>
            <RichTextEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              folder="antuf/activities"
            />
            <Typography variant="caption" sx={{ color: "#678084", mt: 1, display: "block" }}>
              Write the activity story. Use the toolbar to format text and the 🖼️ button to insert images.
            </Typography>
            <Typography sx={{ mt: 3, mb: 2, fontWeight: 800, color: "#183b3f" }}>Schedule and ownership</Typography>
          </Box>

          <Box sx={{ bgcolor: "#f5f9f8", border: "1px solid #dce7e6", borderRadius: 2, p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <ImageOutlined sx={{ color: "#087f73" }} />
              <Typography sx={{ fontWeight: 800, color: "#183b3f" }}>Cover image</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#678084", mb: 2 }}>Use a clear image that helps visitors understand this activity.</Typography>
            <ImageUpload
              imagePreview={imagePreview}
              onChange={(file) => {
                setImageFile(file);
                if (file instanceof File) {
                  const reader = new FileReader();
                  reader.onloadend = () => setImagePreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 1 }}>

        <TextField
          fullWidth
          label="Category"
          name="category"
          select
          value={formData.category}
          onChange={handleChange}
          size={isSmallScreen ? "small" : "medium"}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          size={isSmallScreen ? "small" : "medium"}
        />

        <TextField
          fullWidth
          label="Status"
          name="status"
          select
          value={formData.status}
          onChange={handleChange}
          size={isSmallScreen ? "small" : "medium"}
        >
          {statuses.map((s) => (
            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          size={isSmallScreen ? "small" : "medium"}
        />

        <TextField
          fullWidth
          label="Organizer"
          name="organizer"
          value={formData.organizer}
          onChange={handleChange}
          margin="normal"
          size={isSmallScreen ? "small" : "medium"}
        />

        <TextField
          fullWidth
          label="Details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          multiline
          rows={4}
          size={isSmallScreen ? "small" : "medium"}
        />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4, pt: 3, borderTop: "1px solid #e2ebea" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ px: 3, py: 1.2, color: "white", bgcolor: "#087f73", "&:hover": { bgcolor: "#05665d" } }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveOutlined />}
          >
            {loading ? "Creating..." : "Create Activity"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ActivityForm;
