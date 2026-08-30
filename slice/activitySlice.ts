import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  activities: [],
  currentActivity: null,
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/activities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Activities API error:", errorData);
        return rejectWithValue(`Failed to fetch activities: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Activities fetch error:", error);
      toast.error(`Error loading activities: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHomeActivities = createAsyncThunk(
  "activities/fetchHomeActivities",
  async (_, { rejectWithValue }) => {
    try {
      // Latest 3 activities (sorted by createdAt desc) for the homepage slider
      const response = await fetch('/api/admin/activities?limit=3', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Home activities API error:", errorData);
        return rejectWithValue(`Failed to fetch activities: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Home activities fetch error:", error);
      toast.error(`Error loading activities: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActivityById = createAsyncThunk(
  "activities/fetchActivityById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/activities/${id}`);

      if (!response.ok) {
        return rejectWithValue(`Failed to fetch activity: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error(`Error loading activity: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const createActivity = createAsyncThunk(
  "activities/createActivity",
  async (activityData: Record<string, any>) => {
    try {
      const response = await fetch('/api/admin/activities', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create activity ${response.status}`);
      }

      const data = await response.json();
      toast.success("Activity created successfully");
      return data.data || data;
    } catch (error) {
      toast.error(`Error creating activity: ${error.message}`);
      throw error;
    }
  }
);

export const updateActivity = createAsyncThunk(
  "activities/updateActivity",
  async ({
    id,
    activityData,
  }: {
    id: string;
    activityData: Record<string, any>;
  }) => {
    try {
      const response = await fetch(`/api/admin/activities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update activity ${response.status}`);
      }

      const data = await response.json();
      toast.success("Activity updated successfully");
      return data.data || data;
    } catch (error) {
      toast.error(`Error updating activity: ${error.message}`);
      throw error;
    }
  }
);

export const deleteActivity = createAsyncThunk(
  "activities/deleteActivity",
  async (id: string) => {
    try {
      const response = await fetch(`/api/admin/activities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete activity ${response.status}`);
      }

      toast.success("Activity deleted successfully");
      return id;
    } catch (error) {
      toast.error(`Error deleting activity: ${error.message}`);
      throw error;
    }
  }
);

const activitySlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all activities
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Fetch home activities (latest 3 for the homepage slider)
      .addCase(fetchHomeActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchHomeActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Fetch single activity
      .addCase(fetchActivityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentActivity = action.payload;
      })
      .addCase(fetchActivityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Create activity
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities.push(action.payload);
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Update activity
      .addCase(updateActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.activities.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.activities[index] = action.payload;
        }
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Delete activity
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = state.activities.filter(a => a._id !== action.payload);
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetError } = activitySlice.actions;
export default activitySlice.reducer;
