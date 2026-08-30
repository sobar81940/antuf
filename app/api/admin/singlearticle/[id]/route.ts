import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Articles from "@/models/Articles";

export async function GET(req, context) {
  await dbConnect();
  try {
    const params = await context.params;
    const article = await Articles.findOne({ _id: params.id });
    console.log("Object sent to GET-----", article);
    return NextResponse.json(article);
  } catch (error) {
    console.log("ERROR FROM GET-------", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
