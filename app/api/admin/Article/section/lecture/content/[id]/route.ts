import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Articles from "@/models/Articles";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id } = params;

    console.log("Received PUT request:", {
      id,
      body,
    });

    const { lecturebody, sectionId, search } = body;

    // Validate required fields
    if (!id || !sectionId || !search || !lecturebody) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    const article = await Articles.findById(search);
    if (!article) {
      return NextResponse.json({
        error: "Article not found in PUT for lecture",
        status: 404,
      });
    }

    const section = article.sections.id(sectionId);
    if (!section) {
      return NextResponse.json({
        error: "Section not found",
        status: 404,
      });
    }

    const lectureIndex = section.lectures.findIndex(
      (lecture) => lecture?._id.toString() === id
    );

    if (lectureIndex === -1) {
      return NextResponse.json({
        error: "Lecture not found!",
        status: 404,
      });
    }

    // Update lecture content
    section.lectures[lectureIndex] = lecturebody;
    await article.save();

    console.log("Lecture content updated successfully");
    return NextResponse.json({
      message: "Lecture updated successfully",
      article,
    });
  } catch (error) {
    console.error("Error updating lecture content:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
