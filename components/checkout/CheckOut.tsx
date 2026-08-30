"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CircularProgress,
} from "@mui/material";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState([]);
  const [course, setCourse] = useState(null);
  const router = useRouter();
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  const { data } = useSession();

  useEffect(() => {
    if (!search) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/checkout/course/${search}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [search]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    const loadHandler = () => {
      console.log("Razorpay script loaded");
    };

    script.addEventListener("load", loadHandler);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", loadHandler);
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpay = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/payment/razorpaypayment/razorpay/${search}`
      );
      const data = await response.json();
      const options = {
        key: process.env.RAZORPAY_CLIENT_ID,
        amount: data && data.amount * 100,
        currency: "INR",
        name: "ANTUFal",
        description: "Test Payment",
        order_id: data && data.id,
        handler: function (response) {
          verifyPayment(response.razorpay_payment_id);
          setLoading(false);
        },
        prefill: {
          name: data && data.name,
          email: data && data.email,
        },
        notes: {
          address: "Your Address",
        },
        theme: {
          color: "#4f3aaa",
        },
      };
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log("Error initiating payment:", error);
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      const response = await fetch(
        `/api/user/payment/razorpaypayment/razorpayverify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ razorpay_payment_id: paymentId }),
        }
      );
      const data = await response.json();
      if (data?.err) {
        router.push("/cancel");
      } else {
        router.push("/success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStripe = async () => {
    try {
      const response = await fetch(
        `/api/user/payment/stripepayment/stripe/${search}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        window.location.href = data.id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaypal = async () => {
    try {
      const response = await fetch(
        `/api/user/payment/paypalpayment/paypal/${search}`
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error("paypal payment failed");
      } else {
        router.push(data.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress
          size={80} // Makes it larger
          sx={{
            color: "purple", // Sets the color to purple
            animation: "spin 2s linear infinite", // Adds custom animation
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(180deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </Box>
    );
  }

  return (
    <>
      {/* Main Content */}
      <Box className="container mt-5">
        <Grid container spacing={9}>
          {/* Payment Gateway Section */}
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Box
              sx={{
                p: 3,
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "primary.main",
                  letterSpacing: 1.5,
                  textAlign: "center",
                  background: "linear-gradient(90deg, #00ff88, #00e67a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Choose Payment Gateway
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  mt: 4,
                  p: 2,
                }}
              >
                <Button
                  onClick={handlePaypal}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    border: "10px solid #FFD700", // Yellow border

                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                      backgroundColor: "#f0f8ff",
                    },
                  }}
                >
                  <Image
                    src="/images/paypal.png"
                    alt="PayPal"
                    width={100}
                    height={50}
                  />
                </Button>

                <Button
                  onClick={handleStripe}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    border: "10px solid #FFD700", // Yellow border

                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                      backgroundColor: "#f0f8ff",
                    },
                  }}
                >
                  <Image
                    src="/images/stripe.png"
                    alt="Stripe"
                    width={110}
                    height={50}
                  />
                </Button>

                <Button
                  onClick={handleRazorpay}
                  sx={{
                    border: "10px solid #FFD700", // Yellow border

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                      backgroundColor: "#f0f8ff",
                    },
                  }}
                >
                  <Image
                    src="/images/razorpay.png"
                    alt="Razorpay"
                    width={110}
                    height={50}
                  />
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Course Details Section */}
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "primary.main",
                  letterSpacing: 1.5,
                  textAlign: "center",
                  background: "linear-gradient(90deg, #00ff88, #00e67a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Course Info
              </Typography>

              <Grid container spacing={2}>
                {course &&
                  course.map((courseItem, index) => (
                    <Grid key={index} size={12}>
                      <Card
                        sx={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          backgroundColor: "#fff",
                        }}
                      >
                        {/* Course Image */}
                        <Box
                          sx={{
                            width: { xs: "100%", sm: "40%" },
                            backgroundImage: `url(${courseItem.imageUrl || "/images/pic3.png"
                              })`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: { xs: "400px", sm: "auto" },
                          }}
                        ></Box>

                        {/* Course Info */}
                        <Box
                          sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {courseItem.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ mt: 1, color: "#666" }}
                            >
                              {courseItem.description.substring(0, 100)}...
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 1,
                                color: "#00e67a",
                              }}
                            >
                              Level: {courseItem.level}
                            </Typography>
                          </Box>

                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary"
                            sx={{ mt: 2 }}
                          >
                            $ {courseItem?.price}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
