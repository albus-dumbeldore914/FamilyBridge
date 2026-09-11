import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - fetch all family members
export async function GET() {
  try {
    const members = await prisma.familyMember.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const formatted = members.map((m) => ({
      id: m.id,
      familyId: m.familyId,
      name: m.name,
      relationship: m.relationship as any,
      age: m.age,
      email: m.email || undefined,
      phone: m.phone || undefined,
      avatarUrl: m.avatarUrl || undefined,
      isTrustedContact: m.isTrustedContact,
      canAccessContinuity: m.canAccessContinuity,
    }));

    return NextResponse.json({ success: true, members: formatted });
  } catch (error: any) {
    console.error('GET /api/members error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - create a new family member
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const member = await prisma.familyMember.create({
      data: {
        name: body.name,
        relationship: body.relationship,
        age: body.age || 0,
        email: body.email || null,
        phone: body.phone || null,
        avatarUrl: body.avatarUrl || null,
        familyId: body.familyId || 'family_default',
        isTrustedContact: body.isTrustedContact ?? false,
        canAccessContinuity: body.canAccessContinuity ?? false,
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    console.error('POST /api/members error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
