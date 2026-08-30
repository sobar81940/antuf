import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";
import "@/models/subcategory"; // Ensure SubCategory model is registered for populate()

export async function GET(request) {
  await dbConnect();

  // Parse query params
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");

  // Default limit 6, max limit if 'all' or high number
  let limit = 6;
  if (limitParam === 'all') {
    limit = 0; // 0 means no limit in mongoose (or very high)
  } else if (limitParam) {
    limit = parseInt(limitParam) || 6;
  }

  try {
    let query = Articles.find({ status: "published" })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const article = await query;
    return NextResponse.json(article);
  } catch (error) {
    console.log("Error from GET of articles--", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
