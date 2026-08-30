"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  SnackbarContent,
  Tooltip,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import RedditIcon from "@mui/icons-material/Reddit";
import CheckIcon from "@mui/icons-material/Check";

import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  RedditShareButton,
} from "react-share";

const SocialShareModal = () => {
  const [open, setOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href || "");
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => setSnackbarOpen(true))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const socialIcons = [
    { icon: <LinkIcon />, label: "Copy link", onClick: handleCopyLink },
    { component: EmailShareButton, icon: <EmailIcon />, label: "Email" },
    {
      component: FacebookShareButton,
      icon: <FacebookIcon />,
      label: "Facebook",
    },
    { component: TwitterShareButton, icon: <TwitterIcon />, label: "X" },
    {
      component: TelegramShareButton,
      icon: <TelegramIcon />,
      label: "Telegram",
    },
    {
      component: LinkedinShareButton,
      icon: <LinkedInIcon />,
      label: "LinkedIn",
    },
    {
      component: WhatsappShareButton,
      icon: <WhatsAppIcon />,
      label: "WhatsApp",
    },
    { component: RedditShareButton, icon: <RedditIcon />, label: "Reddit" },
  ];

  return (
    <Box>
      <Tooltip title="Share Post" arrow>
        <IconButton
          size="small"
          sx={{ color: "#fff", "&:hover": { color: "#f0c14b" } }}
          onClick={handleOpen}
          aria-label="Open social share options"
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#212121",
            color: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" component="h2">
            Share options
          </Typography>
          <List>
            {socialIcons.map((social, index) => {
              if (social.label === "Copy link") {
                return (
                  <ListItem key={index} onClick={social.onClick}>
                    <ListItemIcon
                      sx={{ color: "#fff", "&:hover": { color: "#f0c14b" } }}
                    >
                      {social.icon}
                    </ListItemIcon>
                    <ListItemText primary={social.label} />
                  </ListItem>
                );
              } else {
                const ShareButtonComponent = social.component;
                return (
                  <ListItem key={index}>
                    <ListItemIcon
                      sx={{ color: "#fff", "&:hover": { color: "green" } }}
                    >
                      {/* Render a div instead of a button */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <ShareButtonComponent
                          url={currentUrl}
                          style={{
                            display: "inline-block",
                            cursor: "pointer",
                          }}
                        >
                          {social.icon}
                        </ShareButtonComponent>
                      </div>
                    </ListItemIcon>
                    <ListItemText primary={social.label} />
                  </ListItem>
                );
              }
            })}
          </List>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        action={
          <IconButton onClick={handleSnackbarClose} color="inherit">
            <CheckIcon />
          </IconButton>
        }
      >
        <SnackbarContent
          sx={{ bgcolor: "success.main", color: "white" }}
          message="Link copied to clipboard!"
        />
      </Snackbar>
    </Box>
  );
};

export default SocialShareModal;
