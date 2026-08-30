'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, IconButton, MenuItem, Paper, Collapse } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/navigation';

// Static fallback items used if the API is unavailable
const FALLBACK_ITEMS = [
  { label: 'हाम्रो बारेमा', labelEn: 'About Us', path: '/pages/about', children: [
    { label: 'परिचय', labelEn: 'Introduction', path: '/pages/about' },
    { label: 'इतिहास', labelEn: 'History', path: '/pages/history' },
    { label: 'संगठन संरचना', labelEn: 'Organization', path: '/pages/organization' },
  ]},
  { label: 'गतिविधि', labelEn: 'Activities', path: '/pages/activities', children: [
    { label: 'सबै गतिविधि', labelEn: 'All Activities', path: '/pages/activities' },
    { label: 'कार्यक्रम', labelEn: 'Events', path: '/events' },
  ]},
  { label: 'संगठन', labelEn: 'Organization', path: '/pages/organization', children: [
    { label: 'संगठन संरचना', labelEn: 'Org Structure', path: '/pages/organization' },
    { label: 'सम्बद्ध संगठन', labelEn: 'Affiliates', path: '/pages/affiliates' },
  ]},
  { label: 'नेतृत्व', labelEn: 'Representatives', path: '/pages/representatives', children: [] },
  { label: 'इतिहास', labelEn: 'History', path: '/pages/history', children: [] },
  { label: 'दस्तावेज', labelEn: 'Documents', path: '/pages/documents', children: [] },
  { label: 'डाउनलोड', labelEn: 'Downloads', path: '/downloads', children: [] },
  { label: 'सम्पर्क', labelEn: 'Contact', path: '/pages/contact', children: [] },
];

const btnSx = {
  color: 'white',
  fontWeight: 600,
  fontSize: { xs: '12px', sm: '13px', md: '14px' },
  px: { xs: 1.5, md: 2 },
  py: 1,
  borderRadius: 2,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '3px',
    backgroundColor: 'white',
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-2px)',
    '&::before': { transform: 'translateX(0)' },
  },
};

function NavItem({ item, router }) {
  const hasChildren = item.children && item.children.length > 0;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!hasChildren) {
    return (
      <Button sx={btnSx} onClick={() => item.path && router.push(item.path)}>
        {item.label}
      </Button>
    );
  }

  return (
    <Box ref={ref} sx={{ position: 'relative' }}>
      <Button
        sx={{ ...btnSx, gap: 0.5 }}
        onClick={() => setOpen((v) => !v)}
        endIcon={
          <KeyboardArrowDownIcon
            sx={{
              fontSize: '1rem !important',
              transition: 'transform 0.3s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        }
      >
        {item.label}
      </Button>

      {open && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: 200,
            zIndex: 2000,
            borderRadius: 2,
            overflow: 'hidden',
            mt: 0.5,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}
        >
          {/* If item itself also has a path, show it as first child */}
          {item.path && (
            <MenuItem
              onClick={() => { router.push(item.path); setOpen(false); }}
              sx={{
                fontWeight: 600,
                color: '#c0392b',
                fontSize: '0.95rem',
                borderBottom: '1px solid #f3f4f6',
                '&:hover': { bgcolor: '#fef2f2' },
              }}
            >
              {item.labelEn || item.label} (All)
            </MenuItem>
          )}
          {item.children.map((child, i) => (
            <MenuItem
              key={i}
              onClick={() => { child.path && router.push(child.path); setOpen(false); }}
              sx={{
                fontSize: '0.9rem',
                color: '#374151',
                '&:hover': { bgcolor: '#fef2f2', color: '#c0392b' },
              }}
            >
              {child.label}
            </MenuItem>
          ))}
        </Paper>
      )}
    </Box>
  );
}

const ScrollableTabs = () => {
  const router = useRouter();
  const [navItems, setNavItems] = useState<Record<string, any>[]>(FALLBACK_ITEMS);

  useEffect(() => {
    fetch('/api/navmenu')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.length > 0) setNavItems(json.data);
      })
      .catch(() => {}); // silently fall back to static list
  }, []);

  return (
    <Box sx={{ justifyContent: 'center' }}>
      <Box
        sx={{
          backgroundColor: 'error.main',
          py: 0.5,
          px: 3,
          display: 'flex',
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          {/* Home icon */}
          <IconButton
            onClick={() => router.push('/')}
            sx={{
              color: 'white',
              display: { xs: 'none', md: 'flex' },
              padding: '12px',
              transition: 'all 0.3s ease',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)', transform: 'scale(1.1)' },
              '& .MuiSvgIcon-root': { fontSize: '2rem' },
            }}
          >
            <HomeIcon />
          </IconButton>

          {/* Dynamic menu items */}
          {navItems.map((item, i) => (
            <NavItem key={item._id || i} item={item} router={router} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ScrollableTabs;
