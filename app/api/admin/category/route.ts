import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/models/Category";

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

// Define the GET function to retrieve data from the Category collection
export async function GET() {
  await dbConnect(); // Establish a database connection before querying

  try {
    // Query the Category collection to get all documents, sorted by the 'createdAt' field in descending order (newest first)
    const category = await Category.find({}).sort({ createdAt: -1 });

    // Return the retrieved data as a JSON response
    return NextResponse.json(category);
  } catch (err) {
    // If an error occurs during the query or any other step, return a 500 Internal Server Error response with the error message
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const { name } = body;
  try {
    const category = await Category.create({ name, slug: generateSlug(name) });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
