import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import DonationTransaction from "@/models/DonationTransaction";

export async function POST(request) {
    try {
        const body = await request.json();
        const requiredFields = ["donorName", "donorEmail", "amount", "paymentMethod", "receiptUrl"];
        const missingField = requiredFields.find((field) => !body[field]);

        if (missingField) {
            return NextResponse.json({ error: `${missingField} is required` }, { status: 400 });
        }

        await dbConnect();
        const transaction = await DonationTransaction.create({
            donorName: body.donorName,
            donorEmail: body.donorEmail,
            donorPhone: body.donorPhone,
            donorAddress: body.donorAddress,
            amount: Number(body.amount),
            donationType: body.donationType,
            paymentMethod: body.paymentMethod,
            transactionId: body.transactionId,
            receiptUrl: body.receiptUrl,
        });

        return NextResponse.json(
            { success: true, message: "Donation receipt submitted successfully", data: transaction },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting donation receipt:", error);
        return NextResponse.json({ error: "Failed to submit donation receipt" }, { status: 500 });
    }
}