"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Dialog,
  IconButton,
  Container,
  Button,
} from "@mui/material";
import { PlayArrow, Close, ChevronLeft, ChevronRight } from "@mui/icons-material";

// Helper function to extract YouTube ID
const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

const VideoContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openPlayer, setOpenPlayer] = useState(false);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const apiUrl = "/api/videos"; // Public endpoint, no auth required
        
        console.log("Fetching from:", apiUrl);
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text.substring(0, 200));
          throw new Error("API returned non-JSON response");
        }

        const data = await response.json();
        console.log("Videos fetched successfully:", data.length, "videos");
        
        // Data is already filtered for active videos on the server
        setVideos(Array.isArray(data) ? data : []);
        
        // Set first video as featured
        if (data && data.length > 0) {
          setFeaturedVideo(data[0]);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err.message || "An error occurred while fetching videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePlayClick = (video) => {
    setSelectedVideo(video);
    setOpenPlayer(true);
  };

  const handleClosePlayer = () => {
    setOpenPlayer(false);
    setSelectedVideo(null);
  };

  const handleFeaturedClick = (video) => {
    setFeaturedVideo(video);
    setSelectedVideo(video);
    setOpenPlayer(true);
  };

  const handleScroll = (direction) => {
    const scrollContainer = document.getElementById("video-scroll-container");
    if (scrollContainer) {
      const scrollAmount = 320;
      if (direction === "left") {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        setScrollPosition(scrollPosition - scrollAmount);
      } else {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setScrollPosition(scrollPosition + scrollAmount);
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (videos.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No videos available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3 }, bgcolor: "#f8f9fa" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 12,
              height: 24,
              background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
              borderRadius: 1,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              color: "#1e40af",
            }}
          >
            भिडियो
          </Typography>
        </Box>

        {/* Featured Video Section */}
        {featuredVideo && (
          <Box
            sx={{
              mb: 5,
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              background: "#000",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.01)",
              },
            }}
            onClick={() => handleFeaturedClick(featuredVideo)}
          >
            {/* Featured Video Image */}
            <Box
              sx={{
                position: "relative",
                paddingTop: "56.25%", // 16:9 aspect ratio
                background: "#000",
              }}
            >
              {featuredVideo.url && featuredVideo.url.includes("youtube") && (
                <Box
                  component="img"
                  src={`https://img.youtube.com/vi/${extractYouTubeId(
                    featuredVideo.url
                  )}/maxresdefault.jpg`}
                  alt={featuredVideo.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${extractYouTubeId(
                      featuredVideo.url
                    )}/hqdefault.jpg`;
                  }}
                />
              )}

              {/* Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: { xs: 2, sm: 3, md: 4 },
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      mb: 2,
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                      lineHeight: 1.3,
                    }}
                  >
                    {featuredVideo.title}
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    sx={{
                      background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      padding: "10px 24px",
                      "&:hover": {
                        background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                      },
                    }}
                  >
                    Watch Now
                  </Button>
                </Box>
              </Box>

              {/* Play Button Center */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                <IconButton
                  sx={{
                    background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                    color: "#fff",
                    width: 80,
                    height: 80,
                    "&:hover": {
                      background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <PlayArrow sx={{ fontSize: 48 }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}

        {/* Video Carousel */}
        {videos.length > 1 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#23235b",
                }}
              >
                More Videos
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => handleScroll("left")}
                  sx={{
                    background: "#f0f0f0",
                    "&:hover": {
                      background: "#e0e0e0",
                    },
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={() => handleScroll("right")}
                  sx={{
                    background: "#f0f0f0",
                    "&:hover": {
                      background: "#e0e0e0",
                    },
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
            </Box>

            {/* Scrollable Container */}
            <Box
              id="video-scroll-container"
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                scrollBehavior: "smooth",
                pb: 2,
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f0f0f0",
                  borderRadius: 10,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#ccc",
                  borderRadius: 10,
                  "&:hover": {
                    background: "#999",
                  },
                },
              }}
            >
              {videos.map((video, index) => (
                <Card
                  key={video._id}
                  sx={{
                    minWidth: 280,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      transform: "translateY(-4px)",
                    },
                  }}
                  onClick={() => handlePlayClick(video)}
                >
                  {/* Thumbnail */}
                  <Box
                    sx={{
                      position: "relative",
                      paddingTop: "56.25%", // 16:9 aspect ratio
                      background: "#000",
                      overflow: "hidden",
                    }}
                  >
                    {video.url && video.url.includes("youtube") && (
                      <CardMedia
                        component="img"
                        image={`https://img.youtube.com/vi/${extractYouTubeId(
                          video.url
                        )}/hqdefault.jpg`}
                        alt={video.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    {/* Play Button Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.4)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        "&:hover": {
                          opacity: 1,
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                          color: "#fff",
                          width: 50,
                          height: 50,
                          "&:hover": {
                            background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                          },
                        }}
                      >
                        <PlayArrow sx={{ fontSize: 28 }} />
                      </IconButton>
                    </Box>

                    {/* Video Number Badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {index + 1}
                    </Box>
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#23235b",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.4,
                      }}
                    >
                      {video.title}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>

      {/* Video Player Dialog */}
      <Dialog
        open={openPlayer}
        onClose={handleClosePlayer}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            background: "#000",
            paddingTop: "56.25%", // 16:9 aspect ratio
          }}
        >
          {selectedVideo && (
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${extractYouTubeId(
                selectedVideo.url
              )}?autoplay=1`}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Close Button */}
          <IconButton
            onClick={handleClosePlayer}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(0,0,0,0.7)",
              color: "#fff",
              zIndex: 10,
              "&:hover": {
                background: "rgba(0,0,0,0.9)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Video Title */}
        {selectedVideo && (
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#23235b",
              }}
            >
              {selectedVideo.title}
            </Typography>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default VideoContent;
