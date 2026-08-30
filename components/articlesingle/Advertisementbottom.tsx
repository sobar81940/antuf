import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";

const ads = [
  {
    image: "/images/ads.png", // Replace with your ad image path
    link: "/product-1",
  },

  {
    image: "/images/ads2.png",
    link: "/product-3",
  },
  {
    image: "/images/pic2.png",
    link: "/product-2",
  },
  {
    image: "/images/pic4.png",
    link: "/product-3",
  },
];

const Advertisement = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(true);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Cycle through ads every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  // Hide the ad when close button is clicked
  const handleCloseAd = (e) => {
    e.stopPropagation(); // Prevents triggering parent click event
    setShowAd(false);
  };

  // Navigate to the ad's link
  const handleAdClick = () => {
    const currentAd = ads[currentAdIndex];
    if (currentAd && currentAd.link) {
      router.push(currentAd.link);
    }
  };

  // Return null if the ad is closed
  if (!showAd) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: isMobile ? "90%" : "250px",
        height: isMobile ? "250px" : "400px",
        margin: "auto",
        marginTop: "20px",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={handleAdClick} // Make the ad clickable
    >
      {/* Ad Image */}
      <Box
        component="img"
        src={ads[currentAdIndex].image}
        alt={`Ad ${currentAdIndex + 1}`}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Close Button */}
      <IconButton
        onClick={handleCloseAd} // Stops propagation to prevent navigation
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          zIndex: 1,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Overlay Text (Optional) */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          color: "#fff",
          zIndex: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Switch to Mac. Power up.
        </Typography>
        <Typography variant="body2">
          Blazing-fast speed on the new MacBook Pro with M4.
        </Typography>
      </Box>
    </Box>
  );
};

export default Advertisement;
