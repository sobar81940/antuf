"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CircularProgress,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
//import ExploreCards from "./ExploreCards";
//import Section from "./Section";
//import Hire from "./Hire";

import { fetchItems } from "@/slice/catewithsubcateSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

const courses = [
  {
    title: "GfG 160",
    subtitle: "Tech Career Roadmap",
    description: "GfG 160 - 160 Days of Problem Solving",
    level: "Beginner to Advance",
    link: "/gfg160",
    color: "#1a8b77",
    rating: "⭐ 4.6",
    bgImage: "/images/pic1.png",
  },
  {
    title: "DSA to Development",
    subtitle: "A Complete Guide",
    description: "DSA to Development: A Complete Guide",
    level: "Beginner to Advance",
    link: "/dsa-development",
    color: "#16755f",
    rating: "⭐ 4.4",
    bgImage: "/images/pic2.png",
  },
  {
    title: "Backend",
    subtitle: "Development",
    description: "JAVA Backend Development - Live",
    level: "Intermediate and Advance",
    link: "/backend-development",
    color: "#746eb6",
    rating: "⭐ 4.7",
    bgImage: "/images/pic3.png",
  },
];

const CoursesGrid = () => {
  const router = useRouter();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [catewithsubcate, setCateWithSubCate] = useState([]);
  const filteredWebDevelopemnt = catewithsubcate.filter(
    (item) => item.categoryId.name === "Web Development"
  );

  const filteredmlandDataScience = catewithsubcate.filter(
    (item) => item.categoryId.name === "ML & Data Science"
  );
  const filteredLanguages = catewithsubcate.filter(
    (item) => item.categoryId.name === "Languages"
  );
  const filteredInterviewCorner = catewithsubcate.filter(
    (item) => item.categoryId.name === "Interview Corner"
  );

  const filteredCSSubjects = catewithsubcate.filter(
    (item) => item.categoryId.name === "CS Subjects"
  );
  const filteredDevOpsAndLinux = catewithsubcate.filter(
    (item) => item.categoryId.name === "DevOps And Linux"
  );

  const filteredSchoolLanguages = catewithsubcate.filter(
    (item) => item.categoryId.name === "Languages"
  );

  const filteredDSA = catewithsubcate.filter(
    (item) => item.categoryId.name === "DSA"
  );

  //   useEffect(() => {
  //     const fetchItems = async () => {
  //       try {
  //         const response = await fetch(`${process.env.API}/catewithsubcate`); // Replace with your API endpoint
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch catewithsubcate");
  //         }
  //         const data = await response.json();

  //         console.log(" setCateWithSubCate", data);
  //         setCateWithSubCate(data);
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchItems();
  //   }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/sixcourses'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();

        console.log("six courser", data);
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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

  const handleViewAll = () => {
    router.push("/all-courses");
  };

  return (
    <>
      <Box
        sx={{
          padding: "20px",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        {/* Heading */}
        <Typography
          variant="h5"
          component="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Our Courses
        </Typography>

        {/* Courses Grid */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
          maxWidth="lg" // Restrict the width for large screens
        >
          {course.map((course, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <Card
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Card Top Section */}
                <Box
                  sx={{
                    position: "relative",
                    height: "200px",
                    backgroundImage: `url(${
                      course.imageUrl || "/images/pic3.png"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    ⭐ 4.6
                  </Typography>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "8px",
                      left: "16px",
                      color: "#fff",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {course.title}
                    </Typography>
                    {/* <Typography variant="subtitle2">{course.description
                  }
                  
                  </Typography> */}
                  </Box>
                </Box>

                {/* Card Bottom Section */}
                <Box
                  sx={{
                    backgroundColor: "#212121",
                    color: "#fff",
                    padding: "1rem",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "start",
                  }}
                >
                  <Typography variant="body2">
                     {course.description ? course.description.substring(0, 100) : 'No description available'}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      marginTop: "8px",
                      display: "block",

                      color: "#00e67a",
                    }}
                  >
                    {course.level}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: "bold",
                      color: "#00ff88",
                      //  textAlign: "center",
                      display: "block",
                      mt: 2,
                      position: "relative",
                      "&::before": {
                        content: '"Special Price"',
                        display: "block",
                        fontSize: "0.9rem",
                        color: "#a8a8a8",
                        fontWeight: "medium",
                        marginBottom: "1px",
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

                  <Box marginTop="1rem">
                    <Button
                      variant="text"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                      onClick={() =>
                        router.push(`/course-details?search=${course?.slug}`)
                      }
                      endIcon={<ArrowForwardIcon />}
                    >
                      Explore Now
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* View All Button */}
        <Box textAlign="center" marginTop="2rem">
          <Button
            variant="text"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={handleViewAll}
            endIcon={<ArrowForwardIcon />}
          >
            View All
          </Button>
        </Box>
      </Box>

      {/* <ExploreCards /> */}

      {/* <Section title="DSA" color="#5388c5" data={filteredDSA} />

      <Section
        title="Web development"
        color="#1d4a4d"
        data={filteredWebDevelopemnt}
      />

      <Section
        title=" AI ML & Data Science"
        color="#ed3bd2"
        data={filteredmlandDataScience}
      />

      <Section
        title=" Programming Languages"
        color="#eb2a84"
        data={filteredLanguages}
      />

      <Section
        title="Interview Preparation"
        color="#14ade0"
        data={filteredInterviewCorner}
      />

      <Section title="CS Subjects" color="#8830f2" data={filteredCSSubjects} />

      <Section title="DevOps" color="#0fd450" data={filteredDevOpsAndLinux} />

      <Section
        title="Languages"
        color="#d4820f"
        data={filteredSchoolLanguages}
      /> */}
      {/* <Hire title="Must Explore" color="#e0ad65" /> */}
    </>
  );
};

export default CoursesGrid;
