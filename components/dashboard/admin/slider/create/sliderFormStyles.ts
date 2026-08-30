// components/sliderFormStyles.js
export const formContainerStyles = {
  maxWidth: 800,
  width: "100%",
  mx: "auto",
  p: { xs: 2, sm: 3 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  "@media (max-width: 600px)": {
    p: 2,
    borderRadius: 0,
    boxShadow: "none",
  },
};

export const titleStyles = {
  mb: 3,
  color: "black",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: { xs: "1.5rem", sm: "2rem" },
};

export const textFieldStyles = {
  mb: 3,
  width: "100%",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#8A12FC",
    },
    "&:hover fieldset": {
      borderColor: "#8A12FC",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },
};

export const alertStyles = {
  mb: 3,
  width: "100%",
  fontSize: { xs: "0.75rem", sm: "0.875rem" },
};

export const submitButtonStyles = {
  py: { xs: 1, sm: 1.5 },
  px: 4,
  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
  fontWeight: "bold",
  backgroundColor: "#ff0000",
  width: { xs: "100%", sm: "auto" },
  minWidth: 120,
  "&:hover": {
    backgroundColor: "#cc0000",
  },
  "& .MuiButton-startIcon": {
    marginRight: { xs: 0.5, sm: 1 },
  },
};

export const switchStyles = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#ff0000",
    "&:hover": {
      backgroundColor: "rgba(255, 0, 0, 0.08)",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#ff0000",
  },
  mb: 3,
};

export const imagePreviewStyles = {
  width: "100%",
  maxWidth: 600,
  height: 0,
  paddingBottom: "56.25%", // 16:9 aspect ratio
  position: "relative",
  border: "2px dashed red",
  borderRadius: 1,
  overflow: "hidden",
  margin: "0 auto",
  "& img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  "@media (max-width: 600px)": {
    paddingBottom: "75%", // 4:3 aspect ratio for mobile
    borderWidth: 1,
  },
};

export const uploadPlaceholderStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  "& svg": {
    fontSize: { xs: "2rem", sm: "3rem" },
    color: "#8A12FC",
  },
};

export const formInnerStyles = {
  width: "100%",
  maxWidth: 600,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  "@media (max-width: 600px)": {
    gap: 1.5,
  },
};

export const aiButtonStyles = {
  position: "absolute",
  right: 8,
  top: "50%",
  transform: "translateY(-50%)",
  padding: { xs: 0.5, sm: 1 },
  "& svg": {
    fontSize: { xs: "1rem", sm: "1.25rem" },
  },
};