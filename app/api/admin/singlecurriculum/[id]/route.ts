import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Curriculum from "@/models/Curriculum";

export async function GET(req, context) {
  await dbConnect();
  try {
    const params = await context.params;
    const curriculum = await Curriculum.findOne({ _id: params.id });
    console.log("Object sent to GET-----", curriculum);
    return NextResponse.json(curriculum);
  } catch (error) {
    console.log("ERROR FROM GET-------", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
