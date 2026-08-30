import React, { useState, useEffect } from "react";

import { Box, Typography, Grid } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BuildIcon from "@mui/icons-material/Build";
import GridViewIcon from "@mui/icons-material/GridView";
import ArticleIcon from "@mui/icons-material/Article";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CodeIcon from "@mui/icons-material/Code";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const CourseJourney = ({ course }) => {
  // State variables to track different phases of a course or curriculum.
  const [phase1, setPhase1] = useState(null);
  const [phase2, setPhase2] = useState(null);
  const [phase3, setPhase3] = useState(null);
  const [phase4, setPhase4] = useState(null);

  // useEffect hook to set phases when the `course` data changes.
  useEffect(() => {
    // Assuming `course?.sections` is the data we want to use, this safely assigns it to each phase.
    const data = course?.sections || [];

    // Assign sections to each phase, defaulting to `null` if no data exists.
    setPhase1(data[0] || null);
    setPhase2(data[1] || null);
    setPhase3(data[2] || null);
    setPhase4(data[3] || null);
  }, [course]); // Re-run this effect whenever `course` data changes.

  // Transformed data for Phase 1.
  const transformedPhaseData = {
    phase: "Phase 1",
    title: phase1?.title, // Phase title is retrieved from `phase1`
    steps:
      phase1?.lectures?.slice(0, 2).map((lecture, index) => ({
        step: `Step ${index + 1}`,
        title: lecture?.title, // Title of the lecture in phase 1
        icon:
          index === 0 ? (
            <CheckCircleIcon sx={{ color: "#00FF66", marginRight: "8px" }} /> // Icon for the first step
          ) : (
            <PersonAddIcon sx={{ color: "#00FF66", marginRight: "8px" }} />
          ), // Icon for subsequent steps
      })) || [],
  };

  // Transformed data for Phase 2.
  const transformedPhase2Data = {
    phase: "Phase 2",
    title: phase2?.title || "Default Title", // Default title if phase2 title is not available
    steps:
      phase2?.lectures?.slice(0, 3).map((lecture, index) => ({
        step: `Step ${index + 1}`,
        title: lecture?.title, // Lecture title in phase 2
        icon:
          index === 0 ? (
            <CodeIcon sx={{ color: "#00FF66", marginRight: "8px" }} /> // Icon for the first step
          ) : index === 1 ? (
            <MergeTypeIcon sx={{ color: "#00FF66", marginRight: "8px" }} /> // Icon for second step
          ) : (
            <AssignmentTurnedInIcon
              sx={{ color: "#00FF66", marginRight: "8px" }}
            />
          ), // Icon for third step
      })) || [], // Ensure we always have an array, even if phase2 has no lectures.
  };

  // Transformed data for Phase 3.
  const transformedPhase3Data = {
    phase: "Phase 3",
    title: phase3?.title || "Default Title", // Default title if phase3 title is not available
    steps:
      phase3?.lectures?.slice(0, 3).map((lecture, index) => ({
        step: `Step ${index + 1}`,
        title: lecture?.title, // Lecture title in phase 3
        icon:
          index === 0 ? (
            <ArrowForwardIcon sx={{ color: "#00FF66", marginRight: "8px" }} /> // Icon for the first step
          ) : index === 1 ? (
            <BuildIcon sx={{ color: "#00FF66", marginRight: "8px" }} /> // Icon for second step
          ) : (
            <GridViewIcon sx={{ color: "#00FF66", marginRight: "8px" }} />
          ), // Icon for third step
      })) || [], // Ensure we always have an array, even if phase3 has no lectures.
  };

  // Transformed data for Phase 4.
  const transformedPhase4Data = {
    phase: "Phase 4",
    title: phase4?.title || "Default Title", // Default title if phase4 title is not available
    steps:
      phase4?.lectures?.slice(0, 2).map((lecture, index) => ({
        step: `Step ${index + 1}`,
        title: lecture?.title, // Lecture title in phase 4
        icon:
          index === 0 ? (
            <ArticleIcon sx={{ color: "#00FF66", marginRight: "8px" }} /> // Icon for the first step
          ) : (
            <GroupsIcon sx={{ color: "#00FF66", marginRight: "8px" }} />
          ), // Icon for the second step
      })) || [], // Ensure we always have an array, even if phase4 has no lectures.
  };

  return (
    <Box
      sx={{
        padding: "32px",
        backgroundColor: "#212121",
        color: "#FFFFFF",
          width: "100%",
          maxWidth: "100%",
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          borderBottom: "2px solid #00FF66",
          display: "inline-block",
          marginBottom: "24px",
        }}
      >
        Course Journey
      </Typography>

      {/* Render Phases Dynamically */}

      {/* Render Phases1 Dynamically */}

      <Box
        sx={{
          marginBottom: "32px",
          border: "1px solid #333",
          borderRadius: "8px",
          position: "relative",
          padding: "24px",
        }}
      >
        {/* Phase Label */}
        <Typography
          variant="subtitle1"
          sx={{
            position: "absolute",
            top: "-14px",
            left: "16px",
            backgroundColor: "#0B1120",
            color: "#00FF66",
            fontWeight: "bold",
            padding: "0 8px",
          }}
        >
          {transformedPhaseData.phase}
        </Typography>

        {/* Phase Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          {transformedPhaseData.title}
        </Typography>

        {/* Steps */}
        <Grid container spacing={4}>
          {transformedPhaseData?.steps?.map((stepData, stepIndex) => (
            <Grid
              key={stepIndex}
              size={{
                xs: 12,
                sm: 4
              }}>
              <Box
                display="flex"
                alignItems="center"
                sx={{ marginBottom: "8px" }}
              >
                {stepData?.icon}
                <Typography>
                  <strong>{stepData?.step}:</strong> {stepData?.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Render Phases2 Dynamically */}

      <Box
        sx={{
          marginBottom: "32px",
          border: "1px solid #333",
          borderRadius: "8px",
          position: "relative",
          padding: "24px",
        }}
      >
        {/* Phase Label */}
        <Typography
          variant="subtitle1"
          sx={{
            position: "absolute",
            top: "-14px",
            left: "16px",
            backgroundColor: "#0B1120",
            color: "#00FF66",
            fontWeight: "bold",
            padding: "0 8px",
          }}
        >
          {transformedPhase2Data.phase}
        </Typography>

        {/* Phase Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          {transformedPhase2Data.title}
        </Typography>

        {/* Steps */}
        <Grid container spacing={4}>
          {transformedPhase2Data?.steps?.map((stepData, stepIndex) => (
            <Grid
              key={stepIndex}
              size={{
                xs: 12,
                sm: 4
              }}>
              <Box
                display="flex"
                alignItems="center"
                sx={{ marginBottom: "8px" }}
              >
                {stepData?.icon}
                <Typography>
                  <strong>{stepData?.step}:</strong> {stepData?.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Render Phases3 Dynamically */}

      <Box
        sx={{
          marginBottom: "32px",
          border: "1px solid #333",
          borderRadius: "8px",
          position: "relative",
          padding: "24px",
        }}
      >
        {/* Phase Label */}
        <Typography
          variant="subtitle1"
          sx={{
            position: "absolute",
            top: "-14px",
            left: "16px",
            backgroundColor: "#0B1120",
            color: "#00FF66",
            fontWeight: "bold",
            padding: "0 8px",
          }}
        >
          {transformedPhase3Data.phase}
        </Typography>

        {/* Phase Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          {transformedPhase3Data.title}
        </Typography>

        {/* Steps */}
        <Grid container spacing={4}>
          {transformedPhase3Data?.steps?.map((stepData, stepIndex) => (
            <Grid
              key={stepIndex}
              size={{
                xs: 12,
                sm: 4
              }}>
              <Box
                display="flex"
                alignItems="center"
                sx={{ marginBottom: "8px" }}
              >
                {stepData?.icon}
                <Typography>
                  <strong>{stepData?.step}:</strong> {stepData?.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Render Phases4 Dynamically */}

      <Box
        sx={{
          marginBottom: "32px",
          border: "1px solid #333",
          borderRadius: "8px",
          position: "relative",
          padding: "24px",
        }}
      >
        {/* Phase Label */}
        <Typography
          variant="subtitle1"
          sx={{
            position: "absolute",
            top: "-14px",
            left: "16px",
            backgroundColor: "#0B1120",
            color: "#00FF66",
            fontWeight: "bold",
            padding: "0 8px",
          }}
        >
          {transformedPhase4Data.phase}
        </Typography>

        {/* Phase Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          {transformedPhase4Data.title}
        </Typography>

        {/* Steps */}
        <Grid container spacing={4}>
          {transformedPhase4Data?.steps?.map((stepData, stepIndex) => (
            <Grid
              key={stepIndex}
              size={{
                xs: 12,
                sm: 4
              }}>
              <Box
                display="flex"
                alignItems="center"
                sx={{ marginBottom: "8px" }}
              >
                {stepData?.icon}
                <Typography>
                  <strong>{stepData?.step}:</strong> {stepData?.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CourseJourney;
