import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { sections, search } = body;

  try {
    const curriculum = await CurriculumCourse.findById(search);
    if (!curriculum) {
      return NextResponse.json({ err: "Curriculum not found" });
    }

    await CurriculumCourse.updateOne({ _id: search }, { $set: { sections } });
    return NextResponse.json(curriculum);
  } catch (error) {
    console.log("Error from POST for lecture drag----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
