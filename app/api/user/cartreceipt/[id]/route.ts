import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import CartReceipt from "@/models/cartReceipt";
import User from "@/models/user";

export async function GET(request, { params }) {
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

    const { id } = params;
    const receipt = await CartReceipt.findById(id);

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (receipt.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json(receipt);
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return NextResponse.json(
      { error: "Failed to fetch receipt" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
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

    const { id } = params;
    const receipt = await CartReceipt.findById(id);

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (receipt.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const updates = await request.json();
    
    // Only allow certain fields to be updated by user
    const allowedUpdates = ["shippingAddress", "notes"];
    const filteredUpdates = {};
    
    allowedUpdates.forEach(field => {
      if (field in updates) {
        filteredUpdates[field] = updates[field];
      }
    });

    const updatedReceipt = await CartReceipt.findByIdAndUpdate(
      id,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Receipt updated successfully",
      receipt: updatedReceipt,
    });
  } catch (error) {
    console.error("Error updating receipt:", error);
    return NextResponse.json(
      { error: "Failed to update receipt" },
      { status: 500 }
    );
  }
}
