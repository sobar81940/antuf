import { NextResponse } from "next/server"; // Next.js utility to return API responses
import Stripe from "stripe"; // Stripe API for handling payments
import dbConnect from "@/utils/dbConnect"; // Utility function to connect to the MongoDB database
import User from "@/models/user"; // User model to interact with the MongoDB users collection
import { getServerSession } from "next-auth/next"; // NextAuth function to get the session of the current user
import { authOptions } from "@/utils/authOptions";

export async function POST(req, context) {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  await dbConnect();
  const body = await req.json();
  const { billingPeriod, price, title } = body;
  const sessions = await getServerSession(authOptions);
  const str = price;
  const integerOnly = str && parseInt(str.match(/\d+/)[0], 10);

  try {
    const user = await User.findOne({ _id: sessions?.user?._id });
    if (!user) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: `${billingPeriod} Subscription`,
            },
            unit_amount: integerOnly * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: user?.email,
      metadata: {
        userId: user?._id.toString(),
        billing: billingPeriod,
        title: title,
      },
    });

    return NextResponse.json({ id: session.url });
  } catch (error) {
    console.log("error from POST", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
