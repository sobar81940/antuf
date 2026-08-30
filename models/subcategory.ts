import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
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
  {
    timestamps: true,
  }
);

export default (mongoose.models.SubCategory ||
  mongoose.model("SubCategory", SubCategorySchema)) as mongoose.Model<any>;
