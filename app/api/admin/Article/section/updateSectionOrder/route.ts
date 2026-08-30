import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Articles from "@/models/Articles";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { sections, search } = body;

  try {
    const article = await Articles.findById(search);
    if (!article) {
      return NextResponse.json({ err: "Article not found" });
    }
    await Articles.updateOne({ _id: search }, { $set: { sections } });

    return NextResponse.json(article);
  } catch (error) {
    console.log("Error from POST Route for drag-------", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
