"use client";
import EngagingCourseCard from "./EngagingCourseCard";
import VideoAndAudienceCard from "./VideoAndAudienceCard";
import Sidebar from "@/components/sidebar/SideBar";
import { Box } from "@mui/material";
const Page = () => {
  return (
     <>
      <Sidebar />
      <Box pl={18} mx="auto">
        <EngagingCourseCard />
        <VideoAndAudienceCard />
      </Box>
    </>
  )
};

export default Page;    

// http://localhost:3000/dashboard/admin/create/post