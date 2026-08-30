'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Event as EventIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import Sidebar from "@/components/sidebar/SideBar";
import Profile from "@/components/admin/image/ImageComponent";
export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalDonationRevenue: 0,
    totalOrders: 0,
    totalEvents: 0,
    totalArticles: 0,
    recentUsers: [],
    recentOrders: [],
    revenueData: [],
  });

  useEffect(() => {

  }, [session, status, router]);

  useEffect(() => {

    fetchDashboardData();

  }, [session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent users from database
      const usersResponse = await fetch('/api/users/recent?limit=3');
      const usersData = usersResponse.ok ? await usersResponse.json() : [];

      // Format recent users with proper date formatting
      const formattedUsers = (usersData.users || []).map(user => ({
        id: user._id,
        name: user.fullName || user.name || 'Unknown User',
        email: user.email,
        joinedAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'N/A',
      }));

      // Fetch recent orders from database
      const ordersResponse = await fetch('/api/orders/recent?limit=3');
      const ordersData = ordersResponse.ok ? await ordersResponse.json() : [];

      const formattedOrders = (ordersData.orders || []).map(order => ({
        id: order._id,
        user: order.userId?.fullName || order.userId?.name || 'Unknown User',
        amount: order.amount || 0,
        status: order.status || 'pending',
        date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US') : 'N/A',
      }));

      // Fetch statistics from database
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = statsResponse.ok ? await statsResponse.json() : {};

      setStats(prevStats => ({
        totalUsers: statsData.totalUsers || 0,
        totalRevenue: statsData.totalRevenue || 0,
        totalDonationRevenue: statsData.totalDonationRevenue || 0,
        totalOrders: statsData.totalOrders || 0,
        totalEvents: statsData.totalEvents || 0,
        totalArticles: statsData.totalArticles || 0,
        recentUsers: formattedUsers.length > 0 ? formattedUsers : [],
        recentOrders: formattedOrders.length > 0 ? formattedOrders : [],
        revenueData: statsData.revenueData && statsData.revenueData.length > 0 ? statsData.revenueData : [],
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);

      // Set empty data if API fails
      setStats(prevStats => ({
        ...prevStats,
        recentUsers: [],
        recentOrders: [],
      }));

      setLoading(false);
    }
  };




  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      trend: 15.3,
      trendUp: true,
      color: '#10b981',
      bgColor: '#dcfce7',
    },
    {
      title: 'Total Revenue',
      value: `NPR ${stats.totalRevenue.toLocaleString()}`,
      icon: <MoneyIcon sx={{ fontSize: 40 }} />,
      trend: 23.5,
      trendUp: true,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: <CartIcon sx={{ fontSize: 40 }} />,
      trend: 8.2,
      trendUp: true,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Donation Revenue',
      value: `NPR ${stats.totalDonationRevenue.toLocaleString()}`,
      icon: <MoneyIcon sx={{ fontSize: 40 }} />,
      trend: 0,
      trendUp: true,
      color: '#0f766e',
      bgColor: '#ccfbf1',
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafb' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Header Section - Enhanced Design */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            pt: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 3, sm: 4, md: 6 },
            mb: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              animation: 'float 20s linear infinite',
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Profile />
            </Box>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '2.75rem' }
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.95)',
                fontSize: { xs: '0.9rem', md: '1.05rem' },
                fontWeight: 500
              }}
            >
              Welcome back, Here's your platform overview at a glance
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: { xs: 2, md: 3 } }}>
          {/* Stats Cards Section */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {statCards.map((stat, index) => (
                <Grid
                  key={index}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3
                  }}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, ${stat.color} 0%, transparent 100%)`,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                        background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 100%)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: stat.bgColor,
                            color: stat.color,
                            width: { xs: 48, sm: 56 },
                            height: { xs: 48, sm: 56 },
                            boxShadow: `0 4px 12px ${stat.color}33`,
                          }}
                        >
                          {stat.icon}
                        </Avatar>
                        <Chip
                          icon={stat.trendUp ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <TrendingDownIcon sx={{ fontSize: 16 }} />}
                          label={`${Math.abs(stat.trend)}%`}
                          color={stat.trendUp ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 0.5 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color, mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: stat.trendUp ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                        {stat.trendUp ? '↑' : '↓'} {Math.abs(stat.trend)}% this month
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Quick Actions */}
          <Card
            sx={{
              mb: { xs: 3, md: 4 },
              p: { xs: 1.5, sm: 2, md: 3 },
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 2.5,
                color: '#1f2937',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3
                }}>
                <Button
                  component={Link}
                  href="/dashboard/admin/events"
                  fullWidth
                  variant="outlined"
                  startIcon={<EventIcon />}
                  sx={{
                    py: { xs: 1.2, sm: 1.5 },
                    justifyContent: 'flex-start',
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    fontWeight: 700,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#1e40af',
                      bgcolor: 'rgba(59, 130, 246, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Manage Events
                </Button>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3
                }}>
                <Button
                  component={Link}
                  href="/dashboard/admin/create/post"
                  fullWidth
                  variant="outlined"
                  startIcon={<ArticleIcon />}
                  sx={{
                    py: { xs: 1.2, sm: 1.5 },
                    justifyContent: 'flex-start',
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    fontWeight: 700,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#b45309',
                      bgcolor: 'rgba(245, 158, 11, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  View Articles
                </Button>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3
                }}>
                <Button
                  component={Link}
                  href="/dashboard/admin/orders"
                  fullWidth
                  variant="outlined"
                  startIcon={<CartIcon />}
                  sx={{
                    py: { xs: 1.2, sm: 1.5 },
                    justifyContent: 'flex-start',
                    borderColor: '#8b5cf6',
                    color: '#8b5cf6',
                    fontWeight: 700,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#5b21b6',
                      bgcolor: 'rgba(139, 92, 246, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  View Orders
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* Main Content */}
          <Grid container spacing={{ xs: 2.5, sm: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
            {/* Revenue Overview */}
            <Grid
              size={{
                xs: 12,
                lg: 8
              }}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#1f2937', mb: 0.5 }}>
                        Revenue Overview
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600 }}>
                        Monthly revenue statistics
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      size="small"
                      sx={{
                        borderColor: '#e5e7eb',
                        color: '#6b7280',
                        fontWeight: 600,
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#3b82f6',
                          color: '#3b82f6',
                          bgcolor: 'rgba(59, 130, 246, 0.05)',
                        },
                      }}
                    >
                      Export
                    </Button>
                  </Box>

                  {/* Revenue Chart - Enhanced */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-around',
                      height: { xs: 250, sm: 280, md: 320 },
                      gap: { xs: 0.5, sm: 1 },
                      mb: 3
                    }}
                  >
                    {stats.revenueData.map((item, index) => {
                      const height = (item.revenue / 8000) * 280;
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flex: 1,
                            maxWidth: 80,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            }
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 800,
                              color: '#667eea',
                              mb: 1,
                              fontSize: '0.8rem'
                            }}
                          >
                            NPR {item.revenue >= 1000 ? (item.revenue / 1000).toFixed(1) + 'k' : item.revenue.toFixed(0)}
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              width: '100%',
                              height: `${height}px`,
                              background: `linear-gradient(180deg, #667eea 0%, #764ba2 100%)`,
                              borderRadius: '12px 12px 0 0',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                              position: 'relative',
                              '&:hover': {
                                opacity: 0.9,
                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                              },
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '12px 12px 0 0',
                              }
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#9ca3af',
                              mt: 1,
                              fontWeight: 700,
                              fontSize: '0.75rem'
                            }}
                          >
                            {item.month}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Revenue Stats */}
                  <Grid container spacing={2}>
                    <Grid
                      size={{
                        xs: 12,
                        md: 4
                      }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Total Earnings
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#667eea', mt: 0.5 }}>
                          NPR {stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 4
                      }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(16, 185, 129, 0.05)', borderRadius: 2, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          This Month
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', mt: 0.5 }}>
                          NPR {stats.revenueData.length > 0 ? stats.revenueData[stats.revenueData.length - 1].revenue.toLocaleString() : '0'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 4
                      }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(239, 68, 68, 0.05)', borderRadius: 2, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Total Orders
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', mt: 0.5 }}>
                          {stats.totalOrders.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Side Stats */}
            <Grid
              size={{
                xs: 12,
                lg: 4
              }}>
              <Grid container spacing={2.5}>
                {/* Events Card */}
                <Grid size={12}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: '#dbeafe',
                            color: '#3b82f6',
                            mr: 2,
                            width: 56,
                            height: 56,
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                          }}
                        >
                          <EventIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Total Events
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#3b82f6' }}>
                            {stats.totalEvents}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        component={Link}
                        href="/dashboard/admin/events"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          mt: 1,
                          color: '#3b82f6',
                          fontWeight: 700,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        View all events
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Articles Card */}
                <Grid size={12}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: '#fef3c7',
                            color: '#f59e0b',
                            mr: 2,
                            width: 56,
                            height: 56,
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                          }}
                        >
                          <ArticleIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Total Articles
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                            {stats.totalArticles}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        component={Link}
                        href="/dashboard/admin/post"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          mt: 1,
                          color: '#f59e0b',
                          fontWeight: 700,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        Manage articles
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Active Users Card */}
                <Grid size={12}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: '#dcfce7',
                            color: '#10b981',
                            mr: 2,
                            width: 56,
                            height: 56,
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                          }}
                        >
                          <PeopleIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Active Users
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981' }}>
                            842
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600 }}>
                            Activity Rate
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#10b981' }}>
                            67.5%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={67.5}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            bgcolor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Recent Activity Tables */}
          <Grid container spacing={{ xs: 2.5, sm: 3 }}>
            {/* Recent Users */}
            <Grid
              size={{
                xs: 12,
                lg: 6
              }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1f2937' }}>
                      Recent Users
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        transition: 'all 0.3s',
                        '&:hover': {
                          color: '#3b82f6',
                          bgcolor: 'rgba(59, 130, 246, 0.08)',
                        }
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f9fafb' }}>
                          <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '0.85rem' }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '0.85rem' }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '0.85rem' }}>Joined</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.recentUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            sx={{
                              '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.03)' },
                              transition: 'background-color 0.2s',
                              borderBottom: '1px solid #e5e7eb'
                            }}
                          >
                            <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#1f2937' }}>{user.name}</TableCell>
                            <TableCell sx={{ py: 1.5, color: '#6b7280' }}>{user.email}</TableCell>
                            <TableCell sx={{ py: 1.5, color: '#6b7280', fontSize: '0.9rem' }}>{user.joinedAt}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    component={Link}
                    href="/dashboard/admin/alluser"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 2,
                      color: '#3b82f6',
                      fontWeight: 700,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateX(4px)',
                      }
                    }}
                  >
                    View all users
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Orders */}
            <Grid
              size={{
                xs: 12,
                lg: 6
              }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1f2937' }}>
                      Recent Orders
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        transition: 'all 0.3s',
                        '&:hover': {
                          color: '#10b981',
                          bgcolor: 'rgba(16, 185, 129, 0.08)',
                        }
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f9fafb' }}>
                          <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '0.85rem' }}>User</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '0.85rem' }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '0.85rem' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.recentOrders.map((order) => (
                          <TableRow
                            key={order.id}
                            sx={{
                              '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.03)' },
                              transition: 'background-color 0.2s',
                              borderBottom: '1px solid #e5e7eb'
                            }}
                          >
                            <TableCell sx={{ py: 1.5, fontWeight: 600, color: '#1f2937' }}>{order.user}</TableCell>
                            <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#667eea' }}>
                              NPR {order.amount}
                            </TableCell>
                            <TableCell sx={{ py: 1.5 }}>
                              <Chip
                                label={order.status}
                                color={order.status === 'completed' ? 'success' : 'warning'}
                                size="small"
                                sx={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '0.75rem' }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    component={Link}
                    href="/dashboard/admin/orders"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 2,
                      color: '#10b981',
                      fontWeight: 700,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateX(4px)',
                      }
                    }}
                  >
                    View all orders
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
