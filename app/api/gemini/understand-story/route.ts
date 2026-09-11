import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/gemini';
import { PermissionService } from '@/services/permissions';
import { VaultDocument, UserRole } from '@/lib/types';
import { INITIAL_DOCUMENTS, INITIAL_MEMBERS } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      story,
      userRole = 'guardian',
      memberId = 'member_priya',
      isContinuityMode = true,
      customDocuments,
    } = body;

    if (!story || typeof story !== 'string') {
      return NextResponse.json({ error: 'Human story is required' }, { status: 400 });
    }

    const allDocs: VaultDocument[] =
      customDocuments && Array.isArray(customDocuments)
        ? customDocuments
        : INITIAL_DOCUMENTS;

    const authorizedDocs = PermissionService.filterDocumentsForUser(
      allDocs,
      userRole as UserRole,
      memberId,
      Boolean(isContinuityMode)
    );

    const result = await GeminiService.understandHumanStory(
      story,
      authorizedDocs,
      INITIAL_MEMBERS
    );

    return NextResponse.json({
      success: true,
      data: result,
      authorizedDocCount: authorizedDocs.length,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/understand-story:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze story' },
      { status: 500 }
    );
  }
}
