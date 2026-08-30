"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Breadcrumbs,
  Link,
  CircularProgress,
  Modal,
  Alert,
} from "@mui/material";
import { CheckCircle, FileDownload, CurrencyRupee } from "@mui/icons-material";
import CourseDescription from "./CourseDescription";
import Alumni from "./Alumni";
import Technologies from "./Technologies";
import AboutCourse from "./AboutCourse";
import Faqs from "./Faqs";
import CourseJourney from "./CourseJourney";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { jsPDF } from "jspdf";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage({ course, loading }) {
  console.log('Course data:', course);
  console.log('Course price:', course?.price);

  // Format price for display
  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'Price unavailable';
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const icons = [
    "</>", // Code
    "🔥", // Fire/Hot Topic
    "💻", // Laptop
    "⚡", // Lightning Bolt/Power
    "🚀", // Rocket/Innovation
    "🌟", // Star/Highlight
    "📚", // Book/Learning
    "🖥️", // Desktop Computer
    "📱", // Mobile Phone
    "💡", // Light Bulb/Idea
    "🔧", // Wrench/Tools
    "🛠️", // Hammer and Wrench/Development
    "📈", // Chart/Progress
    "🧠", // Brain/AI
    "🌐", // Globe/Web
    "🔒", // Lock/Security
    "🔑", // Key/Access
    "📂", // Folder/Files
    "🖱️", // Mouse/Interaction
    "⌨️", // Keyboard
    "🧑‍💻", // Developer
    "🤖", // Robot/Automation
    "🛡️", // Shield/Security
    "🌍", // Earth/Global Impact
    "⏳", // Hourglass/Time
    "⚙️", // Gear/Settings
    "🖇️", // Paperclip/Attachment
    "📤", // Upload
    "📥", // Download
    "💾", // Floppy Disk/Save
    "🔍", // Magnifying Glass/Search
    "🗂️", // File Organizer
    "📡", // Satellite/Communication
    "🕹️", // Joystick/Gaming
    "🌌", // Milky Way/Space Tech
    "🚧", // Construction/Work in Progress
  ];
  const { data } = useSession();
  const [open, setOpen] = useState(false);
  const [currentIcon, setCurrentIcon] = useState("");
  const router = useRouter();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dummyData = "This is the brochure content. You can download this file.";

  const handleDownload = () => {
    if (!course) return; // Ensure that data is available before generating the PDF

    try {
      const doc = new jsPDF();

      // Get the image URL and handle missing image
      const backgroundImageUrl = course.imageUrl || '/images/default.png';
      
      try {
        // Only try to add image if URL exists
        if (backgroundImageUrl) {
          // Determine the image format based on the file extension (PNG or JPEG)
          const imageFormat = backgroundImageUrl.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
          doc.addImage(backgroundImageUrl, imageFormat, 0, 0, 210, 297);
        }
      } catch (imageError) {
        console.warn('Failed to add background image to PDF:', imageError);
        // Continue without the background image
      }

      // Set document title
      doc.setFontSize(18);
      doc.setTextColor(128, 0, 128); // Purple color for title
      doc.setFont("helvetica", "bold");
      
      // Add course title with position adjustment
      const title = course.title || 'Course Details';
      doc.text(title, 10, 20);

      // Underline the title
      const titleWidth = doc.getTextWidth(title);
      doc.setDrawColor(128, 0, 128);
      doc.line(10, 26, 10 + titleWidth, 26);

      // Start position for content
      let yPosition = 40;

      // Add course description if available
      if (course.description) {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        
        // Split description into lines that fit the page width
        const descriptionLines = doc.splitTextToSize(course.description, 190);
        doc.text(descriptionLines, 10, yPosition);
        yPosition += (descriptionLines.length * 7) + 10;
      }

      // Add sections if available
      if (Array.isArray(course.sections)) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 153, 76); // Green color for sections

        course.sections.forEach((section) => {
          if (yPosition > 270) { // Check if we need a new page
            doc.addPage();
            yPosition = 20;
          }

          // Add section title
          doc.text(section.title || 'Untitled Section', 10, yPosition);
          yPosition += 8;

          // Add lectures if available
          if (Array.isArray(section.lectures)) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(51, 51, 51);

            section.lectures.forEach((lecture) => {
              if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
              }

              doc.text(`• ${lecture.title || 'Untitled Lecture'}`, 15, yPosition);
              yPosition += 7;
            });
          }

          yPosition += 5; // Add space between sections
        });
      }

      // Save the PDF
      doc.save(`${course.title || 'Course'}_Brochure.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You might want to show an error message to the user here
    }
  };

  useEffect(() => {
    // Select a random icon from the array
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    setCurrentIcon(randomIcon);
  }, []); // Runs once when the component mounts

  // Display loading indicator while data is loading
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress
          size={80} // Makes it larger
          sx={{
            color: "purple", // Sets the color to purple
            animation: "spin 2s linear infinite", // Adds custom animation
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(180deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </Box>
    );
  }

  const handleButtonClick = () => {
    if (!data) return;
    router.push(`/checkout?search=${course?.slug}`); // Redirect to checkout if `data` exists
  };

  return (
    <>
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          minHeight: '100vh',
          bgcolor: 'linear-gradient(180deg, #0F172A, #0B1120)',
          color: '#fff',
          backgroundImage: `url(${course?.imageUrl || "/images/default.png"})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            zIndex: 0,
          },
        }}
      >
        {/* Hero section content container */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1400px',
            margin: '0 auto',
            px: { xs: 2, md: 4, lg: 8 },
            py: { xs: 4, md: 8, lg: 12 },
          }}
        >
          {/* Breadcrumb Section */}
          <Breadcrumbs sx={{ color: "#a8a8a8", mb: 4 }}>
            <Link
              href="/all-courses"
              underline="hover"
              sx={{ color: "#00ff88", textDecoration: "none", fontSize: "14px" }}
            >
              All Courses
            </Link>
            <Typography sx={{ fontSize: "14px", color: "#a8a8a8" }}>
              Live
            </Typography>
          </Breadcrumbs>

          {/* Main Content Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 4, md: 8 },
            }}
          >
            {/* Text Section */}
            <Box
              sx={{
                maxWidth: { xs: "100%", md: "600px" },
                width: "100%",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                {course?.title}
              </Typography>

              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircle sx={{ color: "#00ff88" }} />
                  Comprehensive Learning
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircle sx={{ color: "#00ff88" }} />
                  Industry Readiness
                </Stack>
              </Typography>

              <Typography variant="body2" sx={{ color: "#a8a8a8", mb: 4 }}>
                Recommended for Students and Working Professionals
              </Typography>

              {/* Buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={handleButtonClick}
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#00ff88",
                    color: "#000",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#00e67a" },
                  }}
                >
                  {data ? "Proceed to Checkout" : "Login to Register"}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "#00ff88",
                    borderColor: "#00ff88",
                    textTransform: "none",
                    "&:hover": { borderColor: "#00e67a", color: "#00e67a" },
                  }}
                  startIcon={<FileDownload />}
                  onClick={handleOpen}
                >
                  Download Brochure
                </Button>
              </Stack>

              <Typography
                variant="caption"
                sx={{ color: "#a8a8a8", display: "block", mt: 2 }}
              >
                Fill out the form to increase your chances of getting shortlisted
              </Typography>

              <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  marginTop: 2,
                  marginBottom: 2
                }}>
                  <CurrencyRupee sx={{ color: 'primary.main' }} />
                  <Typography 
                    variant="h4" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    {formatPrice(course?.price)}
                  </Typography>
                  {course?.price === 0 && (
                    <Alert severity="info" sx={{ ml: 2 }}>
                      This course is free to access!
                    </Alert>
                  )}
                </Box>

              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "bold",
                  color: "#00ff88",
                  textAlign: "center",
                  display: "block",
                  mt: 2,
                  position: "relative",
                  "&::before": {
                    content: '"Special Price"',
                    display: "block",
                    fontSize: "1.1rem",
                    color: "red",
                    fontWeight: "medium",
                    marginBottom: "4px",
                  },
                  animation:
                    "fadeIn 1.5s ease-in-out, bounce 2s infinite ease-in-out",
                }}
              >
                  ${course?.price}
                <style jsx>{`
                  @keyframes fadeIn {
                    from {
                      opacity: 0;
                      transform: translateY(-10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  @keyframes bounce {
                    0%,
                    100% {
                      transform: translateY(0);
                    }
                    50% {
                      transform: translateY(-5px);
                    }
                  }
                `}</style>
              </Typography>
            </Box>

            {/* Icon Section */}
            <Box
              sx={{
                width: { xs: "100%", md: "40%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: { xs: "300px", md: "400px" },
              }}
            >
              {/* Replace with an actual image/icon */}
              <Box
                sx={{
                  width: "250px",
                  height: "250px",
                  bgcolor: "transparent",
                  border: "3px dashed #00ff88",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "90%",
                    height: "90%",
                    border: "2px dashed #00ff88",
                    borderRadius: "50%",
                  },
                }}
              >
                <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                  {currentIcon}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main content section */}
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          bgcolor: '#212121',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Main content container */}
        <Box
          sx={{
            maxWidth: '1400px',
            margin: '0 auto',
            px: { xs: 2, md: 4, lg: 8 },
            py: { xs: 4, md: 8 },
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {course ? <CourseDescription course={course} /> : null}
          {course ? <CourseJourney course={course} /> : null}
          <Alumni />
          {course ? <AboutCourse course={course} /> : null}
          <Technologies />
          <Faqs />
        </Box>
      </Box>
      <Footer />

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#212121",
            color: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            width: "900px",
            maxHeight: "80vh", // Set max height for the modal
            overflowY: "auto", // Make the modal scrollable
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", fontSize: "1.25rem" }}
          >
            Brochure Content
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              fontSize: "1.125rem",
              color: "#00e67a",
            }}
          >
            {course?.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              fontSize: "1rem", // Adjust font size
              lineHeight: "1.9", // Improve line height for readability
              fontWeight: "500", // Set lighter font weight for description text
              overflowWrap: "break-word", // Handle long words without breaking the layout
            }}
          >
            {course?.description}
            {/* You can adjust the description length as needed */}
          </Typography>

          <Button
            variant="outlined"
            size="large"
            sx={{
              color: "#00ff88",
              borderColor: "#00ff88",
              textTransform: "none",
              "&:hover": { borderColor: "#00e67a", color: "#00e67a" },
            }}
            startIcon={<FileDownload />}
            onClick={handleDownload}
          >
            Download Brochure
          </Button>
        </Box>
      </Modal>
    </>
  );
}
