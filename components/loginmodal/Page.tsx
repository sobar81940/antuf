"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import LoginModal from "@/components/loginmodal/Login";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="contained"
        sx={{
         
          backgroundColor: "red",
          "&:hover": {
            backgroundColor: "#005A4F",
          },
        }}
      >
        Sign In
      </Button>

      <LoginModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Home;
