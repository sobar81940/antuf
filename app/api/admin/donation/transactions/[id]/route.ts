import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import DonationTransaction from "@/models/DonationTransaction";

export async function PATCH(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { status } = await request.json();
        const { id } = await params;
        if (!["pending", "approved", "rejected"].includes(status)) {
            return NextResponse.json({ error: "Invalid transaction status" }, { status: 400 });
        }

        await dbConnect();
        const transaction = await DonationTransaction.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );
        if (!transaction) {
            return NextResponse.json({ error: "Donation receipt not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: transaction });
    } catch (error) {
        console.error("Error updating donation transaction:", error);
        return NextResponse.json({ error: "Failed to update donation transaction" }, { status: 500 });
    }
}