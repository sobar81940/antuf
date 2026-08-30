import mongoose from "mongoose";

const ProfessionalAssociationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Professional Association name is required"],
      unique: true,
      trim: true,
    },
    englishName: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      // Existing association records may not have a slug yet. Sparse keeps the
      // unique index safe while those records are migrated.
      sparse: true,
      trim: true,
      lowercase: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default (mongoose.models.ProfessionalAssociation ||
  mongoose.model("ProfessionalAssociation", ProfessionalAssociationSchema)) as mongoose.Model<any>;
