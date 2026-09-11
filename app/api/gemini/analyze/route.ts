import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/services/gemini';
import { INITIAL_MEMBERS } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, fileContent = '', documentType } = body;

    if (!fileName) {
      return NextResponse.json({ error: 'Missing fileName' }, { status: 400 });
    }

    // 1. Automatic classification if type is not predetermined
    const classification = await GeminiService.classifyDocument(fileContent, fileName);

    // 2. Structured entity extraction
    const extractedData = await GeminiService.extractDocumentData(
      fileContent,
      fileName,
      documentType || classification.documentType,
      INITIAL_MEMBERS
    );

    return NextResponse.json({
      success: true,
      classification,
      extractedData,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
