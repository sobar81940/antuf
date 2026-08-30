import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import bcrypt from "bcrypt";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/utils/authOptions";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const { name, email, password, phone, organization, bio, profileImage } = await req.json();
  console.log({ name, email, password, phone, organization, bio, profileImage });
  try {
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not Authenticated!" }, { status: 401 });
    }

    // Build update object
    const updateData: Record<string, any> = {
      name,
      phone,
      organization,
      bio,
      updatedBy: session.user._id,
    };

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Only update image if provided
    if (profileImage) {
      updateData.image = profileImage;
    }

    let updateUser = await User.findByIdAndUpdate(
      session?.user?._id,
      updateData,
      { new: true }
    );
    if (!updateUser) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { msg: "User updated successfully!", user: updateUser },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

// GET handler for fetching user information
export async function GET(req) {
  await dbConnect(); // Connect to the MongoDB database

  const session = await getServerSession(authOptions); // Get the session to verify if the user is logged in

  try {
    // If the user is not authenticated (no user ID in the session), return a 401 Unauthorized error
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    // Fetch the user from the database using the ID from the session
    const user = await User.findOne({ _id: session?.user?._id });

    // Log the user object (for debugging purposes)
    console.log(user);

    // Return the user data as the response
    return NextResponse.json(user);
  } catch (err) {
    // Log any errors for debugging purposes
    console.log(err);

    // Return a 500 Internal Server Error with the error message if any exception occurs
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
