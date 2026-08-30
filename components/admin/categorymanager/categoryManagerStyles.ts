const categoryManagerStyles = {
  // Main container
  mainContainer: {
    p: { xs: 2, sm: 3, md: 4 },
    background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.9) 100%)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    border: "1px solid rgba(102, 126, 234, 0.2)",
    mx: "auto",
    my: 2,
    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
    },
    maxWidth: "1000px",
    width: "100%",
  },

  // Header section
  headerSection: {
    mb: 4,
    pb: 3,
    borderBottom: "2px solid rgba(102, 126, 234, 0.1)",
  },

  title: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
    mb: 1,
  },

  subtitle: {
    color: "#6b7280",
    fontWeight: 500,
    fontSize: "0.95rem",
  },

  // Search section
  searchSection: {
    mb: 3,
  },

  searchField: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      transition: "all 0.3s ease",
      "& fieldset": {
        borderColor: "rgba(102, 126, 234, 0.3)",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: "#667eea",
        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#667eea",
        borderWidth: "2px",
        boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.15)",
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "#1f2937",
      fontSize: "1rem",
      padding: "14px 16px",
    },
    "& .MuiOutlinedInput-input::placeholder": {
      color: "#9ca3af",
      opacity: 0.7,
    },
  },

  // Input section
  inputSection: {
    mb: 4,
    p: 3,
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.05) 100%)",
    borderRadius: "16px",
    border: "1px solid rgba(102, 126, 234, 0.15)",
    transition: "all 0.3s ease",
  },

  inputWrapper: {
    display: "flex",
    gap: 2,
    flexDirection: { xs: "column", sm: "row" },
    alignItems: "flex-end",
  },

  categoryField: {
    flex: 1,
    minWidth: { xs: "100%", sm: "250px" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      transition: "all 0.3s ease",
      "& fieldset": {
        borderColor: "rgba(102, 126, 234, 0.3)",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: "#667eea",
        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#667eea",
        borderWidth: "2px",
        boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.15)",
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "#1f2937",
      fontSize: "1rem",
      padding: "14px 16px",
    },
    "& .MuiInputLabel-root": {
      color: "#667eea",
      fontWeight: 600,
    },
  },

  saveButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    fontWeight: 600,
    padding: { xs: "12px 20px", sm: "12px 32px" },
    borderRadius: "10px",
    border: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    whiteSpace: "nowrap",
    minWidth: { xs: "100%", sm: "auto" },
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.6)",
    },
    "&:active": {
      transform: "translateY(0px)",
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },

  cancelButton: {
    color: "#ef4444",
    borderColor: "#ef4444",
    border: "2px solid #ef4444",
    fontWeight: 600,
    padding: "10px 24px",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
    minWidth: { xs: "100%", sm: "auto" },
    "&:hover": {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
    },
  },

  // List section
  listSection: {
    mt: 4,
  },

  listTitle: {
    color: "#1f2937",
    fontWeight: 700,
    fontSize: "1.1rem",
    mb: 2,
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  list: {
    p: 0,
    gap: 2,
    display: "flex",
    flexDirection: "column",
  },

  listItemStyle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    p: 2,
    backgroundColor: "#ffffff",
    border: "1.5px solid rgba(102, 126, 234, 0.15)",
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.08)",
    "&:hover": {
      borderColor: "#667eea",
      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.15)",
      transform: "translateY(-2px)",
    },
    flexWrap: "wrap",
    gap: 2,
  },

  listItemContent: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    flex: 1,
    minWidth: 0,
  },

  checkIcon: {
    color: "#10b981",
    fontSize: "1.5rem",
    flexShrink: 0,
  },

  listItemText: {
    "& .MuiListItemText-primary": {
      color: "#1f2937",
      fontWeight: 600,
      fontSize: "1rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },

  actionButtons: {
    display: "flex",
    gap: 1,
    flexShrink: 0,
  },

  editButton: {
    color: "#10b981",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      transform: "scale(1.1)",
    },
  },

  deleteButton: {
    color: "#ef4444",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      transform: "scale(1.1)",
    },
  },

  deleteConfirmBox: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    p: 2,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    width: "100%",
  },

  loadingContainer: {
    p: 4,
    textAlign: "center",
    backgroundColor: "rgba(102, 126, 234, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(102, 126, 234, 0.1)",
  },

  emptyAlert: {
    borderRadius: "12px",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
};

export default categoryManagerStyles;
