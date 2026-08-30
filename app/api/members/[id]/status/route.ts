import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";

export async function PATCH(request, { params }) {
  try {
    // Connect to database
    await dbConnect();

    // Get and verify session with authOptions
    const session = await getServerSession(authOptions);
    
    // Check for admin role
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    // Get ID from params
    if (!params?.id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    if (typeof body.isActive !== 'boolean') {
      return NextResponse.json(
        { error: "isActive must be a boolean value" },
        { status: 400 }
      );
    }

    // Update user status
    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { isActive: body.isActive },
      { 
        new: true,
        runValidators: true,
        select: 'name email role isActive'
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Log successful update
    console.log('User status updated:', {
      id: params.id,
      isActive: body.isActive,
      user: updatedUser
    });

    return NextResponse.json({
      success: true,
      message: `User ${body.isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });

  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}