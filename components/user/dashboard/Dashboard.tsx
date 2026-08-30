"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Button,
  Alert,
  Paper,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";

import {
  ShoppingCart as ShoppingCartIcon,
  Group as GroupIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  CreditCard as CreditCardIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/analytics');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.log("Error from effect---", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load dashboard data. Please refresh the page.
        </Alert>
      </Container>
    );
  }

  const statsCards = [
    {
      title: "Total Subscriptions",
      count: data?.usersSubscriptionCount || 0,
      icon: BarChartIcon,
      color: "#667eea",
      bgColor: "#667eea15",
      trend: "+2 this month",
      link: "/dashboard/user/subscriptions",
    },
    {
      title: "Active Orders",
      count: data?.userOrderCount || 0,
      icon: ShoppingCartIcon,
      color: "#f59e0b",
      bgColor: "#f59e0b15",
      trend: "View details",
      link: "/dashboard/user/orders",
    },
    {
      title: "Payments",
      count: data?.userPaymentCount || data?.userOrderCount || 0,
      icon: CreditCardIcon,
      color: "#ec4899",
      bgColor: "#ec489915",
      trend: "Manage billing",
      link: "/dashboard/user/card",
    },
  ];

  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 5,
          mb: 4,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexDirection: { xs: "column", md: "row" }, textAlign: { xs: "center", md: "left" } }}>
                <Avatar
                  src={session?.user?.image || "/images/logo2.png"}
                  alt={session?.user?.name || "User"}
                  sx={{
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
                    border: "4px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    background: "white",
                  }}
                />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: { xs: "1.75rem", md: "2.25rem" },
                    }}
                  >
                    Welcome back, {session?.user?.name || "User"}! 👋
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: "1.05rem",
                      mb: 2,
                      fontWeight: 500,
                    }}
                  >
                    {session?.user?.email} • {session?.user?.role === "admin" ? "Administrator" : "Member"}
                  </Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" justifyContent={{ xs: "center", md: "flex-start" }}>
                    <Button
                      variant="contained"
                      startIcon={<SchoolIcon />}
                      onClick={() => router.push("/dashboard/user/profile")}
                      sx={{
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          background: "rgba(255,255,255,0.3)",
                        },
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      onClick={() => router.push("/dashboard/user/profile")}
                      sx={{
                        borderColor: "rgba(255,255,255,0.5)",
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "white",
                          background: "rgba(255,255,255,0.15)",
                        },
                      }}
                    >
                      Settings
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 5 }}>
        {/* Stats Cards Grid */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    border: `1px solid ${stat.bgColor}`,
                    background: `linear-gradient(135deg, ${stat.bgColor} 0%, rgba(255,255,255,0.05) 100%)`,
                    backdrop: "blur(10px)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px ${stat.bgColor}40`,
                      borderColor: stat.color,
                    },
                  }}
                  onClick={() => router.push(stat.link)}
                >
                  <CardContent sx={{ height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "12px",
                          background: `${stat.color}20`,
                        }}
                      >
                        <IconComponent sx={{ color: stat.color, fontSize: "1.75rem" }} />
                      </Box>
                      <Chip
                        label={stat.trend}
                        size="small"
                        sx={{
                          background: `${stat.color}15`,
                          color: stat.color,
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6b7280",
                        fontWeight: 500,
                        mb: 0.5,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {stat.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "#111827",
                        mb: 1,
                      }}
                    >
                      {stat.count}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: stat.color,
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        gap: 0.5,
                        "&:hover": {
                          gap: 1,
                        },
                      }}
                    >
                      View details
                      <ArrowForwardIcon sx={{ fontSize: "1rem", transition: "all 0.3s" }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick Actions Section */}
        <Paper
          sx={{
            p: 3,
            mb: 5,
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
            border: "1px solid rgba(102, 126, 234, 0.1)",
            borderRadius: "16px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <ArrowForwardIcon sx={{ color: "white", fontSize: "1.25rem" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
              Quick Actions
            </Typography>
          </Box>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CreditCardIcon />}
                onClick={() => router.push("/dashboard/user/card")}
                sx={{
                  borderColor: "#ec4899",
                  color: "#ec4899",
                  fontWeight: 600,
                  py: 1.25,
                  borderRadius: "10px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#be185d",
                    background: "rgba(236, 72, 153, 0.05)",
                  },
                }}
              >
                Manage Payments
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => router.push("/dashboard/user/profile")}
                sx={{
                  borderColor: "#10b981",
                  color: "#10b981",
                  fontWeight: 600,
                  py: 1.25,
                  borderRadius: "10px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#047857",
                    background: "rgba(16, 185, 129, 0.05)",
                  },
                }}
              >
                Download Certificates
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => router.push("/dashboard/user/profile")}
                sx={{
                  borderColor: "#f59e0b",
                  color: "#f59e0b",
                  fontWeight: 600,
                  py: 1.25,
                  borderRadius: "10px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#d97706",
                    background: "rgba(245, 158, 11, 0.05)",
                  },
                }}
              >
                Account Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Learning Progress Section */}
        <Paper
          sx={{
            p: 3,
            mb: 5,
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            background: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              }}
            >
              <CheckCircleIcon sx={{ color: "white", fontSize: "1.25rem" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
              Your Learning Progress
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {[
              { label: "Courses Completed", value: 5, max: 12, color: "#667eea" },
              { label: "Hours Learned", value: 48, max: 100, color: "#10b981" },
              { label: "Certificates Earned", value: 3, max: 10, color: "#f59e0b" },
            ].map((item, index) => (
              <Box key={index}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151" }}>
                    {item.label}
                  </Typography>
                  <Chip
                    label={`${item.value}/${item.max}`}
                    size="small"
                    sx={{
                      background: `${item.color}15`,
                      color: item.color,
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(item.value / item.max) * 100}
                  sx={{
                    height: "8px",
                    borderRadius: "4px",
                    background: "#e5e7eb",
                    "& .MuiLinearProgress-bar": {
                      background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                      borderRadius: "4px",
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>

      {/* Orders Section link / notice */}
      <Box sx={{ background: "#f9fafb", py: 5, textAlign: "center" }}>
        <Container maxWidth="lg">
          <Typography variant="body1" sx={{ color: "#6b7280", mb: 2, fontWeight: 500 }}>
            Looking for your purchase history?
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push("/dashboard/user/orders")}
            startIcon={<ShoppingCartIcon />}
            sx={{
              borderColor: "#667eea",
              color: "#667eea",
              fontWeight: 600,
              px: 4,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                borderColor: "#764ba2",
                background: "rgba(102, 126, 234, 0.05)",
              },
            }}
          >
            Go to Order History
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
