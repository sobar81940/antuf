import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DonationPage from "@/models/DonationPage";

// GET /api/donation - Public endpoint for donation page content
export async function GET(request) {
    try {
        await dbConnect();

        let donationPage = await DonationPage.findOne({ isActive: true }).lean<any>();

        // If no donation page exists, return default
        if (!donationPage) {
            donationPage = {
                headerTitle: "दान गर्नुहोस्",
                headerTitleEn: "Support Our Cause",
                headerSubtitle:
                    "तपाईंको सहयोगले नेपालका श्रमिकहरूको जीवनमा सकारात्मक परिवर्तन ल्याउन मद्दत गर्छ",
                impactItems: [
                    { amount: 500, description: "एक श्रमिकलाई कानूनी परामर्श" },
                    { amount: 2000, description: "तालिम कार्यक्रम सञ्चालन" },
                    { amount: 10000, description: "२० श्रमिकहरूलाई अधिकार शिक्षा" },
                ],
                bankDetails: {
                    bankName: "Nepal Bank Limited",
                    accountName: "ANTUF Nepal",
                    accountNumber: "01234612758",
                    branch: "Kathmandu, Nepal",
                },
                paymentDetails: {
                    qrCode: "",
                    esewa: "",
                    khalti: "",
                },
                contactEmail: "donate@antuf.org.np",
                contactPhone: "+977-1-4612758",
                helpText: "दानसम्बन्धी कुनै प्रश्न भए हामीलाई सम्पर्क गर्नुहोस्:",
            };
        }

        donationPage.paymentDetails = {
            qrCode: "",
            esewa: "",
            khalti: "",
            ...(donationPage.paymentDetails || {}),
        };

        return NextResponse.json(
            {
                success: true,
                data: donationPage,
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("Error fetching donation page:", error);
        return NextResponse.json(
            { error: "Failed to fetch donation page", details: error.message },
            { status: 500 }
        );
    }
}
