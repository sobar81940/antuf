"use client";

import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = () => {
  // useTheme hook is used to access the current Material-UI theme object,
  // which includes breakpoints, colors, typography, and other style properties.
  const theme = useTheme();

  // useMediaQuery hook checks if the screen size matches the specified condition.
  // In this case, it checks if the screen width is smaller than or equal to the "sm" breakpoint (usually 600px).
  // This helps in determining if the device is a mobile device or if we should apply certain styles for mobile.
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // FAQ data
  const faqs = [
    {
      question: "Is there any contact number for course query?",
      answer:
        "Yes, you can contact us at +123-456-7890 for any course-related queries.",
    },
    {
      question:
        "I am from a non-CS background. Will this course be suitable for me?",
      answer:
        "Absolutely! This course is designed for learners from diverse backgrounds, including those without prior CS experience. We start from the basics and provide step-by-step guidance.",
    },
    {
      question: "What is the duration of the course?",
      answer:
        "The course duration is 6 months, with flexible schedules to suit your availability.",
    },
    {
      question: "Do we have doubt support in this program?",
      answer:
        "Yes, doubt support is available through live sessions, a dedicated discussion forum, and 24/7 email assistance.",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#121212", // Match background color
        //  padding: isMobile ? "20px" : "40px",
        borderRadius: "8px",
        //  maxWidth: "900px",
        margin: "auto",
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 12 },
      }}
    >
      {/* Title Section */}
      <Typography
        variant="h5"
        sx={{
          color: "#FFFFFF",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        FAQ's
      </Typography>
      <Box
        sx={{
          width: "70px",
          height: "3px",
          backgroundColor: "#4CAF50", // Green underline
          marginBottom: "30px",
        }}
      />

      {/* FAQ List */}
      {faqs.map((faq, index) => (
        <Accordion
          key={index}
          disableGutters
          sx={{
            backgroundColor: "#1E1E1E", // Match accordion background color
            color: "#FFFFFF",
            marginBottom: "10px",
            "&:before": {
              display: "none", // Removes the default accordion border
            },
            "& .MuiAccordionSummary-root": {
              padding: "0 20px",
            },
          }}
        >
          {/* Question */}
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4CAF50" }} />} // Green expand icon
            sx={{
              flexDirection: "row-reverse", // Adjust icon position
              minHeight: "48px",
              "& .MuiAccordionSummary-content": {
                margin: 0,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: 500,
              }}
            >
              {faq.question}
            </Typography>
          </AccordionSummary>

          {/* Answer */}
          <AccordionDetails
            sx={{
              padding: "10px 20px",
              fontSize: isMobile ? "13px" : "15px",
              color: "#AAAAAA",
            }}
          >
            {faq.answer}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;
