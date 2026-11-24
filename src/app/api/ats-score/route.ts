import { NextRequest, NextResponse } from 'next/server';
import { calculateATSScore } from '@/lib/ai/ats-analyzer';
import { CVProfile, JobAnalysis } from '@/types/cv';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, jobAnalysis } = body;

    if (!profile || !jobAnalysis) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_input',
            message: 'Both CV profile and job analysis are required to compute ATS score'
          }
        },
        { status: 400 }
      );
    }

    const atsAnalysis = calculateATSScore(profile as CVProfile, jobAnalysis as JobAnalysis);

    return NextResponse.json({
      success: true,
      data: {
        atsAnalysis
      }
    });
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'scoring_failed',
          message: error instanceof Error ? error.message : 'Failed to calculate ATS score'
        }
      },
      { status: 500 }
    );
  }
}

