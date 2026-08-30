import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { runAi } from "@/components/ai/ai";
import SendIcon from "@mui/icons-material/Send"; // Add an icon to the button

const AIAssistant = () => {
  // State hook to manage the loading state. Initially set to 'false', indicating that the content is not being loaded.
  const [loading, setLoading] = useState(false);

  // State hook to store the user's input. Initially set to an empty string.
  const [userInput, setUserInput] = useState("");

  // State hook to store the summarized content. Initially set to an empty string.
  const [summarizedContent, setSummarizedContent] = useState("");

  // Function to handle the summarization logic
  const handleSummarize = async () => {
    // Check if the user has provided any input. If there's input, proceed with summarization.
    if (userInput) {
      setLoading(true); // Set loading to true to show a loading spinner or indicator

      try {
        // Create a prompt for the AI function. The prompt asks the AI to provide the best answer to the user's question.
        const prompt = `Provide the best answer to this question: ${userInput}`;

        // Call the AI function (e.g., GPT-3 or another AI model) for summarization. It returns the summarized content.
        const summary = await runAi(prompt);

        // Log the summarized content to the console for debugging or further use.
        console.log("Summarized content:", summary);

        // Update the state with the AI-generated summary.
        setSummarizedContent(summary);
      } catch (error) {
        // If there's an error during the summarization process, log it to the console for debugging.
        console.log("Error summarizing:", error);

        // In case of an error, set a default error message in the summarized content state.
        setSummarizedContent("Error summarizing the content.");
      } finally {
        // Once the summarization process is complete (whether successful or not), set loading to false to hide the spinner.
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#212121",
        color: "#fff",
        padding: 4,
        maxWidth: 900,
        textAlign: "center",
        margin: "auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          marginBottom: 2,
          fontWeight: "bold",
          fontSize: "1.5rem",
          color: "white", // Gradient color effect
          textAlign: "center",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow for a modern look
          padding: "10px",
          borderRadius: "8px",
          background: "#8A12FC",
        }}
      >
        Ask AI Assistant
      </Typography>

      {/* Display answer Content */}
      <Box
        sx={{
          marginTop: 3,
          marginBottom: 3,
          padding: 2,
          backgroundColor: "#333",
          borderRadius: "8px",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.3rem",
            fontWeight: "400",
            fontStyle: "italic",
            lineHeight: "1.6",
            color: "#fff",
            textAlign: "left",
          }}
        >
          {summarizedContent ? (
            <ReactMarkdown>{summarizedContent}</ReactMarkdown>
          ) : (
            "Your answer will appear here"
          )}
        </Typography>
      </Box>

      {/* Text Field for User Input */}
      <Box
        sx={{
          display: "flex", // Use flexbox to align the input and button
          flexDirection: "row", // Horizontal layout (side by side)
          gap: 2, // Add gap between TextField and Button
          marginBottom: 2,
        }}
      >
        {/* Text Field for User Input */}
        <TextField
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          sx={{
            flex: 1, // Make the text field take the available space

            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "yellow",
                color: "white",
              },
              "&:hover fieldset": {
                borderColor: "yellow",
                color: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "yellow",
                color: "white",
              },
            },
          }}
          placeholder="Type your content here..."
        />

        {/* Send Button */}
        <Button
          onClick={handleSummarize}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            color: "yellow",
            border: "2px solid yellow",
            background: "transparent",
            borderRadius: "8px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",

            transition: "all 0.3s ease",
          }}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "yellow" }} />
          ) : (
            <>
              <SendIcon sx={{ marginRight: 1, color: "yellow" }} />{" "}
              {/* Icon on the left of the text */}
              Send
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default AIAssistant;
