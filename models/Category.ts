import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
// Adding the `timestamps` option automatically creates `createdAt` and `updatedAt` fields,
// which track when each category document is created and last modified.

export default (mongoose.models.Category ||
  mongoose.model("Category", CategorySchema)) as mongoose.Model<any>;
// Exporting the `Category` model, which is created from the `CategorySchema`.
// If the `Category` model already exists (to prevent redefinition), it reuses the existing model.
