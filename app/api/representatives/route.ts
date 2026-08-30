import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Representative from "@/models/Representative";

// GET /api/representatives - Public endpoint for fetching active representatives
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit")) || 100;
        const orderBy = searchParams.get("orderBy") || "displayOrder";

        // Only fetch active representatives
        const representatives = await Representative.find({ isActive: true })
            .sort({ [orderBy]: 1, createdAt: -1 })
            .limit(limit)
            .select("-createdBy -updatedBy -__v")
            .lean();

        return NextResponse.json(
            {
                success: true,
                data: representatives,
                count: representatives.length,
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                },
            }
        );
    } catch (error) {
        console.error("Error fetching representatives:", error);
        return NextResponse.json(
            { error: "Failed to fetch representatives", details: error.message },
            { status: 500 }
        );
    }
}
