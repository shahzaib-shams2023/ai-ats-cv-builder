import { JobAnalysis } from '@/types/cv';
import { callLLM, LLMConfig } from './provider';

const COMMON_TECH_KEYWORDS = [
  'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Golang', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Tailwind CSS', 'Redux', 'GraphQL', 'RESTful APIs', 'HTML5', 'CSS3',
  'Node.js', 'Express', 'NestJS', 'Django', 'FastAPI', 'Spring Boot', '.NET Core',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra', 'SQLite',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Linux',
  'Microservices', 'Distributed Systems', 'Kafka', 'RabbitMQ', 'WebSockets', 'System Design',
  'Unit Testing', 'Jest', 'Vitest', 'Playwright', 'Cypress', 'TDD', 'Agile', 'Scrum', 'Git',
  'Machine Learning', 'AI', 'LLM', 'PyTorch', 'TensorFlow', 'Data Science', 'ETL', 'Snowflake'
];

export async function analyzeJobDescription(
  rawText: string,
  configOverride?: Partial<LLMConfig>
): Promise<JobAnalysis> {
  const systemPrompt = `You are an expert technical recruiter and ATS specialist.
Analyze the following job description thoroughly and extract structured requirements into valid JSON matching this schema:
{
  "jobTitle": string,
  "company": string,
  "seniorityLevel": string ("Junior" | "Mid" | "Senior" | "Lead" | "Staff" | "Principal" | "Director"),
  "requiredSkills": string[],
  "preferredSkills": string[],
  "technicalRequirements": string[],
  "qualifications": string[],
  "experienceRequirements": string[],
  "responsibilities": string[],
  "industryTerminology": string[],
  "keywords": string[],
  "competencies": string[]
}
Ensure you extract real technical requirements, not generic fluff. Return ONLY valid JSON without markdown wrapping.`;

  const userPrompt = `Job Description:\n${rawText}`;

  const llmResponse = await callLLM(
    {
      systemPrompt,
      userPrompt,
      responseFormat: 'json',
      temperature: 0.1
    },
    configOverride
  );

  if (llmResponse) {
    try {
      const cleanJson = llmResponse.replace(/^```json/m, '').replace(/^```/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        jobTitle: parsed.jobTitle || 'Target Role',
        company: parsed.company || 'Target Company',
        seniorityLevel: parsed.seniorityLevel || 'Mid-Senior',
        requiredSkills: parsed.requiredSkills || [],
        preferredSkills: parsed.preferredSkills || [],
        technicalRequirements: parsed.technicalRequirements || [],
        qualifications: parsed.qualifications || [],
        experienceRequirements: parsed.experienceRequirements || [],
        responsibilities: parsed.responsibilities || [],
        industryTerminology: parsed.industryTerminology || [],
        keywords: parsed.keywords || [],
        competencies: parsed.competencies || []
      };
    } catch (e) {
      console.warn('Failed to parse LLM job analysis JSON, falling back to NLP analyzer:', e);
    }
  }

  // Built-in heuristic NLP analyzer
  return analyzeJobWithNLP(rawText);
}

export function analyzeJobWithNLP(rawText: string): JobAnalysis {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  // Job title extraction
  let jobTitle = '';
  const titleLine = lines.find(l => /^job\s*title[:\s]/i.test(l) || /^role[:\s]/i.test(l) || /^position[:\s]/i.test(l));
  if (titleLine) {
    jobTitle = titleLine.replace(/^[^:]+:\s*/i, '').trim();
  } else if (lines.length > 0 && lines[0].length < 60 && !lines[0].toLowerCase().includes('about')) {
    jobTitle = lines[0];
  } else {
    jobTitle = 'Software Engineer';
  }

  // Company extraction
  let company = '';
  const companyLine = lines.find(l => /^company[:\s]/i.test(l) || /^organization[:\s]/i.test(l));
  if (companyLine) {
    company = companyLine.replace(/^[^:]+:\s*/i, '').trim();
  } else {
    const atMatch = rawText.match(/\bat\s+([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)*)/);
    company = atMatch ? atMatch[1] : 'Company';
  }

  // Seniority detection - prioritize title first
  let seniorityLevel = 'Mid-level';
  const titleLower = jobTitle.toLowerCase();
  if (/principal|staff/i.test(titleLower)) {
    seniorityLevel = 'Principal / Staff';
  } else if (/lead|architect|head\s+of|director/i.test(titleLower)) {
    seniorityLevel = 'Lead / Architect';
  } else if (/senior|sr\.?\b/i.test(titleLower)) {
    seniorityLevel = 'Senior';
  } else if (/junior|entry|intern|associate/i.test(titleLower)) {
    seniorityLevel = 'Junior / Entry-Level';
  } else if (/principal/i.test(rawText) || /staff/i.test(rawText)) {
    seniorityLevel = 'Principal / Staff';
  } else if (/senior|sr\.?\b/i.test(rawText) || /5\+\s*years|7\+\s*years|8\+\s*years/i.test(rawText)) {
    seniorityLevel = 'Senior';
  } else if (/\blead\b|head\s+of/i.test(rawText)) {
    seniorityLevel = 'Lead / Architect';
  } else if (/junior|entry|intern|associate/i.test(rawText)) {
    seniorityLevel = 'Junior / Entry-Level';
  }

  // Keyword & Tech Skills matching
  const foundSkills: string[] = [];
  const lowerText = rawText.toLowerCase();

  for (const tech of COMMON_TECH_KEYWORDS) {
    const regex = new RegExp(`\\b${tech.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(rawText) || lowerText.includes(tech.toLowerCase())) {
      foundSkills.push(tech);
    }
  }

  // Experience extraction
  const expMatch = rawText.match(/(\d+\+?\s*(?:-\s*\d+)?\s*years?(?:\s+of)?\s+experience[^\n.,;]*)/i);
  const experienceRequirements = expMatch ? [expMatch[0].trim()] : ['3+ years of relevant experience'];

  // Qualifications extraction
  const qualifications: string[] = [];
  if (/bachelor|master|degree\s+in\s+computer|b\.s|m\.s/i.test(rawText)) {
    qualifications.push("Bachelor's or Master's degree in Computer Science or related engineering field (or equivalent practical experience)");
  }

  // Segment sections for requirements vs preferred
  const reqSkills: string[] = [];
  const prefSkills: string[] = [];

  const splitSections = rawText.split(/(?:requirements|qualifications|what you bring|what we are looking for|preferred|nice to have)/i);
  if (splitSections.length >= 2) {
    const reqPart = splitSections[1];
    for (const s of foundSkills) {
      if (reqPart.toLowerCase().includes(s.toLowerCase())) {
        reqSkills.push(s);
      } else {
        prefSkills.push(s);
      }
    }
  }

  const finalReqSkills = reqSkills.length > 0 ? reqSkills : foundSkills.slice(0, 8);
  const finalPrefSkills = prefSkills.length > 0 ? prefSkills : foundSkills.slice(8);

  // Industry terminology & keywords
  const keywords = Array.from(new Set([...foundSkills, jobTitle, seniorityLevel, 'Agile', 'Performance Optimization', 'Scalability']));

  return {
    jobTitle,
    company,
    seniorityLevel,
    requiredSkills: finalReqSkills.length > 0 ? finalReqSkills : ['TypeScript', 'React', 'Node.js'],
    preferredSkills: finalPrefSkills,
    technicalRequirements: finalReqSkills,
    qualifications,
    experienceRequirements,
    responsibilities: [
      `Design, build, and maintain scalable features for ${jobTitle} responsibilities.`,
      'Collaborate with cross-functional teams to deliver high quality software.',
      'Ensure code reliability, performance optimization, and robust testing.'
    ],
    industryTerminology: ['Agile', 'Full-Stack', 'Cloud Infrastructure', 'Microservices', 'RESTful Architecture'],
    keywords,
    competencies: ['Problem Solving', 'Team Mentorship', 'System Architecture', 'Communication']
  };
}
