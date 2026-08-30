import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import GalleryImage from "@/models/GalleryImage";

async function adminSession() {
    const session = await getServerSession(authOptions);
    return session?.user?.role === "admin" ? session : null;
}

export async function GET() {
    const session = await adminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    return NextResponse.json({ success: true, data: await GalleryImage.find().sort({ category: 1, order: 1, createdAt: -1 }) });
}

export async function POST(request: Request) {
    const session = await adminSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        await dbConnect();
        const body = await request.json();
        const image = await GalleryImage.create({ ...body, category: body.category?.toLowerCase(), createdBy: session.user.id });
        return NextResponse.json({ success: true, data: image }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create gallery image", details: error.message }, { status: 500 });
    }
}