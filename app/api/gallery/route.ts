import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import GalleryImage from "@/models/GalleryImage";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const category = new URL(request.url).searchParams.get("category");
        const filter: Record<string, any> = { isPublished: true };
        if (category) filter.category = category.toLowerCase();
        const images = await GalleryImage.find(filter).sort({ order: 1, createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: images });
    } catch (error) {
        return NextResponse.json({ error: "Failed to load gallery", details: error.message }, { status: 500 });
    }
}