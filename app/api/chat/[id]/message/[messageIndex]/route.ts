import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Chat from "@/models/chat";

/**
 * DELETE /api/chat/[id]/message/[messageIndex]
 * Delete a specific message from a chat room
 */
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id: chatId, messageIndex } = params;
    const messageIdx = parseInt(messageIndex, 10);

    // Validate message index
    if (isNaN(messageIdx) || messageIdx < 0) {
      return NextResponse.json(
        { error: "Invalid message index" },
        { status: 400 }
      );
    }

    // Find the chat room
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return NextResponse.json(
        { error: "Chat room not found" },
        { status: 404 }
      );
    }

    // Check if message index exists
    if (messageIdx >= chat.messages.length) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Remove the message
    chat.messages.splice(messageIdx, 1);

    // Save the updated chat
    await chat.save();

    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message", details: error.message },
      { status: 500 }
    );
  }
}
