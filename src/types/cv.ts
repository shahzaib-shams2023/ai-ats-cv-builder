import { z } from 'zod';

export type TemplateId = 
  | 'ats-classic'
  | 'modern-minimal'
  | 'professional'
  | 'executive'
  | 'technical'
  | 'creative'
  | 'academic';

export interface ContactInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  additionalLinks?: Array<{ label: string; url: string }>;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
  relevantSkills?: string[];
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy?: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  tools: string[];
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Working' | 'Basic';
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  bullets?: string[];
}

export interface CustomSection {
  id: string;
  heading: string;
  items: CustomSectionItem[];
}

export interface CVProfile {
  contact: ContactInfo;
  professionalSummary: string;
  experiences: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  languages: Language[];
  customSections: CustomSection[];
}

export interface JobDescription {
  jobTitle: string;
  company: string;
  rawText: string;
  analysis?: JobAnalysis;
}

export interface JobAnalysis {
  jobTitle: string;
  company: string;
  seniorityLevel: string;
  requiredSkills: string[];
  preferredSkills: string[];
  technicalRequirements: string[];
  qualifications: string[];
  experienceRequirements: string[];
  responsibilities: string[];
  industryTerminology: string[];
  keywords: string[];
  competencies: string[];
}

export interface ATSAnalysisResult {
  overallScore: number; // 0 - 100
  breakdown: {
    keywordMatchScore: number; // 0 - 100
    skillsMatchScore: number; // 0 - 100
    experienceScore: number; // 0 - 100
    formattingScore: number; // 0 - 100
  };
  matchedKeywords: Array<{
    keyword: string;
    foundIn: string[];
    count: number;
    category?: string;
  }>;
  missingKeywords: Array<{
    keyword: string;
    importance: 'high' | 'medium' | 'low';
    reason: string;
    suggestedPlacement?: string;
  }>;
  matchedSkills: string[];
  skillsGap: string[];
  formattingWarnings: Array<{
    type: 'warning' | 'info' | 'error';
    section?: string;
    message: string;
    suggestion: string;
  }>;
  actionableSuggestions: string[];
  tailoredSummaryRecommendation?: string;
}

export interface SectionSettings {
  sectionOrder: string[]; // e.g. ['summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'awards', 'languages']
  visibleSections: Record<string, boolean>;
  lockedSections: Record<string, boolean>; // sections protected from AI overwrite
  renamedHeadings?: Record<string, string>;
}

export interface CVDocument {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  targetJob: JobDescription;
  templateId: TemplateId;
  profile: CVProfile;
  sectionSettings: SectionSettings;
  atsAnalysis?: ATSAnalysisResult;
  version: number;
}

export const ContactInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  professionalTitle: z.string().default(""),
  email: z.string().email().or(z.string().default("")),
  phone: z.string().default(""),
  secondaryPhone: z.string().optional(),
  location: z.string().default(""),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  additionalLinks: z.array(z.object({
    label: z.string(),
    url: z.string()
  })).optional()
});

export const WorkExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  highlights: z.array(z.string()).default([]),
  relevantSkills: z.array(z.string()).optional()
});

export const EducationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  gpa: z.string().optional(),
  highlights: z.array(z.string()).optional()
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  skills: z.array(z.string())
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  role: z.string().optional(),
  tools: z.array(z.string()).default([]),
  url: z.string().optional(),
  githubUrl: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().default(""),
  highlights: z.array(z.string()).default([])
});

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().default(""),
  credentialId: z.string().optional(),
  url: z.string().optional()
});

export const AwardSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Award title is required"),
  issuer: z.string().default(""),
  date: z.string().default(""),
  description: z.string().optional()
});

export const LanguageSchema = z.object({
  id: z.string(),
  language: z.string().min(1, "Language is required"),
  proficiency: z.enum(['Native', 'Fluent', 'Professional', 'Working', 'Basic']).default('Fluent')
});

export const CustomSectionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  bullets: z.array(z.string()).optional()
});

export const CustomSectionSchema = z.object({
  id: z.string(),
  heading: z.string().min(1),
  items: z.array(CustomSectionItemSchema)
});

export const CVProfileSchema = z.object({
  contact: ContactInfoSchema,
  professionalSummary: z.string().default(""),
  experiences: z.array(WorkExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skillCategories: z.array(SkillCategorySchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  awards: z.array(AwardSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  customSections: z.array(CustomSectionSchema).default([])
});

