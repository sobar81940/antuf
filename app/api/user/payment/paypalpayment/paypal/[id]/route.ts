import { NextResponse } from "next/server"; // Next.js API handler for responses
import dbConnect from "@/utils/dbConnect"; // Import utility to connect to the database
import paypal from "@paypal/checkout-server-sdk"; // Import PayPal SDK for handling PayPal transactions
import CurriculumCourse from "@/models/CurriculumCourse"; // Import the CurriculumCourse model for course data

// Set up PayPal environment with client ID and secret (sandbox mode for testing)
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

// Create PayPal client to interact with the PayPal API
let client = new paypal.core.PayPalHttpClient(environment);

// The main GET function to create a PayPal order
export async function GET(req, context) {
  // Establish a database connection
  await dbConnect();

  try {
    const params = await context.params;
    // Fetch course data based on the slug parameter from the URL (params.id)
    const course = await CurriculumCourse.findOne({
      slug: params.id,
    }).sort({ createdAt: -1 });

    // Set up the PayPal order creation request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation"); // Indicate that the API should return a representation of the order

    // Define the request body for the PayPal order creation
    request.requestBody({
      application_context: {
        // Redirect URLs for successful and canceled payments
        return_url: "http://localhost:3000/dashboard/user/paypal/success",
        cancel_url: "http://localhost:3000/dashboard/user/paypal/cancel",
      },
      intent: "CAPTURE", // Intent to capture the payment after approval
      purchase_units: [
        {
          // Associate the course with the PayPal order using reference ID
          reference_id: course && course?._id,
          amount: {
            currency_code: "USD", // Set the currency as USD
            value: course && course?.price, // Set the course price
          },
        },
      ],
    });

    // Execute the PayPal order creation request
    const order = await client.execute(request);
    console.log("order===>", order.result.links); // Log the PayPal order response links for debugging

    // Return the approval URL (second link) from the PayPal order response to the client
    return NextResponse.json({ id: order?.result.links[1].href });
  } catch (err) {
    // Catch any errors and return a 500 error response with the error message
    console.log("err=>", err);
    return NextResponse.json(err.message, { status: 500 });
  }
}
