import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import CardBulkOrder from "@/models/cardBulkOrder";
import CardPrintQueue from "@/models/cardPrintQueue";
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
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const query: Record<string, any> = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      CardBulkOrder.find(query)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CardBulkOrder.countDocuments(query),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bulk orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch bulk orders" },
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

    const { batchName, userIds, cardType = "standard", description, notes, tags = [] } = await request.json();

    if (!batchName || !userIds || userIds.length === 0) {
      return NextResponse.json(
        { error: "batchName and userIds are required" },
        { status: 400 }
      );
    }

    // Verify all users exist
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      return NextResponse.json(
        { error: "One or more users not found" },
        { status: 404 }
      );
    }

    // Create bulk order
    const bulkOrder = new CardBulkOrder({
      batchName,
      userIds,
      cardType,
      description,
      notes,
      tags,
      totalCards: userIds.length,
      createdBy: admin._id,
      createdByEmail: admin.email,
      status: "draft",
    });

    await bulkOrder.save();

    return NextResponse.json(
      {
        message: "Bulk order created successfully",
        order: bulkOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulk order:", error);
    return NextResponse.json(
      { error: "Failed to create bulk order" },
      { status: 500 }
    );
  }
}
