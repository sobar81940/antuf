"use client";
import { useState } from "react";
import { Box, IconButton, useMediaQuery, Fab, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import GroupsIcon from "@mui/icons-material/Groups";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import QrCodeIcon from "@mui/icons-material/QrCode";
import {
  Favorite as FavoriteIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
const MobileBottomNav = () => {
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  if (!isSmallScreen) {
    return null; // Don't render on desktop
  }

  const navItems = [
    {
      label: "हाम्रो बारेमा",
      path: "/about",
      icon: GroupsIcon,
    },
    {
      label: "दस्तावेज",
      path: "/pages/documents",
      icon: DescriptionIcon,
    },
    {
      label: "नेतृत्व",
      path: "/pages/representatives",
      icon: PersonIcon,
    },
    {
      label: "दान",
      path: "/pages/donation",
      icon: FavoriteIcon,
    },
  ];

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        bottom: 0,
        left: "0px",
        right: "0px",
        backgroundColor: "red",
        borderLeft: "1px solid #444",
        borderRight: "1px solid #444",
        borderRadius: "8px 8px 0 0",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: "70px",
        margin: 0,
        padding: 0,
        paddingBottom: "max(env(safe-area-inset-bottom), 0px)", // Safe area for mobile notches
      }}
    >
      {navItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              height: "100%",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={() => router.push(item.path)}
          >
            <IconButton
              sx={{
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                padding: 0,
                "&:hover": {
                  color: "#7CFC00",
                },
              }}
            >
              <IconComponent sx={{ fontSize: "24px" }} />
            </IconButton>
            <Box
              sx={{
                fontSize: "12px",
                color: "white",
                textAlign: "center",
                maxWidth: "70px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </Box>
          </Box>
        );
      })}
      
      {/* Floating QR Code Scanner Button */}
      <Tooltip title="QR Code Scanner">
        <Fab
          onClick={() => router.push("/qr-scanner")}
          sx={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "green",
            color: "white",
            zIndex: 1001,
            "&:hover": {
              backgroundColor: "#7CFC00",
              color: "#212121",
            },
            boxShadow: "0 4px 12px rgba(0, 128, 0, 0.4)",
          }}
        >
          <QrCodeIcon sx={{ fontSize: "28px" }} />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default MobileBottomNav;
