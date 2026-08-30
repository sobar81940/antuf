import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Activity from "@/models/Activity";
import { Types } from "mongoose";

const cleanStringInput = (str) => {
  if (!str) return str;
  return str.replace(/\n/g, '').trim();
};

export async function GET(req, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const activity = await Activity.findById(id);

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      {
        title: cleanStringInput(body.title),
        description: cleanStringInput(body.description),
        category: body.category,
        date: cleanStringInput(body.date),
        status: body.status,
        image: body.image || '',
        details: cleanStringInput(body.details) || '',
        location: cleanStringInput(body.location) || '',
        organizer: cleanStringInput(body.organizer) || '',
      },
      { new: true }
    );

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activity,
      message: "Activity updated successfully"
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update activity" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Activity deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete activity" },
      { status: 500 }
    );
  }
}
