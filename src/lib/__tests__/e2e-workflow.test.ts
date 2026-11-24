import { describe, it, expect } from 'vitest';
import { parseCVText } from '@/lib/parser/parse-cv-structure';
import { analyzeJobDescription } from '@/lib/ai/analyze-job';
import { generateTailoredCV } from '@/lib/ai/generate-cv';
import { calculateATSScore } from '@/lib/ai/ats-analyzer';
import { rewriteSectionContent } from '@/lib/ai/rewrite-section';
import { generateDocxBuffer } from '@/lib/export/export-docx';
import { generateDocBuffer } from '@/lib/export/export-doc';
import { DEFAULT_SECTION_SETTINGS } from '@/lib/storage/cv-store';

describe('Complete End-to-End User Journey', () => {
  const originalCV = `
Jordan Lee
Senior DevOps & Cloud Engineer
jordan.lee@example.com | (415) 888-9999 | Austin, TX
https://linkedin.com/in/jordanlee | https://github.com/jordanlee

SUMMARY
Senior DevOps & Cloud Engineer with 6 years experience managing multi-region AWS infrastructure, Kubernetes clusters, and automated CI/CD pipelines.

WORK EXPERIENCE
Senior Platform Engineer | CloudSphere Inc. | Austin, TX
2021 - Present
- Spearheaded Kubernetes cluster migration across 4 regions with zero unplanned downtime.
- Automated CI/CD deployments using GitHub Actions and Terraform, cutting deploy cycle time by 60%.
- Monitored infrastructure health using Prometheus, Grafana, and Datadog.

DevOps Engineer | AppStream Systems | Dallas, TX
2018 - 2021
- Maintained Docker microservices and AWS ECS deployments.
- Implemented automated database backups and disaster recovery tests for PostgreSQL.

EDUCATION
Bachelor of Science in Information Technology
Texas A&M University
2014 - 2018

TECHNICAL SKILLS
Cloud & DevOps: AWS, Kubernetes, Docker, Terraform, CI/CD, GitHub Actions, Prometheus, Grafana
Languages & Scripting: Python, Bash, Go, SQL, YAML
Databases: PostgreSQL, Redis
`;

  const targetJobDescription = `
Job Title: Staff Infrastructure Engineer
Company: DataWave Global
Location: Remote

Role Overview:
DataWave is seeking a Staff Infrastructure Engineer to lead our cloud platform modernization. You will architect global Kubernetes infrastructure on AWS, scale Terraform modules, and implement enterprise-grade observability.

Requirements:
- 5+ years of production experience with AWS, Kubernetes, and Docker
- Deep expertise in Terraform and Infrastructure as Code (IaC)
- Strong CI/CD experience with GitHub Actions or GitLab
- Experience with PostgreSQL and high-availability database architectures
- Excellent leadership, mentorship, and system architecture skills

Nice to Have:
- Proficiency in Go or Python
- Experience with Datadog and Prometheus observability
- Bachelor's degree in Computer Science or relevant STEM discipline
`;

  it('executes the full user journey from parsing to tailoring, locking, scoring, and exporting', async () => {
    // 1. User uploads CV: information extraction
    const profile = parseCVText(originalCV);
    expect(profile.contact.fullName).toBe('Jordan Lee');
    expect(profile.contact.email).toBe('jordan.lee@example.com');
    expect(profile.experiences.length).toBe(2);
    expect(profile.education.length).toBe(1);
    expect(profile.skillCategories.length).toBeGreaterThanOrEqual(1);

    // 2. User provides target job description: AI requirement analysis
    const jobAnalysis = await analyzeJobDescription(targetJobDescription);
    expect(jobAnalysis.jobTitle).toContain('Infrastructure Engineer');
    expect(jobAnalysis.requiredSkills).toEqual(
      expect.arrayContaining(['AWS', 'Kubernetes', 'Docker', 'Terraform'])
    );

    // 3. AI generates tailored CV matching the job description
    const lockedSections = { summary: false, experience: false, skills: false };
    const tailoredCV = await generateTailoredCV(profile, jobAnalysis, lockedSections);

    // Verify factual grounding: candidate's original companies & institutions are preserved
    expect(tailoredCV.experiences[0].company).toBe('CloudSphere Inc.');
    expect(tailoredCV.experiences[1].company).toBe('AppStream Systems');
    expect(tailoredCV.education[0].institution).toContain('Texas A&M');

    // Tailored summary highlights relevant experience
    expect(tailoredCV.professionalSummary.length).toBeGreaterThan(50);

    // 4. User locks the summary section and re-runs generation
    const userCustomizedSummary = 'Custom locked summary written specifically by Jordan.';
    tailoredCV.professionalSummary = userCustomizedSummary;
    const reTailored = await generateTailoredCV(tailoredCV, jobAnalysis, { summary: true });

    // Locked summary is strictly preserved
    expect(reTailored.professionalSummary).toBe(userCustomizedSummary);

    // 5. Section-level rewrite assistant
    const bullet = 'Spearheaded Kubernetes cluster migration across 4 regions with zero unplanned downtime.';
    const enhancedBullet = await rewriteSectionContent(bullet, 'more_impactful', jobAnalysis.jobTitle);
    expect(enhancedBullet).toBeDefined();
    expect(enhancedBullet.length).toBeGreaterThan(15);

    // 6. ATS Compatibility Scoring
    const ats = calculateATSScore(reTailored, jobAnalysis);
    expect(ats.overallScore).toBeGreaterThanOrEqual(60);
    expect(ats.breakdown.keywordMatchScore).toBeGreaterThanOrEqual(50);
    expect(ats.matchedKeywords.length).toBeGreaterThanOrEqual(3);
    expect(ats.matchedKeywords.some(m => m.keyword.toLowerCase() === 'kubernetes')).toBe(true);

    // 7. Multi-format export: DOCX
    const docxBuffer = await generateDocxBuffer(reTailored, DEFAULT_SECTION_SETTINGS, 'ats-classic');
    expect(docxBuffer.length).toBeGreaterThan(1000);
    expect(docxBuffer[0]).toBe(0x50); // 'P'
    expect(docxBuffer[1]).toBe(0x4B); // 'K'

    // 8. Multi-format export: DOC
    const docBuffer = await generateDocBuffer(reTailored, DEFAULT_SECTION_SETTINGS, 'ats-classic');
    expect(docBuffer.length).toBeGreaterThan(500);
    expect(docBuffer.toString('utf-8')).toContain('Jordan Lee');
    expect(docBuffer.toString('utf-8')).toContain('CloudSphere Inc.');
  });
});
