import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
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
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's card orders
    const orders = await CardPrintQueue.find({ userId: user._id })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching user card orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
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

    const { quantity = 1, cardType = "standard", shippingAddress, notes } = await request.json();

    if (quantity < 1 || quantity > 100) {
      return NextResponse.json(
        { error: "Quantity must be between 1 and 100" },
        { status: 400 }
      );
    }

    const newOrder = new CardPrintQueue({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      quantity,
      cardType,
      requestedBy: user._id,
      requestedByEmail: user.email,
      requestNotes: notes,
      status: "pending",
      shippingAddress: shippingAddress || {
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        zipCode: user.zipCode,
      },
    });

    await newOrder.save();

    return NextResponse.json(
      {
        message: "Card order created successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating card order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
