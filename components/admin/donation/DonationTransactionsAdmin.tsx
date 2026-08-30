"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, Chip, CircularProgress, Container, Grid, Paper, Snackbar, Typography } from "@mui/material";

export default function DonationTransactionsAdmin() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const loadTransactions = async () => {
        try {
            const response = await fetch("/api/admin/donation/transactions", { cache: "no-store" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to load receipts");
            setTransactions(data.data || []);
        } catch (error) {
            setMessage(error.message || "Failed to load receipts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const updateStatus = async (id: string, status: "approved" | "rejected" | "pending") => {
        try {
            setUpdatingId(id);
            const response = await fetch(`/api/admin/donation/transactions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to update receipt");
            setTransactions((current) => current.map((transaction) => transaction._id === id ? data.data : transaction));
        } catch (error) {
            setMessage(error.message || "Failed to update receipt");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}><CircularProgress /></Box>;

    const totalAmount = transactions.reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
    const approvedAmount = transactions.filter((transaction) => transaction.status === "approved").reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
    const pendingAmount = transactions.filter((transaction) => transaction.status === "pending").reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
    const rejectedAmount = transactions.filter((transaction) => transaction.status === "rejected").reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>Donation Receipts</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    ["Total Amount", totalAmount, "primary"],
                    ["Approved Amount", approvedAmount, "success"],
                    ["Pending Amount", pendingAmount, "warning"],
                    ["Rejected Amount", rejectedAmount, "error"],
                ].map(([label, value, color]) => (
                    <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="body2" color="text.secondary">{label}</Typography>
                            <Typography variant="h5" color={`${color}.main`} fontWeight={700}>NPR {Number(value).toLocaleString()}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {transactions.length === 0 ? (
                <Card sx={{ p: 3 }}><Typography color="text.secondary">No donation receipts submitted yet.</Typography></Card>
            ) : transactions.map((transaction) => (
                <Card key={transaction._id} sx={{ p: 3, mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                        <Box>
                            <Typography variant="h6">{transaction.donorName}</Typography>
                            <Typography color="text.secondary">{transaction.donorEmail} {transaction.donorPhone ? `• ${transaction.donorPhone}` : ""}</Typography>
                            {transaction.donorAddress && <Typography color="text.secondary">Address: {transaction.donorAddress}</Typography>}
                            <Typography sx={{ mt: 1 }}><strong>NPR {transaction.amount?.toLocaleString()}</strong> • {transaction.paymentMethod} • {transaction.donationType}</Typography>
                            {transaction.transactionId && <Typography color="text.secondary">Transaction ID: {transaction.transactionId}</Typography>}
                            <Typography variant="body2" color="text.secondary">Submitted: {new Date(transaction.createdAt).toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                            <Chip label={transaction.status} color={transaction.status === "approved" ? "success" : transaction.status === "rejected" ? "error" : "warning"} />
                            <Button component="a" href={transaction.receiptUrl} target="_blank" rel="noreferrer" variant="outlined">View Receipt</Button>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button size="small" variant="contained" color="success" disabled={updatingId === transaction._id || transaction.status === "approved"} onClick={() => updateStatus(transaction._id, "approved")}>Confirm Amount</Button>
                                <Button size="small" variant="outlined" color="error" disabled={updatingId === transaction._id || transaction.status === "rejected"} onClick={() => updateStatus(transaction._id, "rejected")}>Reject</Button>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            ))}
            <Snackbar open={Boolean(message)} autoHideDuration={5000} onClose={() => setMessage("")}>
                <Alert severity="error" onClose={() => setMessage("")}>{message}</Alert>
            </Snackbar>
        </Container>
    );
}