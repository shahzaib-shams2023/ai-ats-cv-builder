import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromBuffer } from '@/lib/parser/extract-text';
import { parseCVText } from '@/lib/parser/parse-cv-structure';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_file',
            message: 'No CV document file provided'
          }
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'file_too_large',
            message: `File exceeds maximum allowed size of 10MB (file is ${(file.size / 1024 / 1024).toFixed(2)}MB)`
          }
        },
        { status: 400 }
      );
    }

    const filename = file.name || 'document';
    const extension = filename.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_file_type',
            message: `Unsupported file extension .${extension}. Please upload a PDF, DOCX, DOC, or TXT document.`
          }
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract raw text
    const extraction = await extractTextFromBuffer(buffer, filename);
    const rawText = extraction.text;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'empty_document',
            message: 'Could not extract any readable text from the document. If it is an image-only scan, please use a searchable PDF or enter details manually.'
          }
        },
        { status: 422 }
      );
    }

    // Parse structured CV profile
    const profile = parseCVText(rawText);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        rawText,
        filename,
        format: extraction.format,
        pageCount: extraction.pageCount,
        warnings: extraction.warnings || []
      }
    });
  } catch (error) {
    console.error('Error parsing CV document:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'parsing_error',
          message: error instanceof Error ? error.message : 'Failed to parse CV document'
        }
      },
      { status: 500 }
    );
  }
}

