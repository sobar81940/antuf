import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRouter } from "next/navigation";
const articles = [
  {
    title:
      "How to use 'lodash' Package for Array Manipulation in a JavaScript Project?",
    description:
      "In this article, we'll look at how to use Lodash for array manipulation tasks like sorting, filtering, mapping, etc. The 'lodash' is a very important and useful npm package that provides a set of functions to work with arrays, strings, objects...",
    readTime: "4 min read",
    tags: ["JavaScript", "Lodash", "Array Manipulation"],
    link: "/article-1",
  },
  {
    title: "Lodash or Underscore - pick, pickBy, omit, omitBy",
    description:
      "Javascript is Everywhere. The Javascript is used widely and it's not limited to just only in your web browser but also widely used in the server-side as well. JavaScript is used by 95% of all the websites. Lodash or Underscore makes...",
    readTime: "2 min read",
    tags: ["JavaScript", "Lodash", "Underscore"],
    link: "/article-2",
  },
  {
    title: "Difference between lodash and Underscore",
    description:
      "The lodash and UnderScore both are utility libraries from JavaScript which helps make it easier by providing utils which makes, working with arrays, numbers, objects, and strings much easier. They provide a group of tools used for common...",
    readTime: "3 min read",
    tags: ["JavaScript", "Lodash", "Comparison"],
    link: "/article-3",
  },
  {
    title: "Node.js lodash.sortBy() Function",
    description:
      "Lodash is a module in Node.js that works on the top of underscore.js. Lodash helps in working with arrays, strings, objects, numbers, etc. The Lodash.sortBy() function is used to sort the array in ascending order. Syntax: sortBy(collection...",
    readTime: "5 min read",
    tags: ["Node.js", "Lodash", "Sort"],
    link: "/article-4",
  },
];

import readingTime from "reading-time";
const SimilarReads = () => {
  const theme = useTheme();
  const router = useRouter(); // Initialize useRouter
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // For responsiveness
  const handleTagNavigation = (tag) => {
    router.push(`/${tag}`); // Navigate to the tag's page
  };

  const [curriculum, setCurriculum] = useState([]); // Holds fetched data
  const [loading, setLoading] = useState(false); // State to handle loading indicator
  const [tags, setTags] = useState([]);
  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async (slug?: string) => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await fetch('/api/similarread');
      const data = await response.json();
      const sections = data?.curriculums || [];
      const tag = data?.subCategory || [];
      setTags(tag);

      setCurriculum(sections);
    } catch (error) {
      console.log("Error fetching curriculum from similarread:", error);
    }
    setLoading(false); // Set loading to false after data is fetched
  };

  const lectures = curriculum.flatMap((course) =>
    course.sections.flatMap((section) =>
      section.lectures.map((lecture) => ({
        title: lecture.title,
        slug: lecture?.slug,
        description: lecture.content.substring(0, 100), // Shorten content as description
        readTime: "5 min read", // Example static value for read time
        link: lecture.videourl || "#", // Link to video or a placeholder
      }))
    )
  );

  // Shuffle the lectures and select the first 5
  const shuffledLectures = lectures.sort(() => Math.random() - 0.5).slice(0,2);

  const randomtag = tags.sort(() => 0.5 - Math.random()).slice(0, 9);

  return (
    <Box
      sx={{
        backgroundColor: "#212121", // Dark background
        padding: 3,

        borderRadius: "8px",
        color: "#fff",
      }}
    >
      {/* Heading */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          marginBottom: 2,
          fontSize: isMobile ? "18px" : "22px",
        }}
      >
        Similar Reads
      </Typography>

      {/* Articles List */}
      {shuffledLectures.map((article, index) => (
        <Card
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#1e1e1e",
            marginBottom: 2,
            padding: 2,
            border: "2px solid white",
            borderRadius: "8px",
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.01)",
            },
          }}
          onClick={() => router.push(`/${article?.slug}`)} // Make it clickable
        >
          <CardContent sx={{ flex: 1, padding: "0px" }}>
            {/* Article Title */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                marginBottom: 1,
                color: "#fff",
                fontSize: isMobile ? "18px" : "22px",
              }}
            >
              {article.title}
            </Typography>

            {/* Article Description */}
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                marginBottom: 1,
                fontSize: isMobile ? "12px" : "14px",
              }}
              style={{
                fontSize: isMobile ? "16px" : "18px", // Dynamic font size
                fontStyle: "normal",
                letterSpacing: "0.5px", // Letter spacing
                lineHeight: "1.6", // Line height
                wordSpacing: "1px", // Optional word spacing for better readability
              }}
            >
              {article.description}
            </Typography>

            {/* Read Time */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#aaa",
                fontSize: "12px",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: "16px" }} />
              <Typography variant="caption">
                {readingTime(article?.description).text}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Article Tags Section */}
      <Box
        sx={{
          marginTop: 3,
          padding: 2,
          backgroundColor: "#212121",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            marginBottom: 1,
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          Article Tags:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {randomtag.map((tag, index) => (
            <Chip
              key={index}
              label={tag.name}
              onClick={() => handleTagNavigation(tag?.slug.toLowerCase())}
              sx={{
                backgroundColor: "#2e2e2e",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                "&:hover": {
                  color: "green",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SimilarReads;
