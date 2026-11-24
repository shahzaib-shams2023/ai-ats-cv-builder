import { describe, it, expect } from 'vitest';
import { analyzeJobDescription } from '../analyze-job';
import { calculateATSScore } from '../ats-analyzer';
import { generateTailoredCV } from '../generate-cv';
import { rewriteSectionContent } from '../rewrite-section';
import { CVProfile } from '@/types/cv';

describe('AI Analysis & Generation Engine', () => {
  const sampleJobText = `
Job Title: Senior Full-Stack Engineer
Company: CloudNexus
Location: Remote (US)

About the Role:
We are looking for a Senior Full-Stack Engineer to architect, build, and scale our core SaaS platform. You will lead technical design, optimize microservices, and deliver intuitive frontend interfaces.

Requirements:
- 5+ years of experience with TypeScript, React, and Node.js
- Strong proficiency in PostgreSQL, Redis, and RESTful APIs
- Experience with AWS (ECS, Lambda, S3) and Docker containerization
- Proven track record of performance optimization and microservices architecture
- Excellent communication and mentorship skills

Preferred Qualifications:
- Experience with Next.js, GraphQL, and Kubernetes
- Familiarity with CI/CD automation using GitHub Actions
- Bachelor's degree in Computer Science or related field
`;

  const sampleProfile: CVProfile = {
    contact: {
      fullName: 'Alex Mercer',
      professionalTitle: 'Full-Stack Developer',
      email: 'alex@example.com',
      phone: '555-123-4567',
      location: 'San Francisco, CA'
    },
    professionalSummary: 'Full-Stack Developer with 6 years experience in web development using JavaScript and React.',
    experiences: [
      {
        id: 'exp-1',
        jobTitle: 'Software Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        startDate: '2020',
        endDate: 'Present',
        current: true,
        highlights: [
          'Worked on backend APIs using Node.js and PostgreSQL.',
          'Built web pages with React.',
          'Deployed services to AWS.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.S. in Computer Science',
        institution: 'UC Berkeley',
        location: 'Berkeley, CA',
        startDate: '2016',
        endDate: '2020'
      }
    ],
    skillCategories: [
      {
        id: 'cat-1',
        name: 'Technical Skills',
        skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS']
      }
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'Analytics Dashboard',
        tools: ['React', 'Node.js', 'PostgreSQL'],
        description: 'A tool for analytics.',
        highlights: ['Built user interface and endpoints.']
      }
    ],
    certifications: [],
    awards: [],
    languages: [{ id: 'lang-1', language: 'English', proficiency: 'Native' }],
    customSections: []
  };

  it('analyzes job description and extracts required skills, keywords, and seniority', async () => {
    const analysis = await analyzeJobDescription(sampleJobText);
    expect(analysis.jobTitle).toContain('Full-Stack Engineer');
    expect(analysis.seniorityLevel.toLowerCase()).toContain('senior');
    expect(analysis.requiredSkills.map(s => s.toLowerCase())).toEqual(
      expect.arrayContaining(['typescript', 'react', 'node.js', 'postgresql'])
    );
    expect(analysis.keywords.length).toBeGreaterThanOrEqual(5);
  });

  it('calculates comprehensive ATS score and detects keyword matches and gaps', () => {
    const analysis = {
      jobTitle: 'Senior Full-Stack Engineer',
      company: 'CloudNexus',
      seniorityLevel: 'Senior',
      requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
      preferredSkills: ['Next.js', 'GraphQL', 'Kubernetes'],
      technicalRequirements: ['RESTful APIs', 'Microservices'],
      qualifications: ['Bachelor degree in Computer Science'],
      experienceRequirements: ['5+ years'],
      responsibilities: ['Architect SaaS platform', 'Optimize microservices'],
      industryTerminology: ['SaaS', 'Microservices', 'Containerization'],
      keywords: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Microservices', 'RESTful APIs'],
      competencies: ['Mentorship', 'Performance Optimization']
    };

    const ats = calculateATSScore(sampleProfile, analysis);
    expect(ats.overallScore).toBeGreaterThan(40);
    expect(ats.overallScore).toBeLessThanOrEqual(100);
    expect(ats.matchedKeywords.some(m => m.keyword.toLowerCase() === 'react')).toBe(true);
    expect(ats.skillsGap.length).toBeGreaterThan(0);
    expect(ats.skillsGap.some(g => g.toLowerCase() === 'redis' || g.toLowerCase() === 'docker')).toBe(true);
  });

  it('generates tailored CV without fabricating user credentials, respecting locked sections', async () => {
    const analysis = await analyzeJobDescription(sampleJobText);
    const lockedSections = { summary: true }; // Summary is locked!

    const tailored = await generateTailoredCV(sampleProfile, analysis, lockedSections);

    // Summary must NOT change because it was locked
    expect(tailored.professionalSummary).toBe(sampleProfile.professionalSummary);

    // Work experience highlights should be strengthened and tailored
    expect(tailored.experiences[0].highlights.length).toBeGreaterThanOrEqual(sampleProfile.experiences[0].highlights.length);
    expect(tailored.experiences[0].jobTitle).toBe(sampleProfile.experiences[0].jobTitle); // No fake job title
    expect(tailored.experiences[0].company).toBe(sampleProfile.experiences[0].company); // No fake company
  });

  it('rewrites a section with specific user intent (e.g. more impactful)', async () => {
    const text = 'Worked on backend APIs using Node.js and PostgreSQL.';
    const rewritten = await rewriteSectionContent(text, 'more_impactful', 'Senior Full-Stack Engineer');
    expect(rewritten).not.toBe(text);
    expect(rewritten.length).toBeGreaterThan(15);
  });
});

