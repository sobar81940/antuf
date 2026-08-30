import { backdropClasses } from "@mui/material";
import {
  borderLeft,
  flexGrow,
  flexShrink,
  fontSize,
  justifyContent,
  minWidth,
} from "@mui/system";

export const drawerStyles = (isHovered) => ({
  width: isHovered ? 300 : 100,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: isHovered ? 300 : 100,
    transition: "width 0.3s",
    overflowX: "hidden",
    backgroundColor: "#1a1a1a",
    color: "white",
    paddingTop: "20px",
  },
});

export const listItemStyles = (isHovered) => ({
  marginBottom: "10px",
  padding: isHovered ? "10px 20px" : "10px 0",
  cursor: "pointer",
  ":hover": {
    borderLeft: "19px solid blueviolet !important",
  },
  transition: "border-bottom 0.3s ease",
});

export const listItemIconStyles = (isHovered) => ({
  color: "white",
  minWidth: isHovered ? "50px" : "40px",
  justifyContent: "center",
  marginLeft: "20px",
});

export const listItemTextStyles = {
  marginLeft: "10px",
  fontSize: "18px",
};

export const logoutIconStyles = {
  fontSize: "32px",
  color: "blueviolet",
};

export const appBarStyles = {
  backgroundColor: "#1a1a1a",
};

export const drawerMobileStyles = {
  display: "block",
  "& .MuiDrawer-paper": {
    width: 300,
    backgroundColor: "#1a1a1a",
    color: "white",
  },
};

export const mainContentStyles = {
  flexGrow: 1,
  p: 3,
  marginLeft: { sm: "100px", xs: "0" },
};
