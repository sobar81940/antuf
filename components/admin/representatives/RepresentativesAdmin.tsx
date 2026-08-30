"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    CardActions,
    Avatar,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Alert,
    Snackbar,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    InputAdornment,
    Pagination,
    Tooltip,
} from "@mui/material";
import Sidebar from "@/components/sidebar/SideBar";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    CloudUpload as UploadIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Close as CloseIcon,
} from "@mui/icons-material";

const POSITIONS_NEPALI = [
    "अध्यक्ष",
    "वरिष्ठ उपाध्यक्ष",
    "उपाध्यक्ष",
    "महासचिव",
    "उपमहासचिव",
    "सचिव",
    "कोषाध्यक्ष",
    "सदस्य",
    "अन्य",
];

const POSITIONS_ENGLISH = [
    "President",
    "Senior Vice President",
    "Vice President",
    "General Secretary",
    "Deputy General Secretary",
    "Secretary",
    "Treasurer",
    "Member",
    "Other",
];

const POSITION_MAP = {
    "अध्यक्ष": "President",
    "वरिष्ठ उपाध्यक्ष": "Senior Vice President",
    "उपाध्यक्ष": "Vice President",
    "महासचिव": "General Secretary",
    "उपमहासचिव": "Deputy General Secretary",
    "सचिव": "Secretary",
    "कोषाध्यक्ष": "Treasurer",
    "सदस्य": "Member",
    "अन्य": "Other",
};

export default function RepresentativesAdmin() {
    const [representatives, setRepresentatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedRep, setSelectedRep] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterActive, setFilterActive] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "warning" | "info";
    }>({ open: false, message: "", severity: "success" });
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        nameEn: "",
        position: "",
        positionEn: "",
        email: "",
        phone: "",
        location: "काठमाडौं",
        locationEn: "Kathmandu",
        image: "",
        bio: "",
        bioEn: "",
        website: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        displayOrder: 0,
        isActive: true,
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchRepresentatives();
    }, [page, limit, searchQuery, filterActive]);

    const fetchRepresentatives = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });

            if (searchQuery) params.append("search", searchQuery);
            if (filterActive !== "") params.append("isActive", filterActive);

            const response = await fetch(`/api/admin/representatives?${params}`);
            const data = await response.json();

            if (data.success) {
                setRepresentatives(data.data);
                setTotalPages(data.pagination.totalPages);
            } else {
                showSnackbar("Failed to fetch representatives", "error");
            }
        } catch (error) {
            console.error("Error fetching representatives:", error);
            showSnackbar("Error fetching representatives", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (rep = null) => {
        if (rep) {
            setSelectedRep(rep);
            setFormData({
                name: rep.name || "",
                nameEn: rep.nameEn || "",
                position: rep.position || "",
                positionEn: rep.positionEn || "",
                email: rep.email || "",
                phone: rep.phone || "",
                location: rep.location || "काठमाडौं",
                locationEn: rep.locationEn || "Kathmandu",
                image: rep.image || "",
                bio: rep.bio || "",
                bioEn: rep.bioEn || "",
                website: rep.website || "",
                facebook: rep.facebook || "",
                twitter: rep.twitter || "",
                linkedin: rep.linkedin || "",
                instagram: rep.instagram || "",
                displayOrder: rep.displayOrder || 0,
                isActive: rep.isActive !== undefined ? rep.isActive : true,
            });
        } else {
            setSelectedRep(null);
            setFormData({
                name: "",
                nameEn: "",
                position: "",
                positionEn: "",
                email: "",
                phone: "",
                location: "काठमाडौं",
                locationEn: "Kathmandu",
                image: "",
                bio: "",
                bioEn: "",
                website: "",
                facebook: "",
                twitter: "",
                linkedin: "",
                instagram: "",
                displayOrder: 0,
                isActive: true,
            });
        }
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRep(null);
        setFormData({
            name: "",
            nameEn: "",
            position: "",
            positionEn: "",
            email: "",
            phone: "",
            location: "काठमाडौं",
            locationEn: "Kathmandu",
            image: "",
            bio: "",
            bioEn: "",
            website: "",
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: "",
            displayOrder: 0,
            isActive: true,
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) errors.name = "Name in Nepali is required";
        if (!formData.nameEn.trim()) errors.nameEn = "Name in English is required";
        if (!formData.position) errors.position = "Position in Nepali is required";
        if (!formData.positionEn) errors.positionEn = "Position in English is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
        if (!formData.phone.trim()) errors.phone = "Phone number is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            showSnackbar("Please fix form errors", "error");
            return;
        }

        try {
            const url = selectedRep
                ? `/api/admin/representatives/${selectedRep._id}`
                : "/api/admin/representatives";

            const method = selectedRep ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                showSnackbar(
                    selectedRep
                        ? "Representative updated successfully"
                        : "Representative created successfully",
                    "success"
                );
                handleCloseDialog();
                fetchRepresentatives();
            } else {
                showSnackbar(data.error || "Failed to save representative", "error");
            }
        } catch (error) {
            console.error("Error saving representative:", error);
            showSnackbar("Error saving representative", "error");
        }
    };

    const handleDelete = async () => {
        if (!selectedRep) return;

        try {
            const response = await fetch(`/api/admin/representatives/${selectedRep._id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                showSnackbar("Representative deleted successfully", "success");
                setDeleteDialog(false);
                setSelectedRep(null);
                fetchRepresentatives();
            } else {
                showSnackbar(data.error || "Failed to delete representative", "error");
            }
        } catch (error) {
            console.error("Error deleting representative:", error);
            showSnackbar("Error deleting representative", "error");
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            showSnackbar("Please select an image file", "error");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showSnackbar("Image size should be less than 5MB", "error");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "antuf/representatives");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success && data.url) {
                setFormData((prev) => ({ ...prev, image: data.url }));
                showSnackbar("Image uploaded successfully", "success");
            } else {
                showSnackbar(data.error || "Failed to upload image", "error");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            showSnackbar(error.message || "Error uploading image", "error");
        } finally {
            setUploading(false);
        }
    };

    const handlePositionChange = (nepaliPosition) => {
        setFormData((prev) => ({
            ...prev,
            position: nepaliPosition,
            positionEn: POSITION_MAP[nepaliPosition] || "",
        }));
    };

    const showSnackbar = (
        message: string,
        severity: "success" | "error" | "warning" | "info" = "success"
    ) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
                <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                    <Box>
                        <Typography sx={{ color: "#667eea", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", mb: 0.75 }}>
                            Organization directory
                        </Typography>
                        <Typography variant="h4" component="h1" fontWeight={750} sx={{ color: "#182230", fontSize: { xs: "1.65rem", sm: "2.15rem" } }}>
                            Representatives
                        </Typography>
                        <Typography sx={{ color: "#667085", mt: 0.5, fontSize: "0.92rem" }}>
                            Manage public-facing leadership profiles and contact details.
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
                        Add Representative
                    </Button>
                </Box>

                {/* Filters */}
                <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3, border: "1px solid #e1e7f0", borderRadius: "14px", boxShadow: "0 8px 28px rgba(31, 48, 75, 0.06)" }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid
                            size={{
                                xs: 12,
                                md: 6
                            }}>
                            <TextField
                                fullWidth
                                placeholder="Search by name, position, or email..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid
                            size={{
                                xs: 12,
                                md: 3
                            }}>
                            <FormControl fullWidth>
                                <InputLabel>Filter by Status</InputLabel>
                                <Select
                                    value={filterActive}
                                    label="Filter by Status"
                                    onChange={(e) => {
                                        setFilterActive(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="true">Active</MenuItem>
                                    <MenuItem value="false">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid
                            size={{
                                xs: 12,
                                md: 3
                            }}>
                            <FormControl fullWidth>
                                <InputLabel>Per Page</InputLabel>
                                <Select
                                    value={limit}
                                    label="Per Page"
                                    onChange={(e) => {
                                        setLimit(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Representatives Table */}
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : representatives.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: "center" }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No representatives found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {searchQuery || filterActive
                                ? "Try adjusting your filters"
                                : "Click 'Add Representative' to create your first representative"}
                        </Typography>
                        {!searchQuery && !filterActive && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog()}
                                sx={{
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                }}
                            >
                                Add Representative
                            </Button>
                        )}
                    </Paper>
                ) : (
                    <>
                        <TableContainer component={Paper} sx={{ overflowX: "auto", border: "1px solid #e1e7f0", borderRadius: "14px", boxShadow: "0 8px 28px rgba(31, 48, 75, 0.06)" }}>
                            <Table sx={{ minWidth: 760 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#eef1ff" }}>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Position</TableCell>
                                        <TableCell>Contact</TableCell>
                                        <TableCell align="center">Order</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {representatives.map((rep) => (
                                        <TableRow key={rep._id} hover>
                                            <TableCell sx={{ py: 1.5 }}>
                                                <Avatar
                                                    src={rep.image}
                                                    alt={rep.name}
                                                    sx={{ width: 50, height: 50 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {rep.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {rep.nameEn}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{rep.position}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {rep.positionEn}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{rep.email}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {rep.phone}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={rep.displayOrder} size="small" />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={rep.isActive ? "Active" : "Inactive"}
                                                    color={rep.isActive ? "success" : "default"}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleOpenDialog(rep)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => {
                                                            setSelectedRep(rep);
                                                            setDeleteDialog(true);
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(e, value) => setPage(value)}
                                color="primary"
                            />
                        </Box>
                    </>
                )}

                {/* Add/Edit Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6">
                                {selectedRep ? "Edit Representative" : "Add New Representative"}
                            </Typography>
                            <IconButton onClick={handleCloseDialog}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            {/* Image Upload */}
                            <Grid size={12}>
                                <Box sx={{ textAlign: "center", mb: 2 }}>
                                    <Avatar
                                        src={formData.image}
                                        sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                                    />
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
                                        disabled={uploading}
                                    >
                                        {uploading ? "Uploading..." : "Upload Image"}
                                        <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                    </Button>
                                </Box>
                            </Grid>

                            {/* Name Fields */}
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Name (Nepali) *"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    error={!!formErrors.name}
                                    helperText={formErrors.name}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Name (English) *"
                                    value={formData.nameEn}
                                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                    error={!!formErrors.nameEn}
                                    helperText={formErrors.nameEn}
                                />
                            </Grid>

                            {/* Position Fields */}
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <FormControl fullWidth error={!!formErrors.position}>
                                    <InputLabel>Position (Nepali) *</InputLabel>
                                    <Select
                                        value={formData.position}
                                        label="Position (Nepali) *"
                                        onChange={(e) => handlePositionChange(e.target.value)}
                                    >
                                        {POSITIONS_NEPALI.map((pos) => (
                                            <MenuItem key={pos} value={pos}>
                                                {pos}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formErrors.position && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {formErrors.position}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Position (English) *"
                                    value={formData.positionEn}
                                    onChange={(e) => setFormData({ ...formData, positionEn: e.target.value })}
                                    error={!!formErrors.positionEn}
                                    helperText={formErrors.positionEn || "Auto-filled based on Nepali position"}
                                />
                            </Grid>

                            {/* Contact Fields */}
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Email *"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Phone *"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    error={!!formErrors.phone}
                                    helperText={formErrors.phone}
                                />
                            </Grid>

                            {/* Location Fields */}
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Location (Nepali)"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Location (English)"
                                    value={formData.locationEn}
                                    onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                                />
                            </Grid>

                            {/* Bio Fields */}
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Bio (Nepali)"
                                    multiline
                                    rows={3}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    inputProps={{ maxLength: 500 }}
                                    helperText={`${formData.bio.length}/500 characters`}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Bio (English)"
                                    multiline
                                    rows={3}
                                    value={formData.bioEn}
                                    onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                                    inputProps={{ maxLength: 500 }}
                                    helperText={`${formData.bioEn.length}/500 characters`}
                                />
                            </Grid>

                            {/* Social Media and Website Fields */}
                            <Grid size={12}>
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                                    Social Media & Website
                                </Typography>
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Website"
                                    placeholder="https://example.com"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Facebook"
                                    placeholder="https://facebook.com/username"
                                    value={formData.facebook}
                                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Twitter"
                                    placeholder="https://twitter.com/username"
                                    value={formData.twitter}
                                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="LinkedIn"
                                    placeholder="https://linkedin.com/in/username"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Instagram"
                                    placeholder="https://instagram.com/username"
                                    value={formData.instagram}
                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                />
                            </Grid>

                            {/* Display Order and Active Status */}
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Display Order"
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) =>
                                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                                    }
                                    helperText="Lower numbers appear first"
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                    }
                                    label="Active (Show on public pages)"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {selectedRep ? "Update" : "Create"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete {selectedRep?.name}? This action will mark the
                            representative as inactive.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={handleDelete} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
            </Box>
        </>
    );
}
