import mongoose from "mongoose";
import Category from "./Category";
import SubCategory from "./subcategory";
// Define the schema
const CateWithSubCateSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to the Category collection
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory", // Reference to the Subcategory collection
      required: true,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    slug: {
      // Defining the `name` field to store the name of the category.
      type: String,
      // The type is `String`, appropriate for storing textual data like names.
      required: true,
      // This field is required, ensuring that a category name must be provided.
      trim: true,
      // The `trim` option removes any leading or trailing whitespace from the category name.
    },

    isActive: {
      type: Boolean,
      default: true, // Default value for active status
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default (mongoose.models.Item ||
  mongoose.model("Item", CateWithSubCateSchema)) as mongoose.Model<any>;
// Exporting the `Category` model, which is created from the `CategorySchema`.
// If the `Category` model already exists (to prevent redefinition), it reuses the existing model.
