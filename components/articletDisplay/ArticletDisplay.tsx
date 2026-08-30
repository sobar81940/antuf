import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import Accordionleft from "@/components/articlesingle/Accordion";
import Advertisement from "@/components/articlesingle/Advertisement";
import Advertisementtop from "@/components/articlesingle/Advertisementtop";
import Advertisementbottom from "@/components/articlesingle/Advertisementbottom";
import Centerads from "@/components/articlesingle/Centerads";



import Content from "@/components/articlesingle/Content";
import Title from "@/components/articlesingle/Title";
import SimilarReads from "@/components/articlesingle/SimilarReads";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


export default function ArticleLayout({ content, loading }) {
  const [displayContent, setDisplayContent] = useState(null);

  useEffect(() => {
    if (!content || loading) return;

    // Check if content is a full curriculum or a single lecture
    if (content.sections && Array.isArray(content.sections) && content.sections.length > 0) {
      // It's a full curriculum, get the first lecture from the first section
      const firstSection = content.sections[0];
      if (firstSection && firstSection.lectures && firstSection.lectures.length > 0) {
        const firstLecture = firstSection.lectures[0];
        setDisplayContent({
          ...firstLecture,
          curriculumTitle: content.title,
          curriculumSlug: content.slug,
          sectionTitle: firstSection.title
        });
      }
    } else {
      // It's a simple article without sections
      setDisplayContent(content);
    }
  }, [content, loading]);
  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: "100vh", py: { xs: 2, md: 5 }, bgcolor: "#f4f7f5", background: "linear-gradient(180deg, #edf5ef 0, #f8faf9 420px, #fff 100%)" }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: "1060px", mx: "auto" }}>
          {/* <Grid size="auto">
            <Grid item xs={12} md={2.5}>
              <Box sx={{ position: "sticky", top: "20px", height: "fit-content" }}>
                <Accordionleft curriculum={content} />
              </Box>
            </Grid>
          </Grid> */}
            <Box>
              {/* <Centerads /> */}
              <Title content={displayContent} />
              <Content content={displayContent} loading={loading || !displayContent} />
              <SimilarReads currentTitle={displayContent?.title} displayContent={displayContent} />
            </Box>
          {/* <Grid size="grow">
        <Box sx={{ position: "sticky", top: "20px", height: "fit-content" }}>
              <Card sx={{ bgcolor: "#1a1a1a", color: "#fff", border: "1px solid #333" }}>
                <CardContent sx={{ p: 1 }}>
                  <Advertisement />
                  <Box sx={{ mt: 2 }}>
                    <Advertisementtop />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Advertisementbottom />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Advertisement />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Advertisementtop />
                  </Box>
                </CardContent>
              </Card>
            </Box>
  </Grid> */}

          </Box>
        </Container>

      </Box>
      <Footer />
    </>
  );
}
