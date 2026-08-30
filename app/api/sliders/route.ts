import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Slider from "@/models/slider";

export async function GET() {
  try {
    console.log("[API] Starting slider fetch...");
    console.log("[API] Database URL configured:", !!process.env.DB_URL);
    
    await dbConnect();
    console.log("[API] Database connected successfully");

    const sliders = await Slider.find({}).sort({ createdAt: -1 });
    console.log(`[API] Found ${sliders.length} sliders`);

    return NextResponse.json(sliders, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error("[API] Error fetching sliders:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      dbUrlConfigured: !!process.env.DB_URL,
    });
    
    return NextResponse.json(
      { 
        error: error.message,
        type: error.name,
        timestamp: new Date().toISOString(),
      }, 
      { status: 500 }
    );
  }
}