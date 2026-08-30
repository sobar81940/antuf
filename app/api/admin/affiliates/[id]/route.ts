import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import Affiliate from "@/models/Affiliate";

// GET /api/admin/affiliates/[id] - Get single affiliate
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        await dbConnect();

        const affiliate = await Affiliate.findById(params.id);

        if (!affiliate) {
            return NextResponse.json(
                { error: "Affiliate not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: affiliate,
        });
    } catch (error) {
        console.error("Error fetching affiliate:", error);
        return NextResponse.json(
            { error: "Failed to fetch affiliate", details: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/admin/affiliates/[id] - Update affiliate
export async function PUT(request, { params }) {
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

        const affiliate = await Affiliate.findByIdAndUpdate(
            params.id,
            {
                ...body,
                updatedBy: session.user.id,
            },
            { new: true, runValidators: true }
        );

        if (!affiliate) {
            return NextResponse.json(
                { error: "Affiliate not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Affiliate updated successfully",
            data: affiliate,
        });
    } catch (error) {
        console.error("Error updating affiliate:", error);
        return NextResponse.json(
            { error: "Failed to update affiliate", details: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/affiliates/[id] - Soft delete affiliate
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        await dbConnect();

        const affiliate = await Affiliate.findByIdAndUpdate(
            params.id,
            {
                isActive: false,
                updatedBy: session.user.id,
            },
            { new: true }
        );

        if (!affiliate) {
            return NextResponse.json(
                { error: "Affiliate not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Affiliate deleted successfully",
            data: affiliate,
        });
    } catch (error) {
        console.error("Error deleting affiliate:", error);
        return NextResponse.json(
            { error: "Failed to delete affiliate", details: error.message },
            { status: 500 }
        );
    }
}
