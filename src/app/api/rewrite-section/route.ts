import { NextRequest, NextResponse } from 'next/server';
import { rewriteSectionContent, RewriteMode } from '@/lib/ai/rewrite-section';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, mode, jobContext, customInstructions, apiKey, provider, model } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_text',
            message: 'Text to rewrite is required'
          }
        },
        { status: 400 }
      );
    }

    const validModes: RewriteMode[] = [
      'professional',
      'shorter',
      'more_impactful',
      'more_technical',
      'senior_executive',
      'ats_tailored',
      'fix_grammar',
      'custom'
    ];

    const selectedMode: RewriteMode = validModes.includes(mode) ? mode : 'professional';

    const configOverride = {
      apiKey: apiKey || req.headers.get('x-api-key') || undefined,
      provider: provider || undefined,
      model: model || undefined
    };

    const rewrittenText = await rewriteSectionContent(
      text,
      selectedMode,
      jobContext,
      customInstructions,
      configOverride
    );

    return NextResponse.json({
      success: true,
      data: {
        rewrittenText
      }
    });
  } catch (error) {
    console.error('Error rewriting section:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'rewrite_failed',
          message: error instanceof Error ? error.message : 'Failed to rewrite section'
        }
      },
      { status: 500 }
    );
  }
}

