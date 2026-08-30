"use client";

import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const TermsAndConditions = () => {
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
          Terms & Conditions
        </Typography>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: "#f9f9f9" }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#333", mb: 3 }}>
            Terms and Conditions of Use
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using Tutorials Material ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            2. Description of Service
          </Typography>
          <Typography variant="body1" paragraph>
            Tutorials Material is an online learning management system that provides educational content, courses, and learning materials. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            3. User Accounts and Registration
          </Typography>
          <Typography variant="body1" paragraph>
            To access certain features of the Service, you may be required to create an account. You are responsible for:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Maintaining the confidentiality of your account credentials</Typography>
            <Typography component="li" variant="body1">All activities that occur under your account</Typography>
            <Typography component="li" variant="body1">Providing accurate and complete information during registration</Typography>
            <Typography component="li" variant="body1">Updating your information to keep it current</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            4. Course Content and Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All course content, including but not limited to videos, text, images, audio, and software, is the property of Tutorials Material or its content providers and is protected by copyright and other intellectual property laws. You may not:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Copy, distribute, or republish course content</Typography>
            <Typography component="li" variant="body1">Share your account credentials with others</Typography>
            <Typography component="li" variant="body1">Download content for redistribution</Typography>
            <Typography component="li" variant="body1">Use content for commercial purposes without permission</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            5. Payment Terms
          </Typography>
          <Typography variant="body1" paragraph>
            Some courses may require payment. By making a purchase, you agree to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Provide accurate payment information</Typography>
            <Typography component="li" variant="body1">Pay all charges incurred by your account</Typography>
            <Typography component="li" variant="body1">Our refund policy as stated separately</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            6. User Conduct
          </Typography>
          <Typography variant="body1" paragraph>
            You agree not to use the Service to:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Upload or transmit any unlawful, harmful, or inappropriate content</Typography>
            <Typography component="li" variant="body1">Interfere with or disrupt the Service or servers</Typography>
            <Typography component="li" variant="body1">Attempt to gain unauthorized access to any part of the Service</Typography>
            <Typography component="li" variant="body1">Impersonate any person or entity</Typography>
            <Typography component="li" variant="body1">Violate any applicable laws or regulations</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            7. Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            8. Disclaimers
          </Typography>
          <Typography variant="body1" paragraph>
            The Service is provided "as is" without any warranties, express or implied. We do not guarantee that:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">The Service will be uninterrupted or error-free</Typography>
            <Typography component="li" variant="body1">The results obtained from using the Service will be accurate or reliable</Typography>
            <Typography component="li" variant="body1">Any defects in the Service will be corrected</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            9. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            In no event shall Tutorials Material be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            10. Termination
          </Typography>
          <Typography variant="body1" paragraph>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            11. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms and Conditions on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms and Conditions.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            12. Governing Law
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which Tutorials Material operates, without regard to its conflict of law provisions.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            13. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms and Conditions, please contact us at:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1"><strong>Email:</strong> support@antuf.org</Typography>
            <Typography variant="body1"><strong>Website:</strong> https://antuf.org/</Typography>
          </Box>

          <Box sx={{ mt: 4, p: 3, backgroundColor: "#e3f2fd", borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              By using Tutorials Material, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};

export default TermsAndConditions;
