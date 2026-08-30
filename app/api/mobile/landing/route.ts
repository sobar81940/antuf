import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Slider from "@/models/slider";
import Video from "@/models/video";
import Articles from "@/models/Articles";

export async function GET() {
  try {
    await dbConnect();

    // Parallelize the data fetching
    const [sliders, videos, posts] = await Promise.all([
      // Fetch active sliders
      Slider.find({ status: true })
        .sort({ createdAt: -1 })
        .lean(),

      // Fetch active videos
      Video.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
        
      // Fetch featured/latest posts for slider
      Articles.find({ 
        status: "published",
        isFeatured: true 
      })
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('title slug featureImage excerpt publishedAt authorName')
      .lean()
    ]);

    // If no featured posts found, fall back to latest published posts
    let finalPosts = posts;
    if (!posts || posts.length === 0) {
       finalPosts = await Articles.find({ status: "published" })
        .sort({ publishedAt: -1 })
        .limit(5)
        .select('title slug featureImage excerpt publishedAt authorName')
        .lean();
    }

    return NextResponse.json({
      success: true,
      data: {
        sliders,
        videos,
        posts: finalPosts
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });

  } catch (error) {
    console.error("[API_MOBILE_LANDING] Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error",
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}
