import { NextResponse } from "next/server"; // Import Next.js response handling for returning HTTP responses
import dbConnect from "@/utils/dbConnect"; // Import the database connection utility
import { v4 as uuidv4 } from "uuid"; // Import the UUID library to generate unique order IDs

import { getServerSession } from "next-auth/next"; // Import function to get the current server session (user data)
import { authOptions } from "@/utils/authOptions"; // Import authentication options for session management
import CourseOrder from "@/models/courseorder"; // Import the CourseOrder model (for handling course orders in the DB)
import UserCourse from "@/models/usercourse"; // Import the UserCourse model (for associating courses with users)
import CurriculumCourse from "@/models/CurriculumCourse"; // Import the CurriculumCourse model (for fetching course data)

import paypal from "@paypal/checkout-server-sdk"; // Import PayPal SDK for handling PayPal transactions

// Create PayPal environment for Sandbox (test environment)
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

// Create a PayPal HTTP client to execute requests
let client = new paypal.core.PayPalHttpClient(environment);

// Define the GET request handler to capture PayPal payment and process order
export async function GET(req, context) {
  // Establish a database connection
  await dbConnect();

  // Retrieve the current session (user data)
  const session = await getServerSession(authOptions);

  try {
    // Create a PayPal OrdersCaptureRequest object using the PayPal order ID from the context
    const request = new paypal.orders.OrdersCaptureRequest(context?.params?.id);
    request.requestBody({}); // Empty body as no additional data is needed for the capture request

    // Execute the PayPal request to capture the payment
    const response = await client.execute(request);
    console.log("response  xxxx", response); // Log the response for debugging

    // Extract the transaction reference ID from the PayPal response
    const refrence = response?.result?.purchase_units[0].reference_id;

    // Extract the payment amount from the PayPal response
    const value =
      response?.result?.purchase_units[0].payments?.captures[0].amount?.value;

    // Set the payment amount
    const paypalamount = value;

    // Fetch the course associated with the payment using the reference ID (course ID)
    const course = await CurriculumCourse.findOne({
      _id: refrence, // Use the course ID stored in the PayPal response
    }).sort({
      createdAt: -1, // Sort by creation date in descending order to get the most recent course
    });

    // Check if the payment status is "COMPLETED"
    if (response?.result?.status === "COMPLETED") {
      // Create a new CourseOrder record to store the order details in the database
      const orders = await CourseOrder.create({
        user_id: session?.user?._id, // Store the user ID from the session
        course_name: course?.title, // Store the course title
        transaction_id: course?._id, // Store the course ID as the transaction ID
        order_id: uuidv4(), // Generate a unique order ID using UUID
        payment_provider: "Paypal", // Store the payment provider as PayPal
        amount: paypalamount, // Store the payment amount
        payment_status: "paid", // Mark the payment status as "paid"
      });

      // Create a UserCourse record to associate the user with the purchased course
      const usercourse = await UserCourse.create({
        user_id: session?.user?._id, // Store the user ID
        course_id: course?._id, // Store the course ID
      });

      console.log("orders", orders); // Log the created order for debugging
      console.log("usercourse", usercourse); // Log the created user-course association for debugging
    } else {
      // If the payment is not completed, return an error response
      return NextResponse.json({ err: "payment failed try again" });
    }

    // Return a success response with the PayPal result
    return NextResponse.json({ success: response.result });
  } catch (err) {
    // If there is an error, log it and return an error response
    console.error(err);
    return NextResponse.json({ err: err.message }, { status: 500 }); // Return a 500 error with the error message
  }
}
