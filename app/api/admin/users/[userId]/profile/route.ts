import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

/**
 * GET - Fetch specific user profile by ID (admin only)
 */
export async function GET(req, context) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await User.findById(session.user._id);
    if (!admin || (admin.role !== "admin" && !admin.isAdmin)) {
      return NextResponse.json({ err: "Access denied. Admin only." }, { status: 403 });
    }

    const params = await context.params;
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ err: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(userId).select(
      "name email image phone address city state country zipCode bio isActive role createdAt updatedAt motherName fatherName citizenshipNumber district citizenshipFront citizenshipBack permanentAddresses professionalAssociation committeeLevel committeeName committeeLocation committeePosition"
    );

    if (!user) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }

    // Clean image data
    const userObj = user.toObject();
    if (userObj.image === "https://placehold.co/600x400" || !userObj.image) {
      userObj.image = null;
    }

    console.log(`✓ User profile fetched by admin: ${userId}`);

    return NextResponse.json(
      {
        success: true,
        data: userObj,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { err: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update specific user profile by ID (admin only)
 */
export async function PATCH(req, context) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await User.findById(session.user._id);
    if (!admin || (admin.role !== "admin" && !admin.isAdmin)) {
      return NextResponse.json({ err: "Access denied. Admin only." }, { status: 403 });
    }

    const params = await context.params;

    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ err: "User ID is required" }, { status: 400 });
    }

    const updateData = await req.json();

    // Build update object with only provided fields
    const safeUpdates = {};

    const allowedFields = [
      "name",
      "email",
      "image",
      "phone",
      "address",
      "city",
      "state",
      "country",
      "zipCode",
      "bio",
      "isActive",
      "role",
      "motherName",
      "fatherName",
      "citizenshipNumber",
      "district",
      "citizenshipFront",
      "citizenshipBack",
      "committeeLevel",
      "professionalAssociation",
      "committeeName",
      "committeeLocation",
      "committeePosition",
    ];

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        safeUpdates[field] = updateData[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(userId, safeUpdates, {
      new: true,
      runValidators: true,
    }).select(
      "name email image phone address city state country zipCode bio isActive role createdAt updatedAt professionalAssociation committeeLevel committeeName committeeLocation committeePosition"
    );

    if (!updatedUser) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }

    // Clean image data
    const userObj = updatedUser.toObject();
    if (userObj.image === "https://placehold.co/600x400" || !userObj.image) {
      userObj.image = null;
    }

    console.log(`✓ User profile updated by admin: ${userId}`);

    return NextResponse.json(
      {
        success: true,
        msg: "User profile updated successfully",
        data: userObj,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { err: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete specific user by ID (admin only)
 */
export async function DELETE(req, context) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await User.findById(session.user._id);
    if (!admin || (admin.role !== "admin" && !admin.isAdmin)) {
      return NextResponse.json({ err: "Access denied. Admin only." }, { status: 403 });
    }

    const params = await context.params;
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ err: "User ID is required" }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === session.user._id) {
      return NextResponse.json(
        { err: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }

    console.log(`✓ User deleted by admin: ${userId}`);

    return NextResponse.json(
      {
        success: true,
        msg: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { err: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
