import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import ContactMessage from "@/models/ContactMessage";

async function adminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  if (session.user.role === "admin" || session.user.isAdmin) return session;
  return null;
}

// GET /api/admin/messages - List contact messages
export async function GET(request: Request) {
  try {
    const session = await adminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "unread" | "read" | null
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 100;

    const query: Record<string, any> = {};
    if (status === "unread" || status === "read") query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const data = await ContactMessage.find(query)
      .select("-__v")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await ContactMessage.countDocuments(query);
    const unreadCount = await ContactMessage.countDocuments({ status: "unread" });

    return NextResponse.json({
      success: true,
      data,
      unreadCount,
      count: data.length,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages", details: error.message },
      { status: 500 }
    );
  }
}