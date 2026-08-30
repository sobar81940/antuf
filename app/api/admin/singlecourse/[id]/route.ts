import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";

export async function GET(req, context) {
  await dbConnect();

  const curriculums = await CurriculumCourse.findOne({
    _id: context?.params?.id,
  });

  return NextResponse.json(curriculums);

  try {
  } catch (error) {
    console.log("Error from GET of single course----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
