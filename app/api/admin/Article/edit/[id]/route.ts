import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";
import { Types } from "mongoose";

export async function GET(req, context) {
  await dbConnect();

  try {
    const params = await context.params;
    const identifier = decodeURIComponent(params.id);
    const articles = await Articles.findOne(
      Types.ObjectId.isValid(identifier) ? { _id: identifier } : { slug: identifier }
    );
    if (!articles) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    console.log("data gotten from curr course model----", articles);
    return NextResponse.json(articles);
  } catch (error) {
    console.log("error from GET of edit course---", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
