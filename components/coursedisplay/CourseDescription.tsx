"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactPlayer (ensures it’s client-side only)
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function CourseDescription({ course }) {
  // Get the current theme from Material-UI's theme provider.
  const theme = useTheme();

  // Use the theme to determine if the screen width is below the 'sm' breakpoint, which indicates a mobile device.
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Declare a state variable 'isMounted' to track if the component is mounted.
  const [isMounted, setIsMounted] = useState(false);

  // UseEffect hook that runs once when the component is mounted to set 'isMounted' to true.
  useEffect(() => {
    // Update 'isMounted' to true, indicating the component has mounted and is ready to render.
    setIsMounted(true);
  }, []);

  // If 'isMounted' is false, return null to avoid rendering content during Server-Side Rendering (SSR).
  if (!isMounted) return null; // Avoid rendering during SSR

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true); // This ensures the component is mounted before rendering
  // }, []);

  // if (!isMounted) return null; // Avoid rendering during SSR

  return (
    <>
      <Box
        sx={{
          minHeight: "70vh",
          bgcolor: "#212121",
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 12 },
          color: "#fff",
          
        }}
      >
        {/* Announcement Banner */}
        <Paper
          elevation={2}
          sx={{
            bgcolor: "transparent",
            border: "3px solid #fff",
            color: "#fff",
            p: 2,
            width: { xs: "80%", md: "40%" },
            textAlign: "center",
            mb: 6,
            fontSize: "14px",
            borderRadius: "8px",
            margin: "auto",
          }}
        >
          Get an Instant Discount of INR 8000 | Use Coupon: <b>UPGRADE8K</b>{" "}
          <br />
          Plus, Get BrainyBytes T-Shirt <b>@No Extra Cost!</b>
        </Paper>

        {/* Course Description Section */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          justifyContent="space-between"
          sx={{
            mt: 6,
          }}
        >
          {/* Left: Video Section */}
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", md: "50%" },
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div style={{ width: "100%", height: "500px" }}>
              <ReactPlayer
                src={course?.videoUrl || ""}
                width="100%"
                height="100%"
                controls
                light={true}
                playing={false} // Don't play immediately, display the poster initially
              />
            </div>
          </Box>

          {/* Right: Text Section */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
              maxWidth: { xs: "100%", md: "50%" },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: "28px",
                color: "#00e67a",
              }}
            >
              Course Description
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: "1.8", // Comfortable line spacing
                fontSize: isMobile ? "14px" : "16px", // Responsive font size
                fontWeight: "400", // Normal text weight
                wordWrap: "break-word", // Ensures long words don't break the layout
                color: "#EDEDED", // Softer color for readability
                textAlign: "justify", // Align text for a clean look
                marginBottom: "1rem", // Add spacing below
              }}
            >
              {course?.description}
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{
                color: "#00ff88",
                display: "flex",
                alignItems: "center",
                mb: 3,
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#00ff88",
                  display: "inline-block",
                  marginRight: "8px",
                }}
              ></span>

              {course.level}
            </Typography>

            {/* Register Button */}
            <Button
              variant="contained"
              sx={{
                bgcolor: "#00ff88",
                color: "#000",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#00e67a" },
              }}
            >
              Login To Register
            </Button>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
