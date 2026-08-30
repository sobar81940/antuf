import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import dbConnect from "@/utils/dbConnect";
import ProfessionalAssociation from "@/models/ProfessionalAssociation";
import { WOMEN_NAME, WOMEN_NAME_EN, WOMEN_SLUG } from "@/utils/womenCommittee";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

/**
 * GET - Ensure the dedicated Women's Committee association exists and return it.
 *
 * The women's organization is intentionally kept as a SEPARATE association so
 * admins can build and manage an independent committee structure for it
 * (without inheriting the parent organization's structure).
 */
export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    let association = await ProfessionalAssociation.findOne({ slug: WOMEN_SLUG }).exec();

    if (!association) {
      try {
        association = await ProfessionalAssociation.create({
          name: WOMEN_NAME,
          englishName: WOMEN_NAME_EN,
          slug: WOMEN_SLUG,
          createdBy: session.user.id || session.user._id,
        });
      } catch (error) {
        // Handle a concurrent-creation race on the unique slug index.
        if (error?.code === 11000) {
          association = await ProfessionalAssociation.findOne({ slug: WOMEN_SLUG }).exec();
        } else {
          throw error;
        }
      }
    }

    if (!association) {
      return NextResponse.json(
        { error: "Unable to load or create the Women's Committee association" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: association });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load the Women's Committee association" },
      { status: 500 }
    );
  }
}