import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";

export async function POST() {
  await dbConnect();

  try {
    // Update all demo articles to published status
    const result = await Articles.updateMany(
      { status: "draft" },
      { 
        $set: { 
          status: "published",
          publishedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      message: "Demo articles published successfully",
      modified: result.modifiedCount
    });
  } catch (error) {
    console.error("Error publishing articles:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
