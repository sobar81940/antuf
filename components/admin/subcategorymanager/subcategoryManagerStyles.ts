import { InputLabel } from "@mui/material";

const { BorderColor } = require("@mui/icons-material");

const subcategoryManagerStyles = {
  container: {
    p: 3,
    maxWidth: "900px",
    mx: "auto",
  },
  searchField: {
    input: { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#8A12FC" },
      "&:hover fieldset": { borderColor: "#8A12FC" },
      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
    },
  },
  categoryField: {
    input: { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#8A12FC" },
      "&:hover fieldset": { borderColor: "#8A12FC" },
      "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
    },
  },
  listItem: {
    borderColor: "#8A12FC",
    "&:hover": {
      backgroundColor: "#8A12FC",
    },
  },
  searchIcon: { color: "#8A12FC" },
  inputLabel: { color: "#8A12FC" },
  editIcon: { color: "green" },
};

export default subcategoryManagerStyles;
