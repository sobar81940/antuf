import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";

/**
 * GET /api/check-admin
 * 
 * Diagnostic endpoint to check admin users and their status
 * Helps troubleshoot login issues
 */
export async function GET(req) {
    try {
        await dbConnect();

        // Count total users
        const totalUsers = await User.countDocuments();

        // Find all admin users
        const adminUsers = await User.find({ role: "admin" })
            .select("name email role isActive provider createdAt")
            .lean();

        // Count users with password credentials
        const credentialUsers = await User.countDocuments({
            $or: [
                { provider: "credentials" },
                { provider: { $exists: false } }
            ],
            password: { $exists: true, $ne: null }
        });

        // Check for any deactivated admin users
        const deactivatedAdmins = adminUsers.filter(u => u.isActive === false);

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers,
                adminCount: adminUsers.length,
                credentialUsers,
                deactivatedAdmins: deactivatedAdmins.length
            },
            admins: adminUsers.map(user => ({
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive !== false,
                provider: user.provider || 'credentials',
                createdAt: user.createdAt
            })),
            warnings: [
                ...(adminUsers.length === 0 ? ["No admin users found. Use /api/setup-admin to create one."] : []),
                ...(deactivatedAdmins.length > 0 ? [`${deactivatedAdmins.length} admin user(s) are deactivated.`] : [])
            ]
        });

    } catch (error) {
        console.error("Error checking admin users:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            { status: 500 }
        );
    }
}
