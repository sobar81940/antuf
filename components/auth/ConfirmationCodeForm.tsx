import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';

const ConfirmationCodeForm = ({ email, onVerify, onResend }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter verification code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onVerify(code);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, color: 'white' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Verify Your Email
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
        We sent a verification code to {email}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={loading}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'gray' },
              '&:hover fieldset': { borderColor: '#8A12FC' },
              '&.Mui-focused fieldset': { borderColor: '#8A12FC' },
            },
            '& .MuiInputLabel-root': { color: 'gray' },
            '& .MuiInputBase-input': { color: 'white' }
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#8A12FC',
              '&:hover': { bgcolor: '#6A0DAD' }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={onResend}
            disabled={loading}
            sx={{
              color: 'white',
              borderColor: 'gray',
              '&:hover': { borderColor: '#8A12FC' }
            }}
          >
            Resend Code
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ConfirmationCodeForm;