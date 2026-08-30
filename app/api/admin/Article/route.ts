import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";
import "@/models/subcategory"; // Ensure SubCategory model is registered for populate()
import "@/models/user"; // Ensure User model is registered for populate()

// Simple slug generator that works with any language
const generateSlug = (text) => {
  if (!text) return 'article-' + Date.now();
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'article-' + Date.now();
};

export async function POST(req) {
  // Declared outside the try block so the catch handler can log it safely.
  let articleData;

  try {
    await dbConnect();
    const body = await req.json();

    console.log("Received request body:", body);

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Validate category
    if (!body.category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Validate slug
    if (!body.slug || body.slug.trim() === '') {
      return NextResponse.json(
        { error: "Slug is required. Please ensure the title generates a valid slug." },
        { status: 400 }
      );
    }

    // Create article data with new model fields
    articleData = {
      // Basic Information
      title: body.title.trim(),
      slug: body.slug.trim(),
      subtitle: body.subtitle?.trim() || "",
      excerpt: body.excerpt?.trim() || "",
      content: body.content || "",
      
      // Media
      featureImage: body.featureImage || "",
      imageAlt: body.imageAlt?.trim() || `${body.title.trim()} feature image`,
      thumbnail: body.thumbnail || "",
      
      // Categorization
      category: body.category,
      tags: body.tags || [],
      
      // Author Information
      author: body.author || null,
      authorName: body.authorName?.trim() || "ANTUF Admin",
      
      // Content
      sections: [],
      
      // Publication Status
      status: body.status || "draft",
      publishedAt: body.status === "published" ? new Date() : null,
      scheduledFor: body.scheduledFor || null,
      
      // SEO
      metaTitle: body.metaTitle?.trim() || body.title.trim(),
      metaDescription: body.metaDescription?.trim() || body.excerpt?.trim() || "",
      metaKeywords: body.metaKeywords || [],
      
      // Features
      isFeatured: body.isFeatured || false,
      isPinned: body.isPinned || false,
      allowComments: body.allowComments !== false,
      
      // Reading Information
      difficulty: body.difficulty || "beginner",
      contentLanguage: body.language || "ne", // Map language to contentLanguage
    };

    // Create and save the article
    const article = await Articles.create(articleData);

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Safely log article data without circular references
    try {
      const safeData = {
        title: articleData?.title,
        slug: articleData?.slug,
        category: articleData?.category?.toString() || articleData?.category,
        status: articleData?.status,
        language: articleData?.contentLanguage
      };
      console.error("Article data that failed:", safeData);
    } catch (logError) {
      console.error("Could not log article data:", logError.message);
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const articles = await Articles.find()
      .populate({
        path: "category",
        select: "name _id",
        model: "SubCategory",
      })
      .populate({
        path: "author",
        select: "name email image",
        model: "User",
      })
      .select("-sections.lectures.content") // Exclude large content for list view
      .sort({ publishedAt: -1, createdAt: -1 });

    console.log("Articles with populated fields:", articles);

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
