import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();
  const { updatedSection, search } = body;
  console.log("Data received at PUT------", body);
  try {
    const curriculum = await Curriculum.findById(search);
    if (!curriculum) {
      return NextResponse.json({ err: "From PUT, Curriculum not found" });
    }

    const sectionIndex = curriculum.sections.findIndex(
      (section) => section?._id.toString() === context?.params?.id.toString()
    );

    if (sectionIndex === -1) {
      return NextResponse.json({ err: "Section not found" });
    }

    curriculum.sections[sectionIndex] = updatedSection;
    await curriculum.save();

    return NextResponse.json(curriculum);
  } catch (error) {
    console.log("Error from PUT req-----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  const body = await req.json();
  try {
    const curriculum = await Curriculum.findById(body);
    if (!curriculum) {
      return NextResponse.json({ err: "Error-Not found" });
    }
    curriculum.sections = curriculum.sections.filter(
      (section) => section?._id.toString() !== context?.params?.id.toString()
    );

    await curriculum.save();
    return NextResponse.json(curriculum);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
