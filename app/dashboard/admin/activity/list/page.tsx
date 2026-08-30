"use client";

import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchActivities } from "@/slice/activitySlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar/SideBar";
import ActivityTable from "@/components/dashboard/admin/activity/list/ActivityTable";

const ActivitiesListPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { activities, loading, error } = useAppSelector(
    (state) => state.activities
  );

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Error loading activities: {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchActivities())}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/activity/edit/${id}`);
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
        <Typography
          variant="h5"
          component="h1"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            mt: 5,
          }}
        >
          Activities Management
        </Typography>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "red",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
            onClick={() => router.push("/dashboard/admin/activity/create")}
          >
            Add New Activity
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <ActivityTable activities={activities} onEdit={handleEdit} />
      )}
      <Sidebar />
    </Box>
  );
};

export default ActivitiesListPage;
