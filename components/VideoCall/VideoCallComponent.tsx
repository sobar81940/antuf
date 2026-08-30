"use client";

import React, { useEffect, useState } from 'react';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  CallParticipantsList,
  CallStats,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// Helper function to sanitize user ID for GetStream
// GetStream only allows: a-z, 0-9, @, _, and -
const sanitizeUserId = (userId) => {
  if (!userId) return 'user_' + Date.now();
  
  // Convert to string and sanitize
  let sanitized = String(userId)
    .toLowerCase()
    .replace(/[^a-z0-9@_-]/g, '_'); // Replace invalid chars with underscore
  
  // Ensure it doesn't start with a number (optional safety check)
  if (/^\d/.test(sanitized)) {
    sanitized = 'user_' + sanitized;
  }
  
  // Ensure minimum length
  if (sanitized.length < 3) {
    sanitized = 'user_' + sanitized + '_' + Date.now();
  }
  
  return sanitized;
};

const VideoCallComponent = ({
  open,
  onClose,
  callId,
  callType = 'default',
  participantName,
  participantImage,
}) => {
  const { data: session } = useSession();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!open || !session?.user) return;

    const initializeCall = async () => {
      try {
        setLoading(true);
        setError(null);

        // Sanitize user ID for GetStream (only a-z, 0-9, @, _, - allowed)
        const rawUserId = session.user.id || session.user.email || session.user.name;
        const userId = sanitizeUserId(rawUserId);

        // Get call configuration from API
        const response = await fetch('/api/video-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callId, callType, userId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to initialize call');
        }

        const config = await response.json();
        
        // Create StreamVideoClient
        const videoClient = new StreamVideoClient({
          apiKey: config.apiKey,
          user: {
            id: userId,
            name: session.user.name || 'User',
            image: session.user.image,
          },
          tokenProvider: async () => {
            try {
              console.log('Fetching token for user:', userId);
              
              const tokenResponse = await fetch('/api/video-call/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
              });
              
              if (!tokenResponse.ok) {
                const errorData = await tokenResponse.json();
                console.error('Token fetch failed:', errorData);
                throw new Error(errorData.error || 'Failed to fetch token');
              }
              
              const data = await tokenResponse.json();
              console.log('Token received successfully');
              
              if (!data.token) {
                throw new Error('Token not received from server');
              }
              
              return data.token;
            } catch (error) {
              console.error('TokenProvider error:', error);
              throw error;
            }
          },
        });

        // Connect the user first (critical step!)
        console.log('Connecting user with ID:', userId);
        
        await videoClient.connectUser(
          {
            id: userId,
            name: session.user.name || 'User',
            image: session.user.image,
          },
          async () => {
            try {
              console.log('connectUser: Fetching token for user:', userId);
              
              const tokenResponse = await fetch('/api/video-call/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
              });
              
              if (!tokenResponse.ok) {
                const errorData = await tokenResponse.json();
                console.error('connectUser: Token fetch failed:', errorData);
                throw new Error(errorData.error || 'Failed to fetch token for connection');
              }
              
              const data = await tokenResponse.json();
              console.log('connectUser: Token received successfully');
              
              if (!data.token) {
                throw new Error('Token not received from server');
              }
              
              return data.token;
            } catch (error) {
              console.error('connectUser tokenProvider error:', error);
              throw error;
            }
          }
        );

        console.log('User connected successfully');
        setClient(videoClient);

        // Now join or create the call
        const videoCall = videoClient.call(callType, callId);
        
        await videoCall.join({
          create: true,
          data: {
            members: [{ user_id: userId }],
            custom: {
              chatId: callId,
              participantName,
            },
          },
        });

        setCall(videoCall);
        toast.success('Connected to video call');
      } catch (err) {
        console.error('Error initializing video call:', err);
        setError(err.message);
        toast.error('Failed to connect to video call');
      } finally {
        setLoading(false);
      }
    };

    initializeCall();

    // Cleanup
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [open, callId, callType, session, participantName]);

  const handleClose = async () => {
    try {
      if (call) {
        await call.leave();
      }
      if (client) {
        await client.disconnectUser();
      }
      toast.info('Video call ended');
    } catch (err) {
      console.error('Error leaving call:', err);
    }
    onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={isFullscreen ? false : 'lg'}
      fullScreen={isFullscreen}
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a2e',
          minHeight: isFullscreen ? '100vh' : '600px',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#1a1a2e',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Video Call - {participantName || 'Participant'}
        </Typography>
        <Box>
          <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          bgcolor: '#0f0f1e',
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: isFullscreen ? 'calc(100vh - 64px)' : '536px',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: '#2196F3' }} />
            <Typography sx={{ color: 'white' }}>
              Connecting to video call...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              p: 3,
            }}
          >
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Typography sx={{ color: 'white', textAlign: 'center' }}>
              Please check your GetStream API configuration in .env file
            </Typography>
          </Box>
        ) : client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <StreamTheme>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '& .str-video': {
                      height: '100%',
                    },
                    '& .str-video__speaker-layout': {
                      height: '100%',
                    },
                  }}
                >
                  <SpeakerLayout />
                  <CallControls onLeave={handleClose} />
                </Box>
              </StreamTheme>
            </StreamCall>
          </StreamVideo>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallComponent;
