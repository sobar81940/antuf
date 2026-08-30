import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Async thunk to fetch all items from the API (e.g., categories and subcategories)
export const fetchItems = createAsyncThunk("items/fetchItems", async () => {
  const response = await fetch(`${process.env.API}/admin/catewithsubcate`);
  return await response.json();
});

// Async thunk to save (either create or update) an item
export const saveItem = createAsyncThunk(
  "items/saveItem",
  async (item: Record<string, any>, { getState }) => {
    // Retrieve the current state of the items, including the item that is being edited
    const { editingItem } = (getState() as any).items;

    // If there is an existing item being edited, we need to update it
    if (editingItem) {
      // Make an API request to update the existing item on the backend
      const response = await fetch(
        `${process.env.API}/admin/catewithsubcate/${editingItem._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" }, // Specify the content type is JSON
          body: JSON.stringify(item), // Convert the item object to a JSON string and send it as the request body
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Updated successfully");
      } else {
        toast.error(data?.err);
      }
    } else {
      // If no item is being edited, treat it as a new item to be created
      console.log("item", item); // Debugging log to inspect the item being saved

      const response = await fetch(`${process.env.API}/admin/catewithsubcate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Specify the content type is JSON
        body: JSON.stringify(item), // Convert the item object to a JSON string and send it as the request body
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Created successfully");
      } else {
        toast.error(data?.err);
      }
    }

    // Return the item (either updated or newly created) to be stored in Redux state
    return item;
  }
);

// Async thunk to delete an item by ID
export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id: string) => {
  // Send a DELETE request to remove the item from the backend
  const response = await fetch(
    `${process.env.API}/admin/catewithsubcate/${id}`,
    { method: "DELETE" }
  );

  const data = await response.json();

  if (response.ok) {
    toast.success("Deleted successfully");
  } else {
    toast.error(data?.err);
  }

  // Return the ID of the deleted item so it can be removed from Redux state
  return id;
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    items: [],
    loading: false,
    error: null,
    editingItem: null,
  },
  reducers: {
    // Action to set the item being edited
    setEditingItem: (state, action) => {
      console.log("action.payload,", action); // Debugging
      state.editingItem = action.payload; // Set the item being edited to the payload value
    },
    // Action to reset the editing item (clear the form)
    resetEditingItem: (state) => {
      state.editingItem = null; // Reset the editing item to null when the form is cleared
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        // When the fetch is successful, store the fetched items in the Redux state
        state.items = action.payload;
      })
      // Handle the fulfilled state of the saveItem async thunk (both create and update actions)
      .addCase(saveItem.fulfilled, (state, action) => {
        // When the save is successful, reset the editingItem to null (clear the form)
        state.editingItem = null;
      })
      // Handle the fulfilled state of the deleteItem async thunk
      .addCase(deleteItem.fulfilled, (state, action) => {
        // Remove the deleted item from the items array by filtering out the deleted item based on its ID
        state.items = state.items.filter((item) => item.id !== action.payload); // Remove item with ID matching the payload
      });
  },
});

export const { setEditingItem, resetEditingItem } = itemsSlice.actions;
export default itemsSlice.reducer;
