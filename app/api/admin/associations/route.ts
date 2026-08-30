import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import ProfessionalAssociation from "@/models/ProfessionalAssociation";
import Committee from "@/models/Committee";
import slugify from "slugify";
import { WOMEN_SLUG } from "@/utils/womenCommittee";
import { YOUTH_SLUG } from "@/utils/youthCommittee";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

const normalizeSlug = (value: string) =>
  slugify(value, { lower: true, strict: true, trim: true });

const slugBase = (name: string) => normalizeSlug(name) || "association";

async function createUniqueSlug(name: string) {
  const base = slugBase(name);
  let slug = base;
  let suffix = 2;

  while (await ProfessionalAssociation.exists({ slug })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function GET() {
  try {
    if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    // The dedicated Women's Committee and Youth Committee are managed independently
    // (via the sidebar entries), so they are hidden from the main professional
    // association list.
    const associations = await ProfessionalAssociation.find({
      slug: { $nin: [WOMEN_SLUG, YOUTH_SLUG] },
    })
      .sort({ name: 1 })
      .lean<any[]>();
    // Backfill slugs for associations created before slugs were introduced, so
    // their workspace links can move from database IDs to readable URLs too.
    for (const association of associations) {
      if (!association.slug) {
        association.slug = await createUniqueSlug(association.englishName || association.name);
        await ProfessionalAssociation.updateOne(
          { _id: association._id },
          { $set: { slug: association.slug } }
        );
      }
    }
    const data = await Promise.all(associations.map(async (association) => {
      const committees = await Committee.find({ association: association._id }).select("members").lean();
      const memberIds = new Set(
        committees.flatMap((committee) => (committee.members || []).map((memberId) => memberId.toString()))
      );
      return { ...association, memberCount: memberIds.size };
    }));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to load associations" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { name, englishName, slug } = await request.json();
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Association name is required" }, { status: 400 });
    }
    if (typeof englishName !== "string" || !englishName.trim()) {
      return NextResponse.json({ error: "Association English name is required" }, { status: 400 });
    }
    if (slug !== undefined && typeof slug !== "string") {
      return NextResponse.json({ error: "Association slug must be text" }, { status: 400 });
    }
    const trimmedName = name.trim();
    const trimmedEnglishName = englishName.trim();
    const normalizedSlug = slug === undefined ? await createUniqueSlug(trimmedEnglishName) : normalizeSlug(slug);
    if (!normalizedSlug) {
      return NextResponse.json({ error: "Association slug is required" }, { status: 400 });
    }
    const association = await ProfessionalAssociation.create({
      name: trimmedName,
      englishName: trimmedEnglishName,
      slug: normalizedSlug,
      createdBy: session.user.id || session.user._id,
    });
    return NextResponse.json({ success: true, data: association }, { status: 201 });
  } catch (error) {
    const status = error.code === 11000 ? 409 : 500;
    return NextResponse.json({ error: status === 409 ? "Association already exists" : error.message || "Failed to create association" }, { status });
  }
}
