"use client";

import React from "react";
import { Box, Typography, Grid, useMediaQuery, useTheme } from "@mui/material";
import {
  SiCplusplus,
  SiPython,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiMongodb,
  SiReact,
  SiExpress,
  SiSpring,
  SiTensorflow,
  SiTableau,
  SiJupyter,
} from "react-icons/si";
import { DiJava } from "react-icons/di";

const Technologies = () => {
  // useTheme hook is used to access the current Material-UI theme object,
  // which includes breakpoints, colors, typography, and other style properties.
  const theme = useTheme();

  // useMediaQuery hook checks if the screen size matches the specified condition.
  // In this case, it checks if the screen width is smaller than or equal to the "sm" breakpoint (usually 600px).
  // This helps in determining if the device is a mobile device or if we should apply certain styles for mobile.
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tools = [
    { name: "C++", icon: <SiCplusplus color="#00599C" size={40} /> },
    { name: "Python", icon: <SiPython color="#306998" size={40} /> },
    { name: "HTML", icon: <SiHtml5 color="#E34F26" size={40} /> },
    { name: "CSS", icon: <SiCss3 color="#1572B6" size={40} /> },
    { name: "JavaScript", icon: <SiJavascript color="#F7DF1E" size={40} /> },
    { name: "Java", icon: <DiJava color="#5382A1" size={40} /> },
    { name: "Mongo", icon: <SiMongodb color="#47A248" size={40} /> },
    { name: "React", icon: <SiReact color="#61DAFB" size={40} /> },
    { name: "Express", icon: <SiExpress color="#FFFFFF" size={40} /> },
    { name: "Spring", icon: <SiSpring color="#6DB33F" size={40} /> },
    { name: "TensorFlow", icon: <SiTensorflow color="#FF6F00" size={40} /> },
    { name: "Tableau", icon: <SiTableau color="#E97627" size={40} /> },
    { name: "Jupyter", icon: <SiJupyter color="#F37626" size={40} /> },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        padding: "40px 20px",
        borderRadius: "8px",
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          color: "#FFFFFF",
          marginBottom: "10px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Seamless Integration With Great Tools & Technologies
      </Typography>
      <Box
        sx={{
          width: "100px",
          height: "3px",
          backgroundColor: "#4CAF50",
          margin: "0 auto 30px",
        }}
      />
      {/* Tech Icons */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{
          rowGap: "25px",
          columnGap: isMobile ? "10px" : "20px",
        }}
      >
        {tools.map((tool, index) => (
          <Grid
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
              backgroundColor: "#1E1E1E",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#2A2A2A",
              },
              height: "100px",
              width: "100px",
            }}
            size={{
              xs: 4,
              sm: 3,
              md: 2,
              lg: 1.5
            }}>
            {tool.icon}
            <Typography
              variant="body2"
              sx={{
                color: "#FFFFFF",
                marginTop: "10px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {tool.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Technologies;
