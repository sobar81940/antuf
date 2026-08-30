import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Video from "@/models/video";

// Public endpoint to fetch active videos (no auth required)
export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
