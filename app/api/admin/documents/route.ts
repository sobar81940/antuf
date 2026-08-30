import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/dbConnect";
import { authOptions } from "@/utils/authOptions";
import Document from "@/models/Document";
import User from "@/models/user";

async function requireAdmin() {
  const session: any = await getServerSession(authOptions as any);
  const userId = session?.user?._id || session?.user?.id;
  if (!userId) return null;
  const user: any = await User.findById(userId).select("role isAdmin").lean();
  return user?.role === "admin" || user?.isAdmin ? userId : null;
}

export async function GET() {
  try {
    await dbConnect();
    if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const documents = await Document.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: documents });
  } catch (error: any) {
    console.error("Error fetching admin documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const userId = await requireAdmin();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (!body.title || !body.fileUrl || !body.fileName) {
      return NextResponse.json({ error: "Title and uploaded file are required" }, { status: 400 });
    }
    const document = await Document.create({ ...body, createdBy: userId, updatedBy: userId });
    return NextResponse.json({ success: true, data: document }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating document:", error);
    return NextResponse.json({ error: error.message || "Failed to create document" }, { status: 500 });
  }
}
