import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";

export async function PUT(req, context) {
  try {
    await dbConnect();

    const params = await context.params;
    const body = await req.json();
    console.log("Received update data for article:", params.id);

    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!body.slug || body.slug.trim() === '') {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const updateData = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      subtitle: body.subtitle?.trim() || "",
      excerpt: body.excerpt?.trim() || "",
      content: body.content || "",
      featureImage: body.featureImage || "",
      imageAlt: body.imageAlt?.trim() || `${body.title.trim()} feature image`,
      thumbnail: body.thumbnail || "",
      category: body.category,
      tags: body.tags || [],
      status: body.status || "draft",
      publishedAt: body.status === "published" && !body.publishedAt ? new Date() : body.publishedAt,
      isFeatured: body.isFeatured || false,
      isPinned: body.isPinned || false,
      difficulty: body.difficulty || "beginner",
      contentLanguage: body.language || "ne",
      metaTitle: body.metaTitle?.trim() || body.title.trim(),
      metaDescription: body.metaDescription?.trim() || "",
      metaKeywords: body.metaKeywords || [],
      allowComments: body.allowComments !== false,
      sections: body.sections || [],
      updatedAt: new Date(),
    };

    const article = await Articles.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    console.log("Updated article:", article);
    return NextResponse.json(article);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    await dbConnect();

    const article = await Articles.findByIdAndDelete(context.params.id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    console.log("Deleted article:", article);
    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete article" },
      { status: 500 }
    );
  }
}
