import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";

import slugify from "slugify";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { newLecture, search, sectionId } = body;

  try {
    const curriculum = await CurriculumCourse.findById(search);
    if (!curriculum) {
      return NextResponse.json(
        { err: "Curriculum not found from DB" },
        { status: 500 }
      );
    }
    const section = curriculum.sections.id(sectionId);
    if (!section) {
      return NextResponse.json(
        { err: "Section not found from DB" },
        { status: 500 }
      );
    }

    const slug = slugify(newLecture?.title);
    section.lectures.push({ ...newLecture, slug });
    await curriculum.save();
    const newlyAddedLecture = section.lectures[section.lectures.length - 1];

    return NextResponse.json(newlyAddedLecture);
  } catch (error) {
    console.log("Error from POST-----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
