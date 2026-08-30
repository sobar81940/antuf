// components/dashboard/sliders/sliderTableStyles.js
export const tableContainerStyles = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  margin: '0 auto',  // Center the container
  overflowX: 'auto',
  mt: 3,
  p: 2,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

export const tableStyles = {
  minWidth: 550,
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 8px',
  '& .MuiTableCell-root': {
    py: 2,
    px: 3,
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    textAlign: 'center'
  },
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #e0e0e0'
  },
  '& .MuiTableRow-root': {
    '&:hover': {
      backgroundColor: '#f8f8f8'
    }
  }
};

export const responsiveCellStyles = {
  display: { xs: 'none', sm: 'table-cell' }
};

export const imageCellStyles = {
  width: 100,
  '& img': {
    width: 80,
    height: 45,
    objectFit: 'cover',
    borderRadius: 1
  }
};

export const statusStyles = (status) => ({
  display: 'inline-flex',
  alignItems: 'center',
  px: 1,
  borderRadius: 1,
  backgroundColor: status ? 'success.light' : 'error.light',
  color: status ? 'success.dark' : 'error.dark',
  fontSize: '0.75rem',
  fontWeight: 'bold'
});

export const paginationStyles = {
  '& .MuiPaginationItem-root': {
    fontSize: { xs: '0.75rem', sm: '0.875rem' }
  },
  '& .MuiPagination-ul': {
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
};

export const actionButtonStyles = {
  minWidth: 30,
  padding: { xs: '6px', sm: '8px' },
  '& + &': {
    ml: 0.5
  }
};

export const mobileRowStyles = {
  display: { xs: 'flex', sm: 'table-row' },
  flexDirection: 'column',
  p: 2,
  mb: 2,
  mx: 'auto', // Center mobile rows
  width: '95%', // Slightly less width on mobile for better appearance
  borderRadius: 1,
  bgcolor: 'background.paper',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)'
  }
};

export const mobileCellStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '90%',
  p: '8px 0',
  borderBottom: '1px solid',
  borderColor: 'divider',
  '&:last-child': {
    borderBottom: 'none'
  }
};

export const mobileLabelStyles = {
  fontWeight: 'bold',
  mr: 2,
  minWidth: 100
};