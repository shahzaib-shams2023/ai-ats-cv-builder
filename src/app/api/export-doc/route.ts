import { NextRequest, NextResponse } from 'next/server';
import { generateDocBuffer } from '@/lib/export/export-doc';
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

    const docBuffer = await generateDocBuffer(
      profile as CVProfile,
      settings as SectionSettings,
      (templateId as TemplateId) || 'ats-classic'
    );

    const safeFilename = (filename || `${profile.contact.fullName || 'Resume'}_CV.doc`)
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    const uint8Array = new Uint8Array(docBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/msword',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length': uint8Array.byteLength.toString()
      }
    });
  } catch (error) {
    console.error('Error generating DOC export:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to generate DOC file' } },
      { status: 500 }
    );
  }
}

