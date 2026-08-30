import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { Types } from "mongoose";

/**
 * GET - Fetch user profiles (admin only)
 * Supports filtering, searching, and pagination
 */
export async function GET(req) {
  try {
    console.log('=== Admin Users Profile GET ===');
    console.log('Request URL:', req.url);
    
    await dbConnect();
    console.log('Database connected');

    const session = await getServerSession(authOptions);
    console.log('Session:', session ? 'exists' : 'null');
    console.log('Session user:', session?.user);

    if (!session?.user?._id) {
      console.log('No session or user ID');
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await User.findById(session.user._id);
    console.log('Admin user found:', admin ? 'yes' : 'no');
    console.log('Admin role:', admin?.role);
    console.log('Admin isAdmin:', admin?.isAdmin);
    
    if (!admin || (admin.role !== "admin" && !admin.isAdmin)) {
      console.log('User is not admin');
      return NextResponse.json({ err: "Access denied. Admin only." }, { status: 403 });
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Query parameters
    const userId = searchParams.get("userId"); // Get specific user
    const search = searchParams.get("search"); // Search by name or email
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const isActive = searchParams.get("isActive"); // Filter by active status
    const role = searchParams.get("role"); // Filter by role

    // Build query
    const query: Record<string, any> = {};

    if (userId) {
      // Validate and convert userId to MongoDB ObjectId
      try {
        query._id = new Types.ObjectId(userId);
        console.log('Query userId converted to ObjectId:', query._id);
      } catch (err) {
        console.error('Invalid userId format:', userId);
        return NextResponse.json({ err: "Invalid user ID format" }, { status: 400 });
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (role) {
      query.role = role;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch users with selected fields
    const users = await User.find(query)
      .select(
        "name email image phone address city state country zipCode bio isActive role createdAt updatedAt"
      )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    console.log(`Found ${users.length} users matching query:`, query);
    users.forEach((u, i) => {
      console.log(`User ${i + 1}: ${u.name} (${u.email}) - Image: ${u.image ? '✓' : '✗'}`);
    });

    // Count total documents
    const total = await User.countDocuments(query);

    // Process users to clean image data
    const processedUsers = users.map((user) => {
      const userObj = user.toObject();
      // Filter out default placeholder images
      if (userObj.image === "https://placehold.co/600x400" || !userObj.image) {
        userObj.image = null;
      }
      return userObj;
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: processedUsers,
        pagination: {
          total,
          page,
          limit,
          pages: totalPages,
          hasMore: page < totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { err: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/**
 * POST - Update user profile (admin only)
 */
export async function POST(req) {
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

    const {
      userId,
      name,
      email,
      image,
      phone,
      address,
      city,
      state,
      country,
      zipCode,
      bio,
      isActive,
      role,
      motherName,
      fatherName,
      citizenshipNumber,
      district,
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ err: "User ID is required" }, { status: 400 });
    }

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (image !== undefined) updateData.image = image;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (bio !== undefined) updateData.bio = bio;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (role !== undefined) updateData.role = role;
    if (motherName !== undefined) updateData.motherName = motherName;
    if (fatherName !== undefined) updateData.fatherName = fatherName;
    if (citizenshipNumber !== undefined) updateData.citizenshipNumber = citizenshipNumber;
    if (district !== undefined) updateData.district = district;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select(
      "name email image phone address city state country zipCode bio isActive role createdAt updatedAt"
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
        user: userObj,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { err: error.message || "Failed to update user profile" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete user profile (admin only)
 */
export async function DELETE(req) {
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

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

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
