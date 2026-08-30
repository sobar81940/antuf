"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAppDispatch } from "@/app/hooks";
import { deleteActivity } from "@/slice/activitySlice";

const ActivityTable = ({ activities = [], onEdit }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (activityId) => {
    setActivityToDelete(activityId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteActivity(activityToDelete));
    setDeleteConfirmOpen(false);
    setActivityToDelete(null);
  };

  const paginatedActivities = (activities || []).slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isSmallScreen) {
    return (
      <Box sx={{ p: 2 }}>
        {paginatedActivities.map((activity) => (
          <Paper key={activity._id} sx={{ p: 2, mb: 2 }}>
            {activity.image && (
              <Box
                component="img"
                src={activity.image}
                alt={activity.title}
                sx={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 1,
                  mb: 2,
                }}
              />
            )}
            <Typography variant="h6">{activity.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {activity.category}
            </Typography>
            <Typography variant="caption">{activity.date}</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <IconButton
                size="small"
                onClick={() => onEdit(activity._id)}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(activity._id)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(activities.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedActivities.map((activity) => (
              <TableRow key={activity._id}>
                <TableCell>
                  {activity.image ? (
                    <Box
                      component="img"
                      src={activity.image}
                      alt={activity.title}
                      sx={{
                        width: 80,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                      }}
                    >
                      No Image
                    </Box>
                  )}
                </TableCell>
                <TableCell>{activity.title}</TableCell>
                <TableCell>{activity.category}</TableCell>
                <TableCell>{activity.date}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor:
                        activity.status === "ongoing"
                          ? "#e3f2fd"
                          : activity.status === "completed"
                          ? "#f1f8e9"
                          : activity.status === "upcoming"
                          ? "#fff3e0"
                          : "#f3e5f5",
                      color:
                        activity.status === "ongoing"
                          ? "#1976d2"
                          : activity.status === "completed"
                          ? "#558b2f"
                          : activity.status === "upcoming"
                          ? "#e65100"
                          : "#6a1b9a",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {activity.status}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(activity._id)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(activity._id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Pagination
          count={Math.ceil(activities.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this activity? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActivityTable;
