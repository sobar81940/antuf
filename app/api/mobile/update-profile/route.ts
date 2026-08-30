import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";

export async function POST(req) {
    try {
        await dbConnect();
        const {
            userId,
            image,
            // Personal
            name, phone, gender, dobNepali, bio,
            // Professional
            occupation, workplace, position,
            // Address
            address, city, state, country, zipCode,
            // Family
            motherName, fatherName, grandfatherName, spouseName,
            // Citizenship
            citizenshipNumber, district, citizenshipIssuedDate, citizenshipFront, citizenshipBack,
            // Membership
            unionName, membershipNumber, joinDate,
            // Emergency
            emergencyContact, emergencyPhone
        } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update fields if provided
        if (image) user.image = image;
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (gender) user.gender = gender;
        if (dobNepali) user.dobNepali = dobNepali;
        if (bio) user.bio = bio;

        if (occupation) user.occupation = occupation;
        if (workplace) user.workplace = workplace;
        if (position) user.position = position;

        if (address) user.address = address;
        if (city) user.city = city;
        if (state) user.state = state;
        if (country) user.country = country;
        if (zipCode) user.zipCode = zipCode;

        if (motherName) user.motherName = motherName;
        if (fatherName) user.fatherName = fatherName;
        if (grandfatherName) user.grandfatherName = grandfatherName;
        if (spouseName) user.spouseName = spouseName;

        if (citizenshipNumber) user.citizenshipNumber = citizenshipNumber;
        if (district) user.district = district;
        if (citizenshipIssuedDate) {
            // Handle if stored as string or whatever, user model has it as String (issuedDate) or inside citizenship object?
            // User model has 'citieship: { ... }' AND flat fields. Using flat fields for now based on schema analysis.
            // Schema has 'citizenship: { issuedDate: String }' AND no flat 'citizenshipIssuedDate', 
            // BUT it has 'district' (flat) and 'citizenshipNumber' (flat).
            // Let's assume we save to where it fits.
            // Schema line 245: inside citizenship object. 
            // BUT schema line 235 also has 'citizenship' object.
            // Line 257 has 'citizenshipNumber' flat.
            // Let's try to populate the 'citizenship' object if we can, or just save what we can.
            // Actually, looking at schema again:
            // It has structured 'citizenship' field (lines 236-255).
            // AND legacy flat fields (257-266).
            // To be safe and modern, we should probably update the structured one too?
            // Or just update the flat ones if that's what is used. 
            // The user.js model shows flat fields: `citizenshipNumber`, `citizenshipFront`, `citizenshipBack`.
            // It does NOT have flat `issuedDate` or `issuedDistrict`. 
            // It DOES have `district` (line 77) - usually for address? Or citizenship? 
            // Wait, line 241 is `issuedDistrict` inside citizenship.

            // Let's stick to updating the fields that exist on the root if possible, or create the object.
            // For simplicity in this 'fix', I will populate the flat fields that exist matches.
            // And for `issuedDate`, I might need to put it in `citizenship.issuedDate`.

            if (!user.citizenship) user.citizenship = {};
            user.citizenship.issuedDate = citizenshipIssuedDate;
            user.citizenship.issuedDistrict = district; // reusing district if passed as such, or valid district field
            user.citizenship.number = citizenshipNumber;
            user.citizenship.frontImage = citizenshipFront;
            user.citizenship.backImage = citizenshipBack;
        }

        // Also update flat fields for backward compat if they exist in schema
        if (citizenshipNumber) user.citizenshipNumber = citizenshipNumber;
        if (citizenshipFront) user.citizenshipFront = citizenshipFront;
        if (citizenshipBack) user.citizenshipBack = citizenshipBack;
        if (district) user.district = district; // This might be address district, but often reused.

        if (unionName) user.unionName = unionName;
        if (membershipNumber) user.membershipNumber = membershipNumber;
        if (joinDate) user.joinDate = joinDate;

        if (emergencyContact) user.emergencyContact = emergencyContact;
        if (emergencyPhone) user.emergencyPhone = emergencyPhone;

        await user.save();

        // Return updated user info (excluding password)
        const { password: _, ...userInfo } = user._doc;

        return NextResponse.json({
            message: "Profile updated successfully",
            user: userInfo,
        });

    } catch (error) {
        console.error("Mobile Profile Update Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
