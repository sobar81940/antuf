import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CurriculumCourse from "@/models/CurriculumCourse";
import { Boy, TrySharp } from "@mui/icons-material";

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();

  try {
    const updateFields: Record<string, any> = {};
    if (body.title) updateFields.title = body.title;
    if (body.about) updateFields.about = body.about;
    if (body.description) updateFields.description = body.description;
    if (body.imageUrl) updateFields.imageUrl = body.imageUrl;
    if (body.level) updateFields.level = body.level;
    if (body.videoUrl) updateFields.videoUrl = body.videoUrl;
    if (body.price) updateFields.price = body.price;

    const curriculumCourse = await CurriculumCourse.findByIdAndUpdate(
      context?.params?.id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("curriculum course from PUT", curriculumCourse);
    return NextResponse.json(curriculumCourse);
  } catch (error) {
    console.log("error from PUT for curr course----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  try {
    const curriculumCourse = await CurriculumCourse.findByIdAndDelete(
      context?.params?.id
    );
    console.log("Curr delete course--", curriculumCourse);
    return NextResponse.json(curriculumCourse);
  } catch (error) {
    console.log("Error from DELETE for curr course---", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
