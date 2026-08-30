"use client";

//import CurriculumEditor  from "@/components/CurriculumEditor/CurriculumEditor"
import { Box } from "@mui/material";
import Sidebar from "@/components/sidebar/SideBar";
import CateWithSubCate from "@/components/admin/catewithsubcate/CateWithSubCate";

const CourseCreate = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1c1c1c", // Exact dark background
      }}
    >
      <Sidebar />
      <CateWithSubCate />

      {/* <CurriculumEditor/> */}
    </Box>
  );
};
export default CourseCreate;
