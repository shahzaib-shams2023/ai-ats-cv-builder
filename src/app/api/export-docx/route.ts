import { NextRequest, NextResponse } from 'next/server';
import { generateDocxBuffer } from '@/lib/export/export-docx';
import { CVProfile, SectionSettings, TemplateId } from '@/types/cv';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, settings, templateId, filename } = body;

    if (!profile || !profile.contact) {
      return NextResponse.json(
        { success: false, error: { message: 'Candidate profile is required' } },
        { status: 400 }
      );
    }

    const docxBuffer = await generateDocxBuffer(
      profile as CVProfile,
      settings as SectionSettings,
      (templateId as TemplateId) || 'ats-classic'
    );

    const safeFilename = (filename || `${profile.contact.fullName || 'Resume'}_CV.docx`)
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    const uint8Array = new Uint8Array(docxBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length': uint8Array.byteLength.toString()
      }
    });
  } catch (error) {
    console.error('Error generating DOCX export:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to generate DOCX file' } },
      { status: 500 }
    );
  }
}

