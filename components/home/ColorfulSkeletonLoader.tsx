"use client";

import { Box, Skeleton } from "@mui/material";
import { keyframes } from "@emotion/react";

const rainbow = keyframes`
  0% { background-color:rgb(248, 11, 19); }
  20% { background-color:rgb(199, 86, 54); }
  40% { background-color:rgb(230, 57, 181); }
  60% { background-color:rgb(219, 112, 12); }
  80% { background-color:rgb(226, 40, 34); }
  100% { background-color:rgb(244, 143, 143); }
`;

export const ColorfulSkeletonLoader = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "80vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{
          animation: `${rainbow} 3s ease infinite`,
          backgroundSize: "200% 200%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Skeleton
          variant="text"
          width="60%"
          height={60}
          sx={{
            mx: "auto",
            bgcolor: "rgba(255,255,255,0.8)",
            animation: `${rainbow} 3s ease infinite`,
          }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={40}
          sx={{
            mx: "auto",
            my: 2,
            bgcolor: "rgba(255,255,255,0.8)",
            animation: `${rainbow} 3s ease infinite 0.5s`,
          }}
        />
        <Skeleton
          variant="rounded"
          width={120}
          height={40}
          sx={{
            mx: "auto",
            bgcolor: "rgba(255,255,255,0.8)",
            animation: `${rainbow} 3s ease infinite 1s`,
          }}
        />
      </Box>
    </Box>
  );
};