import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Allow guest messages without senderId
  },
  senderName: String,
  senderImage: String,
  senderRole: {
    type: String,
    enum: ["user", "admin", "guest"],
    default: "user",
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const ChatRoomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Allow guest chats without userId
  },
  userName: String,
  userEmail: String,
  userImage: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  adminName: String,
  adminImage: String,
  messages: [MessageSchema],
  status: {
    type: String,
    enum: ["active", "closed", "archived", "pending"],
    default: "active",
  },
  subject: String,
  category: {
    type: String,
    enum: ["general", "support", "billing", "technical", "other", "password", "router", "connection", "check", "account", "extend", "nettv", "offer"],
    default: "general",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
ChatRoomSchema.index({ userId: 1, createdAt: -1 });
ChatRoomSchema.index({ adminId: 1, createdAt: -1 });
ChatRoomSchema.index({ status: 1 });

export default (mongoose.models.ChatRoom || mongoose.model("ChatRoom", ChatRoomSchema)) as mongoose.Model<any>;
