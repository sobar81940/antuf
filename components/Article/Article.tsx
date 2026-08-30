"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
  CardMedia,
  CardContent,
  Tooltip,
  Container,
  IconButton,
  Button
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Footer from "@/components/footer/Footer";
import MobileBottomNav from "@/components/MobileBottomNav/MobileBottomNav";

import { PlayArrow, Close, ChevronLeft, ChevronRight, ArrowForward } from "@mui/icons-material";

type ArticlesGridProps = {
  limit?: number;
  showAllLink?: boolean;
};

const ArticlesGrid = ({ limit, showAllLink = false }: ArticlesGridProps) => {
  const router = useRouter();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const apiUrl = "/api/Article?limit=all";
      console.log("Fetching from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        throw new Error(
          response.status === 500
            ? "Server error. Please try again later."
            : `HTTP error! status: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response content:", text.substring(0, 200));
        throw new Error("Response is not JSON. Received: " + contentType);
      }

      const data = await response.json();
      console.log("Fetched articles with populated categories:", data);

      // Data is an array of articles with populated category data
      const articlesData = Array.isArray(data) ? data : data.data || [];
      setContent(articlesData);
    } catch (error) {
      console.error("Error fetching content:", error);
      setError(error.message);
      toast.error("Error fetching content: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (error) return <p>Error: {error}</p>;

  // On the home page the featured article is part of the four-post limit.
  // The full archive keeps its existing grid of every post.
  const displayedArticles = limit ? content.slice(1, limit) : content;

  return (
    <>

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
        आज
            </Typography>
          </Box>

          {/* Featured Video Section */}
          {content && (
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
            // onClick={() => handleFeaturedClick(featuredVideo)}
            >
              {/* Featured Video Image */}
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "56.25%", // 16:9 aspect ratio
                  background: "#000",
                }}
              >
                {content.slice(0, 1).map((article, index) => (
                  <Box
                    key={article?._id || index}
                    component="img"
                    src={article?.featureImage}
                    alt={article.title}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  // onError={(e) => {
                  //   e.target.src = `https://img.youtube.com/vi/${extractYouTubeId(
                  //     featuredVideo.url
                  //   )}/hqdefault.jpg`;
                  // }}
                  />
                ))}

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
                        cursor: "pointer",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: "#f0f0f0",
                        },
                      }}
                      onClick={() => router.push(`/post/${content[0]?.slug}`)}
                    >
                      {content[0]?.title || "Featured Article"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 700,
                        color: "#fff",
                        mb: 2,
                        fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                        lineHeight: 1.3,
                        cursor: "pointer",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: "#f0f0f0",
                        },
                      }}
                    >
                      {content[0]?.category?.name || "Uncategorized"}
                    </Typography>

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
               
                </Box>
              </Box>
            </Box>
          )}

          {content.length > 0 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2.5,
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
                  Recent Articles
              
                </Typography>
                {showAllLink && (
                  <Button
                    endIcon={<ArrowForward />}
                    onClick={() => router.push("/posts")}
                    sx={{ fontWeight: 700, textTransform: "none" }}
                  >
                    All Posts & Articles
                  </Button>
                )}
              </Box>

              {/* All published posts in a responsive grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                  gap: 2.5,
                }}
              >
                {displayedArticles.map((content, index) => (
                  <Card
                    key={content._id || index}
                    sx={{
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
                    onClick={() => router.push(`/post/${content?.slug}`)}
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
                      {content.featureImage && (
                        <CardMedia
                          component="img"
                          image={content.featureImage || "https://via.placeholder.com/600x400?text=Image+Not+Available"}
                          alt={content.title}
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
                        {content.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {content?.category?.name || "Uncategorized"}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {/* Video Carousel */}

        </Container>




        {/* <Grid container spacing={2}>
          <Grid size={6}>
            {content.slice(0, 1).map((content, index) => (
              <Box
                key={content?._id || index}
              >
                <img
                  src={content?.featureImage}
                  width={150}
                  height={50}
                  alt={content.title}
                  loading="lazy"
                  style={{
                    borderRadius: "10px",
                    width: "50%",
                    height: "50%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
                <Box
                  sx={{
                    alignItems: "center",


                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {content?.category?.name || "Uncategorized"}
                  </Typography>
                  <Tooltip title={content?.title} placement="top">
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.4,
                        color: "#0a2b75",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        cursor: "pointer",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: "#1976d2",
                        },
                        minHeight: "4.2em", // Space for 3 lines
                        maxHeight: "4.2em" // Ensures consistent height
                      }}
                      onClick={() => router.push(`/post/${content?.slug}`)}
                    >
                      {content?.title || "Untitled"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {content?.category?.name || "Uncategorized"}
                    </Typography>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    justifyItems: "center",


                  }}
                >

                </Box>


              </Box>



            ))}
          </Grid>
          <Grid size={4} sx={{ mt: 3 }} >
            {content.slice(1, 4).map((content, i) => (
              <Grid item xs={12} key={i} sx={{ mt: 0.5 }}>
                <Card sx={{ display: "flex", boxShadow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 140,
                      height: 140,
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                      flexShrink: 0,
                      ml: 1
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: "100%", height: "90%", objectFit: "cover", borderRadius: "10px" }}
                      image={content.featureImage || "https://via.placeholder.com/600x400?text=Image+Not+Available"}
                      alt={content.title}
                    />
                  </Box>
                  <CardContent sx={{ flex: 2 }}>
                    <Tooltip title={content.title} placement="top">
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: "#0a2b75",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          cursor: "pointer",
                          transition: "color 0.3s ease",
                          "&:hover": {
                            color: "#1976d2",
                          },
                          minHeight: "2.4em",
                          whiteSpace: 'pre-line'
                        }}
                        onClick={() => router.push(`/post/${content?.slug}`)}
                      >
                        {content.title || "Untitled"}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {content?.category?.name || "Uncategorized"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

        </Grid> */}
      </Box>


      <MobileBottomNav />
    </>
  );
};

export default ArticlesGrid;
