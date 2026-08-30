import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";

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

export async function GET(req, context) {
  await dbConnect();

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

    const course = await CurriculumCourse.findOne({
      slug: context?.params?.id,
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" }, 
        { status: 404 }
      );
    }

    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: "course_receipt",
      notes: {
        course_id: course?._id,
      },
    };

    const order = await razorpay.orders.create(options);
    console.log("Order from Razorpay", order);
    return NextResponse.json(order);
  } catch (error) {
    console.log("Error from razorpay GET route----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
