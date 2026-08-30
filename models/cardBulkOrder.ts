import mongoose from "mongoose";

const CardBulkOrderSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    totalCards: {
      type: Number,
      required: true,
      min: 1,
    },
    cardType: {
      type: String,
      enum: ["standard", "premium", "digital"],
      default: "standard",
    },
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "pending", "processing", "completed", "cancelled"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByEmail: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processingStartedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    tags: [String],
    printQueueIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CardPrintQueue",
      },
    ],
    cardsCompleted: {
      type: Number,
      default: 0,
    },
    cardsShipped: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookups
CardBulkOrderSchema.index({ status: 1 });
CardBulkOrderSchema.index({ createdBy: 1 });
CardBulkOrderSchema.index({ createdAt: -1 });

export default (mongoose.models.CardBulkOrder ||
  mongoose.model("CardBulkOrder", CardBulkOrderSchema)) as mongoose.Model<any>;
