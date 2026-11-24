import { CVProfile, JobAnalysis, WorkExperience, SkillCategory } from '@/types/cv';
import { callLLM, LLMConfig } from './provider';

export async function generateTailoredCV(
  originalProfile: CVProfile,
  jobAnalysis: JobAnalysis,
  lockedSections: Record<string, boolean> = {},
  configOverride?: Partial<LLMConfig>
): Promise<CVProfile> {
  const tailoredProfile: CVProfile = JSON.parse(JSON.stringify(originalProfile));

  // 1. Professional Summary (if not locked)
  if (!lockedSections.summary) {
    tailoredProfile.professionalSummary = await generateTailoredSummary(
      originalProfile,
      jobAnalysis,
      configOverride
    );
  }

  // 2. Work Experience (if not locked)
  if (!lockedSections.experience) {
    tailoredProfile.experiences = await generateTailoredExperiences(
      originalProfile.experiences,
      jobAnalysis,
      configOverride
    );
  }

  // 3. Skills (if not locked)
  if (!lockedSections.skills) {
    tailoredProfile.skillCategories = prioritizeSkills(
      originalProfile.skillCategories,
      jobAnalysis
    );
  }

  // 4. Projects (if not locked)
  if (!lockedSections.projects && originalProfile.projects.length > 0) {
    tailoredProfile.projects = originalProfile.projects.map(proj => {
      // Prioritize relevant tools in the project
      const matchingTools = proj.tools.filter(t => 
        jobAnalysis.requiredSkills.some(r => r.toLowerCase() === t.toLowerCase()) ||
        jobAnalysis.preferredSkills.some(p => p.toLowerCase() === t.toLowerCase())
      );
      const otherTools = proj.tools.filter(t => !matchingTools.includes(t));
      return {
        ...proj,
        tools: [...matchingTools, ...otherTools]
      };
    });
  }

  return tailoredProfile;
}

async function generateTailoredSummary(
  originalProfile: CVProfile,
  jobAnalysis: JobAnalysis,
  configOverride?: Partial<LLMConfig>
): Promise<string> {
  // Extract user's verified skills
  const verifiedSkills = originalProfile.skillCategories.flatMap(c => c.skills);
  const matchingSkills = verifiedSkills.filter(s => 
    jobAnalysis.requiredSkills.some(r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())) ||
    jobAnalysis.keywords.some(k => k.toLowerCase() === s.toLowerCase())
  );

  const systemPrompt = `You are an elite executive resume writer specializing in ATS-optimized career profiles.
Rewrite the professional summary to target the position of ${jobAnalysis.jobTitle} at ${jobAnalysis.company}.
CRITICAL SAFETY & ACCURACY RULES:
- Ground all claims strictly in the candidate's existing background: ${originalProfile.professionalSummary || originalProfile.contact.professionalTitle}.
- Emphasize these verified candidate skills that match the job: ${matchingSkills.slice(0, 6).join(', ') || verifiedSkills.slice(0, 4).join(', ')}.
- NEVER invent degrees, certifications, metrics, or years of experience.
- Keep length to 3-4 impactful sentences (approx. 50-70 words).
- Output ONLY the rewritten summary text, with no conversational filler or quotes.`;

  const userPrompt = `Current Summary:\n${originalProfile.professionalSummary}\n\nCandidate Title: ${originalProfile.contact.professionalTitle}`;

  const llmResult = await callLLM(
    { systemPrompt, userPrompt, temperature: 0.2 },
    configOverride
  );

  if (llmResult && llmResult.trim().length > 30) {
    return llmResult.replace(/^["']|["']$/g, '').trim();
  }

  // Heuristic grounded fallback
  const topSkills = matchingSkills.length > 0 ? matchingSkills.slice(0, 4).join(', ') : verifiedSkills.slice(0, 4).join(', ');
  const title = jobAnalysis.jobTitle || originalProfile.contact.professionalTitle || 'Software Engineer';
  return `Results-driven ${title} with a proven background in delivering scalable, high-performance systems. Deep technical proficiency in ${topSkills}. Committed to engineering excellence, maintainable architecture, and collaborative problem-solving tailored to ${jobAnalysis.company || 'enterprise'} standards.`;
}

async function generateTailoredExperiences(
  experiences: WorkExperience[],
  jobAnalysis: JobAnalysis,
  configOverride?: Partial<LLMConfig>
): Promise<WorkExperience[]> {
  const result: WorkExperience[] = [];

  for (const exp of experiences) {
    const updatedHighlights: string[] = [];

    for (const bullet of exp.highlights) {
      const rewritten = await rewriteExperienceBullet(bullet, exp.jobTitle, jobAnalysis, configOverride);
      updatedHighlights.push(rewritten);
    }

    result.push({
      ...exp,
      highlights: updatedHighlights
    });
  }

  return result;
}

async function rewriteExperienceBullet(
  bullet: string,
  jobTitle: string,
  jobAnalysis: JobAnalysis,
  configOverride?: Partial<LLMConfig>
): Promise<string> {
  const systemPrompt = `You are a professional technical CV rewriter.
Enhance the following resume bullet point to make it more impactful, accomplishment-driven, and ATS-friendly for a ${jobAnalysis.jobTitle} role.
CRITICAL RULES:
- Preserve the exact underlying facts, metrics, and technologies.
- NEVER invent new technologies, numbers, or achievements not mentioned in the original bullet.
- Start with a strong action verb (e.g., Architected, Spearheaded, Engineered, Optimized, Delivered, Formulated).
- Emphasize business impact and technical precision.
- Output ONLY the single rewritten bullet point without quotes or bullets.`;

  const userPrompt = `Original Bullet:\n${bullet}`;

  const llmResult = await callLLM(
    { systemPrompt, userPrompt, temperature: 0.2 },
    configOverride
  );

  if (llmResult && llmResult.trim().length > 15) {
    return llmResult.replace(/^[•\-*⁃–]\s*/, '').replace(/^["']|["']$/g, '').trim();
  }

  // Heuristic enhancement
  return enhanceBulletHeuristic(bullet);
}

const ACTION_VERBS = ['Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Delivered', 'Streamlined', 'Implemented'];

function enhanceBulletHeuristic(bullet: string): string {
  let cleaned = bullet.replace(/^[•\-*⁃–]\s*/, '').trim();
  
  // Replace weak starters like "Worked on", "Helped with", "Responsible for", "Built"
  const weakStarters: Record<string, string> = {
    'worked on': 'Architected and developed',
    'helped with': 'Collaborated to build',
    'responsible for': 'Directed and executed',
    'assisted in': 'Contributed to engineering',
    'made': 'Engineered',
    'did': 'Delivered'
  };

  const lower = cleaned.toLowerCase();
  for (const [weak, strong] of Object.entries(weakStarters)) {
    if (lower.startsWith(weak)) {
      cleaned = strong + cleaned.slice(weak.length);
      break;
    }
  }

  // Ensure capital start and period end
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  if (!cleaned.endsWith('.')) {
    cleaned += '.';
  }

  return cleaned;
}

function prioritizeSkills(
  categories: SkillCategory[],
  jobAnalysis: JobAnalysis
): SkillCategory[] {
  const reqLower = jobAnalysis.requiredSkills.map(s => s.toLowerCase());
  const prefLower = jobAnalysis.preferredSkills.map(s => s.toLowerCase());

  return categories.map(cat => {
    // Sort skills: required first, then preferred, then other existing skills
    const sortedSkills = [...cat.skills].sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();

      const aReq = reqLower.includes(aLower);
      const bReq = reqLower.includes(bLower);
      if (aReq && !bReq) return -1;
      if (!aReq && bReq) return 1;

      const aPref = prefLower.includes(aLower);
      const bPref = prefLower.includes(bLower);
      if (aPref && !bPref) return -1;
      if (!aPref && bPref) return 1;

      return 0;
    });

    return {
      ...cat,
      skills: sortedSkills
    };
  });
}

