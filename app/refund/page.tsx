"use client";

import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const RefundPolicy = () => {
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
          Refund Policy
        </Typography>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: "#f9f9f9" }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#333", mb: 3 }}>
            Refund and Cancellation Policy
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="body1" paragraph>
            At Tutorials Material, we want you to be completely satisfied with your purchase. This Refund Policy outlines the terms and conditions for refunds and cancellations of our courses and services.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            1. 30-Day Money-Back Guarantee
          </Typography>
          <Typography variant="body1" paragraph>
            We offer a 30-day money-back guarantee for most of our courses. If you are not satisfied with your purchase, you may request a full refund within 30 days of your purchase date, provided that:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">You have completed less than 30% of the course content</Typography>
            <Typography component="li" variant="body1">You have not downloaded any course materials or certificates</Typography>
            <Typography component="li" variant="body1">The request is made within 30 days of purchase</Typography>
            <Typography component="li" variant="body1">You provide a valid reason for the refund request</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            2. Refund Exclusions
          </Typography>
          <Typography variant="body1" paragraph>
            The following purchases are not eligible for refunds:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Courses purchased with promotional codes or during special offers</Typography>
            <Typography component="li" variant="body1">Digital downloads that have been completed</Typography>
            <Typography component="li" variant="body1">Subscriptions after the first 30 days</Typography>
            <Typography component="li" variant="body1">Custom or personalized training programs</Typography>
            <Typography component="li" variant="body1">Courses purchased more than 30 days ago</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            3. How to Request a Refund
          </Typography>
          <Typography variant="body1" paragraph>
            To request a refund, please follow these steps:
          </Typography>
          <Box component="ol" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Contact our support team at support@antuf.org</Typography>
            <Typography component="li" variant="body1">Include your order number and reason for the refund request</Typography>
            <Typography component="li" variant="body1">Provide any relevant details about your experience</Typography>
            <Typography component="li" variant="body1">Wait for our team to review your request (typically 2-3 business days)</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            4. Refund Processing Time
          </Typography>
          <Typography variant="body1" paragraph>
            Once your refund request is approved:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Credit card refunds: 5-10 business days</Typography>
            <Typography component="li" variant="body1">PayPal refunds: 3-5 business days</Typography>
            <Typography component="li" variant="body1">Bank transfer refunds: 7-14 business days</Typography>
            <Typography component="li" variant="body1">Digital wallet refunds: 1-3 business days</Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Please note that processing times may vary depending on your financial institution.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            5. Subscription Cancellations
          </Typography>
          <Typography variant="body1" paragraph>
            For subscription-based services:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">You can cancel your subscription at any time from your account dashboard</Typography>
            <Typography component="li" variant="body1">Cancellations take effect at the end of your current billing period</Typography>
            <Typography component="li" variant="body1">No refunds are provided for partial subscription periods</Typography>
            <Typography component="li" variant="body1">You will retain access to content until the end of your paid period</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            6. Technical Issues and Course Quality
          </Typography>
          <Typography variant="body1" paragraph>
            If you experience technical issues or quality problems with our courses:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Contact our technical support team immediately</Typography>
            <Typography component="li" variant="body1">We will work to resolve the issue within 48 hours</Typography>
            <Typography component="li" variant="body1">If the issue cannot be resolved, a full refund may be provided</Typography>
            <Typography component="li" variant="body1">We may offer alternative solutions or course credits</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            7. Promotional Offers and Discounts
          </Typography>
          <Typography variant="body1" paragraph>
            Special terms may apply to promotional purchases:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Courses purchased with significant discounts may have modified refund terms</Typography>
            <Typography component="li" variant="body1">Free courses and bonuses are not eligible for cash refunds</Typography>
            <Typography component="li" variant="body1">Bundle purchases may be subject to different refund calculations</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            8. Disputed Charges
          </Typography>
          <Typography variant="body1" paragraph>
            If you notice an unauthorized charge or billing error:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <Typography component="li" variant="body1">Contact us immediately before disputing with your bank</Typography>
            <Typography component="li" variant="body1">Provide details about the charge in question</Typography>
            <Typography component="li" variant="body1">We will investigate and resolve legitimate billing errors promptly</Typography>
          </Box>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            9. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new policy.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ color: "#555", mt: 4, mb: 2 }}>
            10. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            For refund requests or questions about this policy, please contact us:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1"><strong>Email:</strong> support@antuf.org</Typography>
            <Typography variant="body1"><strong>Phone:</strong> +1 (555) 123-4567</Typography>
            <Typography variant="body1"><strong>Website:</strong> https://antuf.org/</Typography>
            <Typography variant="body1"><strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</Typography>
          </Box>

          <Box sx={{ mt: 4, p: 3, backgroundColor: "#fff3cd", borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              <strong>Important:</strong> This refund policy is designed to be fair to both our customers and our business. We encourage you to review course previews and descriptions carefully before making a purchase to ensure the course meets your needs.
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};

export default RefundPolicy;
