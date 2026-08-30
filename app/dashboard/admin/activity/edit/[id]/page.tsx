"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Sidebar from "@/components/sidebar/SideBar";
import ActivityEditForm from "@/components/dashboard/admin/activity/edit/ActivityEditForm";
import { useParams, useRouter } from "next/navigation";
import { fetchActivityById, updateActivity } from "@/slice/activitySlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

const EditActivityPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState(null);
  const { loading: updateLoading } = useAppSelector((state) => state.activities);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchActivityById(id)).unwrap();
        setActivityData(data);
      } catch (error) {
        console.log("Failed to fetch activity");
        router.push("/dashboard/admin/activity/list");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateActivity({
          id,
          activityData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/activity/list");
    } catch (error) {
      console.log("Failed to update activity", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!activityData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Activity not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <div style={{ textAlign: "center", margin: "30px" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontSize: "2.5rem",
            letterSpacing: "1px",
            lineHeight: "1.4",
            textTransform: "uppercase",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
            backgroundImage: "linear-gradient(45deg, #FF6F61, #FF8C00)",
            backgroundClip: "text",
            color: "transparent",
            display: "inline-block",
          }}
        >
          Edit Activity
        </Typography>
      </div>
      <ActivityEditForm
        initialValues={activityData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/activity/list")}
        loading={updateLoading}
      />
      <Sidebar />
    </Box>
  );
};

export default EditActivityPage;
