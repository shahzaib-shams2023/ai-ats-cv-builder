import { CVProfile, WorkExperience, Education, SkillCategory, Project, Certification, Award, Language } from '@/types/cv';

function cleanLine(line: string): string {
  return line.trim().replace(/\s+/g, ' ');
}

// Generate unique ID
function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

// Section heading detector
const SECTION_KEYWORDS: Record<string, RegExp> = {
  summary: /^(summary|professional summary|executive summary|profile|about me|career summary|career objective|objective)$/i,
  experience: /^(experience|work experience|employment history|professional experience|work history|relevant experience)$/i,
  education: /^(education|academic background|academic history|educational background|qualifications)$/i,
  skills: /^(skills|technical skills|core competencies|competencies|areas of expertise|technologies|tools & technologies)$/i,
  projects: /^(projects|key projects|personal projects|technical projects|notable projects)$/i,
  certifications: /^(certifications|licenses|certificates|credentials|certifications & licenses)$/i,
  awards: /^(awards|honors|honors & awards|accolades|achievements)$/i,
  languages: /^(languages|language proficiencies|spoken languages)$/i,
};

export function parseCVText(rawText: string): CVProfile {
  const lines = rawText.split(/\r?\n/).map(cleanLine).filter(l => l.length > 0);
  
  // Extract contact info
  const contact = extractContactInfo(lines, rawText);

  // Group lines into sections
  const sections = segmentSections(lines);

  // Extract each section
  const professionalSummary = extractSummary(sections.summary || []);
  const experiences = extractExperiences(sections.experience || []);
  const education = extractEducation(sections.education || []);
  const skillCategories = extractSkills(sections.skills || []);
  const projects = extractProjects(sections.projects || []);
  const certifications = extractCertifications(sections.certifications || []);
  const awards = extractAwards(sections.awards || []);
  const languages = extractLanguages(sections.languages || []);

  return {
    contact,
    professionalSummary,
    experiences,
    education,
    skillCategories,
    projects,
    certifications,
    awards,
    languages,
    customSections: []
  };
}

function extractContactInfo(lines: string[], fullText: string) {
  // Email
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone
  const phoneMatch = fullText.match(/(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{10,15})/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // URLs
  const linkedinMatch = fullText.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedinUrl = linkedinMatch ? linkedinMatch[0] : undefined;

  const githubMatch = fullText.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const githubUrl = githubMatch ? githubMatch[0] : undefined;

  const portfolioMatch = fullText.match(/https?:\/\/(?!(?:www\.)?(?:linkedin|github)\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s,|]*)?/i);
  const portfolioUrl = portfolioMatch ? portfolioMatch[0] : undefined;

  // Location: look for "City, State" (e.g. "San Francisco, CA")
  let location = '';
  const locRegex = /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*,\s*(?:[A-Z]{2}\b|[A-Z][a-zA-Z]+))/;
  const locMatch = fullText.slice(0, 1000).match(locRegex);
  if (locMatch) {
    location = locMatch[1].trim();
  }

  // Name and title extraction from top header lines
  let fullName = '';
  let professionalTitle = '';

  const headerLines = lines.slice(0, 6);
  for (const line of headerLines) {
    if (line.includes('@') || line.includes('http') || line.includes('www.')) {
      continue;
    }

    // Name is usually the first non-URL/email line
    if (!fullName && /^[A-Z][a-zA-Z'.]+(?:\s+[A-Z][a-zA-Z'.]+)+$/.test(line) && !line.toLowerCase().includes('resume') && !line.toLowerCase().includes('curriculum')) {
      fullName = line;
    } else if (fullName && !professionalTitle && line.length < 60 && !line.includes('|')) {
      professionalTitle = line;
    }
  }

  return {
    fullName: fullName || (lines[0] && lines[0].length < 40 ? lines[0] : 'Your Name'),
    professionalTitle: professionalTitle || '',
    email,
    phone,
    location,
    linkedinUrl,
    githubUrl,
    portfolioUrl,
    additionalLinks: []
  };
}

function segmentSections(lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let currentKey = 'header';
  sections[currentKey] = [];

  for (const line of lines) {
    // Check if line matches a section header
    let matchedKey: string | null = null;
    const clean = line.replace(/[:\-_#=*]+$/g, '').trim();

    for (const [key, regex] of Object.entries(SECTION_KEYWORDS)) {
      if (regex.test(clean)) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      currentKey = matchedKey;
      if (!sections[currentKey]) {
        sections[currentKey] = [];
      }
    } else {
      if (!sections[currentKey]) {
        sections[currentKey] = [];
      }
      sections[currentKey].push(line);
    }
  }

  return sections;
}

function extractSummary(lines: string[]): string {
  return lines.join(' ').trim();
}

function extractExperiences(lines: string[]): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  let currentExp: Partial<WorkExperience> | null = null;
  const dateRegex = /(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?\b(19\d\d|20\d\d)\b\s*(?:–|-|to)\s*(?:(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?\b(19\d\d|20\d\d)\b|present|current)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = /^[•\-*⁃–]\s*/.test(line);
    const hasDate = dateRegex.test(line);

    // If it has pipe separator or date, or is a header line for a job
    const isHeaderLine = line.includes('|') || (!isBullet && hasDate) || (!isBullet && i + 1 < lines.length && dateRegex.test(lines[i + 1]));

    if (isHeaderLine && !isBullet) {
      if (currentExp && (currentExp.company || currentExp.jobTitle)) {
        experiences.push(finalizeExperience(currentExp));
      }

      currentExp = {
        id: makeId('exp'),
        highlights: []
      };

      if (line.includes('|')) {
        const parts = line.split('|').map(cleanLine);
        currentExp.jobTitle = parts[0] || 'Role';
        currentExp.company = parts[1] || 'Company';
        currentExp.location = parts[2] || '';
      } else {
        currentExp.jobTitle = line;
        currentExp.company = 'Company';
      }

      // Check if next line contains dates
      if (i + 1 < lines.length && dateRegex.test(lines[i + 1])) {
        const dateLine = lines[++i];
        const dateMatch = dateLine.match(dateRegex);
        if (dateMatch) {
          const parts = dateLine.split(/(?:–|-|to)/i);
          currentExp.startDate = cleanLine(parts[0] || '');
          currentExp.endDate = cleanLine(parts[1] || 'Present');
          currentExp.current = /present|current/i.test(currentExp.endDate);
        }
      }
    } else if (currentExp) {
      if (hasDate && (!currentExp.startDate || !currentExp.endDate)) {
        const parts = line.split(/(?:–|-|to)/i);
        currentExp.startDate = cleanLine(parts[0] || '');
        currentExp.endDate = cleanLine(parts[1] || 'Present');
        currentExp.current = /present|current/i.test(currentExp.endDate);
      } else {
        const bulletText = line.replace(/^[•\-*⁃–]\s*/, '').trim();
        if (bulletText) {
          currentExp.highlights = currentExp.highlights || [];
          currentExp.highlights.push(bulletText);
        }
      }
    }
  }

  if (currentExp && (currentExp.company || currentExp.jobTitle)) {
    experiences.push(finalizeExperience(currentExp));
  }

  return experiences;
}

function finalizeExperience(partial: Partial<WorkExperience>): WorkExperience {
  return {
    id: partial.id || makeId('exp'),
    jobTitle: partial.jobTitle || 'Role Title',
    company: partial.company || 'Company Name',
    location: partial.location || '',
    startDate: partial.startDate || '',
    endDate: partial.endDate || 'Present',
    current: partial.current ?? (/present|current/i.test(partial.endDate || '')),
    highlights: partial.highlights && partial.highlights.length > 0 ? partial.highlights : ['Led initiatives and contributed to key deliverables.']
  };
}

function extractEducation(lines: string[]): Education[] {
  const educationList: Education[] = [];
  let currentEdu: Partial<Education> | null = null;
  const degreeRegex = /(bachelor|master|doctor|ph\.?d|b\.?s|b\.?a|m\.?s|m\.?a|associate|diploma|b\.?sc|m\.?sc)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isDegree = degreeRegex.test(line);
    const isInst = line.toLowerCase().includes('university') || line.toLowerCase().includes('college') || line.toLowerCase().includes('institute') || line.toLowerCase().includes('school');

    if (isDegree) {
      if (currentEdu && currentEdu.degree && currentEdu.institution) {
        educationList.push(finalizeEducation(currentEdu));
        currentEdu = null;
      }
      if (!currentEdu) {
        currentEdu = { id: makeId('edu'), highlights: [] };
      }
      currentEdu.degree = line;
    } else if (isInst) {
      if (!currentEdu) {
        currentEdu = { id: makeId('edu'), highlights: [] };
      }
      if (line.includes('|')) {
        const parts = line.split('|').map(cleanLine);
        currentEdu.institution = parts[0];
        currentEdu.location = parts[1] || '';
      } else {
        currentEdu.institution = line;
      }
    } else if (currentEdu) {
      if (/\b(19\d\d|20\d\d)\b/.test(line)) {
        const parts = line.split(/(?:–|-|to)/i);
        currentEdu.startDate = cleanLine(parts[0] || '');
        currentEdu.endDate = cleanLine(parts[1] || parts[0]);
      } else if (/gpa/i.test(line)) {
        const gpaMatch = line.match(/GPA:?\s*([0-9.]+(?:\/[0-9.]+)?)/i);
        if (gpaMatch) {
          currentEdu.gpa = gpaMatch[1];
        }
      } else {
        currentEdu.highlights = currentEdu.highlights || [];
        currentEdu.highlights.push(line.replace(/^[•\-*⁃–]\s*/, ''));
      }
    }
  }

  if (currentEdu && (currentEdu.degree || currentEdu.institution)) {
    educationList.push(finalizeEducation(currentEdu));
  }

  return educationList;
}

function finalizeEducation(partial: Partial<Education>): Education {
  return {
    id: partial.id || makeId('edu'),
    degree: partial.degree || 'Degree Program',
    institution: partial.institution || 'University / Institution',
    location: partial.location || '',
    startDate: partial.startDate || '',
    endDate: partial.endDate || '',
    gpa: partial.gpa,
    highlights: partial.highlights || []
  };
}

function extractSkills(lines: string[]): SkillCategory[] {
  const categories: SkillCategory[] = [];

  function splitSkills(text: string): string[] {
    // Also extract base token from parentheses like "AWS (S3, Lambda)" -> "AWS", "S3", "Lambda"
    const cleaned = text.replace(/[()]/g, ',');
    return cleaned.split(/[,|•]/).map(cleanLine).filter(s => s.length > 0 && s.length < 50);
  }
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [catName, skillStr] = line.split(':');
      const skills = splitSkills(skillStr);
      if (skills.length > 0) {
        categories.push({
          id: makeId('skill-cat'),
          name: cleanLine(catName),
          skills
        });
      }
    } else {
      const skills = splitSkills(line);
      if (skills.length > 0) {
        const defaultCat = categories.find(c => c.name === 'Technical Skills');
        if (defaultCat) {
          defaultCat.skills.push(...skills);
        } else {
          categories.push({
            id: makeId('skill-cat'),
            name: 'Technical Skills',
            skills
          });
        }
      }
    }
  }

  if (categories.length === 0) {
    categories.push({
      id: makeId('skill-cat'),
      name: 'Technical Skills',
      skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Problem Solving']
    });
  }

  return categories;
}

function extractProjects(lines: string[]): Project[] {
  const projects: Project[] = [];
  let currentProj: Partial<Project> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = /^[•\-*⁃–]\s*/.test(line);

    if (!isBullet && (line.includes('|') || !currentProj || line.includes('http'))) {
      if (currentProj && currentProj.name) {
        projects.push(finalizeProject(currentProj));
      }

      currentProj = {
        id: makeId('proj'),
        tools: [],
        highlights: []
      };

      if (line.includes('|')) {
        const parts = line.split('|').map(cleanLine);
        currentProj.name = parts[0];
        const urlMatch = parts[1]?.match(/https?:\/\/[^\s]+/);
        if (urlMatch) currentProj.url = urlMatch[0];
      } else {
        currentProj.name = line;
      }
    } else if (currentProj) {
      if (isBullet) {
        const bulletText = line.replace(/^[•\-*⁃–]\s*/, '').trim();
        currentProj.highlights = currentProj.highlights || [];
        currentProj.highlights.push(bulletText);
      } else if (line.toLowerCase().includes('tools:') || line.toLowerCase().includes('technologies:')) {
        const techStr = line.split(':')[1] || '';
        currentProj.tools = techStr.split(/[,|•]/).map(cleanLine).filter(t => t.length > 0);
      } else if (!currentProj.description) {
        currentProj.description = line;
      }
    }
  }

  if (currentProj && currentProj.name) {
    projects.push(finalizeProject(currentProj));
  }

  return projects;
}

function finalizeProject(partial: Partial<Project>): Project {
  return {
    id: partial.id || makeId('proj'),
    name: partial.name || 'Project Name',
    role: partial.role,
    tools: partial.tools || [],
    url: partial.url,
    githubUrl: partial.githubUrl,
    startDate: partial.startDate,
    endDate: partial.endDate,
    description: partial.description || '',
    highlights: partial.highlights && partial.highlights.length > 0 ? partial.highlights : ['Designed and implemented core architecture.']
  };
}

function extractCertifications(lines: string[]): Certification[] {
  const certs: Certification[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const clean = line.replace(/^[•\-*⁃–]\s*/, '').trim();
    if (clean.includes('|')) {
      const parts = clean.split('|').map(cleanLine);
      certs.push({
        id: makeId('cert'),
        name: parts[0] || 'Certification',
        issuer: parts[1] || 'Certifying Body',
        date: parts[2] || ''
      });
    } else {
      certs.push({
        id: makeId('cert'),
        name: clean,
        issuer: 'Professional Organization',
        date: ''
      });
    }
  }
  return certs;
}

function extractAwards(lines: string[]): Award[] {
  const awards: Award[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const clean = line.replace(/^[•\-*⁃–]\s*/, '').trim();
    if (clean.includes('|')) {
      const parts = clean.split('|').map(cleanLine);
      awards.push({
        id: makeId('award'),
        title: parts[0] || 'Award',
        issuer: parts[1] || '',
        date: parts[2] || ''
      });
    } else {
      awards.push({
        id: makeId('award'),
        title: clean,
        issuer: '',
        date: ''
      });
    }
  }
  return awards;
}

function extractLanguages(lines: string[]): Language[] {
  const langs: Language[] = [];
  const full = lines.join(', ');
  const items = full.split(/[,|•]/).map(cleanLine).filter(s => s.length > 0);

  for (const item of items) {
    const profMatch = item.match(/^(.*?)\s*\((Native|Fluent|Professional|Working|Basic)\)$/i);
    if (profMatch) {
      langs.push({
        id: makeId('lang'),
        language: cleanLine(profMatch[1]),
        proficiency: (profMatch[2].charAt(0).toUpperCase() + profMatch[2].slice(1).toLowerCase()) as any
      });
    } else if (item.length < 30) {
      langs.push({
        id: makeId('lang'),
        language: item,
        proficiency: 'Fluent'
      });
    }
  }
  return langs;
}
