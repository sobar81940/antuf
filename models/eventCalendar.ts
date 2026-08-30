import mongoose from "mongoose";

const EventCalendarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleNepali: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    descriptionNepali: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // Format: "14:30" or "2:30 PM"
    },
    location: {
      type: String,
      trim: true,
    },
    locationNepali: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["workshop", "seminar", "training", "conference", "social", "sports", "cultural", "other"],
      default: "other",
    },
    image: {
      type: String, // URL to event poster/image
    },
    capacity: {
      type: Number,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    organizer: {
      name: String,
      email: String,
      phone: String,
    },
    participants: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [String],
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.EventCalendar || mongoose.model("EventCalendar", EventCalendarSchema)) as mongoose.Model<any>;
