"use client";

import { useState } from "react";
import PropTypes from 'prop-types';

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

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

import { useAppDispatch } from "@/app/hooks";

import { deleteSlider } from "@/slice/sliderSlice";

import {
  tableContainerStyles,
  tableStyles,
  responsiveCellStyles,
  imageCellStyles,
  statusStyles,
  paginationStyles,
  mobileCellStyles,
  actionButtonStyles,
  mobileRowStyles,
  mobileLabelStyles,
} from "./sliderTableStyles";

const SliderTable = ({ sliders = [], onEdit }) => {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [sliderToDelete, setSliderToDelete] = useState(null);

  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (sliderId) => {
    setSliderToDelete(sliderId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteSlider(sliderToDelete));

    setDeleteConfirmOpen(false);
    setSliderToDelete(null);
  };
  
  const paginatedSliders = (sliders || []).slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  if (!sliders || sliders.length === 0) {
    return (
      <Box sx={tableContainerStyles}>
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Box
            sx={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              mx: "auto",
              display: "grid",
              placeItems: "center",
              bgcolor: "#eef2ff",
              mb: 2,
            }}
          >
            <ImageIcon sx={{ fontSize: 36, color: "#667eea" }} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: "#182230", fontSize: 18 }}>
            No sliders found
          </Typography>
          <Typography sx={{ color: "#98a2b3", mt: 0.5 }}>
            Click &quot;Add New Slider&quot; to create your first banner.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isSmallScreen) {
    return (
      <Box sx={tableContainerStyles}>
        {paginatedSliders.map((slider) => (
          <Box key={slider._id} sx={mobileRowStyles}>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Image</Typography>
              <Box sx={{ width: 100, height: 60}}>
                {slider.image ? (
                  <img
                    src={slider.image}
                    alt={slider.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://via.placeholder.com/200x120?text=No+Image'; // Fallback image
                      img.onerror = null; // Prevent infinite loop
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: '#f0f0f0',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                  >
                    No Image
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Title</Typography>
              <Typography>{slider.title}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Created</Typography>
              <Typography>{formatDate(slider.createdAt)}</Typography>
            </Box>
            <Box sx={mobileCellStyles}>
              <Typography sx={mobileLabelStyles}>Status</Typography>
              <Box sx={statusStyles(slider.status)}>
                {slider.status ? "Active" : "Inactive"}
              </Box>
            </Box>
            <Box
              sx={{ ...mobileCellStyles, justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => onEdit(slider._id)}
                sx={actionButtonStyles}
                color="secondary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(slider._id)}
                sx={{ ...actionButtonStyles, color: "error.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(sliders.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this slider? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={tableContainerStyles}>
        <Table sx={tableStyles} aria-label="sliders table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell sx={responsiveCellStyles}>Created At</TableCell>
              {/* <TableCell sx={responsiveCellStyles}>Offer</TableCell> */}
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSliders.map((slider) => (
              <TableRow key={slider._id}>
                <TableCell sx={imageCellStyles}>
                  {slider.image ? (
                    <img
                      src={slider.image}
                      alt={slider.title}
                      style={{
                        width: 80,
                        height: 45,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = 'https://via.placeholder.com/80x45?text=No+Image'; // Fallback image
                        img.onerror = null; // Prevent infinite loop
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 80,
                        height: 45,
                        backgroundColor: '#f0f0f0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      No Image
                    </Box>
                  )}
                </TableCell>
                <TableCell>{slider.title}</TableCell>
                <TableCell sx={responsiveCellStyles}>
                  {formatDate(slider.createdAt)}
                </TableCell>
                {/* <TableCell sx={responsiveCellStyles}>{slider.offer}</TableCell> */}
                <TableCell>
                  <Box sx={statusStyles(slider.status)}>
                    {slider.status ? "Active" : "Inactive"}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                     onClick={() => onEdit(slider?._id)}
                    sx={actionButtonStyles}
                    color="secondary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(slider?._id)}
                    sx={{ ...actionButtonStyles, color: "error.main" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(sliders.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            sx={paginationStyles}
          />
        </Box>
      </TableContainer>





      <Dialog
      open={deleteConfirmOpen}
      onClose={()=>setDeleteConfirmOpen(false)}
      
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this slider? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
          onClick={()=>setDeleteConfirmOpen(false)}
          
          >Cancel</Button>
          <Button color="error" variant="contained"
          onClick={handleConfirmDelete}
          
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>





    </>
  );
};

SliderTable.propTypes = {
  sliders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      offer: PropTypes.string,
      status: PropTypes.bool.isRequired,
    })
  ),
  onEdit: PropTypes.func.isRequired,
};

SliderTable.defaultProps = {
  sliders: [],
};

export default SliderTable;