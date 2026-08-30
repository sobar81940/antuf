const loginModalStyles = {
  modalBox: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 600,
    margin: "auto",
    marginTop: "4%",
    padding: 4,
    borderRadius: 2,
    boxShadow: 3,
    mb: 2,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    mb: 2,
  },
  title: {
    color: "#000",
  },
  tabs: {
    borderTop: "2px solid green",
    "& .MuiTabs-indicator": { backgroundColor: "#00A651" },
    "& .MuiTab-root": {
      textTransform: "none",
      color: "#000",
    },
    "& .Mui-selected": { color: "#00A651 !important" },
  },
  button: {
    backgroundColor: "#00A651",
    color: "#fff",
    ":hover": { backgroundColor: "#007a3e" },
  },
  socialButton: {
    textTransform: "none",
    color: "#fff",
    marginRight: "8px",
  },
  divider: {
    my: 2,
  },
  termsText: {
    mt: 2,
    fontSize: "1.1rem",
    color: "black",
    backgroundColor: "transparent",
  },
};

export default loginModalStyles;
