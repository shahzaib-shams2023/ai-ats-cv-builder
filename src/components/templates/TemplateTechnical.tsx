import React from 'react';
import { CVProfile, SectionSettings } from '@/types/cv';

interface TemplateProps {
  profile: CVProfile;
  settings: SectionSettings;
}

export const TemplateTechnical: React.FC<TemplateProps> = ({ profile, settings }) => {
  const { contact, professionalSummary, experiences, education, skillCategories, projects, certifications, awards, languages } = profile;
  const headings = settings.renamedHeadings || {};

  return (
    <div className="cv-document-page bg-white text-zinc-900 font-sans text-[9.5pt] leading-normal p-8 w-[800px] min-h-[1050px] mx-auto shadow-sm print:shadow-none print:p-0 print:w-full break-words">
      {/* Header */}
      <header className="border-b-2 border-emerald-600 pb-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
          <div>
            <h1 className="text-2xl font-bold font-mono text-zinc-900 tracking-tight break-words">
              {contact.fullName || 'User Name'}
            </h1>
            {contact.professionalTitle && (
              <p className="text-[10.5pt] font-medium text-emerald-700 font-mono mt-0.5 break-words">
                &gt; {contact.professionalTitle}
              </p>
            )}
          </div>
          <div className="text-[8.5pt] font-mono text-zinc-600 text-right mt-2 sm:mt-0 space-y-0.5 break-all">
            {contact.email && <div>{contact.email}</div>}
            {contact.phone && <div>{contact.phone}</div>}
            {contact.location && <div>{contact.location}</div>}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[8.5pt] font-mono text-emerald-800">
          {contact.githubUrl && (
            <a href={contact.githubUrl} target="_blank" rel="noreferrer" className="underline break-all">
              {contact.githubUrl.replace(/^https?:\/\//, '')}
            </a>
          )}
          {contact.linkedinUrl && (
            <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="underline break-all">
              {contact.linkedinUrl.replace(/^https?:\/\//, '')}
            </a>
          )}
          {contact.portfolioUrl && (
            <a href={contact.portfolioUrl} target="_blank" rel="noreferrer" className="underline break-all">
              {contact.portfolioUrl.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </header>

      {/* Sections */}
      {settings.sectionOrder.map((sectionKey) => {
        if (settings.visibleSections[sectionKey] === false) return null;

        if (sectionKey === 'summary' && professionalSummary) {
          return (
            <section key="summary" className="mb-4">
              <h2 className="text-[10pt] font-bold font-mono uppercase tracking-wider text-emerald-800 border-b border-zinc-200 pb-0.5 mb-1.5">
                // {headings.summary || 'Summary'}
              </h2>
              <p className="text-zinc-700 text-[9pt] leading-relaxed">
                {professionalSummary}
              </p>
            </section>
          );
        }

        if (sectionKey === 'skills' && skillCategories.length > 0) {
          return (
            <section key="skills" className="mb-4">
              <h2 className="text-[10pt] font-bold font-mono uppercase tracking-wider text-emerald-800 border-b border-zinc-200 pb-0.5 mb-2">
                // {headings.skills || 'Technical Stack'}
              </h2>
              <div className="space-y-1.5 text-[8.5pt]">
                {skillCategories.map((cat) => (
                  <div key={cat.id} className="flex flex-wrap items-baseline gap-1.5">
                    <span className="font-mono font-bold text-zinc-900 min-w-[120px]">{cat.name}:</span>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="bg-zinc-100 text-zinc-800 font-mono px-1.5 py-0.2 rounded border border-zinc-200 text-[8pt]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'experience' && experiences.length > 0) {
          return (
            <section key="experience" className="mb-4">
              <h2 className="text-[10pt] font-bold font-mono uppercase tracking-wider text-emerald-800 border-b border-zinc-200 pb-0.5 mb-2">
                // {headings.experience || 'Experience'}
              </h2>
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-bold text-zinc-900 text-[9.5pt] gap-2">
                      <span className="break-words">{exp.jobTitle} @ <span className="text-emerald-700">{exp.company}</span></span>
                      <span className="shrink-0 text-[8pt] font-mono text-zinc-500">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.location && <div className="text-[8pt] text-zinc-500 font-mono">{exp.location}</div>}
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[9pt] text-zinc-700">
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

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-4">
              <h2 className="text-[10pt] font-bold font-mono uppercase tracking-wider text-emerald-800 border-b border-zinc-200 pb-0.5 mb-2">
                // {headings.projects || 'Notable Projects'}
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline font-bold text-[9pt] gap-2">
                      <span className="break-words">
                        {proj.name}
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noreferrer" className="text-emerald-700 underline font-mono text-[8pt] ml-2 break-all">
                            [source/demo]
                          </a>
                        )}
                      </span>
                      {proj.tools.length > 0 && (
                        <span className="shrink-0 text-[8pt] font-mono text-zinc-500">
                          {proj.tools.join(' | ')}
                        </span>
                      )}
                    </div>
                    {proj.description && <p className="text-[8.5pt] text-zinc-600 mt-0.5 break-words">{proj.description}</p>}
                    {proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-[8.5pt] text-zinc-700">
                        {proj.highlights.map((h, i) => <li key={i} className="break-words">{h}</li>)}
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
              <h2 className="text-[10pt] font-bold font-mono uppercase tracking-wider text-emerald-800 border-b border-zinc-200 pb-0.5 mb-1.5">
                // {headings.education || 'Education'}
              </h2>
              <div className="space-y-1.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[9pt]">
                    <div className="flex justify-between font-semibold gap-2">
                      <span className="break-words">{edu.degree}{edu.fieldOfStudy ? ` (${edu.fieldOfStudy})` : ''}</span>
                      <span className="shrink-0 font-mono text-[8pt] text-zinc-500">{edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}</span>
                    </div>
                    <div className="text-zinc-600 text-[8.5pt] break-words">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certifications' && certifications.length > 0) {
          return (
            <section key="certifications" className="mb-4">
              <h2 className="text-[10pt] font-bold font-mono uppercase tracking-wider text-emerald-800 border-b border-zinc-200 pb-0.5 mb-1">
                // {headings.certifications || 'Certifications'}
              </h2>
              <ul className="list-disc list-outside ml-4 text-[8.5pt] text-zinc-700 space-y-0.5">
                {certifications.map((c) => (
                  <li key={c.id}><strong>{c.name}</strong> - {c.issuer} {c.date && `(${c.date})`}</li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'languages' && languages.length > 0) {
          return (
            <section key="languages" className="mb-4">
              <h2 className="text-[10pt] font-bold font-mono uppercase tracking-wider text-emerald-800 border-b border-zinc-200 pb-0.5 mb-1">
                // {headings.languages || 'Languages'}
              </h2>
              <p className="text-[8.5pt] font-mono text-zinc-700">{languages.map(l => `${l.language} [${l.proficiency}]`).join(', ')}</p>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};

