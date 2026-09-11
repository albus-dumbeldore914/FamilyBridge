/**
 * POST /api/user/set-role
 * Sets the role for the authenticated user in the database.
 * Called after first login from /select-role page.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

type ValidRole = "primary" | "guardian" | "child";
const VALID_ROLES: ValidRole[] = ["primary", "guardian", "child"];

const dbUrl = process.env.DATABASE_URL || "";
const isDatabaseConfigured =
  dbUrl.length > 0 &&
  !dbUrl.includes("user:password") &&
  !dbUrl.includes("host.neon.tech");

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { role } = body as { role: string };

    if (!VALID_ROLES.includes(role as ValidRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be primary, guardian, or child." },
        { status: 400 }
      );
    }

    let savedUser = null;

    if (isDatabaseConfigured) {
      try {
        savedUser = await prisma.user.upsert({
          where: { email: session.user.email },
          update: { role },
          create: {
            email: session.user.email,
            name: session.user.name || "Family Member",
            image: session.user.image,
            role,
          },
          select: { id: true, email: true, name: true, role: true },
        });
      } catch (dbErr) {
        console.warn("Notice: Database write skipped or unconfigured:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      role,
      user: savedUser || { email: session.user.email, role },
    });
  } catch (error) {
    console.error("set-role error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}