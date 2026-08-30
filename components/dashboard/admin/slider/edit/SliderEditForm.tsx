"use client";
import { useState } from "react";

import {
  Box,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ImageUpload from "./ImageUpload";

import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

const SliderForm = ({ initialValues, onSubmit, onCancel, loading }) => {
  const theme = useTheme();
  const [error, setError] = useState("");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();

  const [formData, setFormData] = useState(
    initialValues || {
      image: "",
      offer: "",
      title: "",
      sub_title: "",
      short_description: "",
      button_link: "",
      status: true,
    }
  );

  const [imagePreview, setImagePreview] = useState(initialValues?.image || "");

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  const handleImageChange = (file) => {
    if (!file) return;

    setImageFile(file);

    if (file instanceof File || file instanceof Blob) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setImagePreview(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title || !formData.sub_title || !formData.button_link) {
      setError("Please fill  in all required fields");

      return;
    }

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const formData = new FormData();

        formData.append("file", imageFile);

        formData.append("upload_preset", "ml_default");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to  upload image");
        }

        const data = await response.json();

        imageUrl = data.secure_url;
      }

      const sliderData = {
        ...formData,
        image: imageUrl,
      };

      await onSubmit(sliderData);
    } catch (error) {
      setError(error.message || "Faile  to save slider");

      toast.error("Failed to save slider");
    }
  };

  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
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

      {/* <TextField
        fullWidth
        label="Offer Text"
        name="offer"
        value={formData.offer}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      /> */}

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

      <TextField
        fullWidth
        required
        label="Sub Title"
        name="sub_title"
        value={formData.sub_title}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        label="Short Description"
        name="short_description"
        margin="normal"
        value={formData.short_description}
        onChange={handleChange}
        multiline
        rows={3}
        size={isSmallScreen ? "small" : "medium"}
      />

      <TextField
        fullWidth
        required
        label="Button Link"
        name="button_link"
        value={formData.button_link}
        onChange={handleChange}
        margin="normal"
        size={isSmallScreen ? "small" : "medium"}
      />

      <FormControlLabel
        control={
          <Switch
            checked={formData.status}
            onChange={handleStatusChange}
            sx={{
              mb: 3,
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#ff0000",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.08)",
                },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#ff0000",
              },
            }}
          />
        }
        label="Active Slider"
        sx={{ my: 2 }}
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
          {loading ? "Saving..." : "Save Slider"}
        </Button>
      </Box>
    </Box>
  );
};

export default SliderForm;