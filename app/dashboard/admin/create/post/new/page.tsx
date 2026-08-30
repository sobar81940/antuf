"use client";

import { Suspense } from "react";
import CreateArticlePage from "@/components/admin/Articles/CreateArticlePage";
import { Box, CircularProgress } from "@mui/material";

const NewArticlePage = () => {
  return (
    <Suspense 
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "linear-gradient(145deg, #0a0f1e 0%, #0f172a 50%, #1e293b 100%)",
          }}
        >
          <CircularProgress 
            size={60}
            sx={{ 
              color: "#8b5cf6",
              filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))"
            }} 
          />
        </Box>
      }
    >
      <CreateArticlePage />
    </Suspense>
  );
};

export default NewArticlePage;
