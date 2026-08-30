import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Activity from "@/models/Activity";

const cleanStringInput = (str) => {
  if (!str) return str;
  return str.replace(/\n/g, '').trim();
};

export async function GET() {
  try {
    await dbConnect();
    const activities = await Activity.find({}).sort({ createdAt: -1 });
    return NextResponse.json(activities);
  } catch (err) {
    console.log("error", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.description || !body.category || !body.date) {
      return NextResponse.json(
        { error: "Title, description, category, and date are required" },
        { status: 400 }
      );
    }

    const activity = await Activity.create({
      title: cleanStringInput(body.title),
      description: cleanStringInput(body.description),
      category: body.category,
      date: cleanStringInput(body.date),
      status: body.status || 'planned',
      image: body.image || '',
      details: cleanStringInput(body.details) || '',
      location: cleanStringInput(body.location) || '',
      organizer: cleanStringInput(body.organizer) || '',
    });

    return NextResponse.json({
      success: true,
      data: activity,
      message: "Activity created successfully"
    });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create activity",
      },
      { status: 500 }
    );
  }
}
