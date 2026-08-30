import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";
import SubCategory from "@/models/subcategory";

// Simple slug generator that supports all languages
const generateSlug = (text) => {
  if (!text) return 'category-' + Date.now();
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'category-' + Date.now();
};

export async function GET() {
  await dbConnect();
  try {
    const subcategory = await SubCategory.find({}).sort({ createdAt: -1 });
    return NextResponse.json(subcategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { name } = body;
  try {
    const subcategory = await SubCategory.create({ name, slug: generateSlug(name) });
    return NextResponse.json(subcategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
