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

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();
  const { updatedSection, sectionId, search } = body;
  const id = context?.params?.id;

  try {
    const article = await Articles.findById(search);
    if (!article) {
      return NextResponse.json({ err: "Article not found" });
    }
    const section = article.sections.id(sectionId);
    const lectureId = id.toString();
    const lectureIndex = section?.lectures.findIndex(
      (Lecture) => Lecture?._id.toString() === lectureId
    );
    if (lectureIndex === -1) {
      return NextResponse.json({ err: "Lecture not found" });
    }
    const slug = updatedSection?.slug || generateSlug(updatedSection?.title);
    updatedSection.slug = slug;
    section.lectures[lectureIndex] = updatedSection;
    await article.save();
    return NextResponse.json(article);
  } catch (error) {
    console.log("Error from PUT for Lecture Part-----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  const body = await req.json();
  try {
    const { sectionId, search } = body;
    const article = await Articles.findById(search);
    if (!article) {
      return NextResponse.json({ err: "Article not found" });
    }
    const section = article.sections.id(sectionId);
    if (!section) {
      return NextResponse.json({ err: "Section not found" });
    }
    
    if (!context?.params?.id) {
      return NextResponse.json({ err: "Lecture ID is required" }, { status: 400 });
    }
    
    const lectureId = context.params.id.toString();
    
    if (!section.lectures || !Array.isArray(section.lectures)) {
      return NextResponse.json({ err: "No lectures found in this section" }, { status: 404 });
    }
    
    const lectureExists = section.lectures.some(
      lecture => lecture?._id?.toString() === lectureId
    );
    
    if (!lectureExists) {
      return NextResponse.json({ err: "Lecture not found" }, { status: 404 });
    }
    
    section.lectures = section.lectures.filter(
      lecture => lecture?._id?.toString() !== lectureId
    );
    await article.save();

    return NextResponse.json(article);
  } catch (error) {
    console.log("error from DELETE----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
