import mongoose from "mongoose";

const CartReceiptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    items: [
      {
        itemId: String,
        itemName: String,
        itemType: {
          type: String,
          enum: ["course", "membership", "card", "content"],
        },
        quantity: Number,
        price: Number,
        subtotal: Number,
        description: String,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountCode: {
      type: String,
      trim: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "razorpay", "paypal", "card"],
      default: "stripe",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      trim: true,
    },
    orderId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
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
    billingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    notes: String,
    status: {
      type: String,
      enum: ["draft", "pending", "processing", "completed", "cancelled"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookups
CartReceiptSchema.index({ userId: 1 });
CartReceiptSchema.index({ createdAt: -1 });
CartReceiptSchema.index({ paymentStatus: 1 });

export default (mongoose.models.CartReceipt ||
  mongoose.model("CartReceipt", CartReceiptSchema)) as mongoose.Model<any>;
