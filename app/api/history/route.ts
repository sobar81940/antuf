import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import HistoryPage from "@/models/HistoryPage";


export async function GET() {
    try {
        await dbConnect();
        const page: any = await HistoryPage.findOne({ isActive: true }).lean<any>();
        // Only return the content the admin has published. No hardcoded demo content is shown.


        return NextResponse.json({ success: true, data: page || null });
    } catch (error) {
        console.error("Error fetching history page:", error);
        return NextResponse.json({ success: true, data: null });
    }
}