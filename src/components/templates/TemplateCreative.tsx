import React from 'react';
import { CVProfile, SectionSettings } from '@/types/cv';

interface TemplateProps {
  profile: CVProfile;
  settings: SectionSettings;
}

export const TemplateCreative: React.FC<TemplateProps> = ({ profile, settings }) => {
  const { contact, professionalSummary, experiences, education, skillCategories, projects, certifications, awards, languages } = profile;
  const headings = settings.renamedHeadings || {};

  return (
    <div className="cv-document-page bg-stone-50/50 text-stone-900 font-sans text-[10pt] leading-relaxed p-8 w-[800px] min-h-[1050px] mx-auto shadow-sm print:shadow-none print:p-0 print:bg-white print:w-full break-words">
      {/* Header */}
      <header className="border-b-2 border-stone-800 pb-4 mb-5">
        <h1 className="text-3xl font-light tracking-tight text-stone-900 mb-0.5 break-words">
          <span className="font-bold">{contact.fullName?.split(' ')[0]}</span>{' '}
          {contact.fullName?.split(' ').slice(1).join(' ')}
        </h1>
        {contact.professionalTitle && (
          <p className="text-[10.5pt] font-medium text-stone-600 tracking-wider uppercase mb-2 break-words">
            {contact.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[8.5pt] text-stone-600">
          {contact.email && <span className="break-all">{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.location && <span>• {contact.location}</span>}
          {contact.linkedinUrl && (
            <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="text-stone-800 underline break-all">LinkedIn</a>
          )}
          {contact.portfolioUrl && (
            <a href={contact.portfolioUrl} target="_blank" rel="noreferrer" className="text-stone-800 underline break-all">Portfolio</a>
          )}
        </div>
      </header>

      {/* Sections */}
      {settings.sectionOrder.map((sectionKey) => {
        if (settings.visibleSections[sectionKey] === false) return null;

        if (sectionKey === 'summary' && professionalSummary) {
          return (
            <section key="summary" className="mb-5">
              <h2 className="text-[10.5pt] font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2">
                {headings.summary || 'About'}
              </h2>
              <p className="text-[9.5pt] text-stone-700 leading-relaxed">
                {professionalSummary}
              </p>
            </section>
          );
        }

        if (sectionKey === 'experience' && experiences.length > 0) {
          return (
            <section key="experience" className="mb-5">
              <h2 className="text-[10.5pt] font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-3">
                {headings.experience || 'Experience'}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-semibold text-stone-900 text-[10pt] gap-2">
                      <span className="break-words">{exp.jobTitle} <span className="font-normal text-stone-600">at</span> {exp.company}</span>
                      <span className="shrink-0 text-[8.5pt] text-stone-500 font-normal">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.location && <div className="text-[8.5pt] text-stone-500 mb-1">{exp.location}</div>}
                    <ul className="list-disc list-outside ml-4 space-y-1 text-[9pt] text-stone-700">
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
            <section key="skills" className="mb-5">
              <h2 className="text-[10.5pt] font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2">
                {headings.skills || 'Capabilities'}
              </h2>
              <div className="space-y-1 text-[9pt]">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <strong className="text-stone-900">{cat.name}:</strong>{' '}
                    <span className="text-stone-700">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-5">
              <h2 className="text-[10.5pt] font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2">
                {headings.projects || 'Projects'}
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between font-semibold text-[9.5pt] gap-2">
                      <span className="break-words">{proj.name}</span>
                      {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="shrink-0 text-[8pt] text-stone-600 underline break-all">View</a>}
                    </div>
                    {proj.tools.length > 0 && <div className="text-[8pt] text-stone-500">{proj.tools.join(', ')}</div>}
                    {proj.description && <p className="text-[9pt] text-stone-700 mt-0.5 break-words">{proj.description}</p>}
                    {proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-0.5 text-[8.5pt] text-stone-700">
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
            <section key="education" className="mb-5">
              <h2 className="text-[10.5pt] font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-2">
                {headings.education || 'Education'}
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between font-semibold text-[9.5pt] gap-2">
                      <span className="break-words">{edu.degree}</span>
                      <span className="shrink-0 font-normal text-[8.5pt] text-stone-500">{edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}</span>
                    </div>
                    <div className="text-[9pt] text-stone-600 break-words">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certifications' && certifications.length > 0) {
          return (
            <section key="certifications" className="mb-5">
              <h2 className="text-[10.5pt] font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-1.5">
                {headings.certifications || 'Certifications'}
              </h2>
              <ul className="list-disc list-outside ml-4 text-[9pt] text-stone-700 space-y-0.5">
                {certifications.map((c) => (
                  <li key={c.id}><strong>{c.name}</strong> - {c.issuer}</li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'languages' && languages.length > 0) {
          return (
            <section key="languages" className="mb-5">
              <h2 className="text-[10.5pt] font-bold text-stone-900 uppercase tracking-widest border-b border-stone-300 pb-1 mb-1.5">
                {headings.languages || 'Languages'}
              </h2>
              <p className="text-[9pt] text-stone-700">{languages.map(l => `${l.language} (${l.proficiency})`).join(' • ')}</p>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};

