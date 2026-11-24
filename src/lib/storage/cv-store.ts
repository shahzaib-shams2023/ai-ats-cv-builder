import { CVDocument, CVProfile, SectionSettings, TemplateId } from '@/types/cv';

const STORAGE_KEY = 'ai_ats_cv_documents_v1';
const ACTIVE_CV_KEY = 'ai_ats_active_cv_id_v1';
const SETTINGS_KEY = 'ai_ats_user_settings_v1';

export const DEFAULT_SECTION_SETTINGS: SectionSettings = {
  sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'awards', 'languages'],
  visibleSections: {
    summary: true,
    experience: true,
    skills: true,
    projects: true,
    education: true,
    certifications: true,
    awards: true,
    languages: true
  },
  lockedSections: {
    summary: false,
    experience: false,
    skills: false,
    projects: false,
    education: false,
    certifications: false,
    awards: false,
    languages: false
  },
  renamedHeadings: {}
};

export const SAMPLE_PROFILE: CVProfile = {
  contact: {
    fullName: 'Alex Mercer',
    professionalTitle: 'Senior Full-Stack Engineer',
    email: 'alex.mercer@example.com',
    phone: '(555) 234-5678',
    location: 'San Francisco, CA',
    linkedinUrl: 'https://linkedin.com/in/alexmercer',
    githubUrl: 'https://github.com/alexmercer',
    portfolioUrl: 'https://alexmercer.dev'
  },
  professionalSummary: 'High-impact Senior Full-Stack Engineer with 7+ years of expertise architecting distributed cloud systems and intuitive web applications. Specialized in TypeScript, React, Next.js, and Node.js with a proven track record of reducing latency by 40%+ and scaling products to 500k+ active users.',
  experiences: [
    {
      id: 'exp-1',
      jobTitle: 'Lead Software Engineer',
      company: 'Acme Cloud Systems',
      location: 'San Francisco, CA',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      highlights: [
        'Architected and deployed high-throughput event processing pipelines handling 50M+ daily events with 99.99% uptime.',
        'Spearheaded transition to Next.js App Router and server components, slashing client-side bundle size by 38%.',
        'Led and mentored a high-performing squad of 8 engineers, instituting rigorous TDD standards and automated CI/CD.'
      ],
      relevantSkills: ['TypeScript', 'Next.js', 'Node.js', 'AWS', 'PostgreSQL', 'Docker']
    },
    {
      id: 'exp-2',
      jobTitle: 'Full-Stack Developer',
      company: 'Nexus Digital Labs',
      location: 'San Jose, CA',
      startDate: '2018',
      endDate: '2021',
      current: false,
      highlights: [
        'Engineered 14+ responsive enterprise web modules using React, Redux, and Tailwind CSS.',
        'Designed RESTful microservices in Node.js and PostgreSQL supporting 500,000 monthly active users.',
        'Integrated automated unit and integration test suites achieving 88% overall code coverage with Vitest and Playwright.'
      ],
      relevantSkills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Redis']
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2014',
      endDate: '2018',
      gpa: '3.8/4.0',
      highlights: ['Dean’s Honors List (all semesters)', 'Senior Capstone: Distributed Consensus Engine']
    }
  ],
  skillCategories: [
    {
      id: 'cat-1',
      name: 'Languages & Frameworks',
      skills: ['TypeScript', 'JavaScript', 'Python', 'React', 'Next.js', 'Node.js', 'Express', 'HTML5', 'Tailwind CSS']
    },
    {
      id: 'cat-2',
      name: 'Cloud & Databases',
      skills: ['AWS (ECS, Lambda, S3)', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'MongoDB']
    },
    {
      id: 'cat-3',
      name: 'Architecture & Practices',
      skills: ['Microservices', 'RESTful APIs', 'CI/CD Pipelines', 'TDD', 'Agile/Scrum', 'Git', 'System Design']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'CloudScale Telemetry Dashboard',
      role: 'Creator & Maintainer',
      tools: ['Next.js', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
      url: 'https://github.com/alexmercer/cloudscale',
      description: 'Open-source infrastructure monitoring tool with 2,500+ GitHub stars.',
      highlights: [
        'Engineered real-time server telemetry visualization with sub-second WebSocket updates.',
        'Adopted by 40+ engineering organizations for zero-latency node tracking.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      date: '2023'
    }
  ],
  awards: [
    {
      id: 'award-1',
      title: 'Top Innovation Award',
      issuer: 'Acme Hackathon',
      date: '2023',
      description: 'First place for autonomous incident resolution bot'
    }
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native' },
    { id: 'lang-2', language: 'Spanish', proficiency: 'Professional' }
  ],
  customSections: []
};

export function createDefaultCVDocument(name: string = 'Full-Stack Developer CV'): CVDocument {
  const now = new Date().toISOString();
  return {
    id: `cv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    createdAt: now,
    updatedAt: now,
    templateId: 'ats-classic',
    profile: JSON.parse(JSON.stringify(SAMPLE_PROFILE)),
    sectionSettings: JSON.parse(JSON.stringify(DEFAULT_SECTION_SETTINGS)),
    targetJob: {
      jobTitle: 'Senior Full-Stack Engineer',
      company: 'Target Company',
      rawText: ''
    },
    version: 1
  };
}

export function loadAllCVDocuments(): CVDocument[] {
  if (typeof window === 'undefined') return [createDefaultCVDocument()];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultDoc = createDefaultCVDocument();
      saveAllCVDocuments([defaultDoc]);
      return [defaultDoc];
    }
    const docs = JSON.parse(raw);
    return Array.isArray(docs) && docs.length > 0 ? docs : [createDefaultCVDocument()];
  } catch (e) {
    console.warn('Error loading CV documents from localStorage:', e);
    return [createDefaultCVDocument()];
  }
}

export function saveAllCVDocuments(docs: CVDocument[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.warn('Error saving CV documents to localStorage:', e);
  }
}

export function getActiveCVID(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_CV_KEY);
}

export function setActiveCVID(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_CV_KEY, id);
}

export interface UserSettings {
  llmProvider: 'auto' | 'gemini' | 'openai' | 'anthropic' | 'custom';
  apiKey?: string;
  customEndpoint?: string;
  modelName?: string;
}

export function loadUserSettings(): UserSettings {
  if (typeof window === 'undefined') return { llmProvider: 'auto' };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { llmProvider: 'auto' };
  } catch {
    return { llmProvider: 'auto' };
  }
}

export function saveUserSettings(settings: UserSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Error saving user settings:', e);
  }
}

