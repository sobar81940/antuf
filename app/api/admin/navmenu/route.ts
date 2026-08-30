import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import NavMenu from "@/models/NavMenu";

export async function GET() {
  await dbConnect();
  try {
    const items = await NavMenu.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    if (!body.label) {
      return NextResponse.json({ success: false, error: "Label is required" }, { status: 400 });
    }
    const item = await NavMenu.create({
      label:     body.label,
      labelEn:   body.labelEn || "",
      path:      body.path || "",
      children:  body.children || [],
      order:     body.order ?? 0,
      isVisible: body.isVisible !== undefined ? body.isVisible : true,
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
