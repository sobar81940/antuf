import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Slider from "@/models/slider";
import Video from "@/models/video";
import Articles from "@/models/Articles";
import Activity from "@/models/Activity";
import EventCalendar from "@/models/eventCalendar";
import GalleryImage from "@/models/GalleryImage";
import Document from "@/models/Document";
import Affiliate from "@/models/Affiliate";
import Representative from "@/models/Representative";
import HistoryPage from "@/models/HistoryPage";

export async function GET() {
  try {
    await dbConnect();

    const [
      sliders,
      videos,
      posts,
      activities,
      events,
      gallery,
      documents,
      affiliates,
      representatives,
      historyPage,
    ] = await Promise.all([
      Slider.find({ status: true })
        .select("image title sub_title short_description button_link")
        .sort({ createdAt: -1, _id: -1 })
        .limit(5)
        .lean(),

      Video.find({ isActive: true })
        .select("title url")
        .sort({ createdAt: -1, _id: -1 })
        .limit(5)
        .lean(),

      Articles.find({
        status: "published",
        isFeatured: true,
      })
        .select("title slug featureImage excerpt publishedAt authorName")
        .sort({ publishedAt: -1, _id: -1 })
        .limit(5)
        .lean(),

      Activity.find({
        status: { $in: ["ongoing", "upcoming", "planned"] },
      })
        .select(
          "title description category date status image location organizer",
        )
        .sort({ createdAt: -1, _id: -1 })
        .limit(6)
        .lean(),

      EventCalendar.find({
        isPublished: true,
        status: { $in: ["upcoming", "ongoing"] },
      })
        .select(
          "title titleNepali description descriptionNepali startDate endDate time location locationNepali category image status isFeatured",
        )
        .sort({ startDate: 1, _id: 1 })
        .limit(6)
        .lean(),

      GalleryImage.find({ isPublished: true })
        .select("image title caption category order")
        .sort({ order: 1, createdAt: -1, _id: 1 })
        .limit(8)
        .lean(),

      Document.find({ isPublished: true })
        .select(
          "title titleNepali category fileUrl fileName fileType fileSize createdAt",
        )
        .sort({ displayOrder: 1, createdAt: -1, _id: 1 })
        .limit(6)
        .lean(),

      Affiliate.find({ isActive: true })
        .select(
          "name nameEn category categoryNp logo description members location website established",
        )
        .sort({ displayOrder: 1, createdAt: -1, _id: 1 })
        .limit(6)
        .lean(),

      Representative.find({ isActive: true })
        .select(
          "name nameEn position positionEn location locationEn image bio bioEn website facebook twitter linkedin instagram",
        )
        .sort({ displayOrder: 1, createdAt: -1, _id: 1 })
        .limit(6)
        .lean(),

      HistoryPage.findOne({ isActive: true })
        .select(
          "headerTitle headerTitleEn headerSubtitle intro stats milestones visionTitle vision",
        )
        .sort({ updatedAt: -1, _id: -1 })
        .lean<any>(),
    ]);

    let finalPosts = posts;
    if (!posts || posts.length === 0) {
      finalPosts = await Articles.find({ status: "published" })
        .select("title slug featureImage excerpt publishedAt authorName")
        .sort({ publishedAt: -1, _id: -1 })
        .limit(5)
        .lean();
    }

    const history = historyPage
      ? {
          ...historyPage,
          stats: historyPage.stats?.map((stat) => ({
            value: stat.value,
            label: stat.label,
            description: stat.description,
          })),
          milestones: historyPage.milestones?.map((milestone) => ({
            year: milestone.year,
            title: milestone.title,
            description: milestone.description,
          })),
        }
      : null;

    return NextResponse.json(
      {
        success: true,
        data: {
          sliders,
          videos,
          posts: finalPosts,
          activities,
          events,
          gallery,
          documents,
          affiliates,
          representatives,
          history,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("[API_MOBILE_LANDING] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
