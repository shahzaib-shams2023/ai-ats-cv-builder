import { describe, it, expect } from 'vitest';
import { parseCVText } from '../parse-cv-structure';

describe('parseCVText', () => {
  const sampleCVText = `
Alex Mercer
Senior Full-Stack Engineer
alex.mercer@example.com | (555) 234-5678 | San Francisco, CA
https://linkedin.com/in/alexmercer | https://github.com/alexmercer | https://alexmercer.dev

PROFESSIONAL SUMMARY
Dynamic and results-driven Senior Full-Stack Engineer with 7+ years of experience building scalable web applications. Proficient in TypeScript, React, Node.js, and cloud architecture on AWS.

WORK EXPERIENCE
Lead Software Engineer | Acme Corporation | San Francisco, CA
March 2021 - Present
- Architected and delivered a real-time analytics pipeline processing 50M+ events daily with 99.99% uptime.
- Reduced API response latency by 42% through query optimization and Redis distributed caching.
- Mentored a team of 8 engineers and introduced automated CI/CD workflows using GitHub Actions.

Full-Stack Developer | Innovatech Solutions | San Jose, CA
June 2018 - February 2021
- Developed responsive web interfaces using React, Next.js, and Tailwind CSS.
- Built microservices in Node.js and PostgreSQL supporting 500k monthly active users.
- Implemented OAuth 2.0 authentication and role-based access control.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | Berkeley, CA
2014 - 2018
GPA: 3.8/4.0

TECHNICAL SKILLS
Languages & Frameworks: TypeScript, JavaScript, Python, React, Next.js, Node.js, Express, HTML5, CSS3
Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, Lambda, ECS), Docker, Kubernetes
Tools & Practices: Git, CI/CD, Agile/Scrum, REST APIs, GraphQL, Vitest, Jest

PROJECTS
CloudScale Dashboard | https://github.com/alexmercer/cloudscale
Creator & Lead Maintainer | 2023 - Present
- Open-source infrastructure monitoring tool with 2.5k GitHub stars.
- Implemented real-time WebSocket telemetry and dynamic SVG charting.

CERTIFICATIONS
AWS Certified Solutions Architect - Associate | Amazon Web Services (2022)
Certified Kubernetes Administrator (CKA) | Linux Foundation (2023)

LANGUAGES
English (Native), Spanish (Professional)
`;

  it('extracts contact information accurately', () => {
    const profile = parseCVText(sampleCVText);
    expect(profile.contact.fullName).toBe('Alex Mercer');
    expect(profile.contact.professionalTitle).toBe('Senior Full-Stack Engineer');
    expect(profile.contact.email).toBe('alex.mercer@example.com');
    expect(profile.contact.phone).toContain('555');
    expect(profile.contact.location).toContain('San Francisco');
    expect(profile.contact.linkedinUrl).toBe('https://linkedin.com/in/alexmercer');
    expect(profile.contact.githubUrl).toBe('https://github.com/alexmercer');
    expect(profile.contact.portfolioUrl).toBe('https://alexmercer.dev');
  });

  it('extracts professional summary correctly', () => {
    const profile = parseCVText(sampleCVText);
    expect(profile.professionalSummary).toContain('Dynamic and results-driven Senior Full-Stack Engineer');
    expect(profile.professionalSummary).toContain('7+ years');
  });

  it('extracts work experiences with roles, dates, and bullet points', () => {
    const profile = parseCVText(sampleCVText);
    expect(profile.experiences.length).toBeGreaterThanOrEqual(2);
    
    const firstExp = profile.experiences[0];
    expect(firstExp.jobTitle).toContain('Lead Software Engineer');
    expect(firstExp.company).toContain('Acme Corporation');
    expect(firstExp.highlights.length).toBeGreaterThanOrEqual(3);
    expect(firstExp.highlights[0]).toContain('50M+ events');
  });

  it('extracts education and GPA', () => {
    const profile = parseCVText(sampleCVText);
    expect(profile.education.length).toBeGreaterThanOrEqual(1);
    expect(profile.education[0].degree).toContain('Bachelor of Science');
    expect(profile.education[0].institution).toContain('University of California, Berkeley');
    expect(profile.education[0].gpa).toBe('3.8/4.0');
  });

  it('extracts and categorizes skills', () => {
    const profile = parseCVText(sampleCVText);
    expect(profile.skillCategories.length).toBeGreaterThanOrEqual(2);
    const allSkills = profile.skillCategories.flatMap(c => c.skills);
    expect(allSkills).toContain('TypeScript');
    expect(allSkills).toContain('React');
    expect(allSkills).toContain('PostgreSQL');
    expect(allSkills).toContain('AWS');
  });

  it('extracts projects and certifications', () => {
    const profile = parseCVText(sampleCVText);
    expect(profile.projects.length).toBeGreaterThanOrEqual(1);
    expect(profile.projects[0].name).toContain('CloudScale Dashboard');
    expect(profile.certifications.length).toBeGreaterThanOrEqual(1);
    expect(profile.certifications[0].name).toContain('AWS Certified Solutions Architect');
  });

  it('extracts languages', () => {
    const profile = parseCVText(sampleCVText);
    expect(profile.languages.length).toBeGreaterThanOrEqual(2);
    expect(profile.languages.some(l => l.language === 'English')).toBe(true);
  });
});

