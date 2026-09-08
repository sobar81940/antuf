'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Slide,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(
  props: React.ComponentProps<typeof Slide>,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PresidentMessage({ externalOpen, onExternalClose }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the message in this session
    const hasSeenMessage = sessionStorage.getItem('hasSeenPresidentMessage');
    
    if (!hasSeenMessage) {
      // Show message after 1 second delay
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem('hasSeenPresidentMessage', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Handle external open state
  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
    }
  }, [externalOpen]);

  const handleClose = () => {
    setOpen(false);
    if (onExternalClose) {
      onExternalClose();
    }
  };

  const handleReadMore = () => {
    // Navigate to full message page or scroll to message section
    window.location.href = '/about#president-message';
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header with gradient background */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 2,
          px: 3,
          position: 'relative',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '0.5px',
          }}
        >
          MESSAGE FROM PRESIDENT
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4, bgcolor: '#f9fafb' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'flex-start' }}>
          {/* President Photo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: { xs: '100%', sm: 'auto' } }}>
            <Paper
              elevation={4}
              sx={{
                p: 1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <Avatar
                src="/images/og-default.jpg"
                alt="President"
                sx={{
                  width: { xs: 150, sm: 200 },
                  height: { xs: 150, sm: 200 },
                  border: '4px solid white',
                }}
              />
            </Paper>
          </Box>

          {/* Message Content */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: '#374151',
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  fontSize: '15px',
                  mb: 2,
                }}
              >
                Every year about half million work force enters into labour market in Nepal but their employment security is hardly discussed in parliament. The lack of implementation of existing labour laws, and apathy of government, employers and political parties, have often complicated the working condition of thousands of workers in Nepal...
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 2,
                  bgcolor: '#eff6ff',
                  borderRadius: 2,
                  borderLeft: '4px solid #3b82f6',
                }}
              >
                <InfoIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Click "Read More" to view the complete message and learn about our mission for workers' rights in Nepal.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 4,
          pb: 3,
          pt: 2,
          bgcolor: '#f9fafb',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            fontWeight: 600,
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleReadMore}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
            },
          }}
        >
          Read More
        </Button>
      </DialogActions>
    </Dialog>
  );
}
