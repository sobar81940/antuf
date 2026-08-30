import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";

export async function GET(req, context) {
  await dbConnect();

  // Await params to handle the Promise in Next.js 15+
  const params = await context.params;
  const slug = params?.slug;
  
  if (!slug || typeof slug !== "string") {
    return NextResponse.json(
      { err: "Invalid or missing slug parameter" },
      { status: 400 }
    );
  }

  // Check if the slug is an image file or other non-curriculum resource
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'];
  const isImageFile = imageExtensions.some(ext => slug.toLowerCase().endsWith(ext));
  
  if (isImageFile) {
    return NextResponse.json(
      { err: "This endpoint is for curriculum data, not image files" },
      { status: 404 }
    );
  }
  console.log("path sent to route---", slug);
  try {
    let curriculum = await Curriculum.findOne({
      "sections.lectures.slug": slug,
    });
    if (!curriculum) {
      curriculum = await Curriculum.findOne({ slug });
      if (!curriculum) {
        return NextResponse.json(
          { err: "Curriculum not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(curriculum);
  } catch (error) {
    console.log("Error in accordion GET route-----", error);
    return NextResponse.json(
      { err: "Error fetching curriculum" },
      { status: 500 }
    );
  }
}
