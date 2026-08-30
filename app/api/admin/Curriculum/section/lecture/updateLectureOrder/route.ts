import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Curriculum from "@/models/Curriculum";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { sections, search } = body;

  try {
    const curriculum = await Curriculum.findById(search);
    if (!curriculum) {
      return NextResponse.json({ err: "Curriculum not found" });
    }

    await Curriculum.updateOne({ _id: search }, { $set: { sections } });
    return NextResponse.json(curriculum);
  } catch (error) {
    console.log("Error from POST for lecture drag----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
