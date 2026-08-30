import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import CardBulkOrder from "@/models/cardBulkOrder";
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
    const order = await CardBulkOrder.findById(id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("userIds", "name email image")
      .populate("printQueueIds");

    if (!order) {
      return NextResponse.json(
        { error: "Bulk order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching bulk order:", error);
    return NextResponse.json(
      { error: "Failed to fetch bulk order" },
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
    const { status, assignedTo, processingNotes, action } = await request.json();

    const order = await CardBulkOrder.findById(id);
    if (!order) {
      return NextResponse.json(
        { error: "Bulk order not found" },
        { status: 404 }
      );
    }

    // Handle specific actions
    if (action === "submit_for_processing") {
      // Create print queue items for each user
      const printQueues = [];
      for (const userId of order.userIds) {
        const user = await User.findById(userId);
        if (user) {
          const newQueue = new CardPrintQueue({
            userId,
            userName: user.name,
            userEmail: user.email,
            cardType: order.cardType,
            quantity: 1,
            requestedBy: admin._id,
            requestedByEmail: admin.email,
            bulkOrderId: order._id,
            shippingAddress: {
              name: user.name,
              address: user.address,
              city: user.city,
              state: user.state,
              country: user.country,
              zipCode: user.zipCode,
            },
          });
          await newQueue.save();
          printQueues.push(newQueue._id);
        }
      }

      order.printQueueIds = printQueues;
      order.status = "pending";
      order.processingStartedAt = new Date();
    }

    if (status) {
      order.status = status;
      if (status === "processing") {
        order.processingStartedAt = new Date();
      } else if (status === "completed") {
        order.completedAt = new Date();
      }
    }

    if (assignedTo) {
      order.assignedTo = assignedTo;
    }

    if (processingNotes) {
      order.notes = processingNotes;
    }

    await order.save();

    const updatedOrder = await CardBulkOrder.findById(id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .populate("userIds", "name email");

    return NextResponse.json({
      message: "Bulk order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating bulk order:", error);
    return NextResponse.json(
      { error: "Failed to update bulk order" },
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

    // Delete associated print queues first
    await CardPrintQueue.deleteMany({ bulkOrderId: id });

    const order = await CardBulkOrder.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { error: "Bulk order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Bulk order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bulk order:", error);
    return NextResponse.json(
      { error: "Failed to delete bulk order" },
      { status: 500 }
    );
  }
}
