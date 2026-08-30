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
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    Divider,
} from "@mui/material";
import {
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import ImageUpload from "@/utility/ImageUpload";

export default function DonationAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [qrUploading, setQrUploading] = useState(false);
    const [qrPreview, setQrPreview] = useState("");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "warning" | "info";
    }>({ open: false, message: "", severity: "success" });

    const [formData, setFormData] = useState({
        headerTitle: "",
        headerTitleEn: "",
        headerSubtitle: "",
        impactItems: [],
        bankDetails: {
            bankName: "",
            accountName: "",
            accountNumber: "",
            branch: "",
        },
        paymentDetails: {
            qrCode: "",
            esewa: "",
            khalti: "",
        },
        contactEmail: "",
        contactPhone: "",
        helpText: "",
    });

    useEffect(() => {
        fetchDonationPage();
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch("/api/admin/donation/transactions");
            const data = await response.json();
            if (data.success) setTransactions(data.data || []);
        } catch (error) {
            console.error("Error fetching donation transactions:", error);
        }
    };

    const fetchDonationPage = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/donation");
            const data = await response.json();

            if (data.success) {
                setFormData({
                    ...data.data,
                    paymentDetails: { qrCode: "", esewa: "", khalti: "", ...data.data.paymentDetails },
                });
                setQrPreview(data.data.paymentDetails?.qrCode || "");
            } else {
                showSnackbar("Failed to load donation page", "error");
            }
        } catch (error) {
            console.error("Error fetching donation page:", error);
            showSnackbar("Error loading donation page", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await fetch("/api/admin/donation", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                showSnackbar("Donation page updated successfully", "success");
                setFormData(data.data);
            } else {
                showSnackbar(data.error || "Failed to save donation page", "error");
            }
        } catch (error) {
            console.error("Error saving donation page:", error);
            showSnackbar("Error saving donation page", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleQrUpload = async (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setQrPreview(reader.result as string);
        reader.readAsDataURL(file);

        try {
            setQrUploading(true);
            const uploadData = new FormData();
            uploadData.append("file", file);
            uploadData.append("folder", "antuf/donation");
            const response = await fetch("/api/upload", { method: "POST", body: uploadData });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || "QR upload failed");
            setFormData((current) => ({
                ...current,
                paymentDetails: { ...current.paymentDetails, qrCode: result.url },
            }));
            setQrPreview(result.url);
            showSnackbar("QR code uploaded. Save changes to publish it.", "success");
        } catch (error) {
            showSnackbar(error.message || "QR upload failed", "error");
        } finally {
            setQrUploading(false);
        }
    };

    const addImpactItem = () => {
        setFormData({
            ...formData,
            impactItems: [...formData.impactItems, { amount: 0, description: "" }],
        });
    };

    const removeImpactItem = (index) => {
        setFormData({
            ...formData,
            impactItems: formData.impactItems.filter((_, i) => i !== index),
        });
    };

    const updateImpactItem = (index, field, value) => {
        const updated = [...formData.impactItems];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, impactItems: updated });
    };

    const showSnackbar = (
        message: string,
        severity: "success" | "error" | "warning" | "info" = "success"
    ) => {
        setSnackbar({ open: true, message, severity });
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" fontWeight={600}>
                    दान पृष्ठ व्यवस्थापन / Donation Page Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={saving || qrUploading}
                    sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #5568d3 0%, #6a3f92 100%)",
                        },
                    }}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Header Content */}
                <Grid size={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Header Content
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Title (Nepali)"
                                    value={formData.headerTitle}
                                    onChange={(e) => setFormData({ ...formData, headerTitle: e.target.value })}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Title (English)"
                                    value={formData.headerTitleEn}
                                    onChange={(e) => setFormData({ ...formData, headerTitleEn: e.target.value })}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Subtitle/Description"
                                    value={formData.headerSubtitle}
                                    onChange={(e) => setFormData({ ...formData, headerSubtitle: e.target.value })}
                                />
                            </Grid>

                        </Grid>
                    </Card>
                </Grid>

                {/* Impact Items */}
                <Grid size={12}>
                    <Card sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Impact Items
                            </Typography>
                            <Button startIcon={<AddIcon />} onClick={addImpactItem} variant="outlined">
                                Add Impact
                            </Button>
                        </Box>
                        {formData.impactItems?.map((item, index) => (
                            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: "#f9fafb" }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 3
                                        }}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Amount (NPR)"
                                            value={item.amount}
                                            onChange={(e) => updateImpactItem(index, "amount", Number(e.target.value))}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 8
                                        }}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={item.description}
                                            onChange={(e) => updateImpactItem(index, "description", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            sm: 1
                                        }}>
                                        <IconButton color="error" onClick={() => removeImpactItem(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}
                    </Card>
                </Grid>

                {/* Bank Details */}
                <Grid size={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Bank Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Bank Name"
                                    value={formData.bankDetails?.bankName || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bankDetails: { ...formData.bankDetails, bankName: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Account Name"
                                    value={formData.bankDetails?.accountName || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bankDetails: { ...formData.bankDetails, accountName: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Account Number"
                                    value={formData.bankDetails?.accountNumber || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bankDetails: { ...formData.bankDetails, accountNumber: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Branch"
                                    value={formData.bankDetails?.branch || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bankDetails: { ...formData.bankDetails, branch: e.target.value },
                                        })
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {/* Digital Wallets */}
                <Grid size={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Digital Wallets & QR Code
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Add the wallet IDs and a hosted QR image URL donors should use for digital payments.
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="eSewa ID / mobile number"
                                    value={formData.paymentDetails?.esewa || ""}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        paymentDetails: { ...formData.paymentDetails, esewa: e.target.value },
                                    })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Khalti ID / mobile number"
                                    value={formData.paymentDetails?.khalti || ""}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        paymentDetails: { ...formData.paymentDetails, khalti: e.target.value },
                                    })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Donation QR code</Typography>
                                <ImageUpload imagePreview={qrPreview} onChange={handleQrUpload} />
                                {qrUploading && <Typography variant="caption" color="text.secondary">Uploading QR code...</Typography>}
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {/* Contact Information */}
                <Grid size={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Contact Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Contact Email"
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                />
                            </Grid>
                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6
                                }}>
                                <TextField
                                    fullWidth
                                    label="Contact Phone"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Help Text"
                                    value={formData.helpText}
                                    onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid size={12}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Donor Details & Transaction Receipts
                        </Typography>
                        {transactions.length === 0 ? (
                            <Typography color="text.secondary">No transaction receipts submitted yet.</Typography>
                        ) : (
                            transactions.map((transaction) => (
                                <Paper key={transaction._id} sx={{ p: 2, mb: 2, bgcolor: "#f9fafb" }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                                        <Box>
                                            <Typography fontWeight={600}>{transaction.donorName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {transaction.donorEmail} {transaction.donorPhone ? `• ${transaction.donorPhone}` : ""}
                                            </Typography>
                                            {transaction.donorAddress && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Address: {transaction.donorAddress}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                NPR {transaction.amount?.toLocaleString()} • {transaction.paymentMethod} • {transaction.status}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Donation type: {transaction.donationType} • Submitted: {new Date(transaction.createdAt).toLocaleString()}
                                            </Typography>
                                            {transaction.transactionId && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Transaction ID: {transaction.transactionId}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Button component="a" href={transaction.receiptUrl} target="_blank" rel="noreferrer" variant="outlined">
                                            View Receipt
                                        </Button>
                                    </Box>
                                </Paper>
                            ))
                        )}
                    </Card>
                </Grid>
            </Grid>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
    );
}
