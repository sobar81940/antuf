import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import SubCategory from "@/models/subcategory";

export async function GET() {
  await dbConnect();
  try {
    const subcategory = await SubCategory.find({}).sort({ createdAt: -1 });
    return NextResponse.json(subcategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
