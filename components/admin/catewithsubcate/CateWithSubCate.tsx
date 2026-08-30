import React, { use, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Delete, Edit, Search } from "@mui/icons-material";
import styles from "./ItemManagerStyles";
import { fetchCategories } from "@/slice/categorySlice";
import { fetchSubCategories } from "@/slice/subcategorySlice";
import {
  setEditingItem,
  resetEditingItem,
  saveItem,
  fetchItems,
  deleteItem,
} from "@/slice/catewithsubcateSlice";

const ItemManager = () => {
  const dispatch = useAppDispatch();
  const { list: categories } = useAppSelector((state) => state.categories);
  const { items, editingItem, loading } = useAppSelector((state) => state.items);
  const { list: subcategories } = useAppSelector((state) => state.subcategories);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  //Debug
  useEffect(() => {
    console.log("Cateogires fetched-", categories);
  }, [categories]);

  console.log("editing item--------", editingItem);
  //
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchItems());
  }, [dispatch]);

  useEffect(() => {
    if (editingItem) {
      setSelectedCategory(editingItem.categoryId._id);
      setSelectedSubCategory(editingItem.subcategoryId._id);
      setTitle(editingItem.title);
      setSubTitle(editingItem.subtitle);
    } else {
      resetForm();
    }
  }, [editingItem]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter((item) =>
        `${item.title} ${item.subtitle} ${item.categoryId.name} ${item.subcategoryId.name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  const handleSaveItem = () => {
    const item = {
      categoryId: selectedCategory,
      subcategoryId: selectedSubCategory,
      title,
      subtitle,
    };
    dispatch(saveItem(item)).then(() => {
      dispatch(fetchItems());
      resetForm();
    });
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setTitle("");
    setSubTitle("");
    dispatch(resetEditingItem());
  };

  //handle category change
  const handleCategoryChange = (cateogryId) => {
    setSelectedCategory(cateogryId);
    setSelectedSubCategory("");
  };

  const handleSubCategoryChange = (subcategoryId) => {
    setSelectedSubCategory(subcategoryId);
  };

  // Handle delete item
  const handleDeleteItem = (id) => {
    dispatch(deleteItem(id)).then(() => dispatch(fetchItems()));
  };

  return (
    <Box p={3} maxWidth="990px" mx="auto">
      <Typography variant="h4" gutterBottom>
        Category with Sub Category
      </Typography>

      <TextField
        label="Search by Title, Subtitle, Category or Sub Category"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={styles.searchField}
        InputLabelProps={{
          style: { color: "#8A12FC" },
        }}
      />

      <Box display="flex" flexDirection="column" gap={2} mb={3}>
        <FormControl fullWidth sx={styles.formControl}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            sx={styles.selectField}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={styles.formControl}>
          <InputLabel>SubCategory</InputLabel>
          <Select
            value={selectedSubCategory}
            onChange={(e) => handleSubCategoryChange(e.target.value)}
            sx={styles.selectField}
            disabled={!selectedCategory}
          >
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={styles.textField}
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
        />

        <TextField
          label="Sub Title"
          value={subtitle}
          onChange={(e) => setSubTitle(e.target.value)}
          sx={styles.textField}
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSaveItem}
          disabled={!selectedCategory || !selectedSubCategory}
          sx={styles.button}
        >
          {editingItem ? "Update" : "Add"}
        </Button>
      </Box>
      <List>
        {loading ? (
          <Typography>Loading@,</Typography>
        ) : (
          items &&
          filteredItems.map((item) => (
            <ListItem
              key={item._id}
              divider
              sx={{
                borderColor: "#8A12FC",

                padding: 1, // Add spacing
                // Subtle shadow for card effect
                "&:hover": {
                  backgroundColor: "#8A12FC", // Slightly brighter background on hover
                },
                transition: "all 0.3s ease", // Smooth hover transition
              }}
            >
              <ListItemText
                primary={item.title}
                secondary={
                  <>
                    <span
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "1rem",
                        color: "#CCCCCC",
                      }}
                    >
                      <strong>Category:</strong> {item.categoryId.name}
                    </span>
                    <span style={{ fontSize: "1rem", color: "#CCCCCC" }}>
                      <strong>Subcategory:</strong> {item.subcategoryId.name}
                    </span>
                  </>
                }
                primaryTypographyProps={{
                  variant: "h6", // Modern typography for title
                  color: "white", // White text for title
                }}
              />
              <IconButton
                edge="end"
                sx={{
                  color: "green", // Green color for edit icon
                  "&:hover": {
                    backgroundColor: "rgba(0, 255, 0, 0.1)", // Add hover background
                  },
                }}
                onClick={() => dispatch(setEditingItem(item))}
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                sx={{
                  color: "red", // Red color for delete icon
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.1)", // Add hover background
                  },
                }}
                onClick={() => handleDeleteItem(item._id)}
              >
                <Delete />
              </IconButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};
export default ItemManager;