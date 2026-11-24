import { callLLM, LLMConfig } from './provider';

export type RewriteMode =
  | 'professional'
  | 'shorter'
  | 'more_impactful'
  | 'more_technical'
  | 'senior_executive'
  | 'ats_tailored'
  | 'fix_grammar'
  | 'custom';

export async function rewriteSectionContent(
  originalText: string,
  mode: RewriteMode,
  jobContext?: string,
  customInstructions?: string,
  configOverride?: Partial<LLMConfig>
): Promise<string> {
  const modePrompts: Record<RewriteMode, string> = {
    professional: 'Rewrite this text in a polished, highly professional tone suitable for modern executive CVs.',
    shorter: 'Condense this text to make it tighter and punchier, removing filler words while keeping core facts.',
    more_impactful: 'Make this text significantly more accomplishment-driven, leading with powerful action verbs.',
    more_technical: 'Emphasize engineering depth, technical architecture, and system reliability without inventing new tools.',
    senior_executive: 'Reframe this text for a senior leadership or staff engineer role, highlighting ownership, mentorship, and business outcomes.',
    ats_tailored: `Optimize this content to naturally incorporate keywords and responsibilities relevant to: ${jobContext || 'target role'}.`,
    fix_grammar: 'Correct all grammar, typos, passive voice, and phrasing inconsistencies while preserving exact meaning.',
    custom: customInstructions || 'Improve this text according to high-standard resume best practices.'
  };

  const instruction = modePrompts[mode] || modePrompts.professional;

  const systemPrompt = `You are an elite career coach and resume editor.
${instruction}
CRITICAL RULES:
- Never fabricate experience, metrics, degrees, or tools not implied in the source.
- Preserve the underlying facts.
- Output ONLY the rewritten text without markdown code blocks, conversational filler, or introductory greetings.`;

  const userPrompt = `Source text:\n${originalText}\n\nTarget Position Context: ${jobContext || 'Software Engineering'}`;

  const llmResult = await callLLM(
    { systemPrompt, userPrompt, temperature: 0.2 },
    configOverride
  );

  if (llmResult && llmResult.trim().length > 10) {
    return llmResult.replace(/^["']|["']$/g, '').trim();
  }

  // Heuristic transformation fallback
  return applyHeuristicRewrite(originalText, mode);
}

function applyHeuristicRewrite(text: string, mode: RewriteMode): string {
  let cleaned = text.trim();

  if (mode === 'more_impactful') {
    cleaned = cleaned
      .replace(/\bworked on\b/gi, 'Spearheaded and delivered')
      .replace(/\bhelped build\b/gi, 'Architected and implemented')
      .replace(/\bresponsible for\b/gi, 'Led end-to-end execution of')
      .replace(/\bmanaged\b/gi, 'Directed and scaled');
  } else if (mode === 'shorter') {
    cleaned = cleaned
      .replace(/\bin order to\b/gi, 'to')
      .replace(/\bresponsible for the development of\b/gi, 'developed')
      .replace(/\bsuccessfully\b/gi, '')
      .replace(/\s+/g, ' ');
  } else if (mode === 'more_technical') {
    cleaned = cleaned
      .replace(/\bbuilt an app\b/gi, 'architected a scalable application')
      .replace(/\bfixed bugs\b/gi, 'diagnosed root causes and deployed zero-regression patches')
      .replace(/\bmade faster\b/gi, 'optimized query latency and computational throughput');
  } else if (mode === 'senior_executive') {
    cleaned = cleaned
      .replace(/\bbuilt\b/gi, 'Spearheaded the technical roadmap and delivery of')
      .replace(/\bdeveloped\b/gi, 'Architected enterprise-grade');
  }

  // Formatting cleanup
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  if (!cleaned.endsWith('.') && !cleaned.endsWith('!') && !cleaned.endsWith('?')) {
    cleaned += '.';
  }

  return cleaned;
}

