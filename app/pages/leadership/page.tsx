'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  ErrorOutline as ErrorOutlineIcon,
  PersonOff as PersonOffIcon,
} from '@mui/icons-material';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const COLORS = {
  navy: '#102c3b',
  green: '#16866d',
  coral: '#e76f51',
  cream: '#f4f1eb',
  gray: '#68777b',
};

type Representative = {
  _id: string;
  name: string;
  nameEn: string;
  position: string;
  positionEn: string;
  email: string;
  phone?: string;
  location?: string;
  locationEn?: string;
  image?: string;
  bio?: string;
  bioEn?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  displayOrder?: number;
};

const FEATURED_POSITION = 'अध्यक्ष';

export default function RepresentativesPage() {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepresentatives = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/representatives');
        const data = await response.json();
        if (data.success) {
          setRepresentatives(data.data || []);
          setError(null);
        } else {
          setError('प्रतिनिधिहरू लोड गर्न सकिएन / Failed to load representatives');
        }
      } catch (err) {
        console.error('Error fetching representatives:', err);
        setError('प्रतिनिधिहरू लोड गर्न सकिएन / Failed to load representatives');
      } finally {
        setLoading(false);
      }
    };
    fetchRepresentatives();
  }, []);

  const { featured, members } = useMemo(() => {
    const lead = representatives.find((rep) => rep.position === FEATURED_POSITION);
    return {
      featured: lead || null,
      members: lead ? representatives.filter((rep) => rep._id !== lead._id) : representatives,
    };
  }, [representatives]);

  const contactRowSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    color: COLORS.gray,
    fontSize: '.9rem',
    minWidth: 0,
    '& svg': { fontSize: 18, color: COLORS.green, flexShrink: 0 },
    '& a': { color: COLORS.gray, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', '&:hover': { color: COLORS.green } },
  } as const;

  const renderSocials = (rep: Representative, size: 'small' | 'medium' = 'small') => {
    const links = [
      { href: rep.facebook, icon: <FacebookIcon fontSize={size === 'small' ? 'small' : 'medium'} />, label: 'Facebook', hover: '#1877f2' },
      { href: rep.twitter, icon: <TwitterIcon fontSize={size === 'small' ? 'small' : 'medium'} />, label: 'Twitter', hover: '#1da1f2' },
      { href: rep.linkedin, icon: <LinkedInIcon fontSize={size === 'small' ? 'small' : 'medium'} />, label: 'LinkedIn', hover: '#0077b5' },
      { href: rep.instagram, icon: <InstagramIcon fontSize={size === 'small' ? 'small' : 'medium'} />, label: 'Instagram', hover: '#e4405f' },
    ].filter((link) => link.href);
    if (!links.length) return null;
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {links.map((link) => (
          <IconButton
            key={link.label}
            component="a"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${rep.nameEn} on ${link.label}`}
            size={size === 'small' ? 'small' : 'medium'}
            sx={{ color: COLORS.gray, border: '1px solid #e3ded4', borderRadius: 2, transition: 'all .2s', '&:hover': { color: '#fff', bgcolor: link.hover, borderColor: link.hover } }}
          >
            {link.icon}
          </IconButton>
        ))}
      </Box>
    );
  };

  const renderContacts = (rep: Representative, showLocation = true) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>
      <Box sx={contactRowSx}>
        <EmailIcon />
        <a href={`mailto:${rep.email}`}>{rep.email}</a>
      </Box>
      {rep.phone && (
        <Box sx={contactRowSx}>
          <PhoneIcon />
          <a href={`tel:${rep.phone.replace(/[^+\d]/g, '')}`}>{rep.phone}</a>
        </Box>
      )}
      {showLocation && rep.location && (
        <Box sx={contactRowSx}>
          <LocationIcon />
          <Typography component="span" sx={{ fontSize: '.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {rep.location}{rep.locationEn ? ` · ${rep.locationEn}` : ''}
          </Typography>
        </Box>
      )}
    </Box>
  );


  return (
    <>
      <Navbar />

      <Box component="main" sx={{ bgcolor: COLORS.cream, minHeight: '100vh' }}>
        {/* Hero */}
        <Box sx={{ bgcolor: COLORS.navy, py: { xs: 7, md: 10 }, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', right: -80, top: -80, width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(22,134,109,.18)' }} />
          <Box sx={{ position: 'absolute', left: -60, bottom: -120, width: 260, height: 260, borderRadius: '50%', bgcolor: 'rgba(231,111,81,.15)' }} />
          <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <Typography sx={{ color: COLORS.coral, fontWeight: 800, letterSpacing: 2, mb: 1 }}>OUR REPRESENTATIVES</Typography>
            <Typography component="h1" sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '2.2rem', md: '3.2rem' }, lineHeight: 1.15 }}>
             नेतृत्व
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,.75)', mt: 2, maxWidth: 720 }}>
              ANTUF को नेतृत्व टोली — श्रमिक अधिकार र सामाजिक न्यायका लागि समर्पित।
              Dedicated leadership working for workers&apos; rights and social justice.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
          {/* Loading state */}
          {loading && (
            <Box>
              <Skeleton variant="rounded" height={260} sx={{ mb: 4, bgcolor: 'rgba(16,44,59,.06)' }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <Skeleton key={n} variant="rounded" height={380} sx={{ bgcolor: 'rgba(16,44,59,.06)' }} />
                ))}
              </Box>
            </Box>
          )}

          {/* Error state */}
          {!loading && error && (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <ErrorOutlineIcon sx={{ fontSize: 56, color: COLORS.coral, mb: 2 }} />
              <Typography variant="h6" sx={{ color: COLORS.navy, fontWeight: 700, mb: 1 }}>{error}</Typography>
              <Typography sx={{ color: COLORS.gray }}>Please try again later.</Typography>
            </Box>
          )}

          {/* Empty state */}
          {!loading && !error && representatives.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <PersonOffIcon sx={{ fontSize: 56, color: COLORS.gray, mb: 2 }} />
              <Typography variant="h6" sx={{ color: COLORS.navy, fontWeight: 700, mb: 1 }}>
                कुनै प्रतिनिधि फेला परेन
              </Typography>
              <Typography sx={{ color: COLORS.gray }}>No representatives found. Please check back later.</Typography>
            </Box>
          )}

          {/* Featured representative (President) */}
          {!loading && !error && featured && (
            <Card
              elevation={0}
              sx={{
                mb: 6,
                borderRadius: 3,
                overflow: 'hidden',
                display: { xs: 'block', md: 'flex' },
                bgcolor: '#fff',
                border: '1px solid rgba(16,44,59,.08)',
                boxShadow: '0 12px 32px rgba(16,44,59,.08)',
              }}
            >
              <Box sx={{ width: { xs: '100%', md: 340 }, flexShrink: 0, position: 'relative', '& img': { width: '100%', height: { xs: 320, md: '100%' }, minHeight: { md: 320 }, objectFit: 'cover', display: 'block' } }}>
                <img src={featured.image} alt={featured.nameEn || featured.name} />
              </Box>
              <CardContent sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <Box>
                  <Chip
                    label={featured.positionEn || featured.position}
                    sx={{ bgcolor: COLORS.coral, color: '#fff', fontWeight: 700, letterSpacing: 0.5, mb: 1.5 }}
                  />
                  <Typography component="h2" sx={{ color: COLORS.navy, fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' }, lineHeight: 1.2 }}>
                    {featured.name}
                  </Typography>
                  <Typography sx={{ color: COLORS.gray, fontWeight: 500 }}>{featured.nameEn}</Typography>
                </Box>
                {(featured.bio || featured.bioEn) && (
                  <Typography sx={{ color: COLORS.gray, fontSize: '.95rem' }}>{featured.bio || featured.bioEn}</Typography>
                )}
                {renderContacts(featured)}
                {renderSocials(featured, 'medium')}
              </CardContent>
            </Card>
          )}


          {/* Members grid */}
          {!loading && !error && members.length > 0 && (
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography component="h2" sx={{ color: COLORS.navy, fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.8rem' } }}>
                कार्यसमिति सदस्यहरू
              </Typography>
              <Typography sx={{ color: COLORS.gray, fontSize: '.95rem' }}>Committee Members · {members.length}</Typography>
            </Box>
          )}

          {!loading && !error && members.length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {members.map((rep) => (
                <Card
                  key={rep._id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: '#fff',
                    border: '1px solid rgba(16,44,59,.08)',
                    boxShadow: '0 12px 32px rgba(16,44,59,.08)',
                    transition: 'transform .25s ease, box-shadow .25s ease',
                    '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 16px 36px rgba(16,44,59,.12)' },
                  }}
                >
                  <Box sx={{ position: 'relative', '& img': { width: '100%', height: { xs: 260, sm: 280, md: 300 }, objectFit: 'cover', display: 'block' } }}>
                    <img src={rep.image} alt={rep.nameEn || rep.name} loading="lazy" />
                  </Box>
                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0 }}>
                    <Box>
                      <Chip
                        label={rep.positionEn || rep.position}
                        sx={{ bgcolor: COLORS.coral, color: '#fff', fontWeight: 700, letterSpacing: 0.5, mb: 1.5 }}
                      />
                      <Typography component="h3" sx={{ color: COLORS.navy, fontWeight: 800, fontSize: { xs: '1.15rem', md: '1.3rem' }, lineHeight: 1.2 }}>
                        {rep.name}
                      </Typography>
                      <Typography sx={{ color: COLORS.gray, fontWeight: 500 }}>{rep.nameEn}</Typography>
                    </Box>
                    {(rep.bio || rep.bioEn) && (
                      <Typography sx={{ color: COLORS.gray, fontSize: '.9rem' }}>{rep.bio || rep.bioEn}</Typography>
                    )}
                    {renderContacts(rep)}
                    {renderSocials(rep)}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Call to action */}
          {!loading && !error && representatives.length > 0 && (
            <Card
              elevation={0}
              sx={{
                mt: 7,
                borderRadius: 3,
                textAlign: 'center',
                py: { xs: 5, md: 6 },
                px: 3,
                bgcolor: COLORS.green,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'absolute', right: -60, top: -60, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,.08)' }} />
              <Box sx={{ position: 'absolute', left: -40, bottom: -80, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(16,44,59,.15)' }} />
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, mb: 1.5, position: 'relative' }}>
                हामीसँग सम्पर्क राख्नुहोस्
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,.85)', mb: 2, position: 'relative' }}>
                श्रमिक अधिकार र सेवासम्बन्धी जानकारीका लागि हामीलाई सम्पर्क गर्नुहोस्।
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: { xs: 2, sm: 4 }, color: 'rgba(255,255,255,.9)', position: 'relative' }}>
                <Box component="a" href="mailto:info@antuf.org.np" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none', '&:hover': { color: '#fff' } }}>
                  <EmailIcon fontSize="small" /> info@antuf.org.np
                </Box>
                <Box component="a" href="tel:+97714612758" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none', '&:hover': { color: '#fff' } }}>
                  <PhoneIcon fontSize="small" /> +977-1-4612758
                </Box>
              </Box>
            </Card>
          )}
        </Container>
      </Box>

      <Footer />
    </>
  );
}

