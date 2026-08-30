"use client";

import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const AboutCourse = ({ course }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        backgroundColor: "#212121", // Dark background as in the image
        padding: isMobile ? "20px" : "40px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#ffffff",
      }}
    >
      {/* Text Section */}
      <Box
        sx={{
          flex: 1,
          marginRight: isMobile ? 0 : "20px",
          marginBottom: isMobile ? "20px" : 0,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          About The Course
        </Typography>
        <Box
          sx={{
            width: "80px",
            height: "2px",
            backgroundColor: "#32CD32", // Green underline
            marginBottom: "20px",
          }}
        />
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
          {course?.about}
        </Typography>

        <Box
          component="ul"
          sx={{
            marginTop: "20px",
            marginLeft: "20px",
            lineHeight: "1.8",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          <li>
            Starts with a solid understanding of Data Structures and Algorithms
            (DSA).
          </li>
          <li>Leads towards becoming a skilled developer.</li>
          <li>Equips with fundamental tools for the coding journey.</li>
          <li>
            Suitable for aspiring full-stack developers or those specializing in
            a particular technology stack.
          </li>
          <li>
            Perfect for students or professionals from any field aiming for a
            technological journey.
          </li>
        </Box>
      </Box>

      {/* Image Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-end",
        }}
      >
        <Box
          component="img"
          src="/images/pic2.png" // Replace with your actual image path
          alt="About the course"
          sx={{
            width: isMobile ? "100%" : "700px",
            height: isMobile ? "auto" : "400px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );
};

export default AboutCourse;
