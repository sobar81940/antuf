"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [filterCategory, filterStatus, searchTerm]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory !== "all") params.append("category", filterCategory);
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/events?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      workshop: "primary",
      seminar: "secondary",
      training: "info",
      conference: "success",
      social: "warning",
      sports: "error",
      cultural: "default",
      other: "default",
    };
    return colors[category] || "default";
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: "info",
      ongoing: "warning",
      completed: "success",
      cancelled: "error",
    };
    return colors[status] || "default";
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <EventNoteIcon fontSize="large" /> कार्यक्रम क्यालेन्डर
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Event Calendar | सभी आसन्न कार्यक्रमहरू देखिनुहोस्
          </Typography>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <TextField
            placeholder="कार्यक्रम खोज्नुहोस्..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "250px",
              bgcolor: "white",
              borderRadius: 1,
            }}
          />

          <FormControl sx={{ minWidth: 180, bgcolor: "white", borderRadius: 1 }}>
            <InputLabel>श्रेणी</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              label="श्रेणी"
            >
              <MenuItem value="all">सबै श्रेणी</MenuItem>
              <MenuItem value="workshop">कार्यशाला</MenuItem>
              <MenuItem value="seminar">सेमिनार</MenuItem>
              <MenuItem value="training">प्रशिक्षण</MenuItem>
              <MenuItem value="conference">सम्मेलन</MenuItem>
              <MenuItem value="social">सामाजिक</MenuItem>
              <MenuItem value="sports">खेलकुद</MenuItem>
              <MenuItem value="cultural">सांस्कृतिक</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180, bgcolor: "white", borderRadius: 1 }}>
            <InputLabel>स्थिति</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="स्थिति"
            >
              <MenuItem value="all">सबै स्थिति</MenuItem>
              <MenuItem value="upcoming">आसन्न</MenuItem>
              <MenuItem value="ongoing">चलमान</MenuItem>
              <MenuItem value="completed">पूरा भएको</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Events Grid */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : events.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" sx={{ color: "#999" }}>
              कुनै कार्यक्रम नभेटियो
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid
                key={event._id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4
                }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {event.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image}
                      alt={event.title}
                      sx={{ objectFit: "cover" }}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    {/* Status & Category Chips */}
                    <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                      <Chip
                        label={event.status}
                        size="small"
                        color={getStatusColor(event.status)}
                        variant="filled"
                      />
                      <Chip
                        label={event.category}
                        size="small"
                        color={getCategoryColor(event.category)}
                        variant="outlined"
                      />
                    </Box>

                    {/* Title */}
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 1 }}>
                      {event.titleNepali}
                    </Typography>

                    {/* Description */}
                    <Typography variant="body2" sx={{ color: "#666", mb: 2, minHeight: "40px" }}>
                      {event.description?.substring(0, 80)}...
                    </Typography>

                    {/* Event Details */}
                    <Stack spacing={0.5} sx={{ mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EventNoteIcon sx={{ fontSize: "18px", color: "#FF6B6B" }} />
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          {formatDate(event.startDate)}
                          {event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
                        </Typography>
                      </Box>

                      {event.time && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: "18px", color: "#FFE66D" }} />
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            {event.time}
                          </Typography>
                        </Box>
                      )}

                      {event.location && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOnIcon sx={{ fontSize: "18px", color: "#4CAF50" }} />
                          <Typography variant="body2" sx={{ color: "#333" }}>
                            {event.location}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    {/* Capacity Info */}
                    {event.capacity && (
                      <Typography variant="caption" sx={{ color: "#999" }}>
                        क्षमता: {event.registeredCount || 0} / {event.capacity}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default EventCalendar;
