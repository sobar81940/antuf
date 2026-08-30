import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = params;
    
    console.log('Looking for course with slug:', slug);

    // Find course by slug with explicit field selection
    const course = await CurriculumCourse.findOne({ 
      slug: slug 
    })
    .select('title description imageUrl price sections objectives requirements duration level instructor slug')
    .lean<any>();

    if (!course) {
      console.log('Course not found for slug:', slug);
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    console.log('Found course:', {
      title: course.title,
      price: course.price,
      sections: course.sections?.length || 0,
      hasImage: !!course.imageUrl
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course by slug:", error);
    return NextResponse.json(
      { message: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
