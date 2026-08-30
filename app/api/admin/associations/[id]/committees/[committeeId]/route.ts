import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import Committee from "@/models/Committee";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

/**
 * PATCH - Rename / update a committee (admin only).
 */
export async function PATCH(request, context) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { committeeId } = params;

    const body = await request.json();
    const name = body?.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Committee name is required" }, { status: 400 });
    }

    await dbConnect();

    const committee = await Committee.findByIdAndUpdate(
      committeeId,
      {
        $set: {
          name,
          nameEn: body?.nameEn?.trim() ?? "",
          type: body?.type ?? "",
          provinceName: body?.provinceName?.trim() ?? "",
          provinceNameEn: body?.provinceNameEn?.trim() ?? "",
          districtName: body?.districtName?.trim() ?? "",
          districtNameEn: body?.districtNameEn?.trim() ?? "",
          updatedBy: session.user.id || session.user._id,
        },
      },
      { new: true, runValidators: true }
    );

    if (!committee) {
      return NextResponse.json({ error: "Committee not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: committee });
  } catch (error) {
    const status = error.code === 11000 ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? "A committee with this name already exists" : error.message || "Failed to update committee" },
      { status }
    );
  }
}

/**
 * DELETE - Remove a committee (admin only).
 */
export async function DELETE(request, context) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { committeeId } = params;

    await dbConnect();

    const committee = await Committee.findByIdAndDelete(committeeId);
    if (!committee) {
      return NextResponse.json({ error: "Committee not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, msg: "Committee deleted", data: committee });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete committee" },
      { status: 500 }
    );
  }
}