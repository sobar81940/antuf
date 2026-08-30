"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import ImageUpload from "@/utility/ImageUpload";
import { stripHtml } from "@/utility/richText";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/admin/Articles/TiptapEditor"),
  { ssr: false }
);

const ActivityEditForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState("");

  const [formData, setFormData] = useState(
    initialValues || {
      title: "",
      description: "",
      category: "शैक्षिक / Education",
      date: "",
      status: "planned",
      image: "",
      details: "",
      location: "",
      organizer: "",
    }
  );

  const [imagePreview, setImagePreview] = useState(initialValues?.image || "");
  const [imageFile, setImageFile] = useState(null);

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

  const handleImageChange = (file) => {
    if (!file) return;
    setImageFile(file);

    if (file instanceof File || file instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(file as string);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !stripHtml(formData.description)) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const formDataObj = new FormData();
        formDataObj.append("file", imageFile);
        formDataObj.append("upload_preset", "ml_default");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formDataObj,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        imageUrl = data.secure_url;
      }

      const activityData = {
        ...formData,
        image: imageUrl,
      };

      await onSubmit(activityData);
    } catch (error) {
      setError(error.message || "Failed to save activity");
      toast.error("Failed to save activity");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <ImageUpload
        imagePreview={imagePreview}
        onChange={handleImageChange}
      />

      <TextField
        fullWidth
        required
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <Typography sx={{ mb: 1, fontWeight: 700, color: "#183b3f" }}>
        Description <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
      </Typography>
      <RichTextEditor
        value={formData.description}
        onChange={handleDescriptionChange}
        folder="antuf/activities"
      />
      <Typography variant="caption" sx={{ color: "#678084", mt: 1, mb: 2, display: "block" }}>
        Write the activity story. Use the toolbar to format text and the 🖼️ button to insert images.
      </Typography>

      <TextField
        fullWidth
        label="Category"
        name="category"
        select
        value={formData.category}
        onChange={handleChange}
        margin="normal"
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
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        label="Status"
        name="status"
        select
        value={formData.status}
        onChange={handleChange}
        margin="normal"
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
        margin="normal"
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
        margin="normal"
        multiline
        rows={4}
        size={isSmallScreen ? "small" : "medium"}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Saving..." : "Save Activity"}
        </Button>
      </Box>
    </Box>
  );
};

export default ActivityEditForm;
