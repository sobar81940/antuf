'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowBack, CalendarMonth, LocationOn, Person, Event, Close, ZoomIn } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

type ActivityDetail = {
  _id?: string;
  title?: string;
  description?: string;
  details?: string;
  category?: string;
  date?: string;
  status?: string;
  location?: string;
  organizer?: string;
  image?: string;
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'ongoing': return 'primary';
    case 'completed': return 'success';
    case 'upcoming': return 'warning';
    case 'planned': return 'info';
    default: return 'default';
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'ongoing': return 'जारी / Ongoing';
    case 'completed': return 'सम्पन्न / Completed';
    case 'upcoming': return 'आगामी / Upcoming';
    case 'planned': return 'योजनाबद्ध / Planned';
    default: return status || 'Unknown';
  }
};

export default function ActivityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) {
        setError('Activity not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/admin/activities/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Activity not found');
        }

        const data = await response.json();
        setActivity(data);
      } catch (err) {
        console.error('Error fetching activity detail:', err);
        setError('Unable to load this activity.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  return (
    <Box sx={{ bgcolor: '#f6faf9', minHeight: '100vh', color: '#173b3b' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Button
          startIcon={<ArrowBack />}
          variant="text"
          onClick={() => router.push('/pages/activities')}
          sx={{ mb: 3, color: '#0f766e', fontWeight: 700 }}
        >
          Back to Activities
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error || !activity ? (
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {error || 'Activity not found'}
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 3 }}>
            <Box sx={{ p: { xs: 2.5, md: 4 }, pb: { xs: 2, md: 3 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {activity.title}
                </Typography>
                <Chip label={getStatusLabel(activity.status)} color={getStatusColor(activity.status)} sx={{ fontWeight: 700 }} />
              </Stack>

              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 3, color: '#356168' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Event fontSize="small" /> {activity.category || 'General'}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CalendarMonth fontSize="small" /> {activity.date || 'Date not specified'}
                </Typography>
                {activity.location && (
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <LocationOn fontSize="small" /> {activity.location}
                  </Typography>
                )}
                {activity.organizer && (
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Person fontSize="small" /> {activity.organizer}
                  </Typography>
                )}
              </Stack>
            </Box>

            {activity.image && (
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={activity.image}
                  alt={activity.title}
                  sx={{
                    width: '100%',
                    height: { xs: 280, md: 460 },
                    display: 'block',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    backgroundColor: '#e5e7eb',
                  }}
                />

                <Button
                  variant="contained"
                  startIcon={<ZoomIn />}
                  onClick={() => setImageOpen(true)}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    bottom: 16,
                    borderRadius: 999,
                    background: 'rgba(15, 118, 110, 0.9)',
                    color: 'white',
                    '&:hover': { background: 'rgba(13, 92, 86, 0.96)' },
                  }}
                >
                  Full Image
                </Button>
              </Box>
            )}

            <Box sx={{ p: { xs: 2.5, md: 4 } }}>

              <Divider sx={{ mb: 3 }} />

              <Box
                className="activity-rich-content"
                sx={{
                  lineHeight: 1.9,
                  fontSize: '1.05rem',
                  color: '#1f2937',
                  mb: 3,
                  '& h1, & h2, & h3': { color: '#173b3b', fontWeight: 700, mt: 3, mb: 1.5, lineHeight: 1.3 },
                  '& h1, & h2': { fontSize: '1.6rem' },
                  '& h3': { fontSize: '1.3rem' },
                  '& p': { my: 1.5, mt: 0 },
                  '& ul, & ol': { pl: 4, my: 1.5 },
                  '& li': { mb: 0.5 },
                  '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2, my: 2 },
                  '& blockquote': { borderLeft: '4px solid #0f766e', ml: 0, pl: 2, my: 2, color: '#475569', fontStyle: 'italic' },
                  '& a': { color: '#0f766e', fontWeight: 700 },
                  '& pre': { bgcolor: '#0f172a', color: '#f8fafc', p: 2, borderRadius: 1, overflow: 'auto' },
                }}
                dangerouslySetInnerHTML={{ __html: activity.description || '' }}
              />

              {activity.details && (
                <Box sx={{ bgcolor: '#f3f8f7', borderRadius: 2, p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Details
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {activity.details}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Container>
      <Footer />

      <Dialog
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(15, 23, 42, 0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <IconButton
            onClick={() => setImageOpen(false)}
            sx={{ position: 'absolute', top: 16, right: 16, color: 'white', backgroundColor: 'rgba(15,23,42,0.55)', '&:hover': { backgroundColor: 'rgba(15,23,42,0.8)' } }}
            aria-label="Close image"
          >
            <Close />
          </IconButton>
          {activity?.image && (
            <Box
              component="img"
              src={activity.image}
              alt={activity.title}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: '0 18px 60px rgba(0,0,0,0.45)',
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
