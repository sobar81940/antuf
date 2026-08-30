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
 * POST - Set the member list of a committee (admin only).
 * Body: { memberIds: string[], memberDetails?: { member: string, position: string }[] }
 */
export async function POST(request, context) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const params = await context.params;
    const { committeeId } = params;

    const { memberIds, memberDetails = [] } = await request.json();
    if (!Array.isArray(memberIds)) {
      return NextResponse.json({ error: "memberIds must be an array" }, { status: 400 });
    }
    if (!Array.isArray(memberDetails)) {
      return NextResponse.json({ error: "memberDetails must be an array" }, { status: 400 });
    }

    await dbConnect();

    const committee = await Committee.findByIdAndUpdate(
      committeeId,
      {
        $set: {
          members: memberIds,
          memberDetails,
          updatedBy: session.user.id || session.user._id,
        },
      },
      { new: true, runValidators: true }
    ).populate("members", "name email image").populate("memberDetails.member", "name email image");

    if (!committee) {
      return NextResponse.json({ error: "Committee not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: committee });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update committee members" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove a single member from a committee (admin only).
 * Body: { memberId: string }
 */
export async function DELETE(request, context) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { committeeId } = params;

    const { memberId } = await request.json();
    if (!memberId) {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 });
    }

    await dbConnect();

    const committee = await Committee.findByIdAndUpdate(
      committeeId,
      {
        $pull: { members: memberId, memberDetails: { member: memberId } },
        $set: { updatedBy: session.user.id || session.user._id },
      },
      { new: true }
    ).populate("members", "name email image").populate("memberDetails.member", "name email image");

    if (!committee) {
      return NextResponse.json({ error: "Committee not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: committee });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to remove member" },
      { status: 500 }
    );
  }
}
