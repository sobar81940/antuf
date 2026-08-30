"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Switch,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/navigation";
import StarIcon from "@mui/icons-material/Star";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { motion } from "framer-motion";
const HomeButton = styled(IconButton)({
  position: "absolute",
  top: "16px",
  left: "16px",
  backgroundColor: "#6C0BA9",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#0077E4",
  },
});

const StyledCard = styled(Card)(({ theme, variant }) => ({
  width: "480px", // Adjusted width
  height: "700px",
  background: "linear-gradient(135deg, #1e1e1e, #2a2a2a)",
  color: "#fff",
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border:
    (variant as string) === "highlighted"
      ? "2px solid #0A84FF"
      : "1px solid #333",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.5)",
    backgroundColor: "#6C0BA9",
    transform: "scale(1.03)",
    "& .MuiTypography-root": {
      color: "#ffffff",
    },
    "& .MuiButton-root": {
      backgroundColor: "#6C0BA9",
      color: "#9A7DFF",
    },
    "& .MuiIconButton-root": {
      color: "#ffffff",
    },
  },
}));

const PriceText = styled(Typography)({
  fontSize: "32px",
  fontWeight: "bold",
  color: "#FFD700",
});

const PlanTitle = styled(Typography)({
  fontSize: "24px",
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
  color: "#6C0BA9",
  gap: "8px",
});

const PlanTitl = styled(Typography)({
  fontSize: "28px",

  fontWeight: "bold",
  color: "#00e67a",
  gap: "8px",
});

const FeatureText = styled(Typography)({
  fontSize: "18px",
  color: "#B0B0B0",
});

const ButtonStyled = styled(Button)({
  background: "linear-gradient(90deg, #6C0BA9, #6C0BA9)",
  color: "#fff",
  borderRadius: "30px",
  marginTop: 16,
  padding: "10px 24px",
  fontWeight: "bold",
  textTransform: "uppercase",
  "&:hover": {
    backgroundColor: "#6C0BA9",
    color: "#9A7DFF",
  },
});

const BackgroundBox = styled(Box)({
  backgroundImage: 'url("/images/pic2.png")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "4rem 2rem",
  textAlign: "center",
  color: "#fff",
  overflow: "hidden",
});

const PricingCard = ({
  title,
  price,
  features,
  buttonLabel,
  icon,
  billingPeriod,
  handleCheckout,
}) => (
  <StyledCard>
    <CardContent>
      <PlanTitle>
        <IconButton size="small" sx={{ color: "#FFD700" }}>
          {icon}
        </IconButton>
      </PlanTitle>
      <PlanTitl>{title}</PlanTitl>
      <PriceText>{price}</PriceText>

      <Box mt={2}>
        {features.map((feature, index) => (
          <FeatureText key={index}>{feature}</FeatureText>
        ))}
      </Box>

      <ButtonStyled onClick={() => handleCheckout(billingPeriod, price, title)}>
        {buttonLabel}
      </ButtonStyled>
    </CardContent>
  </StyledCard>
);

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const router = useRouter();
  const handleToggle = () => setIsAnnual(!isAnnual);

  const handleCheckout = async (billingPeriod, price, title) => {
    console.log("Billing Period:", billingPeriod, "Price:", price);

    try {
      const response = await fetch(`${process.env.API}/user/pricing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingPeriod, price, title }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("data from post--", response.text);
      const data = await response.json();
      console.log("data after post route pricing---", data);

      if (data?.err) {
        console.log("Stripe Checkout Error:", data?.err);
      } else {
        window.location.href = data?.id;
      }
    } catch (error) {
      console.log("An error occurred during checkout:", error);
    }
  };

  return (
    <BackgroundBox>
      <HomeButton onClick={() => router.push("/")}>
        <HomeIcon />
      </HomeButton>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          padding: 8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#ffffff",
            mb: 6,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                padding: "0.5rem 1.5rem",
                borderRadius: "20px",
                background: isAnnual ? "#6C0BA9" : "#0077E4",
                color: isAnnual ? "#888" : "#fff",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Monthly
            </Box>
          </motion.div>

          <Switch checked={isAnnual} onChange={handleToggle} color="warning" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                padding: "0.5rem 1.5rem",
                borderRadius: "20px",
                background: isAnnual ? "#6C0BA9" : "#333",
                color: isAnnual ? "#fff" : "#888",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Annual
            </Box>
          </motion.div>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
          <PricingCard
            title={
              isAnnual
                ? "Year of Premium Benefits: Starter Plan (Annual)"
                : "Pay As You Go: Starter Plan (Monthly)"
            }
            price={isAnnual ? "190 USD/year" : "19 USD/month"}
            features={
              isAnnual
                ? [
                    "✔️ Go completely ads free",
                    "✔️ Summarize articles with GPT",
                    "✔️ Comment on articles",
                    "❌ Gain in-depth knowledge with premium content",
                    "❌ Like, comment, and share posts on social media",
                    "✔️ Priority customer support",
                    "✔️ Custom dashboard with analytics",
                    " Exclusive AI-powered recommendations",
                    "❌ Deep dive articles for detailed insights",
                    "❌ Early access to new features and tools",
                  ]
                : [
                    "✔️ Go completely ads free",
                    "✔️ Summarize articles with GPT",
                    "✔️ Comment on articles",
                    "✔️ Gain in-depth knowledge with premium content",
                    "✔️ Like, comment, and share posts on social media",
                    "❌ Priority customer support",
                    "❌ Custom dashboard with analytics",
                    "❌ Exclusive AI-powered recommendations",
                    "❌ Deep dive articles for detailed insights",
                    "❌ Early access to new features and tools",
                  ]
            }
            buttonLabel="Subscribe Now"
            icon={<FlashOnIcon />}
            billingPeriod={isAnnual ? "annual" : "monthly"}
            handleCheckout={handleCheckout}
          />

          <PricingCard
            title={
              isAnnual
                ? "Unlock Unlimited Value: Starter Plan (Annual)"
                : "Get Started Now: Starter Plan (Monthly)"
            }
            price={isAnnual ? "990 USD/year" : "99 USD/month"}
            features={
              isAnnual
                ? [
                    "✔️ Go completely ads free",
                    "✔️ Summarize articles with GPT",
                    "✔️ Comment on articles",
                    "✔️ Gain in-depth knowledge with premium content",
                    "✔️ Like, comment, and share posts on social media",
                    "✔️ Priority customer support",
                    "✔️ Custom dashboard with analytics",
                    "✔️ Exclusive AI-powered recommendations",
                    "✔️ Deep dive articles for detailed insights",
                    "✔️ Early access to new features and tools",
                  ]
                : [
                    "✔️ Go completely ads free",
                    "✔️ Summarize articles with GPT",
                    "✔️ Comment on articles",
                    "✔️ Gain in-depth knowledge with premium content",
                    "✔️ Like, comment, and share posts on social media",
                    "✔️ Priority customer support",
                    "✔️ Custom dashboard with analytics",
                    "✔️ Exclusive AI-powered recommendations",
                    "✔️ Deep dive articles for detailed insights",
                    "✔️ Early access to new features and tools",
                  ]
            }
            buttonLabel="Subscribe Now"
            icon={<StarIcon />}
            billingPeriod={isAnnual ? "annual" : "monthly"}
            handleCheckout={handleCheckout}
          />
        </Box>
      </Box>
    </BackgroundBox>
  );
};

export default Pricing;
