import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import CardPrintQueue from "@/models/cardPrintQueue";
import CardBulkOrder from "@/models/cardBulkOrder";
import User from "@/models/user";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const query: Record<string, any> = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;

    const [queues, total] = await Promise.all([
      CardPrintQueue.find(query)
        .populate("userId", "name email image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CardPrintQueue.countDocuments(query),
    ]);

    return NextResponse.json({
      queues,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching print queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch print queue" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const admin = await User.findOne({ email: session.user.email });
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const { userId, quantity = 1, cardType = "standard", requestNotes, shippingAddress } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const newQueue = new CardPrintQueue({
      userId,
      userName: targetUser.name,
      userEmail: targetUser.email,
      quantity,
      cardType,
      requestedBy: admin._id,
      requestedByEmail: admin.email,
      requestNotes,
      shippingAddress: shippingAddress || {
        name: targetUser.name,
        address: targetUser.address,
        city: targetUser.city,
        state: targetUser.state,
        country: targetUser.country,
        zipCode: targetUser.zipCode,
      },
    });

    await newQueue.save();

    return NextResponse.json(
      {
        message: "Print request created successfully",
        queue: newQueue,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating print request:", error);
    return NextResponse.json(
      { error: "Failed to create print request" },
      { status: 500 }
    );
  }
}
