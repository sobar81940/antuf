import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, secretKey } = await req.json();

    // Simple secret key check (you should change this)
    if (secretKey !== 'make-admin-secret-2024') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists first
    const existingUser = await User.findOne({ email: email.toLowerCase() }).lean<any>();

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Use direct MongoDB update to bypass Mongoose validation
    await User.collection.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          role: 'admin',
          isAdmin: true,
          isActive: true  // Ensure account is active
        }
      }
    );

    console.log(`✅ User ${email} successfully updated to admin role`);

    return NextResponse.json({
      success: true,
      message: "User updated to admin successfully",
      user: {
        email: existingUser.email,
        name: existingUser.name,
        role: 'admin',
        isAdmin: true,
        isActive: true,
      }
    });

  } catch (error) {
    console.error("Error setting admin role:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
