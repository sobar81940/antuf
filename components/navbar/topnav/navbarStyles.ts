export const styles = {
  navbarContainer: {
    width: '100%',
    backgroundColor: '#f00000ff',
    color: 'white',
    height:"auto",
    padding: { xs: '12px 0', md: '0' },
  },
  contentWrapper: {
    maxWidth: "100%",
    margin: '0 auto',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: { xs: '0 16px', md: '0 24px' },
    gap: { xs: '12px', md: '0' },
    
  },
  contactInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: { xs: '12px', md: '24px' },
    alignItems: 'center',
  },
  contactItem: {
    display: { xs: 'none', md: 'flex' },
    
    alignItems: 'center',
    gap: '8px',
  },
  socialIcons: {
    display: 'flex',
    gap: '8px',
  },
  iconButton: {
    color: 'white',
    backgroundColor: '#e60000',
    '&:hover': {
      backgroundColor: '#cc0000',
    },
    padding: '8px',
  },
  contactText: {
    display: { xs: 'none', sm: 'block' },
    fontSize: '0.875rem',
  },
};
