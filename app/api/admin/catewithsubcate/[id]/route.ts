import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import CateWithSubCate from "@/models/catewithsubcate";

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();

  try {
    const params = await context.params;
    // Finding the document by its ID (from the URL parameter) and updating it with the new data from the request body
    // The "new: true" option ensures that the returned document is the updated one
    const updatingCategory = await CateWithSubCate.findByIdAndUpdate(
      params.id, // The ID of the document to update, extracted from the URL params
      body, // The new data to update the document with
      { new: true } // Return the updated document instead of the original one
    );
    return NextResponse.json(updatingCategory);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  try {
    const params = await context.params;
    // Finding the document by its ID (from the URL parameter) and deleting it
    const deletingCategory = await CateWithSubCate.findByIdAndDelete({
      _id: params.id, // The ID of the document to delete, extracted from the URL params
    });
    return NextResponse.json(deletingCategory);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
