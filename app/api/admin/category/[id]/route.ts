import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/models/Category";

export async function PUT(req, context) {
  await dbConnect();

  const body = await req.json();
  try {
    const params = await context.params;
    const { _id, ...updatedBody } = body;

    const updatingCategory = await Category.findByIdAndUpdate(
      params.id,
      updatedBody,
      { new: true }
    );
    return NextResponse.json(updatingCategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  try {
    const params = await context.params;
    const deletingCategory = await Category.findByIdAndDelete({
      _id: params.id,
    });
    return NextResponse.json(deletingCategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
