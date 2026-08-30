"use client";

import { Box } from "@mui/material";
import CategoryManager from "@/components/admin/categorymanager/CategoryManager";
import Sidebar from "@/components/sidebar/SideBar";

const CourseCreate = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, sm: 3, md: 4 } }}>
        <CategoryManager />
      </Box>
    </Box>
  );
};

export default CourseCreate;

