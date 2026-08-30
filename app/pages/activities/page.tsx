'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  Tabs,
  Tab,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  EmojiEvents as EventsIcon,
  School as SchoolIcon,
  VolunteerActivism as VolunteerIcon,
  Campaign as CampaignIcon,
  LocalHospital as HealthIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { stripHtml } from '@/utility/richText';

type ActivityItem = {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  status?: string;
  location?: string;
  organizer?: string;
};

const categoryMeta: Record<string, { icon: React.ReactElement; label: string }> = {
  'शैक्षिक / Education': { icon: <SchoolIcon />, label: 'शैक्षिक / Education' },
  'सामाजिक / Social': { icon: <VolunteerIcon />, label: 'सामाजिक / Social' },
  'स्वास्थ्य / Health': { icon: <HealthIcon />, label: 'स्वास्थ्य / Health' },
  'जागरुकता / Awareness': { icon: <CampaignIcon />, label: 'जागरुकता / Awareness' },
  'अन्य / Other': { icon: <EventsIcon />, label: 'अन्य / Other' },
};

const defaultGroups = Object.entries(categoryMeta).map(([category, meta]) => ({
  category,
  icon: meta.icon,
  items: [] as ActivityItem[],
}));

const ActivitiesPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [groups, setGroups] = useState<{ category: string; icon: React.ReactNode; items: ActivityItem[] }[]>(defaultGroups);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/activities', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to load activities');
        }

        const data = await response.json();
        const activityList = Array.isArray(data) ? data : data.data || [];

        const groupedMap = new Map<string, ActivityItem[]>();
        activityList.forEach((activity: ActivityItem) => {
          const category = activity.category || 'अन्य / Other';
          if (!groupedMap.has(category)) {
            groupedMap.set(category, []);
          }
          groupedMap.get(category)?.push(activity);
        });

        const groupedData = defaultGroups
          .map((group) => ({
            ...group,
            items: groupedMap.get(group.category) || [],
          }))
          .filter((group) => group.items.length > 0);

        setGroups(groupedData.length > 0 ? groupedData : []);
      } catch (loadError) {
        console.error('Error loading activities:', loadError);
        setError('Unable to load activities right now.');
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const visibleGroups = useMemo(() => groups, [groups]);
  const allItems = useMemo(() => visibleGroups.flatMap((group) => group.items), [visibleGroups]);

  useEffect(() => {
    if (visibleGroups.length === 0 || activeTab >= visibleGroups.length) {
      setActiveTab(0);
    }
  }, [activeTab, visibleGroups]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ongoing':
        return 'primary';
      case 'completed':
        return 'success';
      case 'upcoming':
        return 'warning';
      case 'planned':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'ongoing':
        return 'जारी / Ongoing';
      case 'completed':
        return 'सम्पन्न / Completed';
      case 'upcoming':
        return 'आगामी / Upcoming';
      case 'planned':
        return 'योजनाबद्ध / Planned';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <Box sx={{ bgcolor: '#f6faf9', minHeight: '100vh', color: '#173b3b' }}>
      <Navbar />
      <Box component="main">
        <Box
          sx={{
            background: 'linear-gradient(120deg, #063f3d 0%, #0f766e 62%, #f59e0b 160%)',
            color: 'white',
            py: { xs: 5, md: 7 },
          }}
        >
          <Container maxWidth="lg">
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
                onClick={() => router.push('/pages')}
                color="rgba(255,255,255,.78)"
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
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            </Paper>
          ) : visibleGroups.length === 0 ? (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                No activities available yet.
              </Typography>
            </Paper>
          ) : (
            <>
              <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      minHeight: 64,
                      fontWeight: 600,
                    },
                  }}
                >
                  {visibleGroups.map((category, index) => (
                    <Tab
                      key={`${category.category}-${index}`}
                      label={category.category}
                      icon={categoryMeta[category.category]?.icon || <EventsIcon />}
                      iconPosition="start"
                    />
                  ))}
                </Tabs>
              </Paper>

              {visibleGroups.map((category, categoryIndex) => (
                <Box
                  key={`${category.category}-${categoryIndex}`}
                  sx={{ display: activeTab === categoryIndex ? 'block' : 'none' }}
                >
                  <Grid container spacing={3}>
                    {category.items.map((activity, activityIndex) => (
                      <Grid key={`${activity._id || activity.title || activityIndex}`} size={{ xs: 12, md: 6 }}>
                        <Card
                          elevation={2}
                          onClick={() => activity._id && router.push(`/pages/activities/${activity._id}`)}
                          sx={{
                            height: '100%',
                            transition: 'all 0.3s ease',
                            cursor: activity._id ? 'pointer' : 'default',
                            '&:hover': {
                              transform: activity._id ? 'translateY(-4px)' : 'none',
                              boxShadow: activity._id ? 6 : 2,
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2, gap: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                                {activity.title || 'Untitled Activity'}
                              </Typography>
                              <Chip
                                label={getStatusLabel(activity.status)}
                                color={getStatusColor(activity.status)}
                                size="small"
                              />
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              paragraph
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {stripHtml(activity.description) || 'No description available.'}
                            </Typography>

                            {activity.location && (
                              <Typography variant="body2" sx={{ mb: 1, color: '#356168' }}>
                                📍 {activity.location}
                              </Typography>
                            )}

                            {activity.organizer && (
                              <Typography variant="body2" sx={{ mb: 1, color: '#356168' }}>
                                👤 {activity.organizer}
                              </Typography>
                            )}

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
                                📅 {activity.date || 'Date not specified'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}

              <Paper elevation={2} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  गतिविधि सारांश / Activity Summary
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {allItems.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        कुल कार्यक्रम / Total Programs
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {allItems.filter((item) => item.status === 'completed').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        सम्पन्न / Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#ff9800' }}>
                        {allItems.filter((item) => item.status === 'ongoing').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        जारी / Ongoing
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: '#2196f3' }}>
                        {allItems.filter((item) => item.status === 'planned' || item.status === 'upcoming').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        योजनाबद्ध / Planned
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ActivitiesPage;
