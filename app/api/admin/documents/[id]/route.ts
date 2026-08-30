import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { Types } from "mongoose";
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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = await requireAdmin();
    const { id } = await params;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    const document = await Document.findByIdAndUpdate(id, { ...(await request.json()), updatedBy: userId }, { new: true });
    if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: document });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update document" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    const document = await Document.findByIdAndDelete(id);
    if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete document" }, { status: 500 });
  }
}
