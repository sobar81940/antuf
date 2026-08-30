import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Articles from "@/models/Articles";

export async function PUT(req, context) {
  await dbConnect();
  const body = await req.json();
  const { updatedSection, search } = body;
  console.log("Data received at PUT------", body);
  try {
    const article = await Articles.findById(search);
    if (!article) {
      return NextResponse.json({ err: "From PUT, Article not found" });
    }

    const sectionIndex = article.sections.findIndex(
      (section) => section?._id.toString() === context?.params?.id.toString()
    );

    if (sectionIndex === -1) {
      return NextResponse.json({ err: "Section not found" });
    }

    article.sections[sectionIndex] = updatedSection;
    await article.save();

    return NextResponse.json(article);
  } catch (error) {
    console.log("Error from PUT req-----", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();
  const body = await req.json();
  try {
    const article = await Articles.findById(body);
    if (!article) {
      return NextResponse.json({ err: "Error-Not found" });
    }
    article.sections = article.sections.filter(
      (section) => section?._id.toString() !== context?.params?.id.toString()
    );

    await article.save();
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}