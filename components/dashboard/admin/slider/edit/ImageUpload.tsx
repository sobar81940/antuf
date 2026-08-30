// components/dashboard/admin/slider/ImageUpload.jsx
'use client';

import React from 'react';
import { Box, IconButton } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import { imagePreviewStyles, uploadPlaceholderStyles } from './sliderFormStyles';

const ImageUpload = ({ imagePreview, onChange }) => {
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file); // Pass the File object directly
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="slider-image-upload"
        type="file"
        onChange={handleImageChange}
      />
      <label
      
      htmlFor="slider-image-upload"
      
      
      >
        <IconButton component="span" sx={{ p: 0, width: "100%" }}>
          <Box sx={imagePreviewStyles}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" />
            ) : (
              <Box sx={uploadPlaceholderStyles}>
                <AddPhotoAlternate sx={{ fontSize: 80, color: "red" }} />
              </Box>
            )}
          </Box>
        </IconButton>
      </label>
    </Box>
  );
};

export default ImageUpload;