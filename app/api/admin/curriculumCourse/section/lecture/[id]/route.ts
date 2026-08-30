import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";
import slugify from "slugify";

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();
  const { updatedSection, sectionId, search } = body;
  const id = context?.params?.id;

  try {
    const curriculum = await CurriculumCourse.findById(search);
    if (!curriculum) {
      return NextResponse.json({ err: "Curriculum not found" });
    }
    const section = curriculum.sections.id(sectionId);
    const lectureIndex = section?.lectures.findIndex(
      (Lecture) => Lecture?._id.toString() === id.toString()
    );
    if (lectureIndex === -1) {
      return NextResponse.json({ err: "Lecture not found" });
    }
    const slug = slugify(updatedSection?.title);
    updatedSection.slug = slug;
    section.lectures[lectureIndex] = updatedSection;
    await curriculum.save();
    return NextResponse.json(curriculum);
  } catch (error) {
    console.log("Error from PUT for Lecture Part-----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  const body = await req.json();
  try {
    const { sectionId, search } = body;
    const curriculum = await CurriculumCourse.findById(search);
    if (!curriculum) {
      return NextResponse.json({ err: "Curriculum not found" });
    }
    const section = curriculum.sections.id(sectionId);
    if (!section) {
      return NextResponse.json({ err: "Section not found" });
    }
    section.lectures = section.lectures.filter((Lecture) => {
      Lecture?._id.toString() !== context?.params?.id.toString();
    });
    await curriculum.save();

    return NextResponse.json(curriculum);
  } catch (error) {
    console.log("error from DELETE----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
