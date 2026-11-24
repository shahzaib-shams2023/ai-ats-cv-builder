import { NextRequest, NextResponse } from 'next/server';
import { analyzeJobDescription } from '@/lib/ai/analyze-job';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobDescription, apiKey, provider, model } = body;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_job_description',
            message: 'Please provide a job description to analyze'
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

    const analysis = await analyzeJobDescription(jobDescription, configOverride);

    return NextResponse.json({
      success: true,
      data: {
        analysis
      }
    });
  } catch (error) {
    console.error('Error analyzing job description:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'analysis_failed',
          message: error instanceof Error ? error.message : 'Failed to analyze job description'
        }
      },
      { status: 500 }
    );
  }
}

