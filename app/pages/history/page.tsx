'use client';

import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Container, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { ArrowDownward, Flag, Gavel, Groups, Public, TrendingUp, VolunteerActivism } from '@mui/icons-material';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const icons = [Flag, Groups, Gavel, TrendingUp, VolunteerActivism, Public];

export default function HistoryPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then((response) => response.json())
      .then((result) => {
        if (result.success && result.data) setPageData(result.data);
        else setPageData(null);
      })
      .catch(() => setPageData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box><Footer /></>;

  if (!pageData)
    return (
      <>
        <Navbar />
        <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', bgcolor: '#f4f1eb' }}>
          <Alert severity="info" sx={{ maxWidth: 540, mx: 'auto' }}>
            No history content has been published yet. Please check back later.
          </Alert>
        </Box>
        <Footer />
      </>
    );

  return <>
    <Navbar />
    <Box sx={{ bgcolor: '#f4f1eb', color: '#17212b', minHeight: '100vh', pb: 10 }}>
      <Box sx={{ bgcolor: '#102c3b', color: 'white', pt: { xs: 8, md: 13 }, pb: { xs: 8, md: 14 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', right: '-8%', top: '-35%', width: 520, height: 520, border: '1px solid rgba(221,91,61,.45)', borderRadius: '50%' }} />
        <Box sx={{ position: 'absolute', right: '5%', top: '-20%', width: 330, height: 330, border: '1px solid rgba(221,91,61,.28)', borderRadius: '50%' }} />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Typography sx={{ color: '#e76f51', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', mb: 2 }}>ANTUF / SINCE 1988</Typography>
          <Typography component="h1" sx={{ fontSize: { xs: '2.8rem', md: '5.5rem' }, lineHeight: .98, fontWeight: 800, maxWidth: 780 }}>{pageData.headerTitle}</Typography>
          <Typography sx={{ fontSize: { xs: '1.25rem', md: '1.65rem' }, mt: 2, color: '#d9e4e8' }}>{pageData.headerTitleEn}</Typography>
          <Typography sx={{ maxWidth: 620, mt: 3, color: '#b9cbd0', fontSize: '1.05rem', lineHeight: 1.8 }}>{pageData.headerSubtitle}</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 6 }}><ArrowDownward sx={{ color: '#e76f51' }} /><Typography sx={{ color: '#d9e4e8' }}>हाम्रो यात्राका मुख्य पड़ावहरू</Typography></Stack>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ mt: { xs: -4, md: -6 }, position: 'relative' }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, bgcolor: '#fffdf9', border: '1px solid #e5ded3', borderRadius: 1 }}>
          <Typography sx={{ maxWidth: 780, fontSize: { xs: '1.15rem', md: '1.4rem' }, lineHeight: 1.8, color: '#3e5058' }}>{pageData.intro}</Typography>
          <Grid container spacing={2} sx={{ mt: 4 }}>{pageData.stats?.map((stat, index) => <Grid key={`${stat.label}-${index}`} size={{ xs: 6, md: 3 }}><Box sx={{ borderTop: '3px solid #e76f51', pt: 2, height: '100%' }}><Typography sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 800, color: '#102c3b' }}>{stat.value}</Typography><Typography sx={{ fontWeight: 700, mt: 1 }}>{stat.label}</Typography><Typography variant="body2" sx={{ color: '#68777b', mt: .5 }}>{stat.description}</Typography></Box></Grid>)}</Grid>
        </Paper>
        <Box sx={{ py: { xs: 8, md: 12 }, maxWidth: 920, mx: 'auto' }}>
          <Stack direction="row" spacing={2} alignItems="end" sx={{ mb: 6 }}><Typography sx={{ color: '#e76f51', fontWeight: 800 }}>01</Typography><Box><Typography component="h2" sx={{ fontSize: { xs: '2rem', md: '3.4rem' }, fontWeight: 800, lineHeight: 1 }}>महत्त्वपूर्ण माइलस्टोनहरू</Typography><Typography sx={{ color: '#718087', mt: 1 }}>The moments that shaped our collective voice.</Typography></Box></Stack>
          <Stack>{pageData.milestones?.map((milestone, index) => { const Icon = icons[index % icons.length]; return <Box key={`${milestone.year}-${index}`} sx={{ display: 'grid', gridTemplateColumns: { xs: '42px 1fr', md: '100px 42px 1fr' }, gap: { xs: 2, md: 3 }, minHeight: 150 }}><Typography sx={{ display: { xs: 'none', md: 'block' }, color: '#e76f51', fontWeight: 800, pt: 1 }}>{milestone.year}</Typography><Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}><Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', bgcolor: '#e76f51', color: 'white', borderRadius: '50%', zIndex: 1 }}><Icon fontSize="small" /></Box><Box sx={{ position: 'absolute', top: 42, bottom: 0, width: 2, bgcolor: '#d8cec1' }} /></Box><Box sx={{ pb: 5 }}><Typography sx={{ display: { xs: 'block', md: 'none' }, color: '#e76f51', fontWeight: 800, mb: .5 }}>{milestone.year}</Typography><Typography sx={{ fontSize: { xs: '1.15rem', md: '1.35rem' }, fontWeight: 800 }}>{milestone.title}</Typography><Typography sx={{ color: '#65747a', mt: 1, lineHeight: 1.7 }}>{milestone.description}</Typography></Box></Box>; })}</Stack>
        </Box>
        <Divider sx={{ borderColor: '#d8cec1' }} />
        <Box sx={{ py: { xs: 7, md: 10 }, maxWidth: 780, mx: 'auto', textAlign: 'center' }}><Typography sx={{ color: '#e76f51', fontWeight: 800, letterSpacing: 1, mb: 2 }}>LOOKING AHEAD</Typography><Typography component="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800 }}>{pageData.visionTitle}</Typography><Typography sx={{ mt: 3, color: '#53656b', lineHeight: 1.9, fontSize: { xs: '1.05rem', md: '1.2rem' } }}>{pageData.vision}</Typography></Box>
      </Container>
    </Box>
    <Footer />
  </>;
}
