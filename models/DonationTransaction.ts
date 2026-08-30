import mongoose from "mongoose";

const DonationTransactionSchema = new mongoose.Schema(
    {
        donorName: { type: String, required: true, trim: true },
        donorEmail: { type: String, required: true, trim: true, lowercase: true },
        donorPhone: { type: String, trim: true },
        donorAddress: { type: String, trim: true },
        amount: { type: Number, required: true, min: 1 },
        donationType: { type: String, enum: ["one-time", "monthly", "yearly"], default: "one-time" },
        paymentMethod: { type: String, enum: ["bank", "esewa", "khalti", "qr", "card"], required: true },
        transactionId: { type: String, trim: true },
        receiptUrl: { type: String, required: true },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    },
    { timestamps: true }
);

DonationTransactionSchema.index({ createdAt: -1 });
DonationTransactionSchema.index({ status: 1 });

export default (mongoose.models.DonationTransaction ||
    mongoose.model("DonationTransaction", DonationTransactionSchema)) as mongoose.Model<any>;