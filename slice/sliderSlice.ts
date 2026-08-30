import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  sliders: [],
  currentSlider: null,
  loading: false,
  error: null,
};

export const fetchSliderById = createAsyncThunk(
  "sliders/fetchSliderById",

  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/sliders/${id}`);

      if (!response.ok) {
        return rejectWithValue(`Failed to fetch slider: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`Error loading slider: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSliders = createAsyncThunk(
  "sliders/fetchSliders",

  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching sliders from /api/admin/sliders");
      const response = await fetch(`/api/admin/sliders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Slider response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Slider API error:", errorData);
        return rejectWithValue(`Failed to fetch sliders: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Sliders fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Slider fetch error:", error);
      toast.error(`Error loading sliders: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHomeSliders = createAsyncThunk(
  "sliders/fetchHomeSliders",

  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching home sliders from /api/sliders');
      const response = await fetch(`/api/sliders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Home sliders response status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Home sliders API error:", errorData);
        // Don't show toast - let demo slider handle it silently
        return rejectWithValue(`Failed to fetch sliders: ${response.status}`);
      }

      const data = await response.json();
      console.log("Home sliders fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Home sliders fetch error:", error);
      // Silently fail - demo slider will be shown
      return rejectWithValue("Unable to load sliders - using demo");
    }
  }
);

export const createSlider = createAsyncThunk(
  "sliders/createSlider",

  async (sliderData: Record<string, any>) => {
    try {
      const response = await fetch(`/api/admin/sliders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sliderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create slider ${response.status}`);
      }

      const data = await response.json();

      toast.success("slider created successfully");

      return data;
    } catch (error) {
      toast.error(`error creating slider ${error.message}`);

      throw error;
    }
  }
);

export const updateSlider = createAsyncThunk(
  "sliders/updateSlider",

  async ({
    id,
    sliderData,
  }: {
    id: string;
    sliderData: Record<string, any>;
  }) => {
    try {
      const response = await fetch(`/api/admin/sliders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sliderData),
      });

      if (!response.ok) {
        throw new Error(`failed to update slider ${response.status}`);
      }

      const data = await response.json();

      toast.success("slider updated successfully");

      return data;
    } catch (error) {
      toast.error(`error updating sliders ${error.message}`);

      throw error;
    }
  }
);

export const deleteSlider = createAsyncThunk(
  "sliders/deleteSlider",

  async (id: string) => {
    try {
      const response = await fetch(`/api/admin/sliders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`failed to delete slider ${response.status}`);
      }

      toast.success("slider deleted successfully");

      return id;
    } catch (error) {
      toast.error(`error deleting slider ${error.message}`);
      throw error;
    }
  }
);

const sliderSlice = createSlice({
  name: "sliders",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all sliders
      .addCase(fetchSliders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSliders.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders = action.payload;
      })
      .addCase(fetchSliders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Single slider fetch
      .addCase(fetchSliderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSliderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSlider = action.payload;
      })
      .addCase(fetchSliderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch home sliders
      .addCase(fetchHomeSliders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeSliders.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders = action.payload;
      })
      .addCase(fetchHomeSliders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Create slider
      .addCase(createSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSlider.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders.push(action.payload.data || action.payload);
      })
      .addCase(createSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Update slider
      .addCase(updateSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSlider.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sliders.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.sliders[index] = action.payload;
        }
      })
      .addCase(updateSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Delete slider
      .addCase(deleteSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSlider.fulfilled, (state, action) => {
        state.loading = false;
        state.sliders = state.sliders.filter(s => s._id !== action.payload);
      })
      .addCase(deleteSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetError } = sliderSlice.actions;
export default sliderSlice.reducer;