import { NextResponse } from "next/server"; // Used to return JSON responses in Next.js API routes
import dbConnect from "@/utils/dbConnect"; // Function to connect to the MongoDB database
import Curriculum from "@/models/Curriculum"; // Curriculum model to interact with the 'Curriculum' collection
import SubCategory from "@/models/subcategory"; // SubCategory model to interact with the 'SubCategory' collection

// Main GET function to fetch curriculums and subcategories
export async function GET() {
  // Establish a connection to the database
  await dbConnect();

  try {
    // Fetch all curriculums, sorted by creation date in descending order
    const curriculums = await Curriculum.find({}).sort({ createdAt: -1 });

    // Fetch all subcategories, also sorted by creation date in descending order
    const subCategory = await SubCategory.find({}).sort({ createdAt: -1 });

    // Return the data as a JSON response
    return NextResponse.json({
      curriculums,
      subCategory,
    });
  } catch (err) {
    // If an error occurs, return an error message with a 500 status code
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
