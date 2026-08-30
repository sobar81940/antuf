import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";
import slugify from "slugify";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const slug = slugify(body.title);
    body.slug = slug;
    const article = await Articles.create(body);
    console.log("Body from POST---", article);
    return NextResponse.json(article);
  } catch (error) {
    console.log("Error from POST of course curriculum--", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const article = await Articles.find({});
    console.log(article);
    return NextResponse.json(article);
  } catch (error) {
    console.log("Error from GET of curr of course--", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
