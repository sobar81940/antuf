'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Chip,
  Divider,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  EmojiEvents as EventsIcon,
  School as SchoolIcon,
  VolunteerActivism as VolunteerIcon,
  Campaign as CampaignIcon,
  LocalHospital as HealthIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const ActivitiesPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const activities = [
    {
      category: 'शैक्षिक / Education',
      icon: <SchoolIcon />,
      items: [
        {
          title: 'छात्रवृत्ति कार्यक्रम / Scholarship Program',
          description: 'विद्यार्थीहरूलाई शैक्षिक सहयोग',
          date: '२०२४',
          status: 'ongoing',
        },
        {
          title: 'शिक्षक तालिम / Teacher Training',
          description: 'शिक्षकहरूको क्षमता विकास',
          date: '२०२३-२०२४',
          status: 'completed',
        },
      ],
    },
    {
      category: 'सामाजिक / Social',
      icon: <VolunteerIcon />,
      items: [
        {
          title: 'रक्तदान कार्यक्रम / Blood Donation',
          description: 'वार्षिक रक्तदान शिविर',
          date: 'जेष्ठ २०८१',
          status: 'upcoming',
        },
        {
          title: 'स्वच्छता अभियान / Cleanliness Campaign',
          description: 'समुदाय सफाई कार्यक्रम',
          date: 'चैत्र २०८०',
          status: 'completed',
        },
      ],
    },
    {
      category: 'स्वास्थ्य / Health',
      icon: <HealthIcon />,
      items: [
        {
          title: 'स्वास्थ्य शिविर / Health Camp',
          description: 'निःशुल्क स्वास्थ्य परीक्षण',
          date: 'कार्तिक २०८१',
          status: 'planned',
        },
      ],
    },
    {
      category: 'जागरुकता / Awareness',
      icon: <CampaignIcon />,
      items: [
        {
          title: 'युवा सम्मेलन / Youth Conference',
          description: 'युवाहरूको क्षमता विकास',
          date: 'माघ २०८०',
          status: 'completed',
        },
      ],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'primary';
      case 'completed': return 'success';
      case 'upcoming': return 'warning';
      case 'planned': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ongoing': return 'जारी / Ongoing';
      case 'completed': return 'सम्पन्न / Completed';
      case 'upcoming': return 'आगामी / Upcoming';
      case 'planned': return 'योजनाबद्ध / Planned';
      default: return status;
    }
  };

  return (
    <Box sx={{ bgcolor: '#f6faf9', minHeight: '100vh', color: '#173b3b' }}>
      <Navbar />
      <Box component="main">
      <Box sx={{ background: 'linear-gradient(120deg, #063f3d 0%, #0f766e 62%, #f59e0b 160%)', color: 'white', py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 3, '& .MuiBreadcrumbs-separator': { color: 'rgba(255,255,255,.55)' } }}
        >
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            color="rgba(255,255,255,.78)"
            onClick={() => router.push('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            गृहपृष्ठ / Home
          </Link>
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            color="rgba(255,255,255,.78)"
            onClick={() => router.push('/pages')}
          >
            पृष्ठहरू / Pages
          </Link>
          <Typography sx={{ color: 'white', fontWeight: 700 }}>
            गतिविधि / Activities
          </Typography>
        </Breadcrumbs>

        <Box sx={{ maxWidth: 720 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <EventsIcon sx={{ color: '#fbbf24' }} />
            <Typography sx={{ color: '#fbbf24', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '.78rem' }}>
              Community in action
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: '2.2rem', md: '3.8rem' }, lineHeight: 1.05, mb: 1.5 }}>
            हाम्रा गतिविधिहरू
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,.82)', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 600 }}>
            Our Activities: building stronger communities through education, solidarity, health, and awareness.
          </Typography>
        </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

        {/* Tabs */}
        <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                fontWeight: 600,
              },
            }}
          >
            {activities.map((category, index) => (
              <Tab
                key={index}
                label={category.category}
                icon={category.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>

        {/* Activities Grid */}
        {activities.map((category, categoryIndex) => (
          <Box
            key={categoryIndex}
            sx={{ display: activeTab === categoryIndex ? 'block' : 'none' }}
          >
            <Grid container spacing={3}>
              {category.items.map((activity, activityIndex) => (
                <Grid
                  key={activityIndex}
                  size={{
                    xs: 12,
                    md: 6
                  }}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                          {activity.title}
                        </Typography>
                        <Chip
                          label={getStatusLabel(activity.status)}
                          color={getStatusColor(activity.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {activity.description}
                      </Typography>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 2,
                          pt: 2,
                          borderTop: '1px solid #eee',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          📅 {activity.date}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Summary */}
        <Paper elevation={2} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            गतिविधि सारांश / Activity Summary
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid
              size={{
                xs: 6,
                sm: 3
              }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
                  15+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  कुल कार्यक्रम / Total Programs
                </Typography>
              </Box>
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 3
              }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50' }}>
                  10
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  सम्पन्न / Completed
                </Typography>
              </Box>
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 3
              }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff9800' }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  जारी / Ongoing
                </Typography>
              </Box>
            </Grid>
            <Grid
              size={{
                xs: 6,
                sm: 3
              }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#2196f3' }}>
                  2
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  योजनाबद्ध / Planned
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Note */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            bgcolor: '#e3f2fd',
            borderRadius: 2,
            borderLeft: 4,
            borderColor: '#2196f3',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            💡 <strong>जानकारी / Info:</strong> यो पृष्ठ निर्माणाधीन छ। थप गतिविधिहरू र तस्बिरहरू चाँडै थपिनेछन्।
            <br />
            This page is under construction. More activities and photos will be added soon.
          </Typography>
        </Paper>
      </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ActivitiesPage;
