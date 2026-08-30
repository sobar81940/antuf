import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

import Articles from "@/models/Articles";

// Simple slug generator
const generateSlug = (text) => {
  if (!text) return 'lecture-' + Date.now();
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'lecture-' + Date.now();
};

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { newLecture, search, sectionId } = body;

  try {
    const article = await Articles.findById(search);
    if (!article) {
      return NextResponse.json(
        { err: "Article not found from DB" },
        { status: 500 }
      );
    }
    const section = article.sections.id(sectionId);
    if (!section) {
      return NextResponse.json(
        { err: "Section not found from DB" },
        { status: 500 }
      );
    }

    const slug = newLecture?.slug || generateSlug(newLecture?.title);
    section.lectures.push({ ...newLecture, slug });
    await article.save();
    const newlyAddedLecture = section.lectures[section.lectures.length - 1];

    return NextResponse.json(newlyAddedLecture);
  } catch (error) {
    console.log("Error from POST-----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
