import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/gemini';
import { VaultDocument } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { document } = body as { document: VaultDocument };

    if (!document || !document.title) {
      return NextResponse.json({ error: 'Document data is required' }, { status: 400 });
    }

    const simplifiedText = await GeminiService.simplifyDocument(document);

    return NextResponse.json({
      success: true,
      explanation: simplifiedText,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/simplify:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to simplify document' },
      { status: 500 }
    );
  }
}
