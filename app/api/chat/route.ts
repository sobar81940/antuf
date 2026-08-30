import { NextResponse } from "next/server";
import ChatRoom from "@/models/chat";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import dbConnect from "@/utils/dbConnect";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    let chatRooms;
    if (session.user.role === "admin") {
      // Get all chat rooms with unread count
      chatRooms = await ChatRoom.find()
        .sort({ lastMessageAt: -1 })
        .populate("userId", "name email image");
    } else {
      // Get user's chat rooms
      chatRooms = await ChatRoom.find({ userId: session.user.id })
        .sort({ lastMessageAt: -1 });
    }

    return NextResponse.json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat rooms" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { subject, category, priority, adminId } = await req.json();

    // Check if user already has an active chat room
    let chatRoom = await ChatRoom.findOne({
      userId: session.user.id,
      status: "active",
    });

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        userImage: session.user.image,
        subject,
        category: category || "general",
        priority: priority || "medium",
        adminId,
        messages: [],
      });

      await chatRoom.save();
    }

    return NextResponse.json(chatRoom, { status: 201 });
  } catch (error) {
    console.error("Error creating chat room:", error);
    return NextResponse.json(
      { error: "Failed to create chat room" },
      { status: 500 }
    );
  }
}
