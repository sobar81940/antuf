import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import bcrypt from "bcrypt";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/utils/authOptions";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const { 
    name, 
    email, 
    password, 
    profileImage,
    image,
    userId,
    phone, 
    address, 
    city, 
    state, 
    country, 
    zipCode, 
    bio,
    motherName,
    fatherName,
    citizenshipNumber,
    district,
    citizenshipFront,
    citizenshipBack,
    permanentAddresses
  } = await req.json();

  try {
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not Authenticated!" }, { status: 401 });
    }

    // Determine which user to update
    let targetUserId = session?.user?._id;
    
    // If userId is provided and user is admin, update that user's profile (for image updates)
    if (userId && (session?.user?.role === "admin" || session?.user?.isAdmin)) {
      targetUserId = userId;
    } else if (userId && userId !== session?.user?._id) {
      // Non-admin users can only update their own profile
      return NextResponse.json({ err: "Unauthorized" }, { status: 403 });
    }

    // Use provided image or profileImage field
    const imageUrl = image || profileImage;

    let updateData: Record<string, any> = {
      name,
      phone,
      address,
      city,
      state,
      country,
      zipCode,
      bio,
      motherName,
      fatherName,
      citizenshipNumber,
      district,
      citizenshipFront,
      citizenshipBack,
      permanentAddresses,
    };

    // Only update image if provided
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // Only hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    let updateUser = await User.findByIdAndUpdate(
      targetUserId,
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
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId'); // Check for userId query parameter

  try {
    // If the user is not authenticated (no user ID in the session), return a 401 Unauthorized error
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    // Determine which user to fetch
    let targetUserId = session?.user?._id;
    
    // If userId is provided and user is admin, fetch that user's profile
    if (userId && (session?.user?.role === "admin" || session?.user?.isAdmin)) {
      targetUserId = userId;
    } else if (userId && userId !== session?.user?._id) {
      // Non-admin users can only fetch their own profile
      return NextResponse.json({ err: "Unauthorized" }, { status: 403 });
    }

    // Fetch the user from the database using the ID
    const user = await User.findOne({ _id: targetUserId }).select(
      'name email image phone address city state country zipCode bio motherName fatherName citizenshipNumber district citizenshipFront citizenshipBack permanentAddresses createdAt'
    );

    if (!user) {
      return NextResponse.json({ err: "User not found" }, { status: 404 });
    }

    // Prepare response with validated image URL
    const userResponse = user.toObject();
    
    // If image is not set or is the default placeholder, set it to undefined so client can use fallback
    if (!userResponse.image || userResponse.image === "https://placehold.co/600x400") {
      userResponse.image = undefined;
    }

    // Log the user object (for debugging purposes)
    console.log("User profile retrieved:", userResponse);

    // Return the user data as the response
    return NextResponse.json(userResponse);
  } catch (err) {
    // Log any errors for debugging purposes
    console.log(err);

    // Return a 500 Internal Server Error with the error message if any exception occurs
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
