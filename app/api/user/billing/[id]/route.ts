import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Subscription from "@/models/subscription";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function GET(req, context) {
  await dbConnect();

  try {
    let user = await User.findOne({ _id: context?.params?.id });
    if (!user) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }
    const subscription = await Subscription.findOne({ userId: user?._id });
    if (!subscription) {
      return NextResponse.json(
        { err: "No subscription found!" },
        { status: 404 }
      );
    }
    return NextResponse.json(subscription);
  } catch (error) {
    console.log("Error from GET of billing----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
