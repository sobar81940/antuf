"use client";

import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import TapNav from "@/components/navbar/topnav/topnav"
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useRouter } from "next/navigation";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchIcon from "@mui/icons-material/Search";
import TranslateIcon from "@mui/icons-material/Translate";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Collapse from "@mui/material/Collapse";
import Page from "@/components/loginmodal/Page";
import { useSession } from "next-auth/react";
import Tabs from "@/components/tab/Tab";
// Static fallback items for mobile drawer when API is unavailable
const STATIC_NAV = [
  { label: "गृहपृष्ठ", path: "/", children: [] },
  { label: "हाम्रो बारेमा", path: "/pages/about", children: [
    { label: "परिचय", path: "/pages/about" },
    { label: "इतिहास", path: "/pages/history" },
    { label: "संगठन संरचना", path: "/pages/organization" },
  ]},
  { label: "गतिविधि", path: "/pages/activities", children: [
    { label: "सबै गतिविधि", path: "/pages/activities" },
    { label: "कार्यक्रम", path: "/events" },
  ]},
  { label: "संगठन", path: "/pages/organization", children: [
    { label: "संगठन संरचना", path: "/pages/organization" },
    { label: "सम्बद्ध संगठन", path: "/pages/affiliates" },
  ]},
  { label: "जनप्रतिनिधि", path: "/pages/representatives", children: [] },
  { label: "इतिहास", path: "/pages/history", children: [] },
  { label: "दस्तावेज", path: "/pages/documents", children: [] },
  { label: "डाउनलोड", path: "/downloads", children: [] },
  { label: "सम्पर्क", path: "/pages/contact", children: [] },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [drawerNavItems, setDrawerNavItems] = useState<Record<string, any>[]>(STATIC_NAV);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  // Fetch dynamic nav items for mobile drawer
  useEffect(() => {
    fetch('/api/navmenu')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          // Prepend home manually
          setDrawerNavItems([
            { label: "गृहपृष्ठ", path: "/", children: [] },
            ...json.data,
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <>
      <TapNav />
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          color: "#fff",
          height: 150,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 4, md: 6 }, // Add horizontal padding that increases with screen size
            gap: 2 // Add gap between elements
          }}
        >
          {/* Left Side (Menu Items for larger screens) */}
          <Box
            sx={{
              // display: { xs: "none", md: "flex" },
              flex: 1,
              alignItems: "center",
              gap: 3
            }}
          >

            <Box

              display="flex"
              alignItems="center"


              sx={{
                position: 'relative',
                cursor: "pointer",
                display: { xs: "none", md: "flex" },
                "&:hover": {
                  "& .menu-text": {
                    color: "rgba(255, 255, 255, 0.85)"
                  },
                  "& .arrowIcon": {
                    transform: "rotate(180deg)",
                    color: "rgba(255, 255, 255, 0.85)"
                  }
                }
              }}
            >
              <img
                onClick={() => router.push("/")}
                src="/antuf-final-logo-5.png"
                alt="Logo"
                style={{
                  height: "100px",
                  maxWidth: "100%",
                  width: "auto",
                  cursor: "pointer",
                  objectFit: "contain",

                }}
              />


            </Box>
            <Box
              sx={{
                position: 'relative',
                cursor: "pointer",
                display: { xs: "flex", md: "none" },
              }}

            >
              <img
                onClick={() => router.push("/")}
                src="/mobile.jpg"
                alt="Logo"
                style={{
                  height: "90px",
                  maxWidth: "90%",
                  width: "auto",
                  cursor: "pointer",
                  objectFit: "contain",

                }}
              />
            </Box>

          </Box>

          {/* {centered logo} */}


          {/* {display right side menu item on larger device} */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 2 },
              ml: 10
            }}
          >
            <IconButton
              sx={{
                color: "#00796B",
                display: { xs: "none", md: "flex" },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              sx={{
                color: "00796B",
                display: { xs: "none", md: "flex" },
                '&:hover': {
                  backgroundColor: 'rgba(231, 9, 9, 0.1)'
                }
              }}
            >
              <NotificationsActiveIcon />
            </IconButton>
            <IconButton
              sx={{
                color: "00796B",
                display: { xs: "none", md: "flex" },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <TranslateIcon />
            </IconButton>
            <Box
              sx={{
                display: { xs: "flex", sm: "flex", md: "flex" },
                width: "100%",
                justifyContent: { xs: "flex-start", sm: "space-between", md: "flex-start" },
                alignItems: "center",
                gap: { xs: 2, sm: 4 }
              }}
            >

              {status === "authenticated" ? (
                <img
                  src={session?.user?.image || "https://res.cloudinary.com/dfu758f7t/image/upload/v1761664833/logo_mklloi.jpg"} // Fallback for default avatar
                  alt="User Avatar"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    cursor: "pointer",

                  }}
                  onClick={() =>
                    router.push(
                      session?.user?.role === "admin"
                        ? "/dashboard/admin"
                        : "/dashboard/user"
                    )
                  }
                />
              ) : (
                <Page />
              )}

              {/* Hamburger Icon for Small Devices */}
              <Box
                sx={{
                  justifyContent: "end"
                }}
              >
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  sx={{
                    display: {
                      xs: "block", md: "none",
                      color: "black",
                      padding: 3,
                      alignItems: "center"


                    }
                  }}
                  onClick={toggleDrawer(true)}
                >

                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Toolbar>


        {/* drawer for small device */}

        <Drawer open={drawerOpen} onClose={toggleDrawer(false)} anchor="left">
          <Box
            sx={{
              width: 280,
              backgroundColor: "#9B2C2C",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            role="presentation"
          >
            {/* Header with Logo and Close Button */}
            <Box
              sx={{
                backgroundColor: "#F5F5F5",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "2px solid #9B2C2C",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#9B2C2C",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "2rem" }}>🚩</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#DC143C", fontWeight: 700, fontSize: "0.9rem" }}>
                    अखिल नेपाल ट्रेड युनियन महासंघ
                  </Typography>
                  <Typography sx={{ color: "#DC143C", fontSize: "0.75rem" }}>
                    (ANTUF)
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={toggleDrawer(false)}
                sx={{ color: "#DC143C" }}
              >
                <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>✕</Typography>
              </IconButton>
            </Box>

            {/* Social Icons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                py: 3,
                borderBottom: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <IconButton sx={{ 
                bgcolor: "rgba(0,0,0,0.3)", 
                color: "white",
                '&:hover': { bgcolor: "rgba(0,0,0,0.5)" }
              }}>
                <Typography sx={{ fontSize: "1.2rem" }}>f</Typography>
              </IconButton>
              <IconButton sx={{ 
                bgcolor: "rgba(0,0,0,0.3)", 
                color: "white",
                '&:hover': { bgcolor: "rgba(0,0,0,0.5)" }
              }}>
                <Typography sx={{ fontSize: "1.2rem" }}>📷</Typography>
              </IconButton>
              <IconButton sx={{ 
                bgcolor: "rgba(0,0,0,0.3)", 
                color: "white",
                '&:hover': { bgcolor: "rgba(0,0,0,0.5)" }
              }}>
                <Typography sx={{ fontSize: "1.2rem" }}>▶</Typography>
              </IconButton>
            </Box>

            {/* Dynamic Menu Items */}
            <List sx={{ flex: 1, overflowY: "auto", py: 0 }}>
              {drawerNavItems.map((item, index) => {
                const hasChildren = item.children && item.children.length > 0;
                return (
                  <Box key={item._id || index}>
                    <ListItem
                      component="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) {
                          toggleExpand(index);
                        } else {
                          item.path && router.push(item.path);
                          toggleDrawer(false)(e);
                        }
                      }}
                      sx={{
                        py: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
                      }}
                    >
                      <Typography sx={{ color: "white", fontWeight: 600, fontSize: "1.1rem" }}>
                        {item.label}
                      </Typography>
                      {hasChildren && (
                        <KeyboardArrowDownIcon
                          sx={{
                            color: "white",
                            transform: expandedItems[index] ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s",
                          }}
                        />
                      )}
                    </ListItem>
                    {hasChildren && expandedItems[index] && (
                      <Box sx={{ bgcolor: "rgba(0,0,0,0.2)" }}>
                        {item.children.map((child, ci) => (
                          <ListItem
                            key={ci}
                            component="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              child.path && router.push(child.path);
                              toggleDrawer(false)(e);
                            }}
                            sx={{ pl: 4, py: 1.5, cursor: "pointer", width: "100%" }}
                          >
                            <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>
                              {child.label}
                            </Typography>
                          </ListItem>
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </List>
        </Box>
      </Drawer>

      </AppBar>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Tabs />
      </Box>
    </>
  );
};

export default Navbar;
