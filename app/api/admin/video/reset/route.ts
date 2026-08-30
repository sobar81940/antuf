import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect();

    // Drop the old Video collection if it exists
    try {
      await mongoose.connection.collection("videos").drop();
      console.log("Dropped old videos collection");
    } catch (e) {
      console.log("Videos collection did not exist or error dropping it");
    }

    return NextResponse.json({
      success: true,
      message: "Videos collection dropped. It will be recreated on next video creation.",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to drop collection" },
      { status: 500 }
    );
  }
}
