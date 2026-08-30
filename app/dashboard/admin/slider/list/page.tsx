"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import Sidebar from "@/components/sidebar/SideBar";
import SliderTable from "@/components/dashboard/admin/slider/list/SliderTable";
import SliderCreateModal from "@/components/dashboard/admin/slider/list/SliderCreateModal";
import { fetchSliders } from "@/slice/sliderSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

const SlidersPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sliders, loading, error } = useAppSelector((state) => state.sliders);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  const filteredSliders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sliders;
    return sliders.filter((slider) =>
      [slider.title, slider.sub_title, slider.short_description, slider.button_link]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [sliders, search]);

  const activeCount = sliders.filter((slider) => slider.status).length;
  const inactiveCount = sliders.length - activeCount;

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/slider/edit/${id}`);
  };

  const handleCreated = () => {
    setCreateOpen(false);
    dispatch(fetchSliders());
  };

  const stats = [
    {
      label: "Total Sliders",
      value: sliders.length,
      icon: <ImageIcon sx={{ color: "#fff" }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      label: "Active Sliders",
      value: activeCount,
      icon: <CheckCircleIcon sx={{ color: "#fff" }} />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      label: "Inactive Sliders",
      value: inactiveCount,
      icon: <CancelIcon sx={{ color: "#fff" }} />,
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    },
  ];

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "calc(100% - 290px)" },
        ml: { xs: 0, sm: "290px" },
        minWidth: 0,
        minHeight: "100vh",
        bgcolor: "#f4f7fb",
        px: { xs: 1.5, sm: 3, md: 4 },
        pb: 5,
        pt: { xs: 8, sm: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#182230", letterSpacing: "-0.02em" }}>
            Sliders Management
          </Typography>
          <Typography sx={{ color: "#667085", mt: 0.5 }}>
            Create and manage the banners displayed on your homepage.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{
            background: "linear-gradient(135deg, #ff0000 0%, #cc0000 100%)",
            fontWeight: 700,
            textTransform: "none",
            px: 3,
            py: 1.2,
            borderRadius: 2,
            boxShadow: "0 8px 20px rgba(255, 0, 0, 0.25)",
            "&:hover": {
              background: "linear-gradient(135deg, #e60000 0%, #b30000 100%)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Add New Slider
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                background: stat.gradient,
                boxShadow: "0 8px 24px rgba(16, 24, 40, 0.10)",
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(255,255,255,0.22)",
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography sx={{ color: "rgba(255,255,255,0.88)", fontSize: 14, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <TextField
          size="small"
          placeholder="Search sliders by title or description..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{
            width: { xs: "100%", sm: 380 },
            bgcolor: "#fff",
            borderRadius: 2,
            "& fieldset": { borderColor: "transparent" },
            boxShadow: "0 1px 4px rgba(16,24,40,0.06)",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#98a2b3" }} />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <Button
                  size="small"
                  sx={{ minWidth: 0, p: 0.5, color: "#98a2b3" }}
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </Button>
              </InputAdornment>
            ) : null,
          }}
        />
        {search && (
          <Typography variant="body2" sx={{ color: "#667085" }}>
            {filteredSliders.length} result{filteredSliders.length === 1 ? "" : "s"} for &quot;{search}&quot;
          </Typography>
        )}
      </Box>

      {/* Error / Loading / Table */}
      {error ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 10 }}>
          <Alert severity="error" sx={{ maxWidth: 480, width: "100%" }}>
            Error loading sliders: {error}
          </Alert>
          <Button variant="contained" endIcon={<RefreshIcon />} onClick={() => dispatch(fetchSliders())}>
            Retry
          </Button>
        </Box>
      ) : loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress sx={{ color: "#667eea" }} />
        </Box>
      ) : (
        <SliderTable sliders={filteredSliders} onEdit={handleEdit} />
      )}

      {/* Add New Slider popup form */}
      <SliderCreateModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={handleCreated} />

      <Sidebar />
    </Box>
  );
};

export default SlidersPage;