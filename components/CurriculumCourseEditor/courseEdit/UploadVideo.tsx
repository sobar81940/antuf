"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const VideoUploader = ({ formData, setFormData }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoURL, setVideoURL] = useState("");
  const [buffer, setBuffer] = useState(10); // Buffer state to simulate buffering effect

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const maxSizeInMB = 100; // Set max file size in MB

    if (selectedFile && selectedFile.size > maxSizeInMB * 1024 * 1024) {
      alert(
        `File size exceeds ${maxSizeInMB}MB. Please upload a smaller file.`
      );
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setVideoURL("");
    setUploadProgress(0);
    setBuffer(10); // Reset buffer on new file
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("Please select a file to upload.");
      return;
    }

    const formDataToUpload = new FormData();
    formDataToUpload.append("file", file);
    formDataToUpload.append("upload_preset", "ml_default");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        formDataToUpload,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
            if (progress % 5 === 0 && buffer < 100) {
              setBuffer(buffer + 1 + Math.random() * 10); // Simulate buffering
            }
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        videoUrl: response?.data?.secure_url,
      }));
      setUploadProgress(0);
      setBuffer(100); // Set buffer to 100 once upload is successful
      console.log("Upload successful!");
    } catch (error) {
      console.log("Error uploading video:", error.response || error.message);
      console.log("Upload failed. Please try again.");
    }
  };

  const handleRemoveVideo = () => {
    setFile(null);
    setFormData((prev) => ({
      ...prev,
      videoUrl: "", // Set it to empty string, not null
    }));
    setUploadProgress(0);
    setBuffer(10); // Reset buffer when removing video
  };

  return (
    <Card
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 4,
        p: 2,
        boxShadow: 4,
        borderRadius: 2,
        bgcolor: "black",
        border: "5px solid #8A12FC",
      }}
    >
      <CardContent>
        <Button
          variant="outlined"
          color="primary"
          component="label"
          sx={{
            width: "100%",
            p: 2,
            borderRadius: 1,
            mt: 2,
            textTransform: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "5px solid #8A12FC",
            fontSize: "1rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file ? file.name : "Select Video"}
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            hidden
          />
        </Button>

        {uploadProgress > 0 && (
          <Box
            sx={{
              mt: 3,
              position: "relative",
              width: "100%",
              height: 30,
              borderRadius: 4,
              backgroundColor: "#122121",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <LinearProgress
              variant="buffer"
              value={uploadProgress}
              valueBuffer={buffer}
              sx={{
                height: "100%",
                borderRadius: 4,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#8A12FC",
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                color: "#fff",
                fontWeight: "bold",
                lineHeight: "40px",
              }}
            >
              {uploadProgress}%
            </Typography>
          </Box>
        )}

        {formData?.videoUrl && (
          <Box sx={{ mt: 3, position: "relative" }}>
            <Typography variant="subtitle1">Uploaded Video:</Typography>
            <video
              src={formData?.videoUrl || ""}
              controls
              style={{
                width: "100%",
                borderRadius: "8px",
                marginTop: "10px",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <IconButton
              aria-label="remove video"
              onClick={handleRemoveVideo}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "rgba(240, 13, 13, 0.8)",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                "&:hover": { background: "red" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          fullWidth
          variant="contained"
          // color="primary"
          onClick={handleUpload}
          disabled={!file}
          sx={{
            textTransform: "capitalize",
            px: 3,
            py: 1.5,
            mt: 2,
            borderRadius: 2,
            // border: "5px solid #8A12FC",
            backgroundColor: "#8A12FC",
          }}
        >
          Upload Video
        </Button>
      </CardActions>
    </Card>
  );
};

export default VideoUploader;
