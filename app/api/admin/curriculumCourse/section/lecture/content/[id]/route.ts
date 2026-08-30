import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();
  const id = context?.params?.id;
  console.log("Stuff sent to PUT----", body);
  try {
    const { lecturebody, sectionId, search } = body;
    const curriculum = await CurriculumCourse.findById(search);
    if (!curriculum) {
      return NextResponse.json({
        err: "Curriculum not found in PUT for lecture",
      });
    }

    const section = curriculum.sections.id(sectionId);
    if (!section) {
      return NextResponse.json({ err: "Section not found" });
    }
    const lectureIndex = section.lectures.findIndex(
      (Lecture) => Lecture?._id.toString() === id.toString()
    );
    if (lectureIndex === -1) {
      return NextResponse.json({ err: "Lecture index not found!" });
    }
    section.lectures[lectureIndex] = lecturebody;
    await curriculum.save();
    console.log("Lecture content saved successfully");
    return NextResponse.json(section.lectures[lectureIndex]);
  } catch (error) {
    console.log("Error from PUT for content-----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
