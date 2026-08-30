import React from "react";
import readingTime from "reading-time";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
const Content = ({ content, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const renderedContent = content?.content
    ? md.render(String(content.content))
    : "No content available";

  return (
    <>
      <Box
        sx={{
          marginTop: { xs: 2, md: 3 },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              marginBottom: 2,
              padding: { xs: 2.5, sm: 4, md: 6 },
              borderRadius: 3,
              border: "1px solid #dce7df",
              boxShadow: "0 14px 34px rgba(24, 58, 41, 0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#537060",
                fontSize: "0.8rem",
                paddingBottom: 2,
                marginBottom: 3,
                borderBottom: "1px solid #e3ece5",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: "18px" }} />

              <Typography variant="caption">
                {readingTime(renderedContent).text}
              </Typography>
            </Box>

            <CardContent
              sx={{
                flex: 1,
                padding: "0 !important",
              }}
            >
              <Box
                sx={{
                  color: "#23372b",
                  marginBottom: 1,
                  fontSize: isMobile ? "16px" : "18px",
                  "& .markdown-preview": {
                    "& h1, & h2, & h3": { color: "#163b2a", fontFamily: "Georgia, serif", lineHeight: 1.2, marginTop: "2rem" },
                    "& p, & li": { lineHeight: 1.85 },
                    "& a": { color: "#087443", fontWeight: 700 },
                    "& img": { maxWidth: "100%", height: "auto", borderRadius: 2 },
                    "& blockquote": { margin: "2rem 0", paddingLeft: 2.5, borderLeft: "4px solid #78a77f", color: "#496151", fontStyle: "italic" },
                    "& pre": { maxWidth: "100%", overflowX: "auto" },
                  },
                }}
              >
                <div className="markdown-preview">
                  <div
                    style={{
                      fontSize: isMobile ? "16px" : "18px", // Dynamic font size
                      fontStyle: "normal",
                      letterSpacing: "0.5px", // Letter spacing
                      lineHeight: "1.6", // Line height
                      wordSpacing: "1px", // Optional word spacing for better readability
                    }}
            dangerouslySetInnerHTML={{ __html: renderedContent }} />
                </div>
              </Box>

              {content && content?.videourl ? (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: "240px", md: "560px" },
                    marginTop: 3,
                    padding: 1,
                    backgroundColor: "#163b2a",
                    borderRadius: 2,
                  }}
                >
                  <ReactPlayer
                    src={content?.videourl}
                    width="100%"
                    height="100%"
                    controls
                    light={true}
                    playing={false}
                  />
                </Box>
              ) : null}
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default Content;
