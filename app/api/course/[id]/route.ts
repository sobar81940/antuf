import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Course from "@/models/Curriculum"; // Adjust the model import based on your actual model name

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    console.log('Fetching course with ID:', id);

    const course = await Course.findById(id)
      .select('title description sections')
      .lean();

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { message: "Error fetching course" },
      { status: 500 }
    );
  }
}
