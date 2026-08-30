import { DiscussionEmbed } from "disqus-react";
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Modal,
  CircularProgress,
  Button,
  Tooltip,
} from "@mui/material";
import FlutterDashIcon from "@mui/icons-material/FlutterDash";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { format } from "date-fns";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { runAi } from "@/components/ai/ai";

import MDEditor from "@uiw/react-md-editor";
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css";
import MarkdownIt from "markdown-it";
import Markdown from "react-markdown";
import Divider from "@mui/material/Divider";

import Share from "./Share";

const ResponsiveComponent = ({ content }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadinggain, setLoadinggain] = useState(false);
  const [modalGainOpen, setModalGainOpen] = useState(false);
  const [contentGain, setContentGain] = useState("");
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [summarizedContent, setSummarizedContent] = useState("");

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (str, lang) => {
      const language = lang && hljs.getLanguage(lang) ? lang : "js";
      try {
        const highlightedCode = hljs.highlight(str, { language }).value;
        return `
        <pre style="background-color: #2d2d2d; color: #f8f8f2; padding: 12px; padding-left: 30px; border-radius: 8px; overflow-x: auto;">
          <code style="font-family: 'Courier New', Courier, monospace; font-size: 14px; line-height: 1.5;">
            ${highlightedCode}
          </code>
        </pre>`;
      } catch (error) {
        return "";
      }
    },
  });

  const date = content?.date || content?.publishedAt || content?.updatedAt ?
    new Date(content.date || content.publishedAt || content.updatedAt) : null;
  const formattedData =
    date && !isNaN(date.getTime()) ? format(date, "dd MMM, yyyy") : "Invalid date";

  const renderedContent = content?.content
    ? md.render(String(content.content))
    : "No content available";

  const handleSummarize = async () => {
    if (content?.content) {
      setLoading(true);
      try {
        const prompt = `Summarize this content in at least 250 words : ${renderedContent}`;
        const summary = await runAi(prompt);
        console.log("Summary from handlesummarize fn-----", summary);
        setSummarizedContent(summary);
        setModalOpen(true);
      } catch (error) {
        console.log("Error from handle summarize fn----", error);
        setSummarizedContent("Error summarizing content!");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGain = async () => {
    if (content?.content) {
      setLoadinggain(true);
      try {
        const prompt = `Explain thoroughly : ${renderedContent}`;
        const summary = await runAi(prompt);
        console.log("Summary from handlesummarize fn-----", summary);
        setContentGain(summary);
        setModalGainOpen(true);
      } catch (error) {
        console.log("Error from handle summarize fn----", error);
        setContentGain("Error summarizing content!");
      } finally {
        setLoadinggain(false);
      }
    }
  };

  return (
    <>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, overflow: "hidden", borderRadius: 3, bgcolor: "#fff", border: "1px solid #d5e3d8", boxShadow: "0 20px 48px rgba(24, 58, 41, 0.14)", mt: 2 }}>
        <Box sx={{ position: "relative", minHeight: { xs: 260, md: 460 }, bgcolor: "#1d5137" }}>
          {content?.featureImage ? (
            <Box component="img" src={content.featureImage} alt={content.imageAlt || content.title || "Article feature image"} sx={{ display: "block", width: "100%", height: "100%", position: "absolute", inset: 0, objectFit: "cover" }} />
          ) : (
            <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%, #9fcb8f, transparent 28%), linear-gradient(135deg, #153d2a, #2f7050)" }} />
          )}
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(8,32,20,.38), transparent 55%)" }} />
          <Typography sx={{ position: "absolute", left: 20, bottom: 18, px: 1.25, py: 0.5, borderRadius: 1, bgcolor: "rgba(255,255,255,.92)", color: "#17452f", fontSize: "0.72rem", fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase" }}>
            {content?.category?.name || "Posts & Articles"}
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(145deg, #ffffff, #f2f7f3)" }}>
          <Typography sx={{ color: "#398252", fontSize: "0.75rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", mb: 1.5 }}>
            ANTUF • Posts & Articles
          </Typography>
          <Typography component="h1" sx={{ color: "#163b2a", fontFamily: "Georgia, serif", fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.1, fontWeight: 700, textWrap: "balance", m: 0 }}>
            {content?.title || "Loading article..."}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mt: 3, pt: 2.5, borderTop: "1px solid #dce7df" }}>
            <Typography sx={{ color: "#64796c", fontSize: "0.9rem" }}>Updated {formattedData}</Typography>
            <Share />
          </Box>
        </Box>
      </Box>
      {/* <Modal
        open={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#212121",
            color: "#fff",
            padding: 4,
            width: "80%",
            maxWidth: "1100px",
            textAlign: "center",
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: "8px",
            boxShadow: "linear-gradient(to right, #4caf50, #81c784)",

            //For more fancier styles
            // "&:hover": {
            //   background: "linear-gradient(to right, #4caf50, #81c784)",
            //   color: "#fff",
            //   border: "2px solid #81c784",
            //   transform: "scale(1.05)",
            //   transition: "all 0.3s ease",
            // },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: 2,
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: "linear-gradient(to right, #4caf50, #81c784)",
            }}
          >
            Comment
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              p: 5,
              margin: "0 auto",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
              },
              "& iframe": {
                borderRadius: "12px",
                border: "none",
              },
            }}
          >
            <DiscussionEmbed
              shortname="http-localhost-3000-7n5zjsctmg"
              config={{
                url: `${process.env.CLIENT_URL}/content/${content?.slug}`,
                identifier: content?._id,
                title: content?.title,
                language: "en",
              }}
            />
          </Box>
          <Button
            sx={{
              width: "100%",
              marginTop: 2,
              color: "#4caf50",
              border: "2px solid ##4caf50",
              background: "transparent",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                background: "linear-gradient(to right, #4caf50, #81c784)",
                color: "#fff",
                border: "2px solid #81c784",
                transform: "scale(1.05)",
                transition: "all 0.3s ease",
              },
            }}
            onClick={() => setChatModalOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#212121",
            color: "#fff",
            padding: 4,
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: 2,
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: "linear-gradient(to right, #4caf50, #81c784)",
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              padding: "10px",
              borderRadius: "8px",
              background: "linear-gradient(to right, #4caf50, #81c784)",
            }}
          >
            Summarized Content
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.3rem",
              fontWeight: "400",
              fontStyle: "italic",
              lineHeight: "1.6",
              color: "#fff",
              textAlign: "left",
              marginTop: 1,
              marginBottom: 2,
              maxHeight: "500px",
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            {<Markdown>{summarizedContent}</Markdown> || "No summary available"}
          </Typography>

          <Button
            sx={{
              width: "100%",
              marginTop: 2,
              color: "#4caf50",
              border: "2px solid ##4caf50",
              background: "transparent",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                background: "linear-gradient(to right, #4caf50, #81c784)",
                color: "#fff",
                border: "2px solid #81c784",
                transform: "scale(1.05)",
                transition: "all 0.3s ease",
              },
            }}
            onClick={() => setModalOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Modal
        open={modalGainOpen}
        onClose={() => setModalGainOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#212121",
            color: "#fff",
            padding: 4,
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: 2,
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: "linear-gradient(to right, #4caf50, #81c784)",
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              padding: "10px",
              borderRadius: "8px",
              background: "linear-gradient(to right, #4caf50, #81c784)",
            }}
          >
            Thorough Explanation
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.3rem",
              fontWeight: "400",
              fontStyle: "italic",
              lineHeight: "1.6",
              color: "#fff",
              textAlign: "left",
              marginTop: 1,
              marginBottom: 2,
              maxHeight: "500px",
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            {<Markdown>{contentGain}</Markdown> || "No summary available"}
          </Typography>

          <Button
            sx={{
              width: "100%",
              marginTop: 2,
              color: "#4caf50",
              border: "2px solid ##4caf50",
              background: "transparent",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                background: "linear-gradient(to right, #4caf50, #81c784)",
                color: "#fff",
                border: "2px solid #81c784",
                transform: "scale(1.05)",
                transition: "all 0.3s ease",
              },
            }}
            onClick={() => setModalGainOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal> */}
    </>
  );
};

export default ResponsiveComponent;
