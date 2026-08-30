import React, { useState } from "react";
import {
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import ChatIcon from "@mui/icons-material/Chat";

import HelpIcon from "@mui/icons-material/Help";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation"; // Import useRouter
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import {
  drawerStyles,
  listItemStyles,
  listItemIconStyles,
  logoutIconStyles,
  appBarStyles,
  drawerMobileStyles,
  mainContentStyles,
} from "./sidebarStyles";

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    {
      text: "Dashboard",
      icon: <HomeIcon sx={{ fontSize: "32px" }} />,
      link: "/dashboard/user",
    },
    {
      text: "Profile",
      icon: <SwitchAccountIcon sx={{ fontSize: "32px" }} />,
      link: "/dashboard/user/profile",
    },
    {
      text: "Membership Card",
      icon: <BarChartIcon sx={{ fontSize: "32px" }} />,
      link: "/dashboard/user/card",
    },
    {
      text: "Subscriptions",
      icon: <BuildIcon sx={{ fontSize: "32px" }} />,
      link: "/dashboard/user/subscriptions",
    },
     {
      text: "Chat",
      icon: <ChatIcon sx={{ fontSize: "32px" }} />,
      link: "/dashboard/user/chat",
    },
    {
      text: "Pricing",
      icon: <ShoppingCartIcon sx={{ fontSize: "32px" }} />,
      link: "/pricing",
    },
    {
      text: "Order History",
      icon: <ManageHistoryIcon sx={{ fontSize: "32px" }} />,
      link: "/dashboard/user/orders",
    },
    {
      text: "Home",
      icon: <DoorFrontIcon sx={{ fontSize: "32px" }} />,
      link: "/",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {!isSmallScreen && (
        <Drawer
          variant="permanent"
          sx={drawerStyles(isHovered)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  marginBottom: "10px",
                  padding: isHovered ? "10px 20px" : "10px 0",
                  cursor: "pointer",
                  ":hover": {
                    borderLeft: "19px solid blueviolet !important",
                  },
                  transition: "border-bottom 0.3s ease",
                }}
                onClick={() => router.push(item.link)} // Navigate using router.push
              >
                <ListItemIcon
                  sx={{
                    color: "white",
                    minWidth: isHovered ? "50px" : "40px",
                    justifyContent: "center",
                    marginLeft: "20px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isHovered && (
                  <ListItemText
                    primary={item.text}
                    sx={{ marginLeft: "10px", fontSize: "18px" }}
                  />
                )}
              </ListItem>
            ))}

            {/* Logout Item */}
            <ListItem
              sx={{
                marginBottom: "10px",
                padding: isHovered ? "10px 20px" : "10px 0",
                cursor: "pointer",
                ":hover": {
                  borderLeft: "19px solid blueviolet !important",
                },
                transition: "border-bottom 0.3s ease",
              }}
              onClick={() => {
                signOut({ callbackUrl: "/" });
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: isHovered ? "50px" : "40px",
                  justifyContent: "center",
                  marginLeft: "20px",
                }}
              >
                <ExitToAppIcon sx={{ fontSize: "32px", color: "blueviolet" }} />
              </ListItemIcon>
              {isHovered && (
                <ListItemText
                  primary="Logout"
                  sx={{ marginLeft: "10px", fontSize: "18px" }}
                />
              )}
            </ListItem>
          </List>
        </Drawer>
      )}

      {isSmallScreen && (
        <AppBar position="fixed" sx={{ backgroundColor: "#1a1a1a" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <MenuIcon sx={{ fontSize: "32px" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: isSmallScreen ? "block" : "none",
          "& .MuiDrawer-paper": {
            width: 300,
            backgroundColor: "#1a1a1a",
            color: "white",
          },
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                router.push(item.link); // Navigate using router.push
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { sm: "100px", xs: "0" },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isSmallScreen && <Toolbar />}
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
