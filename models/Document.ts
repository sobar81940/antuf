import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    titleNepali: { type: String, trim: true },
    category: { type: String, default: "other", trim: true },
    fileUrl: { type: String, required: true, trim: true },
    fileName: { type: String, required: true, trim: true },
    fileType: { type: String, default: "FILE", trim: true },
    fileSize: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default (mongoose.models.Document || mongoose.model("Document", DocumentSchema)) as mongoose.Model<any>;
