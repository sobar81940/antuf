import { styled } from "@mui/material/styles";
import type { CSSObject, Theme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";

export const drawerWidth = 290;
export const mobileDrawerWidth = 280;

export const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  boxShadow: "4px 0 20px rgba(102, 126, 234, 0.15)",
  background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
  [theme.breakpoints.down("sm")]: {
    width: mobileDrawerWidth,
  },
});

export const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeIn,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(9)} + 1px)`,
  boxShadow: "4px 0 20px rgba(102, 126, 234, 0.1)",
  background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
  [theme.breakpoints.down("sm")]: {
    width: 0,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
  borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0, 1),
  },
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  [theme.breakpoints.down("sm")]: {
    position: "absolute",
    zIndex: theme.zIndex.drawer + 1,
  },
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const menuItemStyles = (theme: Theme) => ({
  root: {
    color: "#667eea",
    backgroundColor: "#ffffff",
    minHeight: 48,
    justifyContent: "center",
    px: 2.5,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(102, 126, 234, 0.08)",
      transform: "translateX(5px)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(102, 126, 234, 0.15)",
      borderLeft: "4px solid #667eea",
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: 56,
      px: 2,
    },
  },
  icon: {
    minWidth: 0,
    mr: 3,
    justifyContent: "center",
    color: "#667eea",
    transition: "all 0.3s ease",
    [theme.breakpoints.down("sm")]: {
      mr: 3,
    },
  },
  text: {
    color: "#667eea",
    fontWeight: 500,
    fontSize: "0.95rem",
    transition: "opacity 0.3s ease",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.875rem",
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
    backgroundColor: "#ffffff",
    color: "#6b7280",
    "&:hover": {
      backgroundColor: "rgba(102, 126, 234, 0.05)",
      color: "#667eea",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(3),
    },
  },
});

export const logoStyles = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontFamily: "'Pacifico', cursive",
  fontSize: "1.5rem",
  textAlign: "center",
  margin: "12px 0",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
  "@media (max-width:600px)": {
    fontSize: "1.3rem",
    margin: "8px 0",
  },
};

export const dividerStyles = {
  backgroundColor: "rgba(102, 126, 234, 0.1)",
  margin: "8px 0",
  transition: "all 0.3s ease",
};

export const Backdrop = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: theme.zIndex.drawer - 1,
  opacity: open ? 1 : 0,
  visibility: open ? "visible" : "hidden",
  transition: "opacity 0.3s, visibility 0.3s",
}));