'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Article as ArticleIcon,
  Description as DescriptionIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export default function DownloadsPage() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [openViewer, setOpenViewer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, documents]);

  const fetchDocuments = async () => {
    // Mock data - Replace with actual API call
    setTimeout(() => {
      const mockDocuments = [
        {
          id: 1,
          title: 'बार्षिक आय व्यय विवरण ',
          category: 'कानून',
          size: '2.5 MB',
          pages: 45,
          date: '2024-01-15',
         url: '/pdfs/sample6.pdf',
          description: 'नेपालमा श्रमिक अधिकार सम्बन्धी पूर्ण जानकारी',
        },
        {
          id: 2,
          title: 'संगठन नियमावली',
          category: 'नियम',
          size: '1.8 MB',
          pages: 32,
          date: '2024-02-10',
          url: 'https://cpnmc.org/media/Audit_Ripotr_of_079-080.pdf',
          description: 'ANTUF को संगठन संरचना र नियमहरू',
        },
        {
          id: 3,
          title: 'वार्षिक प्रतिवेदन २०८०',
          category: 'प्रतिवेदन',
          size: '3.2 MB',
          pages: 68,
          date: '2024-03-05',
          url: '/pdfs/Audit_Ripotr_of_079-080.pdf',
          description: '२०८० सालको वार्षिक कार्यक्रम र उपलब्धि',
        },
        {
          id: 4,
          title: 'Labour Rights Handbook',
          category: 'Guidelines',
          size: '1.5 MB',
          pages: 28,
          date: '2024-02-20',
          url: '/pdfs/sample4.pdf',
          description: 'Complete guide on labour rights in Nepal',
        },
        {
          id: 5,
          title: 'सदस्यता फारम',
          category: 'फारम',
          size: '0.5 MB',
          pages: 8,
          date: '2024-01-01',
          url: '/pdfs/sample5.pdf',
          description: 'ANTUF सदस्यता लिनको लागि आवश्यक फारम',
        },
        {
          id: 6,
          title: 'Training Manual 2024',
          category: 'Training',
          size: '4.1 MB',
          pages: 95,
          date: '2024-03-15',
          url: '/pdfs/sample6.pdf',
          description: 'Comprehensive training manual for workers',
        },
      ];
      setDocuments(mockDocuments);
      setFilteredDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  };

  const handleViewPdf = (document) => {
    setSelectedPdf(document);
    setOpenViewer(true);
  };

  const handleClosePdfViewer = () => {
    setOpenViewer(false);
    setSelectedPdf(null);
  };

  const handleDownload = (doc) => {
    // In production, this would trigger actual file download
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.title;
    link.click();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'कानून': 'error',
      'नियम': 'warning',
      'प्रतिवेदन': 'info',
      'फारम': 'success',
      'Guidelines': 'primary',
      'Training': 'secondary',
    };
    return colors[category] || 'default';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'कानून': <ArticleIcon />,
      'नियम': <DescriptionIcon />,
      'प्रतिवेदन': <FileIcon />,
      'फारम': <FileIcon />,
      'Guidelines': <ArticleIcon />,
      'Training': <DescriptionIcon />,
    };
    return icons[category] || <FileIcon />;
  };

  return (
    <>
      <Navbar />

      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 6 }}>
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 6,
            mb: 4,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
              }}
            >
              डाउनलोड केन्द्र
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
              }}
            >
              महत्त्वपूर्ण दस्तावेज र फारमहरू
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          {/* Search Bar */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
            }}
          >
            <TextField
              fullWidth
              placeholder="दस्तावेज खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />
          </Paper>

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              {/* Documents Count */}
              <Typography variant="h6" sx={{ mb: 3, color: '#374151' }}>
                कुल दस्तावेजहरू: {filteredDocuments.length}
              </Typography>

              {/* Documents Grid */}
              <Grid container spacing={3}>
                {filteredDocuments.map((doc) => (
                  <Grid
                    key={doc.id}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4
                    }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          p: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PdfIcon sx={{ fontSize: 80, color: 'white' }} />
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                            {doc.title}
                          </Typography>
                        </Box>
                        
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, minHeight: 40 }}
                        >
                          {doc.description}
                        </Typography>

                        <Chip
                          icon={getCategoryIcon(doc.category)}
                          label={doc.category}
                          color={getCategoryColor(doc.category)}
                          size="small"
                          sx={{ mb: 2 }}
                        />

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            📄 {doc.pages} पृष्ठहरू
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            📦 {doc.size}
                          </Typography>
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                          📅 {doc.date}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewPdf(doc)}
                            sx={{
                              borderColor: '#667eea',
                              color: '#667eea',
                              '&:hover': {
                                borderColor: '#5568d3',
                                bgcolor: '#f3f4f6',
                              },
                            }}
                          >
                            हेर्नुहोस्
                          </Button>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownload(doc)}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                              },
                            }}
                          >
                            डाउनलोड
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* No Results */}
              {filteredDocuments.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    कुनै दस्तावेज भेटिएन
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    कृपया अर्को खोज शब्द प्रयोग गर्नुहोस्
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* PDF Viewer Dialog */}
      <Dialog
        open={openViewer}
        onClose={handleClosePdfViewer}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '1.25rem',
          }}
        >
          <Box component="span" sx={{ flex: 1 }}>
            {selectedPdf?.title}
          </Box>
          <IconButton onClick={handleClosePdfViewer} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, height: '100%', bgcolor: '#f5f7fa' }}>
          {selectedPdf && (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <iframe
                src={`${selectedPdf.url}#toolbar=1`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                title={selectedPdf.title}
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, bgcolor: '#f5f7fa' }}>
          <Button
            variant="outlined"
            onClick={handleClosePdfViewer}
            sx={{ borderRadius: 2 }}
          >
            बन्द गर्नुहोस्
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => selectedPdf && handleDownload(selectedPdf)}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            डाउनलोड गर्नुहोस्
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}
