"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

let html2pdf = null;

const loadHtml2Pdf = async () => {
  if (!html2pdf) {
    const module = await import("html2pdf.js");
    html2pdf = module.default;
  }
  return html2pdf;
};

const AdminCardPrintViewer = ({ open, onClose, order, userDetails }) => {
  const cardRef = useRef(null);
  const imageInputRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(userDetails?.image || "");
  const [updatingImage, setUpdatingImage] = useState(false);
  const [currentUserDetails, setCurrentUserDetails] = useState(userDetails);

  useEffect(() => {
    setCurrentUserDetails(userDetails);
    // Only set image URL if it's a valid image, not a placeholder
    const validImage = userDetails?.image && userDetails.image !== "https://placehold.co/600x400" ? userDetails.image : "";
    setImageUrl(validImage);
    console.log("Card viewer updated with user details:", { userDetails, imageUrl: validImage });
  }, [userDetails]);

  const handlePrint = () => {
    window.print();
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleSaveImage = async () => {
    try {
      setUpdatingImage(true);
      
      if (!imageUrl.trim()) {
        toast.error("Please enter a valid image URL");
        return;
      }

      // Validate that it's a valid image URL by trying to load it
      const img = new Image();
      img.onload = async () => {
        try {
          // Update user profile with new image
          const response = await fetch(`/api/user/profile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: order?.userId,
              image: imageUrl,
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.err || "Failed to update user image");
          }

          const data = await response.json();
          // Update current user details with the new image
          const updatedDetails = data.user ? { ...data.user } : { ...currentUserDetails, image: imageUrl };
          setCurrentUserDetails(updatedDetails);
          setImageUrl(updatedDetails.image || imageUrl);
          setEditingImage(false);
          toast.success("User image updated successfully!");
          console.log("✓ User image updated:", updatedDetails);
        } catch (error) {
          console.error("Error updating image:", error);
          toast.error(error.message || "Failed to update image");
        } finally {
          setUpdatingImage(false);
        }
      };
      
      img.onerror = () => {
        setUpdatingImage(false);
        toast.error("Invalid image URL. Please check and try again.");
      };
      
      img.src = imageUrl;
    } catch (error) {
      console.error("Error validating image:", error);
      toast.error("Failed to validate image URL");
      setUpdatingImage(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingImage(false);
    // Reset to original image URL from user details
    const validImage = currentUserDetails?.image && currentUserDetails.image !== "https://placehold.co/600x400" ? currentUserDetails.image : "";
    setImageUrl(validImage);
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const element = cardRef.current;
      if (!element) {
        alert("Card element not found");
        return;
      }

      const html2pdfLib = await loadHtml2Pdf();
      const memberNumber = order._id.slice(-6).toUpperCase();
      const options = {
        margin: 5,
        filename: `Card_${memberNumber}_${currentUserDetails?.name?.replace(/\s+/g, "_") || "User"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdfLib().set(options).from(element).save();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF: " + error.message);
    } finally {
      setDownloading(false);
    }
  };

  const memberNumber = order?._id?.slice(-6).toUpperCase() || "000000";
  const userName = currentUserDetails?.name || order?.userName || "Member";
  const userEmail = currentUserDetails?.email || order?.userEmail || "N/A";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0 }}>
        Preview Member Card
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={editingImage ? "Cancel image edit" : "Edit member image"}>
            <IconButton
              size="small"
              onClick={() => setEditingImage(!editingImage)}
              sx={{
                color: editingImage ? "#FF6B6B" : "#FFA500",
                "&:hover": { bgcolor: "rgba(255, 165, 0, 0.1)" },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Button
            onClick={handleDownloadPDF}
            disabled={downloading}
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: "#00AA00",
              "&:hover": { backgroundColor: "#008800" },
              "&:disabled": { backgroundColor: "#666" },
              fontSize: "12px",
              padding: "6px 12px",
            }}
          >
            {downloading ? "..." : "PDF"}
          </Button>
          <Button
            onClick={handlePrint}
            variant="contained"
            startIcon={<PrintIcon />}
            sx={{
              backgroundColor: "#8A12FC",
              "&:hover": { backgroundColor: "#7a0ddb" },
              fontSize: "12px",
              padding: "6px 12px",
            }}
          >
            Print
          </Button>
          <Button onClick={onClose} startIcon={<CloseIcon />} size="small">
            Close
          </Button>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 2, mt: 1 }}>
        {/* Image Edit Panel */}
        {editingImage && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "#FFF3E0", borderRadius: 1, border: "1px solid #FFB74D" }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: "bold" }}>
              Edit Member Photo
            </Typography>
            <Stack spacing={1.5}>
              <TextField
                fullWidth
                label="Image URL"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="https://example.com/image.jpg"
                size="small"
                disabled={updatingImage}
                helperText="Enter direct link to image (JPG, PNG, WebP)"
              />
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveImage}
                  disabled={updatingImage}
                  sx={{
                    backgroundColor: "#4CAF50",
                    "&:hover": { backgroundColor: "#388E3C" },
                    flex: 1,
                  }}
                >
                  {updatingImage ? <CircularProgress size={20} /> : "Save"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  disabled={updatingImage}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
              </Stack>
              <Alert severity="info">
                Provide a direct URL to the image. The image will be validated before saving.
              </Alert>
            </Stack>
          </Box>
        )}

        {/* Official Nepali Membership Card */}
        <Box
          ref={cardRef}
          sx={{
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            "@media print": {
              boxShadow: "none",
              borderRadius: 0,
            },
          }}
        >
          {/* Top Colored Header Stripe */}
          <Box
            sx={{
              height: "12px",
              background: "linear-gradient(to right, #003366 0%, #003366 33%, #CC0000 33%, #CC0000 66%, #FFC300 66%)",
              "@media print": {
                pageBreakInside: "avoid",
              },
            }}
          />

          {/* Card Body */}
          <Box sx={{ p: 3, "@media print": { pageBreakInside: "avoid" } }}>
            {/* Header Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              {/* Logo Placeholder */}
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#E0E0E0",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "#999",
                }}
              >
                ANTUF
              </Box>

              {/* Title */}
              <Box sx={{ flex: 1, ml: 2 }}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#003366",
                    lineHeight: 1.2,
                  }}
                >
                  ANTUF
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#CC0000",
                    lineHeight: 1.2,
                  }}
                >
                  सदस्यता-पत्र
                </Typography>
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "#666",
                    lineHeight: 1.2,
                  }}
                >
                  Membership Card
                </Typography>
              </Box>

              {/* Member Number */}
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "10px", color: "#666", fontWeight: 600 }}>
                  सदस्य न.
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#CC0000",
                    lineHeight: 1,
                  }}
                >
                  {memberNumber}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ height: "1px", backgroundColor: "#DDD", mb: 2 }} />

            {/* Main Content - Two Column Layout */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Left Column - Photo and Info */}
              <Box sx={{ flex: "0 0 120px" }}>
                {/* Profile Photo Placeholder */}
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "3/4",
                    backgroundColor: "#F0F0F0",
                    borderRadius: "4px",
                    border: "2px solid #003366",
                    overflow: "hidden",
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "#999",
                    position: "relative",
                  }}
                >
                  {currentUserDetails?.image && currentUserDetails.image !== "https://placehold.co/600x400" ? (
                    <img
                      src={currentUserDetails.image}
                      alt="Member"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        // If image fails to load, hide it
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  {!currentUserDetails?.image || currentUserDetails.image === "https://placehold.co/600x400" || (document.querySelector('img[alt="Member"]') as HTMLImageElement | null)?.style.display === "none" ? (
                    <svg style={{ width: "60px", height: "60px", color: "#ccc" }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  ) : null}
                </Box>

                {/* Personal Details */}
                <Box sx={{ fontSize: "9px", lineHeight: 1.6 }}>
                  <Box sx={{ mb: 0.8 }}>
                    <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                      नाम (Name)
                    </Typography>
                    <Typography sx={{ fontSize: "9px", fontWeight: 600, color: "#000" }}>
                      {userName}
                    </Typography>
                  </Box>

                  {userDetails?.fatherName && (
                    <Box sx={{ mb: 0.8 }}>
                      <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                        बुबाको नाम
                      </Typography>
                      <Typography sx={{ fontSize: "9px", color: "#000" }}>
                        {currentUserDetails?.fatherName}
                      </Typography>
                    </Box>
                  )}

                  {currentUserDetails?.dateOfBirth && (
                    <Box sx={{ mb: 0.8 }}>
                      <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                        जन्मतिथि
                      </Typography>
                      <Typography sx={{ fontSize: "9px", color: "#000" }}>
                        {new Date(currentUserDetails.dateOfBirth).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}

                  {currentUserDetails?.citizenship && (
                    <Box sx={{ mb: 0.8 }}>
                      <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                        नागरिकता न.
                      </Typography>
                      <Typography sx={{ fontSize: "9px", color: "#000" }}>
                        {currentUserDetails.citizenship}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Right Column - QR and Signature */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {/* Email and Contact */}
                <Box sx={{ mb: 1 }}>
                  {userEmail !== "N/A" && (
                    <Box sx={{ mb: 0.8 }}>
                      <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                        Email
                      </Typography>
                      <Typography sx={{ fontSize: "8px", color: "#000", wordBreak: "break-all" }}>
                        {userEmail}
                      </Typography>
                    </Box>
                  )}

                  {currentUserDetails?.phone && (
                    <Box sx={{ mb: 0.8 }}>
                      <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                        Phone
                      </Typography>
                      <Typography sx={{ fontSize: "8px", color: "#000" }}>
                        {currentUserDetails.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* QR Code */}
                <Box sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#F0F0F0",
                      borderRadius: "4px",
                      border: "1px solid #999",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      color: "#999",
                    }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
                        userEmail
                      )}`}
                      alt="QR Code"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                </Box>

                {/* Validity and Signature Area */}
                <Box sx={{ fontSize: "8px" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Box>
                      <Typography sx={{ fontSize: "7px", color: "#666", fontWeight: 600 }}>
                        जारी गरिएको मिति
                      </Typography>
                      <Box sx={{ width: "60px", height: "14px", border: "1px solid #999" }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "7px", color: "#666", fontWeight: 600 }}>
                        Issued Date
                      </Typography>
                      <Box sx={{ width: "60px", height: "14px", border: "1px solid #999" }} />
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Box sx={{ textAlign: "center", flex: 1, mr: 1 }}>
                      <Box sx={{ height: "30px", border: "1px solid #999", mb: 0.5 }} />
                      <Typography sx={{ fontSize: "7px", color: "#666" }}>
                        Signature
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Box sx={{ height: "30px", border: "1px solid #999", mb: 0.5 }} />
                      <Typography sx={{ fontSize: "7px", color: "#666" }}>
                        Seal
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Bottom Bar */}
            <Box sx={{ height: "1px", backgroundColor: "#DDD", my: 2 }} />
            <Box sx={{ textAlign: "center", fontSize: "8px", color: "#666" }}>
              <Typography sx={{ fontSize: "8px" }}>
                Valid for: {order?.cardType === "premium" ? "2 Years" : "1 Year"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminCardPrintViewer;
