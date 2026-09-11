import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/gemini';
import { PermissionService } from '@/services/permissions';
import { VaultDocument, UserRole } from '@/lib/types';
import { INITIAL_DOCUMENTS, INITIAL_MEMBERS } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userRole = 'guardian',
      memberId = 'member_priya',
      isContinuityMode = true,
      customDocuments,
      reason = 'Primary member unavailable',
    } = body;

    const allDocs: VaultDocument[] = customDocuments && Array.isArray(customDocuments)
      ? customDocuments
      : INITIAL_DOCUMENTS;

    // RBAC authorized documents
    const authorizedDocs = PermissionService.filterDocumentsForUser(
      allDocs,
      userRole as UserRole,
      memberId,
      Boolean(isContinuityMode)
    );

    const plan = await GeminiService.generateContinuityPlan(
      authorizedDocs,
      INITIAL_MEMBERS,
      reason
    );

    return NextResponse.json({
      success: true,
      actions: plan,
      analyzedDocCount: authorizedDocs.length,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/action-plan:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate continuity action plan' },
      { status: 500 }
    );
  }
}
