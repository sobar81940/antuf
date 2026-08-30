// pages/index.js
import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Icon for Ask Question
import SmartToyIcon from "@mui/icons-material/SmartToy"; // Icon for AI Assistant
import AIAssistant from "./AiAssistant";
const Home = () => {
  // State hook to manage the active tab index. Initially set to 0, meaning the first tab is active by default.
  const [activeTab, setActiveTab] = useState(0);

  // useTheme hook is used to get the current theme from Material-UI. This helps in customizing the UI based on the theme.
  const theme = useTheme();

  // useMediaQuery hook is used to detect the screen size. It checks if the screen width is below the "sm" breakpoint (usually 600px).
  // This will help in making responsive adjustments for mobile or smaller screens.
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Function to handle the tab change event. When a tab is clicked, this function is triggered to update the active tab state.
  const handleTabChange = (event, newValue) => {
    // Set the active tab to the new value (index) based on which tab was clicked.
    setActiveTab(newValue);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          marginBottom: "10px",
        }}
      >
        <Divider
          sx={{
            height: "5px",
            width: isMobile ? "100%" : "800px",
            marginTop: "20px",
            // margin: "auto",
            backgroundColor: "white",
          }}
        />

        <Box
          sx={{
            // display: "flex",
            flexDirection: isMobile ? "column" : "row",

            width: isMobile ? "100%" : "800px",
            margin: "auto", // Centers horizontally within the parent container
            //marginTop: 10,
            textAlign: isMobile ? "center" : "left", // Adjust text alignment based on device
            color: "white",
          }}
        >
          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            variant="fullWidth"
            textColor="inherit"
            // indicatorColor="primary"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#8A12FC", // Custom purple color for the indicator
              },
              marginTop: "30px",
              // bgcolor: "yellow",
              borderRadius: "8px",
            }}
          >
            <Tab
              icon={<HelpOutlineIcon />} // Icon for Ask Question
              iconPosition="start" // Position icon before label
              label="knowledge"
              sx={{
                color: "white", // Default text color
                "&:hover": {
                  bgcolor: "#8A12FC",
                  color: "white",
                },
                "&.Mui-selected": {
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#8A12FC", // Custom purple color for the indicator
                },
              }}
            />
            <Tab
              icon={<SmartToyIcon />} // Icon for AI Assistant
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  AI Assistant
                  <Chip
                    label="Beta"
                    size="small"
                    sx={{
                      bgcolor: "#FFD700", // Gold color for the Beta chip
                      color: "black",
                      fontWeight: "bold",
                      borderRadius: "4px",
                      height: "20px",
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>
              }
              iconPosition="start" // Position icon before label
              sx={{
                color: "white", // Default text color
                "&:hover": {
                  bgcolor: "#8A12FC",
                  color: "white",
                },
                "&.Mui-selected": {
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#8A12FC", // Custom purple color for the indicator
                },
              }}
            />
          </Tabs>

          {/* Tab Content */}
          <Box>
            {activeTab === 0 && (
              <Box
                sx={{
                  padding: 4,

                  //  background: "linear-gradient(135deg, #6a11cb, #2575fc)",

                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    letterSpacing: "0.05em",
                    marginBottom: 2,
                    textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  AI Assistant
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    lineHeight: 1.8,
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  "Creating an impactful course is more than just teaching—it's
                  crafting a legacy of knowledge. Let your passion shine and
                  build something extraordinary today."
                </Typography>
              </Box>
            )}
            {activeTab === 1 && (
              <Box>
                <AIAssistant />
              </Box>
            )}
          </Box>
        </Box>
        <Divider
          sx={{
            height: "5px",
            width: isMobile ? "100%" : "800px",
            marginTop: "20px",
            // margin: "auto",
            backgroundColor: "white",
          }}
        />
      </Box>
    </>
  );
};

export default Home;
