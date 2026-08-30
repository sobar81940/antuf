"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AutoFixHigh } from "@mui/icons-material";

import ImageUpload from "@/utility/ImageUpload";
import { useAppDispatch } from "@/app/hooks";
import { createSlider } from "@/slice/sliderSlice";
import { runAi } from "@/components/ai/ai";
import {
  textFieldStyles,
  switchStyles,
  aiButtonStyles,
} from "@/components/dashboard/admin/slider/create/sliderFormStyles";

const SliderCreateModal = ({ open, onClose, onCreated }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    short_description: "",
    button_link: "",
    status: true,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset the form every time the dialog is opened.
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        sub_title: "",
        short_description: "",
        button_link: "",
        status: true,
      });
      setImagePreview("");
      setImageFile(null);
      setLocalError("");
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({ ...prev, status: e.target.checked }));
  };

  const generateAIContent = async (field) => {
    setIsGenerating(true);
    setLocalError("");

    try {
      let prompt = "";
      if (field === "title") {
        prompt = `Generate an attractive slider title about ${formData.short_description || "our organization"} with these requirements:
      - Maximum 6-8 words
      - Attention-grabbing but not clickbaity
      - Include power words (Amazing, Exclusive, Limited, etc.)
      - Title case formatting

      Return ONLY the title, no additional text.`;
      } else if (field === "sub_title") {
        prompt = `Create a compelling slider subtitle about ${formData.title || "our promotion"} with:
      - Maximum 10-12 words
      - Supporting message for the main title
      - Include a benefit or value proposition
      - Sentence case formatting
      - Should work with "${formData.title}"

      Return ONLY the subtitle.`;
      } else if (field === "short_description") {
        prompt = `Write a short slider description (1 sentence, 15-20 words max) about ${formData.title || "our offer"} that:
      - Highlights key benefits
      - Creates urgency if applicable
      - Simple and easy to understand
      - Should complement "${formData.title}" and "${formData.sub_title}"

      Return ONLY the description.`;
      }

      const aiResponse = await runAi(prompt);
      setFormData((prev) => ({ ...prev, [field]: aiResponse }));
    } catch (error) {
      console.error("AI generation error:", error);
      setLocalError(
        `Failed to generate ${field}. ${(error as Error)?.message || "Please try again."}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
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
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data?.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!imageFile) {
      setLocalError("Please upload a slider image");
      return;
    }

    setSubmitting(true);
    try {
      const imageUrl = await uploadImageToCloudinary(imageFile);
      const sliderData = { ...formData, image: imageUrl };
      await dispatch(createSlider(sliderData)).unwrap();
      if (onCreated) onCreated();
    } catch (error) {
      setLocalError(error?.message || "Failed to create slider");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!submitting && !isGenerating) onClose();
      }}
      fullScreen={isSmallScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: isSmallScreen ? 0 : 3 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 2.5,
          pb: 1.5,
          fontWeight: 800,
          color: "#182230",
        }}
      >
        Add New Slider
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        {localError && (
          <Alert severity="error" sx={{ mb: 3, width: "100%", fontSize: "0.875rem" }}>
            {localError}
          </Alert>
        )}

        <form id="slider-create-form" onSubmit={handleSubmit}>
          <ImageUpload
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setImageFile={setImageFile}
          />

          <Box sx={{ position: "relative", mb: 3 }}>
            <TextField
              fullWidth
              label="Title*"
              name="title"
              required
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              size={isSmallScreen ? "small" : "medium"}
              sx={textFieldStyles}
            />
            <Tooltip title="Generated with AI">
              <IconButton
                onClick={() => generateAIContent("title")}
                disabled={isGenerating}
                sx={aiButtonStyles}
              >
                {isGenerating ? <CircularProgress size={24} /> : <AutoFixHigh sx={{ color: "red" }} />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ position: "relative", mb: 3 }}>
            <TextField
              fullWidth
              label="Sub Title*"
              name="sub_title"
              required
              variant="outlined"
              value={formData.sub_title}
              onChange={handleChange}
              size={isSmallScreen ? "small" : "medium"}
              sx={textFieldStyles}
            />
            <Tooltip title="Generated with AI">
              <IconButton
                onClick={() => generateAIContent("sub_title")}
                disabled={isGenerating}
                sx={aiButtonStyles}
              >
                {isGenerating ? <CircularProgress size={24} /> : <AutoFixHigh sx={{ color: "red" }} />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ position: "relative", mb: 3 }}>
            <TextField
              fullWidth
              label="Short Description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              multiline
              rows={3}
              variant="outlined"
              sx={textFieldStyles}
            />
            <Tooltip title="Generated with AI">
              <IconButton
                onClick={() => generateAIContent("short_description")}
                disabled={isGenerating}
                sx={aiButtonStyles}
              >
                {isGenerating ? <CircularProgress size={24} /> : <AutoFixHigh sx={{ color: "red" }} />}
              </IconButton>
            </Tooltip>
          </Box>

          <TextField
            fullWidth
            label="Button Link*"
            name="button_link"
            value={formData.button_link}
            onChange={handleChange}
            required
            variant="outlined"
            size={isSmallScreen ? "small" : "medium"}
            sx={textFieldStyles}
            placeholder="https://example.com"
          />

          <FormControlLabel
            control={
              <Switch
                name="status"
                checked={formData.status}
                onChange={handleStatusChange}
                sx={switchStyles}
              />
            }
            label="Active Slider"
            sx={{ mb: 1 }}
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={submitting || isGenerating}
          sx={{ color: "#667085", textTransform: "none", fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="slider-create-form"
          variant="contained"
          disabled={submitting || isGenerating}
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{
            background: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)",
            fontWeight: 700,
            textTransform: "none",
            px: 3,
            "&:hover": { background: "linear-gradient(135deg, #e60000 0%, #b30000 100%)" },
          }}
        >
          {submitting ? "Creating..." : "Create Slider"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SliderCreateModal;