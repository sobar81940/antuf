"use client";

import { useState, useEffect } from "react";
import Course from "@/components/coursedisplay/Course";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const ContentViewPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    if (!search) {
      setError("No course ID provided");
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = `/api/course/slug/${search}`;
        console.log('Fetching course:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch course");
        }

        const data = await response.json();
        console.log('Course data:', data);
        
        if (!data) {
          throw new Error("Course not found");
        }

        setContent(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [search]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        overflow: 'hidden' // Prevent horizontal scrolling
      }}
    >
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flex: 1,
          width: '100%',
          maxWidth: '100vw'
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "70vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box 
            sx={{ 
              textAlign: "center", 
              py: 8,
              minHeight: "70vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              px: 2
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              {error}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please check the URL and try again
            </Typography>
          </Box>
        ) : !content ? (
          <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
            <Typography variant="h6">No course data available</Typography>
          </Box>
        ) : (
          <Course course={content} loading={false} />
        )}
      </Box>
      <Box 
        component="footer" 
        sx={{ 
          width: '100%',
          bgcolor: '#191919'
        }}
      >
    
      </Box>
    </Box>
  );
};

export default ContentViewPage;