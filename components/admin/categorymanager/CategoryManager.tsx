"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import { Delete, Edit, Search, Add, CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";

import categoryManagerStyles from "./categoryManagerStyles";
import {
  addCategory,
  updateCategory,
  fetchCategories,
  deleteCategory,
} from "@/slice/categorySlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

const CategoryManager = () => {
  const [newCategory, setNewCategory] = useState("");
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState({ id: null, name: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const { list: categories, loading } = useAppSelector(
    (state) => state.categories || { list: [], loading: false }
  );

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(categories)) {
      if (searchTerm === "") {
        setFilteredCategories(categories);
      } else {
        const filtered = categories.filter((cat) =>
          cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
      }
    }
  }, [categories, searchTerm]);

  const handleSaveCategory = () => {
    if (!newCategory.trim() && !editing.name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      if (editing.id) {
        dispatch(updateCategory({ id: editing.id, name: editing.name }));
        toast.success("Category updated successfully!");
      } else {
        dispatch(addCategory(newCategory));
        toast.success("Category added successfully!");
      }
      setEditing({ id: null, name: "" });
      setNewCategory("");
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleDeleteCategory = (id) => {
    try {
      dispatch(deleteCategory(id));
      setDeleteConfirm(null);
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Box sx={categoryManagerStyles.mainContainer}>
      {/* Header Section */}
      <Box sx={categoryManagerStyles.headerSection}>
        <Box>
          <Typography variant="h4" sx={categoryManagerStyles.title}>
            📁 Category Management
          </Typography>
          <Typography variant="body2" sx={categoryManagerStyles.subtitle}>
            Create, edit, and manage all your content categories
          </Typography>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={categoryManagerStyles.searchSection}>
        <TextField
          placeholder="Search categories..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#667eea", marginRight: "8px" }} />
              </InputAdornment>
            ),
          }}
          sx={categoryManagerStyles.searchField}
        />
      </Box>

      {/* Add/Edit Category Section */}
      <Box sx={categoryManagerStyles.inputSection}>
        <Box sx={categoryManagerStyles.inputWrapper}>
          <TextField
            label={editing.id ? "✏️ Edit Category" : "➕ Add New Category"}
            variant="outlined"
            fullWidth
            value={editing.id ? editing.name : newCategory}
            onChange={(e) =>
              editing.id
                ? setEditing({ ...editing, name: e.target.value })
                : setNewCategory(e.target.value)
            }
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSaveCategory();
              }
            }}
            InputLabelProps={{ style: { color: "#667eea", fontWeight: 600 } }}
            sx={categoryManagerStyles.categoryField}
          />

          <Button
            variant="contained"
            onClick={handleSaveCategory}
            disabled={!newCategory.trim() && !editing.name.trim()}
            sx={categoryManagerStyles.saveButton}
          >
            {editing.id ? "Update" : "Add"}
          </Button>

          {editing.id && (
            <Button
              variant="outlined"
              onClick={() => {
                setEditing({ id: null, name: "" });
                setNewCategory("");
              }}
              sx={categoryManagerStyles.cancelButton}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>

      {/* Categories List */}
      <Box sx={categoryManagerStyles.listSection}>
        <Typography variant="h6" sx={categoryManagerStyles.listTitle}>
          {filteredCategories.length} {filteredCategories.length === 1 ? "Category" : "Categories"}
        </Typography>

        {loading ? (
          <Box sx={categoryManagerStyles.loadingContainer}>
            <Typography sx={{ color: "#667eea" }}>Loading categories...</Typography>
          </Box>
        ) : filteredCategories.length === 0 ? (
          <Alert severity="info" sx={categoryManagerStyles.emptyAlert}>
            No categories found. Create your first category to get started!
          </Alert>
        ) : (
          <List sx={categoryManagerStyles.list}>
            {filteredCategories?.map((category) => (
              <ListItem
                key={category?._id}
                sx={categoryManagerStyles.listItemStyle}
              >
                <Box sx={categoryManagerStyles.listItemContent}>
                  <CheckCircle sx={categoryManagerStyles.checkIcon} />
                  <ListItemText
                    primary={category?.name}
                    sx={categoryManagerStyles.listItemText}
                  />
                </Box>

                <Box sx={categoryManagerStyles.actionButtons}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setEditing({ id: category?._id, name: category?.name })
                    }
                    sx={categoryManagerStyles.editButton}
                    title="Edit category"
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => setDeleteConfirm(category?._id)}
                    sx={categoryManagerStyles.deleteButton}
                    title="Delete category"
                  >
                    <Delete />
                  </IconButton>
                </Box>

                {/* Delete Confirmation */}
                {deleteConfirm === category?._id && (
                  <Box sx={categoryManagerStyles.deleteConfirmBox}>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      Confirm delete?
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleDeleteCategory(category?._id)}
                        sx={{
                          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          color: "#fff",
                          fontSize: "0.8rem",
                        }}
                      >
                        Yes
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setDeleteConfirm(null)}
                        sx={{
                          borderColor: "#667eea",
                          color: "#667eea",
                          fontSize: "0.8rem",
                        }}
                      >
                        No
                      </Button>
                    </Box>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default CategoryManager;
