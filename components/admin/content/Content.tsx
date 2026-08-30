"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ContentCard from "./ContentCard";

const Content = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleClose = () => setDialogOpen(false);

  const handleOpen = () => setDialogOpen(true);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a course title.");
      return;
    }

    try {
      const response = await fetch('/api/admin/Curriculum', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        alert("Course added successfully.");
        setTitle(""); // Reset title input
        handleClose(); // Close the dialog
      } else {
        console.log(response);
        alert("Failed to add the course.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          padding: 2,
          bgcolor: "#212121",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search your content"
          InputLabelProps={{
            style: { color: "#8A12FC" },
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

        <Button
          variant="contained"
          sx={{
            bgcolor: "purple",
            ":hover": { bgcolor: "darkviolet" },
            whiteSpace: "nowrap",
            padding: "12px 25px",
            fontSize: "1.1rem",
          }}
          onClick={handleOpen}
        >
          New Content
        </Button>
      </Box>

      <Dialog
        PaperProps={{
          sx: {
            bgcolor: "#212121",
            color: "#fff",
          },
        }}
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Add New Content</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Content Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputLabelProps={{
              style: { color: "#8A12FC" },
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
            onClick={handleClose}
            sx={{
              color: "#fff",
              bgcolor: "red",
              ":hover": { bgcolor: "darkred" },
              whiteSpace: "nowrap",
              padding: "12px 24px",
              fontSize: "1.1rem",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              color: "#fff",
              bgcolor: "purple",
              ":hover": { bgcolor: "darkviolet" },
              whiteSpace: "nowrap",
              padding: "12px 24px",
              fontSize: "1.1rem",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ContentCard />
    </>
  );
};

export default Content;
