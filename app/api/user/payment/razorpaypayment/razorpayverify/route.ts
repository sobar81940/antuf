import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";
import { getServerSession } from "next-auth/next";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/utils/authOptions";
import CourseOrder from "@/models/courseorder";
import UserCourse from "@/models/usercourse";
import Razorpay from "razorpay";

// Initialize Razorpay with env variables if available
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_CLIENT_ID;
  const keySecret = process.env.RAZORPAY_CLIENT_SECRET;
  
  if (!keyId || !keySecret) {
    console.warn("Razorpay credentials not configured");
    return null;
  }
  
  try {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (error) {
    console.error("Failed to initialize Razorpay:", error);
    return null;
  }
};

export async function POST(req, context) {
  await dbConnect();

  const body = await req.json();
  const { razorpay_payment_id } = body;
  const session = await getServerSession(authOptions);

  try {
    const razorpay = getRazorpayInstance();
    
    if (!razorpay) {
      return NextResponse.json(
        { 
          error: "Razorpay is not configured. Please add RAZORPAY_CLIENT_ID and RAZORPAY_CLIENT_SECRET to environment variables." 
        }, 
        { status: 500 }
      );
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    console.log("payment razor---", payment);

    const value = Number(payment.amount) / 100;
    const courseId = payment.notes.course_id;
    const course = await CurriculumCourse.findOne({ _id: courseId });
    if (payment && payment.status === "captured") {
      const orders = await CourseOrder.create({
        user_id: session?.user?._id,
        course_name: course?.title,
        transaction_id: courseId,
        order_id: uuidv4(),
        payment_provider: `${payment?.method || "razorpay"}`,
        amount: value,
        payment_status: "paid",
      });
      const usercourse = await UserCourse.create({
        user_id: session?.user?._id,
        course_id: course?._id,
      });
      console.log("Order----", orders);
      console.log("User course----", usercourse);
    } else {
      return NextResponse.json(
        { failed: "Payment failed, try again!" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: "Payment success!" }, { status: 200 });
  } catch (error) {
    console.log("Error from POST of razor verify----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
