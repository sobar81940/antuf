"use client";

import { ArrowBack, EventAvailable } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Container, Link, Typography } from "@mui/material";
import Sidebar from "@/components/sidebar/SideBar";
import ActivityForm from "@/components/dashboard/admin/activity/create/ActivityForm";
import { useRouter } from "next/navigation";

export default function CreateActivityPage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f7f8", color: "#183b3f" }}>
      <Sidebar />
      <Box component="main" sx={{ ml: { xs: 0, sm: "70px", md: "240px" }, px: { xs: 2, md: 5 }, py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg" disableGutters>
          <Breadcrumbs sx={{ mb: 3, color: "#678084" }}>
            <Link underline="hover" color="inherit" href="/dashboard/admin/activity/list">Activities</Link>
            <Typography color="#183b3f">New activity</Typography>
          </Breadcrumbs>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 4 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box sx={{ width: 52, height: 52, display: "grid", placeItems: "center", bgcolor: "#d9eee9", color: "#087f73", borderRadius: 2 }}>
                <EventAvailable />
              </Box>
              <Box>
                <Typography sx={{ color: "#087f73", fontSize: ".74rem", fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase" }}>Activity studio</Typography>
                <Typography component="h1" sx={{ fontSize: { xs: "1.8rem", md: "2.35rem" }, fontWeight: 850, lineHeight: 1.1 }}>Create an activity</Typography>
                <Typography sx={{ mt: .7, color: "#678084" }}>Share the work your organization is doing in the community.</Typography>
              </Box>
            </Box>
            <Button startIcon={<ArrowBack />} onClick={() => router.push("/dashboard/admin/activity/list")} sx={{ color: "#356168", whiteSpace: "nowrap" }}>
              Back to activities
            </Button>
          </Box>
          <ActivityForm />
        </Container>
      </Box>
    </Box>
  );
}
