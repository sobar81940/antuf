'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Breadcrumbs,
  Link,
  Divider,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  AccountTree as AccountTreeIcon,
  People as PeopleIcon,
  AssignmentInd as AssignmentIndIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const OrganizationPage = () => {
  const router = useRouter();

  const organizationStructure = [
    {
      title: 'अध्यक्ष / President',
      name: 'To be added',
      icon: <AssignmentIndIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'उपाध्यक्ष / Vice President',
      name: 'To be added',
      icon: <AssignmentIndIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'महासचिव / General Secretary',
      name: 'To be added',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'कोषाध्यक्ष / Treasurer',
      name: 'To be added',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    },
  ];

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
            संगठन / Organization
          </Typography>
        </Breadcrumbs>

        <Box sx={{ maxWidth: 720 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <BusinessIcon sx={{ color: '#fbbf24' }} />
            <Typography sx={{ color: '#fbbf24', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '.78rem' }}>
              One federation, many voices
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, fontSize: { xs: '2.2rem', md: '3.8rem' }, lineHeight: 1.05, mb: 1.5 }}>
            संगठन संरचना
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,.82)', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 600 }}>
            Organization Structure: the people, departments, and shared purpose that guide ANTUF forward.
          </Typography>
        </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

        {/* About Organization */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 2, border: '1px solid #d8e8e5', bgcolor: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            <AccountTreeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            संगठनात्मक विवरण / Organizational Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            ANTUF एक गैर-लाभकारी संस्था हो जसले शैक्षिक र सामाजिक विकासमा योगदान पुर्‍याउँछ।
            यो संगठन विभिन्न विभाग र समितिहरूद्वारा सञ्चालित छ।
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            ANTUF is a non-profit organization dedicated to educational and social development.
            The organization operates through various departments and committees to achieve its goals.
          </Typography>
        </Paper>

        {/* Organization Chart */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 2, border: '1px solid #d8e8e5', bgcolor: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            नेतृत्व टोली / Leadership Team
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {organizationStructure.map((member, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3
                }}>
                <Card
                  elevation={1}
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: 'white',
                      }}
                    >
                      {member.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, fontSize: '1rem' }}
                    >
                      {member.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Departments */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid #d8e8e5', bgcolor: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            विभागहरू / Departments
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            {[
              'शिक्षा विभाग / Education Department',
              'युवा विभाग / Youth Department',
              'महिला विभाग / Women Department',
              'खेलकुद विभाग / Sports Department',
            ].map((dept, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6
                }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f9f9f9',
                    borderRadius: 1,
                    borderLeft: 4,
                    borderColor: '#667eea',
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    • {dept}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Note */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            bgcolor: '#fff3e0',
            borderRadius: 2,
            borderLeft: 4,
            borderColor: '#ff9800',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            📝 <strong>नोट / Note:</strong> यो पृष्ठ निर्माणाधीन छ। थप जानकारी चाँडै थपिनेछ।
            <br />
            This page is under construction. More information will be added soon.
          </Typography>
        </Paper>
      </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default OrganizationPage;
