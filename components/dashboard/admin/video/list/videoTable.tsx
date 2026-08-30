"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Delete, Edit, Add, Search, PlayArrow } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  clearError,
} from "@/slice/videoSlice";

// Helper function to extract YouTube ID
const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

const VideoManager = () => {
  const dispatch = useAppDispatch();
  const { list: videos, loading, error } = useAppSelector(
    (state) => state.videos
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    isActive: true,
  });

  // Fetch videos on mount
  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  const handleOpenDialog = (video = null) => {
    if (video) {
      setFormData(video);
      setEditingId(video._id);
    } else {
      setFormData({
        title: "",
        url: "",
        isActive: true,
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveVideo = () => {
    // Log form data for debugging
    console.log("Form data before validation:", formData);

    // Validation
    const titleTrimmed = formData.title ? formData.title.trim() : "";
    const urlTrimmed = formData.url ? formData.url.trim() : "";

    if (!titleTrimmed) {
      alert("Title is required and cannot be empty");
      return;
    }
    if (!urlTrimmed) {
      alert("Video URL is required and cannot be empty");
      return;
    }

    // Validate YouTube URL
    if (!urlTrimmed.includes("youtube.com") && !urlTrimmed.includes("youtu.be")) {
      alert("URL must be a valid YouTube video link");
      return;
    }

    // Prepare data to send
    const dataToSend = {
      title: titleTrimmed,
      url: urlTrimmed,
      isActive: formData.isActive !== false,
    };

    console.log("Sending video data:", dataToSend);

    if (editingId) {
      dispatch(updateVideo({ id: editingId, videoData: dataToSend }));
    } else {
      dispatch(addVideo(dataToSend));
    }

    handleCloseDialog();
    dispatch(clearError());
  };

  const handleDeleteVideo = (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      dispatch(deleteVideo(id));
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      margin: '0 auto',  // Center the container
      overflowX: 'auto',
      mt: 3,
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1,
      display: 'flex',
      flexDirection: 'column',

    }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "red" }}>
          Video Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add Video
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Videos"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading && filteredVideos.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ width: "100%", maxWidth: "100%" }}>
          <Table sx={{ minWidth: 620, tableLayout: "fixed" }}>
            <TableHead sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>Preview</TableCell>
                <TableCell sx={{ width: { xs: "30%", md: "34%" }, fontWeight: 700, color: "#fff", fontSize: "1rem" }}>Title</TableCell>
                <TableCell sx={{ width: { xs: "32%", md: "36%" }, fontWeight: 700, color: "#fff", fontSize: "1rem" }}>URL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <TableRow key={video._id} hover>
                    <TableCell sx={{ width: "120px" }}>
                      <Box
                        sx={{
                          width: "100px",
                          height: "60px",
                          background: "#f0f0f0",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          overflow: "hidden",
                          position: "relative",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => handleOpenDialog(video)}
                      >
                        {video.url && video.url.includes("youtube") ? (
                          <Box
                            component="img"
                            src={`https://img.youtube.com/vi/${extractYouTubeId(video.url)}/hqdefault.jpg`}
                            alt="Video thumbnail"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Typography sx={{ fontSize: "0.75rem", color: "gray" }}>
                            No Preview
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{video.title}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem", maxWidth: "300px" }}>
                      <Box
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={video.url}
                      >
                        {video.url}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          background: video.isActive ? "#c8e6c9" : "#ffccbc",
                          color: video.isActive ? "#2e7d32" : "#d84315",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          width: "fit-content",
                        }}
                      >
                        {video.isActive ? "Active" : "Inactive"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(video)}
                        sx={{ color: "#667eea" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteVideo(video._id)}
                        sx={{ color: "#e53935" }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                    No videos found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingId ? "Edit Video" : "Add New Video"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Video Preview */}
          {editingId && formData.url && formData.url.includes("youtube") && (
            <Box
              sx={{
                background: "#000",
                borderRadius: "8px",
                overflow: "hidden",
                aspectRatio: "16/9",
              }}
            >
              <Box
                component="iframe"
                src={`https://www.youtube.com/embed/${extractYouTubeId(formData.url)}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          )}

          {/* Thumbnail Preview for New Videos */}
          {!editingId && formData.url && formData.url.includes("youtube") && (
            <Box
              sx={{
                background: "#f0f0f0",
                borderRadius: "8px",
                overflow: "hidden",
                width: "100%",
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={`https://img.youtube.com/vi/${extractYouTubeId(formData.url)}/hqdefault.jpg`}
                alt="Video thumbnail"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </Box>
          )}

          <TextField
            fullWidth
            label="Video Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter video title..."
            helperText={`${formData.title.length}/100 characters`}
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="Video URL"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            helperText="Enter a valid YouTube video URL"
            error={formData.url && !formData.url.includes("youtube.com") && !formData.url.includes("youtu.be")}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              style={{ cursor: "pointer" }}
            />
            <Typography>Active</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveVideo}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {editingId ? "Update" : "Add"} Video
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoManager;
