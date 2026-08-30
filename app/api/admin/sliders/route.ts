import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Slider from "@/models/slider";

// Utility function to clean string inputs
const cleanStringInput = (str) => {
  if (!str) return str;
  return str.replace(/\n/g, '').trim();
};

export async function GET() {
  await dbConnect();

  try {
    const sliders = await Slider.find({}).sort({ createdAt: -1 });
   
    console.log("sliders" , sliders)
    return NextResponse.json(sliders);
  } catch (err) {
     console.log("error", err)
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    // Validate required fields
    if (!body.image) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Validate image URL format
    try {
      new URL(body.image);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      );
    }

    // Create the slider with cleaned data
    const slider = await Slider.create({
      image: cleanStringInput(body.image),
      title: cleanStringInput(body.title),
      sub_title: cleanStringInput(body.sub_title),
      short_description: cleanStringInput(body.short_description),
      button_link: cleanStringInput(body.button_link),
      status: body.status || true
    });

    return NextResponse.json({
      success: true,
      data: slider,
      message: "Slider created successfully"
    });
  } catch (error) {
    console.error("Error creating slider:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create slider",
        message: "Failed to create slider"
      },
      { status: 500 }
    );
  }
}