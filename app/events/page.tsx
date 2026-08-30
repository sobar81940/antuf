"use client";

import React from "react";
import { Box } from "@mui/material";
import Navbar from "@/components/navbar/Navbar"
import Footer from "@/components/footer/Footer";
import EventCalendar from "@/components/event-calendar/EventCalendar";

export default function EventCalendarPage() {
  return (
    <Box>
      <Navbar />
      <EventCalendar />
      	<Footer />
    </Box>
  );
}
