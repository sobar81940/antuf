import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Document from "@/models/Document";

export async function GET() {
  try {
    await dbConnect();
    const documents = await Document.find({ isPublished: true })
      .select("title titleNepali category fileUrl fileName fileType fileSize createdAt")
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: documents });
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
