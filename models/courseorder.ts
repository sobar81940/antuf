import mongoose from "mongoose";

const courseOrderSchema = new mongoose.Schema(
  {
    // 'user_id' field stores the reference to the User who made the purchase
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // The field type is an ObjectId (MongoDB's default for referencing other documents)
      ref: "User", // 'ref' points to the "User" model, creating a relationship with the User schema
      required: true,
    },

    // 'course_name' field stores the name of the course purchased by the user
    course_name: {
      type: String,
      required: true,
    },

    // 'transaction_id' field stores the unique ID of the transaction processed
    transaction_id: {
      type: String,
      required: true,
    },

    // 'order_id' field stores the unique ID of the order placed for the course
    order_id: {
      type: String,
      required: true,
    },

    // 'payment_provider' field stores the name of the payment provider (e.g., PayPal, Stripe)
    payment_provider: {
      type: String,
    },

    // 'amount' field stores the total amount paid by the user for the course
    amount: {
      type: Number,
      required: true,
      min: 0, // Ensures that the amount cannot be negative
    },

    // 'payment_status' field stores the status of the payment (e.g., 'success', 'failed')
    payment_status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.CourseOrder ||
  mongoose.model("CourseOrder", courseOrderSchema)) as mongoose.Model<any>;
