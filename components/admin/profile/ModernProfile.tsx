"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Avatar,
    Typography,
    Alert,
    Chip,
    IconButton,
    Divider,
    LinearProgress,
    Paper,
    Stack,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import {
    CloudUpload as CloudUploadIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    Lock as LockIcon,
    Verified as VerifiedIcon,
    AccessTime as AccessTimeIcon,
    CalendarToday as CalendarIcon,
    Work as WorkIcon,
    LocationOn as LocationIcon,
    Map as MapIcon,
    Home as HomeIcon,
    Wc as GenderIcon,
    FamilyRestroom as FamilyIcon,
    Badge as BadgeIcon,
    CardMembership as MembershipIcon,
    ContactPhone as ContactPhoneIcon,
    Cake as BirthdayIcon,
} from "@mui/icons-material";

export default function ModernProfile() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        nameNepali: "",
        email: "",
        phone: "",
        gender: "",
        dobNepali: "",
        organization: "",
        occupation: "",
        position: "",
        workplace: "",
        // Family Information
        motherName: "",
        fatherName: "",
        grandfatherName: "",
        spouseName: "",
        // Citizenship Information
        citizenshipNumber: "",
        citizenshipIssuedDistrict: "",
        citizenshipIssuedDate: "",
        // Union Information
        unionName: "",
        membershipNumber: "",
        joinDate: "",
        // Emergency Contact
        emergencyContact: "",
        emergencyPhone: "",
        // Permanent Address
        permanentProvince: "",
        permanentDistrict: "",
        permanentMunicipality: "",
        permanentWardNo: "",
        permanentAddress: "",
        // Temporary Address
        temporaryProvince: "",
        temporaryDistrict: "",
        temporaryMunicipality: "",
        temporaryWardNo: "",
        temporaryAddress: "",
        bio: "",
        password: "",
        confirmPassword: "",
    });

    // User status information
    const [userStatus, setUserStatus] = useState({
        role: "",
        emailVerified: false,
        isVerified: false,
        lastLogin: null,
        createdAt: null,
        image: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverMessage, setServerMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState("");

    // Citizenship Images
    const [citizenshipFrontImage, setCitizenshipFrontImage] = useState(null);
    const [citizenshipFrontPreview, setCitizenshipFrontPreview] = useState("");
    const [citizenshipBackImage, setCitizenshipBackImage] = useState(null);
    const [citizenshipBackPreview, setCitizenshipBackPreview] = useState("");

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/profile`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();

            setFormData({
                name: data?.name || "",
                nameNepali: data?.nameNepali || "",
                email: data?.email || "",
                phone: data?.phone || "",
                gender: data?.gender || "",
                dobNepali: data?.dobNepali || "",
                organization: data?.organization || "",
                occupation: data?.occupation || "",
                position: data?.position || "",
                workplace: data?.workplace || "",
                // Family Information
                motherName: data?.motherName || "",
                fatherName: data?.fatherName || "",
                grandfatherName: data?.grandfatherName || "",
                spouseName: data?.spouseName || "",
                // Citizenship Information
                citizenshipNumber: data?.citizenshipNumber || "",
                citizenshipIssuedDistrict: data?.citizenship?.issuedDistrict || "",
                citizenshipIssuedDate: data?.citizenship?.issuedDate || "",
                // Union Information
                unionName: data?.unionName || "",
                membershipNumber: data?.membershipNumber || "",
                joinDate: data?.joinDate ? new Date(data.joinDate).toISOString().split('T')[0] : "",
                // Emergency Contact
                emergencyContact: data?.emergencyContact || "",
                emergencyPhone: data?.emergencyPhone || "",
                // Permanent Address - Try addresses array first, then legacy fields
                permanentProvince:
                    data?.addresses?.find(addr => addr.type === 'permanent')?.province ||
                    data?.permanentProvince || "",
                permanentDistrict:
                    data?.addresses?.find(addr => addr.type === 'permanent')?.district ||
                    data?.permanentDistrict || "",
                permanentMunicipality:
                    data?.addresses?.find(addr => addr.type === 'permanent')?.municipality ||
                    data?.permanentMunicipality || "",
                permanentWardNo:
                    data?.addresses?.find(addr => addr.type === 'permanent')?.wardNo ||
                    data?.permanentWardNo || "",
                permanentAddress:
                    data?.addresses?.find(addr => addr.type === 'permanent')?.tole ||
                    data?.permanentAddress || "",
                // Temporary Address - Try addresses array first, then legacy fields
                temporaryProvince:
                    data?.addresses?.find(addr => addr.type === 'temporary')?.province ||
                    data?.temporaryProvince || "",
                temporaryDistrict:
                    data?.addresses?.find(addr => addr.type === 'temporary')?.district ||
                    data?.temporaryDistrict || "",
                temporaryMunicipality:
                    data?.addresses?.find(addr => addr.type === 'temporary')?.municipality ||
                    data?.temporaryMunicipality || "",
                temporaryWardNo:
                    data?.addresses?.find(addr => addr.type === 'temporary')?.wardNo ||
                    data?.temporaryWardNo || "",
                temporaryAddress:
                    data?.addresses?.find(addr => addr.type === 'temporary')?.tole ||
                    data?.temporaryAddress || "",
                bio: data?.bio || "",
                password: "",
                confirmPassword: "",
            });

            setProfileImagePreview(data?.image || "");
            setCitizenshipFrontPreview(data?.citizenship?.frontImage || data?.citizenshipFront || "");
            setCitizenshipBackPreview(data?.citizenship?.backImage || data?.citizenshipBack || "");

            setUserStatus({
                role: data?.role || "",
                emailVerified: data?.emailVerified || false,
                isVerified: data?.isVerified || false,
                lastLogin: data?.lastLogin || null,
                createdAt: data?.createdAt || null,
                image: data?.image || "",
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            setServerMessage("Failed to load profile data");
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        // Clear error for this field
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCitizenshipFrontChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCitizenshipFrontImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCitizenshipFrontPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCitizenshipBackChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCitizenshipBackImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCitizenshipBackPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };



    const uploadImageToCloudinary = async (image) => {
        try {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("folder", "antuf/profiles");

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success && data.url) {
                return data.url;
            } else {
                throw new Error(data.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };



    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (formData.password) {
            if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            }
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            let imageUrl = userStatus.image;
            let citizenshipFrontUrl = citizenshipFrontPreview;
            let citizenshipBackUrl = citizenshipBackPreview;

            // Upload new profile image if selected
            if (profileImage) {
                setUploadingImage(true);
                imageUrl = await uploadImageToCloudinary(profileImage);
                setUploadingImage(false);
            }

            // Upload citizenship front image if selected
            if (citizenshipFrontImage) {
                setUploadingImage(true);
                citizenshipFrontUrl = await uploadImageToCloudinary(citizenshipFrontImage);
                setUploadingImage(false);
            }

            // Upload citizenship back image if selected
            if (citizenshipBackImage) {
                setUploadingImage(true);
                citizenshipBackUrl = await uploadImageToCloudinary(citizenshipBackImage);
                setUploadingImage(false);
            }

            const requestBody: Record<string, any> = {
                name: formData.name,
                nameNepali: formData.nameNepali,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender,
                dobNepali: formData.dobNepali,
                organization: formData.organization,
                occupation: formData.occupation,
                position: formData.position,
                workplace: formData.workplace,
                // Family Information
                motherName: formData.motherName,
                fatherName: formData.fatherName,
                grandfatherName: formData.grandfatherName,
                spouseName: formData.spouseName,
                // Citizenship Information
                citizenshipNumber: formData.citizenshipNumber,
                citizenshipFront: citizenshipFrontUrl,
                citizenshipBack: citizenshipBackUrl,
                citizenship: {
                    number: formData.citizenshipNumber,
                    issuedDistrict: formData.citizenshipIssuedDistrict,
                    issuedDate: formData.citizenshipIssuedDate,
                    frontImage: citizenshipFrontUrl,
                    backImage: citizenshipBackUrl,
                },
                // Union Information
                unionName: formData.unionName,
                membershipNumber: formData.membershipNumber,
                joinDate: formData.joinDate,
                // Emergency Contact
                emergencyContact: formData.emergencyContact,
                emergencyPhone: formData.emergencyPhone,
                // Permanent Address
                permanentProvince: formData.permanentProvince,
                permanentDistrict: formData.permanentDistrict,
                permanentMunicipality: formData.permanentMunicipality,
                permanentWardNo: formData.permanentWardNo,
                permanentAddress: formData.permanentAddress,
                // Temporary Address
                temporaryProvince: formData.temporaryProvince,
                temporaryDistrict: formData.temporaryDistrict,
                temporaryMunicipality: formData.temporaryMunicipality,
                temporaryWardNo: formData.temporaryWardNo,
                temporaryAddress: formData.temporaryAddress,
                bio: formData.bio,
                profileImage: imageUrl,
            };

            // Only include password if it was changed
            if (formData.password) {
                requestBody.password = formData.password;
            }

            const response = await fetch(`/api/admin/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                setIsSuccess(false);
                setServerMessage(data?.err || "Failed to update profile");
            } else {
                setIsSuccess(true);
                setServerMessage(data?.msg || "Profile updated successfully!");
                setFormData({ ...formData, password: "", confirmPassword: "" });
                setProfileImage(null);
                setCitizenshipFrontImage(null);
                setCitizenshipBackImage(null);
                setIsEditing(false);
                // Refresh user data
                fetchUserData();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setIsSuccess(false);
            setServerMessage("An error occurred while updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setErrors({});
        setServerMessage("");
        fetchUserData();
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafb", py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#1f2937", mb: 1 }}>
                        Profile Settings
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#6b7280" }}>
                        Manage your account information and preferences
                    </Typography>
                </Box>

                {serverMessage && (
                    <Alert
                        severity={isSuccess ? "success" : "error"}
                        sx={{ mb: 3 }}
                        onClose={() => setServerMessage("")}
                    >
                        {serverMessage}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Left Column - Profile Card */}
                    <Grid
                        size={{
                            xs: 12,
                            md: 4
                        }}>
                        <Card
                            sx={{
                                position: "sticky",
                                top: 20,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                            }}
                        >
                            <CardContent sx={{ textAlign: "center", p: 4 }}>
                                <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                                    <Avatar
                                        src={profileImagePreview}
                                        sx={{
                                            width: 150,
                                            height: 150,
                                            border: "4px solid rgba(255,255,255,0.3)",
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                                        }}
                                    />
                                    {isEditing && (
                                        <IconButton
                                            component="label"
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                bgcolor: "white",
                                                color: "#667eea",
                                                "&:hover": { bgcolor: "#f3f4f6" },
                                                boxShadow: 2,
                                            }}
                                        >
                                            <CloudUploadIcon />
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </IconButton>
                                    )}
                                </Box>

                                {uploadingImage && (
                                    <Box sx={{ mb: 2 }}>
                                        <LinearProgress sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                                        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                                            Uploading image...
                                        </Typography>
                                    </Box>
                                )}

                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    {formData.name || "User Name"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mb: 1 }}>
                                    {formData.email}
                                </Typography>

                                <Chip
                                    icon={<VerifiedIcon />}
                                    label={userStatus.role.toUpperCase()}
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.2)",
                                        color: "white",
                                        fontWeight: 700,
                                        mb: 3,
                                    }}
                                />

                                <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 3 }} />

                                {/* Status Chips */}
                                <Stack spacing={1.5}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <EmailIcon sx={{ fontSize: 18 }} />
                                            <Typography variant="body2">Email Verified</Typography>
                                        </Box>
                                        {userStatus.emailVerified ? (
                                            <CheckCircleIcon sx={{ color: "#10b981" }} />
                                        ) : (
                                            <CancelIcon sx={{ color: "#ef4444" }} />
                                        )}
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <VerifiedIcon sx={{ fontSize: 18 }} />
                                            <Typography variant="body2">Account Verified</Typography>
                                        </Box>
                                        {userStatus.isVerified ? (
                                            <CheckCircleIcon sx={{ color: "#10b981" }} />
                                        ) : (
                                            <CancelIcon sx={{ color: "#ef4444" }} />
                                        )}
                                    </Box>

                                    {userStatus.lastLogin && (
                                        <>
                                            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 1 }} />
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <AccessTimeIcon sx={{ fontSize: 18 }} />
                                                <Box sx={{ textAlign: "left", flex: 1 }}>
                                                    <Typography variant="caption" sx={{ display: "block", opacity: 0.8 }}>
                                                        Last Login
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {new Date(userStatus.lastLogin).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </>
                                    )}

                                    {userStatus.createdAt && (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <CalendarIcon sx={{ fontSize: 18 }} />
                                            <Box sx={{ textAlign: "left", flex: 1 }}>
                                                <Typography variant="caption" sx={{ display: "block", opacity: 0.8 }}>
                                                    Member Since
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {new Date(userStatus.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column - Profile Form */}
                    <Grid
                        size={{
                            xs: 12,
                            md: 8
                        }}>
                        <Stack spacing={3}>
                            {/* Personal Information Card */}
                            <Card elevation={2}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: 1 }}>
                                                <PersonIcon sx={{ color: "#667eea" }} />
                                                Personal Information
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                                Basic personal details and contact information
                                            </Typography>
                                        </Box>
                                        {!isEditing && (
                                            <IconButton
                                                onClick={() => setIsEditing(true)}
                                                sx={{
                                                    bgcolor: "#f3f4f6",
                                                    "&:hover": { bgcolor: "#e5e7eb" },
                                                }}
                                            >
                                                <EditIcon sx={{ fontSize: 20 }} />
                                            </IconButton>
                                        )}
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Full Name (English)"
                                                value={formData.name}
                                                onChange={handleInputChange("name")}
                                                disabled={!isEditing}
                                                error={!!errors.name}
                                                helperText={errors.name}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Full Name (Nepali)"
                                                value={formData.nameNepali}
                                                onChange={handleInputChange("nameNepali")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Email Address"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange("email")}
                                                disabled={!isEditing}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Phone Number"
                                                value={formData.phone}
                                                onChange={handleInputChange("phone")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <FormControl fullWidth size="small" disabled={!isEditing}>
                                                <InputLabel>Gender</InputLabel>
                                                <Select
                                                    value={formData.gender}
                                                    label="Gender"
                                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                >
                                                    <MenuItem value=""><em>Select Gender</em></MenuItem>
                                                    <MenuItem value="male">Male</MenuItem>
                                                    <MenuItem value="female">Female</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Organization"
                                                value={formData.organization}
                                                onChange={handleInputChange("organization")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Date of Birth (BS)"
                                                value={formData.dobNepali}
                                                onChange={handleInputChange("dobNepali")}
                                                disabled={!isEditing}
                                                placeholder="YYYY-MM-DD"
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Bio / Description"
                                                multiline
                                                rows={3}
                                                value={formData.bio}
                                                onChange={handleInputChange("bio")}
                                                disabled={!isEditing}
                                                placeholder="Tell us about yourself..."
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Professional Information Card */}
                            <Card elevation={2}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: 1 }}>
                                            <WorkIcon sx={{ color: "#667eea" }} />
                                            Professional Information
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                            Work-related details and employment information
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 4
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Occupation"
                                                value={formData.occupation}
                                                onChange={handleInputChange("occupation")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 4
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Position"
                                                value={formData.position}
                                                onChange={handleInputChange("position")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 4
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Workplace"
                                                value={formData.workplace}
                                                onChange={handleInputChange("workplace")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Address Information Card */}
                            <Card elevation={2}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: 1 }}>
                                            <LocationIcon sx={{ color: "#667eea" }} />
                                            Address Information
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                            Permanent and temporary address details
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        {/* Permanent Address Section */}
                                        <Grid size={12}>
                                            <Box sx={{
                                                bgcolor: "#f3f4f6",
                                                p: 2,
                                                borderRadius: 2,
                                                border: "1px solid #e5e7eb"
                                            }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#667eea", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                                    <HomeIcon sx={{ fontSize: 18 }} />
                                                    Permanent Address
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            sm: 6
                                                        }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Province"
                                                            value={formData.permanentProvince}
                                                            onChange={handleInputChange("permanentProvince")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            sm: 6
                                                        }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="District"
                                                            value={formData.permanentDistrict}
                                                            onChange={handleInputChange("permanentDistrict")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            sm: 6
                                                        }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Municipality"
                                                            value={formData.permanentMunicipality}
                                                            onChange={handleInputChange("permanentMunicipality")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            sm: 6
                                                        }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Ward No"
                                                            value={formData.permanentWardNo}
                                                            onChange={handleInputChange("permanentWardNo")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                    <Grid size={12}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Address Line (Tole/Street)"
                                                            value={formData.permanentAddress}
                                                            onChange={handleInputChange("permanentAddress")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>

                                        {/* Temporary Address Section */}
                                        <Grid size={12}>
                                            <Box sx={{
                                                bgcolor: "#fef3c7",
                                                p: 2,
                                                borderRadius: 2,
                                                border: "1px solid #fde68a"
                                            }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#f59e0b", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                                    <MapIcon sx={{ fontSize: 18 }} />
                                                    Temporary Address
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            sm: 6
                                                        }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Province"
                                                            value={formData.temporaryProvince}
                                                            onChange={handleInputChange("temporaryProvince")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            sm: 6
                                                        }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="District"
                                                            value={formData.temporaryDistrict}
                                                            onChange={handleInputChange("temporaryDistrict")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            sm: 6
                                                        }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Municipality"
                                                            value={formData.temporaryMunicipality}
                                                            onChange={handleInputChange("temporaryMunicipality")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            sm: 6
                                                        }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Ward No"
                                                            value={formData.temporaryWardNo}
                                                            onChange={handleInputChange("temporaryWardNo")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                    <Grid size={12}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Address Line (Tole/Street)"
                                                            value={formData.temporaryAddress}
                                                            onChange={handleInputChange("temporaryAddress")}
                                                            disabled={!isEditing}
                                                            sx={{ bgcolor: "white" }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Family Information Card */}
                            <Card elevation={2}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: 1 }}>
                                            <FamilyIcon sx={{ color: "#667eea" }} />
                                            Family Information
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                            Family member details
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Mother's Name"
                                                value={formData.motherName}
                                                onChange={handleInputChange("motherName")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Father's Name"
                                                value={formData.fatherName}
                                                onChange={handleInputChange("fatherName")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Grandfather's Name"
                                                value={formData.grandfatherName}
                                                onChange={handleInputChange("grandfatherName")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Spouse's Name"
                                                value={formData.spouseName}
                                                onChange={handleInputChange("spouseName")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Citizenship Information Card */}
                            <Card elevation={2}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: 1 }}>
                                            <BadgeIcon sx={{ color: "#667eea" }} />
                                            Citizenship Information
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                            Citizenship and identification details
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 4
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Citizenship Number"
                                                value={formData.citizenshipNumber}
                                                onChange={handleInputChange("citizenshipNumber")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 4
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Issued District"
                                                value={formData.citizenshipIssuedDistrict}
                                                onChange={handleInputChange("citizenshipIssuedDistrict")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 4
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Issued Date (BS)"
                                                value={formData.citizenshipIssuedDate}
                                                onChange={handleInputChange("citizenshipIssuedDate")}
                                                disabled={!isEditing}
                                                placeholder="YYYY-MM-DD"
                                            />
                                        </Grid>

                                        {/* Citizenship Images Section */}
                                        <Grid size={12}>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                                                Citizenship Document Images
                                            </Typography>
                                        </Grid>

                                        {/* Front Image */}
                                        <Grid
                                            size={{
                                                xs: 12,
                                                md: 6
                                            }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    border: "2px dashed #d1d5db",
                                                    borderRadius: 2,
                                                    textAlign: "center",
                                                    bgcolor: "#f9fafb"
                                                }}
                                            >
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "#667eea" }}>
                                                    Front Side
                                                </Typography>
                                                {citizenshipFrontPreview ? (
                                                    <Box sx={{ position: "relative", mb: 2 }}>
                                                        <img
                                                            src={citizenshipFrontPreview}
                                                            alt="Citizenship Front"
                                                            style={{
                                                                width: "100%",
                                                                maxHeight: "200px",
                                                                objectFit: "contain",
                                                                borderRadius: "8px"
                                                            }}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ py: 4, color: "#9ca3af" }}>
                                                        <BadgeIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                                                        <Typography variant="caption" display="block">
                                                            No image uploaded
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {isEditing && (
                                                    <Button
                                                        component="label"
                                                        variant="outlined"
                                                        startIcon={<CloudUploadIcon />}
                                                        size="small"
                                                        sx={{ mt: 1 }}
                                                    >
                                                        Upload Front
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/*"
                                                            onChange={handleCitizenshipFrontChange}
                                                        />
                                                    </Button>
                                                )}
                                            </Paper>
                                        </Grid>

                                        {/* Back Image */}
                                        <Grid
                                            size={{
                                                xs: 12,
                                                md: 6
                                            }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    border: "2px dashed #d1d5db",
                                                    borderRadius: 2,
                                                    textAlign: "center",
                                                    bgcolor: "#f9fafb"
                                                }}
                                            >
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "#667eea" }}>
                                                    Back Side
                                                </Typography>
                                                {citizenshipBackPreview ? (
                                                    <Box sx={{ position: "relative", mb: 2 }}>
                                                        <img
                                                            src={citizenshipBackPreview}
                                                            alt="Citizenship Back"
                                                            style={{
                                                                width: "100%",
                                                                maxHeight: "200px",
                                                                objectFit: "contain",
                                                                borderRadius: "8px"
                                                            }}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ py: 4, color: "#9ca3af" }}>
                                                        <BadgeIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                                                        <Typography variant="caption" display="block">
                                                            No image uploaded
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {isEditing && (
                                                    <Button
                                                        component="label"
                                                        variant="outlined"
                                                        startIcon={<CloudUploadIcon />}
                                                        size="small"
                                                        sx={{ mt: 1 }}
                                                    >
                                                        Upload Back
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/*"
                                                            onChange={handleCitizenshipBackChange}
                                                        />
                                                    </Button>
                                                )}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Union/Organization Information Card */}
                            <Card elevation={2}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: 1 }}>
                                            <MembershipIcon sx={{ color: "#667eea" }} />
                                            Union / Membership Information
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                            Union and membership details
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 4
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Union Name"
                                                value={formData.unionName}
                                                onChange={handleInputChange("unionName")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 4
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Membership Number"
                                                value={formData.membershipNumber}
                                                onChange={handleInputChange("membershipNumber")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 4
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Join Date"
                                                type="date"
                                                value={formData.joinDate}
                                                onChange={handleInputChange("joinDate")}
                                                disabled={!isEditing}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Emergency Contact Card */}
                            <Card elevation={2}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: 1 }}>
                                            <ContactPhoneIcon sx={{ color: "#667eea" }} />
                                            Emergency Contact
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                            Emergency contact person details
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Contact Name"
                                                value={formData.emergencyContact}
                                                onChange={handleInputChange("emergencyContact")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Contact Phone"
                                                value={formData.emergencyPhone}
                                                onChange={handleInputChange("emergencyPhone")}
                                                disabled={!isEditing}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Security Settings Card */}
                            {isEditing && (
                                <Card elevation={2} sx={{ border: "2px solid #fbbf24" }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: 1 }}>
                                                <LockIcon sx={{ color: "#f59e0b" }} />
                                                Change Password
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                                Leave blank if you don't want to change your password
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid
                                                size={{
                                                    xs: 12,
                                                    sm: 6
                                                }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="New Password"
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange("password")}
                                                    error={!!errors.password}
                                                    helperText={errors.password}
                                                />
                                            </Grid>
                                            <Grid
                                                size={{
                                                    xs: 12,
                                                    sm: 6
                                                }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Confirm Password"
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange("confirmPassword")}
                                                    error={!!errors.confirmPassword}
                                                    helperText={errors.confirmPassword}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Action Buttons */}
                            {isEditing && (
                                <Card elevation={2} sx={{ bgcolor: "#f9fafb" }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<CancelIcon />}
                                                onClick={handleCancel}
                                                disabled={loading}
                                                sx={{
                                                    borderColor: "#d1d5db",
                                                    color: "#6b7280",
                                                    "&:hover": {
                                                        borderColor: "#9ca3af",
                                                        bgcolor: "#f3f4f6",
                                                    },
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<SaveIcon />}
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                sx={{
                                                    bgcolor: "#667eea",
                                                    "&:hover": { bgcolor: "#5568d3" },
                                                    px: 4,
                                                }}
                                            >
                                                {loading ? "Saving..." : "Save All Changes"}
                                            </Button>
                                        </Box>
                                        {uploadingImage && (
                                            <Box sx={{ mt: 2 }}>
                                                <LinearProgress sx={{ borderRadius: 2 }} />
                                                <Typography variant="caption" sx={{ color: "#6b7280", mt: 1, display: "block", textAlign: "center" }}>
                                                    Uploading image...
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
