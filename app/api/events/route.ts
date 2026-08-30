import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import EventCalendar from "@/models/eventCalendar";

export async function GET(request) {
    try {
        await dbConnect();
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const category = searchParams.get("category");
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const featured = searchParams.get("featured");

        const query: Record<string, any> = { isPublished: true };

        if (category && category !== 'all') query.category = category;
        if (status && status !== 'all') query.status = status;
        if (featured === "true") query.isFeatured = true;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { titleNepali: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const events = await EventCalendar.find(query)
            .select("title titleNepali description descriptionNepali startDate endDate time location image category status capacity registeredCount isFeatured")
            .skip(skip)
            .limit(limit)
            .sort({ startDate: 1 });

        const total = await EventCalendar.countDocuments(query);

        return NextResponse.json(
            {
                success: true,
                data: events,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
                },
            }
        );
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch events" },
            { status: 500 }
        );
    }
}
