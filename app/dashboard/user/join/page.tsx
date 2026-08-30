import JoinForm from '@/components/user/JoinForm';
import { Box } from '@mui/material';

export default function JoinPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <JoinForm />
    </Box>
  );
}