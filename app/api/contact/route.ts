import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import ContactMessage from "@/models/ContactMessage";

// POST /api/contact - Public endpoint for the contact "Send Us a Message" form
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { reason, name, email, contactNumber, phone, message } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    const contactMessage = await ContactMessage.create({
      reason: reason || "",
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      contactNumber: contactNumber || phone || "",
      message: String(message).trim(),
      status: "unread",
    });

    return NextResponse.json(
      { success: true, data: contactMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message", details: error.message },
      { status: 500 }
    );
  }
}