// app/dashboard/sliders/page.jsx
"use client";
import SliderTable from "@/components/dashboard/admin/video/list/videoTable";

import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchSliders } from "@/slice/sliderSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useRouter } from "next/navigation";
 import Sidebar from "@/components/sidebar/SideBar";   
    

const SlidersPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sliders, loading, error } = useAppSelector((state) => state.sliders);

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  if (error) {
    console.error('Error loading sliders:', error);
  }

 

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/slider/edit/${id}`);
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "calc(100% - 290px)" },
        ml: { xs: 0, sm: "290px" },
        minWidth: 0,
        minHeight: "100vh",
        px: { xs: 1, sm: 2, md: 3 },
        pb: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          
          gap: 2,
          width: "100%",
        }}
      >
       
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          Loading...
        </Box>
      ) : (
        // VideoManager manages its own data/editing; it takes no props.
        <SliderTable />
      )}
      <Sidebar />
    </Box>
  );
};

export default SlidersPage;