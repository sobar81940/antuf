import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";
import { Boy, TrySharp } from "@mui/icons-material";

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();

  try {
    const updateFields: Record<string, any> = {};
    if (body.title) updateFields.title = body.title;
    if (body.about) updateFields.about = body.about;
    if (body.description) updateFields.description = body.description;
    if (body.imageUrl) updateFields.imageUrl = body.imageUrl;
    if (body.featureImage) updateFields.featureImage = body.featureImage;
    if (body.level) updateFields.level = body.level;
    if (body.videoUrl) updateFields.videoUrl = body.videoUrl;
    if (body.price) updateFields.price = body.price;

    // Log the update fields for debugging
    console.log("Update fields:", updateFields);
    console.log("Received imageUrl:", body.imageUrl);

    const articles = await Articles.findByIdAndUpdate(
      context?.params?.id,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!articles) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    console.log("Updated article:", articles);
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  try {
    const articles = await Articles.findByIdAndDelete(
      context?.params?.id
    );
    console.log("Curr delete course--", articles);
    return NextResponse.json(articles);
  } catch (error) {
    console.log("Error from DELETE for curr course---", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
