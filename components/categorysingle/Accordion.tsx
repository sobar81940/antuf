"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Button,
  Divider,
  CircularProgress, // Import CircularProgress
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LodashAccordion({ curriculum: curriculumProp }: any) {
  const pathname = usePathname(); // Get the full path
  const slug = pathname.split("/").pop(); // Extract the last part of the path

  const [showAccordion, setShowAccordion] = useState(true); // Toggle visibility for smaller devices
  const router = useRouter();
  const [curriculum, setCurriculum] = useState([]); // Holds fetched data
  const [courseSlug, setCourseSlug] = useState(''); // Store course slug for navigation
  const [loading, setLoading] = useState(false); // State to handle loading indicator

  useEffect(() => {
    // When a curriculum object is provided, use its sections directly
    if (curriculumProp?.sections?.length) {
      setCurriculum(curriculumProp.sections);
      setCourseSlug(curriculumProp.slug || "");
      setLoading(false);
      return;
    }
    if (slug) {
      fetchCurriculum(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, curriculumProp]);

  const fetchCurriculum = async (slug) => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await fetch(`/api/accordion/${slug}`);
      const data = await response.json();
      const sections = data?.sections || [];

      console.log("fetching curriculum sections:", sections);
      setCurriculum(sections);
      
      // Store the course slug for proper navigation
      if (data?.slug) {
        setCourseSlug(data.slug);
      }
    } catch (error) {
      console.log("Error fetching curriculum:", error);
    }
    setLoading(false); // Set loading to false after data is fetched
  };

  const handleContentSelection = (lecture) => {
    // Navigate using the proper course/lecture URL structure
    if (courseSlug) {
      router.push(`/${courseSlug}/${lecture.slug}`);
    } else {
      // Fallback to just lecture slug if course slug is not available
      router.push(`/${lecture.slug}`);
    }
  };

  return (
    <>
      {/* Accordion Section */}
      <Box
        sx={{
          zIndex: 1,
          bgcolor: "#212121",
          color: "#fff",
          width: "400px",
          height: "100vh", // Full viewport height
          //  position: "fixed", // Keeps it fixed on the left
          overflowY: "auto", // Adds vertical scrollbar when content overflows
          borderRight: "1px solid #333",
          display: { xs: showAccordion ? "block" : "none", md: "block" },
        }}
      >
        {/* Show loading spinner while fetching data */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress color="inherit" />{" "}
            {/* Displaying loading spinner */}
          </Box>
        ) : (
          <>
            <Button
              onClick={() => router.push("/pricing")}
              variant="contained"
              sx={{
                bgcolor: "#FFD700", // Golden button
                color: "#000",
                fontSize: "1.1rem",
                textTransform: "none",
                fontWeight: "bold",
                width: "100%", // Full-width button
                padding: "12px 24px", // Adjust padding for a more stylish look
                // Rounded corners for a modern style
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add a soft shadow
                "&:hover": {
                  bgcolor: "#FFC107",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Slightly larger shadow on hover
                },
              }}
            >
              Go Premium
            </Button>

            <Divider
              sx={{
                height: "5px",
                width: "100%",
                margin: "auto",
                backgroundColor: "black",
              }}
            />

            <Button
              onClick={() => router.push("/")}
              variant="contained"
              sx={{
                bgcolor: "#FFD700", // Golden button
                color: "#000",

                fontSize: "1.1rem",
                textTransform: "none",
                fontWeight: "bold",
                width: "100%", // Full-width button
                padding: "12px 24px", // Adjust padding for a more stylish look
                // Rounded corners for a modern style
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add a soft shadow
                "&:hover": {
                  bgcolor: "#FFC107",
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Slightly larger shadow on hover
                },
              }}
            >
              Go Home
            </Button>

            {curriculum?.map((item, index) => (
              <Accordion
                key={index}
                disableGutters
                sx={{
                  bgcolor: "inherit",
                  color: "inherit",
                  borderBottom: "1px solid #333",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                >
                  <Typography
                    style={{
                      fontSize: "22px", // Dynamic font size
                      fontStyle: "normal",
                      letterSpacing: "0.5px", // Letter spacing
                      lineHeight: "1.6", // Line height
                      wordSpacing: "1px", // Optional word spacing for better readability
                    }}
                  >
                    {item.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {item?.lectures?.map((lecture, i) => (
                    <Typography
                      key={i}
                      sx={{
                        mb: 1,
                        cursor: "pointer",
                        "&:hover": { color: "#008000" },
                      }}
                      style={{
                        fontSize: "20px", // Dynamic font size
                        fontStyle: "normal",
                        letterSpacing: "0.5px", // Letter spacing
                        lineHeight: "1.1", // Line height
                        wordSpacing: "1px", // Optional word spacing for better readability
                      }}
                      onClick={() => handleContentSelection(lecture)}
                    >
                      {lecture.title}
                    </Typography>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </Box>

      {/* Floating Menu Icon for Small Devices */}
      <IconButton
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { md: "none" },
          bgcolor: "#333",
          color: "#fff",
          zIndex: 10,
          "&:hover": {
            bgcolor: "#444",
          },
        }}
        onClick={() => setShowAccordion(!showAccordion)}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
}
