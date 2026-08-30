// import Image from "next/image";
"use client";
import { Typography } from "@mui/material";
import Profile from "@/components/admin/image/ImageComponent";
import Sidebar from "@/components/sidebar/SideBar";
import SliderForm from "@/components/dashboard/admin/slider/create/SliderForm"
export default function Home() {
  return (
    <>
      <Profile />
      <div style={{ textAlign: "center", margin: "30px" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontSize: "2.5rem",
            letterSpacing: "1px",
            lineHeight: "1.4",
            textTransform: "uppercase",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)", // Subtle text shadow for modern feel
            backgroundImage: "linear-gradient(45deg, #FF6F61, #FF8C00)", // Gradient effect
            backgroundClip: "text", // Make gradient fill text
            color: "transparent",
            display: "inline-block",
          }}
        >
          slider
        </Typography>
      </div>
       <SliderForm />;

      <Sidebar />
      {/* <AdminSidebar/> */}
    </>
  );
}
