import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import SubCategory from "@/models/subcategory";

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();

  try {
    const params = await context.params;
    const { ...updateBody } = body;
    const updatingCategory = await SubCategory.findByIdAndUpdate(
      params.id,
      updateBody,
      { new: true }
    );
    return NextResponse.json(updatingCategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  const params = await context.params;
  console.log("context", params.id);
  try {
    const deletingSubCategory = await SubCategory.findByIdAndDelete({
      _id: params.id,
    });
    console.log("deleting sub category", deletingSubCategory);
    return NextResponse.json(deletingSubCategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
