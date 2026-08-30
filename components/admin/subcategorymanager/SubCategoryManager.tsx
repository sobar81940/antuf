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
} from "@mui/material";
import { Delete, Edit, Search } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchSubCategories,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "@/slice/subcategorySlice";
import subcategoryManagerStyles from "./subcategoryManagerStyles";

const SubCategoryManager = () => {
  const dispatch = useAppDispatch();

  const [newSubCategory, setSubNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState({ id: null, name: "" });
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const { list: subcategories, loading } = useAppSelector(
    (state) => state.subcategories
  );

  useEffect(() => {
    setFilteredSubCategories(subcategories);
  }, [subcategories]);

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const handleSaveCategory = () => {
    if (editing.id) {
      dispatch(updateSubCategory({ id: editing.id, name: editing.name }));
    } else {
      dispatch(addSubCategory(newSubCategory));
    }
    setEditing({ id: null, name: "" });
    setSubNewCategory("");
  };

  const handleDeletesubCategory = (id) => {
    dispatch(deleteSubCategory(id));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredSubCategories(subcategories);
    } else {
      const filtered = subcategories.filter((cat) =>
        cat.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSubCategories(filtered);
    }
  };

  return (
    <Box p={3} maxWidth="900px" mx="auto">
      <Typography variant="h4" gutterBottom>
        SubCategory Manager
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search SubCategories"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search style={{ color: "#8A12FC" }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={subcategoryManagerStyles.searchField}
        />
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label={editing.id ? "Edit SubCategory" : "Add SubCategory"}
          variant="outlined"
          fullWidth
          value={editing.id ? editing.name : newSubCategory}
          onChange={(e) =>
            editing.id
              ? setEditing({ ...editing, name: e.target.value })
              : setSubNewCategory(e.target.value)
          }
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={{
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#8A12FC",
              },
              "&:hover fieldset": {
                borderColor: "#8A12FC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8A12FC",
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSaveCategory}
          disabled={!newSubCategory.trim() && !editing.name.trim()}
          sx={subcategoryManagerStyles.listItem}
        >
          {editing.id ? "Update" : "Add"}
        </Button>
      </Box>

      <List>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          filteredSubCategories?.map((subcategory) => (
            <ListItem
              key={subcategory?._id}
              divider
              sx={subcategoryManagerStyles.listItem}
            >
              <ListItemText primary={subcategory?.name} />

              <IconButton
                edge="end"
                onClick={() =>
                  setEditing({ id: subcategory?._id, name: subcategory?.name })
                }
              >
                <Edit style={{ color: "green" }} />
              </IconButton>

              <IconButton
                edge="end"
                color="error"
                onClick={() => handleDeletesubCategory(subcategory?._id)}
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

export default SubCategoryManager;
