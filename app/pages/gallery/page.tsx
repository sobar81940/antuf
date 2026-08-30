"use client";

import { Box, Breadcrumbs, Container, Link, Paper, Typography } from "@mui/material";
import { Home as HomeIcon, NavigateNext as NavigateNextIcon, PhotoLibrary as GalleryIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ImageGallery from "@/components/home/ImageGallery";

export default function GalleryPage() {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
            <Link underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => router.push("/")}><HomeIcon sx={{ mr: .5 }} fontSize="inherit" />गृहपृष्ठ / Home</Link>
            <Link underline="hover" color="inherit" sx={{ cursor: "pointer" }} onClick={() => router.push("/pages")}>पृष्ठहरू / Pages</Link>
            <Typography color="text.primary">फोटो ग्यालरी / Photo Gallery</Typography>
          </Breadcrumbs>

          <Paper elevation={0} sx={{ p: 4, mb: 4, background: "linear-gradient(135deg, #16866d 0%, #102c3b 100%)", borderRadius: 2, color: "white", textAlign: "center" }}>
            <GalleryIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" fontWeight={700}>फोटो ग्यालरी</Typography>
            <Typography variant="h4" fontWeight={600}>Photo Gallery</Typography>
          </Paper>

          {/* Grouped photo gallery with expandable categories + lightbox */}
          <ImageGallery showHeader={false} />
        </Container>
      </Box>
      <Footer />
    </>
  );
}