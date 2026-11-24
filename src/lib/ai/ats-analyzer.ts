import { CVProfile, JobAnalysis, ATSAnalysisResult } from '@/types/cv';

export function calculateATSScore(
  profile: CVProfile,
  jobAnalysis: JobAnalysis
): ATSAnalysisResult {
  const profileText = flattenProfileToText(profile).toLowerCase();

  // 1. Keyword Matching
  const allJobKeywords = Array.from(new Set([
    ...jobAnalysis.keywords,
    ...jobAnalysis.requiredSkills,
    ...jobAnalysis.preferredSkills,
    ...jobAnalysis.technicalRequirements
  ])).filter(k => k.trim().length > 1);

  const matchedKeywords: ATSAnalysisResult['matchedKeywords'] = [];
  const missingKeywords: ATSAnalysisResult['missingKeywords'] = [];

  for (const kw of allJobKeywords) {
    const kwLower = kw.toLowerCase();
    const regex = new RegExp(`\\b${kwLower.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    const matches = profileText.match(regex);
    const count = matches ? matches.length : 0;

    const isRequired = jobAnalysis.requiredSkills.some(s => s.toLowerCase() === kwLower);

    if (count > 0) {
      const foundIn: string[] = [];
      if (profile.professionalSummary.toLowerCase().includes(kwLower)) foundIn.push('Summary');
      if (profile.experiences.some(e => e.highlights.some(h => h.toLowerCase().includes(kwLower)) || e.jobTitle.toLowerCase().includes(kwLower))) foundIn.push('Experience');
      if (profile.skillCategories.some(c => c.skills.some(s => s.toLowerCase().includes(kwLower)))) foundIn.push('Skills');
      if (profile.projects.some(p => p.tools.some(t => t.toLowerCase().includes(kwLower)) || p.description.toLowerCase().includes(kwLower))) foundIn.push('Projects');

      matchedKeywords.push({
        keyword: kw,
        count,
        foundIn: foundIn.length > 0 ? foundIn : ['General'],
        category: isRequired ? 'Required Skill' : 'Technical Term'
      });
    } else {
      missingKeywords.push({
        keyword: kw,
        importance: isRequired ? 'high' : 'medium',
        reason: isRequired ? 'Target role lists this as a key requirement' : 'Frequently sought in relevant candidate profiles',
        suggestedPlacement: isRequired ? 'Skills section and relevant Work Experience bullet point' : 'Skills category or Projects'
      });
    }
  }

  // 2. Skills Matching & Gap
  const userSkills = profile.skillCategories.flatMap(c => c.skills.map(s => s.toLowerCase()));
  const matchedSkills: string[] = [];
  const skillsGap: string[] = [];

  for (const reqSkill of jobAnalysis.requiredSkills) {
    if (userSkills.some(u => u === reqSkill.toLowerCase() || u.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(u))) {
      matchedSkills.push(reqSkill);
    } else {
      skillsGap.push(reqSkill);
    }
  }

  for (const prefSkill of jobAnalysis.preferredSkills) {
    if (userSkills.some(u => u === prefSkill.toLowerCase() || u.includes(prefSkill.toLowerCase()))) {
      if (!matchedSkills.includes(prefSkill)) matchedSkills.push(prefSkill);
    } else {
      if (!skillsGap.includes(prefSkill)) skillsGap.push(prefSkill);
    }
  }

  // 3. Formatting and structural warnings
  const formattingWarnings: ATSAnalysisResult['formattingWarnings'] = [];

  if (!profile.contact.email) {
    formattingWarnings.push({
      type: 'error',
      section: 'Contact',
      message: 'Missing email address in contact header.',
      suggestion: 'Include a professional email address for recruiter contact.'
    });
  }

  if (!profile.contact.phone) {
    formattingWarnings.push({
      type: 'warning',
      section: 'Contact',
      message: 'Missing contact phone number.',
      suggestion: 'Provide a direct phone number with country/area code.'
    });
  }

  if (!profile.professionalSummary || profile.professionalSummary.length < 50) {
    formattingWarnings.push({
      type: 'warning',
      section: 'Summary',
      message: 'Professional summary is missing or too brief.',
      suggestion: 'Add a 2-4 sentence executive summary highlighting your top qualifications for this specific role.'
    });
  } else if (profile.professionalSummary.split(/\s+/).length > 100) {
    formattingWarnings.push({
      type: 'info',
      section: 'Summary',
      message: 'Professional summary is slightly long for high-speed ATS screening.',
      suggestion: 'Aim for 40-75 words focusing on your highest-impact achievements and core stack.'
    });
  }

  if (profile.experiences.length === 0) {
    formattingWarnings.push({
      type: 'error',
      section: 'Experience',
      message: 'No work experience entries listed.',
      suggestion: 'Add your employment history with clear bullet points detailing quantifiable achievements.'
    });
  } else {
    for (const exp of profile.experiences) {
      if (exp.highlights.length < 2) {
        formattingWarnings.push({
          type: 'warning',
          section: 'Experience',
          message: `Role at "${exp.company}" has fewer than 2 bullet points.`,
          suggestion: 'Provide at least 3 accomplishment-driven bullet points using strong action verbs.'
        });
      }
    }
  }

  if (profile.skillCategories.length === 0 || userSkills.length < 4) {
    formattingWarnings.push({
      type: 'warning',
      section: 'Skills',
      message: 'Skills list contains very few items.',
      suggestion: 'Group your competencies into clear categories (e.g., Languages, Frameworks, Cloud, Databases).'
    });
  }

  // 4. Score Calculation
  const totalKeywordsCount = Math.max(1, allJobKeywords.length);
  const keywordMatchRatio = matchedKeywords.length / totalKeywordsCount;
  const keywordScore = Math.min(100, Math.round(keywordMatchRatio * 100));

  const totalReqCount = Math.max(1, jobAnalysis.requiredSkills.length);
  const reqMatchRatio = matchedSkills.length / totalReqCount;
  const skillsScore = Math.min(100, Math.round(reqMatchRatio * 100));

  // Experience depth score
  let expScore = 75;
  if (profile.experiences.length >= 2) expScore += 15;
  if (profile.experiences.some(e => e.highlights.some(h => /\d+%|\$\d+|\b\d+\b\s*(users|clients|events|projects|engineers)/i.test(h)))) {
    expScore += 10;
  }
  expScore = Math.min(100, expScore);

  // Formatting score
  let formattingScore = 100;
  for (const w of formattingWarnings) {
    if (w.type === 'error') formattingScore -= 15;
    else if (w.type === 'warning') formattingScore -= 5;
  }
  formattingScore = Math.max(30, formattingScore);

  // Weighted overall score: 35% keywords, 35% skills, 20% experience, 10% formatting
  const rawOverall = (keywordScore * 0.35) + (skillsScore * 0.35) + (expScore * 0.20) + (formattingScore * 0.10);
  const overallScore = Math.max(20, Math.min(99, Math.round(rawOverall)));

  // 5. Actionable Suggestions
  const actionableSuggestions: string[] = [];
  if (skillsGap.length > 0) {
    actionableSuggestions.push(`Incorporate experience with ${skillsGap.slice(0, 3).join(', ')} if you have used them in your projects.`);
  }
  if (missingKeywords.filter(k => k.importance === 'high').length > 0) {
    const highMissing = missingKeywords.filter(k => k.importance === 'high').slice(0, 3).map(k => k.keyword);
    actionableSuggestions.push(`Align bullet points to demonstrate proficiency with required terminology: ${highMissing.join(', ')}.`);
  }
  actionableSuggestions.push('Use quantifiable metrics (percentages, dollar amounts, performance gains) in bullet points to boost recruiter impact.');
  if (formattingWarnings.length > 0) {
    actionableSuggestions.push(formattingWarnings[0].suggestion);
  }

  const tailoredSummaryRecommendation = `Results-oriented ${jobAnalysis.jobTitle} with proven expertise in ${matchedSkills.slice(0, 3).join(', ')}. Demonstrated success delivering scalable solutions aligned with ${jobAnalysis.company || 'enterprise'} standards.`;

  return {
    overallScore,
    breakdown: {
      keywordMatchScore: keywordScore,
      skillsMatchScore: skillsScore,
      experienceScore: expScore,
      formattingScore
    },
    matchedKeywords,
    missingKeywords: missingKeywords.sort((a, b) => (a.importance === 'high' ? -1 : 1)),
    matchedSkills,
    skillsGap,
    formattingWarnings,
    actionableSuggestions,
    tailoredSummaryRecommendation
  };
}

function flattenProfileToText(profile: CVProfile): string {
  const parts: string[] = [
    profile.contact.fullName,
    profile.contact.professionalTitle,
    profile.professionalSummary,
    ...profile.experiences.map(e => `${e.jobTitle} ${e.company} ${e.highlights.join(' ')} ${(e.relevantSkills || []).join(' ')}`),
    ...profile.education.map(ed => `${ed.degree} ${ed.institution} ${(ed.highlights || []).join(' ')}`),
    ...profile.skillCategories.map(sc => `${sc.name}: ${sc.skills.join(' ')}`),
    ...profile.projects.map(p => `${p.name} ${p.tools.join(' ')} ${p.description} ${p.highlights.join(' ')}`),
    ...profile.certifications.map(c => `${c.name} ${c.issuer}`),
    ...profile.awards.map(a => `${a.title} ${a.issuer}`),
    ...profile.languages.map(l => `${l.language} ${l.proficiency}`)
  ];
  return parts.join(' ');
}

