import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import Representative from "@/models/Representative";

// GET /api/admin/representatives - List all representatives (admin only)
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
        const search = searchParams.get("search") || "";
        const isActive = searchParams.get("isActive");
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query: Record<string, any> = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { nameEn: { $regex: search, $options: "i" } },
                { position: { $regex: search, $options: "i" } },
                { positionEn: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (isActive !== null && isActive !== undefined && isActive !== "") {
            query.isActive = isActive === "true";
        }

        // Get total count
        const total = await Representative.countDocuments(query);

        // Get representatives with pagination
        const representatives = await Representative.find(query)
            .sort({ displayOrder: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .lean();

        return NextResponse.json({
            success: true,
            data: representatives,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching representatives:", error);
        return NextResponse.json(
            { error: "Failed to fetch representatives", details: error.message },
            { status: 500 }
        );
    }
}

// POST /api/admin/representatives - Create new representative (admin only)
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

        // Validate required fields
        const requiredFields = ["name", "nameEn", "position", "positionEn", "email", "phone"];
        const missingFields = requiredFields.filter((field) => !body[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    missingFields,
                },
                { status: 400 }
            );
        }

        // Create new representative
        const representative = await Representative.create({
            ...body,
            createdBy: session.user.id,
            updatedBy: session.user.id,
        });

        // Populate created/updated by fields
        await representative.populate("createdBy", "name email");
        await representative.populate("updatedBy", "name email");

        return NextResponse.json(
            {
                success: true,
                message: "Representative created successfully",
                data: representative,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating representative:", error);

        if (error.name === "ValidationError") {
            return NextResponse.json(
                {
                    error: "Validation error",
                    details: Object.values(error.errors).map((err: any) => err.message),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create representative", details: error.message },
            { status: 500 }
        );
    }
}
