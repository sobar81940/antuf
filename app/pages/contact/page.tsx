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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the form data to your backend API
      console.log("Form submitted:", formData);
      
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
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <Navbar />

      {/* Banner Section - Modern Design */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: "45vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          py: { xs: 6, md: 8 },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            zIndex: 1,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100px",
            background: "linear-gradient(to top, #fff, transparent)",
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <Chip
              icon={<LanguageIcon />}
              label="English"
              onClick={() => setLanguage('en')}
              sx={{ 
                backgroundColor: language === 'en' ? '#fff' : 'rgba(255,255,255,0.2)',
                color: language === 'en' ? '#667eea' : '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                px: 2,
                py: 3,
                backdropFilter: 'blur(10px)',
                border: language === 'en' ? '2px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: language === 'en' ? '#fff' : 'rgba(255,255,255,0.35)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }
              }}
            />
            <Chip
              icon={<LanguageIcon />}
              label="नेपाली"
              onClick={() => setLanguage('ne')}
              sx={{ 
                backgroundColor: language === 'ne' ? '#fff' : 'rgba(255,255,255,0.2)',
                color: language === 'ne' ? '#667eea' : '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                px: 2,
                py: 3,
                backdropFilter: 'blur(10px)',
                border: language === 'ne' ? '2px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: language === 'ne' ? '#fff' : 'rgba(255,255,255,0.35)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                }
              }}
            />
          </Stack>
          <Typography
            variant="h1"
            sx={{
              color: "#fff",
              fontWeight: "800",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "4rem" },
              textShadow: "0 4px 20px rgba(0,0,0,0.2)",
              letterSpacing: "-0.02em",
            }}
          >
            {t.title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "rgba(255,255,255,0.95)",
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1.1rem", md: "1.4rem" },
              fontWeight: "400",
              lineHeight: 1.6,
              textShadow: "0 2px 10px rgba(0,0,0,0.15)",
            }}
          >
            {t.subtitle}
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, mt: { xs: -4, md: -6 } }}>
        {/* Contact Information Cards */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              color: "#1a1a2e", 
              mb: 2, 
              textAlign: "center", 
              fontWeight: "800",
              fontSize: { xs: "2rem", md: "2.5rem" },
              letterSpacing: "-0.02em",
            }}
          >
            {t.getInTouch}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#666", 
              mb: 6, 
              textAlign: "center",
              maxWidth: "600px",
              mx: "auto",
              fontSize: "1.1rem",
            }}
          >
            {language === 'en' 
              ? 'Choose your preferred way to reach out to us' 
              : 'हामीलाई सम्पर्क गर्न आफ्नो मनपर्ने तरिका छान्नुहोस्'}
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
                    p: 4,
                    textAlign: "center",
                    height: "100%",
                    background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                    border: "2px solid #f0f0f0",
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.4s ease",
                    },
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: "0 20px 60px rgba(102, 126, 234, 0.25)",
                      borderColor: "#667eea",
                      "&::before": {
                        transform: "scaleX(1)",
                      }
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 3,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {React.cloneElement(info.icon, { sx: { fontSize: 40, color: "#fff" } })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: "700", mb: 2, color: "#1a1a2e", fontSize: "1.1rem" }}>
                    {info.title}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#667eea", mb: 2, fontWeight: "700", fontSize: "1rem" }}>
                    {info.content}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
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
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 4, md: 6 }, 
                background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                border: "2px solid #f0f0f0", 
                borderRadius: 4,
                boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
              }}
            >
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <Typography variant="h4" sx={{ color: "#1a1a2e", fontWeight: "800", mb: 2, fontSize: { xs: "1.8rem", md: "2.2rem" } }}>
                  {t.contactForm}
                </Typography>
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 4, 
                    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: 2,
                    mx: "auto",
                    mb: 2,
                  }}
                />
                <Typography variant="body1" sx={{ color: "#666", maxWidth: "600px", mx: "auto" }}>
                  {language === 'en' 
                    ? 'Fill out the form below and our team will get back to you shortly' 
                    : 'तलको फारम भर्नुहोस् र हाम्रो टोलीले तपाईंलाई छिट्टै सम्पर्क गर्नेछ'}
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <Typography variant="body1" sx={{ color: "#1a1a2e", mb: 1.5, fontWeight: "600", fontSize: "0.95rem" }}>
                      {t.selectReason}<span style={{ color: "#f44336" }}>*</span>
                    </Typography>
                    <FormControl fullWidth error={!!errors.selectReason}>
                      <Select
                        name="selectReason"
                        value={formData.selectReason}
                        onChange={handleInputChange}
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e0e0e0",
                            borderWidth: "2px",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#667eea",
                            borderWidth: "2px",
                          },
                          "& .MuiSelect-select": {
                            color: formData.selectReason ? "#1a1a2e" : "#999",
                            py: 1.5,
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
                      {errors.selectReason && <Typography variant="caption" sx={{ color: "#f44336", mt: 1, ml: 1 }}>{errors.selectReason}</Typography>}
                    </FormControl>
                  </Grid>

                  <Grid
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Typography variant="body1" sx={{ color: "#1a1a2e", mb: 1.5, fontWeight: "600", fontSize: "0.95rem" }}>
                      {t.name}<span style={{ color: "#f44336" }}>*</span>
                    </Typography>
                    <TextField 
                      fullWidth 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      error={!!errors.name} 
                      helperText={errors.name} 
                      variant="outlined" 
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                            borderWidth: "2px",
                          },
                          "& input": {
                            py: 1.5,
                          }
                        }
                      }} 
                    />
                  </Grid>
                  
                  <Grid
                    size={{
                      xs: 12,
                      md: 6
                    }}>
                    <Typography variant="body1" sx={{ color: "#1a1a2e", mb: 1.5, fontWeight: "600", fontSize: "0.95rem" }}>
                      {t.email}<span style={{ color: "#f44336" }}>*</span>
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                            borderWidth: "2px",
                          },
                          "& input": {
                            py: 1.5,
                          }
                        }
                      }} 
                    />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="body1" sx={{ color: "#1a1a2e", mb: 1.5, fontWeight: "600", fontSize: "0.95rem" }}>
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
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                            borderWidth: "2px",
                          },
                          "& input": {
                            py: 1.5,
                          }
                        },
                        "& .MuiOutlinedInput-input::placeholder": {
                          color: "#999",
                          opacity: 1,
                        }
                      }} 
                    />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="body1" sx={{ color: "#1a1a2e", mb: 1.5, fontWeight: "600", fontSize: "0.95rem" }}>
                      {t.message}<span style={{ color: "#f44336" }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      error={!!errors.message}
                      helperText={errors.message || `${formData.message.length}/300`}
                      variant="outlined"
                      placeholder={t.messagePlaceholder}
                      inputProps={{ maxLength: 300 }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#fff",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#667eea",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                            borderWidth: "2px",
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
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "#fff",
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: "700",
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)",
                          boxShadow: "0 12px 32px rgba(102, 126, 234, 0.5)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {t.submit}
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
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 5, 
                    border: "2px solid #f0f0f0", 
                    borderRadius: 4, 
                    height: "100%",
                    background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#667eea",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ color: "#1a1a2e", fontWeight: "800", mb: 4, fontSize: "1.5rem" }}>
                    {t.quickContact}
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: "#667eea", fontWeight: "700", mb: 2, fontSize: "1.1rem" }}>
                      {t.generalInquiries}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: "#667eea" }} /> info@antuf.org
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                      {language === 'en' 
                        ? 'For general questions and information about ANTUF' 
                        : 'ANTUF बारे सामान्य प्रश्न र जानकारीको लागि'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: "#667eea", fontWeight: "700", mb: 2, fontSize: "1.1rem" }}>
                      {t.supportTeam}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: "#667eea" }} /> support@antuf.org
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                      {language === 'en' 
                        ? 'For membership inquiries and support' 
                        : 'सदस्यता सोधपुछ र समर्थनको लागि'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: "#667eea", fontWeight: "700", mb: 2, fontSize: "1.1rem" }}>
                      {t.partnerships}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: "#667eea" }} /> partnerships@antuf.org
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                      {language === 'en' 
                        ? 'For collaboration and partnership opportunities' 
                        : 'सहकार्य र साझेदारी अवसरहरूको लागि'}
                    </Typography>
                  </Box>

                  <Box 
                    sx={{ 
                      p: 3, 
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 3,
                      border: "none",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: "700", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon /> {t.responseTime}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.95)", lineHeight: 1.8 }}>
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
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 5, 
                    border: "2px solid #f0f0f0", 
                    borderRadius: 4, 
                    height: "100%",
                    background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#667eea",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ color: "#1a1a2e", fontWeight: "800", mb: 4, fontSize: "1.5rem" }}>
                    {language === 'en' ? 'Connect With Us' : 'हामीसँग जडान गर्नुहोस्'}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: "#666", mb: 4, lineHeight: 1.8 }}>
                    {language === 'en' 
                      ? 'Stay connected with ANTUF through our social media channels for the latest updates, events, and community news.'
                      : 'नवीनतम अपडेट, कार्यक्रमहरू र समुदाय समाचारको लागि हाम्रो सोशल मिडिया च्यानलहरू मार्फत ANTUF सँग जडान रहनुहोस्।'}
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ mb: 5 }}>
                    <Button
                      variant="contained"
                      startIcon={<FacebookIcon />}
                      sx={{
                        background: "#1877f2",
                        color: "#fff",
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(24, 119, 242, 0.3)",
                        "&:hover": {
                          background: "#0d65d9",
                          boxShadow: "0 6px 16px rgba(24, 119, 242, 0.4)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Facebook
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<TwitterIcon />}
                      sx={{
                        background: "#1da1f2",
                        color: "#fff",
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(29, 161, 242, 0.3)",
                        "&:hover": {
                          background: "#0c90e0",
                          boxShadow: "0 6px 16px rgba(29, 161, 242, 0.4)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Twitter
                    </Button>
                  </Stack>

                  <Divider sx={{ my: 4 }} />

                  <Box>
                    <Typography variant="h6" sx={{ color: "#1a1a2e", fontWeight: "700", mb: 3, fontSize: "1.1rem" }}>
                      {language === 'en' ? 'Visit Our Office' : 'हाम्रो कार्यालय भ्रमण गर्नुहोस्'}
                    </Typography>
                    <Box sx={{ mb: 3, display: "flex", alignItems: "start", gap: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 20, color: "#667eea", mt: 0.3 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: "#1a1a2e", fontWeight: 700, mb: 0.5 }}>
                          ANTUF Headquarters
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Kathmandu, Nepal
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "start", gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 20, color: "#667eea", mt: 0.3 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: "#1a1a2e", fontWeight: 700, mb: 0.5 }}>
                          {language === 'en' ? 'Office Hours:' : 'कार्यालय समय:'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                          {language === 'en' 
                            ? 'Monday - Friday: 10:00 AM - 5:00 PM NPT'
                            : 'सोमबार - शुक्रबार: बिहान १०:०० - साँझ ५:०० NPT'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                          {language === 'en' 
                            ? 'Saturday: By appointment only'
                            : 'शनिबार: भेटघाट अनुसार मात्र'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                          {language === 'en' ? 'Sunday: Closed' : 'आइतबार: बन्द'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box 
                    sx={{ 
                      p: 3, 
                      mt: 4,
                      background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                      borderRadius: 3,
                      border: "2px solid #bbdefb"
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#667eea", fontWeight: "700", mb: 1, fontSize: "1rem" }}>
                      💡 {language === 'en' ? 'Quick Tip' : 'द्रुत सुझाव'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
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
        <Box sx={{ mt: 10 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: "#1a1a2e", 
              fontWeight: "800", 
              mb: 2, 
              textAlign: "center",
              fontSize: { xs: "2rem", md: "2.5rem" },
              letterSpacing: "-0.02em",
            }}
          >
            {t.faqTitle}
          </Typography>
          <Box 
            sx={{ 
              width: 60, 
              height: 4, 
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
              mx: "auto",
              mb: 6,
            }}
          />
          
          <Grid container spacing={4}>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Card 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  border: "2px solid #f0f0f0", 
                  borderRadius: 3, 
                  height: "100%",
                  background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#667eea",
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
                  }
                }}
              >
                <Typography variant="h6" sx={{ color: "#667eea", fontWeight: "700", mb: 2, fontSize: "1.15rem" }}>
                  {language === 'en' 
                    ? 'How can I become a member of ANTUF?' 
                    : 'म ANTUF को सदस्य कसरी बन्न सक्छु?'}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
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
              <Card 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  border: "2px solid #f0f0f0", 
                  borderRadius: 3, 
                  height: "100%",
                  background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#667eea",
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
                  }
                }}
              >
                <Typography variant="h6" sx={{ color: "#667eea", fontWeight: "700", mb: 2, fontSize: "1.15rem" }}>
                  {language === 'en' 
                    ? 'What events does ANTUF organize?' 
                    : 'ANTUF ले कस्ता कार्यक्रमहरू आयोजना गर्छ?'}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
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
              <Card 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  border: "2px solid #f0f0f0", 
                  borderRadius: 3, 
                  height: "100%",
                  background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#667eea",
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
                  }
                }}
              >
                <Typography variant="h6" sx={{ color: "#667eea", fontWeight: "700", mb: 2, fontSize: "1.15rem" }}>
                  {language === 'en' 
                    ? 'How can I support ANTUF?' 
                    : 'म ANTUF लाई कसरी समर्थन गर्न सक्छु?'}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
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
              <Card 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  border: "2px solid #f0f0f0", 
                  borderRadius: 3, 
                  height: "100%",
                  background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#667eea",
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
                  }
                }}
              >
                <Typography variant="h6" sx={{ color: "#667eea", fontWeight: "700", mb: 2, fontSize: "1.15rem" }}>
                  {language === 'en' 
                    ? 'Can I partner with ANTUF for an event?' 
                    : 'के म कार्यक्रमको लागि ANTUF सँग साझेदारी गर्न सक्छु?'}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
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

      <Footer />
    </>
  );
};

export { default } from "./ContactRedesign";
