'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Pagination,
  Stack,
  Alert,
  MenuItem,
  Avatar,
  Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyIcon from '@mui/icons-material/Key';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { toast } from 'react-toastify';

const getInitials = (name) => {
  return name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    bio: '',
    isActive: true,
    role: 'user',
  });

  const limit = 10;

  // Fetch users with filters
  const fetchUsers = async (pageNum = 1, search = '', role = '', active = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', String(pageNum));
      params.append('limit', String(limit));
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      if (active) params.append('isActive', active);

      const url = `/api/admin/users/profile?${params.toString()}`;
      console.log('Fetching from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Failed to fetch users: ${response.status} ${response.statusText}`;
        let responseText = '';
        
        if (contentType?.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.err || errorData.error || errorMessage;
          } catch (e) {
            console.error('Could not parse error response:', e);
            responseText = await response.text();
          }
        } else {
          responseText = await response.text();
          console.error('Non-JSON response received. First 500 chars:', responseText.substring(0, 500));
        }
        
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but got:', text.substring(0, 500));
        throw new Error('API returned non-JSON response. Check server logs.');
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      if (data.success) {
        setUsers(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, searchTerm, filterRole, filterActive);
  }, [page]);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    fetchUsers(1, searchTerm, filterRole, filterActive);
  };

  // Handle filter
  const handleFilterChange = (field, value) => {
    setPage(1);
    if (field === 'role') setFilterRole(value);
    if (field === 'active') setFilterActive(value);
    if (field === 'role') fetchUsers(1, searchTerm, value, filterActive);
    if (field === 'active') fetchUsers(1, searchTerm, filterRole, value);
  };

  // Open edit dialog
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      bio: user.bio || '',
      isActive: user.isActive !== false,
      role: user.role || 'user',
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      bio: '',
      isActive: true,
      role: 'user',
    });
  };

  // Update user
  const handleSaveUser = async () => {
    if (!editingUser) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${editingUser._id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setError(null);
        handleCloseDialog();
        fetchUsers(page, searchTerm, filterRole, filterActive);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/profile`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      setError(null);
      fetchUsers(page, searchTerm, filterRole, filterActive);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId, userName) => {
    if (!confirm(`Reset password for ${userName || 'this user'} to the default password?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: 'defaultPassword123' }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.err || data.error || 'Failed to reset password');
      }

      toast.success('Password reset successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset password';
      setError(message);
      toast.error(message);
      console.error('Error resetting password:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Export users to Excel
  const handleExportToExcel = async () => {
    try {
      setLoading(true);
      
      // Dynamically import xlsx
      const XLSX = await import('xlsx');
      
      // Fetch all users without pagination
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '10000'); // Get all users
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole) params.append('role', filterRole);
      if (filterActive) params.append('isActive', filterActive);

      const response = await fetch(`/api/admin/users/profile?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      const allUsers = data.data || [];

      if (allUsers.length === 0) {
        toast.warning('No users to export');
        return;
      }

      // Prepare data for Excel with all fields
      const exportData = allUsers.map((user, index) => ({
        'No': index + 1,
        'Name': user.name || '',
        'Email': user.email || '',
        'Phone': user.phone || '',
        'Gender': user.gender || '',
        'Father Name': user.fatherName || '',
        'Mother Name': user.motherName || '',
        'Grandfather Name': user.grandfatherName || '',
        'Citizenship Number': user.citizenshipNumber || '',
        'Permanent Province': user.permanentProvince || '',
        'Permanent District': user.permanentDistrict || '',
        'Permanent Municipality': user.permanentMunicipality || '',
        'Permanent Ward No': user.permanentWardNo || '',
        'Permanent Address': user.permanentAddress || '',
        'Temporary Province': user.temporaryProvince || '',
        'Temporary District': user.temporaryDistrict || '',
        'Temporary Municipality': user.temporaryMunicipality || '',
        'Temporary Ward No': user.temporaryWardNo || '',
        'Temporary Address': user.temporaryAddress || '',
        'Emergency Contact': user.emergencyContact || '',
        'Emergency Phone': user.emergencyPhone || '',
        'Organization': user.organization || '',
        'Position': user.position || '',
        'Membership Number': user.membershipNumber || '',
        'Bio': user.bio || '',
        'Role': user.role || 'user',
        'Status': user.isActive ? 'Active' : 'Inactive',
        'Created Date': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      const columnWidths = [
        { wch: 5 },  // No
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 10 }, // Gender
        { wch: 20 }, // Father Name
        { wch: 20 }, // Mother Name
        { wch: 20 }, // Grandfather Name
        { wch: 18 }, // Citizenship Number
        { wch: 18 }, // Permanent Province
        { wch: 18 }, // Permanent District
        { wch: 25 }, // Permanent Municipality
        { wch: 12 }, // Permanent Ward No
        { wch: 25 }, // Permanent Address
        { wch: 18 }, // Temporary Province
        { wch: 18 }, // Temporary District
        { wch: 25 }, // Temporary Municipality
        { wch: 12 }, // Temporary Ward No
        { wch: 25 }, // Temporary Address
        { wch: 20 }, // Emergency Contact
        { wch: 15 }, // Emergency Phone
        { wch: 20 }, // Organization
        { wch: 15 }, // Position
        { wch: 18 }, // Membership Number
        { wch: 30 }, // Bio
        { wch: 10 }, // Role
        { wch: 10 }, // Status
        { wch: 15 }, // Created Date
      ];
      worksheet['!cols'] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `users_export_${timestamp}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);
      
      toast.success(`Exported ${allUsers.length} users successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle import file selection
  const handleImportFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error('Please select an Excel file (.xlsx or .xls)');
        return;
      }
      setImportFile(file);
    }
  };

  // Import users from Excel
  const handleImportFromExcel = async () => {
    if (!importFile) {
      toast.warning('Please select a file to import');
      return;
    }

    try {
      setImportLoading(true);
      
      // Dynamically import xlsx
      const XLSX = await import('xlsx');

      // Read file
      const data = await importFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

      if (jsonData.length === 0) {
        toast.warning('No data found in the Excel file');
        return;
      }

      // Transform data to match API format (supports both English and Nepali headers)
      const usersToImport = jsonData.map(row => ({
        name: row.Name || row.name || row['नाम'] || '',
        email: row.Email || row.email || row['इमेल'] || '',
        phone: row.Phone || row.phone || row['फोन'] || row['मोवाईलन.'] || '',
        bio: row.Bio || row.bio || row['विवरण'] || '',
        role: row.Role || row.role || row['भूमिका'] || row['पद'] || 'user',
        isActive: (row.Status || row.status || row['स्थिति'] || 'Active').toLowerCase() === 'active',
        // Family Information
        motherName: row.MotherName || row.motherName || row['आमाको नाम'] || '',
        fatherName: row.FatherName || row.fatherName || row['बाबुको नाम'] || '',
        grandfatherName: row.GrandfatherName || row.grandfatherName || row['हजुरबुवाको नाम'] || '',
        gender: row.Gender || row.gender || row['लिंग'] || '',
        // Citizenship
        citizenshipNumber: row.CitizenshipNumber || row.citizenshipNumber || row['नागरिकता न.'] || row['नागरिकता वा पासपोर्ट'] || '',
        // Permanent Address
        permanentProvince: row.PermanentProvince || row.permanentProvince || row['स्थायी प्रदेश'] || '',
        permanentDistrict: row.PermanentDistrict || row.permanentDistrict || row['स्थायी जिल्ला'] || row['जिल्ला'] || '',
        permanentMunicipality: row.PermanentMunicipality || row.permanentMunicipality || row['स्थायी नगरपालिका'] || '',
        permanentWardNo: row.PermanentWardNo || row.permanentWardNo || row['स्थायी वडा न.'] || '',
        permanentAddress: row.PermanentAddress || row.permanentAddress || row['स्थायी ठेगाना'] || '',
        // Temporary Address  
        temporaryProvince: row.TemporaryProvince || row.temporaryProvince || row['अस्थायी प्रदेश'] || '',
        temporaryDistrict: row.TemporaryDistrict || row.temporaryDistrict || row['अस्थायी जिल्ला'] || '',
        temporaryMunicipality: row.TemporaryMunicipality || row.temporaryMunicipality || row['अस्थायी नगरपालिका'] || '',
        temporaryWardNo: row.TemporaryWardNo || row.temporaryWardNo || row['अस्थायी वडा न.'] || '',
        temporaryAddress: row.TemporaryAddress || row.temporaryAddress || row['अस्थायी ठेगाना'] || '',
        // Emergency Contact
        emergencyContact: row.EmergencyContact || row.emergencyContact || row['आपतकालीन सम्पर्क'] || '',
        emergencyPhone: row.EmergencyPhone || row.emergencyPhone || row['आपतकालीन फोन'] || '',
        // Professional
        organization: row.Organization || row.organization || row['संगठन'] || '',
        position: row.Position || row.position || row['पद'] || '',
        membershipNumber: row.MembershipNumber || row.membershipNumber || row['सदस्यता न.'] || '',
      })).filter(user => user.email); // Only include rows with email

      if (usersToImport.length === 0) {
        toast.warning('No valid user data found. Email is required.');
        return;
      }

      // Send to API
      const response = await fetch('/api/admin/users/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: usersToImport }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.err || 'Failed to import users');
      }

      // Show detailed results
      const successMsg = [];
      if (result.imported > 0) successMsg.push(`${result.imported} created`);
      if (result.updated > 0) successMsg.push(`${result.updated} updated`);
      
      if (successMsg.length > 0) {
        toast.success(`Import completed: ${successMsg.join(', ')}`);
      }

      if (result.errors && result.errors.length > 0) {
        console.log('=== IMPORT ERRORS ===');
        result.errors.forEach((err, idx) => {
          console.log(`Error ${idx + 1}:`, {
            row: err.row,
            email: err.email,
            error: err.error
          });
        });
        console.log('=====================');
        
        toast.error(
          `${result.errors.length} user(s) failed. First error: ${result.errors[0].error}`,
          { autoClose: 8000 }
        );
      }

      // Close dialog and refresh
      setImportDialogOpen(false);
      setImportFile(null);
      fetchUsers(1, searchTerm, filterRole, filterActive);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import users: ' + error.message);
    } finally {
      setImportLoading(false);
    }
  };

  // Download sample Excel template
  const handleDownloadTemplate = async () => {
    try {
      const XLSX = await import('xlsx');
      
      // English template
      const templateDataEnglish = [
        {
          'Name': 'John Doe',
          'Email': 'john@example.com',
          'Phone': '9841234567',
          'Gender': 'male',
          'Father Name': 'John Smith',
          'Mother Name': 'Jane Smith',
          'Grandfather Name': 'David Smith',
          'Citizenship Number': '12-34-56789',
          'Permanent Province': 'Bagmati',
          'Permanent District': 'Kathmandu',
          'Permanent Municipality': 'Kathmandu Metropolitan',
          'Permanent Ward No': '10',
          'Permanent Address': 'Thamel, Kathmandu',
          'Temporary Province': 'Bagmati',
          'Temporary District': 'Lalitpur',
          'Temporary Municipality': 'Lalitpur Sub-Metropolitan',
          'Temporary Ward No': '5',
          'Temporary Address': 'Pulchowk, Lalitpur',
          'Emergency Contact': 'Jane Doe',
          'Emergency Phone': '9851234567',
          'Organization': 'ANTUF',
          'Position': 'Member',
          'Membership Number': 'MEM-001',
          'Bio': 'Sample bio',
          'Role': 'user',
          'Status': 'Active',
        },
      ];

      // Nepali template
      const templateDataNepali = [
        {
          'नाम': 'राम बहादुर',
          'इमेल': 'ram@example.com',
          'फोन': '9841234567',
          'बाबुको नाम': 'श्याम बहादुर',
          'आमाको नाम': 'सीता देवी',
          'जिल्ला': 'काठमाडौं',
          'शहर': 'काठमाडौं',
          'प्रदेश': 'बागमती',
          'देश': 'नेपाल',
          'ठेगाना': 'काठमाडौं-१०',
          'पोस्टल कोड': '44600',
          'नागरिकता न.': '१२-३४-५६७८',
          'विवरण': 'नमूना विवरण',
          'भूमिका': 'user',
          'स्थिति': 'Active',
        },
      ];

      const worksheetEnglish = XLSX.utils.json_to_sheet(templateDataEnglish);
      const worksheetNepali = XLSX.utils.json_to_sheet(templateDataNepali);
      
      worksheetEnglish['!cols'] = [
        { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 10 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 },
        { wch: 18 }, { wch: 18 }, { wch: 25 }, { wch: 12 },
        { wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 25 },
        { wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
        { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 30 },
        { wch: 10 }, { wch: 10 }
      ];
      worksheetNepali['!cols'] = [
        { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 10 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 },
        { wch: 18 }, { wch: 18 }, { wch: 25 }, { wch: 12 },
        { wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 25 },
        { wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
        { wch: 25 }, { wch: 15 }, { wch: 18 }, { wch: 30 },
        { wch: 10 }, { wch: 10 }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheetEnglish, 'English Template');
      XLSX.utils.book_append_sheet(workbook, worksheetNepali, 'Nepali Template');
      XLSX.writeFile(workbook, 'users_import_template.xlsx');
      
      toast.success('Template downloaded with English and Nepali formats!');
    } catch (error) {
      console.error('Template download error:', error);
      toast.error('Failed to download template');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <h2>User Management</h2>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportToExcel}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: 700,
                padding: '10px 24px',
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
                },
                '&:disabled': {
                  background: 'rgba(16, 185, 129, 0.3)',
                }
              }}
            >
              Export Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setImportDialogOpen(true)}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 700,
                padding: '10px 24px',
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                },
                '&:disabled': {
                  background: 'rgba(59, 130, 246, 0.3)',
                }
              }}
            >
              Import Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => fetchUsers(1, searchTerm, filterRole, filterActive)}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: '#ffffff',
                fontWeight: 700,
                padding: '10px 24px',
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
                },
                '&:disabled': {
                  background: 'rgba(139, 92, 246, 0.3)',
                }
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Search and Filter */}
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 6
            }}>
            <TextField
              fullWidth
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 3
            }}>
            <TextField
              select
              fullWidth
              label="Filter by Role"
              value={filterRole}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              size="small"
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 3
            }}>
            <TextField
              select
              fullWidth
              label="Filter by Status"
              value={filterActive}
              onChange={(e) => handleFilterChange('active', e.target.value)}
              size="small"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Users Table */}
        <TableContainer component={Paper}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Profile</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>
                        <Avatar
                          alt={user.name}
                          src={user.image || ''}
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#1976d2',
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>{user.city || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === 'admin' ? 'error' : 'default'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(user)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<KeyIcon />}
                          onClick={() => handleResetPassword(user._id, user.name)}
                          sx={{ mr: 1 }}
                        >
                          Reset Password
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          color="error"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
            />
          </Box>
        )}
      </Stack>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User: {editingUser?.name}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleFormChange('phone', e.target.value)}
            />
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => handleFormChange('city', e.target.value)}
            />
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={(e) => handleFormChange('state', e.target.value)}
            />
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={(e) => handleFormChange('country', e.target.value)}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={formData.bio}
              onChange={(e) => handleFormChange('bio', e.target.value)}
            />
            <TextField
              select
              fullWidth
              label="Role"
              value={formData.role}
              onChange={(e) => handleFormChange('role', e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Status"
              value={String(formData.isActive)}
              onChange={(e) => handleFormChange('isActive', e.target.value === 'true')}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog 
        open={importDialogOpen} 
        onClose={() => !importLoading && setImportDialogOpen(false)}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.5rem',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <UploadIcon sx={{ fontSize: '2rem' }} />
          Import Users from Excel
        </DialogTitle>
        <DialogContent 
          sx={{ 
            pt: 3, 
            pb: 2,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.6) 100%)',
          }}
        >
          <Stack spacing={3}>
            <Alert 
              severity="info"
              sx={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#93c5fd',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  color: '#60a5fa',
                }
              }}
            >
              Download the template, fill in user data, and upload the completed file.
            </Alert>
            
            <Button
              variant="outlined"
              onClick={handleDownloadTemplate}
              startIcon={<DownloadIcon />}
              fullWidth
              sx={{
                color: '#60a5fa',
                borderColor: '#3b82f6',
                border: '2px solid #3b82f6',
                fontWeight: 700,
                padding: '12px 24px',
                borderRadius: '12px',
                textTransform: 'none',
                background: 'rgba(59, 130, 246, 0.1)',
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderColor: '#2563eb',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Download Template
            </Button>

            <Box
              sx={{
                border: '2px dashed rgba(59, 130, 246, 0.4)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.6)',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: '#3b82f6',
                  background: 'rgba(59, 130, 246, 0.05)',
                }
              }}
            >
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportFileChange}
                style={{ display: 'none' }}
                id="excel-upload"
              />
              <label htmlFor="excel-upload">
                <Button
                  component="span"
                  variant="contained"
                  startIcon={<UploadIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '12px 32px',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    },
                  }}
                >
                  Select Excel File
                </Button>
              </label>
              {importFile && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={importFile.name}
                    onDelete={() => setImportFile(null)}
                    color="primary"
                    sx={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#93c5fd',
                      fontWeight: 600,
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            padding: '20px 28px',
            gap: 2,
            borderTop: '2px solid rgba(59, 130, 246, 0.2)',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.8) 100%)',
          }}
        >
          <Button 
            onClick={() => setImportDialogOpen(false)}
            disabled={importLoading}
            sx={{
              color: '#f87171',
              borderColor: '#ef4444',
              border: '2px solid #ef4444',
              fontWeight: 700,
              padding: '10px 24px',
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': {
                background: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImportFromExcel}
            variant="contained"
            disabled={!importFile || importLoading}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontWeight: 700,
              padding: '10px 32px',
              borderRadius: '12px',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              },
              '&:disabled': {
                background: 'rgba(59, 130, 246, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            {importLoading ? <CircularProgress size={20} color="inherit" /> : 'Import Users'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
