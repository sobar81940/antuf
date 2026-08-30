"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";

import EmailIcon from "@mui/icons-material/Email";

import { styles } from "./navbarStyles";

export default function Navbar() {
  return (
    <Box component="nav" sx={styles.navbarContainer}>
      <Box sx={styles.contentWrapper}
      >
       
        <Box sx={styles.contactInfo}>
          <Box sx={styles.contactItem}>
   
            <IconButton size="small" sx={styles.iconButton}>
              <PhoneInTalkIcon />
            </IconButton>
            <Typography variant="body2" sx={styles.contactText}>
              ++977-01-4602758
            </Typography>
          </Box>

          <Box sx={styles.contactItem}>
            <IconButton size="small" sx={styles.iconButton}>
              <EmailIcon />
            </IconButton>
            <Typography variant="body2" sx={styles.contactText}>
              info@antuf.org
            </Typography>
          </Box>
        </Box>

 
        <Box sx={styles.socialIcons}>
          <IconButton sx={styles.iconButton} aria-label="Facebook">
            <FacebookIcon />
          </IconButton>
          <IconButton sx={styles.iconButton} aria-label="Instagram">
            <InstagramIcon />
          </IconButton>
          <IconButton sx={styles.iconButton} aria-label="Twitter">
            <TwitterIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}