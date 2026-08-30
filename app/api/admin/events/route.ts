import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import EventCalendar from "@/models/eventCalendar";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { Types } from "mongoose";

export async function GET(request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const query: Record<string, any> = { isPublished: true };

    if (category) query.category = category;
    if (status) query.status = status;
    if (featured === "true") query.isFeatured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { titleNepali: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const events = await EventCalendar.find(query)
      .select("title titleNepali description descriptionNepali startDate endDate time location image category status capacity registeredCount isFeatured")
      .skip(skip)
      .limit(limit)
      .sort({ startDate: 1 });

    const total = await EventCalendar.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: events,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const admin = await User.findById(session.user._id);
    if (!admin || (admin.role !== "admin" && !admin.isAdmin)) {
      return NextResponse.json({ error: "Access denied. Admin only." }, { status: 403 });
    }

    const body = await request.json();
    const { title, titleNepali, description, descriptionNepali, startDate, endDate, time, location, locationNepali, category, image, capacity, organizer, tags } = body;

    if (!title || !titleNepali || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields: title, titleNepali, startDate, endDate" },
        { status: 400 }
      );
    }

    const event = new EventCalendar({
      title,
      titleNepali,
      description,
      descriptionNepali,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      time,
      location,
      locationNepali,
      category: category || "other",
      image,
      capacity,
      organizer,
      tags: tags || [],
      createdBy: session.user._id,
    });

    await event.save();

    return NextResponse.json(
      { success: true, data: event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 500 }
    );
  }
}
