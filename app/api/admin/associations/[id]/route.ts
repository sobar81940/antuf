import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import ProfessionalAssociation from "@/models/ProfessionalAssociation";
import User from "@/models/user";
import mongoose from "mongoose";
import slugify from "slugify";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

const associationQuery = (identifier: string) =>
  mongoose.isValidObjectId(identifier) ? { _id: identifier } : { slug: identifier };

async function ensureAssociationSlug(association: any) {
  if (association.slug) return association;

  const base = slugify(association.englishName || association.name, {
    lower: true,
    strict: true,
    trim: true,
  }) || "association";
  let slug = base;
  let suffix = 2;
  while (await ProfessionalAssociation.exists({ slug, _id: { $ne: association._id } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  association.slug = slug;
  await association.save();
  return association;
}

/**
 * GET - Fetch a single professional association by id or slug (admin only).
 */
export async function GET(request, context) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { id } = params;

    await dbConnect();

    const association = await ProfessionalAssociation.findOne(associationQuery(id));
    if (!association) {
      return NextResponse.json({ error: "Association not found" }, { status: 404 });
    }
    await ensureAssociationSlug(association);

    return NextResponse.json({ success: true, data: association });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load association" },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Rename a professional association (admin only).
 * Members store the association by its NAME on the User model, so they
 * are kept in sync automatically when the association is renamed.
 */
export async function PATCH(request, context) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { id } = params;

    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Association name is required" }, { status: 400 });
    }

    await dbConnect();

    const association = await ProfessionalAssociation.findOne(associationQuery(id));
    if (!association) {
      return NextResponse.json({ error: "Association not found" }, { status: 404 });
    }

    const newName = name.trim();
    if (newName === association.name) {
      return NextResponse.json({ success: true, msg: "No changes made", data: association });
    }

    // Check for a name collision before attempting the save (unique index)
    const existing = await ProfessionalAssociation.findOne({ name: newName }).lean<any>();
    if (existing && existing._id.toString() !== association._id.toString()) {
      return NextResponse.json({ error: "Association already exists" }, { status: 409 });
    }

    const oldName = association.name;
    association.name = newName;
    association.updatedBy = session.user.id || session.user._id;
    await association.save();

    // Keep members referencing the old name in sync
    await User.updateMany(
      { professionalAssociation: oldName },
      { $set: { professionalAssociation: newName } }
    );

    return NextResponse.json({ success: true, msg: "Association updated", data: association });
  } catch (error) {
    const status = error.code === 11000 ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? "Association already exists" : error.message || "Failed to update association" },
      { status }
    );
  }
}

/**
 * DELETE - Remove a professional association (admin only).
 * Members assigned to the removed association are cleared back to "".
 */
export async function DELETE(request, context) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { id } = params;

    await dbConnect();

    const association = await ProfessionalAssociation.findOneAndDelete(associationQuery(id));
    if (!association) {
      return NextResponse.json({ error: "Association not found" }, { status: 404 });
    }

    await User.updateMany(
      { professionalAssociation: association.name },
      { $set: { professionalAssociation: "" } }
    );

    return NextResponse.json({ success: true, msg: "Association deleted", data: association });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete association" },
      { status: 500 }
    );
  }
}
