import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
export default function AdBanner() {
  const router = useRouter(); // Initialize useRouter
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" }, // Stack in small screens, horizontal for larger
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#121212", // Background color matching the ad
        color: "#fff",
        paddingTop: "16px",
        padding: "16px",
        border: "2px solid #fff",
        borderRadius: "8px", // Rounded corners
        gap: "26px", // Spacing between child elements
        textAlign: "center", // Center text in smaller devices
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Subtle shadow
      }}
    >
      {/* Knowledge & Distractions Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          flexWrap: "wrap", // Handle smaller screens
        }}
      >
        <Box
          sx={{
            bgcolor: "#212121",
            padding: "8px 16px",
            borderRadius: "4px",
            minWidth: "100px",
          }}
        >
          <Typography fontWeight="bold" fontSize="14px">
            100%
          </Typography>
          <Typography fontSize="12px">Knowledge</Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#212121",
            padding: "8px 16px",
            borderRadius: "4px",
            minWidth: "100px",
          }}
        >
          <Typography fontWeight="bold" fontSize="14px">
            0%
          </Typography>
          <Typography fontSize="12px">Distractions</Typography>
        </Box>
      </Box>

      {/* "Avoid All Ads" Section */}
      <Box>
        <Typography
          fontWeight="bold"
          fontSize={{ xs: "14px", sm: "16px" }}
          sx={{
            color: "#FFD700", // Golden color
            textDecoration: "underline",
          }}
        >
          Avoid All Ads
        </Typography>
        <Typography fontSize="14px" sx={{ mt: 1 }}>
          with
        </Typography>
      </Box>

      {/*  Logo and Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",

          flexWrap: "wrap", // Adjust layout on small screens
        }}
      >
        <Box
          component="img"
          src="/images/logo2.png" // Replace with the actual logo path
          alt="BrainyBytes"
          sx={{
            height: "70px", // Reduced height
            width: "auto", // Automatically adjusts width to maintain aspect ratio
            objectFit: "cover",
            paddingTop: "10px",
          }}
        />

        <Button
          variant="contained"
          sx={{
            bgcolor: "#FFD700", // Golden button
            color: "#000",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#FFC107",
            },
          }}
          onClick={() => router.push("/pricing")}
        >
          Go Premium
        </Button>
      </Box>
    </Box>
  );
}
