"use client";

import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      
      {/* Banner Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "40vh",
          backgroundImage: 'url("/images/pic2.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        />
        <Typography
          variant="h2"
          sx={{
            position: "relative",
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
            zIndex: 1,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Privacy Policy
        </Typography>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: "#f9f9f9" }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#333", mb: 3 }}>
            Privacy Policy
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="body1" paragraph>
            At Tutorials Material, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            1. Information We Collect
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ color: "#666", mt: 3, mb: 1 }}>
            Personal Information
          </Typography>
          <Typography variant="body1" paragraph>
            We may collect personal information that you voluntarily provide to us, including:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Name and contact information</Typography>
            <Typography component="li" variant="body1">Email address</Typography>
            <Typography component="li" variant="body1">Payment information</Typography>
            <Typography component="li" variant="body1">Profile information</Typography>
            <Typography component="li" variant="body1">Learning preferences and progress</Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ color: "#666", mt: 3, mb: 1 }}>
            Automatically Collected Information
          </Typography>
          <Typography variant="body1" paragraph>
            We may automatically collect certain information about your device and usage of our service:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">IP address and browser type</Typography>
            <Typography component="li" variant="body1">Device information</Typography>
            <Typography component="li" variant="body1">Usage patterns and preferences</Typography>
            <Typography component="li" variant="body1">Cookies and tracking technologies</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Provide and maintain our services</Typography>
            <Typography component="li" variant="body1">Process transactions and payments</Typography>
            <Typography component="li" variant="body1">Communicate with you about our services</Typography>
            <Typography component="li" variant="body1">Personalize your learning experience</Typography>
            <Typography component="li" variant="body1">Improve our services and develop new features</Typography>
            <Typography component="li" variant="body1">Comply with legal obligations</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            3. Information Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">With your consent</Typography>
            <Typography component="li" variant="body1">To comply with legal requirements</Typography>
            <Typography component="li" variant="body1">To protect our rights and safety</Typography>
            <Typography component="li" variant="body1">With service providers who help us operate our business</Typography>
            <Typography component="li" variant="body1">In connection with a business transfer or merger</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            4. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            5. Cookies and Tracking Technologies
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences, but disabling cookies may affect the functionality of our services.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            6. Your Rights and Choices
          </Typography>
          <Typography variant="body1" paragraph>
            Depending on your location, you may have certain rights regarding your personal information:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Access and update your personal information</Typography>
            <Typography component="li" variant="body1">Request deletion of your personal information</Typography>
            <Typography component="li" variant="body1">Opt-out of marketing communications</Typography>
            <Typography component="li" variant="body1">Request data portability</Typography>
            <Typography component="li" variant="body1">Object to processing of your personal information</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            7. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            8. International Data Transfers
          </Typography>
          <Typography variant="body1" paragraph>
            Your information may be transferred to and processed in countries other than your own. We ensure that appropriate safeguards are in place to protect your personal information during such transfers.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            9. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            10. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1"><strong>Email:</strong> privacy@antuf.org</Typography>
            <Typography variant="body1"><strong>Website:</strong> https://antuf.org</Typography>
          </Box>

          <Box sx={{ mt: 4, p: 3, backgroundColor: "#e8f5e8", borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              By using our services, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described herein.
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
