'use client';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Stack,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #E8F5E9 0%, #E3F2FD 100%)',
        py: 6,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={4} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Success Header */}
          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
              py: 6,
              px: 4,
              textAlign: 'center',
              color: 'white'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              सफलतापूर्वक सबमिट भयो!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Successfully Submitted!
            </Typography>
          </Box>

          {/* Success Content */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', mb: 2 }}>
                ANTUF मा सामेल हुनुभएकोमा धन्यवाद
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mb: 1 }}>
                Thank you for joining All Nepal Trade Union Federation
              </Typography>
            </Box>

            <Card sx={{ mb: 3, bgcolor: '#E3F2FD', border: '2px solid #1976d2' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', mb: 2 }}>
                  अर्को चरण | Next Steps:
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ mr: 1, color: '#2e7d32', fontWeight: 'bold' }}>✓</Typography>
                    <Typography variant="body2">
                      तपाईंको आवेदन प्राप्त भएको छ र समीक्षाधीन छ।
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ mr: 1, color: '#2e7d32', fontWeight: 'bold' }}>✓</Typography>
                    <Typography variant="body2">
                      Your application has been received and is under review.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ mr: 1, color: '#2e7d32', fontWeight: 'bold' }}>✓</Typography>
                    <Typography variant="body2">
                      हामी छिट्टै तपाईंलाई सम्पर्क गर्नेछौं।
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography sx={{ mr: 1, color: '#2e7d32', fontWeight: 'bold' }}>✓</Typography>
                    <Typography variant="body2">
                      We will contact you shortly.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ mb: 4, bgcolor: '#FFF9C4', border: '2px solid #FBC02D' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#F57C00', mb: 2 }}>
                  ध्यान दिनुहोस् | Please Note:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  कृपया आफ्नो इमेल र फोन नम्बर नियमित रूपमा जाँच गर्नुहोस्। 
                  हामी तपाईंलाई सदस्यता सम्बन्धी जानकारी पठाउनेछौं।
                </Typography>
                <Typography variant="body2">
                  Please regularly check your email and phone. 
                  We will send you membership-related information.
                </Typography>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ mb: 4, justifyContent: 'center' }}
            >
              <Button
                component={Link}
                href="/dashboard/user"
                variant="contained"
                size="large"
                startIcon={<DashboardIcon />}
                sx={{ 
                  py: 1.5,
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                  }
                }}
              >
                ड्यासबोर्डमा जानुहोस् | Go to Dashboard
              </Button>
              <Button
                component={Link}
                href="/events"
                variant="outlined"
                size="large"
                startIcon={<EventIcon />}
                sx={{ 
                  py: 1.5,
                  px: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                कार्यक्रम हेर्नुहोस् | View Events
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Contact Info */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                प्रश्नहरू छन्? | Have questions?
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2' }}>
                सम्पर्क: info@antuf.org | फोन: +977-01-XXXXXXX
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}