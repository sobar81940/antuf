import mongoose from "mongoose";

const RepresentativeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name in Nepali is required"],
            trim: true,
            maxLength: [200, "Name cannot exceed 200 characters"],
        },
        nameEn: {
            type: String,
            required: [true, "Name in English is required"],
            trim: true,
            maxLength: [200, "Name cannot exceed 200 characters"],
        },
        position: {
            type: String,
            required: [true, "Position in Nepali is required"],
            trim: true,
            enum: [
                "अध्यक्ष",
                "वरिष्ठ उपाध्यक्ष",
                "उपाध्यक्ष",
                "महासचिव",
                "उपमहासचिव",
                "सचिव",
                "कोषाध्यक्ष",
                "सदस्य",
                "अन्य",
            ],
        },
        positionEn: {
            type: String,
            required: [true, "Position in English is required"],
            trim: true,
            enum: [
                "President",
                "Senior Vice President",
                "Vice President",
                "General Secretary",
                "Deputy General Secretary",
                "Secretary",
                "Treasurer",
                "Member",
                "Other",
            ],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email address",
            ],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        location: {
            type: String,
            trim: true,
            default: "काठमाडौं",
        },
        locationEn: {
            type: String,
            trim: true,
            default: "Kathmandu",
        },
        image: {
            type: String,
            default: "https://placehold.co/400x400?text=Avatar",
        },
        bio: {
            type: String,
            trim: true,
            maxLength: [500, "Bio cannot exceed 500 characters"],
        },
        bioEn: {
            type: String,
            trim: true,
            maxLength: [500, "Bio cannot exceed 500 characters"],
        },
        website: {
            type: String,
            trim: true,
            default: "",
        },
        facebook: {
            type: String,
            trim: true,
            default: "",
        },
        twitter: {
            type: String,
            trim: true,
            default: "",
        },
        linkedin: {
            type: String,
            trim: true,
            default: "",
        },
        instagram: {
            type: String,
            trim: true,
            default: "",
        },
        displayOrder: {
            type: Number,
            default: 0,
            min: [0, "Display order cannot be negative"],
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
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for efficient queries
RepresentativeSchema.index({ displayOrder: 1, isActive: 1 });
RepresentativeSchema.index({ position: 1 });
RepresentativeSchema.index({ createdAt: -1 });

// Virtual for full name with position
RepresentativeSchema.virtual("fullTitle").get(function () {
    return `${this.position} ${this.name}`;
});

RepresentativeSchema.virtual("fullTitleEn").get(function () {
    return `${this.positionEn} ${this.nameEn}`;
});

export default (mongoose.models.Representative ||
    mongoose.model("Representative", RepresentativeSchema)) as mongoose.Model<any>;
