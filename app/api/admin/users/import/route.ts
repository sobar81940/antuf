import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import bcrypt from "bcrypt";

/**
 * POST - Import users from Excel (admin only)
 */
export async function POST(req) {
  try {
    console.log('=== Admin Users Import POST ===');
    
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

    const body = await req.json();
    const { users } = body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ err: "No users provided for import" }, { status: 400 });
    }

    const results = {
      imported: 0,
      updated: 0,
      errors: [],
      total: users.length,
    };

    // Process each user
    for (let i = 0; i < users.length; i++) {
      const userData = users[i];
      
      try {
        // Validate required fields
        if (!userData.email) {
          results.errors.push({
            row: i + 1,
            email: userData.email,
            error: 'Email is required',
          });
          continue;
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: userData.email.toLowerCase() });

        if (existingUser) {
          // Update existing user
          const updateData = {
            name: userData.name || existingUser.name,
            phone: userData.phone || existingUser.phone,
            bio: userData.bio || existingUser.bio,
            role: userData.role || existingUser.role,
            isActive: userData.isActive !== undefined ? userData.isActive : existingUser.isActive,
            // Family
            motherName: userData.motherName || existingUser.motherName,
            fatherName: userData.fatherName || existingUser.fatherName,
            grandfatherName: userData.grandfatherName || existingUser.grandfatherName,
            gender: userData.gender || existingUser.gender,
            // Citizenship
            citizenshipNumber: userData.citizenshipNumber || existingUser.citizenshipNumber,
            // Permanent Address
            permanentProvince: userData.permanentProvince || existingUser.permanentProvince,
            permanentDistrict: userData.permanentDistrict || existingUser.permanentDistrict,
            permanentMunicipality: userData.permanentMunicipality || existingUser.permanentMunicipality,
            permanentWardNo: userData.permanentWardNo || existingUser.permanentWardNo,
            permanentAddress: userData.permanentAddress || existingUser.permanentAddress,
            // Temporary Address
            temporaryProvince: userData.temporaryProvince || existingUser.temporaryProvince,
            temporaryDistrict: userData.temporaryDistrict || existingUser.temporaryDistrict,
            temporaryMunicipality: userData.temporaryMunicipality || existingUser.temporaryMunicipality,
            temporaryWardNo: userData.temporaryWardNo || existingUser.temporaryWardNo,
            temporaryAddress: userData.temporaryAddress || existingUser.temporaryAddress,
            // Emergency
            emergencyContact: userData.emergencyContact || existingUser.emergencyContact,
            emergencyPhone: userData.emergencyPhone || existingUser.emergencyPhone,
            // Professional
            organization: userData.organization || existingUser.organization,
            position: userData.position || existingUser.position,
            membershipNumber: userData.membershipNumber || existingUser.membershipNumber,
          };

          await User.findByIdAndUpdate(existingUser._id, updateData, { new: true });
          results.updated++;
        } else {
          // Create new user
          const newUserData = {
            name: userData.name || 'Unknown',
            email: userData.email.toLowerCase(),
            password: await bcrypt.hash('defaultPassword123', 10), // Default password
            phone: userData.phone || '',
            bio: userData.bio || '',
            role: userData.role || 'user',
            isActive: userData.isActive !== undefined ? userData.isActive : true,
            // Family
            motherName: userData.motherName || '',
            fatherName: userData.fatherName || '',
            grandfatherName: userData.grandfatherName || '',
            gender: userData.gender || '',
            // Citizenship
            citizenshipNumber: userData.citizenshipNumber || '',
            // Permanent Address
            permanentProvince: userData.permanentProvince || '',
            permanentDistrict: userData.permanentDistrict || '',
            permanentMunicipality: userData.permanentMunicipality || '',
            permanentWardNo: userData.permanentWardNo || '',
            permanentAddress: userData.permanentAddress || '',
            // Temporary Address
            temporaryProvince: userData.temporaryProvince || '',
            temporaryDistrict: userData.temporaryDistrict || '',
            temporaryMunicipality: userData.temporaryMunicipality || '',
            temporaryWardNo: userData.temporaryWardNo || '',
            temporaryAddress: userData.temporaryAddress || '',
            // Emergency
            emergencyContact: userData.emergencyContact || '',
            emergencyPhone: userData.emergencyPhone || '',
            // Professional
            organization: userData.organization || '',
            position: userData.position || '',
            membershipNumber: userData.membershipNumber || '',
          };

          await User.create(newUserData);
          results.imported++;
        }
      } catch (error) {
        console.error(`❌ Error processing user at row ${i + 1}:`, {
          email: userData.email,
          name: userData.name,
          error: error.message,
          stack: error.stack
        });
        
        // More specific error messages
        let errorMsg = error.message;
        if (error.code === 11000) {
          errorMsg = 'Duplicate email - user already exists';
        } else if (error.name === 'ValidationError') {
          errorMsg = Object.values(error.errors).map((e: any) => e.message).join(', ');
        }
        
        results.errors.push({
          row: i + 1,
          email: userData.email || 'No email',
          name: userData.name || 'No name',
          error: errorMsg,
        });
      }
    }

    console.log('Import results:', results);

    return NextResponse.json({
      success: true,
      message: `Import completed. ${results.imported} created, ${results.updated} updated, ${results.errors.length} failed.`,
      ...results,
    }, { status: 200 });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { err: error.message || "Failed to import users" },
      { status: 500 }
    );
  }
}
