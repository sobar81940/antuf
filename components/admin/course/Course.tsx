"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import CourseCard from "./CourseCard";

const CourseControl = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => {
    setDialogOpen(false);
    setTitle("");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a course title.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(
        `/api/admin/curriculumCourse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: title.trim() }),
        }
      );

      if (response.ok) {
        toast.success("Course added successfully!");
        setTitle("");
        handleClose();
        // Optional: refresh the page to show new course
        setTimeout(() => window.location.reload(), 500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add the course.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 2, md: 3 },
          padding: { xs: 2, sm: 2.5, md: 3 },
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(102, 126, 234, 0.2)",
          borderRadius: "16px",
          mx: { xs: 1, sm: 2, md: 3 },
          my: 2,
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
          }
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#667eea", marginRight: "8px" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: { xs: "100%", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              "& fieldset": { 
                borderColor: "rgba(102, 126, 234, 0.3)" 
              },
              "&:hover fieldset": { 
                borderColor: "#667eea",
                boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
              },
              "&.Mui-focused fieldset": { 
                borderColor: "#667eea",
                borderWidth: "2px",
                boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
              },
            },
            "& .MuiOutlinedInput-input": { 
              color: "#1f2937", 
              fontSize: "1rem",
              height: "2.5rem",
              padding: "12px 16px",
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: "#9ca3af",
              opacity: 0.7,
            }
          }}
        />

        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<Add />}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            whiteSpace: "nowrap",
            padding: { xs: "10px 20px", sm: "12px 28px" },
            fontSize: { xs: "0.95rem", sm: "1rem" },
            fontWeight: 600,
            borderRadius: "12px",
            border: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            },
            "&:active": {
              transform: "translateY(0px)",
            }
          }}
        >
          Add Course
        </Button>
      </Box>

      {/* Add Course Dialog */}
      <Dialog
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.95) 100%)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            border: "1px solid rgba(102, 126, 234, 0.2)",
            color: "#1f2937",
            boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
          },
        }}
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "1.5rem",
            padding: "24px",
            borderRadius: "20px 20px 0 0",
          }}
        >
          ✨ Create New Course
        </DialogTitle>

        <DialogContent
          sx={{
            padding: { xs: 2, sm: 3 },
            gap: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            autoFocus
            fullWidth
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isSaving) {
                handleSave();
              }
            }}
            disabled={isSaving}
            InputLabelProps={{
              style: { color: "#667eea", fontWeight: 600 },
            }}
            sx={{
              marginTop: 2,
              "& .MuiOutlinedInput-input": {
                color: "#1f2937",
                fontSize: "1rem",
                padding: "14px 16px",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.6)",
                transition: "all 0.3s ease",
                "& fieldset": {
                  borderColor: "rgba(102, 126, 234, 0.3)",
                  borderWidth: "1.5px",
                },
                "&:hover fieldset": {
                  borderColor: "#667eea",
                  boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#667eea",
                  borderWidth: "2px",
                  boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.15)",
                },
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            padding: "20px 24px",
            gap: 1.5,
            borderTop: "1px solid rgba(102, 126, 234, 0.1)",
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isSaving}
            sx={{
              color: "#ef4444",
              borderColor: "#ef4444",
              border: "2px solid #ef4444",
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
              },
            }}
            variant="outlined"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#ffffff",
              fontWeight: 600,
              padding: "10px 32px",
              borderRadius: "10px",
              border: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
              },
            }}
            variant="contained"
          >
            {isSaving ? (
              <>
                <CircularProgress size={20} sx={{ color: "#fff" }} />
                Saving...
              </>
            ) : (
              "Save Course"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <CourseCard />
    </>
  );
};

export default CourseControl;
