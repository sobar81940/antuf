import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import NavMenu from "@/models/NavMenu";

export async function GET() {
  await dbConnect();
  try {
    const items = await NavMenu.find({ isVisible: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
