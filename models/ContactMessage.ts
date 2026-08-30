import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [200, "Name cannot exceed 200 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    contactNumber: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
      index: true,
    },
  },
  { timestamps: true }
);

ContactMessageSchema.index({ createdAt: -1 });

export default (mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema)) as mongoose.Model<any>;