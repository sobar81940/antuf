import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import CartReceipt from "@/models/cartReceipt";
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
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const query: Record<string, any> = { userId: user._id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [receipts, total] = await Promise.all([
      CartReceipt.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CartReceipt.countDocuments(query),
    ]);

    return NextResponse.json({
      receipts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return NextResponse.json(
      { error: "Failed to fetch receipts" },
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

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const {
      items,
      subtotal,
      tax = 0,
      discount = 0,
      discountCode,
      total,
      paymentMethod = "stripe",
      shippingAddress,
      billingAddress,
      notes,
    } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const newReceipt = new CartReceipt({
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      items,
      subtotal,
      tax,
      discount,
      discountCode,
      total,
      paymentMethod,
      orderId,
      shippingAddress: shippingAddress || {
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        zipCode: user.zipCode,
      },
      billingAddress: billingAddress || {
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        zipCode: user.zipCode,
      },
      notes,
      status: "pending",
    });

    await newReceipt.save();

    return NextResponse.json(
      {
        message: "Receipt created successfully",
        receipt: newReceipt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating receipt:", error);
    return NextResponse.json(
      { error: "Failed to create receipt" },
      { status: 500 }
    );
  }
}
