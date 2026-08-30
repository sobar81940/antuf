import mongoose from "mongoose";

const GalleryImageSchema = new mongoose.Schema(
    {
        image: { type: String, required: true },
        title: { type: String, default: "" },
        caption: { type: String, default: "" },
        category: { type: String, required: true, lowercase: true, trim: true, index: true },
        order: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default (mongoose.models.GalleryImage ||
    mongoose.model("GalleryImage", GalleryImageSchema)) as mongoose.Model<any>;