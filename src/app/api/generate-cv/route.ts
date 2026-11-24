import { NextRequest, NextResponse } from 'next/server';
import { generateTailoredCV } from '@/lib/ai/generate-cv';
import { calculateATSScore } from '@/lib/ai/ats-analyzer';
import { CVProfile, JobAnalysis } from '@/types/cv';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, jobAnalysis, lockedSections, apiKey, provider, model } = body;

    if (!profile || !profile.contact) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_profile',
            message: 'Valid candidate profile is required'
          }
        },
        { status: 400 }
      );
    }

    if (!jobAnalysis || !jobAnalysis.jobTitle) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_job_analysis',
            message: 'Job analysis is required'
          }
        },
        { status: 400 }
      );
    }

    const configOverride = {
      apiKey: apiKey || req.headers.get('x-api-key') || undefined,
      provider: provider || undefined,
      model: model || undefined
    };

    const tailoredProfile = await generateTailoredCV(
      profile as CVProfile,
      jobAnalysis as JobAnalysis,
      lockedSections || {},
      configOverride
    );

    const atsAnalysis = calculateATSScore(tailoredProfile, jobAnalysis as JobAnalysis);

    return NextResponse.json({
      success: true,
      data: {
        tailoredProfile,
        atsAnalysis
      }
    });
  } catch (error) {
    console.error('Error generating tailored CV:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'generation_failed',
          message: error instanceof Error ? error.message : 'Failed to generate tailored CV'
        }
      },
      { status: 500 }
    );
  }
}

