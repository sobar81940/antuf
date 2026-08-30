"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, Stack } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { useSession } from "next-auth/react";
import VisibilityIcon from '@mui/icons-material/Visibility';

let html2pdf = null;

const loadHtml2Pdf = async () => {
  if (!html2pdf) {
    const module = await import("html2pdf.js");
    html2pdf = module.default;
  }
  return html2pdf;
};

const UserInfoPrintCard = () => {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberNumber, setMemberNumber] = useState("");
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserInfo(data);
      // Generate member number based on user ID
      setMemberNumber(data._id ? data._id.slice(-6).toUpperCase() : "000000");
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    setOpenDialog(true);
  };

  const handleClosePrint = () => {
    setOpenDialog(false);
  };

  const handlePrintPage = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const element = cardRef.current;
      if (!element) {
        console.error("Card element not found");
        return;
      }

      const html2pdfLib = await loadHtml2Pdf();
      const options = {
        margin: 5,
        filename: `ANTUF_Card_${memberNumber}_${userInfo.name.replace(/\s+/g, "_")}.pdf`,
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

  const generateQRCode = () => {
    // Simple QR code placeholder - can be integrated with qrcode.react library
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      userInfo?.email || "antuf"
    )}`;
  };

  if (!userInfo) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography>Loading user information...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={<VisibilityIcon />}
        onClick={handlePrint}
        sx={{
          backgroundColor: "#8A12FC",
          "&:hover": { backgroundColor: "#7a0ddb" },
          mb: 2,
        }}
      >
        View User Card
      </Button>

      <Dialog open={openDialog} onClose={handleClosePrint} maxWidth="sm" fullWidth>
        {/* <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0 }}>
          <Box />
          <Stack direction="row" spacing={1}>
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                backgroundColor: "#00AA00",
                "&:hover": { backgroundColor: "#008800" },
                "&:disabled": { backgroundColor: "#666" },
              }}
            >
              {downloading ? "Saving..." : "Save PDF"}
            </Button>
            <Button
              onClick={handlePrintPage}
              variant="contained"
              startIcon={<PrintIcon />}
              sx={{
                backgroundColor: "#8A12FC",
                mr: 1,
                "&:hover": { backgroundColor: "#7a0ddb" },
              }}
            >
              Print
            </Button>
            <Button onClick={handleClosePrint} startIcon={<CloseIcon />}>
              Close
            </Button>
          </Stack>
        </DialogTitle> */}
        <DialogContent sx={{ p: 0, mt: 1 }}>
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
                  {/* Profile Photo */}
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
                    }}
                  >
                    {userInfo.image ? (
                      <img
                        src={userInfo.image}
                        alt="Member"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                          if (img.parentElement) {
                            img.parentElement.innerHTML = '<svg style="width: 60px; height: 60px; color: #ccc;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                          }
                        }}
                      />
                    ) : (
                      <svg style={{ width: "60px", height: "60px", color: "#ccc" }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </Box>

                  {/* Personal Details */}
                  <Box sx={{ fontSize: "9px", lineHeight: 1.6 }}>
                    <Box sx={{ mb: 0.8 }}>
                      <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                        नाम (Name)
                      </Typography>
                      <Typography sx={{ fontSize: "9px", fontWeight: 600, color: "#000" }}>
                        {userInfo.name}
                      </Typography>
                    </Box>

                    {userInfo.fatherName && (
                      <Box sx={{ mb: 0.8 }}>
                        <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                          बुबाको नाम
                        </Typography>
                        <Typography sx={{ fontSize: "9px", color: "#000" }}>
                          {userInfo.fatherName}
                        </Typography>
                      </Box>
                    )}

                    {userInfo.motherName && (
                      <Box sx={{ mb: 0.8 }}>
                        <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                          आमाको नाम
                        </Typography>
                        <Typography sx={{ fontSize: "9px", color: "#000" }}>
                          {userInfo.motherName}
                        </Typography>
                      </Box>
                    )}

                    {userInfo.citizenshipNumber && (
                      <Box sx={{ mb: 0.8 }}>
                        <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                          ना. प्र. न.
                        </Typography>
                        <Typography sx={{ fontSize: "9px", fontWeight: 600, color: "#003366" }}>
                          {userInfo.citizenshipNumber}
                        </Typography>
                      </Box>
                    )}

                    {userInfo.district && (
                      <Box sx={{ mb: 0.8 }}>
                        <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                          जिल्ला (District)
                        </Typography>
                        <Typography sx={{ fontSize: "9px", color: "#000" }}>
                          {userInfo.district}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Right Column - QR Code and Additional Info */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* QR Code */}
                  <Box
                    sx={{
                      mb: 1.5,
                      p: 0.5,
                      backgroundColor: "#F9F9F9",
                      borderRadius: "4px",
                      border: "1px solid #DDD",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={generateQRCode()}
                      alt="QR Code"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    />
                    <Typography sx={{ fontSize: "8px", color: "#666", mt: 0.5 }}>
                      सदस्यता न.
                    </Typography>
                    <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#CC0000" }}>
                      {memberNumber}
                    </Typography>
                  </Box>

                  {/* Contact & Additional Info */}
                  <Box sx={{ fontSize: "9px", lineHeight: 1.5 }}>
                    {userInfo.phone && (
                      <Box sx={{ mb: 0.6 }}>
                        <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                          फोन न. (Phone)
                        </Typography>
                        <Typography sx={{ fontSize: "9px" }}>{userInfo.phone}</Typography>
                      </Box>
                    )}

                    {userInfo.email && (
                      <Box sx={{ mb: 0.6 }}>
                        <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                          ईमेल (Email)
                        </Typography>
                        <Typography sx={{ fontSize: "8px", wordBreak: "break-word" }}>
                          {userInfo.email}
                        </Typography>
                      </Box>
                    )}

                    {userInfo.city && (
                      <Box sx={{ mb: 0.6 }}>
                        <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                          शहर (City)
                        </Typography>
                        <Typography sx={{ fontSize: "9px" }}>{userInfo.city}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ height: "1px", backgroundColor: "#DDD", my: 1.5 }} />

              {/* Signature Section */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mt: 2, minHeight: "40px" }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ height: "25px", borderTop: "1px solid #333" }} />
                  <Typography sx={{ fontSize: "8px", color: "#666", mt: 0.3 }}>
                    हस्ताक्षर (Signature)
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "center", px: 1 }}>
                  <Typography sx={{ fontSize: "8px", color: "#666", fontWeight: 600 }}>
                    Date
                  </Typography>
                  <Typography sx={{ fontSize: "9px" }}>
                    {new Date().toLocaleDateString("en-US")}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: "right" }}>
                  <Box sx={{ height: "25px", borderTop: "1px solid #333" }} />
                  <Typography sx={{ fontSize: "8px", color: "#666", mt: 0.3 }}>
                    कार्यालयको मोहर
                  </Typography>
                </Box>
              </Box>

              {/* Footer */}
              <Box sx={{ mt: 1.5, pt: 1, borderTop: "1px solid #DDD", textAlign: "center" }}>
                <Typography sx={{ fontSize: "7px", color: "#999" }}>
                  ANTUF | Nepal | www.antuf.org
                </Typography>
              </Box>
            </Box>

            {/* Bottom Colored Footer Stripe */}
            <Box
              sx={{
                height: "8px",
                background: "linear-gradient(to right, #003366 0%, #003366 33%, #CC0000 33%, #CC0000 66%, #FFC300 66%)",
                "@media print": {
                  pageBreakInside: "avoid",
                },
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .MuiDialog-root {
            box-shadow: none;
          }
          .MuiDialog-paper {
            box-shadow: none;
            margin: 0;
          }
          .MuiDialogTitle-root,
          .MuiDialogContent-root {
            padding: 0;
          }
          .MuiButton-root {
            display: none !important;
          }
          @page {
            size: A5;
            margin: 0.5cm;
          }
        }
      `}</style>
    </>
  );
};

export default UserInfoPrintCard;
