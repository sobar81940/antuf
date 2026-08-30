import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Curriculum from "@/models/Curriculum";

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { search, newSection } = body;
    console.log("Stuff that is sent to POST-----", { search, newSection });
    const curriculum = await Curriculum.findById({ _id: search });
    if (!curriculum) {
      return NextResponse.json({ err: "Not found" });
    }
    curriculum.sections.push(newSection);
    const saved = await curriculum.save();
    const newlyAddedSection =
      curriculum.sections[curriculum.sections.length - 1];
    return NextResponse.json({ newlyAddedSection });
  } catch (error) {
    console.log("Error from POST----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
