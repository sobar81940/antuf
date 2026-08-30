import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Video from "@/models/video";

export async function PUT(req, context) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("Received update data:", body);

    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const updateData = {
      title: body.title.trim(),
      url: body.url || undefined,
      isActive: body.isActive !== false,
      updatedAt: new Date(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const video = await Video.findByIdAndUpdate(
      context.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    console.log("Updated video:", video);
    return NextResponse.json(video);
  } catch (error) {
    console.error("Update error:", error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      
      // Check for stale index on external_video_id (should not happen in current schema)
      if (duplicateField === 'external_video_id') {
        console.error("STALE INDEX DETECTED: external_video_id_1 index exists but field is not in schema");
        console.error("To fix: db.videos.dropIndex('external_video_id_1')");
        return NextResponse.json(
          { error: "Database index error. Please contact administrator. (Reference: external_video_id index)" },
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
      { error: error.message || "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    await dbConnect();

    const video = await Video.findByIdAndDelete(context.params.id);

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    console.log("Deleted video:", video);
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete video" },
      { status: 500 }
    );
  }
}

export async function GET(req, context) {
  try {
    await dbConnect();

    const video = await Video.findById(context.params.id);

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch video" },
      { status: 500 }
    );
  }
}
