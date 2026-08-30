"use client";
import { Grid, Typography, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
const VideoAndAudienceCard = () => {
  const router = useRouter();
  return (
    <Box sx={{ padding: { xs: 2, sm: 4 } }}>
      <Grid container spacing={2}>
        {/* Card 1: Get Started with Video */}
        <Grid
          sx={{
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
          size={{
            xs: 12,
            sm: 6
          }}>
          <Grid
            container
            spacing={2}
            sx={{
              boxShadow: "7px -7px 23px 0px rgba(194,174,194,1)", // Box shadow added here
            }}
          >
            {/* Left Section (Image) */}
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
              size={{
                xs: 12,
                sm: 6
              }}>
              <img
                src="/images/pic8.jpeg" // Replace with your image URL
                alt="Create an Engaging Course"
                style={{
                  maxWidth: "250px",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Grid>

            {/* Right Section (Text Content) */}
            <Grid
              sx={{
                textAlign: { xs: "center", sm: "left" },
              }}
              size={{
                xs: 12,
                sm: 6
              }}>
              {/* Title */}
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: "#fff",
                  marginBottom: "12px",
                }}
              >
                Create an engaging Course
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  marginBottom: "20px",
                }}
              >
                Whether you've been teaching for years or are teaching for the
                first time, you can make an engaging course. We've compiled
                resources and best practices to help you get to the next level,
                no matter where you're starting.
              </Typography>

              {/* Link Button */}
              <Button
                variant="text"
                sx={{
                  color: "blueviolet",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
                onClick={() => router.push("/dashboard/admin/create/course")}
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Card 2: Build Your Audience */}
        <Grid
          sx={{
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
          size={{
            xs: 12,
            sm: 6
          }}>
          <Grid
            container
            spacing={2}
            sx={{
              boxShadow: "7px -7px 23px 0px rgba(194,174,194,1)", // Box shadow added here
            }}
          >
            {/* Left Section (Image) */}
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
              size={{
                xs: 12,
                sm: 6
              }}>
              <img
                src="/images/pic8.jpeg" // Replace with your image URL
                alt="Create an Engaging Course"
                style={{
                  maxWidth: "250px",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Grid>

            {/* Right Section (Text Content) */}
            <Grid
              sx={{
                textAlign: { xs: "center", sm: "left" },
              }}
              size={{
                xs: 12,
                sm: 6
              }}>
              {/* Title */}
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: "#fff",
                  marginBottom: "12px",
                }}
              >
                Create engaging Content
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: "#fff",
                  fontSize: "16px",
                  marginBottom: "20px",
                }}
              >
                Whether you've been teaching for years or are teaching for the
                first time, you can make an engaging course. We've compiled
                resources and best practices to help you get to the next level,
                no matter where you're starting.
              </Typography>

              {/* Link Button */}
              <Button
                variant="text"
                sx={{
                  color: "blueviolet",
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
                onClick={() => router.push("/dashboard/admin/create/content")}
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoAndAudienceCard;
