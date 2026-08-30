import mongoose from "mongoose";

const AffiliateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Organization name in Nepali is required"],
            trim: true,
        },
        nameEn: {
            type: String,
            required: [true, "Organization name in English is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: [
                "Transport",
                "Textile",
                "Hospitality",
                "Construction",
                "Healthcare",
                "Education",
                "Agriculture",
                "Technology",
                "Banking",
                "Manufacturing",
                "Other",
            ],
        },
        categoryNp: {
            type: String,
            required: [true, "Category in Nepali is required"],
        },
        logo: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        members: {
            type: String,
            default: "0",
        },
        location: {
            type: String,
            required: [true, "Location is required"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        website: {
            type: String,
            default: "",
        },
        established: {
            type: String,
            default: "",
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
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
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
AffiliateSchema.index({ displayOrder: 1, isActive: 1 });
AffiliateSchema.index({ category: 1, isActive: 1 });
AffiliateSchema.index({ createdAt: -1 });

export default (mongoose.models.Affiliate ||
    mongoose.model("Affiliate", AffiliateSchema)) as mongoose.Model<any>;
