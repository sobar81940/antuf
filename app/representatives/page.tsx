'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export default function RepresentativesPage() {
  const [representatives, setRepresentatives] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchRepresentatives = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/representatives');
        const data = await response.json();

        if (data.success) {
          setRepresentatives(data.data);
        } else {
          setError('Failed to load representatives');
        }
      } catch (err) {
        console.error('Error fetching representatives:', err);
        setError('Failed to load representatives');
      } finally {
        setLoading(false);
      }
    };

    fetchRepresentatives();
  }, []);

  return (
    <>
      <Navbar />

      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 6 }}>
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 8,
            mb: 6,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
              }}
            >
              जनप्रतिनिधिहरू
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                mb: 1,
              }}
            >
              Our Representatives
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              ANTUF को नेतृत्व टोली - श्रमिक अधिकार र सामाजिक न्यायका लागि समर्पित
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Loading representatives...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Box sx={{ bgcolor: '#fff3e0', p: 4, borderRadius: 2, textAlign: 'center', mb: 4 }}>
              <Typography variant="h6" color="error" gutterBottom>
                {error}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please try again later or contact support.
              </Typography>
            </Box>
          )}

          {/* Empty State */}
          {!loading && !error && representatives.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No representatives found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please check back later.
              </Typography>
            </Box>
          )}

          {/* Representatives Grid */}
          {!loading && !error && representatives.length > 0 && (
            <Grid container spacing={4}>
              {representatives.map((rep) => (
                <Grid
                  key={rep._id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4
                  }}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: 8,
                      },
                    }}
                  >
                    {/* Profile Header */}
                    <Box
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        pt: 4,
                        pb: 8,
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <Avatar
                        src={rep.image}
                        alt={rep.name}
                        sx={{
                          width: 120,
                          height: 120,
                          border: '5px solid white',
                          boxShadow: 3,
                        }}
                      />
                    </Box>

                    <CardContent sx={{ mt: -4, pt: 5 }}>
                      {/* Position Badge */}
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Chip
                          icon={<WorkIcon />}
                          label={rep.position}
                          color="primary"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                        />
                      </Box>

                      {/* Name */}
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          textAlign: 'center',
                          mb: 0.5,
                          color: '#1f2937',
                        }}
                      >
                        {rep.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: 'center',
                          color: '#6b7280',
                          mb: 2,
                        }}
                      >
                        {rep.nameEn}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      {/* Bio */}
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: 'center',
                          color: '#6b7280',
                          mb: 3,
                          fontStyle: 'italic',
                          minHeight: 60,
                        }}
                      >
                        {rep.bio}
                      </Typography>

                      {/* Contact Info */}
                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: '#f9fafb',
                          p: 2,
                          borderRadius: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <EmailIcon sx={{ fontSize: 18, color: '#667eea' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                            {rep.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <PhoneIcon sx={{ fontSize: 18, color: '#667eea' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                            {rep.phone}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon sx={{ fontSize: 18, color: '#667eea' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                            {rep.location}
                          </Typography>
                        </Box>
                      </Paper>

                      {/* Social Media & Website */}
                      {(rep.website || rep.facebook || rep.twitter || rep.linkedin || rep.instagram) && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                          {rep.website && (
                            <Chip
                              icon={<LanguageIcon />}
                              label="Website"
                              component="a"
                              href={rep.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              clickable
                              sx={{
                                bgcolor: '#667eea',
                                color: 'white',
                                '&:hover': { bgcolor: '#5568d3' },
                              }}
                            />
                          )}
                          {rep.facebook && (
                            <Chip
                              icon={<FacebookIcon />}
                              label="Facebook"
                              component="a"
                              href={rep.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              clickable
                              sx={{
                                bgcolor: '#1877f2',
                                color: 'white',
                                '&:hover': { bgcolor: '#166fe5' },
                              }}
                            />
                          )}
                          {rep.twitter && (
                            <Chip
                              icon={<TwitterIcon />}
                              label="Twitter"
                              component="a"
                              href={rep.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              clickable
                              sx={{
                                bgcolor: '#1da1f2',
                                color: 'white',
                                '&:hover': { bgcolor: '#1a94da' },
                              }}
                            />
                          )}
                          {rep.linkedin && (
                            <Chip
                              icon={<LinkedInIcon />}
                              label="LinkedIn"
                              component="a"
                              href={rep.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              clickable
                              sx={{
                                bgcolor: '#0077b5',
                                color: 'white',
                                '&:hover': { bgcolor: '#006699' },
                              }}
                            />
                          )}
                          {rep.instagram && (
                            <Chip
                              icon={<InstagramIcon />}
                              label="Instagram"
                              component="a"
                              href={rep.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              clickable
                              sx={{
                                bgcolor: '#e4405f',
                                color: 'white',
                                '&:hover': { bgcolor: '#d62952' },
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Call to Action */}
          <Paper
            elevation={3}
            sx={{
              mt: 6,
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
              हामीसँग सम्पर्क राख्नुहोस्
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
              श्रमिक अधिकार र सेवासम्बन्धी जानकारीका लागि हामीलाई सम्पर्क गर्नुहोस्।
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              📧 info@antuf.org.np | 📞 +977-1-4567890
            </Typography>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </>
  );
}
