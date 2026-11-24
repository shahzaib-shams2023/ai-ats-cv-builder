import React from 'react';
import { CVProfile, SectionSettings } from '@/types/cv';

interface TemplateProps {
  profile: CVProfile;
  settings: SectionSettings;
}

export const TemplateProfessional: React.FC<TemplateProps> = ({ profile, settings }) => {
  const { contact, professionalSummary, experiences, education, skillCategories, projects, certifications, awards, languages } = profile;
  const headings = settings.renamedHeadings || {};

  return (
    <div className="cv-document-page bg-white text-neutral-800 font-sans text-[10pt] leading-normal p-8 w-[800px] min-h-[1050px] shadow-sm print:shadow-none print:p-0 print:w-full break-words">
      {/* Header */}
      <header className="border-b-2 border-blue-900 pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-blue-950 uppercase mb-0.5 break-words">
          {contact.fullName || 'YOUR NAME'}
        </h1>
        {contact.professionalTitle && (
          <p className="text-[11pt] font-semibold text-blue-800 tracking-wide uppercase mb-2 break-words">
            {contact.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[8.5pt] text-neutral-600">
          {contact.email && <span className="font-medium text-neutral-800 break-all">{contact.email}</span>}
          {contact.phone && <span>| {contact.phone}</span>}
          {contact.location && <span>| {contact.location}</span>}
          {contact.linkedinUrl && (
            <span>| <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-800 underline break-all">LinkedIn</a></span>
          )}
          {contact.githubUrl && (
            <span>| <a href={contact.githubUrl} target="_blank" rel="noreferrer" className="text-blue-800 underline break-all">GitHub</a></span>
          )}
          {contact.portfolioUrl && (
            <span>| <a href={contact.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-800 underline break-all">Portfolio</a></span>
          )}
        </div>
      </header>

      {/* Sections */}
      {settings.sectionOrder.map((sectionKey) => {
        if (settings.visibleSections[sectionKey] === false) return null;

        if (sectionKey === 'summary' && professionalSummary) {
          return (
            <section key="summary" className="mb-4">
              <h2 className="text-[10.5pt] font-bold text-blue-950 uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1.5">
                {headings.summary || 'Professional Summary'}
              </h2>
              <p className="text-[9.5pt] leading-relaxed text-neutral-700 break-words">
                {professionalSummary}
              </p>
            </section>
          );
        }

        if (sectionKey === 'experience' && experiences.length > 0) {
          return (
            <section key="experience" className="mb-4">
              <h2 className="text-[10.5pt] font-bold text-blue-950 uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-2">
                {headings.experience || 'Professional Experience'}
              </h2>
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-bold text-neutral-900 text-[10pt] gap-2">
                      <span className="break-words">{exp.jobTitle} - <span className="text-blue-900 font-semibold">{exp.company}</span></span>
                      <span className="text-[8.5pt] font-normal text-neutral-600 shrink-0">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="text-[8.5pt] text-neutral-500 italic mb-1">{exp.location}</div>
                    )}
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[9pt] text-neutral-700">
                      {exp.highlights.map((bullet, idx) => (
                        <li key={idx} className="leading-snug break-words">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'skills' && skillCategories.length > 0) {
          return (
            <section key="skills" className="mb-4">
              <h2 className="text-[10.5pt] font-bold text-blue-950 uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1.5">
                {headings.skills || 'Core Competencies & Skills'}
              </h2>
              <div className="space-y-1 text-[9pt]">
                {skillCategories.map((cat) => (
                  <div key={cat.id} className="break-words">
                    <strong className="text-neutral-900 font-semibold">{cat.name}:</strong>{' '}
                    <span className="text-neutral-700">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-4">
              <h2 className="text-[10.5pt] font-bold text-blue-950 uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-2">
                {headings.projects || 'Key Projects'}
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline font-bold text-[9.5pt] gap-2">
                      <span className="text-neutral-900 break-words">
                        {proj.name}
                        {proj.tools.length > 0 && (
                          <span className="text-blue-800 font-normal text-[8.5pt] ml-1">
                            [{proj.tools.join(', ')}]
                          </span>
                        )}
                      </span>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" className="text-blue-700 underline text-[8pt] shrink-0 break-all">
                          View
                        </a>
                      )}
                    </div>
                    {proj.description && <p className="text-[9pt] text-neutral-700 mt-0.5 break-words">{proj.description}</p>}
                    {proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-[9pt] text-neutral-700">
                        {proj.highlights.map((h, i) => (
                          <li key={i} className="break-words">{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'education' && education.length > 0) {
          return (
            <section key="education" className="mb-4">
              <h2 className="text-[10.5pt] font-bold text-blue-950 uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-2">
                {headings.education || 'Education'}
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline font-bold text-neutral-900 text-[9.5pt] gap-2">
                      <span className="break-words">{edu.degree}{edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}</span>
                      <span className="text-[8.5pt] font-normal text-neutral-600 shrink-0">
                        {edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}
                      </span>
                    </div>
                    <div className="text-[9pt] text-neutral-700 break-words">
                      {edu.institution} {edu.location && `| ${edu.location}`}
                    </div>
                    {edu.gpa && <div className="text-[8.5pt] text-neutral-500">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certifications' && certifications.length > 0) {
          return (
            <section key="certifications" className="mb-4">
              <h2 className="text-[10.5pt] font-bold text-blue-950 uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1.5">
                {headings.certifications || 'Certifications'}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-neutral-700">
                {certifications.map((cert) => (
                  <li key={cert.id} className="break-words">
                    <strong>{cert.name}</strong> — {cert.issuer} {cert.date && `(${cert.date})`}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'awards' && awards.length > 0) {
          return (
            <section key="awards" className="mb-4">
              <h2 className="text-[10.5pt] font-bold text-blue-950 uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1.5">
                {headings.awards || 'Awards'}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-neutral-700">
                {awards.map((a) => (
                  <li key={a.id} className="break-words">
                    <strong>{a.title}</strong> {a.issuer && `— ${a.issuer}`} {a.date && `(${a.date})`}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'languages' && languages.length > 0) {
          return (
            <section key="languages" className="mb-4">
              <h2 className="text-[10.5pt] font-bold text-blue-950 uppercase tracking-wider border-b border-neutral-300 pb-0.5 mb-1.5">
                {headings.languages || 'Languages'}
              </h2>
              <p className="text-[9pt] text-neutral-700 break-words">
                {languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}
              </p>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};
