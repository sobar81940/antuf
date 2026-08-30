import { NextResponse } from "next/server"; // Next.js utility to return API responses
import Stripe from "stripe"; // Stripe API for handling payments
import dbConnect from "@/utils/dbConnect"; // Utility function to connect to the MongoDB database
import User from "@/models/user"; // User model to interact with the MongoDB users collection
import { getServerSession } from "next-auth/next"; // NextAuth function to get the session of the current user
import { authOptions } from "@/utils/authOptions"; // Authentication options for NextAuth

// Import additional models (Subscription and Order) for handling subscriptions and orders
import Subscription from "@/models/subscription"; // Subscription model for tracking subscription data
import Order from "@/models/order"; // Order model for tracking orders placed by users

// The GET function handles verifying the payment and processing the subscription
export async function GET(req, context) {
  // Initialize the Stripe instance with the secret API key at runtime
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  await dbConnect(); // Establish a connection to the database

  // Get the current session (to get the user who made the request)
  const sessionuser = await getServerSession(authOptions);

  try {
    const params = await context.params;
    // Retrieve the Stripe checkout session using the session ID from the request context
    const session = await stripeInstance.checkout.sessions.retrieve(
      params.id
    );

    console.log("session****************", session); // Log the retrieved session for debugging

    // Check if the session exists and if the payment status is 'paid'
    if (session && session?.payment_status === "paid") {
      // Find the user from the database using the user ID from the session
      const user = await User.findOne({ _id: sessionuser?.user._id });

      // Check if the user already has a subscription
      const alreadysubscription = await Subscription.findOne({
        userId: user?._id,
      });

      const currentDate = new Date(); // Get the current date

      const billingPeriod = session.metadata.billing; // Get the billing period from session metadata (monthly/annual)
      const userId = session.metadata.userId; // Get the user ID from session metadata
      const amount = session.amount_total / 100; // Convert the total amount to a readable format (dividing by 100)

      const plan = session.metadata.title; // Get the subscription plan (e.g., "monthly" or "annual")

      // If the amount is 0, return an error response
      if (amount === 0) {
        return NextResponse.json(
          { message: "No charge for this transaction" },
          { status: 400 }
        );
      }

      // If the user already has a subscription
      if (alreadysubscription) {
        if (currentDate < alreadysubscription.endDate) {
          // If the current date is before the existing subscription's end date, update the end date based on billing period
          const updatedEndDate = new Date(alreadysubscription.endDate);

          if (billingPeriod === "annual") {
            updatedEndDate.setFullYear(updatedEndDate.getFullYear() + 1); // Add 1 year to the end date if annual billing
          } else if (billingPeriod === "monthly") {
            updatedEndDate.setMonth(updatedEndDate.getMonth() + 1); // Add 1 month to the end date if monthly billing
          }

          alreadysubscription.endDate = updatedEndDate; // Update the subscription's end date

          // Create a new order and save it to the database
          const order = new Order({
            userId,
            transactionId: session.id, // Use the session ID for the transaction
            orderStatus: "Completed",
            paymentMethod: "Credit Card",
            paymentStatus: "Paid",
            totalPrice: amount,
          });

          await order.save(); // Save the order to the database
        } else {
          // If the subscription has expired or ended, create a new end date based on billing period
          const newEndDate = new Date();

          if (billingPeriod === "annual") {
            newEndDate.setFullYear(newEndDate.getFullYear() + 1); // Set a new end date with annual billing
          } else if (billingPeriod === "monthly") {
            newEndDate.setMonth(newEndDate.getMonth() + 1); // Set a new end date with monthly billing
          }

          alreadysubscription.endDate = newEndDate; // Update the subscription's end date

          // Create a new order for the renewed subscription and save it
          const order = new Order({
            userId,
            transactionId: session.id,
            orderStatus: "Completed",
            paymentMethod: "Credit Card",
            paymentStatus: "Paid",
            totalPrice: amount,
          });

          await order.save(); // Save the order to the database
        }

        // Update the subscription's plan and save it
        alreadysubscription.plan = plan;
        await alreadysubscription.save(); // Save the updated subscription
      } else {
        // If the user does not have an existing subscription, create a new one
        const endDate = new Date();

        if (billingPeriod === "annual") {
          endDate.setFullYear(endDate.getFullYear() + 1); // Set the end date to 1 year ahead for annual billing
        } else if (billingPeriod === "monthly") {
          endDate.setMonth(endDate.getMonth() + 1); // Set the end date to 1 month ahead for monthly billing
        }

        // Create a new subscription and save it to the database
        const subscription = new Subscription({
          plan,
          userId,
          stripesubscriptionId: session.id,
          startDate: new Date(),
          endDate,
          price: amount,
        });

        await subscription.save(); // Save the new subscription to the database

        // Create a new order for the subscription and save it
        const order = new Order({
          userId,
          transactionId: session.id,
          orderStatus: "Completed",
          paymentMethod: "Credit Card",
          paymentStatus: "Paid",
          totalPrice: amount,
        });

        await order.save(); // Save the new order to the database

        // Update the user's subscription field with the new subscription ID
        await User.findByIdAndUpdate(userId, {
          subscription: subscription?._id,
        });
      }

      console.log("success: payment verified"); // Log success message

      // Return a success response indicating the payment is verified
      return NextResponse.json(
        { success: "payment verified" },
        { status: 200 }
      );
    } else {
      // If the payment was not successful, return an error response
      return NextResponse.json(
        { err: "payment failed, please try again" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log("payment error*****", error); // Log any errors that occur during the process
    return NextResponse.json({ err: error.message }, { status: 500 }); // Return the error message in the response
  }
}
