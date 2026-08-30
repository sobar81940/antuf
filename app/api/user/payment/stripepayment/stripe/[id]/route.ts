import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import CurriculumCourse from "@/models/CurriculumCourse";

export async function POST(req, context) {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  await dbConnect();
  const session = await getServerSession(authOptions);

  try {
    const user = await User.findOne({ _id: session?.user?._id });
    if (!user) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }
    const course = await CurriculumCourse.findOne({
      slug: context?.params?.id,
    });

    const sessions = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: course?.title,
            },
            unit_amount: parseFloat(course.price) * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/dashboard/user/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/user/cancel`,
      customer_email: user?.email,
      metadata: {
        course_id: course._id.toString(),
      },
    });

    console.log("Sessions----", sessions);
    return NextResponse.json({ id: sessions.url });
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
