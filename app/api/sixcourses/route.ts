import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";

export async function GET() {
  await dbConnect();

  try {
    const curriculums = await CurriculumCourse.find({})
      .sort({ createdAt: -1 })
      .limit(6);
    return NextResponse.json(curriculums);
  } catch (error) {
    console.log("Error from GET of sixcourses--", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
