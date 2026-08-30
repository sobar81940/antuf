'use client';

import { Box, Container } from '@mui/material';
import UserManagement from '@/components/admin/user/UserManagement';
import Sidebar from '@/components/sidebar/SideBar';

export default function AllUserPage() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fb' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, ml: { sm: '70px', md: '240px' } }}>
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <UserManagement />
        </Container>
      </Box>
    </Box>
  );
}
