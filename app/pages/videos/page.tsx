"use client";

import { useEffect, useState } from "react";
import {
  Box, Breadcrumbs, Card, CardContent, CardMedia, CircularProgress, Container,
  Dialog, IconButton, Link, Paper, Typography,
} from "@mui/material";
import {
  Home as HomeIcon, NavigateNext as NavigateNextIcon, PlayArrow, Close, OndemandVideo as VideoIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

// Helper function to extract YouTube ID
const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

const thumbnailFor = (url, quality = "hqdefault") => {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : "";
};

export default function VideoGalleryPage() {
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openPlayer, setOpenPlayer] = useState(false);

  useEffect(() => {
    fetch("/api/videos")
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch videos: ${response.status}`);
        return response.json();
      })
      .then((data) => setVideos(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to load videos"))
      .finally(() => setLoading(false));
  }, []);

  const handlePlayClick = (video) => {
    setSelectedVideo(video);
    setOpenPlayer(true);
  };

  const handleClosePlayer = () => {
    setOpenPlayer(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
            <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => router.push("/")}><HomeIcon sx={{ mr: .5 }} fontSize="inherit" />गृहपृष्ठ / Home</Link>
            <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => router.push("/pages")}>पृष्ठहरू / Pages</Link>
            <Typography color="text.primary">भिडियो ग्यालरी / Video Gallery</Typography>
          </Breadcrumbs>

          <Paper elevation={0} sx={{ p: 4, mb: 4, background: "linear-gradient(135deg, #16866d 0%, #102c3b 100%)", borderRadius: 2, color: "white", textAlign: "center" }}>
            <VideoIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" fontWeight={700}>भिडियो ग्यालरी</Typography>
            <Typography variant="h4" fontWeight={600}>Video Gallery</Typography>
          </Paper>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && error && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography color="error" variant="h6">Error: {error}</Typography>
            </Box>
          )}

          {!loading && !error && videos.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">No videos available yet.</Typography>
            </Box>
          )}

          {!loading && !error && videos.length > 0 && (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
              {videos.map((video, index) => (
                <Card
                  key={video._id || index}
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
                  onClick={() => handlePlayClick(video)}
                >
                  <Box sx={{ position: "relative", paddingTop: "56.25%", background: "#000", overflow: "hidden" }}>
                    {video.url && (
                      <CardMedia
                        component="img"
                        image={thumbnailFor(video.url)}
                        alt={video.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = thumbnailFor(video.url, "hqdefault");
                        }}
                        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.35)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <IconButton sx={{ background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)", color: "#fff", width: 52, height: 52, "&:hover": { background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" } }}>
                        <PlayArrow sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Box>
                    {video.createdAt && (
                      <Box sx={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "#fff", padding: "4px 8px", borderRadius: 1, fontSize: "0.72rem", fontWeight: 600 }}>
                        📅 {new Date(video.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </Box>
                    )}
                  </Box>
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
          )}
        </Container>
      </Box>
{/* Video Player Dialog */}
      <Dialog open={openPlayer} onClose={handleClosePlayer} maxWidth="md" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: 2, overflow: "hidden" } }}>
        <Box sx={{ position: "relative", background: "#000", paddingTop: "56.25%" }}>
          {selectedVideo && (
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.url)}?autoplay=1`}
              sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selectedVideo.title}
            />
          )}
          <IconButton onClick={handleClosePlayer} sx={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.7)", color: "#fff", zIndex: 10, "&:hover": { background: "rgba(0,0,0,0.9)" } }}>
            <Close />
          </IconButton>
        </Box>
        {selectedVideo && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#23235b" }}>{selectedVideo.title}</Typography>
          </Box>
        )}
      </Dialog>

      <Footer />
    </>
  );
}