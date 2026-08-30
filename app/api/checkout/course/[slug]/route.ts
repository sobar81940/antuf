import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";

export async function GET(req, context) {
  await dbConnect();

  try {
    const curriculums = await CurriculumCourse.find({
      slug: context?.params?.slug,
    });
    return NextResponse.json(curriculums);
  } catch (error) {
    console.log("Error from GET of fetchContent of Checkout---", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
