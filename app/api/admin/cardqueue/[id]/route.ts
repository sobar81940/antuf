import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import CardPrintQueue from "@/models/cardPrintQueue";
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

    const { id } = params;
    const queue = await CardPrintQueue.findById(id)
      .populate("userId", "name email image")
      .populate("requestedBy", "name email")
      .populate("printedBy", "name email");

    if (!queue) {
      return NextResponse.json(
        { error: "Print queue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(queue);
  } catch (error) {
    console.error("Error fetching print queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch print queue" },
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

    const admin = await User.findOne({ email: session.user.email });
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const { id } = params;
    const updates = await request.json();

    // Validate status
    const validStatuses = ["pending", "processing", "printed", "shipped", "delivered", "cancelled"];
    if (updates.status && !validStatuses.includes(updates.status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update printedAt and printedBy if status is changing to "printed"
    if (updates.status === "printed") {
      updates.printedAt = new Date();
      updates.printedBy = admin._id;
    }

    const queue = await CardPrintQueue.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate("userId", "name email image");

    if (!queue) {
      return NextResponse.json(
        { error: "Print queue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Print request updated successfully",
      queue,
    });
  } catch (error) {
    console.error("Error updating print request:", error);
    return NextResponse.json(
      { error: "Failed to update print request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = params;
    const queue = await CardPrintQueue.findByIdAndDelete(id);

    if (!queue) {
      return NextResponse.json(
        { error: "Print queue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Print request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting print request:", error);
    return NextResponse.json(
      { error: "Failed to delete print request" },
      { status: 500 }
    );
  }
}
