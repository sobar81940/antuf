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
  Inventory as InventoryIcon,
  Store as StoreIcon,
  CalendarToday as CalendarIcon,
  Article as ArticleIcon,
  Widgets as WidgetsIcon,
  Settings as SettingsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";




import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import ListAltIcon from "@mui/icons-material/ListAlt";



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





import ChatIcon from '@mui/icons-material/Chat';



const menuItems = [
  {
    title: "Main",
    icon: <DashboardIcon />,
    items: ["dashboard", "slider/create", "slider/list" , "profile" ,"password"],
  },
  {
    title: "Categories",
    icon: <ShoppingCartIcon />,
    items: ["category/create", "category/list"],
  },
  {
    title: "Manage Products",
    icon: <InventoryIcon />,
    items: ["product/create", "product/list", "product-review"],
  },

  {
    title: "Manage Coupon",
    icon: <StoreIcon />,
    items: [
      "coupon/create",
      "coupon/list",
      "deliveryAreas/create",
      "deliveryAreas/list",
    ],
  },

  {
    title: "Manage Orders",
    icon: <ListAltIcon />,
    items: ["orders/allorders", "orders/inprocess", "orders/delivered", "orders/pending", "orders/cancelled"   ],
  },


 {
    title: "Manage Messages",
    icon: <ChatIcon/>,
    items: ["message"],
  },


 
 {
    title: "Manage Reservation",
    icon: <CalendarIcon />,
    items: [
      "reservation-times/create",
      "reservation-times/list",
      "reservation",
    ],
  },


  {
    title: "Blog",
    icon: <ArticleIcon />,
    items: ["categories", "all-blog", "comments"],
  },
  {
    title: "Pages",
    icon: <ArticleIcon />,
    items: [
      "custom-page",
      "about",
      "history",
      "gallery",
      "contact",
      "privacy-policy",
      "term-conditons",
    ],
  },
  {
    title: "Sections",
    icon: <WidgetsIcon />,
    items: [
      "why-choose-us",
      "banner-slider",
      "chefs",
      "app-download",
      "testimonials",
      "counter",
     
    ],
  },
  {
    title: "Activities",
    icon: <ArticleIcon />,
    items: [
      "activity/create",
      "activity/list",
    ],
  },
  {
    title: "Others",
    icon: <SettingsIcon />,
    items: [
      "News Latters",
      "Social Links",
      "Footer Info",
      "Menu Builder",
      "Admin Management",
       "logout",
    ],
  },




{
    title: "section",
    icon: <SettingsIcon />,
    items: [
      
       "logout",
    ],
  },

];





export default function ResponsiveDrawer({
  open,
  handleDrawerOpen,
  handleDrawerClose,
}) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedMenus, setExpandedMenus] = React.useState({});
  const [activeItem, setActiveItem] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNavigation = (path) => {
    setActiveItem(path);
    router.push(`/dashboard/admin/${path}`);
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
      open ? handleDrawerClose() : handleDrawerOpen();
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
            background:
              "linear-gradient(195deg,rgb(240, 240, 240),rgb(248, 248, 248))",
            boxShadow: "4px 0 20px rgb(240, 240, 240)",
          },
        }}
        swipeAreaWidth={20}
        disableSwipeToOpen={false}
      >
        <DrawerContent
          open={mobileOpen}
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
          backgroundColor: "rgb(209, 22, 22)",
          color: "white",
          "&:hover": {
            backgroundColor: "rgba(248, 248, 248, 0.9)",
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
            sx={{ color: "red" }}
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
      <Divider sx={dividerStyles} />









      <Box
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          height: "calc(100vh - 64px)",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
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
                        color: "red",
                      }}
                    >
                      <ListItemIcon sx={styles.icon}>
                        {React.cloneElement(menuItem.icon, {
                          sx: { color: "red" },
                        })}
                      </ListItemIcon>
                      <ListItemText
                        primary={menuItem.title}
                        sx={{
                          ...styles.text,
                          opacity: open ? 1 : 0,
                          color: "red",
                        }}
                      />
                      {open &&
                        (expandedMenus[menuItem.title] ? (
                          <ExpandLessIcon sx={{ color: "#ffffff" }} />
                        ) : (
                          <ExpandMoreIcon sx={{ color: "#ffffff" }} />
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
                        <ListItem key={item} disablePadding>
                          <ListItemButton
                            onClick={() => handleNavigation(item)}
                            sx={{
                              ...styles.root,
                              ...styles.nested,
                              ...(activeItem === item && {
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                borderLeft: "4px solid #3f51b5",
                              }),
                            }}
                          >
                            <ListItemText
                              primary={item}
                              sx={{
                                ...styles.text,
                                opacity: open ? 1 : 0,
                                color: "red",
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
                  <ListItem key={item} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(item)}
                      sx={{
                        ...styles.root,
                        ...(activeItem === item && {
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          borderLeft: "4px solid #3f51b5",
                        }),
                      }}
                    >
                      <ListItemIcon sx={styles.icon}>
                        {React.cloneElement(menuItem.icon, {
                          sx: { color: "#ffffff" },
                        })}
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        sx={{
                          ...styles.text,
                          opacity: open ? 1 : 0,
                          color: "#ffffff",
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



    </>
  );
}