"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SourceIcon from "@mui/icons-material/Source";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
  Icon,
} from "@mui/material";

import { useRouter } from "next/navigation";

const ContentCard = () => {
  const router = useRouter();
  const [content, setContent] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/Curriculum');
      const data = await response.json();
      console.log("CONTENT--------", data);
      setContent(data);
    } catch (error) {
      toast.error("Error fetching content!");
      console.log("ERROR-----------", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpen = (content) => {
    setCurrentContent(content);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.API}/admin/Curriculum/${currentContent?._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setContent((prev) =>
          prev.filter((content) => content?._id !== currentContent?._id)
        );
        toast.success("Content deleted successfully!");
        setDeleteOpen(false);
      } else {
        toast.error("Failed to delete content");
      }
    } catch (error) {
      toast.error("Error deleting content!");
      console.log("Error in Deleting DELETE PATH------", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditOpen = (content) => {
    setCurrentContent(content);
    setNewTitle(content?.title);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditSave = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.API}/admin/Curriculum/${currentContent?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle }),
        }
      );

      if (response.ok) {
        const updatedContent = await response.json();
        setContent((prev) =>
          prev.map((content) =>
            content?._id === updatedContent?._id ? updatedContent : content
          )
        );
        toast.success("Content updated successfully");
        setEditOpen(false);
      } else {
        toast.error("Failed to update content!");
      }
    } catch (error) {
      toast.error("Error updating content");
      console.log("Error updating Handle Edit Save", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchContent}
          disabled={loading}
          sx={{
            bgcolor: "#8A12FC",
            ":hover": {
              bgcolor: "#6A0FBA",
              color: "#fff",
            },
          }}
        >
          {loading ? <CircularProgress color="inherit" size={20} /> : "Reload"}
        </Button>
      </Box>

      {content.map((content, index) => (
        <Box
          key={content?._id}
          sx={{
            padding: 2,
            mt: 1,
            paddingLeft: 2,
            mx: 5,
            marginLeft: 2,
            justifyContent: "center",
            bgcolor: "#212121",
            boxShadow: "0px 1px 4px rgba(195, 14, 14, 0.2)",
            transition: "all 0.3 ease",
            "&:hover": {
              boxShadow: "0px 1px 4px rgba(0,0,0,0.3)",
            },
            width: "100%",
          }}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    bgcolor: "#E0E0E0",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.8rem",
                      color: "black",
                    }}
                  >
                    Image
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#FFF",
                  }}
                >
                  {content?.title}
                </Typography>
              </Box>
            </Grid>

            <Grid sx={{ display: "flex", justifyContent: "center" }} size={8}>
              {hoverIndex === index ? (
                <Box sx={{ display: "flex", gap: 1,  alignItems:"flex-end" }}>
                  <Tooltip title="Source">
                    <IconButton
                      size="large"
                      sx={{ color: "green" }}
                      onClick={() =>
                        router.push(
                          `/dashboard/admin/create/content/curriculumeditorcontent?search=${content._id}`
                        )
                      }
                    >
                      <SourceIcon sx={{ fontSize: "2.5rem" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      sx={{ color: "purple" }}
                      onClick={() => handleEditOpen(content)}
                    >
                      <EditIcon sx={{ fontSize: "2.5rem" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      sx={{ color: "red" }}
                      onClick={() => handleDeleteOpen(content)}
                    >
                      <DeleteForeverIcon sx={{ fontSize: "2.5rem" }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Typography
                  variant="body1"
                  color="#fff"
                  sx={{ fontWeight: "bold" }}
                >
                  Finish your Topic
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      ))}

      <Dialog
        PaperProps={{
          sx: {
            bgcolor: "#212121",
            color: "white",
          },
        }}
        open={editOpen}
        onClose={handleEditClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Edit Course</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Content Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "#8A12FC",
              },
            }}
            sx={{
              input: { color: "white", fontSize: "1.2rem", height: "2rem" },

              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleEditClose}
            sx={{
              color: "#fff",
              bgcolor: "red",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleEditSave}
            sx={{
              color: "#fff",
              bgcolor: "purple",
            }}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        PaperProps={{
          sx: {
            bgcolor: "#212121",
            color: "white",
          },
        }}
        open={deleteOpen}
        onClose={handleDeleteClose}
      >
        <DialogTitle>Delete Content</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the course titled-{" "}
            {currentContent?.title}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleDeleteClose}
            sx={{
              color: "#fff",
              bgcolor: "purple",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            sx={{
              color: "#fff",
              bgcolor: "red",
            }}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContentCard;
