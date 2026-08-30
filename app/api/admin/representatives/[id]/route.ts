import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import Representative from "@/models/Representative";

// GET /api/admin/representatives/[id] - Get single representative (admin only)
export async function GET(request, context) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        await dbConnect();

        // Await params in Next.js 13+
        const params = await context.params;
        const representative = await Representative.findById(params.id)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .lean();

        if (!representative) {
            return NextResponse.json(
                { error: "Representative not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: representative,
        });
    } catch (error) {
        console.error("Error fetching representative:", error);
        return NextResponse.json(
            { error: "Failed to fetch representative", details: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/admin/representatives/[id] - Update representative (admin only)
export async function PUT(request, context) {
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

        // Await params in Next.js 13+
        const params = await context.params;

        // Remove fields that shouldn't be updated directly
        delete body._id;
        delete body.createdBy;
        delete body.createdAt;

        // Update representative
        const representative = await Representative.findByIdAndUpdate(
            params.id,
            {
                ...body,
                updatedBy: session.user.id,
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email");

        if (!representative) {
            return NextResponse.json(
                { error: "Representative not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Representative updated successfully",
            data: representative,
        });
    } catch (error) {
        console.error("Error updating representative:", error);

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
            { error: "Failed to update representative", details: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/representatives/[id] - Soft delete representative (admin only)
export async function DELETE(request, context) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        await dbConnect();

        // Await params in Next.js 13+
        const params = await context.params;

        // Soft delete by setting isActive to false
        const representative = await Representative.findByIdAndUpdate(
            params.id,
            {
                isActive: false,
                updatedBy: session.user.id,
            },
            { new: true }
        );

        if (!representative) {
            return NextResponse.json(
                { error: "Representative not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Representative deleted successfully",
            data: representative,
        });
    } catch (error) {
        console.error("Error deleting representative:", error);
        return NextResponse.json(
            { error: "Failed to delete representative", details: error.message },
            { status: 500 }
        );
    }
}
