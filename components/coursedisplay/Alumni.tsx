"use client";

import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AlumniCompanies = () => {
  // Settings for the slick carousel
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  // Logos to display
  const companyLogos = [
    { src: "https://via.placeholder.com/150x80?text=Cisco", alt: "Cisco" },
    { src: "https://via.placeholder.com/150x80?text=TCS", alt: "TCS" },
    {
      src: "https://via.placeholder.com/150x80?text=Cognizant",
      alt: "Cognizant",
    },
    { src: "https://via.placeholder.com/150x80?text=Dell", alt: "Dell" },
    {
      src: "https://via.placeholder.com/150x80?text=Goldman+Sachs",
      alt: "Goldman Sachs",
    },
    { src: "https://via.placeholder.com/150x80?text=HCL", alt: "HCL" },
    { src: "https://via.placeholder.com/150x80?text=HP", alt: "HP" },
    { src: "https://via.placeholder.com/150x80?text=Oracle", alt: "Oracle" },
    { src: "https://via.placeholder.com/150x80?text=Infosys", alt: "Infosys" },
  ];

  return (
    <Box
      sx={{
        bgcolor: "black",
        py: 4,
        px: { xs: 2, md: 8 },
        textAlign: "center",
        color: "#fff",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          color: "#fff",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Where Our Alumni Work
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          color: "#00ff88",
          mb: 4,
          textDecoration: "underline",
          textAlign: "center",
        }}
      >
        Where Our Alumni Work
      </Typography>

      <Slider
        {...settings}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {companyLogos.map((logo, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              px: 1, // Reduce horizontal padding for smaller gaps
            }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              style={{
                maxWidth: "100%", // Increased size for the images
                height: "auto",
                transition: "transform 0.3s ease-in-out", // Add hover effect
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default AlumniCompanies;
