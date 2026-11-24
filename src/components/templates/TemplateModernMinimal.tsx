import React from 'react';
import { CVProfile, SectionSettings } from '@/types/cv';

interface TemplateProps {
  profile: CVProfile;
  settings: SectionSettings;
}

export const TemplateModernMinimal: React.FC<TemplateProps> = ({ profile, settings }) => {
  const { contact, professionalSummary, experiences, education, skillCategories, projects, certifications, awards, languages } = profile;
  const headings = settings.renamedHeadings || {};

  return (
    <div className="cv-document-page bg-white text-slate-800 font-sans text-[10pt] leading-relaxed p-8 w-[800px] min-h-[1050px] shadow-sm print:shadow-none print:p-0 print:w-full break-words">
      {/* Header */}
      <header className="border-b border-slate-200 pb-4 mb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1 break-words">
          {contact.fullName || 'Your Name'}
        </h1>
        {contact.professionalTitle && (
          <p className="text-[11pt] font-semibold text-slate-700 tracking-tight mb-2 break-words">
            {contact.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9pt] text-slate-600">
          {contact.email && <span className="break-all">{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedinUrl && (
            <a href={contact.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-800 hover:text-slate-950 underline break-all">
              LinkedIn
            </a>
          )}
          {contact.githubUrl && (
            <a href={contact.githubUrl} target="_blank" rel="noreferrer" className="text-slate-800 hover:text-slate-950 underline break-all">
              GitHub
            </a>
          )}
          {contact.portfolioUrl && (
            <a href={contact.portfolioUrl} target="_blank" rel="noreferrer" className="text-slate-800 hover:text-slate-950 underline break-all">
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* Sections */}
      {settings.sectionOrder.map((sectionKey) => {
        if (settings.visibleSections[sectionKey] === false) return null;

        if (sectionKey === 'summary' && professionalSummary) {
          return (
            <section key="summary" className="mb-5">
              <h2 className="text-[11pt] font-semibold tracking-wider text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                {headings.summary || 'Summary'}
              </h2>
              <p className="text-slate-700 text-[9.5pt] leading-relaxed break-words">
                {professionalSummary}
              </p>
            </section>
          );
        }

        if (sectionKey === 'experience' && experiences.length > 0) {
          return (
            <section key="experience" className="mb-5">
              <h2 className="text-[11pt] font-semibold tracking-wider text-slate-900 uppercase border-b border-slate-200 pb-1 mb-3">
                {headings.experience || 'Experience'}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-semibold text-slate-900 text-[10pt] break-words">{exp.jobTitle}</span>
                      <span className="text-[8.5pt] font-medium text-slate-500 shrink-0">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[9pt] font-medium text-slate-700 mb-1 break-words">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-[9pt] text-slate-600">
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
              <h2 className="text-[11pt] font-semibold tracking-wider text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                {headings.skills || 'Skills'}
              </h2>
              <div className="space-y-1.5 text-[9pt]">
                {skillCategories.map((cat) => (
                  <div key={cat.id} className="flex gap-2 break-words">
                    <span className="font-semibold text-slate-800 shrink-0">{cat.name}:</span>
                    <span className="text-slate-600">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'projects' && projects.length > 0) {
          return (
            <section key="projects" className="mb-5">
              <h2 className="text-[11pt] font-semibold tracking-wider text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2.5">
                {headings.projects || 'Projects'}
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline font-semibold text-slate-900 text-[9.5pt] gap-2">
                      <span className="break-words">{proj.name}</span>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" className="text-slate-800 hover:text-slate-950 underline text-[8.5pt] shrink-0 break-all font-medium">
                          View Project
                        </a>
                      )}
                    </div>
                    {proj.tools.length > 0 && (
                      <div className="text-[8.5pt] text-slate-500 mb-1 break-words">
                        Technologies: {proj.tools.join(', ')}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-[9pt] text-slate-600 mb-1 break-words">{proj.description}</p>
                    )}
                    {proj.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-slate-600">
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
            <section key="education" className="mb-5">
              <h2 className="text-[11pt] font-semibold tracking-wider text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2.5">
                {headings.education || 'Education'}
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline font-semibold text-slate-900 text-[9.5pt] gap-2">
                      <span className="break-words">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</span>
                      <span className="text-[8.5pt] font-normal text-slate-500 shrink-0">
                        {edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}
                      </span>
                    </div>
                    <div className="text-[9pt] text-slate-600 break-words">
                      {edu.institution} {edu.location && `• ${edu.location}`}
                    </div>
                    {edu.gpa && <div className="text-[8.5pt] text-slate-500">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (sectionKey === 'certifications' && certifications.length > 0) {
          return (
            <section key="certifications" className="mb-5">
              <h2 className="text-[11pt] font-semibold tracking-wider text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                {headings.certifications || 'Certifications'}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-slate-600">
                {certifications.map((c) => (
                  <li key={c.id} className="break-words">
                    <strong className="text-slate-800">{c.name}</strong> - {c.issuer} {c.date && `(${c.date})`}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'awards' && awards.length > 0) {
          return (
            <section key="awards" className="mb-5">
              <h2 className="text-[11pt] font-semibold tracking-wider text-slate-900 uppercase border-b border-slate-200 pb-1 mb-2">
                {headings.awards || 'Honors & Awards'}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[9pt] text-slate-600">
                {awards.map((a) => (
                  <li key={a.id} className="break-words">
                    <strong className="text-slate-800">{a.title}</strong> {a.issuer && `• ${a.issuer}`} {a.date && `(${a.date})`}
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (sectionKey === 'languages' && languages.length > 0) {
          return (
            <section key="languages" className="mb-5">
              <h2 className="text-[11pt] font-semibold tracking-wider text-slate-900 uppercase border-b border-slate-200 pb-1 mb-1.5">
                {headings.languages || 'Languages'}
              </h2>
              <p className="text-[9pt] text-slate-600 break-words">
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
