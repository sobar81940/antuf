"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  CalendarMonth as CalendarMonthIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  EventBusy as EventBusyIcon,
  EventNote as EventNoteIcon,
  Image as ImageIcon,
  LocationOn as LocationOnIcon,
  Map as MapIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  Star as StarIcon,
} from "@mui/icons-material";

import Sidebar from "@/components/sidebar/SideBar";
import NepaliDatePicker from "@/components/admin/event-calendar/NepaliDatePicker";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const STATUS_META = {
  upcoming: { label: "आसन्न / Upcoming", bg: "#e8efff", color: "#2563eb" },
  ongoing: { label: "चलमान / Ongoing", bg: "#fff4e5", color: "#d97706" },
  completed: { label: "पूरा भएको / Completed", bg: "#e7f6ef", color: "#16a34a" },
  cancelled: { label: "रद्द / Cancelled", bg: "#fee9e9", color: "#dc2626" },
};

const CATEGORY_META = {
  workshop: { label: "कार्यशाला / Workshop", bg: "#e8efff", color: "#2563eb" },
  seminar: { label: "सेमिनार / Seminar", bg: "#f3ebff", color: "#7c3aed" },
  training: { label: "प्रशिक्षण / Training", bg: "#e0f7fa", color: "#0891b2" },
  conference: { label: "सम्मेलन / Conference", bg: "#e7f6ef", color: "#16a34a" },
  social: { label: "सामाजिक / Social", bg: "#fff4e5", color: "#d97706" },
  sports: { label: "खेलकुद / Sports", bg: "#fee9e9", color: "#dc2626" },
  cultural: { label: "सांस्कृतिक / Cultural", bg: "#fef3e2", color: "#ea580c" },
  other: { label: "अन्य / Other", bg: "#f1f5f9", color: "#475569" },
};

const EventCalendarAdmin = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "success" });
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
  });

  const [dialogTabIndex, setDialogTabIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    titleNepali: "",
    description: "",
    descriptionNepali: "",
    startDate: "",
    endDate: "",
    time: "",
    location: "",
    locationNepali: "",
    category: "other",
    image: "",
    capacity: "",
    organizer: {
      name: "",
      email: "",
      phone: "",
    },
    tags: "",
    status: "upcoming",
    isFeatured: false,
    isPublished: true,
  });

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterStatus, search, page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(filterCategory !== "all" && { category: filterCategory }),
        ...(filterStatus !== "all" && { status: filterStatus }),
      });

      const response = await fetch(`/api/admin/events?${params}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
        setTotalPages(data.pagination.pages);
        
        // Calculate stats
        const upcoming = data.data.filter((e: any) => e.status === "upcoming").length;
        const ongoing = data.data.filter((e: any) => e.status === "ongoing").length;
        const completed = data.data.filter((e: any) => e.status === "completed").length;

        setStats({
          total: data.pagination.total,
          upcoming,
          ongoing,
          completed,
        });
      } else {
        showSnackbar("Failed to load events", "error");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      showSnackbar("Error loading events", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (event: any = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        title: event.title || "",
        titleNepali: event.titleNepali || "",
        description: event.description || "",
        descriptionNepali: event.descriptionNepali || "",
        startDate: event.startDate ? new Date(event.startDate).toISOString().split("T")[0] : "",
        endDate: event.endDate ? new Date(event.endDate).toISOString().split("T")[0] : "",
        time: event.time || "",
        location: event.location || "",
        locationNepali: event.locationNepali || "",
        category: event.category || "other",
        image: event.image || "",
        capacity: event.capacity?.toString() || "",
        organizer: event.organizer || { name: "", email: "", phone: "" },
        tags: event.tags?.join(",") || "",
        status: event.status || "upcoming",
        isFeatured: event.isFeatured || false,
        isPublished: event.isPublished !== false,
      });
      setImagePreview(event.image || null);
      setImageFile(null);
      setLatitude("");
      setLongitude("");
      setMapUrl("");
    } else {
      setSelectedEvent(null);
      setFormData({
        title: "",
        titleNepali: "",
        description: "",
        descriptionNepali: "",
        startDate: "",
        endDate: "",
        time: "",
        location: "",
        locationNepali: "",
        category: "other",
        image: "",
        capacity: "",
        organizer: { name: "", email: "", phone: "" },
        tags: "",
        status: "upcoming",
        isFeatured: false,
        isPublished: true,
      });
      setImagePreview(null);
      setImageFile(null);
      setLatitude("");
      setLongitude("");
      setMapUrl("");
    }
    setDialogTabIndex(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrganizerChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      organizer: {
        ...prev.organizer,
        [field]: value,
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showSnackbar("Please select an image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("Image size must be less than 5MB", "error");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.secure_url || data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleLocationChange = () => {
    if (!latitude || !longitude) {
      showSnackbar("Please enter valid latitude and longitude", "error");
      return;
    }
    const url = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.9849453686277!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2z${latitude}N${longitude}E!5e0!3m2!1sen!2snp!4v1234567890`;
    setMapUrl(url);
    setFormData((prev) => ({
      ...prev,
      location: `${latitude}, ${longitude}`,
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.titleNepali || !formData.startDate || !formData.endDate) {
      showSnackbar("Please fill in all required fields", "warning");
      return;
    }

    try {
      setUpdating(true);
      const url = selectedEvent ? `/api/admin/events/${selectedEvent._id}` : "/api/admin/events";
      const method = selectedEvent ? "PATCH" : "POST";

      let imageUrl = formData.image;

      // Upload new image if provided
      if (imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
        } catch (error) {
          showSnackbar("Failed to upload image", "error");
          setUpdating(false);
          return;
        }
      }

      const payload = {
        ...formData,
        image: imageUrl,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showSnackbar(
          selectedEvent ? "Event updated successfully" : "Event created successfully",
          "success"
        );
        handleCloseDialog();
        setPage(1);
        fetchEvents();
      } else {
        showSnackbar(data.error || "Failed to save event", "error");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      showSnackbar("Error saving event", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        showSnackbar("Event deleted successfully", "success");
        fetchEvents();
      } else {
        showSnackbar(data.error || "Failed to delete event", "error");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      showSnackbar("Error deleting event", "error");
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <>
      <Sidebar />
      <Box
        sx={{
          width: { xs: "100%", sm: "calc(100% - 290px)" },
          ml: { xs: 0, sm: "290px" },
          minWidth: 0,
          minHeight: "100vh",
          px: { xs: 1.5, sm: 2.5, md: 4 },
          py: { xs: 2, md: 4 },
          background: "linear-gradient(145deg, #f6f8fc 0%, #eef2f7 100%)",
        }}
      >
        <Container maxWidth="xl" disableGutters>
          {/* Header */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#667eea",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  mb: 0.75,
                }}
              >
                Event Management
              </Typography>
              <Typography
                variant="h4"
                component="h1"
                fontWeight={750}
                sx={{ color: "#182230", fontSize: { xs: "1.65rem", sm: "2.15rem" } }}
              >
                Calendar Events
              </Typography>
              <Typography sx={{ color: "#667085", mt: 0.5, fontSize: "0.92rem" }}>
                Manage events for your organization
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: "#5267d8",
                borderRadius: "10px",
                px: 2.5,
                py: 1.2,
                "&:hover": {
                  background: "#4054c2",
                },
              }}
            >
              Add Event
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: "Total Events", value: stats.total, icon: EventNoteIcon, color: "#667eea" },
              { label: "Upcoming", value: stats.upcoming, icon: ScheduleIcon, color: "#2563eb" },
              { label: "Ongoing", value: stats.ongoing, icon: EventBusyIcon, color: "#d97706" },
              { label: "Completed", value: stats.completed, icon: CheckCircleIcon, color: "#16a34a" },
            ].map((stat, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    border: "1px solid #e1e7f0",
                    borderRadius: "14px",
                    boxShadow: "0 8px 28px rgba(31, 48, 75, 0.06)",
                    background: "white",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography sx={{ color: "#667085", fontSize: "0.85rem", fontWeight: 500, mb: 0.5 }}>
                          {stat.label}
                        </Typography>
                        <Typography sx={{ fontSize: "1.75rem", fontWeight: 700, color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <stat.icon sx={{ color: stat.color, fontSize: "2rem", opacity: 0.2 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Search and Filter */}
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: 3,
              border: "1px solid #e1e7f0",
              borderRadius: "14px",
              boxShadow: "0 8px 28px rgba(31, 48, 75, 0.06)",
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setPage(1);
                    }}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {Object.entries(CATEGORY_META).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setPage(1);
                    }}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    {Object.entries(STATUS_META).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Events Table */}
          <Paper sx={{ border: "1px solid #e1e7f0", borderRadius: "14px", boxShadow: "0 8px 28px rgba(31, 48, 75, 0.06)", overflow: "hidden" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ m: 2 }}>
                {error}
              </Alert>
            ) : events.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <EventNoteIcon sx={{ fontSize: "3rem", color: "#d1d5db", mb: 1 }} />
                <Typography sx={{ color: "#6b7280", fontSize: "1rem" }}>
                  No events found
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "#f9fafb" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151" }}>Registered</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#374151", textAlign: "center" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event: any) => (
                      <TableRow
                        key={event._id}
                        sx={{
                          "&:hover": { background: "#f9fafb" },
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography sx={{ fontWeight: 500, color: "#111827", fontSize: "0.9rem" }}>
                              {event.title}
                            </Typography>
                            <Typography sx={{ color: "#6b7280", fontSize: "0.85rem" }}>
                              {event.titleNepali}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CalendarMonthIcon sx={{ fontSize: "1rem", color: "#667eea" }} />
                            <Typography sx={{ fontSize: "0.9rem" }}>
                              {formatDate(event.startDate)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={CATEGORY_META[event.category]?.label || event.category}
                            size="small"
                            sx={{
                              background: CATEGORY_META[event.category]?.bg,
                              color: CATEGORY_META[event.category]?.color,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={STATUS_META[event.status]?.label || event.status}
                            size="small"
                            sx={{
                              background: STATUS_META[event.status]?.bg,
                              color: STATUS_META[event.status]?.color,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                            {event.registeredCount}/{event.capacity || "∞"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(event)}
                              sx={{ color: "#2563eb" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(event._id)}
                              sx={{ color: "#dc2626" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Enhanced Dialog with Tabs */}
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: "16px",
                backgroundImage: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              }
            }}
          >
            <DialogTitle sx={{ 
              fontWeight: 700, 
              fontSize: "1.35rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              py: 2.5,
            }}>
              {selectedEvent ? "✏️ Edit Event" : "🎉 Create New Event"}
            </DialogTitle>

            {/* Tabs */}
            <Box sx={{ borderBottom: "1px solid #e5e7eb" }}>
              <Tabs 
                value={dialogTabIndex} 
                onChange={(e, val) => setDialogTabIndex(val)}
                sx={{
                  px: 2,
                  "& .MuiTab-root": {
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "0.95rem",
                  },
                  "& .Mui-selected": {
                    color: "#667eea",
                  },
                  "& .MuiTabs-indicator": {
                    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  }
                }}
              >
                <Tab icon={<EventNoteIcon />} iconPosition="start" label="Event Details" />
                <Tab icon={<ImageIcon />} iconPosition="start" label="Media & Location" />
                <Tab icon={<ScheduleIcon />} iconPosition="start" label="Organizer Info" />
              </Tabs>
            </Box>

            <DialogContent sx={{ pt: 3 }}>
              {/* Tab 1: Event Details */}
              {dialogTabIndex === 0 && (
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#374151", display: "flex", alignItems: "center", gap: 1 }}>
                      <EventNoteIcon sx={{ fontSize: "1.2rem", color: "#667eea" }} />
                      Basic Information
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Event Title (English)"
                        fullWidth
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Annual Conference 2024"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            }
                          }
                        }}
                      />
                      <TextField
                        label="Event Title (Nepali)"
                        fullWidth
                        name="titleNepali"
                        value={formData.titleNepali}
                        onChange={handleInputChange}
                        placeholder="अनुगमन गरीब क्षेत्रमा"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            }
                          }
                        }}
                      />
                    </Stack>
                  </Box>

                  <Box sx={{ borderTop: "1px solid #e5e7eb", pt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#374151", display: "flex", alignItems: "center", gap: 1 }}>
                      <ScheduleIcon sx={{ fontSize: "1.2rem", color: "#667eea" }} />
                      Date & Time
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Start Date"
                          fullWidth
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="End Date"
                          fullWidth
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Time"
                          fullWidth
                          name="time"
                          type="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Capacity"
                          fullWidth
                          name="capacity"
                          type="number"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          placeholder="Maximum attendees"
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              }
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ borderTop: "1px solid #e5e7eb", pt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#374151", display: "flex", alignItems: "center", gap: 1 }}>
                      📝 Description
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Description (English)"
                        fullWidth
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        placeholder="Event description in English"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            }
                          }
                        }}
                      />
                      <TextField
                        label="Description (Nepali)"
                        fullWidth
                        name="descriptionNepali"
                        value={formData.descriptionNepali}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        placeholder="Event description in Nepali"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            }
                          }
                        }}
                      />
                    </Stack>
                  </Box>

                  <Box sx={{ borderTop: "1px solid #e5e7eb", pt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#374151", display: "flex", alignItems: "center", gap: 1 }}>
                      <StarIcon sx={{ fontSize: "1.2rem", color: "#667eea" }} />
                      Category & Status
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Category</InputLabel>
                          <Select
                            name="category"
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({ ...formData, category: e.target.value })
                            }
                            label="Category"
                            sx={{
                              borderRadius: "10px",
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              }
                            }}
                          >
                            {Object.entries(CATEGORY_META).map(([key, value]) => (
                              <MenuItem key={key} value={key}>
                                {value.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Status</InputLabel>
                          <Select
                            name="status"
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({ ...formData, status: e.target.value })
                            }
                            label="Status"
                            sx={{
                              borderRadius: "10px",
                              "&:hover fieldset": {
                                borderColor: "#667eea",
                              }
                            }}
                          >
                            {Object.entries(STATUS_META).map(([key, value]) => (
                              <MenuItem key={key} value={key}>
                                {value.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isFeatured}
                          onChange={(e) =>
                            setFormData({ ...formData, isFeatured: e.target.checked })
                          }
                        />
                      }
                      label="⭐ Featured Event"
                      sx={{ fontWeight: 500 }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isPublished}
                          onChange={(e) =>
                            setFormData({ ...formData, isPublished: e.target.checked })
                          }
                        />
                      }
                      label="🌐 Published"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </Stack>
              )}

              {/* Tab 2: Media & Location */}
              {dialogTabIndex === 1 && (
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#374151", display: "flex", alignItems: "center", gap: 1 }}>
                      <ImageIcon sx={{ fontSize: "1.2rem", color: "#667eea" }} />
                      Event Poster / Image
                    </Typography>
                    
                    <Paper 
                      sx={{
                        p: 2,
                        border: "2px dashed #667eea",
                        borderRadius: "12px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        background: imagePreview ? "transparent" : "#f9fafb",
                        "&:hover": {
                          borderColor: "#764ba2",
                          background: imagePreview ? "transparent" : "#f3f4f6",
                        }
                      }}
                      component="label"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                      
                      {imagePreview ? (
                        <Box>
                          <Box
                            component="img"
                            src={imagePreview}
                            alt="Preview"
                            sx={{
                              maxHeight: "250px",
                              maxWidth: "100%",
                              borderRadius: "8px",
                              mb: 1.5,
                              objectFit: "cover",
                            }}
                          />
                          <Button 
                            variant="text" 
                            size="small" 
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                          >
                            Remove Image
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <CloudUploadIcon sx={{ fontSize: "2.5rem", color: "#667eea", mb: 1 }} />
                          <Typography sx={{ fontWeight: 600, mb: 0.5, color: "#111827" }}>
                            Click to upload or drag and drop
                          </Typography>
                          <Typography sx={{ fontSize: "0.85rem", color: "#6b7280" }}>
                            PNG, JPG, GIF up to 5MB
                          </Typography>
                        </Box>
                      )}
                    </Paper>

                    <TextField
                      label="Or enter Image URL"
                      fullWidth
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      variant="outlined"
                      size="small"
                      sx={{
                        mt: 1.5,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          }
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ borderTop: "1px solid #e5e7eb", pt: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#374151", display: "flex", alignItems: "center", gap: 1 }}>
                      <MapIcon sx={{ fontSize: "1.2rem", color: "#667eea" }} />
                      Location Details
                    </Typography>

                    <Stack spacing={2}>
                      <TextField
                        label="Location (English)"
                        fullWidth
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Kathmandu Convention Center"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            }
                          }
                        }}
                      />
                      <TextField
                        label="Location (Nepali)"
                        fullWidth
                        name="locationNepali"
                        value={formData.locationNepali}
                        onChange={handleInputChange}
                        placeholder="काठमाडौं कन्वेन्शन सेन्टर"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            }
                          }
                        }}
                      />

                      <Box sx={{ borderTop: "1px solid #e5e7eb", pt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#374151", display: "flex", alignItems: "center", gap: 1 }}>
                          📍 Google Maps Coordinates
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Latitude"
                              fullWidth
                              type="number"
                              value={latitude}
                              onChange={(e) => setLatitude(e.target.value)}
                              placeholder="27.7172"
                              variant="outlined"
                              inputProps={{ step: "0.00001" }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "10px",
                                  "&:hover fieldset": {
                                    borderColor: "#667eea",
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Longitude"
                              fullWidth
                              type="number"
                              value={longitude}
                              onChange={(e) => setLongitude(e.target.value)}
                              placeholder="85.3240"
                              variant="outlined"
                              inputProps={{ step: "0.00001" }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "10px",
                                  "&:hover fieldset": {
                                    borderColor: "#667eea",
                                  }
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Button 
                          variant="contained" 
                          onClick={handleLocationChange}
                          fullWidth
                          sx={{
                            mt: 1.5,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          📍 Add Location to Map
                        </Button>
                      </Box>

                      {mapUrl && (
                        <Box sx={{ borderTop: "1px solid #e5e7eb", pt: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#374151" }}>
                            📍 Preview Map
                          </Typography>
                          <Box
                            component="iframe"
                            src={mapUrl}
                            style={{
                              width: "100%",
                              height: "300px",
                              border: "none",
                              borderRadius: "12px",
                            }}
                          />
                        </Box>
                      )}
                    </Stack>
                  </Box>

                  <TextField
                    label="Tags (comma-separated)"
                    fullWidth
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., technology, workshop, networking"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        "&:hover fieldset": {
                          borderColor: "#667eea",
                        }
                      }
                    }}
                  />
                </Stack>
              )}

              {/* Tab 3: Organizer Info */}
              {dialogTabIndex === 2 && (
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#374151", display: "flex", alignItems: "center", gap: 1 }}>
                      👤 Organizer Information
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Organizer Name"
                        fullWidth
                        value={formData.organizer.name}
                        onChange={(e) => handleOrganizerChange("name", e.target.value)}
                        placeholder="Full name of organizer"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            }
                          }
                        }}
                      />
                      <TextField
                        label="Organizer Email"
                        fullWidth
                        type="email"
                        value={formData.organizer.email}
                        onChange={(e) => handleOrganizerChange("email", e.target.value)}
                        placeholder="organizer@example.com"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            }
                          }
                        }}
                      />
                      <TextField
                        label="Organizer Phone"
                        fullWidth
                        value={formData.organizer.phone}
                        onChange={(e) => handleOrganizerChange("phone", e.target.value)}
                        placeholder="+977 1234567890"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            "&:hover fieldset": {
                              borderColor: "#667eea",
                            }
                          }
                        }}
                      />
                    </Stack>
                  </Box>

                  <Card sx={{
                    background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                  }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "#374151" }}>
                        💡 Tips:
                      </Typography>
                      <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.6 }}>
                        • Provide clear and complete information for better event visibility<br/>
                        • Include contact details for attendees to reach organizers<br/>
                        • Set accurate capacity limits for event management<br/>
                        • Add location coordinates for better map integration
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              )}
            </DialogContent>

            <DialogActions sx={{ 
              p: 2.5, 
              borderTop: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}>
              <Button 
                onClick={handleCloseDialog}
                sx={{ 
                  textTransform: "none", 
                  fontWeight: 600,
                  color: "#6b7280",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={updating}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                }}
              >
                {updating ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    Saving...
                  </Box>
                ) : selectedEvent ? "✏️ Update Event" : "🎉 Create Event"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </>
  );
};

export default EventCalendarAdmin;