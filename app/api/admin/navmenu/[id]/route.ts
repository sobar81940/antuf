import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import NavMenu from "@/models/NavMenu";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (e) {
      return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
    }

    const res = await NavMenu.findByIdAndDelete(objectId);

    if (!res) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (err) {
    console.error("DELETE navmenu error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}