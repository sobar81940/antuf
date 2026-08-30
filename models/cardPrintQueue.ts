import mongoose from "mongoose";

const CardPrintQueueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "printed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    cardType: {
      type: String,
      enum: ["standard", "premium", "digital"],
      default: "standard",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestedByEmail: {
      type: String,
      required: true,
    },
    requestNotes: {
      type: String,
      trim: true,
    },
    processingNotes: {
      type: String,
      trim: true,
    },
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    estimatedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
    },
    bulkOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CardBulkOrder",
    },
    printedAt: {
      type: Date,
    },
    printedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookups
CardPrintQueueSchema.index({ userId: 1, status: 1 });
CardPrintQueueSchema.index({ status: 1 });
CardPrintQueueSchema.index({ createdAt: -1 });
CardPrintQueueSchema.index({ bulkOrderId: 1 });

export default (mongoose.models.CardPrintQueue ||
  mongoose.model("CardPrintQueue", CardPrintQueueSchema)) as mongoose.Model<any>;
