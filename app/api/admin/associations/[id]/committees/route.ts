import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import ProfessionalAssociation from "@/models/ProfessionalAssociation";
import Committee from "@/models/Committee";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

/**
 * GET - List committees of an association (admin only).
 */
export async function GET(request, context) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { id } = params;

    await dbConnect();

    // The URL can use either a legacy database id or the association slug.
    const associationExists = await ProfessionalAssociation.findOne(
      /^[a-f\d]{24}$/i.test(id) ? { _id: id } : { slug: id }
    ).lean<any>();
    if (!associationExists) {
      return NextResponse.json({ error: "Association not found" }, { status: 404 });
    }

    const committees = await Committee.find({ association: associationExists._id })
      .populate("members", "name email image")
      .populate("memberDetails.member", "name email image")
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json({ success: true, data: committees });
  } catch (error) {
    console.error("[Committees GET] error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to load committees",
        name: error.name,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a committee under an association (admin only).
 */
export async function POST(request, context) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { id } = params;

    const body = await request.json();
    const name = body?.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Committee name is required" }, { status: 400 });
    }

    await dbConnect();

    const association = await ProfessionalAssociation.findOne(
      /^[a-f\d]{24}$/i.test(id) ? { _id: id } : { slug: id }
    ).lean<any>();
    if (!association) {
      return NextResponse.json({ error: "Association not found" }, { status: 404 });
    }

    const committee = await Committee.create({
      name,
      nameEn: body?.nameEn?.trim() || "",
      type: body?.type || "",
      provinceName: body?.provinceName?.trim() || "",
      provinceNameEn: body?.provinceNameEn?.trim() || "",
      districtName: body?.districtName?.trim() || "",
      districtNameEn: body?.districtNameEn?.trim() || "",
      association: association._id,
      createdBy: session.user.id || session.user._id,
    });

    return NextResponse.json({ success: true, data: committee }, { status: 201 });
  } catch (error) {
    const status = error.code === 11000 ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? "A committee with this name already exists" : error.message || "Failed to create committee" },
      { status }
    );
  }
}
