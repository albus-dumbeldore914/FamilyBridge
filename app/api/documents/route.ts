import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - fetch all documents
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const vaultDocs = documents.map((doc) => ({
      id: doc.id,
      familyId: doc.familyId,
      title: doc.title,
      fileName: doc.fileName || undefined,
      fileSize: doc.fileSize || undefined,
      fileType: doc.fileType || undefined,
      fileData: doc.fileData || undefined,
      category: doc.category as any,
      documentType: doc.documentType,
      uploadedBy: doc.uploadedById || undefined,
      uploadedAt: doc.uploadedAt.toISOString(),
      status: doc.status,
      extractedData: (doc.extractedData as any) || {},
      visibility: (doc.visibility as any) || {},
      recipientTarget: doc.recipientTarget || undefined,
      purpose: doc.purpose || undefined,
    }));

    return NextResponse.json({ success: true, documents: vaultDocs });
  } catch (error: any) {
    console.error('GET /api/documents error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - create a new document
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      fileName,
      fileSize,
      fileType,
      fileData,
      category,
      documentType,
      uploadedBy,
      extractedData,
      visibility,
      recipientTarget,
      purpose,
      familyId,
      status,
    } = body;

    const doc = await prisma.document.create({
      data: {
        title: title || 'Untitled Document',
        fileName: fileName || null,
        fileSize: fileSize || null,
        fileType: fileType || null,
        fileData: fileData || null,
        category: category || 'other',
        documentType: documentType || 'other',
        uploadedById: uploadedBy || null,
        extractedData: extractedData || {},
        visibility: visibility || {},
        recipientTarget: recipientTarget || null,
        purpose: purpose || null,
        familyId: familyId || 'family_default',
        status: status || 'uploaded',
      },
    });

    return NextResponse.json({
      success: true,
      document: {
        id: doc.id,
        familyId: doc.familyId,
        title: doc.title,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        fileType: doc.fileType,
        fileData: doc.fileData,
        category: doc.category,
        documentType: doc.documentType,
        uploadedBy: doc.uploadedById,
        uploadedAt: doc.uploadedAt.toISOString(),
        status: doc.status,
        extractedData: doc.extractedData,
        visibility: doc.visibility,
        recipientTarget: doc.recipientTarget,
        purpose: doc.purpose,
      },
    });
  } catch (error: any) {
    console.error('POST /api/documents error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - remove a document by id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/documents error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
