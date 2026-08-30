import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import CateWithSubCate from "@/models/catewithsubcate";
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
    // Fetching all documents from the CateWithSubCate collection, sorted by creation date
    // Populating the "categoryId" and "subcategoryId" fields with their respective references
    const cateWithSubCate = await CateWithSubCate.find({})
      .sort({ createdAt: -1 }) // Sorting by creation date in descending order
      .populate("categoryId") // Populating category details
      .populate("subcategoryId"); // Populating subcategory details

    return NextResponse.json(cateWithSubCate);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { categoryId, subcategoryId, title, subtitle } = body;
  console.log({ categoryId, subcategoryId, title, subtitle });
  const subcategory = await SubCategory.findOne({ _id: subcategoryId });
  // Extracting the subcategory's name (if available)
  const subcategorytitle = subcategory?.name;

  try {
    // Creating a new document in the CateWithSubCate collection
    // The slug is generated using the title (or the subcategory's name if the title is not available)
    const cateWithSubCate = await CateWithSubCate.create({
      categoryId,
      subcategoryId,
      title,
      subtitle,
      slug: generateSlug(title) || generateSlug(subcategorytitle), // Generating a slug from the title or subcategory name
    });
    console.log("Successfully created ---------", cateWithSubCate);
    return NextResponse.json(cateWithSubCate);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
