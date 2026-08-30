import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import Affiliate from "@/models/Affiliate";

// GET /api/admin/affiliates - List all affiliates
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const isActive = searchParams.get("isActive");

        const skip = (page - 1) * limit;

        // Build query
        const query: Record<string, any> = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { nameEn: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }
        if (category) {
            query.category = category;
        }
        if (isActive !== null && isActive !== undefined && isActive !== "") {
            query.isActive = isActive === "true";
        }

        const [affiliates, total] = await Promise.all([
            Affiliate.find(query)
                .sort({ displayOrder: 1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Affiliate.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: affiliates,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching affiliates:", error);
        return NextResponse.json(
            { error: "Failed to fetch affiliates", details: error.message },
            { status: 500 }
        );
    }
}

// POST /api/admin/affiliates - Create new affiliate
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await request.json();

        const affiliate = await Affiliate.create({
            ...body,
            createdBy: session.user.id,
            updatedBy: session.user.id,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Affiliate created successfully",
                data: affiliate,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating affiliate:", error);
        return NextResponse.json(
            { error: "Failed to create affiliate", details: error.message },
            { status: 500 }
        );
    }
}
