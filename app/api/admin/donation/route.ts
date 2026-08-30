import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import DonationPage from "@/models/DonationPage";

// GET /api/admin/donation - Get donation page content
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        await dbConnect();

        let donationPage = await DonationPage.findOne({ isActive: true });

        // If no donation page exists create default one
        if (!donationPage) {
            donationPage = await DonationPage.create({
                impactItems: [
                    { amount: 500, description: "एक श्रमिकलाई कानूनी परामर्श" },
                    { amount: 2000, description: "तालिम कार्यक्रम सञ्चालन" },
                    { amount: 10000, description: "२० श्रमिकहरूलाई अधिकार शिक्षा" },
                ],
            });
        }

        return NextResponse.json({
            success: true,
            data: donationPage,
        });
    } catch (error) {
        console.error("Error fetching donation page:", error);
        return NextResponse.json(
            { error: "Failed to fetch donation page", details: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/admin/donation - Update donation page content
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await request.json();
        const editableFields = [
            "headerTitle",
            "headerTitleEn",
            "headerSubtitle",
            "impactItems",
            "bankDetails",
            "paymentDetails",
            "contactEmail",
            "contactPhone",
            "helpText",
        ];
        const updateData = Object.fromEntries(
            editableFields
                .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
                .map((field) => [field, body[field]])
        );
        if (body.paymentDetails) {
            updateData.paymentDetails = {
                qrCode: body.paymentDetails.qrCode || "",
                esewa: body.paymentDetails.esewa || "",
                khalti: body.paymentDetails.khalti || "",
            };
        }
        updateData.updatedBy = session.user.id;

        let donationPage = await DonationPage.findOne({ isActive: true });

        if (donationPage) {
            donationPage.set(updateData);
            donationPage = await donationPage.save();
        } else {
            // Create new
            donationPage = await DonationPage.create({
                ...updateData,
            });
        }

        return NextResponse.json({
            success: true,
            message: "Donation page updated successfully",
            data: donationPage,
        });
    } catch (error) {
        console.error("Error updating donation page:", error);
        return NextResponse.json(
            { error: "Failed to update donation page", details: error.message },
            { status: 500 }
        );
    }
}
