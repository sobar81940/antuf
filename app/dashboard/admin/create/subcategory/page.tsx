"use client";

//import CurriculumEditor  from "@/components/CurriculumEditor/CurriculumEditor"
import { Box } from "@mui/material";
import SubCategoryManager from "@/components/admin/subcategorymanager/SubCategoryManager";
import Sidebar from "@/components/sidebar/SideBar";

const CourseCreate = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1c1c1c", // Exact dark background
      }}
    >
      <Sidebar />

      <SubCategoryManager />

      {/* <CurriculumEditor/> */}
    </Box>
  );
};
export default CourseCreate;
