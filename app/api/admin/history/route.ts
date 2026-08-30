import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import HistoryPage from "@/models/HistoryPage";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user?.role === "admin" ? session : null;
}

export async function GET() {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const page = await HistoryPage.findOne({ isActive: true });
    return NextResponse.json({ success: true, data: page || await HistoryPage.create({}) });
}

export async function PUT(request: Request) {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        await dbConnect();
        const body = await request.json();
        const page = await HistoryPage.findOneAndUpdate(
            { isActive: true },
            { ...body, updatedBy: session.user.id },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        return NextResponse.json({ success: true, data: page });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save history page", details: error.message }, { status: 500 });
    }
}