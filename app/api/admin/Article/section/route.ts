import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { search, newSection } = body;
    console.log("Stuff that is sent to POST-----", { search, newSection });
    const article = await Articles.findById({ _id: search });
    if (!article) {
      return NextResponse.json({ err: "Not found" });
    }
    article.sections.push(newSection);
    const saved = await article.save();
    const newlyAddedSection =
      article.sections[article.sections.length - 1];
    return NextResponse.json({ newlyAddedSection });
  } catch (error) {
    console.log("Error from POST----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
