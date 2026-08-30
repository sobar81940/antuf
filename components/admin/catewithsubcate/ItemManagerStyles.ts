const styles = {
  searchField: {
    mb: 3,
    input: { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#8A12FC" },
      "&:hover fieldset": { borderColor: "#8A12FC" },
      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
    },
  },
  formControl: {
    "& .MuiInputLabel-root": { color: "#8A12FC" },
    "&:hover .MuiInputLabel-root": { color: "#8A12FC" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#8A12FC" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#8A12FC" },
      "&:hover fieldset": { borderColor: "#8A12FC" },
      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
    },
  },
  selectField: {
    color: "#fff",
    "& .MuiMenuItem-root": {
      "&:hover": { color: "white", bgcolor: "#8A12FC" },
    },
  },
  textField: {
    input: { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#8A12FC" },
      "&:hover fieldset": { borderColor: "#8A12FC" },
      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
    },
  },
  button: {
    backgroundColor: "#8A12FC",
    "&:hover": { backgroundColor: "#8A12FC" },
  },
  listItem: {
    borderColor: "#8A12FC",
    padding: 1,
    "&:hover": { backgroundColor: "#8A12FC" },
    transition: "all 0.3s ease",
  },
};

export default styles;
