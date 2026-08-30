"use client";

import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "@/slice/categorySlice";
import subcategoryReducer from "@/slice/subcategorySlice";
import itemsReducer from "@/slice/catewithsubcateSlice";
import slidersReducer from "@/slice/sliderSlice";
import videoSlice from "@/slice/videoSlice";
import activityReducer from "@/slice/activitySlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    subcategories: subcategoryReducer,
    items: itemsReducer,
    sliders: slidersReducer,
    videos: videoSlice,
    activities: activityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
