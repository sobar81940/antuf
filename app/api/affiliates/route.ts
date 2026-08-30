import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Affiliate from "@/models/Affiliate";

// GET /api/affiliates - Public endpoint for fetching active affiliates
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "100");
        const category = searchParams.get("category") || "";

        const query: Record<string, any> = { isActive: true };
        if (category) {
            query.category = category;
        }

        const affiliates = await Affiliate.find(query)
            .sort({ displayOrder: 1, createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json(
            {
                success: true,
                data: affiliates,
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                },
            }
        );
    } catch (error) {
        console.error("Error fetching affiliates:", error);
        return NextResponse.json(
            { error: "Failed to fetch affiliates", details: error.message },
            { status: 500 }
        );
    }
}
