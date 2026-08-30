import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.password) {
            return NextResponse.json(
                { error: "Please login via the method used to sign up (OAuth provider)" },
                { status: 400 }
            );
        }

        // Check if account is active
        if (user.isActive === false) {
            return NextResponse.json({ error: "ACCOUNT_DEACTIVATED" }, { status: 403 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password!" }, { status: 401 });
        }

        // Return user info (excluding password)
        const { password: _, ...userInfo } = user._doc;

        return NextResponse.json({
            message: "Login successful",
            user: userInfo,
        });

    } catch (error) {
        console.error("Mobile Login Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
