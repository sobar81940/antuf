import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Subscription from "@/models/subscription";
import Order from "@/models/order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ err: "User not loggged in" }, { status: 401 });
  }

  const userId = session?.user?._id;

  try {
    const usersSubscriptionCount = await Subscription.countDocuments({
      userId,
    });
    const userOrderCount = await Order.countDocuments({ userId });
    return NextResponse.json({ usersSubscriptionCount, userOrderCount });
  } catch (error) {
    console.log("Error from GET of analytics----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
