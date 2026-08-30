import { NextResponse } from "next/server";
import ChatRoom from "@/models/chat";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const chatRoomId = resolvedParams.id;

    const chatRoom = await ChatRoom.findById(chatRoomId).populate(
      "userId",
      "name email image"
    );

    if (!chatRoom) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      session.user.role !== "admin" &&
      chatRoom.userId.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    return NextResponse.json(chatRoom);
  } catch (error) {
    console.error("Error fetching chat room:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat room" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const chatRoomId = resolvedParams.id;

    const { status, message, category, priority, adminId } = await req.json();

    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      session.user.role !== "admin" &&
      chatRoom.userId.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Update status
    if (status) {
      chatRoom.status = status;
    }

    // Add message if provided
    if (message) {
      chatRoom.messages.push({
        senderId: session.user.id,
        senderName: session.user.name,
        senderImage: session.user.image,
        senderRole: session.user.role,
        content: message,
        timestamp: new Date(),
        isRead: false,
      });
    }

    // Update other fields
    if (category) chatRoom.category = category;
    if (priority) chatRoom.priority = priority;
    if (adminId && session.user.role === "admin") {
      chatRoom.adminId = adminId;
      chatRoom.adminName = session.user.name;
      chatRoom.adminImage = session.user.image;
    }

    chatRoom.updatedAt = new Date();
    chatRoom.lastMessageAt = new Date();

    await chatRoom.save();

    return NextResponse.json(chatRoom);
  } catch (error) {
    console.error("Error updating chat room:", error);
    return NextResponse.json(
      { error: "Failed to update chat room" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const resolvedParams = await params;
    const chatRoomId = resolvedParams.id;

    await ChatRoom.findByIdAndDelete(chatRoomId);

    return NextResponse.json({ message: "Chat room deleted" });
  } catch (error) {
    console.error("Error deleting chat room:", error);
    return NextResponse.json(
      { error: "Failed to delete chat room" },
      { status: 500 }
    );
  }
}
