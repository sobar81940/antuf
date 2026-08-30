"use client";

import * as React from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  useMediaQuery,
  SwipeableDrawer,
} from "@mui/material";

import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  Home as HomeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import ChatIcon from '@mui/icons-material/Chat';
import PostAddSharpIcon from '@mui/icons-material/PostAddSharp';
import BarChartIcon from '@mui/icons-material/BarChart';
import YouTubeIcon from '@mui/icons-material/YouTube';
import BuildIcon from '@mui/icons-material/Build';
import CategoryIcon from '@mui/icons-material/Category';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';

import {
  Drawer,
  DrawerHeader,
  menuItemStyles,
  logoStyles,
  dividerStyles,
  Backdrop,
  drawerWidth,
  mobileDrawerWidth,
} from "./DrawerStyles";


const menuItems = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    items: [
      { label: "Home", path: "home", icon: <HomeIcon />, external: true },
      { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
      { label: "Profile", path: "profile", icon: <PersonIcon /> },
    ],
  },
  {
    title: "Content & Pages",
    icon: <PostAddSharpIcon />,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    items: [
      { label: "Articles", path: "create/post" },
      { label: "Video Content", path: "create/video" },
      { label: "Slider Management", path: "slider/list" },
      { label: "Nav Menu Manager", path: "navmenu" },
      { label: "Donation Page", path: "donation" },
      { label: "Donation Receipts", path: "donation/transactions" },
      { label: "History Page", path: "history" },
      { label: "Image Gallery", path: "gallery" },
      { label: "Documents & Media", path: "documents" },
    ],
  },
  {
    title: "Organization",
    icon: <PeopleIcon />,
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    items: [
      { label: "पेशागत सङ्घ / Organization Chart", path: "organization" },
      { label: "महिला समिति / Women's Committee", path: "organization/women" },
      { label: "युवा समिति / Youth Committee", path: "organization/youth" },
      { label: "जनप्रतिनिधि / Representatives", path: "representatives" },
      { label: "सम्बद्ध संगठन / Affiliates", path: "affiliates" },
      { label: "User Management", path: "alluser" },
      { label: "All Members", path: "member" },
      { label: "Events Calendar", path: "events" },
    ],
  },
  {
    title: "Categories",
    icon: <CategoryIcon />,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    items: [
      { label: "Categories", path: "create/category" },
      { label: "Subcategories", path: "create/subcategory" },
      { label: "Category with Subcategory", path: "create/catewithsubcate" },
    ],
  },
  {
    title: "Communication",
    icon: <ChatIcon />,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    items: [
      { label: "Chat", path: "create/chat" },
      { label: "Contact Messages", path: "message" },
    ],
  },
  {
    title: "Orders",
    icon: <ShoppingCartIcon />,
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    items: [
      { label: "Card Orders", path: "orders" },
    ],
  },
  {
    title: "Activities",
    icon: <ArticleIcon />,
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    items: [
      { label: "Create Activity", path: "activity/create" },
      { label: "Manage Activities", path: "activity/list" },
    ],
  },
];

export default function Sidebar() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(true);
  const [expandedMenus, setExpandedMenus] = React.useState({});
  const [activeItem, setActiveItem] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNavigation = (path, external = false) => {
    setActiveItem(path);
    if (external) {
      window.open("/", "_blank");
    } else {
      router.push(`/dashboard/admin/${path}`);
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const toggleMenu = (title) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setMobileOpen(false);
    } else {
      setOpen(false);
    }
  };

  const styles = menuItemStyles(theme);

  const renderMobileDrawer = (
    <>
      <Backdrop open={mobileOpen} onClick={handleDrawerToggle} />
      <SwipeableDrawer
        variant="temporary"
        open={mobileOpen}
        onOpen={handleDrawerToggle}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: mobileDrawerWidth,
            background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.08)",
          },
        }}
        swipeAreaWidth={20}
        disableSwipeToOpen={false}
      >
        <DrawerContent
          open={true}
          handleDrawerClose={handleDrawerToggle}
          isMobile={true}
          styles={styles}
          handleNavigation={handleNavigation}
          activeItem={activeItem}
          expandedMenus={expandedMenus}
          toggleMenu={toggleMenu}
        />
      </SwipeableDrawer>
    </>
  );

  const renderDesktopDrawer = (
    <Drawer variant="permanent" open={open}>
      <DrawerContent
        open={open}
        handleDrawerClose={handleDrawerClose}
        isMobile={false}
        styles={styles}
        handleNavigation={handleNavigation}
        activeItem={activeItem}
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
      />
    </Drawer>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: "fixed",
          left: 16,
          top: 16,
          zIndex: theme.zIndex.drawer + 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
          },
          display: { xs: "block", sm: open ? "none" : "block" },
        }}
      >
        <MenuIcon />
      </IconButton>
      {isMobile ? renderMobileDrawer : renderDesktopDrawer}
    </>
  );
}

function DrawerContent({
  open,
  handleDrawerClose,
  isMobile,
  styles,
  handleNavigation,
  activeItem,
  expandedMenus,
  toggleMenu,
}) {
  const theme = useTheme();

  return (
    <>
      <DrawerHeader>
        {open && <Typography sx={logoStyles}>ANTUF</Typography>}
        {(!isMobile || open) && (
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              color: "#667eea",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#764ba2",
                transform: "scale(1.1)",
              }
            }}
            size={isMobile ? "medium" : "small"}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        )}
      </DrawerHeader>
      <Divider sx={{
        ...dividerStyles,
        background: "linear-gradient(90deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
        height: "2px",
      }} />

      <Box
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          height: "calc(100vh - 64px)",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(102, 126, 234, 0.2)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(102, 126, 234, 0.3)",
          },
        }}
      >
        {menuItems.map((menuItem, index) => (
          <React.Fragment key={menuItem.title}>
            <List disablePadding>
              {menuItem.items.length > 1 ? (
                <>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      onClick={() => toggleMenu(menuItem.title)}
                      sx={{
                        ...styles.root,
                        color: "#667eea",
                        backgroundColor: expandedMenus[menuItem.title]
                          ? "rgba(102, 126, 234, 0.08)"
                          : "#ffffff",
                        borderLeft: expandedMenus[menuItem.title]
                          ? "4px solid #667eea"
                          : "none",
                        "&:hover": {
                          backgroundColor: "rgba(102, 126, 234, 0.05)",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ ...styles.icon, color: "#667eea" }}>
                        {React.cloneElement(menuItem.icon, {
                          sx: { color: "#667eea" },
                        })}
                      </ListItemIcon>
                      <ListItemText
                        primary={menuItem.title}
                        sx={{
                          ...styles.text,
                          opacity: open ? 1 : 0,
                          color: "#667eea",
                          fontWeight: 600,
                        }}
                      />
                      {open &&
                        (expandedMenus[menuItem.title] ? (
                          <ExpandLessIcon sx={{ color: "#667eea" }} />
                        ) : (
                          <ExpandMoreIcon sx={{ color: "#667eea" }} />
                        ))}
                    </ListItemButton>
                  </ListItem>
                  <Collapse
                    in={expandedMenus[menuItem.title] && open}
                    timeout="auto"
                    unmountOnExit
                    sx={{ overflow: "hidden" }}
                  >
                    <List disablePadding>
                      {menuItem.items.map((item) => (
                        <ListItem key={item.path} disablePadding>
                          <ListItemButton
                            onClick={() => handleNavigation(item.path, item.external)}
                            sx={{
                              ...styles.root,
                              ...styles.nested,
                              backgroundColor: activeItem === item.path
                                ? "rgba(102, 126, 234, 0.1)"
                                : "#ffffff",
                              color: activeItem === item.path
                                ? "#667eea"
                                : "#6b7280",
                              ...(activeItem === item.path && {
                                backgroundColor: "rgba(102, 126, 234, 0.1)",
                                borderLeft: "4px solid #667eea",
                              }),
                            }}
                          >
                            <ListItemText
                              primary={item.label}
                              sx={{
                                ...styles.text,
                                opacity: open ? 1 : 0,
                                color: activeItem === item.path
                                  ? "#667eea"
                                  : "#6b7280",
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
menuItem.items.map((item) => (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path, item.external)}
                      sx={{
                        ...styles.root,
                        backgroundColor: activeItem === item.path
                          ? "rgba(102, 126, 234, 0.1)"
                          : "#ffffff",
                        color: activeItem === item.path
                          ? "#667eea"
                          : "#6b7280",
                        ...(activeItem === item.path && {
                          backgroundColor: "rgba(102, 126, 234, 0.1)",
                          borderLeft: "4px solid #667eea",
                        }),
                      }}
                    >
                      <ListItemIcon sx={{
                        ...styles.icon,
                        color: activeItem === item.path
                          ? "#667eea"
                          : "#6b7280",
                      }}>
                        {React.cloneElement(menuItem.icon, {
                          sx: {
                            color: activeItem === item.path
                              ? "#667eea"
                              : "#6b7280",
                          },
                        })}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        sx={{
                          ...styles.text,
                          opacity: open ? 1 : 0,
                          color: activeItem === item.path
                            ? "#667eea"
                            : "#6b7280",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
            {index < menuItems.length - 1 && <Divider sx={dividerStyles} />}
          </React.Fragment>
        ))}
      </Box>

      {/* Logout Section */}
      <Divider sx={dividerStyles} />
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={() => signOut({ callbackUrl: "/" })}
          sx={{
            ...styles.root,
            backgroundColor: "#ffffff",
            color: "#ef4444",
            justifyContent: open ? "flex-start" : "center",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              transform: "translateX(4px)",
              color: "#dc2626",
            },
          }}
        >
          <ListItemIcon sx={{
            ...styles.icon,
            color: "#ef4444",
            minWidth: open ? "40px" : "auto",
          }}>
            <ExitToAppIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Logout"
              sx={{
                ...styles.text,
                color: "#ef4444",
                fontWeight: 600,
                opacity: 1,
              }}
            />
          )}
        </ListItemButton>
      </Box>
    </>
  );
}