import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcrypt";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import Committee from "@/models/Committee";
import User from "@/models/user";

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

    const body = await request.json();
    const { memberIds = [], memberDetails = [], customMember } = body;
    if (!Array.isArray(memberIds)) {
      return NextResponse.json({ error: "memberIds must be an array" }, { status: 400 });
    }
    if (!Array.isArray(memberDetails)) {
      return NextResponse.json({ error: "memberDetails must be an array" }, { status: 400 });
    }

    await dbConnect();

    let customUserId = null;
    if (customMember?.email) {
      const email = String(customMember.email).trim().toLowerCase();
      const name = String(customMember.name || email.split("@")[0]).trim();
      const position = String(customMember.position || "सदस्य").trim();
      const image = customMember.image || "";
      let existingUser = await User.findOne({ email });

      if (!existingUser) {
        existingUser = await User.create({
          name,
          email,
          phone: customMember.phone || "",
          image,
          password: await bcrypt.hash("defaultPassword123", 10),
          role: "user",
          isActive: true,
          organization: customMember.organization || "",
          committeeLevel: customMember.committeeLevel || "",
          committeeName: customMember.committeeName || "",
          committeeLocation: customMember.committeeLocation || "",
          committeePosition: position,
        });
      }

      customUserId = existingUser._id.toString();
      if (!memberIds.includes(customUserId)) {
        memberIds.push(customUserId);
      }
      const existingDetailIndex = memberDetails.findIndex(
        (detail) => (detail.member?._id || detail.member)?.toString() === customUserId
      );
      if (existingDetailIndex === -1) {
        memberDetails.push({ member: customUserId, position });
      }
    }

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
