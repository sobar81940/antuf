import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const addSubCategory = createAsyncThunk(
  "subcategories/addSubCategory",
  async (newSubCategory: string) => {
    const response = await fetch(`/api/admin/subcategory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSubCategory }),
    });
    toast.success("Subcategory created successfully");
    const data = await response.json();
    return data;
  }
);

export const updateSubCategory = createAsyncThunk(
  "subcategories/updateSubCategory",
  async ({ id, name }: { id: string; name: string }) => {
    const response = await fetch(`/api/admin/subcategory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name }),
    });
    toast.success("Subcategory updated successfully");
    return response.json();
  }
);

export const fetchSubCategories = createAsyncThunk(
  "subcategories/fetchSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/subcategory`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  "subcategories/deleteSubCategory",
  async (id: string) => {
    await fetch(`/api/admin/subcategory/${id}`, { method: "DELETE" });
    toast.success("Subcategory deleted successfully");
    return id;
  }
);

const subcategorySlice = createSlice({
  name: "subcategories", // Name of the slice, used in Redux actions
  initialState: {
    // Defining the initial state for subcategories
    list: [], // Stores the list of subcategories
    loading: false, // Tracks loading state for API calls
    error: null, // Stores error messages if an API call fails
  },
  reducers: {}, // No direct reducers needed as async logic is handled in extraReducers
  extraReducers: (builder) => {
    // Handling asynchronous actions
    builder
      // Handling fetchSubCategories actions
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true; // Set loading to true when fetching starts
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false; // Stop loading when fetch is successful
        state.list = action.payload; // Store fetched subcategories in state
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false; // Stop loading when fetch fails
        state.error = action.error.message; // Store error message
      })

      // Handling addSubCategory action
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
        // Add the newly created subcategory to the list
      })

      // Handling updateSubCategory action
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (sub) => sub._id === action.payload._id
        );
        // Find the index of the subcategory to update

        if (index !== -1) {
          state.list[index] = action.payload;
          // Update the subcategory in the state
        }
      })

      // Handling deleteSubCategory action
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((sub) => sub._id !== action.payload);
        // Remove the deleted subcategory from the state
      });
  },
});

export default subcategorySlice.reducer;
