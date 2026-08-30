import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";

export async function GET(req, context) {
  await dbConnect();

  try {
    const curriculumCourse = await CurriculumCourse.findOne({
      _id: context?.params?.id,
    });
    console.log("data gotten from curr course model----", curriculumCourse);
    return NextResponse.json(curriculumCourse);
  } catch (error) {
    console.log("error from GET of edit course---", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
