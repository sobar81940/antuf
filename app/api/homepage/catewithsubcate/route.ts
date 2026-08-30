import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CateWithSubCate from "@/models/catewithsubcate";

export async function GET() {
  await dbConnect();
  try {
    const catewithsubcate = await CateWithSubCate.find({})
      .sort({ createdAt: -1 })
      .populate("categoryId")
      .populate("subcategoryId");
    return NextResponse.json(catewithsubcate);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
