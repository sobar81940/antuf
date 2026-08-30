import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";

const EngagingCourseCard = () => {
  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{
          padding: { xs: 2, sm: 4 },
          alignItems: "center",
        }}
      >
        {/* Left Section (Image) */}
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
          size={{
            xs: 12,
            sm: 4
          }}>
          <img
            src="/images/pic8.jpeg" // Replace with your image URL
            alt="Create an Engaging Course"
            style={{
              maxWidth: "200px",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Grid>

        {/* Right Section (Text Content) */}
        <Grid
          sx={{
            textAlign: { xs: "center", sm: "left" },
          }}
          size={{
            xs: 12,
            sm: 8
          }}>
          {/* Title */}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "#fff",
              marginBottom: "12px",
            }}
          >
            Create Engaging Course and Content
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: "#fff",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          >
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus id quod maxime placeat
            facere possimus, omnis voluptas assumenda est, omnis dolor
            repellendus. Temporibus autem quibusdam et aut officiis debitis aut
            rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint
            et molestiae non recusandae. Itaque earum rerum hic tenetur a
            sapiente delectus, ut aut reiciendis voluptatibus maiores alias
            consequatur aut perferendis doloribus asperiores repellat.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EngagingCourseCard;
