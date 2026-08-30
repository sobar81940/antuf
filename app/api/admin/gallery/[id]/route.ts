import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import GalleryImage from "@/models/GalleryImage";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user?.role === "admin" ? session : null;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const image = await GalleryImage.findByIdAndUpdate(id, { ...body, category: body.category?.toLowerCase() }, { new: true, runValidators: true });
    return image ? NextResponse.json({ success: true, data: image }) : NextResponse.json({ error: "Image not found" }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await isAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    await GalleryImage.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}