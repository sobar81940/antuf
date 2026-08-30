import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Video from "@/models/video";

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find({}).sort({ createdAt: -1 });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    console.log("Received video data:", JSON.stringify(body, null, 2));

    // Validate required fields with better error messages
    if (!body.title || !body.title.trim()) {
      console.error("Title validation failed:", body.title);
      return NextResponse.json(
        { error: "Title is required and cannot be empty" },
        { status: 400 }
      );
    }

    if (!body.url || !body.url.trim()) {
      console.error("URL validation failed:", body.url);
      return NextResponse.json(
        { error: "Video URL is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Validate YouTube URL format
    if (!body.url.includes("youtube.com") && !body.url.includes("youtu.be")) {
      console.error("Invalid YouTube URL:", body.url);
      return NextResponse.json(
        { error: "URL must be a valid YouTube video link" },
        { status: 400 }
      );
    }

    // Create video data - only include these fields
    const videoData = {
      title: body.title.trim(),
      url: body.url.trim(),
      isActive: body.isActive !== false,
    };

    console.log("Creating video with data:", JSON.stringify(videoData, null, 2));

    // Create and save the video
    const video = await Video.create(videoData);

    console.log("Video created successfully:", video);
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      
      // Check for stale index on external_video_id (should not happen in current schema)
      if (duplicateField === 'external_video_id') {
        console.error("STALE INDEX DETECTED: external_video_id_1 index exists but field is not in schema");
        console.error("To fix: db.videos.dropIndex('external_video_id_1')");
        return NextResponse.json(
          { error: "Database index error: stale 'external_video_id' index detected. Drop it in MongoDB. See logs for details." },
          { status: 500 }
        );
      }
      
      // Generic duplicate error for other fields
      return NextResponse.json(
        { error: `Video already exists (duplicate: ${duplicateField})` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to create video" },
      { status: 500 }
    );
  }
}
