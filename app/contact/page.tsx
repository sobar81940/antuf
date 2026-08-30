"use client";

import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  TextField, 
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack
} from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";

const ContactUs = () => {
  const [language, setLanguage] = useState('en'); // 'en' or 'ne'
  const [formData, setFormData] = useState({
    selectReason: "",
    name: "",
    email: "",
    contactNumber: "",
    message: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const content = {
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with ANTUF. We're here to support our community and help you connect.",
      getInTouch: "Get In Touch",
      contactForm: "Send Us a Message",
      selectReason: "Select Reason",
      selectReasonPlaceholder: "Select an Option",
      name: "Full Name",
      email: "Email Address",
      contactNumber: "Contact Number",
      contactNumberPlaceholder: "Contact Number with Country Code (e.g., +977 or +1)",
      message: "Your Message",
      messagePlaceholder: "Share your thoughts, questions, or concerns (Max 300 characters)",
      submit: "Submit",
      successMessage: "Thank you for your message! We'll get back to you within 48 hours.",
      faqTitle: "Frequently Asked Questions",
      quickContact: "Quick Contact",
      generalInquiries: "General Inquiries",
      supportTeam: "Support & Membership",
      partnerships: "Partnerships & Collaboration",
      responseTime: "Response Time",
      responseTimeText: "We typically respond to all inquiries within 48 hours during business days. For urgent matters, please call our office.",
      reasons: {
        membership: "Membership Inquiry",
        event: "Event Information",
        donation: "Donation & Support",
        partnership: "Partnership Opportunities",
        general: "General Inquiry",
        other: "Other"
      }
    },
    ne: {
      title: "सम्पर्क गर्नुहोस्",
      subtitle: "ANTUF सँग सम्पर्कमा रहनुहोस्। हामी हाम्रो समुदायलाई समर्थन गर्न र तपाईंलाई जोड्न यहाँ छौं।",
      getInTouch: "सम्पर्क गर्नुहोस्",
      contactForm: "हामीलाई सन्देश पठाउनुहोस्",
      selectReason: "कारण चयन गर्नुहोस्",
      selectReasonPlaceholder: "एक विकल्प चयन गर्नुहोस्",
      name: "पूरा नाम",
      email: "इमेल ठेगाना",
      contactNumber: "सम्पर्क नम्बर",
      contactNumberPlaceholder: "देश कोड सहितको सम्पर्क नम्बर (जस्तै: +977 वा +1)",
      message: "तपाईंको सन्देश",
      messagePlaceholder: "आफ्नो विचार, प्रश्न वा चिन्ता साझा गर्नुहोस् (अधिकतम ३०० वर्ण)",
      submit: "पेश गर्नुहोस्",
      successMessage: "तपाईंको सन्देशको लागि धन्यवाद! हामी ४८ घण्टा भित्र तपाईंलाई सम्पर्क गर्नेछौं।",
      faqTitle: "बारम्बार सोधिने प्रश्नहरू",
      quickContact: "द्रुत सम्पर्क",
      generalInquiries: "सामान्य सोधपुछ",
      supportTeam: "समर्थन र सदस्यता",
      partnerships: "साझेदारी र सहयोग",
      responseTime: "प्रतिक्रिया समय",
      responseTimeText: "हामी सामान्यतया व्यापार दिनहरूमा ४८ घण्टा भित्र सबै सोधपुछको जवाफ दिन्छौं। तुरुन्त मामिलाहरूको लागि, कृपया हाम्रो कार्यालयमा फोन गर्नुहोस्।",
      reasons: {
        membership: "सदस्यता सोधपुछ",
        event: "कार्यक्रम जानकारी",
        donation: "दान र समर्थन",
        partnership: "साझेदारी अवसरहरू",
        general: "सामान्य सोधपुछ",
        other: "अन्य"
      }
    }
  };

  const t = content[language];

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: language === 'en' ? "Email Us" : "इमेल गर्नुहोस्",
      content: "info@antuf.org",
      description: language === 'en' ? "Send us your queries anytime" : "जुनसुकै बेला प्रश्न पठाउनुहोस्"
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: language === 'en' ? "Call Us" : "फोन गर्नुहोस्",
      content: "+977-1-XXXXXXX",
      description: language === 'en' ? "Mon-Fri, 10:00 AM - 5:00 PM NPT" : "सोम-शुक्र, बिहान १०:०० - साँझ ५:०० NPT"
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: language === 'en' ? "Visit Us" : "भेट्नुहोस्",
      content: "Kathmandu, Nepal",
      description: language === 'en' ? "ANTUF Office Location" : "ANTUF कार्यालय स्थान"
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      title: language === 'en' ? "Office Hours" : "कार्यालय समय",
      content: language === 'en' ? "10 AM - 5 PM" : "बिहान १० - साँझ ५",
      description: language === 'en' ? "Monday to Friday" : "सोमबार देखि शुक्रबार"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.selectReason.trim()) {
      newErrors.selectReason = language === 'en' ? "Please select a reason" : "कृपया कारण चयन गर्नुहोस्";
    }

    if (!formData.name.trim()) {
      newErrors.name = language === 'en' ? "Name is required" : "नाम आवश्यक छ";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'en' ? "Email is required" : "इमेल आवश्यक छ";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'en' ? "Email is invalid" : "इमेल अमान्य छ";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = language === 'en' ? "Message is required" : "सन्देश आवश्यक छ";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = language === 'en' ? "Message must be at least 10 characters" : "सन्देश कम्तिमा १० वर्णको हुनुपर्छ";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setShowError(false);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        setShowError(true);
        return;
      }

      // Show success message
      setShowSuccess(true);

      // Reset form
      setFormData({
        selectReason: "",
        name: "",
        email: "",
        contactNumber: "",
        message: ""
      });
    } catch (error) {
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <>
      <Navbar />

      {/* Banner Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "40vh",
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/images/pic2.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
            <Chip
              label="English"
              onClick={() => setLanguage('en')}
              color={language === 'en' ? 'primary' : 'default'}
              sx={{ 
                backgroundColor: language === 'en' ? '#fff' : 'rgba(255,255,255,0.3)',
                color: language === 'en' ? '#1976d2' : '#fff',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: language === 'en' ? '#fff' : 'rgba(255,255,255,0.5)',
                }
              }}
            />
            <Chip
              label="नेपाली"
              onClick={() => setLanguage('ne')}
              color={language === 'ne' ? 'primary' : 'default'}
              sx={{ 
                backgroundColor: language === 'ne' ? '#fff' : 'rgba(255,255,255,0.3)',
                color: language === 'ne' ? '#1976d2' : '#fff',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: language === 'ne' ? '#fff' : 'rgba(255,255,255,0.5)',
                }
              }}
            />
          </Stack>
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: "700",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
              textShadow: "2px 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            {t.title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              maxWidth: "700px",
              mx: "auto",
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              fontWeight: "300",
              textShadow: "1px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {t.subtitle}
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Contact Information Cards */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              color: "#333", 
              mb: 6, 
              textAlign: "center", 
              fontWeight: "700",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -16,
                left: "50%",
                transform: "translateX(-50%)",
                width: 80,
                height: 4,
                backgroundColor: "#1976d2",
                borderRadius: 2,
              }
            }}
          >
            {t.getInTouch}
          </Typography>
          
          <Grid container spacing={4}>
            {contactInfo.map((info, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3
                }}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    height: "100%",
                    border: "2px solid #f0f0f0",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 16px 48px rgba(25, 118, 210, 0.15)",
                      borderColor: "#1976d2",
                    }
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    {info.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "700", mb: 1, color: "#333" }}>
                    {info.title}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#1976d2", mb: 1, fontWeight: "600" }}>
                    {info.content}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {info.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Form and Map Section */}
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid size={12}>
            <Paper elevation={0} sx={{ p: 6, border: "1px solid #e0e0e0", borderRadius: 3 }}>
              <Typography variant="h4" sx={{ color: "#333", fontWeight: "700", mb: 4, textAlign: "left" }}>
                {t.contactForm}
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Typography variant="body1" sx={{ color: "#333", mb: 1, fontWeight: "500" }}>
                      {t.selectReason}<span style={{ color: "#d32f2f" }}>*</span>
                    </Typography>
                    <FormControl fullWidth error={!!errors.selectReason}>
                      <Select
                        name="selectReason"
                        value={formData.selectReason}
                        onChange={handleInputChange}
                        displayEmpty
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e0e0e0",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#999",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1976d2",
                          },
                          "& .MuiSelect-select": {
                            color: formData.selectReason ? "#333" : "#999",
                          }
                        }}
                      >
                        <MenuItem value="" sx={{ color: "#999" }}>{t.selectReasonPlaceholder}</MenuItem>
                        <MenuItem value="membership">{t.reasons.membership}</MenuItem>
                        <MenuItem value="event">{t.reasons.event}</MenuItem>
                        <MenuItem value="donation">{t.reasons.donation}</MenuItem>
                        <MenuItem value="partnership">{t.reasons.partnership}</MenuItem>
                        <MenuItem value="general">{t.reasons.general}</MenuItem>
                        <MenuItem value="other">{t.reasons.other}</MenuItem>
                      </Select>
                      {errors.selectReason && <Typography variant="caption" sx={{ color: "#d32f2f", mt: 1 }}>{errors.selectReason}</Typography>}
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="body1" sx={{ color: "#333", mb: 1, fontWeight: "500" }}>
                      {t.name}<span style={{ color: "#d32f2f" }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      error={!!errors.name} 
                      helperText={errors.name} 
                      variant="outlined" 
                      sx={{"& .MuiOutlinedInput-root": {"&:hover fieldset": {borderColor: "#999"},"&.Mui-focused fieldset": {borderColor: "#1976d2"}}}} 
                    />
                  </Grid>
                  
                  <Grid size={12}>
                    <Typography variant="body1" sx={{ color: "#333", mb: 1, fontWeight: "500" }}>
                      {t.email}<span style={{ color: "#d32f2f" }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      error={!!errors.email} 
                      helperText={errors.email} 
                      variant="outlined" 
                      sx={{"& .MuiOutlinedInput-root": {"&:hover fieldset": {borderColor: "#999"},"&.Mui-focused fieldset": {borderColor: "#1976d2"}}}} 
                    />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="body1" sx={{ color: "#333", mb: 1, fontWeight: "500" }}>
                      {t.contactNumber}
                    </Typography>
                    <TextField 
                      fullWidth 
                      name="contactNumber" 
                      value={formData.contactNumber} 
                      onChange={handleInputChange} 
                      variant="outlined"
                      placeholder={t.contactNumberPlaceholder}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                          },
                        },
                        "& .MuiOutlinedInput-input::placeholder": {
                          color: "#999",
                          opacity: 1,
                        }
                      }} 
                    />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="body1" sx={{ color: "#333", mb: 1, fontWeight: "500" }}>
                      {t.message}<span style={{ color: "#d32f2f" }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      error={!!errors.message}
                      helperText={errors.message}
                      variant="outlined"
                      placeholder={t.messagePlaceholder}
                      inputProps={{ maxLength: 300 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                          },
                        },
                        "& .MuiOutlinedInput-input::placeholder": {
                          color: "#999",
                          opacity: 1,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid size={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<SendIcon />}
                      disabled={submitting}
                      sx={{
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#1565c0",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "#90caf9",
                          color: "#fff",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {submitting
                        ? (language === 'en' ? "Sending..." : "पठाउँदै...")
                        : t.submit}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Information Sidebar - moved below */}
          <Grid sx={{ mt: 4 }} size={12}>
            <Grid container spacing={4}>
              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}>
                <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0", borderRadius: 3, height: "100%" }}>
                  <Typography variant="h5" sx={{ color: "#333", fontWeight: "700", mb: 3 }}>
                    {t.quickContact}
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "600", mb: 2 }}>
                      {t.generalInquiries}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      📧 info@antuf.org
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {language === 'en' 
                        ? 'For general questions and information about ANTUF' 
                        : 'ANTUF बारे सामान्य प्रश्न र जानकारीको लागि'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "600", mb: 2 }}>
                      {t.supportTeam}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      📧 support@antuf.org
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {language === 'en' 
                        ? 'For membership inquiries and support' 
                        : 'सदस्यता सोधपुछ र समर्थनको लागि'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "600", mb: 2 }}>
                      {t.partnerships}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      📧 partnerships@antuf.org
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {language === 'en' 
                        ? 'For collaboration and partnership opportunities' 
                        : 'सहकार्य र साझेदारी अवसरहरूको लागि'}
                    </Typography>
                  </Box>

                  <Box 
                    sx={{ 
                      p: 3, 
                      backgroundColor: "#f8f9fa", 
                      borderRadius: 2,
                      border: "1px solid #e9ecef"
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#333", fontWeight: "600", mb: 2 }}>
                      {t.responseTime}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                      {t.responseTimeText}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Social Media & Additional Info */}
              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}>
                <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0", borderRadius: 3, height: "100%" }}>
                  <Typography variant="h5" sx={{ color: "#333", fontWeight: "700", mb: 3 }}>
                    {language === 'en' ? 'Connect With Us' : 'हामीसँग जडान गर्नुहोस्'}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: "#666", mb: 3, lineHeight: 1.8 }}>
                    {language === 'en' 
                      ? 'Stay connected with ANTUF through our social media channels for the latest updates, events, and community news.'
                      : 'नवीनतम अपडेट, कार्यक्रमहरू र समुदाय समाचारको लागि हाम्रो सोशल मिडिया च्यानलहरू मार्फत ANTUF सँग जडान रहनुहोस्।'}
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                    <Button
                      variant="outlined"
                      startIcon={<FacebookIcon />}
                      sx={{
                        borderColor: "#1877f2",
                        color: "#1877f2",
                        "&:hover": {
                          backgroundColor: "#1877f2",
                          color: "#fff",
                          borderColor: "#1877f2",
                        }
                      }}
                    >
                      Facebook
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TwitterIcon />}
                      sx={{
                        borderColor: "#1da1f2",
                        color: "#1da1f2",
                        "&:hover": {
                          backgroundColor: "#1da1f2",
                          color: "#fff",
                          borderColor: "#1da1f2",
                        }
                      }}
                    >
                      Twitter
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LinkedInIcon />}
                      sx={{
                        borderColor: "#0077b5",
                        color: "#0077b5",
                        "&:hover": {
                          backgroundColor: "#0077b5",
                          color: "#fff",
                          borderColor: "#0077b5",
                        }
                      }}
                    >
                      LinkedIn
                    </Button>
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Box>
                    <Typography variant="h6" sx={{ color: "#333", fontWeight: "600", mb: 2 }}>
                      {language === 'en' ? 'Visit Our Office' : 'हाम्रो कार्यालय भ्रमण गर्नुहोस्'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.8 }}>
                      {language === 'en' 
                        ? 'ANTUF Headquarters\nKathmandu, Nepal\n\nOffice Hours:\nMonday - Friday: 10:00 AM - 5:00 PM NPT\nSaturday: By appointment only\nSunday: Closed'
                        : 'ANTUF मुख्यालय\nकाठमाडौं, नेपाल\n\nकार्यालय समय:\nसोमबार - शुक्रबार: बिहान १०:०० - साँझ ५:०० NPT\nशनिबार: भेटघाट अनुसार मात्र\nआइतबार: बन्द'}
                    </Typography>
                  </Box>

                  <Box 
                    sx={{ 
                      p: 3, 
                      mt: 3,
                      backgroundColor: "#e3f2fd", 
                      borderRadius: 2,
                      border: "1px solid #bbdefb"
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: "600", mb: 1 }}>
                      💡 {language === 'en' ? 'Quick Tip' : 'द्रुत सुझाव'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                      {language === 'en' 
                        ? 'For faster response, please include your membership ID (if applicable) in your message.'
                        : 'छिटो प्रतिक्रियाको लागि, कृपया आफ्नो सन्देशमा आफ्नो सदस्यता ID (यदि लागू हुन्छ भने) समावेश गर्नुहोस्।'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mt: 8 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: "#333", 
              fontWeight: "700", 
              mb: 4, 
              textAlign: "center" 
            }}
          >
            {t.faqTitle}
          </Typography>
          
          <Grid container spacing={4}>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Card elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "600", mb: 2 }}>
                  {language === 'en' 
                    ? 'How can I become a member of ANTUF?' 
                    : 'म ANTUF को सदस्य कसरी बन्न सक्छु?'}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                  {language === 'en'
                    ? 'You can join ANTUF by filling out our membership registration form available on the website. Once submitted, our team will review your application and contact you with further steps.'
                    : 'तपाईं वेबसाइटमा उपलब्ध हाम्रो सदस्यता दर्ता फारम भरेर ANTUF मा सामेल हुन सक्नुहुन्छ। एक पटक पेश गरेपछि, हाम्रो टोलीले तपाईंको आवेदन समीक्षा गर्नेछ र थप चरणहरूको साथ तपाईंलाई सम्पर्क गर्नेछ।'}
                </Typography>
              </Card>
            </Grid>
            
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Card elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "600", mb: 2 }}>
                  {language === 'en' 
                    ? 'What events does ANTUF organize?' 
                    : 'ANTUF ले कस्ता कार्यक्रमहरू आयोजना गर्छ?'}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                  {language === 'en'
                    ? 'ANTUF organizes various cultural, educational, and community events throughout the year. Check our event calendar for upcoming programs and activities.'
                    : 'ANTUF ले वर्षभरि विभिन्न सांस्कृतिक, शैक्षिक र सामुदायिक कार्यक्रमहरू आयोजना गर्दछ। आगामी कार्यक्रम र गतिविधिहरूको लागि हाम्रो कार्यक्रम पात्रो जाँच गर्नुहोस्।'}
                </Typography>
              </Card>
            </Grid>
            
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Card elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "600", mb: 2 }}>
                  {language === 'en' 
                    ? 'How can I support ANTUF?' 
                    : 'म ANTUF लाई कसरी समर्थन गर्न सक्छु?'}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                  {language === 'en'
                    ? 'You can support ANTUF through membership, volunteering, or making a donation. Visit our donation page to learn more about ways to contribute to our community initiatives.'
                    : 'तपाईं सदस्यता, स्वयंसेवा वा दान मार्फत ANTUF लाई समर्थन गर्न सक्नुहुन्छ। हाम्रो सामुदायिक पहलहरूमा योगदान गर्ने तरिकाहरूको बारेमा थप जान्न हाम्रो दान पृष्ठ हेर्नुहोस्।'}
                </Typography>
              </Card>
            </Grid>
            
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Card elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2, height: "100%" }}>
                <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "600", mb: 2 }}>
                  {language === 'en' 
                    ? 'Can I partner with ANTUF for an event?' 
                    : 'के म कार्यक्रमको लागि ANTUF सँग साझेदारी गर्न सक्छु?'}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                  {language === 'en'
                    ? 'Yes! We welcome partnerships and collaborations. Please contact us through the form above or email partnerships@antuf.org to discuss potential collaboration opportunities.'
                    : 'हो! हामी साझेदारी र सहयोगलाई स्वागत गर्छौं। सम्भावित सहयोग अवसरहरू छलफल गर्न कृपया माथिको फारम मार्फत वा partnerships@antuf.org मा इमेल गरेर हामीलाई सम्पर्क गर्नुहोस्।'}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {t.successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {language === 'en'
            ? 'Sorry, we could not send your message. Please try again.'
            : 'माफ गर्नुहोस्, हामी तपाईंको सन्देश पठाउन सकेनौं। कृपया फेरि प्रयास गर्नुहोस्।'}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default ContactUs;
