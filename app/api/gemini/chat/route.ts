import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/gemini';
import { PermissionService } from '@/services/permissions';
import { VaultDocument, UserRole } from '@/lib/types';
import { INITIAL_DOCUMENTS } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      userRole = 'primary',
      memberId = 'member_ramesh',
      isContinuityMode = false,
      customDocuments,
    } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Combine any user-uploaded documents with initial vault
    const allDocs: VaultDocument[] = customDocuments && Array.isArray(customDocuments)
      ? customDocuments
      : INITIAL_DOCUMENTS;

    // Strict RBAC filtering: only authorize documents this user is permitted to see
    const authorizedDocs = PermissionService.filterDocumentsForUser(
      allDocs,
      userRole as UserRole,
      memberId,
      Boolean(isContinuityMode)
    );

    const response = await GeminiService.answerFamilyQuestion(
      question,
      authorizedDocs,
      userRole
    );

    return NextResponse.json({
      success: true,
      answer: response.text,
      citedDocumentIds: response.citedDocumentIds,
      suggestedPrompts: response.suggestedPrompts,
      authorizedDocCount: authorizedDocs.length,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process chat query' },
      { status: 500 }
    );
  }
}
