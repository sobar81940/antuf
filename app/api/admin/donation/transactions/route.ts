import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import DonationTransaction from "@/models/DonationTransaction";

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user?.role === "admin" ? session : null;
}

export async function GET() {
    try {
        if (!(await requireAdmin())) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const transactions = await DonationTransaction.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: transactions });
    } catch (error) {
        console.error("Error fetching donation transactions:", error);
        return NextResponse.json({ error: "Failed to fetch donation transactions" }, { status: 500 });
    }
}